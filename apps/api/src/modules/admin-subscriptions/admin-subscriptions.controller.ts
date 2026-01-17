import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlatformRolesGuard } from '../../common/rbac/guards/platform-roles.guard';
import { RequirePlatformRole } from '../../common/rbac/decorators/require-platform-role.decorator';
import { PlatformRole } from '../../common/rbac/platform-role.enum';
import { AdminSubscriptionsService } from './admin-subscriptions.service';
import { SetSubscriptionStatusDto } from './dto/set-subscription-status.dto';
import { SetSubscriptionStatusResponseDto } from './dto/set-subscription-status.response.dto';

@ApiTags('admin')
@Controller('admin/subscriptions')
@UseGuards(JwtAuthGuard, PlatformRolesGuard)
@ApiBearerAuth()
export class AdminSubscriptionsController {
  constructor(
    private readonly adminSubscriptionsService: AdminSubscriptionsService,
  ) {}

  @Post(':expertAccountId/status')
  @RequirePlatformRole(PlatformRole.OWNER, PlatformRole.ADMIN)
  @ApiOperation({
    summary: 'Set subscription status for expert account',
    description:
      'Creates a new subscription record (preserves history). Only accessible by Platform Owner/Admin.',
  })
  @ApiParam({
    name: 'expertAccountId',
    description: 'Expert account ID',
    type: String,
  })
  @ApiOkResponse({
    description: 'Subscription status set successfully',
    type: SetSubscriptionStatusResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Expert account not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Expert account not found' },
        error: { type: 'string', example: 'EXPERT_ACCOUNT_NOT_FOUND' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Platform role required',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Forbidden' },
        error: { type: 'string', example: 'PLATFORM_ROLE_REQUIRED' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        error: {
          type: 'string',
          enum: [
            'INVALID_CURRENT_PERIOD_END',
            'INVALID_STATUS',
            'INVALID_PLAN',
          ],
        },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async setSubscriptionStatus(
    @Param('expertAccountId') expertAccountId: string,
    @Body() dto: SetSubscriptionStatusDto,
    @Request() req: any,
  ): Promise<SetSubscriptionStatusResponseDto> {
    return this.adminSubscriptionsService.setSubscriptionStatus(
      expertAccountId,
      dto,
      req.user.id,
    );
  }
}
