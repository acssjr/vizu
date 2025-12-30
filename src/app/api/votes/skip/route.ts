import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Track skipped photos per user session (in production, use Redis)
const skippedPhotos = new Map<string, Set<string>>();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { photoId } = body;

    if (!photoId) {
      return NextResponse.json({ error: 'photoId é obrigatório' }, { status: 400 });
    }

    const userId = session.user.id;

    // Track skipped photo for this user
    if (!skippedPhotos.has(userId)) {
      skippedPhotos.set(userId, new Set());
    }
    skippedPhotos.get(userId)!.add(photoId);

    // Clean up old entries (simple cleanup, in production use TTL in Redis)
    if (skippedPhotos.get(userId)!.size > 100) {
      const entries = Array.from(skippedPhotos.get(userId)!);
      skippedPhotos.set(userId, new Set(entries.slice(-50)));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Skip photo error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
