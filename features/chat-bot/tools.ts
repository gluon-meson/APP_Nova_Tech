import type OpenAI from 'openai'

import { data_explain } from '@/features/chat-bot/constants'
import { STOCK_DATA_ITEM } from '@/features/chat-bot/types'
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
      description: `Get the trusted stock or Index data in a given natural language query string for ${data_explain}`,
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'natural language for retrieve stock or Index data, The inside logic is generate postgres SQL to query db by the query parameter, ' +
              'so try to add more context or explain as more as possible for the data you want to get, make sure this tool can generate right sql to query the data I want' +
              'Eg: Coca-Cola stock trending recently? => Coca-Cola(KO) stock daily and weekly data in past three month?',
          },
          size: {
            type: 'number',
            description:
              'how many items do you want to get when the data you want to get is a list not aggregated, make sure the amount of data is under your control, ' +
              'currently the supported **maximum size** is 100', // todo
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'draw_line_bar_chart',
      description: `it can draw line and bar chart for ${data_explain}, it can generate plot for one or multiple company stock or Index market.
      Multiple is to compare the data trending. Example: question is Compare the Cisco with Nasdaq 100 daily close price recently, query parameter should be:
      ["Cisco(CSCO) daily close price from 2024-01-01 to 2024-03-31","Nasdaq 100(GSPC) daily close price from 2024-01-01 to 2024-03-31"].
      the default is line chart, you can notice me to switch to bar chart by the top right icon.
      `,
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'array',
            items: {
              type: 'string',
              description:
                'natural language for retrieve one company stock or Index data',
            },
            description:
              'what data the chart want to show, each item is similar with tool get_data query parameter, but it should query a list of data not a aggregated one. Add the time range for the data!' +
              "You need split question to a string array to get different data if ask multiple data. It's better to add the same time range for each item to make sure the data is comparable." +
              'Eg: question is Compare the Cisco with Nasdaq 100 daily close price recently, query parameter should be: ["Cisco(CSCO) daily close price from 2024-01-01 to 2024-03-31","Nasdaq 100(GSPC) daily close price from 2024-01-01 to 2024-03-31"].',
          },
          data_key: {
            type: 'string',
            description: 'it should be open, high, low, close price or volume',
          },
          data_belongs: {
            type: 'array',
            items: {
              type: 'string',
              description:
                'one of the companies or index markers names, might be Coca-Cola Co(KO) or others according the query',
            },
            description:
              'which company or index marker the data belongs, the sequence should be follow query parameter, one or mutilate from Booking Holdings Inc(BKNG),Nasdaq 100(GSPC) and etc...',
          },
          size: {
            type: 'number',
            description:
              'how many items do you want to get when the data you want to get is a list not aggregated, make sure the amount of data is under your control, ' +
              'currently the supported maximum size is 100',
          },
        },
        required: ['query', 'data_key', 'data_belongs'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'draw_candle_chart',
      description: `Generate a candlestick (K-line) chart for ${data_explain}.
      This function plots a chart showing open, high, low, and close prices of stocks over time, aiding users in identifying trends and patterns.
      It's an essential tool for investors analyzing market movements to inform trading decisions. The chart highlights price dynamics and can be adjusted to cover various time periods, supporting both short-term and long-term strategies.`,
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
  DRAW_LINE_BAR_CHART = 'draw_line_bar_chart',
  DRAW_COMPARE_LINE_BAR_CHART = 'draw_compare_line_bar_chart',
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

export async function get_data(query: string, size?: number) {
  logger.info({ query, size }, 'call get_data with query:')
  const res = await queryKnowledgeBase<STOCK_DATA_ITEM>({
    query,
    size,
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
