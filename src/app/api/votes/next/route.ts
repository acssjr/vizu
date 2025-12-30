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

    const userId = session.user.id;

    // Get user info for filter matching (for paid tests)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        gender: true,
        birthDate: true,
      },
    });

    const userAge = user?.birthDate
      ? Math.floor((Date.now() - user.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : null;

    // Find a photo to vote on:
    // 1. Not user's own photo
    // 2. Not already voted by user
    // 3. Status is APPROVED
    // 4. Not expired
    // 5. Prioritize photos with fewer votes
    // 6. Match premium filters if applicable
    const photo = await prisma.photo.findFirst({
      where: {
        userId: { not: userId },
        status: 'APPROVED',
        expiresAt: { gt: new Date() },
        votes: {
          none: {
            voterId: userId,
          },
        },
        // Match premium filters
        OR: [
          // Free test: no filters
          { testType: 'FREE' },
          // Paid test with no gender filter
          { testType: 'PAID', targetGender: null },
          // Paid test matching user's gender
          ...(user?.gender
            ? [
                {
                  testType: 'PAID' as const,
                  targetGender: user.gender,
                },
              ]
            : []),
        ],
        // Age filter matching
        AND: [
          {
            OR: [
              { targetAgeMin: null },
              ...(userAge !== null ? [{ targetAgeMin: { lte: userAge } }] : []),
            ],
          },
          {
            OR: [
              { targetAgeMax: null },
              ...(userAge !== null ? [{ targetAgeMax: { gte: userAge } }] : []),
            ],
          },
        ],
      },
      orderBy: [
        { voteCount: 'asc' }, // Prioritize photos with fewer votes
        { createdAt: 'asc' }, // Then older photos
      ],
      select: {
        id: true,
        imageUrl: true,
        category: true,
      },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Nenhuma foto disponível' }, { status: 404 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Get next photo error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
