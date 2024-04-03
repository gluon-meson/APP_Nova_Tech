import { ToolCallPayload } from 'ai'

export enum MessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  TOOL = 'tool',
  FUNCTION = 'function', // not exist in OpenAi
}

export type OPEN_AI_TOOLS_FUNCTION = {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

export type Message =
  | {
      role: MessageRole
      content: string
      /** id will invoke:
       * error: {
         message: "Additional properties are not allowed ('id' was unexpected) - 'messages.1'",
      type: 'invalid_request_error',}
      **/
      id?: string
      name?: string
    }
  | {
      role: MessageRole.TOOL
      content: string
      tool_call_id: string
      name: string
    }
  | {
      role: MessageRole.ASSISTANT
      content: string | null
      tool_calls: OPEN_AI_TOOLS_FUNCTION[]
    }

export type AIState = {
  chatId: string
  messages: Message[]
}

export enum UIStateType {
  USER = 'user',
  SYSTEM = 'system',
}
export type UIState = {
  // todo enhance, currently: Date.now().toString()
  id: string
  type: UIStateType
  display: {
    content: React.ReactNode
    toolContent?: React.ReactNode
  }
}[]
