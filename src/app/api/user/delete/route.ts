import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;

    // Create deletion request for audit trail
    await prisma.dataDeletionRequest.create({
      data: {
        userId,
        status: 'PROCESSING',
      },
    });

    // Delete user data in order (respecting foreign keys)
    await prisma.$transaction(async (tx) => {
      // 1. Delete votes (both given and received)
      await tx.vote.deleteMany({
        where: { voterId: userId },
      });

      // Delete votes on user's photos
      const userPhotos = await tx.photo.findMany({
        where: { userId },
        select: { id: true },
      });
      const photoIds = userPhotos.map((p) => p.id);

      await tx.vote.deleteMany({
        where: { photoId: { in: photoIds } },
      });

      // 2. Delete photos
      await tx.photo.deleteMany({
        where: { userId },
      });

      // 3. Delete transactions
      await tx.transaction.deleteMany({
        where: { userId },
      });

      // 4. Delete consents
      await tx.consent.deleteMany({
        where: { userId },
      });

      // 5. Delete export requests
      await tx.dataExportRequest.deleteMany({
        where: { userId },
      });

      // 6. Delete sessions and accounts (NextAuth)
      await tx.session.deleteMany({
        where: { userId },
      });

      await tx.account.deleteMany({
        where: { userId },
      });

      // 7. Update deletion request status
      await tx.dataDeletionRequest.updateMany({
        where: { userId, status: 'PROCESSING' },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      // 8. Anonymize user data instead of deleting (for referential integrity)
      await tx.user.update({
        where: { id: userId },
        data: {
          email: `deleted_${userId}@deleted.local`,
          name: 'Usuário Excluído',
          image: null,
          gender: null,
          birthDate: null,
          karma: 0,
          credits: 0,
          emailVerified: null,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Conta excluída com sucesso. Todos os seus dados foram removidos.',
    });
  } catch (error) {
    console.error('Delete account error:', error);

    // Update deletion request to failed status
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        await prisma.dataDeletionRequest.updateMany({
          where: {
            userId: session.user.id,
            status: 'PROCESSING',
          },
          data: {
            status: 'FAILED',
          },
        });
      }
    } catch {
      // Ignore error in error handler
    }

    return NextResponse.json({ error: 'Erro ao excluir conta' }, { status: 500 });
  }
}
