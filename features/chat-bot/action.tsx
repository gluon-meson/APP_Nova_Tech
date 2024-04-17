import { nanoid } from 'ai'
import { createAI, createStreamableUI, getMutableAIState } from 'ai/rsc'
import { logger } from 'lib/shared'
import React from 'react'

import { TextMessage } from '@/features/chat-bot/component/bot-message'

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
      reply.update(<SpinnerWithText text="大模型分析中..." />)
      return res
    },
  )

  completion.onToolCall(
    TOOLS_NAMES.DRAW_CHART,
    async (args: { code: string }) => {
      logger.info(args, 'call DRAW_CHART with args:')
      reply.update(<SpinnerWithText text="图表生成中..." />)
      try {
        if (args.code) {
          toolsStreamUI.append(
            <Mermaid
              chartCode={args.code}
              id={'1'}
            />,
          )
          return 'draw completed, just reply: 图形已经生成，请查看上图。without any other words'
        }
        return 'No data. We can not draw it yet'
      } catch (err) {
        logger.error(err, 'tool DRAW_CHART error:')
      }

      return 'failed, try again'
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
