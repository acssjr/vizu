import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

// Webhook secret for validating requests (should be set in env)
const WEBHOOK_SECRET = process.env['MODERATION_WEBHOOK_SECRET'];

interface ModerationWebhookPayload {
  photoId: string;
  action: 'approve' | 'reject';
  reason?: string;
  moderatorId?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validate webhook secret
    const headersList = await headers();
    const authHeader = headersList.get('x-webhook-secret');

    if (WEBHOOK_SECRET && authHeader !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body: ModerationWebhookPayload = await request.json();
    const { photoId, action, reason } = body;

    if (!photoId || !action) {
      return NextResponse.json(
        { error: 'photoId e action são obrigatórios' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'action deve ser "approve" ou "reject"' },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      select: { id: true, status: true, userId: true },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 });
    }

    if (photo.status !== 'PENDING_MODERATION') {
      return NextResponse.json(
        { error: 'Foto já foi moderada' },
        { status: 400 }
      );
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id: photoId },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        moderationNotes: reason || null,
      },
    });

    // If rejected, refund the user's karma/credits
    if (action === 'reject') {
      const KARMA_COST_FREE = 10;
      const CREDITS_COST_PAID = 5;

      const photoDetails = await prisma.photo.findUnique({
        where: { id: photoId },
        select: { testType: true, userId: true },
      });

      if (photoDetails) {
        if (photoDetails.testType === 'FREE') {
          await prisma.user.update({
            where: { id: photoDetails.userId },
            data: { karma: { increment: KARMA_COST_FREE } },
          });
        } else {
          await prisma.user.update({
            where: { id: photoDetails.userId },
            data: { credits: { increment: CREDITS_COST_PAID } },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      photo: {
        id: updatedPhoto.id,
        status: updatedPhoto.status,
      },
    });
  } catch (error) {
    console.error('Moderation webhook error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
