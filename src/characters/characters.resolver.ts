import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CharactersService } from './characters.service';
import { CreateCharacterInput } from './dto/create-character.input';
import { UpdateCharacterInput } from './dto/update-character.input';
import { Character } from './models/character.model';
import { PaginatedCharacters } from './dto/paginated-characters';
import { CursorPaginationArgs } from 'src/common/pagination/dto/cursor-pagination.args';

@Resolver((of) => Character)
export class CharactersResolver {
  constructor(private readonly charactersService: CharactersService) {}

  @Query((returns) => PaginatedCharacters)
  characters(@Args() paginationArgs: CursorPaginationArgs) {
    return this.charactersService.findMany(paginationArgs);
  }

  @Query((returns) => Character)
  character(@Args('id', { type: () => Int }) id: number) {
    return this.charactersService.findOne(id);
  }

  @Mutation((returns) => Character)
  async createCharacter(@Args('input') input: CreateCharacterInput) {
    return this.charactersService.create(input);
  }

  @Mutation((returns) => Character)
  async updateCharacter(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateCharacterInput,
  ) {
    return this.charactersService.update(id, input);
  }

  @Mutation((returns) => Character)
  async deleteCharacter(@Args('id', { type: () => Int }) id: number) {
    return this.charactersService.remove(id);
  }
}
