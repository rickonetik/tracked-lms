import { ConfigService } from '@nestjs/config';
export declare class HealthController {
    private readonly configService;
    constructor(configService: ConfigService);
    getHealth(): {
        ok: boolean;
        env: string;
        version: string;
    };
}
//# sourceMappingURL=health.controller.d.ts.map