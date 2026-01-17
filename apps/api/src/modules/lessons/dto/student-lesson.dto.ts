import { ApiProperty } from '@nestjs/swagger';

export class StudentLessonDto {
  @ApiProperty({ description: 'ID урока' })
  id!: string;

  @ApiProperty({ description: 'ID модуля' })
  moduleId!: string;

  @ApiProperty({ description: 'Название урока' })
  title!: string;

  @ApiProperty({ description: 'Описание урока', required: false, nullable: true, type: String })
  description?: string | null;

  @ApiProperty({ description: 'Позиция урока в модуле' })
  position!: number;

  @ApiProperty({ description: 'Видео урока (placeholder для EPIC 5)', required: true, nullable: true, default: null, type: 'null' })
  video!: null;

  @ApiProperty({ description: 'Дата завершения урока текущим студентом', required: false, nullable: true, type: String })
  completedAt?: string | null;
}
