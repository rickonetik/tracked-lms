import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus, SubscriptionPlan } from '@prisma/client';

export class SubscriptionSnapshotDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ enum: SubscriptionStatus, example: 'active' })
  status!: SubscriptionStatus;

  @ApiProperty({ enum: SubscriptionPlan, example: 'manual_mvp' })
  plan!: SubscriptionPlan;

  @ApiProperty({ example: '2026-02-01T00:00:00.000Z', nullable: true })
  currentPeriodEnd!: string | null;

  @ApiProperty({ example: '2026-01-17T12:00:00.000Z' })
  createdAt!: string;
}

export class SetSubscriptionStatusResponseDto {
  @ApiProperty({ example: 'uuid' })
  expertAccountId!: string;

  @ApiProperty({ type: SubscriptionSnapshotDto })
  subscription!: SubscriptionSnapshotDto;

  @ApiProperty({ type: SubscriptionSnapshotDto, nullable: true })
  activeSubscription!: SubscriptionSnapshotDto | null;

  @ApiProperty({ example: 'uuid' })
  changedByUserId!: string;

  @ApiProperty({ example: '2026-01-17T12:00:00.000Z' })
  requestedAt!: string;
}
