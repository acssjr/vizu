import { PrismaClient, PhotoCategory, Gender } from '@prisma/client';

const prisma = new PrismaClient();

// Test photos using picsum.photos (random placeholder images)
const testPhotos = [
  { id: 1011, category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },
  { id: 1012, category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
  { id: 1027, category: 'PROFESSIONAL' as PhotoCategory, gender: 'MALE' as Gender },
  { id: 1074, category: 'PROFESSIONAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { id: 1005, category: 'SOCIAL' as PhotoCategory, gender: 'MALE' as Gender },
  { id: 1006, category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
  { id: 1025, category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },
  { id: 1062, category: 'SOCIAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { id: 1076, category: 'PROFESSIONAL' as PhotoCategory, gender: 'MALE' as Gender },
  { id: 1082, category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
];

async function main() {
  console.log('Seeding database...');

  // =============================================
  // Credit Packages
  // =============================================
  const creditPackages = [
    {
      name: 'Básico',
      credits: 5,
      price: 199, // R$1,99
      popular: false,
    },
    {
      name: 'Popular',
      credits: 15,
      price: 490, // R$4,90
      popular: true,
    },
    {
      name: 'Premium',
      credits: 35,
      price: 990, // R$9,90
      popular: false,
    },
  ];

  for (const pkg of creditPackages) {
    await prisma.creditPackage.upsert({
      where: { name: pkg.name },
      update: {
        credits: pkg.credits,
        price: pkg.price,
        popular: pkg.popular,
        active: true,
      },
      create: {
        name: pkg.name,
        credits: pkg.credits,
        price: pkg.price,
        popular: pkg.popular,
        active: true,
      },
    });
    console.log(`Created/updated package: ${pkg.name}`);
  }

  // =============================================
  // Test Users
  // =============================================
  const testUsers = [
    {
      email: 'test1@vizu.local',
      name: 'Maria Silva',
      gender: 'FEMALE' as Gender,
      karma: 50,
      credits: 10,
    },
    {
      email: 'test2@vizu.local',
      name: 'João Santos',
      gender: 'MALE' as Gender,
      karma: 50,
      credits: 5,
    },
    {
      email: 'test3@vizu.local',
      name: 'Ana Costa',
      gender: 'FEMALE' as Gender,
      karma: 30,
      credits: 0,
    },
    {
      email: 'test4@vizu.local',
      name: 'Pedro Oliveira',
      gender: 'MALE' as Gender,
      karma: 45,
      credits: 15,
    },
    {
      email: 'test5@vizu.local',
      name: 'Carla Mendes',
      gender: 'FEMALE' as Gender,
      karma: 50,
      credits: 20,
    },
  ];

  const createdUsers: { id: string; email: string }[] = [];

  for (const userData of testUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        gender: userData.gender,
        karma: userData.karma,
        credits: userData.credits,
      },
      create: {
        email: userData.email,
        name: userData.name,
        gender: userData.gender,
        karma: userData.karma,
        credits: userData.credits,
        birthDate: new Date(1990 + Math.floor(Math.random() * 15), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      },
    });
    createdUsers.push({ id: user.id, email: user.email });
    console.log(`Created/updated user: ${userData.name}`);
  }

  // =============================================
  // Test Photos (for voting)
  // =============================================
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

  for (let i = 0; i < testPhotos.length; i++) {
    const photo = testPhotos[i];
    const user = createdUsers[i % createdUsers.length]; // Distribute photos among users

    if (!photo || !user) continue;

    const imageUrl = `https://picsum.photos/id/${photo.id}/800/1000`;

    // Check if photo already exists for this user with this image
    const existingPhoto = await prisma.photo.findFirst({
      where: {
        userId: user.id,
        imageUrl: imageUrl,
      },
    });

    if (!existingPhoto) {
      await prisma.photo.create({
        data: {
          userId: user.id,
          imageUrl: imageUrl,
          thumbnailUrl: `https://picsum.photos/id/${photo.id}/200/250`,
          category: photo.category,
          status: 'APPROVED',
          testType: 'FREE',
          expiresAt: expiresAt,
          voteCount: 0,
        },
      });
      console.log(`Created photo for ${user.email}: ${photo.category}`);
    } else {
      console.log(`Photo already exists for ${user.email}`);
    }
  }

  // =============================================
  // Dev User (for credentials auth in development)
  // =============================================
  await prisma.user.upsert({
    where: { email: 'dev@vizu.local' },
    update: {
      karma: 50,
      credits: 100,
    },
    create: {
      email: 'dev@vizu.local',
      name: 'Dev User',
      karma: 50,
      credits: 100,
    },
  });
  console.log('Created/updated dev user');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
