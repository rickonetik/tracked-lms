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
import { CoursesService } from './courses.service';
import { StudentCourseDto } from './dto/student-course.dto';

@ApiTags('student')
@Controller('courses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID курса' })
  @ApiOkResponse({ type: StudentCourseDto, description: 'Структура курса с модулями и уроками' })
  async getCourse(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<StudentCourseDto> {
    const studentId = req.user.id;
    return this.coursesService.getCourseForStudent(id, studentId);
  }
}
