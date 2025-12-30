import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { parseWebhookPayload, validateWebhookSignature } from '@/lib/payments/abacate';

const WEBHOOK_SECRET = process.env['ABACATE_WEBHOOK_SECRET'];

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const signature = headersList.get('x-abacate-signature') || '';
    const rawBody = await request.text();

    // Validate webhook signature in production
    if (WEBHOOK_SECRET && !validateWebhookSignature(rawBody, signature, WEBHOOK_SECRET)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = parseWebhookPayload(JSON.parse(rawBody));
    const { externalId, status, paidAt } = payload;

    // Find the transaction by external ID
    const transaction = await prisma.transaction.findUnique({
      where: { id: externalId },
      select: {
        id: true,
        userId: true,
        credits: true,
        status: true,
      },
    });

    if (!transaction) {
      console.error('Transaction not found:', externalId);
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Don't process if already completed
    if (transaction.status === 'COMPLETED') {
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    if (status === 'paid') {
      // Payment confirmed - add credits to user
      await prisma.$transaction([
        // Update transaction status
        prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'COMPLETED',
            completedAt: paidAt ? new Date(paidAt) : new Date(),
          },
        }),
        // Add credits to user
        prisma.user.update({
          where: { id: transaction.userId },
          data: {
            credits: { increment: transaction.credits },
          },
        }),
      ]);

      console.log(`Payment completed: ${transaction.id}, +${transaction.credits} credits for user ${transaction.userId}`);
    } else if (status === 'expired' || status === 'cancelled') {
      // Payment failed or expired
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
        },
      });

      console.log(`Payment ${status}: ${transaction.id}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
