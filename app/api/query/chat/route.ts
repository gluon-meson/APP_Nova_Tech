import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const reqBody = await request.json()
  const res = await fetch(
    'http://bj-3090.private.gluon-meson.tech:1022/score',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    },
  )
  let content = ''
  // @ts-ignore
  const reader = res.body.getReader()

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    const chunk = new TextDecoder('utf-8').decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = JSON.parse(line.substring('data:'.length))

        try {
          const output = data.answer
          content += output
        } catch (error) {
          console.error('JSONDecodeError:', error)
        }
      }
    }
  }
  return NextResponse.json(
    { content: content ? content : 'Chat error, please try again later' },
    { status: 200 },
  )
}
