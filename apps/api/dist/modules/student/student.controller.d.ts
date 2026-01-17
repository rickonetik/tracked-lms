import { StudentService } from './student.service';
import { MyCoursesResponseDto } from './dto/course.dto';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    getMyCourses(req: any): Promise<MyCoursesResponseDto>;
}
//# sourceMappingURL=student.controller.d.ts.map