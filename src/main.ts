import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get(ConfigService);

  function enableSwagger(app) {
    const config = new DocumentBuilder()
      .setTitle('Item Manegement API Documentation')
      .setDescription('API docs')
      .setVersion('1.0')
      .addServer(configService.get('APP_URL'), 'current')
      .addBearerAuth({
        type: 'apiKey',
        scheme: 'Bearer',
        name: 'authorization',
        in: 'header',
      })
      .addTag('Item Manegement Api')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document, {
      swaggerOptions: { defaultModelsExpandDepth: -1 },
    });
  }
  enableSwagger(app);
  await app.listen(configService.get<number>('APP_PORT'));
}

bootstrap();
