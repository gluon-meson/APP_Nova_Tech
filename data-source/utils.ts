import bookingStockDaily from './booking_stock_daily.json'

async function getDataForCandleChart() {
  return bookingStockDaily.map((item) => [
    item.date,
    item.open,
    item.close,
    item.low,
    item.high,
    item.volume,
  ]) as Array<[string, number, number, number, number, number]>
}

export { getDataForCandleChart }
