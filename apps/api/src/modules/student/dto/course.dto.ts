import { ApiProperty } from '@nestjs/swagger';

export class CourseDto {
  @ApiProperty({
    description: 'ID курса',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Название курса',
    example: 'Введение в программирование',
  })
  title!: string;

  @ApiProperty({
    description: 'Описание курса',
    example: 'Базовые концепции программирования',
    required: false,
    nullable: true,
    type: String,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Общее количество уроков в курсе',
    type: Number,
    example: 12,
  })
  totalLessons!: number;

  @ApiProperty({
    description: 'Количество пройденных уроков',
    type: Number,
    example: 3,
  })
  completedLessons!: number;

  @ApiProperty({
    description: 'Процент прогресса (0-100)',
    type: Number,
    example: 25,
  })
  progressPercent!: number;
}

export class MyCoursesResponseDto {
  @ApiProperty({
    description: 'Список курсов студента',
    type: [CourseDto],
  })
  courses!: CourseDto[];
}
