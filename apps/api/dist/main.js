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
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const port = parseInt(process.env.API_PORT || '3000', 10);
    const host = process.env.API_HOST || '0.0.0.0';
    // Swagger/OpenAPI setup (только в dev режиме) - ДО app.listen() для Fastify
    const nodeEnv = process.env.NODE_ENV || 'development';
    console.log(`[DEBUG] NODE_ENV: ${nodeEnv}`);
    if (nodeEnv === 'development') {
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
            console.log('[DEBUG] Setting up Swagger at /docs...');
            swagger_1.SwaggerModule.setup('docs', app, document);
            console.log(`📚 Swagger documentation available at http://${host}:${port}/docs`);
        }
        catch (error) {
            console.error('❌ Swagger setup failed:', error instanceof Error ? error.message : String(error));
            if (error instanceof Error && error.stack) {
                console.error('Stack:', error.stack);
            }
        }
    }
    else {
        console.log(`[DEBUG] Skipping Swagger setup (NODE_ENV=${nodeEnv})`);
    }
    await app.listen(port, host);
    console.log(`🚀 API server is running on http://${host}:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map