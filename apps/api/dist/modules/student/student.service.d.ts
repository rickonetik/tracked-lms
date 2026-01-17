import { PrismaService } from '../../common/prisma.service';
import { CourseDto } from './dto/course.dto';
export declare class StudentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    /**
     * Получить курсы студента
     * Фильтрует по активным enrollments с учетом срока доступа
     */
    getMyCourses(userId: string): Promise<CourseDto[]>;
}
//# sourceMappingURL=student.service.d.ts.map