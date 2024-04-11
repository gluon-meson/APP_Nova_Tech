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

export function convertCurrencyToNumber(
  currencyString: string | number,
): number {
  const cleanedString = currencyString.toString().replace(/[^\d.-]/g, '')

  const result = parseFloat(cleanedString)

  return Number.isNaN(result) ? 0 : result
}
