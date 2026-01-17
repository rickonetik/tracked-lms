import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({
    description: 'Название модуля',
    example: 'Введение в программирование',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Описание модуля',
    example: 'Базовые концепции программирования',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
