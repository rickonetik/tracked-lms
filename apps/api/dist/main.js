"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
// Загружаем .env файлы ДО инициализации NestJS
// Это критично для Prisma 7, который требует DATABASE_URL в process.env
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env.local') });
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });
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
    const port = parseInt(process.env.API_PORT || '3000', 10);
    const host = process.env.API_HOST || '0.0.0.0';
    // Swagger/OpenAPI setup (только в dev режиме) - ДО app.listen() для Fastify
    const nodeEnv = process.env.NODE_ENV || 'development';
    const swaggerEnabled = nodeEnv === 'development';
    console.log(`[BOOTSTRAP] Swagger enabled: ${swaggerEnabled}`);
    if (swaggerEnabled) {
        try {
            const config = new swagger_1.DocumentBuilder()
                .setTitle('Tracked LMS API')
                .setDescription('Learning Management System API with Telegram Bot and Mini App integration')
                .setVersion(process.env.APP_VERSION || '1.0.0')
                .addTag('health', 'Health check endpoints')
                .build();
            const document = swagger_1.SwaggerModule.createDocument(app, config);
            swagger_1.SwaggerModule.setup('docs', app, document, {
                useGlobalPrefix: false,
            });
            console.log(`[BOOTSTRAP] Swagger docs: http://${host}:${port}/docs`);
        }
        catch (error) {
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
//# sourceMappingURL=main.js.map