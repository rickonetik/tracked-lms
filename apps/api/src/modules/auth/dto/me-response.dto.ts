import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDto {
  @ApiProperty({
    description: 'ID пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Telegram ID пользователя',
    example: '123456789',
    nullable: true,
  })
  telegramId!: string | null;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'John',
  })
  firstName!: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Doe',
    nullable: true,
  })
  lastName!: string | null;

  @ApiProperty({
    description: 'Username пользователя',
    example: 'johndoe',
    nullable: true,
  })
  username!: string | null;

  @ApiProperty({
    description: 'Статус пользователя',
    example: 'active',
    enum: ['active', 'banned'],
  })
  status!: string;

  @ApiProperty({
    description: 'Тип пользователя (derived поле): "STUDENT" по умолчанию, позже вычисляется из membership/subscription',
    example: 'STUDENT',
  })
  userType!: string;
}
