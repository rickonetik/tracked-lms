import { PrismaService } from '../../common/prisma.service';
import { CourseProgressDto } from './dto/course-progress.dto';
export declare class ProgressService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    completeLesson(studentId: string, lessonId: string): Promise<CourseProgressDto>;
}
//# sourceMappingURL=progress.service.d.ts.map