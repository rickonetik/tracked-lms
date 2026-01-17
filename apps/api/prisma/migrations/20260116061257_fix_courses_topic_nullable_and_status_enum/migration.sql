-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('draft', 'published', 'archived');

-- DropIndex (если был индекс на name, он будет заменен на unique constraint)
DROP INDEX IF EXISTS "topics_name_idx";

-- AlterTable: сделать topic_id nullable
ALTER TABLE "courses" ALTER COLUMN "topic_id" DROP NOT NULL;

-- AlterTable: изменить тип status на enum
ALTER TABLE "courses" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "courses" ALTER COLUMN "status" TYPE "CourseStatus" USING "status"::"CourseStatus";
ALTER TABLE "courses" ALTER COLUMN "status" SET DEFAULT 'draft'::"CourseStatus";

-- AlterTable: сделать name unique в topics
ALTER TABLE "topics" ADD CONSTRAINT "topics_name_key" UNIQUE ("name");

-- AlterTable: сделать foreign key nullable (уже nullable, но нужно обновить constraint)
-- Foreign key уже существует, но нужно убедиться что он позволяет NULL
