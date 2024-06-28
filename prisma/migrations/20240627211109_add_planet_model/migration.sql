/*
  Warnings:

  - The primary key for the `Character` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `planet` on the `Character` table. All the data in the column will be lost.
  - The primary key for the `CharacterEpisode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Episode` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CharacterEpisode" DROP CONSTRAINT "CharacterEpisode_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterEpisode" DROP CONSTRAINT "CharacterEpisode_episodeId_fkey";

-- DropIndex
DROP INDEX "Character_name_key";

-- AlterTable
ALTER TABLE "Character" DROP CONSTRAINT "Character_pkey",
DROP COLUMN "planet",
ADD COLUMN     "planetId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Character_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Character_id_seq";

-- AlterTable
ALTER TABLE "CharacterEpisode" DROP CONSTRAINT "CharacterEpisode_pkey",
ALTER COLUMN "characterId" SET DATA TYPE TEXT,
ALTER COLUMN "episodeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CharacterEpisode_pkey" PRIMARY KEY ("characterId", "episodeId");

-- AlterTable
ALTER TABLE "Episode" DROP CONSTRAINT "Episode_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Episode_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Episode_id_seq";

-- CreateTable
CREATE TABLE "Planet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Planet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Planet_name_key" ON "Planet"("name");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "Planet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterEpisode" ADD CONSTRAINT "CharacterEpisode_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterEpisode" ADD CONSTRAINT "CharacterEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
