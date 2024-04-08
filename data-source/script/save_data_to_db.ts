import fs from 'fs/promises'
import { Client } from 'pg'

import { loadENV } from './utils'

loadENV()

const client = new Client({
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'wealth_management',
})

async function getStockData(path: string) {
  try {
    const data = await fs.readFile(path)
    return JSON.parse(data.toString())
  } catch (error) {
    console.error('load file error with:', error)
  }
}

async function saveData(path: string) {
  try {
    console.log('running...')
    const start = process.hrtime()
    const jsonData = await getStockData(path)
    await client.connect()
    const insertQueries = jsonData.map((row: any) => ({
      query:
        'INSERT INTO stock(ticker, date, open, high, low, close, volume, ticker_name, exchange_code, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      values: [
        row.ticker,
        row.date,
        row.open,
        row.high,
        row.low,
        row.close,
        row.volume,
        row.ticker_name,
        row.exchange_code,
        row.type,
      ],
    }))
    for (const { query, values } of insertQueries) {
      await client.query(query, values)
    }
    console.log('done')
    const end = process.hrtime(start)
    console.log(`execute time: ${end[0]}s ${end[1] / 1000000}ms`)
  } catch (e) {
    console.error(e)
  } finally {
    await client.end()
  }
}

// saveData('../stock-data/BKNG_stock_yearly.json')
saveData('../stock-data/CSCO_stock_daily.json')
