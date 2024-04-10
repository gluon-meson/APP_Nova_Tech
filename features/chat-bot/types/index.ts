export * from './chat'
export * from './tool-definition'

export type STOCK_DATA = {
  ticker: string
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  exchange_code: string
  type: string
  ticker_name: string
}
