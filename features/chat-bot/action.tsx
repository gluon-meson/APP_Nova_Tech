import { nanoid } from 'ai'
import { createAI, createStreamableUI, getMutableAIState } from 'ai/rsc'
import React from 'react'

import { TextMessage } from '@/features/chat-bot/component/bot-message'
import { logger } from '@/lib/server'
import { sleep } from '@/lib/utils'

import { SpinnerWithText } from './component/chat-messages'
import { runOpenAICompletion } from './runOpenAICompletion'
import { get_current_weather, TOOLS_NAMES } from './tools'
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

  completion.onToolCall(TOOLS_NAMES.DRAW_BAR_CHART, async () => {
    return (
      'the bar chart had drawn for the statistical data:' + JSON.stringify({})
    )
  })

  completion.onToolCall(TOOLS_NAMES.DRAW_RADAR_CHART, async () => {
    return (
      'the radar chart had drawn for the statistical data: ' +
      JSON.stringify({})
    )
  })

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
