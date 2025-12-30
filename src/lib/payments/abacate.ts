/**
 * Abacate Pay Integration
 * Pix payment gateway for Brazilian market
 */

import crypto from 'crypto';

const ABACATE_API_URL = process.env['ABACATE_API_URL'] || 'https://api.abacatepay.com/v1';
const ABACATE_API_KEY = process.env['ABACATE_API_KEY'];

export interface PixChargeRequest {
  amount: number; // In centavos (R$1.99 = 199)
  description: string;
  externalId: string; // Our transaction ID
  expiresInSeconds?: number;
  customer?: {
    name: string;
    email: string;
    document?: string; // CPF
  };
}

export interface PixChargeResponse {
  id: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  amount: number;
  qrCode: string; // Base64 QR Code image
  qrCodeText: string; // PIX copy-paste code
  expiresAt: string;
  externalId: string;
}

export interface WebhookPayload {
  id: string;
  externalId: string;
  status: 'paid' | 'expired' | 'cancelled';
  amount: number;
  paidAt?: string;
}

export async function createPixCharge(data: PixChargeRequest): Promise<PixChargeResponse> {
  if (!ABACATE_API_KEY) {
    throw new Error('ABACATE_API_KEY not configured');
  }

  const response = await fetch(`${ABACATE_API_URL}/pix/charge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ABACATE_API_KEY}`,
    },
    body: JSON.stringify({
      amount: data.amount,
      description: data.description,
      external_id: data.externalId,
      expires_in_seconds: data.expiresInSeconds || 3600, // 1 hour default
      customer: data.customer ? {
        name: data.customer.name,
        email: data.customer.email,
        document: data.customer.document,
      } : undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Abacate API error: ${response.status}`);
  }

  const result = await response.json();

  return {
    id: result.id,
    status: result.status,
    amount: result.amount,
    qrCode: result.qr_code,
    qrCodeText: result.qr_code_text,
    expiresAt: result.expires_at,
    externalId: result.external_id,
  };
}

export async function getPixCharge(chargeId: string): Promise<PixChargeResponse> {
  if (!ABACATE_API_KEY) {
    throw new Error('ABACATE_API_KEY not configured');
  }

  const response = await fetch(`${ABACATE_API_URL}/pix/charge/${chargeId}`, {
    headers: {
      'Authorization': `Bearer ${ABACATE_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Abacate API error: ${response.status}`);
  }

  const result = await response.json();

  return {
    id: result.id,
    status: result.status,
    amount: result.amount,
    qrCode: result.qr_code,
    qrCodeText: result.qr_code_text,
    expiresAt: result.expires_at,
    externalId: result.external_id,
  };
}

export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // In production, implement HMAC validation
  // For now, basic check
  if (!signature || !secret) return false;

  // Use crypto to validate HMAC-SHA256
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export function parseWebhookPayload(body: unknown): WebhookPayload {
  const data = body as Record<string, unknown>;

  return {
    id: data['id'] as string,
    externalId: data['external_id'] as string,
    status: data['status'] as 'paid' | 'expired' | 'cancelled',
    amount: data['amount'] as number,
    paidAt: data['paid_at'] as string | undefined,
  };
}
