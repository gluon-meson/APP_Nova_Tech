import OpenAI from 'openai'

export const GPT_MODEL = 'gpt-4-1106-preview' //'gpt-4-turbo-preview' gpt-3.5-turbo gpt-4 gpt-4-1106-preview

export const getOpenaiClient: () => OpenAI = (function () {
  let instance: OpenAI
  return {
    getInstance: function () {
      if (!instance) {
        // logger.info('OpenAI client created')
        instance = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: process.env.OPENAI_BASE_URL,
        })
      }
      return instance
    },
  }
})().getInstance
