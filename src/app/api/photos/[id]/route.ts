import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const photo = await prisma.photo.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        imageUrl: true,
        thumbnailUrl: true,
        category: true,
        status: true,
        testType: true,
        voteCount: true,
        avgAttraction: true,
        avgTrust: true,
        avgIntelligence: true,
        avgConfidence: true,
        targetGender: true,
        targetAgeMin: true,
        targetAgeMax: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 });
    }

    // Only owner can view their photo details
    if (photo.userId !== session.user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    return NextResponse.json({
      id: photo.id,
      imageUrl: photo.imageUrl,
      thumbnailUrl: photo.thumbnailUrl,
      category: photo.category,
      status: photo.status,
      testType: photo.testType,
      voteCount: photo.voteCount,
      scores: {
        attraction: photo.avgAttraction,
        trust: photo.avgTrust,
        intelligence: photo.avgIntelligence,
      },
      confidence: photo.avgConfidence || 0,
      targetGender: photo.targetGender,
      targetAgeMin: photo.targetAgeMin,
      targetAgeMax: photo.targetAgeMax,
      createdAt: photo.createdAt,
      expiresAt: photo.expiresAt,
    });
  } catch (error) {
    console.error('Get photo error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const photo = await prisma.photo.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 });
    }

    if (photo.userId !== session.user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Delete photo and associated votes
    await prisma.$transaction([
      prisma.vote.deleteMany({ where: { photoId: id } }),
      prisma.photo.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete photo error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
