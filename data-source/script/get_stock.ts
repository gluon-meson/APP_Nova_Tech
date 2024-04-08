import fs from 'fs/promises'

import { loadENV } from './utils'

loadENV()

type StockData = {
  ticker: string
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type ApiResponse = {
  msg: string
  code: number
  data: StockData[]
}

type STOCK_INFO = {
  exchange_code: string
  ticker: string | number
  start_date: string
}

function getStockData(stockInfo: STOCK_INFO, filePath: string) {
  const url = `https://tsanghi.com/api/fin/stock/${stockInfo.exchange_code}/daily?token=${process.env.TSANGHI_TOKEN}&ticker=${stockInfo.ticker}&start_date=${stockInfo.start_date}&order=1`

  fetch(url)
    .then((res) => res.json())
    .then((parsedData: ApiResponse) => {
      if (parsedData.code === 200) {
        fs.writeFile(filePath, JSON.stringify(parsedData.data, null, 2))
          .then(() => console.log(`data had saved in: ${filePath}`))
          .catch((err) => console.error(`error when save data: ${err}`))
      } else {
        console.error('fetch parse json error:', parsedData.msg)
        console.log(parsedData)
      }
    })
    .catch((error) => {
      console.error('fetch error:', error)
    })
}

const colaStockInfo: STOCK_INFO = {
  exchange_code: 'NYSE',
  ticker: 'KO',
  start_date: '2022-04-01',
}

const bookingStockInfo: STOCK_INFO = {
  exchange_code: 'XNAS',
  ticker: 'BKNG',
  start_date: '2022-04-01',
}

getStockData(bookingStockInfo, '../booking_stock_daily.json')
