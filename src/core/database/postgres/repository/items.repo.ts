import { Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Items } from '../entity';

export class ItemsRepository extends Repository<Items> {
  constructor(@Inject('DataSource') protected dataSource: DataSource) {
    super(Items, dataSource.createEntityManager());
  }
}
