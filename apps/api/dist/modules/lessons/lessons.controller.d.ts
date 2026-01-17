import { LessonsService } from './lessons.service';
import { StudentLessonDto } from './dto/student-lesson.dto';
export declare class LessonsController {
    private readonly lessonsService;
    constructor(lessonsService: LessonsService);
    getLesson(id: string, req: any): Promise<StudentLessonDto>;
}
//# sourceMappingURL=lessons.controller.d.ts.map