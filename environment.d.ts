namespace NodeJS {
  interface ProcessEnv {
    OPENAI_API_KEY: string
    OPENAI_BASE_URL: string

    DB_HOST: string
    DB_USER: string
    DB_PASSWORD: string

    KNOWLEDGE_BASE_URL: string
    OFFLINE_TOKEN: string
    WEALTH_MANAGEMENT_CHAT_URL: string
  }
}
