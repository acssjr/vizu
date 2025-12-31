import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/safe-action';
import { prisma } from '@/lib/prisma';

const MAX_KARMA = 50;
const KARMA_REGEN_AMOUNT = 5;
const KARMA_REGEN_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

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
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Calculate next regen time
    const lastRegen = user.lastKarmaRegen || new Date(0);
    const nextRegenTime = new Date(lastRegen.getTime() + KARMA_REGEN_INTERVAL_MS);
    const canRegen = Date.now() >= nextRegenTime.getTime() && user.karma < MAX_KARMA;

    return NextResponse.json({
      karma: user.karma,
      credits: user.credits,
      maxKarma: MAX_KARMA,
      lastKarmaRegen: user.lastKarmaRegen,
      nextRegenTime: canRegen ? new Date() : nextRegenTime,
      canRegen,
    });
  } catch (error) {
    console.error('Get karma error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        karma: true,
        lastKarmaRegen: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Check if regen is available
    const lastRegen = user.lastKarmaRegen || new Date(0);
    const timeSinceRegen = Date.now() - lastRegen.getTime();

    if (timeSinceRegen < KARMA_REGEN_INTERVAL_MS) {
      const waitTime = Math.ceil((KARMA_REGEN_INTERVAL_MS - timeSinceRegen) / 60000);
      return NextResponse.json(
        { error: `Aguarde ${waitTime} minutos para regenerar karma` },
        { status: 429 }
      );
    }

    if (user.karma >= MAX_KARMA) {
      return NextResponse.json({ error: 'Karma já está no máximo' }, { status: 400 });
    }

    // Calculate karma to add (don't exceed max)
    const karmaToAdd = Math.min(KARMA_REGEN_AMOUNT, MAX_KARMA - user.karma);

    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        karma: { increment: karmaToAdd },
        lastKarmaRegen: new Date(),
      },
      select: {
        karma: true,
      },
    });

    return NextResponse.json({
      success: true,
      karma: updatedUser.karma,
      karmaAdded: karmaToAdd,
      nextRegenTime: new Date(Date.now() + KARMA_REGEN_INTERVAL_MS),
    });
  } catch (error) {
    console.error('Regenerate karma error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
