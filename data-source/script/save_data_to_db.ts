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

async function getStockData() {
  try {
    const data = await fs.readFile('../booking_stock_daily.json')
    return JSON.parse(data.toString())
  } catch (error) {
    console.error('load file error with:', error)
  }
}

async function saveData() {
  try {
    const jsonData = await getStockData()
    await client.connect()
    const insertQueries = jsonData.map((row: any) => ({
      query:
        'INSERT INTO stock_daily_prices(ticker, date, open, high, low, close, volume) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [
        row.ticker,
        row.date,
        row.open,
        row.high,
        row.low,
        row.close,
        row.volume,
      ],
    }))
    for (const { query, values } of insertQueries) {
      await client.query(query, values)
    }
  } catch (e) {
    console.error(e)
  } finally {
    await client.end()
  }
}

saveData()
