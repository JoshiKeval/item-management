import { Inject, Logger } from '@nestjs/common';
import {
  DataSource,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Users } from '../entity';

export class UsersRepository extends Repository<Users> {
  private readonly logger = new Logger('UsersRepository');
  constructor(@Inject('DataSource') protected dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  public saveUser(data: Users) {
    try {
      return this.save(data);
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

  public fetchOne(
    select: FindOptionsSelect<Users> | FindOptionsSelectByString<Users>,
    relations: FindOptionsRelations<Users> | FindOptionsRelationByString,
    where: FindOptionsWhere<Users> | FindOptionsWhere<Users>[],
  ): Promise<Users> {
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
}
