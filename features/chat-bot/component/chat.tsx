'use client'

import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'
import { HintCard } from './hint-card'

export const Chat = () => {
  return (
    <>
      <HintCard />
      <ChatList />
      <ChatPanel />
    </>
  )
}
