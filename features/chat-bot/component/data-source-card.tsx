import { ClockIcon, PlusCircleIcon } from 'lucide-react'

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
    <div className="fixed top-8 z-10 mb-8 hidden w-72 overflow-auto rounded-lg bg-background p-2 shadow md:block lg:w-80 lg:p-4">
      <h4 className="flex scroll-m-20 items-center text-2xl font-semibold tracking-tight">
        <ClockIcon
          className="mr-2"
          size={32}
        />{' '}
        历史会话｜
        <PlusCircleIcon
          className="mr-2"
          size={32}
        />{' '}
        新会话
      </h4>
    </div>
  )
}
