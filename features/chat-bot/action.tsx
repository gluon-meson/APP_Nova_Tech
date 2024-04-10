import { nanoid } from 'ai'
import { createAI, createStreamableUI, getMutableAIState } from 'ai/rsc'
import {
  Extended_KB_QUERY_RESP,
  getDataForCandleStickChart,
} from 'data-source/utils'
import { logger } from 'lib/shared'
import React from 'react'

import { TextMessage } from '@/features/chat-bot/component/bot-message'
import { queryKnowledgeBase } from '@/lib/shared/queryKnowledgeBase'
import { sleep } from '@/lib/utils'

import KChart from './component/charts/kChart'
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
      reply.update(<SpinnerWithText text="Data retriving..." />)
      const res = await get_data(args.query, args?.size)
      reply.update(<SpinnerWithText text="LLM analysing..." />)
      return res
    },
  )

  completion.onToolCall(
    TOOLS_NAMES.DRAW_CANDLE_CHART,
    async (args: { query: string; incorporation: string }) => {
      logger.info(args.query, 'call queryKnowledgeBase with query:')
      const res = (await queryKnowledgeBase({
        query: args.query,
        data_set_id: 215,
      }).catch((e) => {
        logger.error(e, 'tool get_data error:')
        return 'Nothing got, try again with more context for the query param'
      })) as Extended_KB_QUERY_RESP | undefined | string
      logger.info(res, 'get_data done with:', JSON.stringify(res))

      const data = getDataForCandleStickChart(res)
      logger.info(
        data,
        'convert data from knowledge base done with:',
        JSON.stringify(res),
      )
      if (data.length === 0) {
        return 'Drawing error, try again with more context for the query param'
      }
      toolsStreamUI.append(
        <KChart
          originalData={data}
          incorporation={args.incorporation}
        />,
      )
      // How do we pass the context of the graph to LLM, the data is too large
      return 'the candlestick chart had been drawn for the stock data'
    },
  )

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
