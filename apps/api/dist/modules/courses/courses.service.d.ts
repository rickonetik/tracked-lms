import { PrismaService } from '../../common/prisma.service';
import { StudentCourseDto } from './dto/student-course.dto';
export declare class CoursesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    /**
     * Получить курс для студента с полной структурой (modules + lessons)
     * Проверяет наличие курса и активный enrollment
     */
    getCourseForStudent(courseId: string, studentId: string): Promise<StudentCourseDto>;
}
//# sourceMappingURL=courses.service.d.ts.map