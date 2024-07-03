import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { EpisodeSummary } from './episode.model';
import { Planet } from './planet.model';

@ObjectType({ description: 'Character from Star Wars' })
export class Character {
  @Field((type) => Int)
  id!: number;

  @Field()
  name!: string;

  @Field((type) => [EpisodeSummary])
  episodes!: EpisodeSummary[];

  @Field((type) => Planet, { nullable: true })
  planet?: Planet;
}
