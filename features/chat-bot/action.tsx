import { nanoid } from 'ai'
import { createAI, createStreamableUI, getMutableAIState } from 'ai/rsc'
import { logger } from 'lib/shared'
import React from 'react'

import { TextMessage } from '@/features/chat-bot/component/bot-message'
import {
  LineBarChart,
  PieChart,
} from '@/features/chat-bot/component/charts/line-bar-chart'

import { Mermaid } from './component/charts/mermaid-chart'
import { SpinnerWithText } from './component/chat-messages'
import { runOpenAICompletion } from './runOpenAICompletion'
import { get_data, TOOLS_NAMES } from './tools'
import { AIState, MessageRole, UIState, UIStateType } from './types'

async function submitUserMessage(userInput: string): Promise<UIState[number]> {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  logger.info({ userInput }, 'user input start to chat')
  // Update the AI state with the new user message.
  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        role: MessageRole.USER,
        content: userInput,
      },
    ],
  })

  const reply = createStreamableUI(<SpinnerWithText text="处理中..." />)

  const toolsStreamUI = createStreamableUI('')

  const completion = runOpenAICompletion(reply)

  completion.onTextContent((content: string, isFinal: boolean) => {
    reply.update(<TextMessage text={content} />)
    if (isFinal) {
      reply.done(<TextMessage text={content} />)
      toolsStreamUI.done()
      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            role: MessageRole.ASSISTANT,
            content: content,
          },
        ],
      })
    }
  })

  completion.onToolCall(
    TOOLS_NAMES.GET_DATA,
    async (args: { query: string; size?: number }) => {
      reply.update(<SpinnerWithText text="数据检索中..." />)
      const res = await get_data(args.query, args?.size)
      reply.update(<SpinnerWithText text="分析中..." />)
      return res
    },
  )

  completion.onToolCall(
    TOOLS_NAMES.DRAW_COMPLEX_CHART,
    async (args: { code: string }) => {
      logger.info(args, 'call DRAW_COMPLEX_CHART with args:')
      reply.update(<SpinnerWithText text="图表生成中..." />)
      try {
        if (args.code) {
          toolsStreamUI.append(
            <Mermaid
              chartCode={args.code}
              id={'1'}
            />,
          )
          return 'The drawing has been completed by myself, You do not need to answer anything, just return to empty'
        }
        return 'No data. We can not draw it yet'
      } catch (err) {
        logger.error(err, 'tool DRAW_CHART error:')
      }

      return 'failed, try again'
    },
  )

  completion.onToolCall(
    TOOLS_NAMES.DRAW_PIE_CHART,
    async (args: {
      title: string
      data: [{ value: number; name: string }]
    }) => {
      logger.info(args, 'call DRAW_PIE_CHART with args:')
      reply.update(<SpinnerWithText text="图表生成中..." />)
      try {
        if (args.title && args.data) {
          toolsStreamUI.append(
            <PieChart
              title={args.title}
              data={args.data}
            />,
          )
          return 'The drawing has been completed by myself, You do not need to answer anything, just return to empty'
        }
        return 'No data. We can not draw it yet'
      } catch (err) {
        logger.error(err, 'tool DRAW_CHART error:')
      }

      return 'failed, try again'
    },
  )

  completion.onToolCall(
    TOOLS_NAMES.DRAW_LINE_BAR_CHART,
    async (args: {
      query: string
      title: string
      x_ray: string[]
      y_ray: string[]
      values: number[][]
    }) => {
      logger.info(args, 'call DRAW_LINE_BAR_CHART with args:')
      reply.update(<SpinnerWithText text="图表生成中..." />)
      try {
        if (Array.isArray(args.x_ray) && args.x_ray.length > 0) {
          toolsStreamUI.append(
            <LineBarChart
              name={args.title}
              xAxisData={args.x_ray}
              yAxisData={args.values}
              dataBelongs={args.y_ray}
            />,
          )
          return 'The drawing has been completed by myself, You do not need to answer anything, just return to empty'
        }
        return 'No data. We can not draw it yet'
      } catch (err) {
        logger.error(err, 'tool DRAW_LINE_BAR_CHART error:')
      }

      return 'failed, try again'
    },
  )

  // completion.onToolCall(
  //   TOOLS_NAMES.DRAW_CANDLE_CHART,
  //   async (args: { query: string; incorporation: string }) => {
  //     reply.update(<SpinnerWithText text="Data retriving..." />)
  //     logger.info(args.query, 'call DRAW_CANDLE_CHART with query:')
  //     const res = await queryKnowledgeBase<STOCK_DATA_ITEM>({
  //       query: args.query,
  //       data_set_id: DATA_SET,
  //     }).catch((e) => {
  //       logger.error(e, 'tool DRAW_CANDLE_CHART error:')
  //       return 'Nothing got, try again with more context for the query param'
  //     })
  //
  //     if (
  //       typeof res === 'string' ||
  //       res?.items.length === 0 ||
  //       !res?.items.every((item) => isAllKeyDefined(item))
  //     ) {
  //       return 'Drawing error, try again with more context for the query param'
  //     }
  //     const deduplicatedRes = deduplicateItemsByDate(
  //       res as KB_QUERY_RESP<STOCK_DATA_ITEM>,
  //     )
  //
  //     const data = covertDataForLine(deduplicatedRes)
  //
  //     logger.info(data, 'convert data from knowledge base done with:')
  //     toolsStreamUI.append(
  //       <KChart
  //         originalData={data}
  //         incorporation={args.incorporation}
  //       />,
  //     )
  //     // How do we pass the context of the graph to LLM, the data is too large
  //     const keyInfo = getKeyInfoFromData(deduplicatedRes)
  //     return `The candlestick chart has been drawn for the data, showcasing these key info: ${keyInfo}, please provide summary/insight/explain for it.`
  //   },
  // )

  return {
    id: Date.now().toString(),
    type: UIStateType.SYSTEM,
    display: {
      content: reply.value,
      toolContent: toolsStreamUI.value,
    },
  }
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: AIState = { chatId: nanoid(16), messages: [] }

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: UIState = []

// AI is a provider you wrap your application with, so you can access AI and UI state in your components.
export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState,
})
