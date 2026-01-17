import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({
    description: 'Название урока',
    example: 'Переменные и типы данных',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Описание урока',
    example: 'Изучение основных типов данных',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
