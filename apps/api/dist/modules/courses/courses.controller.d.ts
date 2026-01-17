import { CoursesService } from './courses.service';
import { StudentCourseDto } from './dto/student-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    getCourse(id: string, req: any): Promise<StudentCourseDto>;
}
//# sourceMappingURL=courses.controller.d.ts.map