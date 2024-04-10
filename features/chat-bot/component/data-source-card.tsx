import { FolderSearch2Icon, LineChartIcon, TrendingUpIcon } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

type DATA_ITEM = {
  type: 'stock' | 'index'
  name: string
  ticker: string
  exchange_code: string
}
const dataSourceList: DATA_ITEM[] = [
  {
    type: 'stock',
    name: 'Booking Holdings Inc',
    ticker: 'BKNG',
    exchange_code: 'XNAS',
  },
  {
    type: 'stock',
    name: 'Cisco Systems Inc',
    ticker: 'CSCO',
    exchange_code: 'XNAS',
  },
  {
    type: 'stock',
    name: 'Coca-Cola Co',
    ticker: 'KO',
    exchange_code: 'XNYS',
  },
  {
    type: 'stock',
    name: 'Westlake Corp',
    ticker: 'WLK',
    exchange_code: 'XNYS',
  },
  {
    type: 'index',
    name: 'Nasdaq 100',
    ticker: 'NDX',
    exchange_code: 'XNAS',
  },
  {
    type: 'index',
    name: 'S&P 500 Index',
    ticker: 'GSPC',
    exchange_code: 'XNAS,XNYS',
  },
]
export const DataSourceCard = () => {
  return (
    <div className="hidden w-72 rounded-lg bg-background p-2 shadow md:block lg:w-80 lg:p-4">
      <h3 className="flex scroll-m-20 items-center text-2xl font-semibold tracking-tight">
        <FolderSearch2Icon
          className="mr-2"
          size={32}
        />{' '}
        Data Source
      </h3>
      <Separator className="my-4" />
      <h4 className="tracking-tigh mb-2 flex scroll-m-20 items-center text-xl font-semibold">
        <LineChartIcon
          className="mr-2"
          size={22}
        />
        Stock
      </h4>
      <p className="text-sm">
        Daily, weekly, monthly, and yearly K-line chart data over the past three
        years for the below companies:
      </p>
      <ul className="my-4 ml-4 list-disc [&>li]:mt-2">
        {dataSourceList
          .filter((item) => item.type === 'stock')
          .map((stock) => {
            return (
              <li
                key={stock.ticker}
                // className="flex h-12 items-center truncate rounded bg-gray-100 p-2"
              >
                {stock.name}
              </li>
            )
          })}
      </ul>
      <Separator className="my-4" />
      <h4 className="mb-2 flex scroll-m-20 items-center text-xl font-semibold tracking-tight">
        <TrendingUpIcon
          className="mr-2"
          size={22}
        />
        Index
      </h4>
      <p className="text-sm">
        Daily K-line chart data over the past three years for the below Indexs:
      </p>
      <ul className="my-4 ml-4 list-disc [&>li]:mt-2">
        {dataSourceList
          .filter((item) => item.type === 'index')
          .map((stock) => {
            return (
              <li
                key={stock.ticker}
                // className="flex h-12 items-center truncate rounded bg-gray-100 p-2"
              >
                {stock.name}
              </li>
            )
          })}
      </ul>
    </div>
  )
}
