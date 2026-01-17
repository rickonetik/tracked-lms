import { ExpertService } from './expert.service';
import { ExpertMeResponseDto } from './dto/expert-me.dto';
export declare class ExpertController {
    private expertService;
    constructor(expertService: ExpertService);
    getMe(req: any): Promise<ExpertMeResponseDto>;
}
//# sourceMappingURL=expert.controller.d.ts.map