-- CreateEnum
CREATE TYPE "ModelTrainingStatusEnum" AS ENUM ('Pending', 'Generated', 'Failed');

-- CreateEnum
CREATE TYPE "ModelTypeEnum" AS ENUM ('Man', 'Woman', 'Others');

-- CreateEnum
CREATE TYPE "EthnicityEnum" AS ENUM ('White', 'Black', 'Asian American', 'East Asian', 'South East Asian', 'South Asian', 'Middle Eastern', 'Pacific', 'Hispanic');

-- CreateEnum
CREATE TYPE "EyeColorEnum" AS ENUM ('Brown', 'Blue', 'Hazel', 'Gray');

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ModelTypeEnum" NOT NULL,
    "age" INTEGER NOT NULL,
    "ethnicity" "EthnicityEnum" NOT NULL,
    "eyeColor" "EyeColorEnum" NOT NULL,
    "bald" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "triggerWord" TEXT,
    "tensorPath" TEXT,
    "thumbnail" TEXT,
    "trainingStatus" "ModelTrainingStatusEnum" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aiRequestId" TEXT,
    "zipUrl" TEXT NOT NULL,
    "open" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Model_aiRequestId_idx" ON "Model"("aiRequestId");
