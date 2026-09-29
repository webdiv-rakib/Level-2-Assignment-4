-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'TECHNICIAN', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BANNED');

-- CreateTable
CREATE TABLE "technician_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skills" TEXT[],
    "experience" INTEGER NOT NULL,
    "bio" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "availableSlots" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technician_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "technician_profiles_userId_key" ON "technician_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "technician_profiles" ADD CONSTRAINT "technician_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
