import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Character } from '@prisma/client';

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Character[]> {
    return this.prisma.character.findMany({
      include: { episodes: { include: { episode: true } }, planet: true },
    });
  }

  async findOne(id: number): Promise<Character | null> {
    return this.prisma.character.findUnique({
      where: { id },
      include: { episodes: { include: { episode: true } }, planet: true },
    });
  }

  async create(data: {
    name: string;
    episodeIds: number[];
    planetId?: number;
  }): Promise<Character> {
    const { name, episodeIds, planetId } = data;

    // Check if character already exists
    const existingCharacter = await this.prisma.character.findUnique({
      where: { name },
    });

    if (existingCharacter) {
      throw new Error(`Character with name ${name} already exists.`);
    }

    // Ensure all episodes exist
    const episodes = await this.prisma.episode.findMany({
      where: { id: { in: episodeIds } },
    });

    if (episodes.length !== episodeIds.length) {
      throw new Error(`One or more episode IDs are invalid.`);
    }

    // Ensure planet exists if provided
    if (planetId) {
      const planet = await this.prisma.planet.findUnique({
        where: { id: planetId },
      });
      if (!planet) {
        throw new Error(`Planet with ID ${planetId} does not exist.`);
      }
    }

    // Create character with linked episodes and planet
    const character = await this.prisma.character.create({
      data: {
        name,
        planetId,
        episodes: {
          create: episodeIds.map((episodeId) => ({ episodeId })),
        },
      },
      include: { episodes: { include: { episode: true } }, planet: true },
    });

    return character;
  }

  async update(
    id: number,
    data: { name?: string; episodeIds?: number[]; planetId?: number },
  ): Promise<Character> {
    const { name, episodeIds, planetId } = data;

    // Check if character exists
    const existingCharacter = await this.prisma.character.findUnique({
      where: { id },
    });

    if (!existingCharacter) {
      throw new Error(`Character with ID ${id} does not exist.`);
    }

    // Ensure all episodes exist if provided
    if (episodeIds) {
      const episodes = await this.prisma.episode.findMany({
        where: { id: { in: episodeIds } },
      });

      if (episodes.length !== episodeIds.length) {
        throw new Error(`One or more episode IDs are invalid.`);
      }
    }

    // Ensure planet exists if provided
    if (planetId) {
      const planet = await this.prisma.planet.findUnique({
        where: { id: planetId },
      });
      if (!planet) {
        throw new Error(`Planet with ID ${planetId} does not exist.`);
      }
    }

    // Update character with linked episodes and planet
    const character = await this.prisma.character.update({
      where: { id },
      data: {
        name,
        planetId,
        episodes: episodeIds
          ? {
              set: episodeIds.map((episodeId) => ({
                characterId_episodeId: {
                  characterId: id,
                  episodeId: episodeId,
                },
              })),
            }
          : undefined,
      },
      include: { episodes: { include: { episode: true } }, planet: true },
    });

    return character;
  }

  async remove(id: number): Promise<Character> {
    return this.prisma.character.delete({
      where: { id },
      include: { episodes: { include: { episode: true } }, planet: true },
    });
  }
}
