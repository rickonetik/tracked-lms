"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    console.log('[BOOTSTRAP] Starting bootstrap...');
    console.log('[BOOTSTRAP] NODE_ENV from process.env:', process.env.NODE_ENV);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    console.log('[BOOTSTRAP] App created successfully');
    console.log('[BOOTSTRAP] Enabling CORS...');
    app.enableCors({
        origin: true,
        credentials: true,
    });
    console.log('[BOOTSTRAP] CORS enabled');
    console.log('[BOOTSTRAP] Setting up global pipes...');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    console.log('[BOOTSTRAP] Global pipes configured');
    console.log('[BOOTSTRAP] Setting up global filters...');
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
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
            const config = new swagger_1.DocumentBuilder()
                .setTitle('Tracked LMS API')
                .setDescription('Learning Management System API with Telegram Bot and Mini App integration')
                .setVersion(process.env.APP_VERSION || '1.0.0')
                .addTag('health', 'Health check endpoints')
                .build();
            console.log('[DEBUG] Creating Swagger document...');
            const document = swagger_1.SwaggerModule.createDocument(app, config);
            console.log(`[DEBUG] Setting up Swagger at /${docsPath}...`);
            swagger_1.SwaggerModule.setup(docsPath, app, document);
            console.log(`📚 Swagger documentation available at http://${host}:${port}/${docsPath}`);
        }
        catch (error) {
            console.error('❌ Swagger setup failed:', error instanceof Error ? error.message : String(error));
            if (error instanceof Error && error.stack) {
                console.error('Stack:', error.stack);
            }
        }
    }
    else {
        console.log(`⚠️  Swagger disabled (NODE_ENV=${nodeEnv}, expected 'development')`);
    }
    await app.listen(port, host);
    console.log(`🚀 API server is running on http://${host}:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map