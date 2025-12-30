import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { moderateImage } from '@/lib/rekognition';

const KARMA_COST_FREE = 10;
const CREDITS_COST_PAID = 5;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string;
    const testType = formData.get('testType') as 'FREE' | 'PAID';
    const filtersJson = formData.get('filters') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Arquivo não fornecido' }, { status: 400 });
    }

    if (!['PROFESSIONAL', 'DATING', 'SOCIAL'].includes(category)) {
      return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 });
    }

    if (!['FREE', 'PAID'].includes(testType)) {
      return NextResponse.json({ error: 'Tipo de teste inválido' }, { status: 400 });
    }

    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { karma: true, credits: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    if (testType === 'FREE' && user.karma < KARMA_COST_FREE) {
      return NextResponse.json(
        { error: `Karma insuficiente. Necessário: ${KARMA_COST_FREE}` },
        { status: 400 }
      );
    }

    if (testType === 'PAID' && user.credits < CREDITS_COST_PAID) {
      return NextResponse.json(
        { error: `Créditos insuficientes. Necessário: ${CREDITS_COST_PAID}` },
        { status: 400 }
      );
    }

    // Parse filters for paid tests
    let filters: {
      targetGender?: 'MALE' | 'FEMALE' | 'OTHER';
      targetAgeMin?: number;
      targetAgeMax?: number;
    } | null = null;

    if (testType === 'PAID' && filtersJson) {
      try {
        filters = JSON.parse(filtersJson);
      } catch {
        return NextResponse.json({ error: 'Filtros inválidos' }, { status: 400 });
      }
    }

    // Convert file to buffer for processing
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, {
      folder: `vizu/photos/${session.user.id}`,
    });

    // Run content moderation
    const moderationResult = await moderateImage(uploadResult.url);

    // Determine initial status based on moderation
    let status: 'PENDING_MODERATION' | 'APPROVED' | 'REJECTED' = 'PENDING_MODERATION';
    let moderationNotes: string | null = null;

    if (!moderationResult.isApproved) {
      if (moderationResult.flags.length > 0) {
        status = 'REJECTED';
        moderationNotes = `Conteúdo bloqueado: ${moderationResult.flags.join(', ')}`;
      }
      // If no face detected but no flags, keep as PENDING_MODERATION
    } else {
      // Auto-approve if moderation passed
      status = 'APPROVED';
    }

    // Create photo record and deduct balance in transaction
    const photo = await prisma.$transaction(async (tx) => {
      // Deduct karma or credits
      if (testType === 'FREE') {
        await tx.user.update({
          where: { id: session.user.id },
          data: { karma: { decrement: KARMA_COST_FREE } },
        });
      } else {
        await tx.user.update({
          where: { id: session.user.id },
          data: { credits: { decrement: CREDITS_COST_PAID } },
        });
      }

      // Create photo record
      return tx.photo.create({
        data: {
          userId: session.user.id,
          imageUrl: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          category: category as 'PROFESSIONAL' | 'DATING' | 'SOCIAL',
          testType,
          status,
          moderationNotes,
          targetGender: filters?.targetGender,
          targetAgeMin: filters?.targetAgeMin,
          targetAgeMax: filters?.targetAgeMax,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
    });

    return NextResponse.json({
      id: photo.id,
      status: photo.status,
      message:
        status === 'APPROVED'
          ? 'Foto aprovada e disponível para avaliação'
          : status === 'REJECTED'
            ? 'Foto rejeitada pela moderação'
            : 'Foto enviada, aguardando moderação',
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: {
      userId: string;
      status?: 'PENDING_MODERATION' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
    } = {
      userId: session.user.id,
    };

    if (status && ['PENDING_MODERATION', 'APPROVED', 'REJECTED', 'EXPIRED'].includes(status)) {
      where.status = status as typeof where.status;
    }

    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          imageUrl: true,
          thumbnailUrl: true,
          category: true,
          status: true,
          testType: true,
          voteCount: true,
          avgAttraction: true,
          avgTrust: true,
          avgIntelligence: true,
          avgConfidence: true,
          createdAt: true,
          expiresAt: true,
        },
      }),
      prisma.photo.count({ where }),
    ]);

    return NextResponse.json({
      photos: photos.map((p) => ({
        ...p,
        scores:
          p.voteCount >= 20
            ? {
                attraction: p.avgAttraction,
                trust: p.avgTrust,
                intelligence: p.avgIntelligence,
                confidence: p.avgConfidence,
              }
            : null,
      })),
      total,
      hasMore: offset + photos.length < total,
    });
  } catch (error) {
    console.error('Get photos error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
