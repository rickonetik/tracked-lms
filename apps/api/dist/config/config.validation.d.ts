declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test"
}
declare class EnvironmentVariables {
    NODE_ENV?: Environment;
    API_PORT?: number;
    API_HOST?: string;
    APP_VERSION?: string;
}
export declare function validateConfig(config: Record<string, unknown>): EnvironmentVariables;
export {};
//# sourceMappingURL=config.validation.d.ts.map