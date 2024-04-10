import { STOCK_DATA } from '@/features/chat-bot/types'

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>,
) => {
  fn()
}

export const consumeStream = async (stream: ReadableStream) => {
  const reader = stream.getReader()
  while (true) {
    const { done } = await reader.read()
    if (done) break
  }
}

export function convertToNumber(currencyString: string): number | null {
  const cleanedString = currencyString.replace(/[^\d.-]/g, '')

  const result = parseFloat(cleanedString)

  return Number.isNaN(result) ? null : result
}
