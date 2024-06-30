import { Module } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersResolver } from './characters.resolver';
import { CharactersRepository } from './repositories/implementations/characters.repository';
import { CharactersRepositorySymbol } from './repositories/characters.repository.interface';

@Module({
  providers: [
    CharactersService,
    CharactersResolver,
    CharactersRepository,
    {
      provide: CharactersRepositorySymbol,
      useClass: CharactersRepository,
    },
  ],
})
export class CharactersModule {}
