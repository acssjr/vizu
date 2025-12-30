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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        gender: true,
        birthDate: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
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
    const { name, gender, birthDate } = body;

    // Validate birthDate (must be 18+)
    if (birthDate) {
      const birth = new Date(birthDate);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())
        ? age - 1
        : age;

      if (actualAge < 18) {
        return NextResponse.json(
          { error: 'Você precisa ter pelo menos 18 anos' },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || null,
        gender: gender || null,
        birthDate: birthDate ? new Date(birthDate) : null,
      },
      select: {
        name: true,
        email: true,
        gender: true,
        birthDate: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
