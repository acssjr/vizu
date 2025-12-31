import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/safe-action';

export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        karma: true,
        credits: true,
        lastKarmaRegen: true,
        _count: {
          select: {
            photos: true,
            votes: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      karma: user.karma,
      credits: user.credits,
      lastKarmaRegen: user.lastKarmaRegen,
      photoCount: user._count.photos,
      voteCount: user._count.votes,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
