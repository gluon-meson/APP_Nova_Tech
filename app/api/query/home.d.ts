import { ChatType } from '@/features/query-bot/types'

export type File = {
  id: string
  name: string
}

export type Reference = {
  data_set_id: number
  meta__source_type: string
  meta__source_name: string
  meta__source_text: string
  meta__source_score: number
}

export type Message = {
  id: string
  type: ChatType
  content: string
  references?: Reference[]
}

export type ChatInfo = {
  question: string
  conversation_id: string
  user_id: string
}
