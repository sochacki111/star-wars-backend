import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateCharacterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field((type) => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  episodeIds?: number[];

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  planetId?: number;
}
