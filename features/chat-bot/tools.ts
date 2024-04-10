import type OpenAI from 'openai'

import { data_explain } from '@/features/chat-bot/constants'
import { logger } from '@/lib/shared'
import { queryKnowledgeBase } from '@/lib/shared/queryKnowledgeBase'
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
      description: `Get the trusted stock or index data in a given natural language query string for ${data_explain}`,
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'natural language for retrieve stock or Index data, try to add more context or explain as more as possible for the data you want. eg: Coca-Cola stock trending recently? => Coca-Cola(KO) stock daily and weekly data in past three month?',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'draw_candle_chart',
      description: `Generate a candlestick (K-line) chart for stock market analysis. This function plots a chart showing open, high, low, and close prices of stocks over time, aiding users in identifying trends and patterns. It's an essential tool for investors analyzing market movements to inform trading decisions. The chart highlights price dynamics and can be adjusted to cover various time periods, supporting both short-term and long-term strategies.`,
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'user natural language query about stock for the candlestick (K-line) chart',
          },
          incorporation: {
            type: 'string',
            description: 'the name of the stock company',
          },
        },
        required: ['query', 'incorporation'],
      },
    },
  },
]

export enum TOOLS_NAMES {
  GET_WEATHER = 'get_current_weather',
  GET_DATA = 'get_data',
  DRAW_CANDLE_CHART = 'draw_candle_chart',
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
  const res = await queryKnowledgeBase({
    query,
    data_set_id: 215,
  }).catch((e) => {
    logger.error(e, 'tool get_data error:')
    return 'Nothing got, try again with more context for the query param'
  })
  logger.info(res, 'get_data done with:')
  if (!res || (typeof res !== 'string' && res?.items.length === 0))
    return 'Nothing retrieved, try again with more context or explain for data you want to retrieve.'
  return 'the response is:' + JSON.stringify(res)
}
