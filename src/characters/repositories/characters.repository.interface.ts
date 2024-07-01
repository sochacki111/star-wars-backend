import { CursorPaginationArgs } from '../../common/pagination/dto/cursor-pagination.args';
import { PaginatedCharacters } from '../dto/paginated-characters';
import { Character } from '../models/character.model';
import { CreateCharacterInput } from '../dto/create-character.input';
import { UpdateCharacterInput } from '../dto/update-character.input';

export interface CharactersRepositoryInterface {
  findMany(paginationArgs: CursorPaginationArgs): Promise<PaginatedCharacters>;
  findOne(id: number): Promise<Character>;
  create(input: CreateCharacterInput): Promise<Character>;
  update(id: number, input: UpdateCharacterInput): Promise<Character>;
  remove(id: number): Promise<Character>;
}

export const CharactersRepositorySymbol = Symbol(
  'CharactersRepositoryInterface',
);
