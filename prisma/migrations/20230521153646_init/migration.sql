-- CreateEnum
CREATE TYPE "ERole" AS ENUM ('ADMIN', 'BUSINESS', 'CLIENT');

-- CreateEnum
CREATE TYPE "EUserStatus" AS ENUM ('UNVERIFIED', 'VERIFIED', 'DELETED', 'PROVIDED', 'BANNED');

-- CreateEnum
CREATE TYPE "EPostStatus" AS ENUM ('FEATURED', 'NOT_FEATURED');

-- CreateEnum
CREATE TYPE "ELebanonCity" AS ENUM ('LEBANON', 'BEIRUT', 'ALEY', 'BAABDA', 'BASKINTA', 'BEIT_MERY', 'BIKFAYA', 'BSHARRI', 'CHOUF', 'DBAYEH', 'DHOUR_EL_CHOUEIR', 'JBEIL', 'JOUNIEH', 'KESERWAN', 'MATN', 'METN', 'SIN_EL_FIL', 'AKKAR', 'BATROUN', 'BCHARRE', 'KOURA', 'MINIEH_DANNIYEH', 'TRIPOLI', 'ZGHARTA', 'JEZZINE', 'NABATIYEH', 'SIDON', 'TYRE', 'BAALBEK', 'HERMEL', 'RASHAYA', 'WEST_BEKAA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "picture" TEXT,
    "role" "ERole" NOT NULL DEFAULT 'CLIENT',
    "provider" TEXT,
    "status" "EUserStatus" NOT NULL DEFAULT 'UNVERIFIED',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "status" "EPostStatus" NOT NULL DEFAULT 'NOT_FEATURED',
    "priceInDollar" INTEGER NOT NULL DEFAULT 0,
    "location" "ELebanonCity" NOT NULL DEFAULT 'LEBANON',

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Participant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_Participant_AB_unique" ON "_Participant"("A", "B");

-- CreateIndex
CREATE INDEX "_Participant_B_index" ON "_Participant"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Participant" ADD CONSTRAINT "_Participant_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Participant" ADD CONSTRAINT "_Participant_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
