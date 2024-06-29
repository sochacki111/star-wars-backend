import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsOptional } from 'class-validator';
import { Character } from '../models/character.model';

@ArgsType()
export class CursorPaginationArgs {
  @Field((type) => String, { nullable: true })
  @IsOptional()
  cursor?: string;

  @Field((type) => Int, { defaultValue: 10 })
  @IsInt()
  limit: number = 10;
}

@ObjectType()
export class PaginatedCharacters {
  // TODO Use Generics
  @Field((type) => [Character])
  items: Character[];

  @Field((type) => String, { nullable: true })
  nextCursor?: string;
}
