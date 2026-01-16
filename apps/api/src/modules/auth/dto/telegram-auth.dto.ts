import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TelegramAuthDto {
  @ApiProperty({
    description: 'Raw initData query string от Telegram WebApp',
    example: 'query_id=...&user=...&auth_date=...&hash=...',
  })
  @IsString()
  @IsNotEmpty()
  initData!: string;
}

export class TelegramAuthResponseDto {
  @ApiProperty({
    description: 'JWT токен для авторизации',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'Данные пользователя',
    type: 'object',
    properties: {
      id: { type: 'string' },
      telegramId: { type: 'string', nullable: true, description: 'bigint сериализуется как string в JSON' },
      firstName: { type: 'string' },
      lastName: { type: 'string', nullable: true },
      username: { type: 'string', nullable: true },
      status: { type: 'string', description: 'active, banned' },
      userType: { type: 'string', description: 'Derived поле: "STUDENT" по умолчанию, позже вычисляется из membership/subscription' },
    },
  })
  user!: {
    id: string;
    telegramId: string | null; // bigint сериализуется как string в JSON
    firstName: string;
    lastName: string | null;
    username: string | null;
    status: string; // active, banned
    userType: string; // Derived поле: "STUDENT" по умолчанию, позже вычисляется из membership/subscription
  };
}
