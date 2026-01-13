import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  console.log('[BOOTSTRAP] Starting bootstrap...');
  console.log('[BOOTSTRAP] NODE_ENV from process.env:', process.env.NODE_ENV);
  
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  
  console.log('[BOOTSTRAP] App created successfully');

  console.log('[BOOTSTRAP] Enabling CORS...');
  app.enableCors({
    origin: true,
    credentials: true,
  });
  console.log('[BOOTSTRAP] CORS enabled');

  console.log('[BOOTSTRAP] Setting up global pipes...');
  try {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    console.log('[BOOTSTRAP] Global pipes configured');
  } catch (error) {
    console.error('[BOOTSTRAP] Error setting up global pipes:', error);
    throw error;
  }

  console.log('[BOOTSTRAP] Setting up global filters...');
  app.useGlobalFilters(new HttpExceptionFilter());
  console.log('[BOOTSTRAP] Global filters configured');
  
  console.log('[BOOTSTRAP] Global filters and pipes configured');

  const port = parseInt(process.env.API_PORT || '3000', 10);
  const host = process.env.API_HOST || '0.0.0.0';
  
  console.log('[BOOTSTRAP] Port and host configured:', { port, host });

  // Swagger/OpenAPI setup (только в dev режиме) - ДО app.listen() для Fastify
  const nodeEnv = process.env.NODE_ENV || 'development';
  const swaggerEnabled = nodeEnv === 'development';
  const docsPath = 'docs';

  // Детальное логирование для диагностики
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 Swagger Configuration Check:');
  console.log(`   NODE_ENV: ${nodeEnv}`);
  console.log(`   swaggerEnabled: ${swaggerEnabled}`);
  console.log(`   docsPath: ${docsPath}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (swaggerEnabled) {
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
      console.log(`[DEBUG] Setting up Swagger at /${docsPath}...`);
      SwaggerModule.setup(docsPath, app, document);

      console.log(`📚 Swagger documentation available at http://${host}:${port}/${docsPath}`);
    } catch (error) {
      console.error('❌ Swagger setup failed:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error && error.stack) {
        console.error('Stack:', error.stack);
      }
    }
  } else {
    console.log(`⚠️  Swagger disabled (NODE_ENV=${nodeEnv}, expected 'development')`);
  }

  await app.listen(port, host);
  console.log(`🚀 API server is running on http://${host}:${port}`);
}

bootstrap();
