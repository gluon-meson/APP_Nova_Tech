import type OpenAI from 'openai'
import { destination } from 'pino'

import { data_explain } from '@/features/chat-bot/constants'
import { SALES_ORDER_ITEM } from '@/features/chat-bot/types'
import { logger } from '@/lib/shared'
import { queryKnowledgeBase } from '@/lib/shared/queryKnowledgeBase'

import { DATA_SET_ID } from '../../constants/conmon'

export const tools: OpenAI.ChatCompletionTool[] = [
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
            description: '指定要检索数据的自然语言，需要带上相关上下文。',
          },
          size: {
            type: 'number',
            description:
              '要获取的数据项数量。仅当要获取的数据是一个列表而不是聚合结果时传递此参数，确保结果数量受到您的控制。目前支持的最大size为5000。', // todo
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'draw_complex_chart',
      description: `将使用数据生成chartCode传入mermaid组件，以便通过图表的形式将数据呈现出来。`,
      parameters: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: '根据Mermaid 的语法规则编写相应的代码',
          },
        },
        required: ['code'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'draw_pie_chart',
      description: `将使用数据生成option传入Echarts组件，以便通过饼状图的形式将数据呈现出来。`,
      parameters: {
        type: 'object',
        properties: {
          option: {
            type: 'string',
            description: '根据Echarts 的语法规则编写相应的代码',
          },
        },
        required: ['option'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'draw_pie_chart',
      description: `可以为用户查找出来的数据通过绘制饼状图来进行图形呈现。`,
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: '用于表达这个图形展示的主题内容，简明扼要。',
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: {
                  type: 'number',
                  description: '饼状图各个数据项的占比',
                },
                name: {
                  type: 'string',
                  description: '数据项名',
                },
              },
            },
          },
        },
        required: ['title', 'data'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'draw_line_bar_chart',
      description: `可以为用户查找出来的数据通过绘制线条和柱状图来进行图形呈现。`,
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: '图表要显示的数据的查询自然语言。',
          },
          title: {
            type: 'string',
            description: '用于表达这个图形展示的主题内容，简明扼要。',
          },
          x_ray: {
            type: 'array',
            items: {
              type: 'string',
              description:
                '用于展示于横坐标维度的数据，你可能需要提取对应业务维度的数据',
            },
            destination:
              '线图的横坐标元素，比如时间（一月、二月等）、规格型号、部门等',
          },
          y_ray: {
            type: 'array',
            items: {
              type: 'string',
              description:
                '用于展示于纵坐标维度的数据，你可能需要提取对应业务维度的数据',
            },
            destination: '线图的纵坐标元素，比如金额、占比等',
          },
          values: {
            type: 'array',
            items: {
              type: 'array',
              items: {
                type: 'number',
                description: '对应的横坐标数据',
              },
              description:
                '用于展示横坐标的数据集合，这个数组的长度应该和x_ray集合的长度相同',
            },
            description:
              '这是用于展示横纵坐标数据的二维数组，它里面的元素是每个横坐标维度的数据数组，这个数组的长度应该和y_ray集合的长度相同',
          },
        },
        required: ['query'],
      },
    },
  },
  // {
  //   type: 'function',
  //   function: {
  //     name: 'draw_candle_chart',
  //     description: `为${data_explain}生成蜡烛图(K线图)。
  //     This function plots a chart showing open, high, low, and close prices of stocks over time, aiding users in identifying trends and patterns.
  //     It's an essential tool for investors analyzing market movements to inform trading decisions. The chart highlights price dynamics and can be adjusted to cover various time periods, supporting both short-term and long-term strategies.`,
  //     parameters: {
  //       type: 'object',
  //       properties: {
  //         query: {
  //           type: 'string',
  //           description:
  //             '用户关于股票或股票市场指数的蜡烛图(K线图)的自然语言查询。',
  //         },
  //         incorporation: {
  //           type: 'string',
  //           description: '股票公司或股票市场指数的名称。',
  //         },
  //       },
  //       required: ['query', 'incorporation'],
  //     },
  //   },
  // },
]

export enum TOOLS_NAMES {
  GET_DATA = 'get_data',
  DRAW_COMPLEX_CHART = 'draw_complex_chart',
  DRAW_PIE_CHART = 'draw_pie_chart',
  DRAW_LINE_BAR_CHART = 'draw_line_bar_chart',
  DRAW_CANDLE_CHART = 'draw_candle_chart',
}

export async function get_data(query: string, size?: number) {
  logger.info({ query, size }, 'call get_data with query:')
  const res = await queryKnowledgeBase<SALES_ORDER_ITEM>({
    query,
    size,
    data_set_id: DATA_SET_ID,
  }).catch((e) => {
    logger.error(e, 'tool get_data error:')
    return 'Nothing got, try again with more context for the query parameter.'
  })
  // logger.info(res, 'get_data done with:')
  if (!res || (typeof res !== 'string' && res?.items.length === 0))
    return 'Nothing retrieved, try again with more context or explain for data you want to retrieve.'
  return 'the response is:' + JSON.stringify(res)
}
