import { Global, Module } from '@nestjs/common';
import { DbConnection, ItemsRepository, UsersRepository } from './postgres';

const PG_REPOSITORIES = [UsersRepository, ItemsRepository];

@Global()
@Module({
  providers: [...DbConnection, ...PG_REPOSITORIES],
  exports: [...DbConnection, ...PG_REPOSITORIES],
})
export class DatabaseModule {}
