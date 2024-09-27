import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule, ItemModule, MailModule } from './modules';
import { DatabaseModule } from '@core/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ItemModule,
    MailModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
