import { ChatType } from '@/features/query-bot/types'

export type File = {
  id: string
  name: string
}

export type Message = {
  id: string
  type: ChatType
  content: string
}
