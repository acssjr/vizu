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

    const packages = await prisma.creditPackage.findMany({
      where: { active: true },
      orderBy: { price: 'asc' },
      select: {
        id: true,
        name: true,
        credits: true,
        price: true,
        popular: true,
      },
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Get packages error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
