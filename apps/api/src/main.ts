import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// Загружаем .env файлы ДО инициализации NestJS
// Это критично для Prisma 7, который требует DATABASE_URL в process.env
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env.local') });
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const port = parseInt(process.env.API_PORT || '3000', 10);
  const host = process.env.API_HOST || '0.0.0.0';

  // Swagger/OpenAPI setup (только в dev режиме) - ДО app.listen() для Fastify
  const nodeEnv = process.env.NODE_ENV || 'development';
  const swaggerEnabled = nodeEnv === 'development';

  console.log(`[BOOTSTRAP] Swagger enabled: ${swaggerEnabled}`);

  if (swaggerEnabled) {
    try {
      const config = new DocumentBuilder()
        .setTitle('Tracked LMS API')
        .setDescription('Learning Management System API with Telegram Bot and Mini App integration')
        .setVersion(process.env.APP_VERSION || '1.0.0')
        .addTag('health', 'Health check endpoints')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('docs', app, document, {
        useGlobalPrefix: false,
      });

      console.log(`[BOOTSTRAP] Swagger docs: http://${host}:${port}/docs`);
    } catch (error) {
      console.error('[BOOTSTRAP] Swagger setup failed:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error && error.stack) {
        console.error('Stack:', error.stack);
      }
    }
  }

  await app.listen(port, host);
  console.log(`🚀 API server is running on http://${host}:${port}`);
}

bootstrap();
