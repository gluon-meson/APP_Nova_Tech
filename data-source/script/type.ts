export type StockData = {
  ticker: string
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type ApiResponse = {
  msg: string
  code: number
  data: StockData[]
}

export type STOCK_INFO = {
  exchange_code: string
  ticker: string | number
  ticker_name: string
  start_date?: string
}

export enum DATA_TYPE {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}
