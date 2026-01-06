import { NextResponse } from 'next/server';

const CONTACT_EMAIL = 'contato@meuvizu.app';

interface ContactFormData {
  name: string;
  email: string;
  category: string;
  message: string;
}

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
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.category || !body.message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 }
      );
    }

    // Get category label
    const categoryLabel = categoryLabels[body.category] || body.category;

    // Build email content
    const emailSubject = `[Vizu Contato] ${categoryLabel} - ${body.name}`;
    const emailBody = `
Nova mensagem de contato do Vizu

---
Nome: ${body.name}
E-mail: ${body.email}
Assunto: ${categoryLabel}
---

Mensagem:
${body.message}

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
    //   replyTo: body.email,
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
