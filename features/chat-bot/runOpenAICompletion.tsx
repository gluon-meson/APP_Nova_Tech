import { OpenAIStream } from 'ai'
import { createStreamableUI, getAIState, getMutableAIState } from 'ai/rsc'
import { consumeStream, logger, runAsyncFnWithoutBlocking } from 'lib/shared'
import React from 'react'

import { AI } from './action'
import { prompt } from './constants'
import { getOpenaiClient, GPT_MODEL } from './openaiClient'
import { tools, TOOLS_NAMES } from './tools'
import { Message, MessageRole } from './types'

const MAX_CALLS = 5 // Set a limit on the number of calls

const callLLM = async () => {
  const aiState = getAIState() // readonly
  logger.info(aiState, 'call LLM getAIState')
  try {
    const openaiClient = getOpenaiClient()
    const resp = await openaiClient.chat.completions.create({
      model: GPT_MODEL,
      stream: true,
      tools: tools,
      tool_choice: 'auto',
      temperature: 0.2, // todo adjust it
      messages: [
        { role: MessageRole.SYSTEM, content: prompt },
        ...aiState.messages.map((message: any) => {
          const { id, ...newItem } = message
          return newItem
        }),
      ],
      max_tokens: 3000, // todo remove
    })
    logger.info(aiState?.id, 'creating completion succeed')
    return resp
  } catch (error) {
    logger.error(error, 'Error creating completion:')
    throw error
  }
}

export function runOpenAICompletion(
  streamableUI: ReturnType<typeof createStreamableUI>,
) {
  let callCounter = 0 // in case infinite recursion
  const aiState = getMutableAIState<typeof AI>()

  let outputText = ''

  // const valueStream = createStreamableValue('') // todo: To update text?

  let startTextOutput = true

  let onTextContent: (text: string, isFinal: boolean) => void = () => {}

  let onToolsCall = {} as any

  runAsyncFnWithoutBlocking(async () => {
    try {
      await consumeStream(
        OpenAIStream(await callLLM(), {
          // {"tool_calls":[ {"id": "call_z2OUNYPg6zPnWqrQDocRA7Qs", "type": "function", "function": {"name": "get_data_by_sql", "arguments": "{}"}}]}
          async experimental_onToolCall(
            toolCallPayload,
            appendToolCallMessage,
          ) {
            callCounter++
            if (callCounter > MAX_CALLS) {
              logger.info(
                {
                  callCounter,
                },
                'Maximum tool limit of callCounter exceeded',
              )
              return Promise.reject(
                new Error(`Maximum tool limit of ${MAX_CALLS} exceeded`),
              )
            }
            logger.info(toolCallPayload, 'tools called with payload: ')
            const tools_messages: Message[] = []
            if (toolCallPayload.tools.length > 0) {
              tools_messages.push({
                role: MessageRole.ASSISTANT,
                content: null,
                tool_calls: toolCallPayload.tools.map((tool_call) => ({
                  id: tool_call.id,
                  type: 'function',
                  // in vercel AI is func, but open AI only receive function
                  function: {
                    name: tool_call.func.name,
                    arguments: JSON.stringify(tool_call.func.arguments),
                  },
                })),
              })
            }
            for (const toolCall of toolCallPayload.tools) {
              const called_name = toolCall.func.name
              const args = toolCall.func.arguments
              if (onToolsCall[called_name]) {
                const resp = await onToolsCall[called_name](args)
                tools_messages.push({
                  role: MessageRole.TOOL,
                  tool_call_id: toolCall.id,
                  name: called_name,
                  content: resp, // todo  JSON.stringify()?
                })
              }
            }
            aiState.update({
              ...aiState.get(),
              messages: [...aiState.get().messages, ...tools_messages],
            })
            return callLLM()
          },
          onStart() {
            logger.info('on Start...........')
          },
          onText(text) {},
          // Called for each tokenized message.
          onToken(token) {
            if (token.includes('tool_calls')) {
              startTextOutput = false
            }
            // if (text.startsWith('{')) return
            if (startTextOutput) {
              outputText += token
              onTextContent(outputText, false)
            }
          },
          onCompletion(completion) {
            startTextOutput = true
            logger.info({ completion }, 'onCompletion')
          },
          onFinal() {
            logger.info({ outputText }, 'onFinal')
            onTextContent(outputText, true)
          },
        }),
      )
    } catch (e) {
      logger.error(e, 'runOpenAICompletion async IIFE')
      streamableUI.done(<p>Sorry, some error happening</p>)
    }
  })

  return {
    onTextContent: (
      callback: (text: string, isFinal: boolean) => void | Promise<void>,
    ) => {
      onTextContent = callback
    },
    onToolCall: (
      name: TOOLS_NAMES,
      callback: (arg: any) => void | string | Promise<any>,
    ) => (onToolsCall[name] = callback),
  }
}
