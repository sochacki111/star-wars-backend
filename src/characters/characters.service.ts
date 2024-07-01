import { Inject, Injectable } from '@nestjs/common';
import { Character } from './models/character.model';
import { CursorPaginationArgs } from '../common/pagination/dto/cursor-pagination.args';
import {
  CharactersRepositoryInterface,
  CharactersRepositorySymbol,
} from './repositories/characters.repository.interface';

@Injectable()
export class CharactersService {
  constructor(
    @Inject(CharactersRepositorySymbol)
    private charactersRepository: CharactersRepositoryInterface,
  ) {}

  async findMany(
    paginationArgs: CursorPaginationArgs,
  ): Promise<{ items: Character[]; nextCursor?: string }> {
    return this.charactersRepository.findMany(paginationArgs);
  }

  async findOne(id: number): Promise<Character | null> {
    return this.charactersRepository.findOne(id);
  }

  async create(data: {
    name: string;
    episodeIds: number[];
    planetId?: number;
  }): Promise<Character> {
    return this.charactersRepository.create(data);
  }

  async update(id: number, data: Partial<Character>): Promise<Character> {
    return this.charactersRepository.update(id, data);
  }

  async remove(id: number): Promise<Character> {
    return this.charactersRepository.remove(id);
  }
}
