-- CreateEnum
CREATE TYPE "ExpertMemberRole" AS ENUM ('owner', 'manager', 'reviewer');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'expired', 'canceled');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('manual_mvp');

-- CreateTable
CREATE TABLE "expert_accounts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "owner_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_members" (
    "id" TEXT NOT NULL,
    "expert_account_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "ExpertMemberRole" NOT NULL DEFAULT 'owner',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "expert_account_id" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'manual_mvp',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "current_period_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current_period_end" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "expert_accounts_slug_key" ON "expert_accounts"("slug");

-- CreateIndex
CREATE INDEX "expert_accounts_owner_user_id_idx" ON "expert_accounts"("owner_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "expert_members_expert_account_id_user_id_key" ON "expert_members"("expert_account_id", "user_id");

-- CreateIndex
CREATE INDEX "expert_members_user_id_idx" ON "expert_members"("user_id");

-- CreateIndex
CREATE INDEX "expert_members_expert_account_id_role_idx" ON "expert_members"("expert_account_id", "role");

-- CreateIndex
CREATE INDEX "subscriptions_expert_account_id_status_idx" ON "subscriptions"("expert_account_id", "status");

-- CreateIndex
CREATE INDEX "subscriptions_status_current_period_end_idx" ON "subscriptions"("status", "current_period_end");

-- AddForeignKey
ALTER TABLE "expert_accounts" ADD CONSTRAINT "expert_accounts_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_members" ADD CONSTRAINT "expert_members_expert_account_id_fkey" FOREIGN KEY ("expert_account_id") REFERENCES "expert_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_members" ADD CONSTRAINT "expert_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_expert_account_id_fkey" FOREIGN KEY ("expert_account_id") REFERENCES "expert_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
