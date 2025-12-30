import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createPixCharge } from '@/lib/payments/abacate';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { packageId } = body;

    if (!packageId) {
      return NextResponse.json({ error: 'Pacote não selecionado' }, { status: 400 });
    }

    // Get package details
    const creditPackage = await prisma.creditPackage.findUnique({
      where: { id: packageId },
    });

    if (!creditPackage || !creditPackage.active) {
      return NextResponse.json({ error: 'Pacote não encontrado' }, { status: 404 });
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: 'CREDIT_PURCHASE',
        amount: creditPackage.price,
        credits: creditPackage.credits,
        status: 'PENDING',
        packageId: creditPackage.id,
      },
    });

    try {
      // Create PIX charge with Abacate Pay
      const pixCharge = await createPixCharge({
        amount: creditPackage.price,
        description: `Vizu - ${creditPackage.name} (${creditPackage.credits} créditos)`,
        externalId: transaction.id,
        expiresInSeconds: 3600, // 1 hour
        customer: {
          name: user.name || 'Usuário Vizu',
          email: user.email || '',
        },
      });

      // Update transaction with payment provider ID
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          paymentId: pixCharge.id,
          paymentMethod: 'PIX',
        },
      });

      return NextResponse.json({
        id: transaction.id,
        qrCode: pixCharge.qrCode,
        qrCodeText: pixCharge.qrCodeText,
        amount: pixCharge.amount,
        expiresAt: pixCharge.expiresAt,
      });
    } catch (paymentError) {
      // Mark transaction as failed
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED' },
      });

      console.error('Payment creation error:', paymentError);
      return NextResponse.json(
        { error: 'Erro ao gerar QR Code Pix' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Create PIX error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
