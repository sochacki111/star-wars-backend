/*
  Warnings:

  - The primary key for the `Character` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Character` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `planetId` column on the `Character` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CharacterEpisode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Episode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Episode` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Planet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Planet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `characterId` on the `CharacterEpisode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `episodeId` on the `CharacterEpisode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_planetId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterEpisode" DROP CONSTRAINT "CharacterEpisode_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterEpisode" DROP CONSTRAINT "CharacterEpisode_episodeId_fkey";

-- AlterTable
ALTER TABLE "Character" DROP CONSTRAINT "Character_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "planetId",
ADD COLUMN     "planetId" INTEGER,
ADD CONSTRAINT "Character_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CharacterEpisode" DROP CONSTRAINT "CharacterEpisode_pkey",
DROP COLUMN "characterId",
ADD COLUMN     "characterId" INTEGER NOT NULL,
DROP COLUMN "episodeId",
ADD COLUMN     "episodeId" INTEGER NOT NULL,
ADD CONSTRAINT "CharacterEpisode_pkey" PRIMARY KEY ("characterId", "episodeId");

-- AlterTable
ALTER TABLE "Episode" DROP CONSTRAINT "Episode_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Episode_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Planet" DROP CONSTRAINT "Planet_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Planet_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "Planet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterEpisode" ADD CONSTRAINT "CharacterEpisode_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterEpisode" ADD CONSTRAINT "CharacterEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
