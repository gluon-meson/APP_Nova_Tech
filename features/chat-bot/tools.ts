import type OpenAI from 'openai'

import { data_explain } from '@/features/chat-bot/constants'
import { STOCK_DATA_ITEM } from '@/features/chat-bot/types'
import { logger } from '@/lib/shared'
import { queryKnowledgeBase } from '@/lib/shared/queryKnowledgeBase'
import { sleep } from '@/lib/utils'
import { DATA_SET } from '../../constants/conmon'

export const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_current_weather',
      description: '获取指定位置的当前天气情况。',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: '城市和州，例如：旧金山，加利福尼亚州',
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: '温度单位，可选值为摄氏度或华氏度',
          },
        },
        required: ['location'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_data',
      description: `从${data_explain}中获取给定自然语言查询字符串的数据。最好添加批准日期以确保在需要时数据是可比较的。`,
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: '用于指定要检索的数据的自然语言。',
          },
          size: {
            type: 'number',
            description: `要获取的数据项数量。仅当要获取的数据是一个列表而不是聚合结果时传递此参数，确保结果数量受到您的控制。目前支持的**最大尺寸**为100。`,
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
      description: `可以为${data_explain}绘制线条和柱状图。`,
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'array',
            items: {
              type: 'string',
              description:
                '用于检索一家公司的股票或股票市场指数数据的自然语言查询',
            },
            description:
              '图表要显示的数据，每个项目类似于tool get_data查询参数，但它应查询一个数据列表而不是聚合结果。为数据添加时间范围！如果要求多个数据，请将问题分割成字符串数组以获取不同的数据。最好为每个项目添加相同的时间范围，以确保数据可比较。例如：问题是最近比较Cisco和纳斯达克100的每日收盘价，则查询参数应为：["Cisco(CSCO)从2024-01-01到2024-03-31的每日收盘价","纳斯达克100(NDX)从2024-01-01到2024-03-31的每日收盘价"]。',
          },
          data_key: {
            type: 'string',
            description: '应该是开盘价、最高价、最低价、收盘价或成交量',
          },
          data_belongs: {
            type: 'array',
            items: {
              type: 'string',
              description:
                '公司或指数标记名称之一，根据查询可能是可口可乐公司(KO)或其他公司',
            },
            description:
              '数据所属的公司或指数标记，顺序应遵循查询参数，从Booking Holdings Inc(BKNG)、纳斯达克100(NDX)等中选择一个或多个...',
          },
          size: {
            type: 'number',
            description:
              '要获取的数据项数量。仅当要获取的数据是一个列表而不是聚合结果时传递此参数，确保结果数量受到您的控制。目前支持的最大尺寸为100。',
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
      description: `为${data_explain}生成蜡烛图(K线图)。
      This function plots a chart showing open, high, low, and close prices of stocks over time, aiding users in identifying trends and patterns.
      It's an essential tool for investors analyzing market movements to inform trading decisions. The chart highlights price dynamics and can be adjusted to cover various time periods, supporting both short-term and long-term strategies.`,
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              '用户关于股票或股票市场指数的蜡烛图(K线图)的自然语言查询。',
          },
          incorporation: {
            type: 'string',
            description: '股票公司或股票市场指数的名称。',
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
    data_set_id: DATA_SET,
  }).catch((e) => {
    logger.error(e, 'tool get_data error:')
    return 'Nothing got, try again with more context for the query parameter.'
  })
  logger.info(res, 'get_data done with:')
  if (!res || (typeof res !== 'string' && res?.items.length === 0))
    return 'Nothing retrieved, try again with more context or explain for data you want to retrieve.'
  return 'the response is:' + JSON.stringify(res)
}
