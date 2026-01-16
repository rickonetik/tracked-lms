"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    configService;
    constructor(configService) {
        // Получаем DATABASE_URL из ConfigService или process.env
        const databaseUrl = configService.get('DATABASE_URL') ||
            process.env.DATABASE_URL ||
            (() => {
                // Fallback: собираем из отдельных переменных
                const host = configService.get('DB_HOST') || process.env.DB_HOST || 'localhost';
                const port = configService.get('DB_PORT') || process.env.DB_PORT || '5432';
                const user = configService.get('DB_USER') || process.env.DB_USER || 'tracked_lms';
                const password = configService.get('DB_PASSWORD') || process.env.DB_PASSWORD || 'tracked_lms_pass';
                const database = configService.get('DB_NAME') || process.env.DB_NAME || 'tracked_lms';
                return `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;
            })();
        if (!databaseUrl) {
            throw new Error('DATABASE_URL is required but not found. Please set DATABASE_URL or DB_* variables in .env file.');
        }
        // Prisma 7 с engine type "client" требует adapter
        // Используем PrismaPg adapter для PostgreSQL
        // Используем connectionString напрямую - это более надежно
        const pool = new pg_1.Pool({
            connectionString: databaseUrl,
        });
        const adapter = new adapter_pg_1.PrismaPg(pool);
        super({
            adapter,
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
        this.configService = configService;
    }
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map