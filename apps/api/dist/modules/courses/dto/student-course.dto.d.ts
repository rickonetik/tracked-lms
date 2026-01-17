import { CourseStatus } from '@prisma/client';
export declare class StudentLessonDto {
    id: string;
    title: string;
    description?: string | null;
    position: number;
}
export declare class StudentModuleDto {
    id: string;
    title: string;
    description?: string | null;
    position: number;
    lessons: StudentLessonDto[];
}
export declare class StudentCourseDto {
    id: string;
    title: string;
    description?: string | null;
    topicId?: string | null;
    status: CourseStatus;
    modules: StudentModuleDto[];
}
//# sourceMappingURL=student-course.dto.d.ts.map