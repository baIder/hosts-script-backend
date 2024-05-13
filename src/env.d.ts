declare namespace NodeJS {
    interface ProcessEnv {
        LOG_DIR: string;
        SCRIPT_DIR: string;
        REDIS_HOST: string;
        REDIS_PORT: string;
        REDIS_PASSWORD: string;
        REDIS_DB: string;
    }
}
