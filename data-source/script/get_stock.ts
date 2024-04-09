import fs from 'fs'

import { ApiResponse, DATA_TYPE, STOCK_INFO } from './type'
import { loadENV } from './utils'

loadENV()

function getStockData(stockInfo: STOCK_INFO, data_type: DATA_TYPE) {
  const { exchange_code, ticker, ticker_name, start_date } = stockInfo
  const filePath = `../stock-data/${ticker}_stock_${data_type}.json`

  const url = `https://tsanghi.com/api/fin/stock/${exchange_code}/${data_type}?token=${process.env.TSANGHI_TOKEN}&ticker=${ticker}&order=1`

  fetch(url)
    .then((res) => res.json())
    .then((parsedData: ApiResponse) => {
      if (parsedData.code === 200) {
        const mapData = parsedData.data.map((item) => ({
          ...item,
          ticker_name: ticker_name,
          exchange_code: exchange_code,
          type: data_type,
        }))
        const writeStream = fs.createWriteStream(filePath)
        writeStream.write(JSON.stringify(mapData, null, 2))
        writeStream.end()
        writeStream.on('finish', () => {
          console.log(`Data has been saved in: ${filePath}`)
        })
        writeStream.on('error', (err) => {
          console.error(`Error when saving data: ${err}`)
        })
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
  exchange_code: 'XNYS',
  ticker: 'KO',
  ticker_name: 'Coca-Cola Co',
}

const bookingStockInfo: STOCK_INFO = {
  exchange_code: 'XNAS',
  ticker: 'BKNG',
  // start_date: '2021-04-08',
  ticker_name: 'Booking Holdings Inc',
}

const ciscoStockInfo: STOCK_INFO = {
  exchange_code: 'XNAS',
  ticker: 'CSCO',
  ticker_name: 'Cisco Systems Inc',
}

const westlakeStockInfo: STOCK_INFO = {
  exchange_code: 'XNYS', // New York Stock Exchange
  ticker: 'WLK',
  ticker_name: 'Westlake Corp',
}

// getStockData(bookingStockInfo, DATA_TYPE.DAILY)
// getStockData(ciscoStockInfo, DATA_TYPE.DAILY)
// getStockData(westlakeStockInfo, DATA_TYPE.DAILY)
// getStockData(colaStockInfo, DATA_TYPE.MONTHLY)
