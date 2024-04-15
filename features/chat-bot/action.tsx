import { nanoid } from 'ai'
import { createAI, createStreamableUI, getMutableAIState } from 'ai/rsc'
import { logger } from 'lib/shared'
import React from 'react'

import { TextMessage } from '@/features/chat-bot/component/bot-message'
import { sleep } from '@/lib/utils'
import { SpinnerWithText } from './component/chat-messages'
import { runOpenAICompletion } from './runOpenAICompletion'
import { get_current_weather, get_data, TOOLS_NAMES } from './tools'
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

  const reply = createStreamableUI(<SpinnerWithText text="processing..." />)

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
    TOOLS_NAMES.GET_WEATHER,
    async (functionArgs: Record<string, unknown>) => {
      logger.info(functionArgs, 'call get weather with arg:')
      reply.update(
        <SpinnerWithText text="Retriving weather information now.." />,
      )
      await sleep(2000)
      // @ts-ignore
      return get_current_weather(functionArgs.location, functionArgs.unit)
    },
  )

  completion.onToolCall(
    TOOLS_NAMES.GET_DATA,
    async (args: { query: string; size?: number }) => {
      reply.update(<SpinnerWithText text="数据检索中..." />)
      const res = await get_data(args.query, args?.size)
      reply.update(<SpinnerWithText text="大模型分析中..." />)
      return res
    },
  )

  // completion.onToolCall(
  //   TOOLS_NAMES.DRAW_LINE_BAR_CHART,
  //   async (args: {
  //     query: string[]
  //     data_key: keyof STOCK_DATA_ITEM
  //     data_belongs: string[]
  //     size?: number
  //   }) => {
  //     logger.info(args, 'call DRAW_LINE_BAR_CHART with args:')
  //     reply.update(<SpinnerWithText text="Data retriving..." />)
  //     try {
  //       const { query, data_belongs, data_key, size = 100 } = args
  //       const data = await Promise.all(
  //         query?.map((item) => {
  //           return queryKnowledgeBase<STOCK_DATA_ITEM>({
  //             query: item,
  //             size,
  //             data_set_id: DATA_SET,
  //           })
  //         }),
  //       )
  //       const { dates, values } = extractValues(
  //         data.map((arr) => arr.items),
  //         data_key,
  //       )
  //
  //       logger.trace(
  //         { dates, values },
  //         'call DRAW_LINE_BAR_CHART with extractValues:',
  //       )
  //
  //       if (Array.isArray(dates) && dates.length > 0) {
  //         toolsStreamUI.append(
  //           <LineBarChart
  //             name={data_key}
  //             xAxisData={dates}
  //             yAxisData={values}
  //             dataBelongs={data_belongs}
  //           />,
  //         )
  //         reply.update(<SpinnerWithText text="LLM analysing..." />)
  //         return `the chart had draw with data: xAxis: ${JSON.stringify(dates)} and yAxis: ${JSON.stringify(values)}}, explain the chart and give a summary or insight within 100 words`
  //       }
  //       return 'the data retrieved is not right, can not draw chart, try again'
  //     } catch (err) {
  //       logger.error(err, 'tool DRAW_LINE_BAR_CHART error:')
  //     }
  //
  //     return 'failed, try again'
  //   },
  // )

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
