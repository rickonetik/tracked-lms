import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV?: Environment;

  @IsNumber()
  @IsOptional()
  API_PORT?: number;

  @IsString()
  @IsOptional()
  API_HOST?: string;

  @IsString()
  @IsOptional()
  APP_VERSION?: string;
}

export function validateConfig(config: Record<string, unknown>): EnvironmentVariables {
  // Преобразуем API_PORT в число если он строка
  const apiPort = config.API_PORT 
    ? (typeof config.API_PORT === 'string' ? parseInt(config.API_PORT, 10) : config.API_PORT)
    : 3000;

  const validatedConfig = plainToInstance(EnvironmentVariables, {
    NODE_ENV: config.NODE_ENV || 'development',
    API_PORT: apiPort,
    API_HOST: config.API_HOST || '0.0.0.0',
    APP_VERSION: config.APP_VERSION || '1.0.0',
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
