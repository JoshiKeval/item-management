import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Items, Users } from './entity';

export const DbConnection = [
  {
    provide: 'DataSource',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: +configService.get('DATABASE_SYNC') === 1,
        entities: [Users, Items],
        logging: true,
        logger: configService.get('DATABASE_LOG_LEVEL'),
      });
      const db = await dataSource.initialize();
      console.log('Postgres Connected');
      return db;
    },
    inject: [ConfigService],
  },
];
