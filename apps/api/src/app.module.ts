import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { validateConfig } from './config/config.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
      envFilePath: [
        '.env.local',
        '.env',
        '../../.env.local',
        '../../.env',
      ],
    }),
    HealthModule,
  ],
})
export class AppModule {}
