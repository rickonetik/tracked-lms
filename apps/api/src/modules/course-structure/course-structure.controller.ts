import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CourseStructureService } from './course-structure.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { ReorderDto } from './dto/reorder.dto';

@ApiTags('expert-structure')
@Controller('expert')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CourseStructureController {
  constructor(private readonly courseStructureService: CourseStructureService) {}

  @Post('courses/:courseId/modules')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать модуль в курсе' })
  @ApiParam({
    name: 'courseId',
    description: 'ID курса',
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: 'Модуль успешно создан',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        courseId: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string', nullable: true },
        position: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Курс не найден',
  })
  async createModule(@Param('courseId') courseId: string, @Body() dto: CreateModuleDto) {
    return await this.courseStructureService.createModule(courseId, dto);
  }

  @Post('modules/:moduleId/lessons')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать урок в модуле' })
  @ApiParam({
    name: 'moduleId',
    description: 'ID модуля',
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: 'Урок успешно создан',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        moduleId: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string', nullable: true },
        position: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Модуль не найден',
  })
  async createLesson(@Param('moduleId') moduleId: string, @Body() dto: CreateLessonDto) {
    return await this.courseStructureService.createLesson(moduleId, dto);
  }

  @Post('courses/:courseId/modules/reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Переупорядочить модули в курсе' })
  @ApiParam({
    name: 'courseId',
    description: 'ID курса',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Модули успешно переупорядочены',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          courseId: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          position: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Невалидный запрос (не все модули включены или неверные ID)',
  })
  @ApiResponse({
    status: 404,
    description: 'Курс не найден',
  })
  async reorderModules(@Param('courseId') courseId: string, @Body() dto: ReorderDto) {
    return await this.courseStructureService.reorderModules(courseId, dto);
  }

  @Post('modules/:moduleId/lessons/reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Переупорядочить уроки в модуле' })
  @ApiParam({
    name: 'moduleId',
    description: 'ID модуля',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Уроки успешно переупорядочены',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          moduleId: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          position: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Невалидный запрос (не все уроки включены или неверные ID)',
  })
  @ApiResponse({
    status: 404,
    description: 'Модуль не найден',
  })
  async reorderLessons(@Param('moduleId') moduleId: string, @Body() dto: ReorderDto) {
    return await this.courseStructureService.reorderLessons(moduleId, dto);
  }
}
