import { PrismaClient, PhotoCategory, Gender } from '@prisma/client';

const prisma = new PrismaClient();

// Test photos using Unsplash - high quality vertical portrait photos (9:16 ratio like phone photos)
const testPhotos = [
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1080&h=1920&fit=crop&crop=faces', category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },
  { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1080&h=1920&fit=crop&crop=faces', category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1080&h=1920&fit=crop&crop=faces', category: 'PROFESSIONAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1080&h=1920&fit=crop&crop=faces', category: 'PROFESSIONAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1080&h=1920&fit=crop&crop=faces', category: 'SOCIAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080&h=1920&fit=crop&crop=faces', category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1080&h=1920&fit=crop&crop=faces', category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },
  { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1080&h=1920&fit=crop&crop=faces', category: 'SOCIAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1080&h=1920&fit=crop&crop=faces', category: 'PROFESSIONAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1080&h=1920&fit=crop&crop=faces', category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
];

// Additional 50 test photos using Pexels - high quality portrait photos
// URL format optimized for portrait aspect ratio (9:16)
const pexelsUrl = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop`;

const additionalTestPhotos = [
  // Male photos - DATING category (10 photos)
  { url: pexelsUrl(220453), category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(614810), category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(937481), category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(1222271), category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(1681010), category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(2379004), category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(2340978), category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(874158), category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(941693), category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(1043471), category: 'DATING' as PhotoCategory, gender: 'MALE' as Gender },

  // Female photos - DATING category (10 photos)
  { url: pexelsUrl(1239291), category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1130626), category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(733872), category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(712513), category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1587009), category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1181686), category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1024311), category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1036623), category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1520760), category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(415829), category: 'DATING' as PhotoCategory, gender: 'FEMALE' as Gender },

  // Male photos - PROFESSIONAL category (8 photos)
  { url: pexelsUrl(2182970), category: 'PROFESSIONAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(2379005), category: 'PROFESSIONAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(1516680), category: 'PROFESSIONAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(2182969), category: 'PROFESSIONAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(3184339), category: 'PROFESSIONAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(834863), category: 'PROFESSIONAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(1121796), category: 'PROFESSIONAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(2589653), category: 'PROFESSIONAL' as PhotoCategory, gender: 'MALE' as Gender },

  // Female photos - PROFESSIONAL category (8 photos)
  { url: pexelsUrl(1181690), category: 'PROFESSIONAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1181695), category: 'PROFESSIONAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1181519), category: 'PROFESSIONAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(3756679), category: 'PROFESSIONAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1181424), category: 'PROFESSIONAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(3184405), category: 'PROFESSIONAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1181676), category: 'PROFESSIONAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(3184360), category: 'PROFESSIONAL' as PhotoCategory, gender: 'FEMALE' as Gender },

  // Male photos - SOCIAL category (7 photos)
  { url: pexelsUrl(1680172), category: 'SOCIAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(1183266), category: 'SOCIAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(1819483), category: 'SOCIAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(2406949), category: 'SOCIAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(1656684), category: 'SOCIAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(1317712), category: 'SOCIAL' as PhotoCategory, gender: 'MALE' as Gender },
  { url: pexelsUrl(2589650), category: 'SOCIAL' as PhotoCategory, gender: 'MALE' as Gender },

  // Female photos - SOCIAL category (7 photos)
  { url: pexelsUrl(1758144), category: 'SOCIAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1542085), category: 'SOCIAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1898555), category: 'SOCIAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1468379), category: 'SOCIAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1382731), category: 'SOCIAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1462637), category: 'SOCIAL' as PhotoCategory, gender: 'FEMALE' as Gender },
  { url: pexelsUrl(1382734), category: 'SOCIAL' as PhotoCategory, gender: 'FEMALE' as Gender },
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
    // Additional test users for distributing more photos
    {
      email: 'test6@vizu.local',
      name: 'Lucas Ferreira',
      gender: 'MALE' as Gender,
      karma: 40,
      credits: 5,
    },
    {
      email: 'test7@vizu.local',
      name: 'Juliana Almeida',
      gender: 'FEMALE' as Gender,
      karma: 35,
      credits: 10,
    },
    {
      email: 'test8@vizu.local',
      name: 'Rafael Lima',
      gender: 'MALE' as Gender,
      karma: 45,
      credits: 8,
    },
    {
      email: 'test9@vizu.local',
      name: 'Fernanda Souza',
      gender: 'FEMALE' as Gender,
      karma: 50,
      credits: 12,
    },
    {
      email: 'test10@vizu.local',
      name: 'Bruno Martins',
      gender: 'MALE' as Gender,
      karma: 38,
      credits: 3,
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

    // Check if photo already exists for this user with this image
    const existingPhoto = await prisma.photo.findFirst({
      where: {
        userId: user.id,
        imageUrl: photo.url,
      },
    });

    if (!existingPhoto) {
      await prisma.photo.create({
        data: {
          userId: user.id,
          imageUrl: photo.url,
          thumbnailUrl: photo.url, // randomuser.me images are already optimized
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
  // Additional Test Photos (50 more for voting flow testing)
  // =============================================
  console.log('Creating additional test photos...');

  for (let i = 0; i < additionalTestPhotos.length; i++) {
    const photo = additionalTestPhotos[i];
    const user = createdUsers[i % createdUsers.length]; // Distribute photos among users

    if (!photo || !user) continue;

    // Check if photo already exists for this user with this image
    const existingPhoto = await prisma.photo.findFirst({
      where: {
        userId: user.id,
        imageUrl: photo.url,
      },
    });

    if (!existingPhoto) {
      await prisma.photo.create({
        data: {
          userId: user.id,
          imageUrl: photo.url,
          thumbnailUrl: photo.url, // randomuser.me images are already optimized
          category: photo.category,
          status: 'APPROVED',
          testType: 'FREE',
          expiresAt: expiresAt,
          voteCount: 0,
        },
      });
      console.log(`Created additional photo for ${user.email}: ${photo.category} (${photo.gender})`);
    } else {
      console.log(`Additional photo already exists for ${user.email}`);
    }
  }

  console.log(`Total additional photos processed: ${additionalTestPhotos.length}`);

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
