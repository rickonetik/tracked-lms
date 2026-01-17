import { PrismaService } from '../../common/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { ReorderDto } from './dto/reorder.dto';
export declare class CourseStructureService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    /**
     * Создает модуль в курсе
     * Позиция автоматически устанавливается как max(position) + POSITION_STEP
     */
    createModule(courseId: string, dto: CreateModuleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        courseId: string;
        position: number;
    }>;
    /**
     * Создает урок в модуле
     * Позиция автоматически устанавливается как max(position) + POSITION_STEP
     */
    createLesson(moduleId: string, dto: CreateLessonDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: number;
        moduleId: string;
    }>;
    /**
     * Переупорядочивает модули в курсе
     * Использует двухфазное обновление для избежания unique конфликтов
     */
    reorderModules(courseId: string, dto: ReorderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        courseId: string;
        position: number;
    }[]>;
    /**
     * Переупорядочивает уроки в модуле
     * Использует двухфазное обновление для избежания unique конфликтов
     */
    reorderLessons(moduleId: string, dto: ReorderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: number;
        moduleId: string;
    }[]>;
}
//# sourceMappingURL=course-structure.service.d.ts.map