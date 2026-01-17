import { PrismaService } from '../../common/prisma.service';
import { ExpertMeResponseDto } from './dto/expert-me.dto';
export declare class ExpertService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Маппинг роли в permission string
     */
    private roleToPermission;
    /**
     * Приоритет ролей для детерминированного выбора
     * OWNER > manager > reviewer
     */
    private getRolePriority;
    /**
     * Детерминированный выбор membership при нескольких
     * Правило: OWNER first, затем по приоритету роли, затем по createdAt ASC
     */
    private selectMembership;
    getExpertMe(userId: string): Promise<ExpertMeResponseDto>;
}
//# sourceMappingURL=expert.service.d.ts.map