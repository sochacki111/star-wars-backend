import { ObjectType, Field } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function Paginated<ItemType>(ItemTypeClass: Type<ItemType>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedAbstractClass {
    @Field(() => [ItemTypeClass])
    items!: ItemType[];

    @Field(() => String, { nullable: true })
    nextCursor?: string;
  }

  return PaginatedAbstractClass;
}
