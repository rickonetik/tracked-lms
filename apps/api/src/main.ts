import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

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

  app.useGlobalFilters(new HttpExceptionFilter());

  const port = parseInt(process.env.API_PORT || '3000', 10);
  const host = process.env.API_HOST || '0.0.0.0';

  // Swagger/OpenAPI setup (только в dev режиме) - ДО app.listen() для Fastify
  const nodeEnv = process.env.NODE_ENV || 'development';
  console.log(`[DEBUG] NODE_ENV: ${nodeEnv}`);
  if (nodeEnv === 'development') {
    console.log('[DEBUG] Setting up Swagger...');
    try {
      const config = new DocumentBuilder()
        .setTitle('Tracked LMS API')
        .setDescription('Learning Management System API with Telegram Bot and Mini App integration')
        .setVersion(process.env.APP_VERSION || '1.0.0')
        .addTag('health', 'Health check endpoints')
        .build();

      console.log('[DEBUG] Creating Swagger document...');
      const document = SwaggerModule.createDocument(app, config);
      console.log('[DEBUG] Setting up Swagger at /docs...');
      SwaggerModule.setup('docs', app, document);

      console.log(`📚 Swagger documentation available at http://${host}:${port}/docs`);
    } catch (error) {
      console.error('❌ Swagger setup failed:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error && error.stack) {
        console.error('Stack:', error.stack);
      }
    }
  } else {
    console.log(`[DEBUG] Skipping Swagger setup (NODE_ENV=${nodeEnv})`);
  }

  await app.listen(port, host);
  console.log(`🚀 API server is running on http://${host}:${port}`);
}

bootstrap();
