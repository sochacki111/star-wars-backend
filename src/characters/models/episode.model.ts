import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class EpisodeSummary {
  @Field((type) => Int)
  id!: number;

  @Field()
  name!: string;
}
