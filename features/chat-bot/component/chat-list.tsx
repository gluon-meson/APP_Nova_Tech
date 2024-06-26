import { useUIState } from 'ai/rsc'
import React from 'react'

import { Separator } from '@/components/ui/separator'

import type { AI } from '../action'
import { BotMessage } from '../component/bot-message'
import { UserMessage } from '../component/chat-messages'
import { ChatScrollAnchor } from '../component/chat-scroll-anchor'
import { UIStateType } from '../types'

export const ChatList = () => {
  const [messages, _] = useUIState<typeof AI>()
  return (
    <div className="mx-auto mb-20 mt-6 max-w-4xl md:pl-4">
      <div className="rounded-lg border-0 p-4 pb-10">
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
