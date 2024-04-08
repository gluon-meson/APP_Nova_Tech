import type OpenAI from 'openai'

import { logger } from '@/lib/shared'
import { sleep } from '@/lib/utils'

export const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_current_weather',
      description: 'Get the current weather in a given location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g. San Francisco, CA',
          },
          unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
        },
        required: ['location'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_data',
      description:
        'Get the stock data in a given natural language query string',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'user natural language query about stock',
          },
        },
        required: ['query'],
      },
    },
  },
]

export enum TOOLS_NAMES {
  GET_WEATHER = 'get_current_weather',
  GET_DATA = 'get_data',
}

export // example: https://platform.openai.com/docs/guides/function-calling/parallel-function-calling
async function get_current_weather(location: string, unit: string) {
  await sleep(1000)
  if (location.toLowerCase().includes('tokyo')) {
    return JSON.stringify({
      location: 'Tokyo',
      temperature: '10',
      unit: 'celsius',
    })
  } else if (location.toLowerCase().includes('san francisco')) {
    return JSON.stringify({
      location: 'San Francisco',
      temperature: '72',
      unit: 'fahrenheit',
    })
  } else if (location.toLowerCase().includes('paris')) {
    return JSON.stringify({
      location: 'Paris',
      temperature: '22',
      unit: 'fahrenheit',
    })
  } else {
    return JSON.stringify({ location, temperature: 'unknown' })
  }
}

export async function get_data(query: string) {
  logger.info({ query }, 'call get_data with query:')
  try {
    const res = await fetch(
      `${process.env.KNOWLEDGE_BASE_URL}/data-sets/211/search`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${process.env.OFFLINE_TOKEN}`,
        },
        body: JSON.stringify({
          query: query,
        }),
        method: 'POST',
      },
    ).then((res) => {
      return res.json()
    })
    logger.info(res, 'get_data done with')
    return 'the response is:' + JSON.stringify(res)
  } catch (e) {
    logger.error(e, 'tool get_data error:')
  }
}
