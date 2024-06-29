import { ObjectType } from '@nestjs/graphql';
import { Character } from '../models/character.model';
import { Paginated } from 'src/common/pagination/dto/paginated.dto';

@ObjectType()
export class PaginatedCharacters extends Paginated(Character) {}
