import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Character } from './character.model';

@ObjectType()
export class Episode {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field((type) => [Character])
  characters: Character[];
}
