import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LessonsService } from './lessons.service';
import { StudentLessonDto } from './dto/student-lesson.dto';

@ApiTags('student')
@Controller('lessons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID урока' })
  @ApiOkResponse({ type: StudentLessonDto, description: 'Данные урока' })
  async getLesson(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<StudentLessonDto> {
    const studentId = req.user.id;
    return this.lessonsService.getLessonForStudent(id, studentId);
  }
}
