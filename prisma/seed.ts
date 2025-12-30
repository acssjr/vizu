import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Credit packages (prices in centavos)
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
      where: {
        name: pkg.name,
      },
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
