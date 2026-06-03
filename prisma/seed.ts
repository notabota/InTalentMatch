import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = "password123";

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);
  const securityStamp = () => randomUUID();
  await prisma.review.deleteMany();
  await prisma.requestCategory.deleteMany();
  await prisma.providerCategory.deleteMany();
  await prisma.paymentCommand.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.request.update({
    where: { id: "00000000-0000-0000-0000-000000000000" },
    data: { selectedId: null },
  }).catch(() => {});
  await prisma.offer.deleteMany();
  await prisma.request.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.consumer.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();

  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        id: randomUUID(),
        userName: "alice@example.com",
        normalizedUserName: "ALICE@EXAMPLE.COM",
        email: "alice@example.com",
        normalizedEmail: "ALICE@EXAMPLE.COM",
        passwordHash,
        securityStamp: securityStamp(),
        emailConfirmed: true,
        fullName: "Alice Consumer",
        phoneNumber: "+61 400 000 001",
        address: "1 Test St, Sydney NSW",
      },
    }),
    prisma.account.create({
      data: {
        id: randomUUID(),
        userName: "bob@example.com",
        normalizedUserName: "BOB@EXAMPLE.COM",
        email: "bob@example.com",
        normalizedEmail: "BOB@EXAMPLE.COM",
        passwordHash,
        securityStamp: securityStamp(),
        emailConfirmed: true,
        fullName: "Bob Provider",
        phoneNumber: "+61 400 000 002",
        address: "2 Test St, Melbourne VIC",
      },
    }),
    prisma.account.create({
      data: {
        id: randomUUID(),
        userName: "carol@example.com",
        normalizedUserName: "CAROL@EXAMPLE.COM",
        email: "carol@example.com",
        normalizedEmail: "CAROL@EXAMPLE.COM",
        passwordHash,
        securityStamp: securityStamp(),
        emailConfirmed: true,
        fullName: "Carol Both",
        phoneNumber: "+61 400 000 003",
        address: "3 Test St, Brisbane QLD",
      },
    }),
  ]);
  const [alice, bob, carol] = accounts;

  const categoryNames = [
    "Software & IT",
    "Business & Finance",
    "Healthcare",
    "Education",
    "Engineering",
    "Design & Creative",
    "Construction",
    "Administration",
  ];
  await prisma.category.createMany({
    data: categoryNames.map((name) => ({ name })),
  });
  const categories = await prisma.category.findMany();
  const byName = new Map(categories.map((c) => [c.name, c]));

  const aliceConsumer = await prisma.consumer.create({
    data: { accountId: alice.id, requestsPosted: 0, requestsCompleted: 0 },
  });
  const carolConsumer = await prisma.consumer.create({
    data: { accountId: carol.id, requestsPosted: 0, requestsCompleted: 0 },
  });

  const bobProvider = await prisma.provider.create({
    data: {
      accountId: bob.id,
      description: "Full-stack engineer. React, Node, and cloud. Fast turnaround.",
      totalRating: 9,
      reviewCount: 2,
      isPremium: true,
      isSubscriptionActive: true,
      subscriptionDate: new Date(),
    },
  });
  const carolProvider = await prisma.provider.create({
    data: {
      accountId: carol.id,
      description: "Brand and UI/UX designer for startups and small business.",
      totalRating: 0,
      reviewCount: 0,
      isPremium: false,
      isSubscriptionActive: false,
    },
  });

  await prisma.providerCategory.createMany({
    data: [
      { providerId: bobProvider.id, categoryId: byName.get("Software & IT")!.id },
      { providerId: bobProvider.id, categoryId: byName.get("Engineering")!.id },
      { providerId: carolProvider.id, categoryId: byName.get("Design & Creative")!.id },
    ],
  });

  await prisma.paymentMethod.createMany({
    data: [
      {
        id: randomUUID(),
        accountId: alice.id,
        type: "CardPaymentMethod",
        number: "4242 4242 4242 4242",
        expiry: "12/30",
        name: "Alice Consumer",
        cvv: "123",
      },
      {
        id: randomUUID(),
        accountId: bob.id,
        type: "CardPaymentMethod",
        number: "5555 5555 5555 4444",
        expiry: "11/29",
        name: "Bob Provider",
        cvv: "456",
      },
      {
        id: randomUUID(),
        accountId: carol.id,
        type: "CardPaymentMethod",
        number: "4111 1111 1111 1111",
        expiry: "10/28",
        name: "Carol Both",
        cvv: "789",
      },
    ],
  });

  const request1 = await prisma.request.create({
    data: {
      consumerId: aliceConsumer.id,
      title: "Build a React landing page",
      description: "Need a responsive marketing landing page built and deployed this week.",
      location: "Sydney NSW",
      budget: 250,
      dueDate: new Date(Date.now() + 7 * 86_400_000),
      remoteEligible: true,
    },
  });
  await prisma.requestCategory.create({
    data: { requestId: request1.id, categoryId: byName.get("Software & IT")!.id },
  });
  await prisma.consumer.update({
    where: { id: aliceConsumer.id },
    data: { requestsPosted: 1 },
  });

  const offer1 = await prisma.offer.create({
    data: {
      providerId: bobProvider.id,
      requestId: request1.id,
      price: 220,
    },
  });

  const request2 = await prisma.request.create({
    data: {
      consumerId: carolConsumer.id,
      title: "Design a brand logo",
      description: "Logo and brand colour palette for a new cafe.",
      location: "Brisbane QLD",
      budget: 80,
      dueDate: new Date(Date.now() + 3 * 86_400_000),
      remoteEligible: true,
    },
  });
  await prisma.requestCategory.create({
    data: { requestId: request2.id, categoryId: byName.get("Design & Creative")!.id },
  });
  await prisma.consumer.update({
    where: { id: carolConsumer.id },
    data: { requestsPosted: 1 },
  });

  const completedRequest = await prisma.request.create({
    data: {
      consumerId: aliceConsumer.id,
      title: "Set up bookkeeping spreadsheet",
      description: "Quarterly bookkeeping template with expense and invoice tracking.",
      location: "Sydney NSW",
      budget: 200,
      remoteEligible: true,
      completedDate: new Date(Date.now() - 2 * 86_400_000),
    },
  });
  const completedOffer = await prisma.offer.create({
    data: {
      providerId: bobProvider.id,
      requestId: completedRequest.id,
      price: 180,
    },
  });
  await prisma.request.update({
    where: { id: completedRequest.id },
    data: { selectedId: completedOffer.id },
  });
  await prisma.requestCategory.create({
    data: { requestId: completedRequest.id, categoryId: byName.get("Business & Finance")!.id },
  });
  await prisma.consumer.update({
    where: { id: aliceConsumer.id },
    data: { requestsPosted: 2, requestsCompleted: 1 },
  });
  await prisma.review.create({
    data: {
      requestId: completedRequest.id,
      rating: 5,
      description: "Spotless work, on time, would hire again.",
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        accountId: alice.id,
        timestamp: new Date(Date.now() - 86_400_000),
        title: "Jobs",
        content: `"${completedRequest.title}" has been completed.`,
      },
      {
        accountId: bob.id,
        timestamp: new Date(Date.now() - 86_400_000),
        title: "Jobs",
        content: `"${completedRequest.title}" has been completed.`,
      },
    ],
  });

  await prisma.message.createMany({
    data: [
      {
        senderId: alice.id,
        receiverId: bob.id,
        timestamp: new Date(Date.now() - 3600_000),
        content: "Hi Bob, can you start the landing page this week?",
      },
      {
        senderId: bob.id,
        receiverId: alice.id,
        timestamp: new Date(Date.now() - 3500_000),
        content: "Yes, I can have a first draft ready by Friday.",
      },
    ],
  });

  console.log(`Seed complete. All accounts share password: ${DEFAULT_PASSWORD}`);
  for (const a of accounts) {
    console.log(`  ${a.email}  ${a.id}`);
  }
  console.log(`Open requests: ${request1.id}, ${request2.id}`);
  console.log(`Completed request: ${completedRequest.id}`);
  console.log(`Offer on request1: ${offer1.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
