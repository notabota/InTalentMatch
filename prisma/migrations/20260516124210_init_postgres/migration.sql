-- CreateTable
CREATE TABLE "AspNetUsers" (
    "id" TEXT NOT NULL,
    "UserName" VARCHAR(256),
    "NormalizedUserName" VARCHAR(256),
    "Email" VARCHAR(256),
    "NormalizedEmail" VARCHAR(256),
    "EmailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "PasswordHash" TEXT,
    "SecurityStamp" TEXT,
    "ConcurrencyStamp" TEXT,
    "PhoneNumber" TEXT,
    "PhoneNumberConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "TwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "LockoutEnd" TIMESTAMPTZ,
    "LockoutEnabled" BOOLEAN NOT NULL DEFAULT false,
    "AccessFailedCount" INTEGER NOT NULL DEFAULT 0,
    "FullName" TEXT,
    "Address" TEXT,

    CONSTRAINT "AspNetUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "Name" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Consumers" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "AccountId" TEXT NOT NULL,
    "RequestsPosted" INTEGER NOT NULL DEFAULT 0,
    "RequestsCompleted" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Consumers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Providers" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "AccountId" TEXT NOT NULL,
    "Description" TEXT,
    "TotalRating" INTEGER NOT NULL DEFAULT 0,
    "ReviewCount" INTEGER NOT NULL DEFAULT 0,
    "IsPremium" BOOLEAN NOT NULL DEFAULT false,
    "IsSubscriptionActive" BOOLEAN NOT NULL DEFAULT false,
    "SubscriptionDate" TIMESTAMPTZ,

    CONSTRAINT "Providers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Requests" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ConsumerId" UUID NOT NULL,
    "SelectedId" UUID,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Location" TEXT NOT NULL,
    "Budget" DECIMAL NOT NULL,
    "DueDate" TIMESTAMPTZ,
    "RemoteEligible" BOOLEAN NOT NULL,
    "CompletedDate" TIMESTAMPTZ,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Offers" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ProviderId" UUID NOT NULL,
    "RequestId" UUID NOT NULL,
    "Price" DECIMAL,

    CONSTRAINT "Offers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "RequestId" UUID NOT NULL,
    "Rating" INTEGER NOT NULL,
    "Description" TEXT,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "SenderId" TEXT NOT NULL,
    "ReceiverId" TEXT NOT NULL,
    "Timestamp" TIMESTAMPTZ NOT NULL,
    "Content" TEXT NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "AccountId" TEXT NOT NULL,
    "Timestamp" TIMESTAMPTZ NOT NULL,
    "Title" TEXT NOT NULL,
    "Content" TEXT NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "PaymentMethods" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "AccountId" TEXT NOT NULL,
    "Type" VARCHAR(21) NOT NULL,
    "Number" TEXT,
    "Expiry" TEXT,
    "Name" TEXT,
    "Cvv" TEXT,

    CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "PaymentCommands" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "FromId" UUID,
    "ToId" UUID,
    "Amount" DECIMAL NOT NULL,
    "Type" TEXT NOT NULL,

    CONSTRAINT "PaymentCommands_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ProviderCategories" (
    "ProviderId" UUID NOT NULL,
    "CategoryId" UUID NOT NULL,

    CONSTRAINT "ProviderCategories_pkey" PRIMARY KEY ("ProviderId","CategoryId")
);

-- CreateTable
CREATE TABLE "RequestCategories" (
    "RequestId" UUID NOT NULL,
    "CategoryId" UUID NOT NULL,

    CONSTRAINT "RequestCategories_pkey" PRIMARY KEY ("RequestId","CategoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserNameIndex" ON "AspNetUsers"("NormalizedUserName");

-- CreateIndex
CREATE INDEX "EmailIndex" ON "AspNetUsers"("NormalizedEmail");

-- CreateIndex
CREATE INDEX "Categories_Name_idx" ON "Categories"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Consumers_AccountId_key" ON "Consumers"("AccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Providers_AccountId_key" ON "Providers"("AccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_RequestId_key" ON "Reviews"("RequestId");

-- CreateIndex
CREATE INDEX "Messages_SenderId_ReceiverId_idx" ON "Messages"("SenderId", "ReceiverId");

-- AddForeignKey
ALTER TABLE "Consumers" ADD CONSTRAINT "Consumers_AccountId_fkey" FOREIGN KEY ("AccountId") REFERENCES "AspNetUsers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Providers" ADD CONSTRAINT "Providers_AccountId_fkey" FOREIGN KEY ("AccountId") REFERENCES "AspNetUsers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_ConsumerId_fkey" FOREIGN KEY ("ConsumerId") REFERENCES "Consumers"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_SelectedId_fkey" FOREIGN KEY ("SelectedId") REFERENCES "Offers"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_ProviderId_fkey" FOREIGN KEY ("ProviderId") REFERENCES "Providers"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_RequestId_fkey" FOREIGN KEY ("RequestId") REFERENCES "Requests"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_RequestId_fkey" FOREIGN KEY ("RequestId") REFERENCES "Requests"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_SenderId_fkey" FOREIGN KEY ("SenderId") REFERENCES "AspNetUsers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_ReceiverId_fkey" FOREIGN KEY ("ReceiverId") REFERENCES "AspNetUsers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_AccountId_fkey" FOREIGN KEY ("AccountId") REFERENCES "AspNetUsers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethods" ADD CONSTRAINT "PaymentMethods_AccountId_fkey" FOREIGN KEY ("AccountId") REFERENCES "AspNetUsers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentCommands" ADD CONSTRAINT "PaymentCommands_FromId_fkey" FOREIGN KEY ("FromId") REFERENCES "PaymentMethods"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentCommands" ADD CONSTRAINT "PaymentCommands_ToId_fkey" FOREIGN KEY ("ToId") REFERENCES "PaymentMethods"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCategories" ADD CONSTRAINT "ProviderCategories_ProviderId_fkey" FOREIGN KEY ("ProviderId") REFERENCES "Providers"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCategories" ADD CONSTRAINT "ProviderCategories_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Categories"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestCategories" ADD CONSTRAINT "RequestCategories_RequestId_fkey" FOREIGN KEY ("RequestId") REFERENCES "Requests"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestCategories" ADD CONSTRAINT "RequestCategories_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Categories"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
