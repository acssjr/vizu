import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const requests = await prisma.dataExportRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        status: true,
        createdAt: true,
        completedAt: true,
        downloadUrl: true,
      },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Get export requests error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Check for recent pending request
    const recentRequest = await prisma.dataExportRequest.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ['PENDING', 'PROCESSING'] },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24h
      },
    });

    if (recentRequest) {
      return NextResponse.json(
        { error: 'Você já tem uma solicitação em andamento. Aguarde até 24 horas.' },
        { status: 429 }
      );
    }

    // Create export request
    const request = await prisma.dataExportRequest.create({
      data: {
        userId: session.user.id,
        status: 'PENDING',
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    // In production, this would trigger a background job to:
    // 1. Collect all user data (profile, photos, votes, transactions)
    // 2. Generate JSON/CSV file
    // 3. Upload to secure storage
    // 4. Send email with download link
    // 5. Update request status to COMPLETED

    // For now, simulate processing
    setTimeout(async () => {
      try {
        await prisma.dataExportRequest.update({
          where: { id: request.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            // downloadUrl would be set to actual file URL
          },
        });
      } catch (e) {
        console.error('Failed to update export request:', e);
      }
    }, 5000);

    return NextResponse.json({
      request,
      message: 'Solicitação criada. Você receberá um email quando a exportação estiver pronta.',
    });
  } catch (error) {
    console.error('Create export request error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
