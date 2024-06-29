import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional } from 'class-validator';

@ArgsType()
export class CursorPaginationArgs {
  @Field((type) => String, { nullable: true })
  @IsOptional()
  cursor?: string;

  @Field((type) => Int, { defaultValue: 10 })
  @IsInt()
  limit: number = 10;
}
