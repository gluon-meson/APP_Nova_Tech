import { useUIState } from 'ai/rsc'

import { Separator } from '@/components/ui/separator'

import type { AI } from '../action'
import { BotMessage } from '../component/bot-message'
import { UserMessage } from '../component/chat-messages'
import { ChatScrollAnchor } from '../component/chat-scroll-anchor'
import { ExampleMessages } from '../component/example-messages'
import { UIState, UIStateType } from '../types'

export const ChatList = () => {
  const [messages, setMessages] = useUIState<typeof AI>()
  return (
    <div className="mx-auto mt-6 max-w-3xl px-4">
      <div className="rounded-lg border bg-background p-4 pb-10">
        {messages.length === 0 && <ExampleMessages setMessages={setMessages} />}
        {messages.map((ui, index) => {
          let content: React.ReactNode = ''
          if (ui.type === UIStateType.USER)
            content = <UserMessage>{ui.display.content}</UserMessage>
          else if (ui.type === UIStateType.SYSTEM) {
            content = (
              <BotMessage
                content={ui.display.content}
                toolContent={ui.display.toolContent}
              />
            )
          }
          return (
            <div key={ui.id}>
              {content}
              {index < messages.length - 1 && <Separator className="my-4" />}
            </div>
          )
        })}
        <ChatScrollAnchor trackVisibility={true} />
      </div>
    </div>
  )
}
