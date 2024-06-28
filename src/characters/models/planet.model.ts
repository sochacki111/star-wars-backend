import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Planet {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;
}
