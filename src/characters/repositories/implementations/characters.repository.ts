import { Injectable, NotFoundException } from '@nestjs/common';
import { CharactersRepositoryInterface } from '../characters.repository.interface';
import { PrismaService } from '../../../prisma/prisma.service';
import { CursorPaginationArgs } from '../../../common/pagination/dto/cursor-pagination.args';
import { PaginatedCharacters } from '../../../characters/dto/paginated-characters';
import { Character } from '../../../characters/models/character.model';
import { Prisma } from '@prisma/client';

export type PrismaTransactionalClient = Prisma.TransactionClient;

@Injectable()
export class CharactersRepository implements CharactersRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async findMany(
    paginationArgs: CursorPaginationArgs,
  ): Promise<PaginatedCharacters> {
    const { cursor, limit } = paginationArgs;
    const characters = await this.prisma.character
      .findMany({
        take: limit + 1,
        cursor: cursor ? { id: +cursor } : undefined,
        orderBy: { id: 'asc' },
        include: { episodes: { include: { episode: true } }, planet: true },
      })
      .then((chars) => chars.map((char) => this.mapCharacter(char)));

    let nextCursor;
    if (characters.length > limit) {
      const nextCharacter = characters.pop();
      if (nextCharacter) {
        nextCursor = nextCharacter.id.toString();
      }
    }

    return { items: characters, nextCursor };
  }

  async findOne(id: number): Promise<Character> {
    const character = await this.prisma.character.findUnique({
      where: { id },
      include: { episodes: { include: { episode: true } }, planet: true },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    return this.mapCharacter(character);
  }
  async create(data: {
    name: string;
    episodeIds: number[];
    planetId?: number;
  }): Promise<Character> {
    const { name, episodeIds, planetId } = data;
    const existingCharacter = await this.prisma.character.findUnique({
      where: { name },
    });

    return this.prisma.$transaction(async (prisma) => {
      if (existingCharacter) {
        throw new Error(`Character with name ${name} already exists.`);
      }

      const episodes = await prisma.episode.findMany({
        where: { id: { in: episodeIds } },
      });

      if (episodes.length !== episodeIds.length) {
        throw new Error(`One or more episode IDs are invalid.`);
      }

      if (planetId) {
        const planet = await prisma.planet.findUnique({
          where: { id: planetId },
        });
        if (!planet) {
          throw new Error(`Planet with ID ${planetId} does not exist.`);
        }
      }

      const character = await prisma.character.create({
        data: {
          name,
          planetId,
          episodes: {
            create: episodeIds.map((episodeId) => ({ episodeId })),
          },
        },
        include: { episodes: { include: { episode: true } }, planet: true },
      });

      return this.mapCharacter(character);
    });
  }

  private mapCharacter = (character): Character => ({
    ...character,
    episodes: character.episodes.map((episode) => ({
      id: episode.episode.id,
      name: episode.episode.name,
    })),
  });

  private async updateGuard(data) {
    const { id, planetId, episodeIds, prisma } = data;

    const existingCharacter = await prisma.character.findUnique({
      where: { id },
    });

    if (!existingCharacter) {
      throw new Error(`Character with ID ${id} does not exist.`);
    }

    if (episodeIds) {
      const episodes = await prisma.episode.findMany({
        where: { id: { in: episodeIds } },
      });

      if (episodes.length !== episodeIds.length) {
        throw new Error(`One or more episode IDs are invalid.`);
      }
    }

    if (planetId) {
      const planet = await prisma.planet.findUnique({
        where: { id: planetId },
      });
      if (!planet) {
        throw new Error(`Planet with ID ${planetId} does not exist.`);
      }
    }
  }

  async update(
    id: number,
    data: { name?: string; episodeIds?: number[]; planetId?: number },
  ): Promise<Character> {
    const { name, episodeIds, planetId } = data;

    return this.prisma.$transaction(async (prisma) => {
      // const existingCharacter = await prisma.character.findUnique({
      //   where: { id },
      // });

      // if (!existingCharacter) {
      //   throw new Error(`Character with ID ${id} does not exist.`);
      // }

      // if (episodeIds) {
      //   const episodes = await prisma.episode.findMany({
      //     where: { id: { in: episodeIds } },
      //   });

      //   if (episodes.length !== episodeIds.length) {
      //     throw new Error(`One or more episode IDs are invalid.`);
      //   }
      // }

      // if (planetId) {
      //   const planet = await prisma.planet.findUnique({
      //     where: { id: planetId },
      //   });
      //   if (!planet) {
      //     throw new Error(`Planet with ID ${planetId} does not exist.`);
      //   }
      // }

      await this.updateGuard({ ...data, prisma });

      const character = await prisma.character.update({
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

      return this.mapCharacter(character);
    });
  }

  async remove(id: number): Promise<Character> {
    await this.prisma.characterEpisode.deleteMany({
      where: { characterId: id },
    });

    return this.prisma.character
      .delete({
        where: { id },
        include: { episodes: { include: { episode: true } }, planet: true },
      })
      .then((char) => this.mapCharacter(char));
  }
}
