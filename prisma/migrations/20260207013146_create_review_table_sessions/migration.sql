/*
  Warnings:

  - Added the required column `updateAt` to the `tbl_user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatusEnum" AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT', 'BLOCKED');

-- CreateEnum
CREATE TYPE "AuthProviderEnum" AS ENUM ('LOCAL', 'GOOGLE', 'FACEBOOK', 'OTHER');

-- AlterTable
ALTER TABLE "tbl_user" ADD COLUMN     "authProvider" "AuthProviderEnum" NOT NULL DEFAULT 'LOCAL',
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "backupEmail" TEXT,
ADD COLUMN     "backupEmailConfirm" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "country" TEXT DEFAULT 'CO',
ADD COLUMN     "emailConfirm" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "language" TEXT DEFAULT 'es-Es',
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "phoneConfirm" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "UserStatusEnum" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "twoFactorEnable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_userAgent_idx" ON "Session"("userAgent");

-- CreateIndex
CREATE INDEX "Session_ipAddress_idx" ON "Session"("ipAddress");

-- CreateIndex
CREATE INDEX "tbl_user_email_idx" ON "tbl_user"("email");

-- CreateIndex
CREATE INDEX "tbl_user_created_at_idx" ON "tbl_user"("created_at");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
