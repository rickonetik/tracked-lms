"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    // Enable CORS
    app.enableCors({
        origin: true,
        credentials: true,
    });
    // Global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = parseInt(process.env.API_PORT || '3000', 10);
    const host = process.env.API_HOST || '0.0.0.0';
    await app.listen(port, host);
    console.log(`🚀 API server is running on http://${host}:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map