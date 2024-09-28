import { Global, Module } from '@nestjs/common';
import { DbConnection, ItemsRepository, UsersRepository } from './postgres';
import { S3Service } from '@core/aws';

const PG_REPOSITORIES = [UsersRepository, ItemsRepository];

@Global()
@Module({
  providers: [...DbConnection, ...PG_REPOSITORIES, S3Service],
  exports: [...DbConnection, ...PG_REPOSITORIES, S3Service],
})
export class DatabaseModule {}
