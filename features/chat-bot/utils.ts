import { K_LINE_DATA, STOCK_DATA_ITEM } from '@/features/chat-bot/types'
import { convertCurrencyToNumber } from '@/lib/shared'
import { KB_QUERY_RESP } from '@/lib/shared/queryKnowledgeBase'

export const covertDataForLine = (
  data: KB_QUERY_RESP<STOCK_DATA_ITEM>,
): K_LINE_DATA => {
  const covertKeys = ['open', 'close', 'low', 'high', 'volume'] as const
  return data.items
    .map((item) => {
      const date = item.date

      const allKeysDefined = covertKeys.every((key) => item[key] !== undefined)
      if (!allKeysDefined) {
        return []
      }

      const convertedItems = covertKeys.map((key) => {
        return convertCurrencyToNumber(item[key])
      })
      return [date, ...convertedItems]
    })
    .filter((item) => item.length > 0) as K_LINE_DATA
}
