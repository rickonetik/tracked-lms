import { ProgressService } from './progress.service';
import { CourseProgressDto } from './dto/course-progress.dto';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    completeLesson(lessonId: string, req: any): Promise<CourseProgressDto>;
}
//# sourceMappingURL=progress.controller.d.ts.map