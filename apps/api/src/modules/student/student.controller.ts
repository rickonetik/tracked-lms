import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StudentService } from './student.service';
import { MyCoursesResponseDto } from './dto/course.dto';

@ApiTags('student')
@Controller('me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('courses')
  @ApiOperation({ summary: 'Получить список курсов студента' })
  @ApiOkResponse({
    description: 'Список курсов студента',
    type: MyCoursesResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Токен отсутствует или невалиден',
  })
  async getMyCourses(@Request() req: any): Promise<MyCoursesResponseDto> {
    const userId = req.user.id;
    const courses = await this.studentService.getMyCourses(userId);
    return { courses };
  }
}
