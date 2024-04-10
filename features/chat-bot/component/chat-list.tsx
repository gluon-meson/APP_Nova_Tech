import { useUIState } from 'ai/rsc'
import React from 'react'

import { Separator } from '@/components/ui/separator'
import { VolumeAreaChart } from '@/features/chat-bot/component/charts/volume-area-chart'

import type { AI } from '../action'
import { BotMessage } from '../component/bot-message'
import { UserMessage } from '../component/chat-messages'
import { ChatScrollAnchor } from '../component/chat-scroll-anchor'
import { ExampleMessages } from '../component/example-messages'
import { UIState, UIStateType } from '../types'

const data = [
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-04-05',
    volume: '$258,504.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-04-04',
    volume: '$322,745.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-04-03',
    volume: '$255,038.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-04-02',
    volume: '$257,167.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-04-01',
    volume: '$227,670.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-28',
    volume: '$0.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-27',
    volume: '$209,236.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-26',
    volume: '$274,874.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-25',
    volume: '$166,649.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-22',
    volume: '$205,423.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-21',
    volume: '$304,480.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-20',
    volume: '$430,452.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-19',
    volume: '$187,748.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-18',
    volume: '$230,996.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-15',
    volume: '$771,176.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-14',
    volume: '$347,984.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-13',
    volume: '$232,567.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-12',
    volume: '$188,473.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-11',
    volume: '$235,480.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-08',
    volume: '$305,407.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-07',
    volume: '$270,750.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-06',
    volume: '$236,507.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-05',
    volume: '$287,508.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-04',
    volume: '$270,932.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-03-01',
    volume: '$348,526.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-29',
    volume: '$480,863.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-28',
    volume: '$339,601.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-27',
    volume: '$393,033.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-26',
    volume: '$433,414.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-23',
    volume: '$958,463.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-22',
    volume: '$473,969.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-21',
    volume: '$229,502.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-20',
    volume: '$254,940.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-16',
    volume: '$209,708.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-15',
    volume: '$297,468.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-14',
    volume: '$253,719.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-13',
    volume: '$264,129.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-12',
    volume: '$247,311.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-09',
    volume: '$398,963.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-08',
    volume: '$376,525.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-07',
    volume: '$284,887.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-06',
    volume: '$277,027.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-05',
    volume: '$230,877.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-02',
    volume: '$197,612.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-02-01',
    volume: '$196,495.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-31',
    volume: '$186,417.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-30',
    volume: '$185,602.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-29',
    volume: '$219,530.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-26',
    volume: '$209,600.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-25',
    volume: '$278,100.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-24',
    volume: '$260,900.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-23',
    volume: '$238,200.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-22',
    volume: '$456,400.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-19',
    volume: '$235,100.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-18',
    volume: '$223,000.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-17',
    volume: '$182,400.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-16',
    volume: '$173,200.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-12',
    volume: '$167,200.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-11',
    volume: '$167,500.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-10',
    volume: '$148,500.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-09',
    volume: '$224,300.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-08',
    volume: '$264,700.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-05',
    volume: '$321,800.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-04',
    volume: '$176,600.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-03',
    volume: '$327,400.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2024-01-02',
    volume: '$333,400.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-29',
    volume: '$164,500.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-28',
    volume: '$139,700.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-27',
    volume: '$169,000.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-26',
    volume: '$197,700.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-22',
    volume: '$254,900.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-21',
    volume: '$218,000.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-20',
    volume: '$315,900.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-19',
    volume: '$216,400.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-18',
    volume: '$202,000.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-15',
    volume: '$904,300.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-14',
    volume: '$275,400.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-13',
    volume: '$220,000.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-12',
    volume: '$243,000.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-11',
    volume: '$330,700.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-08',
    volume: '$244,900.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-07',
    volume: '$279,300.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-06',
    volume: '$189,100.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-05',
    volume: '$183,700.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-04',
    volume: '$235,800.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-12-01',
    volume: '$205,000.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-30',
    volume: '$255,700.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-29',
    volume: '$155,800.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-28',
    volume: '$180,100.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-27',
    volume: '$253,300.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-24',
    volume: '$117,000.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-22',
    volume: '$192,600.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-21',
    volume: '$184,200.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-20',
    volume: '$227,000.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-17',
    volume: '$212,400.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-16',
    volume: '$259,000.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-15',
    volume: '$284,200.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-14',
    volume: '$298,700.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-13',
    volume: '$241,500.00',
    data_set_id: 215,
    source: 'postgres',
  },
  {
    ticker_name: 'Booking Holdings Inc',
    date: '2023-11-10',
    volume: '$226,400.00',
    data_set_id: 215,
    source: 'postgres',
  },
]

const xAxisData = data.map((item) => item.date)
const yAxisData = data.map((item) => item.volume)

export const ChatList = () => {
  const [messages, setMessages] = useUIState<typeof AI>()
  return (
    <div className="mx-auto mb-20 mt-6 max-w-4xl md:pl-4">
      <div className="rounded-lg border bg-background p-4 pb-10">
        {messages.length === 0 && <ExampleMessages setMessages={setMessages} />}
        {messages.map((ui, index) => {
          let content: React.ReactNode = ''
          if (ui.type === UIStateType.USER)
            content = <UserMessage>{ui.display.content}</UserMessage>
          else if (ui.type === UIStateType.SYSTEM) {
            content = (
              <BotMessage
                content={ui.display.content}
                toolContent={ui.display.toolContent}
              />
            )
          }
          return (
            <div key={ui.id}>
              {content}
              {index < messages.length - 1 && <Separator className="my-4" />}
            </div>
          )
        })}
        <ChatScrollAnchor trackVisibility={true} />
      </div>
    </div>
  )
}
