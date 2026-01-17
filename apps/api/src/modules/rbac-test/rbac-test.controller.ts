import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlatformRolesGuard } from '../../common/rbac/guards/platform-roles.guard';
import { ExpertRolesGuard } from '../../common/rbac/guards/expert-roles.guard';
import { RequirePlatformRole } from '../../common/rbac/decorators/require-platform-role.decorator';
import { RequireExpertRole } from '../../common/rbac/decorators/require-expert-role.decorator';
import { PlatformRole } from '../../common/rbac/platform-role.enum';
import { ExpertRole } from '../../common/rbac/expert-role.enum';

// TODO: remove rbac-test module after RBAC verification
@ApiTags('rbac-test')
@Controller('rbac-test')
@ApiBearerAuth()
export class RbacTestController {
  @Get('platform-only')
  @UseGuards(JwtAuthGuard, PlatformRolesGuard)
  @RequirePlatformRole(PlatformRole.ADMIN)
  @ApiOperation({ summary: 'Test endpoint for platform role guard' })
  @ApiOkResponse({ description: 'Access granted', schema: { type: 'object', properties: { ok: { type: 'boolean' } } } })
  async platformOnly() {
    return { ok: true };
  }

  @Get('expert-only/:expertAccountId')
  @UseGuards(JwtAuthGuard, ExpertRolesGuard)
  @RequireExpertRole(ExpertRole.OWNER)
  @ApiOperation({ summary: 'Test endpoint for expert role guard (param)' })
  @ApiOkResponse({ description: 'Access granted', schema: { type: 'object', properties: { ok: { type: 'boolean' } } } })
  async expertOnly(@Param('expertAccountId') expertAccountId: string) {
    return { ok: true };
  }

  @Get('expert-only-query')
  @UseGuards(JwtAuthGuard, ExpertRolesGuard)
  @RequireExpertRole(ExpertRole.OWNER)
  @ApiOperation({ summary: 'Test endpoint for expert role guard (query)' })
  @ApiOkResponse({ description: 'Access granted', schema: { type: 'object', properties: { ok: { type: 'boolean' } } } })
  async expertOnlyQuery() {
    // expertAccountId берется из query через guard
    return { ok: true };
  }

  @Get('open')
  @UseGuards(JwtAuthGuard, PlatformRolesGuard)
  @ApiOperation({ summary: 'Test endpoint without @RequirePlatformRole (should pass with token)' })
  @ApiOkResponse({ description: 'Access granted', schema: { type: 'object', properties: { ok: { type: 'boolean' } } } })
  async open() {
    return { ok: true };
  }
}
