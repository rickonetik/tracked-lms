export declare class RbacTestController {
    platformOnly(): Promise<{
        ok: boolean;
    }>;
    expertOnly(expertAccountId: string): Promise<{
        ok: boolean;
    }>;
    expertOnlyQuery(): Promise<{
        ok: boolean;
    }>;
    open(): Promise<{
        ok: boolean;
    }>;
}
//# sourceMappingURL=rbac-test.controller.d.ts.map