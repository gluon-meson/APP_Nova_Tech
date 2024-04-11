import { ATR, RSI, SMA } from 'technicalindicators'

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

export const getKeyInfoFromData = (data: KB_QUERY_RESP<STOCK_DATA_ITEM>) => {
  // Extract high, low, closing, and volume arrays
  const highPrices = data.items.map((item) =>
    convertCurrencyToNumber(item.high),
  )
  const lowPrices = data.items.map((item) => convertCurrencyToNumber(item.low))
  const closePrices = data.items.map((item) =>
    convertCurrencyToNumber(item.close),
  )
  const volumes = data.items.map((item) => convertCurrencyToNumber(item.volume))

  // Calculation of technical indicators
  const periodForATR = 14
  const periodForVolumeSMA = 30
  const periodForRSI = 14

  const rsiValues = RSI.calculate({ period: periodForRSI, values: closePrices })
  const atrValues = ATR.calculate({
    high: highPrices,
    low: lowPrices,
    close: closePrices,
    period: periodForATR,
  })
  const volumeSMAValues = SMA.calculate({
    period: periodForVolumeSMA,
    values: volumes,
  })

  // Calculate basic statistics
  const averageClose =
    closePrices.reduce((acc, val) => acc + val, 0) / closePrices.length
  const highestClose = Math.max(...closePrices)
  const lowestClose = Math.min(...closePrices)
  const averageVolume =
    volumes.reduce((acc, val) => acc + val, 0) / volumes.length

  // Extract additional information
  const maxVolume = Math.max(...volumes)
  const minVolume = Math.min(...volumes)
  const maxVolumeDate = data.items[volumes.indexOf(maxVolume)].date
  const minVolumeDate = data.items[volumes.indexOf(minVolume)].date

  const rsiMax = Math.max(...rsiValues)
  const rsiMin = Math.min(...rsiValues)
  const rsiMaxDate =
    data.items[rsiValues.indexOf(rsiMax) + periodForRSI - 1].date
  const rsiMinDate =
    data.items[rsiValues.indexOf(rsiMin) + periodForRSI - 1].date

  const startDate = data.items[0].date
  const endDate = data.items[data.items.length - 1].date

  const report =
    `Data Time Range: from ${startDate} to ${endDate}, covering a total span of ${data.items.length} trading days.;` +
    `Average close price: ${averageClose};` +
    `Highest close price: ${highestClose};` +
    `Lowest close price: ${lowestClose};` +
    `Average trading volume: ${averageVolume};` +
    `The maximum volume was ${maxVolume} on ${maxVolumeDate}, indicating a day of particularly high trading activity.;` +
    `The minimum volume was ${minVolume} on ${minVolumeDate}, suggesting a day with low trading interest.;` +
    `The highest RSI value within the period was ${rsiMax} on ${rsiMaxDate}, possibly indicating an overbought condition.;` +
    `The lowest RSI value was ${rsiMin} on ${rsiMinDate}, potentially indicating an oversold condition.;` +
    `The latest ATR value is ${atrValues[atrValues.length - 1]}, showing the recent volatility level.;` +
    `The latest 30-day volume SMA is ${volumeSMAValues[volumeSMAValues.length - 1]}, illustrating the average trading volume over the past month.`

  return report
}