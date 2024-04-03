import { AI } from '@/features/chat-bot/action'
import { Chat } from '@/features/chat-bot/component/chat'

export default function Home() {
  return (
    <AI>
      <Chat />
    </AI>
  )
}
