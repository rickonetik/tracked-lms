import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';
import { CourseProgressDto } from './dto/course-progress.dto';

@Controller('progress')
@ApiTags('student')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('lessons/:id/complete')
  @ApiParam({ name: 'id', description: 'ID урока' })
  @ApiOkResponse({ type: CourseProgressDto, description: 'Прогресс по курсу после завершения урока' })
  async completeLesson(@Param('id') lessonId: string, @Req() req: any): Promise<CourseProgressDto> {
    return this.progressService.completeLesson(req.user.id, lessonId);
  }
}
