import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiNotFoundResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExpertService } from './expert.service';
import { ExpertMeResponseDto } from './dto/expert-me.dto';

@ApiTags('expert')
@Controller('expert')
@ApiBearerAuth()
export class ExpertController {
  constructor(private expertService: ExpertService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current expert account information' })
  @ApiOkResponse({ description: 'Expert account information', type: ExpertMeResponseDto })
  @ApiNotFoundResponse({ description: 'Expert account not found (no membership)', schema: { type: 'object', properties: { message: { type: 'string' }, error: { type: 'string', example: 'EXPERT_NOT_FOUND' }, statusCode: { type: 'number', example: 404 } } } })
  @ApiForbiddenResponse({ description: 'Subscription is inactive', schema: { type: 'object', properties: { message: { type: 'string' }, error: { type: 'string', example: 'SUBSCRIPTION_INACTIVE' }, statusCode: { type: 'number', example: 403 } } } })
  async getMe(@Req() req: any): Promise<ExpertMeResponseDto> {
    const userId = req.user.id;
    return this.expertService.getExpertMe(userId);
  }
}
