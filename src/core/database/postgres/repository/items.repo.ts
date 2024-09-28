import { Inject, Logger } from '@nestjs/common';
import {
  DataSource,
  FindOptionsOrder,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhere,
  ObjectId,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Items } from '../entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class ItemsRepository extends Repository<Items> {
  private readonly logger = new Logger('ItemsRepository');
  constructor(@Inject('DataSource') protected dataSource: DataSource) {
    super(Items, dataSource.createEntityManager());
  }

  public saveItem(data: Items) {
    try {
      return this.save(data);
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

  public fetchOne(
    select: FindOptionsSelect<Items> | FindOptionsSelectByString<Items>,
    relations: FindOptionsRelations<Items> | FindOptionsRelationByString,
    where: FindOptionsWhere<Items> | FindOptionsWhere<Items>[],
  ): Promise<Items> {
    try {
      return this.findOne({
        select,
        relations,
        where,
      });
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

  public softDeleteItem(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<Items>,
  ): Promise<UpdateResult> {
    try {
      return this.softDelete(criteria);
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

  public findAll(
    select: FindOptionsSelect<Items> | FindOptionsSelectByString<Items>,
    relations: FindOptionsRelations<Items> | FindOptionsRelationByString,
    where: FindOptionsWhere<Items>[] | FindOptionsWhere<Items>,
    order: FindOptionsOrder<Items> | undefined = undefined,
    limit: number | undefined = undefined,
    offset: number | undefined = undefined,
  ): Promise<Items[]> {
    try {
      return this.find({
        select,
        relations,
        where,
        ...(order ? { order } : {}),
        ...(limit ? { take: limit as number } : {}),
        ...(offset ? { skip: offset as number } : {}),
      });
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

  public updateItem(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<Items>,
    partialEntity: QueryDeepPartialEntity<Items>,
  ): Promise<UpdateResult> {
    try {
      return this.update(criteria, partialEntity);
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }
}
