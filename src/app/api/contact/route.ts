import { NextResponse } from 'next/server';
import { z } from 'zod';

const CONTACT_EMAIL = 'contato@meuvizu.app';

const ContactFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
});

const categoryLabels: Record<string, string> = {
  technical: 'Problema técnico',
  account: 'Minha conta',
  photos: 'Minhas fotos',
  voting: 'Votação',
  credits: 'Créditos e pagamentos',
  privacy: 'Privacidade e dados (LGPD)',
  suggestion: 'Sugestão',
  other: 'Outro assunto',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate using Zod schema
    const parseResult = ContactFormSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || 'Dados inválidos';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const validatedData = parseResult.data;

    // Get category label
    const categoryLabel = categoryLabels[validatedData.category] || validatedData.category;

    // Build email content
    const emailSubject = `[Vizu Contato] ${categoryLabel} - ${validatedData.name}`;
    const emailBody = `
Nova mensagem de contato do Vizu

---
Nome: ${validatedData.name}
E-mail: ${validatedData.email}
Assunto: ${categoryLabel}
---

Mensagem:
${validatedData.message}

---
Enviado em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
    `.trim();

    // For now, log the contact (in production, integrate with email service)
    // Options: SendGrid, Resend, AWS SES, Nodemailer
    console.log('=== NOVA MENSAGEM DE CONTATO ===');
    console.log('Para:', CONTACT_EMAIL);
    console.log('Assunto:', emailSubject);
    console.log('Corpo:', emailBody);
    console.log('================================');

    // TODO: Integrate with email service
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'Vizu <noreply@meuvizu.app>',
    //   to: CONTACT_EMAIL,
    //   replyTo: validatedData.email,
    //   subject: emailSubject,
    //   text: emailBody,
    // });

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao processar contato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
