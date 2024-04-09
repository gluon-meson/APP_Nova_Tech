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
  const { value } = await reader.read()

  const decodeText = new TextDecoder('utf-8').decode(value)

  if (decodeText.startsWith('data:')) {
    const data = JSON.parse(decodeText.substring('data:'.length))
    try {
      content = data.answer
    } catch (error) {
      console.log('json parse error in get chat response', error)
    }
  }
  return NextResponse.json({ content }, { status: 200 })
}
