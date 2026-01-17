import { ApiProperty } from '@nestjs/swagger';

export class ExpertAccountDto {
  @ApiProperty({ description: 'ID expert account' })
  id!: string;

  @ApiProperty({ description: 'Slug expert account' })
  slug!: string;

  @ApiProperty({ description: 'Title expert account' })
  title!: string;

  @ApiProperty({ description: 'Owner user ID' })
  ownerUserId!: string;
}

export class MembershipDto {
  @ApiProperty({ description: 'ID membership' })
  id!: string;

  @ApiProperty({ description: 'Role in expert account', enum: ['owner', 'manager', 'reviewer'] })
  role!: string;

  @ApiProperty({ description: 'User ID' })
  userId!: string;

  @ApiProperty({ description: 'Expert account ID' })
  expertAccountId!: string;
}

export class SubscriptionDto {
  @ApiProperty({ description: 'ID subscription' })
  id!: string;

  @ApiProperty({ description: 'Subscription status', enum: ['active', 'expired', 'canceled'] })
  status!: string;

  @ApiProperty({ description: 'Subscription plan', enum: ['manual_mvp'] })
  plan!: string;

  @ApiProperty({ description: 'Current period start', nullable: true, type: String })
  currentPeriodStart!: string | null;

  @ApiProperty({ description: 'Current period end', nullable: true, type: String })
  currentPeriodEnd!: string | null;
}

export class PermissionsDto {
  @ApiProperty({ description: 'Platform permissions', type: [String] })
  platform!: string[];

  @ApiProperty({ description: 'Expert permissions', type: [String] })
  expert!: string[];
}

export class ExpertMeResponseDto {
  @ApiProperty({ description: 'Expert account', type: ExpertAccountDto })
  expertAccount!: ExpertAccountDto;

  @ApiProperty({ description: 'Membership', type: MembershipDto })
  membership!: MembershipDto;

  @ApiProperty({ description: 'Subscription', type: SubscriptionDto })
  subscription!: SubscriptionDto;

  @ApiProperty({ description: 'Permissions', type: PermissionsDto })
  permissions!: PermissionsDto;
}
