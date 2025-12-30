import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { transactionId } = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      select: {
        id: true,
        userId: true,
        status: true,
        credits: true,
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 });
    }

    if (transaction.userId !== session.user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    return NextResponse.json({
      id: transaction.id,
      status: transaction.status === 'COMPLETED' ? 'paid' : transaction.status.toLowerCase(),
      credits: transaction.credits,
    });
  } catch (error) {
    console.error('Check payment error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
