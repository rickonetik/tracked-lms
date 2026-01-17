import { CourseStructureService } from './course-structure.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { ReorderDto } from './dto/reorder.dto';
export declare class CourseStructureController {
    private readonly courseStructureService;
    constructor(courseStructureService: CourseStructureService);
    createModule(courseId: string, dto: CreateModuleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        courseId: string;
        position: number;
    }>;
    createLesson(moduleId: string, dto: CreateLessonDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: number;
        moduleId: string;
    }>;
    reorderModules(courseId: string, dto: ReorderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        courseId: string;
        position: number;
    }[]>;
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
//# sourceMappingURL=course-structure.controller.d.ts.map