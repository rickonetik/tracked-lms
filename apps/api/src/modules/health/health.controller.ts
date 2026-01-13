import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getHealth() {
    return {
      ok: true,
      env: this.configService.get<string>('NODE_ENV') || 'development',
      version: this.configService.get<string>('APP_VERSION') || '1.0.0',
    };
  }
}
