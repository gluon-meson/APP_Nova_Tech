export type STOCK_DATA_ITEM = {
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

export type K_LINE_DATA = Array<
  [string, number, number, number, number, number]
>
