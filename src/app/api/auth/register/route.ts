import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
});

/**
 * Handles user registration requests and creates or updates user credentials.
 *
 * Validates the request JSON (email, password, optional name), normalizes the email, and:
 * - If a user with the email exists and already has a password, responds with an error indicating the email is registered.
 * - If a user exists without a password, sets the provided password on that user.
 * - If no user exists, creates a new user with the given data and initial karma and credits.
 *
 * @param request - Incoming HTTP request whose JSON body must contain `email` and `password`, and may include `name`.
 * @returns A NextResponse carrying JSON: on success `{ success: true }`; on client validation or conflict errors `{ error: string }` with status 400; on unexpected failures `{ error: string }` with status 500.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = schema.parse(body);

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      // If user exists with a password, they should login instead
      if (existingUser.password) {
        return NextResponse.json(
          { error: 'Este email já está cadastrado. Faça login.' },
          { status: 400 }
        );
      }

      // If user exists but has no password (e.g., OAuth user), add password
      const hashedPassword = await hash(password, 12);
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      });

      return NextResponse.json({ success: true });
    }

    // Create new user with password
    const hashedPassword = await hash(password, 12);
    await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name || null,
        karma: 50,
        credits: 0,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return NextResponse.json(
        { error: firstError?.message ?? 'Dados inválidos' },
        { status: 400 }
      );
    }
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 });
  }
}