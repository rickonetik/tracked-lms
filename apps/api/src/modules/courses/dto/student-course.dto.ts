import { ApiProperty } from '@nestjs/swagger';
import { CourseStatus } from '@prisma/client';

export class StudentLessonDto {
  @ApiProperty({ description: 'ID урока' })
  id!: string;

  @ApiProperty({ description: 'Название урока' })
  title!: string;

  @ApiProperty({ description: 'Описание урока', required: false, nullable: true, type: String })
  description?: string | null;

  @ApiProperty({ description: 'Позиция урока в модуле' })
  position!: number;
}

export class StudentModuleDto {
  @ApiProperty({ description: 'ID модуля' })
  id!: string;

  @ApiProperty({ description: 'Название модуля' })
  title!: string;

  @ApiProperty({ description: 'Описание модуля', required: false, nullable: true, type: String })
  description?: string | null;

  @ApiProperty({ description: 'Позиция модуля в курсе' })
  position!: number;

  @ApiProperty({ description: 'Уроки модуля', type: [StudentLessonDto] })
  lessons!: StudentLessonDto[];
}

export class StudentCourseDto {
  @ApiProperty({ description: 'ID курса' })
  id!: string;

  @ApiProperty({ description: 'Название курса' })
  title!: string;

  @ApiProperty({ description: 'Описание курса', required: false, nullable: true, type: String })
  description?: string | null;

  @ApiProperty({ description: 'ID темы', required: false, nullable: true, type: String })
  topicId?: string | null;

  @ApiProperty({ description: 'Статус курса', enum: CourseStatus })
  status!: CourseStatus;

  @ApiProperty({ description: 'Модули курса', type: [StudentModuleDto] })
  modules!: StudentModuleDto[];
}
