import { KB_QUERY_RESP } from '@/lib/shared/queryKnowledgeBase'

type ItemDetails = {
  ticker: string
  exchange_code: string
  ticker_name: string
  type: string
  date: string
  open: string
  high: string
  low: string
  close: string
  volume: string
  data_set_id: number
  source: string
}

export type Extended_KB_QUERY_RESP = KB_QUERY_RESP & {
  items: ItemDetails[]
}

function convertData(
  dataArray: ItemDetails[],
): Array<[string, number, number, number, number, number]> {
  return dataArray.map((item) => {
    const date = item.date
    const open = parseFloat(item.open.replace(/\$|,/g, ''))
    const close = parseFloat(item.close.replace(/\$|,/g, ''))
    const low = parseFloat(item.low.replace(/\$|,/g, ''))
    const high = parseFloat(item.high.replace(/\$|,/g, ''))
    const volume = parseFloat(item.volume.replace(/\$|,/g, ''))

    return [date, open, close, low, high, volume]
  })
}

function getDataForCandleStickChart(
  data: Extended_KB_QUERY_RESP | undefined | string,
) {
  if (!data || typeof data === 'string') return []
  return convertData(data.items)
}

export { getDataForCandleStickChart }
