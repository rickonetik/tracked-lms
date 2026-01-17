import { ApiProperty } from '@nestjs/swagger';

export class CourseProgressDto {
  @ApiProperty({ description: 'ID курса', example: '550e8400-e29b-41d4-a716-446655440000' })
  courseId!: string;

  @ApiProperty({ description: 'Общее количество уроков в курсе', example: 12 })
  totalLessons!: number;

  @ApiProperty({ description: 'Количество пройденных уроков', example: 3 })
  completedLessons!: number;

  @ApiProperty({ description: 'Процент прогресса (0-100)', example: 25 })
  progressPercent!: number;
}
