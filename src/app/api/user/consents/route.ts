import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const consents = await prisma.consent.findMany({
      where: { userId: session.user.id },
      select: {
        type: true,
        accepted: true,
        acceptedAt: true,
      },
    });

    // Convert to object format
    const result = {
      termsAccepted: false,
      termsAcceptedAt: null as string | null,
      privacyAccepted: false,
      privacyAcceptedAt: null as string | null,
      marketingAccepted: false,
      marketingAcceptedAt: null as string | null,
    };

    for (const consent of consents) {
      if (consent.type === 'TERMS') {
        result.termsAccepted = consent.accepted;
        result.termsAcceptedAt = consent.acceptedAt?.toISOString() || null;
      } else if (consent.type === 'PRIVACY') {
        result.privacyAccepted = consent.accepted;
        result.privacyAcceptedAt = consent.acceptedAt?.toISOString() || null;
      } else if (consent.type === 'MARKETING') {
        result.marketingAccepted = consent.accepted;
        result.marketingAcceptedAt = consent.acceptedAt?.toISOString() || null;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get consents error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { marketing } = body;

    if (typeof marketing !== 'boolean') {
      return NextResponse.json({ error: 'Parâmetro inválido' }, { status: 400 });
    }

    // Update or create marketing consent
    await prisma.consent.upsert({
      where: {
        userId_type: {
          userId: session.user.id,
          type: 'MARKETING',
        },
      },
      update: {
        accepted: marketing,
        acceptedAt: marketing ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        type: 'MARKETING',
        accepted: marketing,
        acceptedAt: marketing ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update consents error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
