declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOTTOKEN: string;
        }
    }
}

export {};