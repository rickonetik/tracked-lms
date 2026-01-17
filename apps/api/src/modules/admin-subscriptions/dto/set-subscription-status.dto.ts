import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsDateString, ValidateIf } from 'class-validator';
import { SubscriptionStatus, SubscriptionPlan } from '@prisma/client';

export class SetSubscriptionStatusDto {
  @ApiProperty({
    description: 'Subscription status',
    enum: SubscriptionStatus,
    example: 'active',
  })
  @IsEnum(SubscriptionStatus, {
    message: 'Status must be one of: active, expired, canceled',
  })
  status!: SubscriptionStatus;

  @ApiProperty({
    description: 'Subscription plan',
    enum: SubscriptionPlan,
    example: 'manual_mvp',
  })
  @IsEnum(SubscriptionPlan, {
    message: 'Plan must be one of: manual_mvp',
  })
  plan!: SubscriptionPlan;

  @ApiProperty({
    description: 'End date of current period (ISO string or null for unlimited)',
    example: '2026-02-01T00:00:00.000Z',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @ValidateIf((o) => o.currentPeriodEnd !== null && o.currentPeriodEnd !== undefined)
  @IsDateString({}, { message: 'currentPeriodEnd must be a valid ISO date string' })
  currentPeriodEnd?: string | null;

  @ApiProperty({
    description: 'Reason for status change (optional, for audit)',
    example: 'Manual admin action',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
