function getEnvVar(name, defaultValue) {
    const value = process.env[name];
    if (!value && !defaultValue) {
        throw new Error(`Environment variable ${name} is required but not set`);
    }
    return value || defaultValue;
}
function validateBotToken(token) {
    if (!token || token.trim() === '') {
        throw new Error('BOT_TOKEN is required and cannot be empty');
    }
    const tokenPattern = /^\d+:[A-Za-z0-9_-]+$/;
    if (!tokenPattern.test(token)) {
        throw new Error('BOT_TOKEN has invalid format. Expected format: <number>:<string>');
    }
}
export const config = {
    BOT_TOKEN: (() => {
        const token = getEnvVar('BOT_TOKEN');
        validateBotToken(token);
        return token;
    })(),
};
//# sourceMappingURL=index.js.map