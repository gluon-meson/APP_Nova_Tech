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
      name: 'draw_line_bar_chart',
      description: `可以为用户查找出来的数据通过绘制条形图或者柱状图来进行图形呈现。`,
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
                description: '对应的横坐标每项数据',
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
]

export enum TOOLS_NAMES {
  GET_DATA = 'get_data',
  DRAW_LINE_BAR_CHART = 'draw_line_bar_chart',
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
