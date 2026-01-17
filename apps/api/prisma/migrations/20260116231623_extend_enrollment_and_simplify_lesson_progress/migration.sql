-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('active', 'expired', 'revoked');

-- CreateEnum
CREATE TYPE "EnrollmentSource" AS ENUM ('invite', 'manual', 'public');

-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN "access_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "enrollments" ADD COLUMN "access_end" TIMESTAMP(3);
ALTER TABLE "enrollments" ADD COLUMN "status" "EnrollmentStatus" NOT NULL DEFAULT 'active';
ALTER TABLE "enrollments" ADD COLUMN "source" "EnrollmentSource" NOT NULL DEFAULT 'manual';

-- Backfill existing enrollments
UPDATE "enrollments" SET "access_start" = "enrolled_at" WHERE "access_start" IS NULL;
UPDATE "enrollments" SET "status" = 'active' WHERE "status" IS NULL;
UPDATE "enrollments" SET "source" = 'manual' WHERE "source" IS NULL;

-- CreateIndex
CREATE INDEX "enrollments_student_id_status_idx" ON "enrollments"("student_id", "status");

-- CreateIndex
CREATE INDEX "enrollments_course_id_status_idx" ON "enrollments"("course_id", "status");

-- CreateIndex
CREATE INDEX "enrollments_student_id_access_end_idx" ON "enrollments"("student_id", "access_end");

-- AlterTable: LessonProgress - drop completed column and index
DROP INDEX IF EXISTS "lesson_progress_completed_idx";
ALTER TABLE "lesson_progress" DROP COLUMN "completed";
