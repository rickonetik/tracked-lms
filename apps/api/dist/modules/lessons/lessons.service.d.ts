import { PrismaService } from '../../common/prisma.service';
import { StudentLessonDto } from './dto/student-lesson.dto';
export declare class LessonsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    /**
     * Получить урок для студента
     * Проверяет наличие урока и активный enrollment на курс
     */
    getLessonForStudent(lessonId: string, studentId: string): Promise<StudentLessonDto>;
}
//# sourceMappingURL=lessons.service.d.ts.map