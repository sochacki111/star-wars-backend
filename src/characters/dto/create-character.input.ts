import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsArray, IsInt } from 'class-validator';

@InputType()
export class CreateCharacterInput {
  @Field()
  @IsString()
  name!: string;

  @Field((type) => [Int])
  @IsArray()
  @IsInt({ each: true })
  episodeIds!: number[];

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  planetId?: number;
}
