import type OpenAI from 'openai'

import { sleep } from '@/lib/utils'

export const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_current_weather',
      description: 'Get the current weather in a given location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g. San Francisco, CA',
          },
          unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
        },
        required: ['location'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'draw_radar_chart',
      description:
        'Draw a radar chart to show the customer positive, neutral, negative and unknown(no relevant identified for the dimension) for six dimensions statistical feedback data about the insurance product;' +
        'The radar chart will be drawn when the function is called. Context: PolarAngleAxis(recharts) is the six dimensions of the insurance product;' +
        'It shows a comparison of the sum of positive/neutral/negative sentiment/emotion for each dimensions;' +
        'You need to explain the chart more base on the data you got;',
    },
  },
  {
    type: 'function',
    function: {
      name: 'draw_bar_chart',
      description:
        'Draw a radar chart to show the customer positive, neutral, negative and unknown(no relevant identified for the dimension) for six dimensions statistical feedback data about the insurance product;' +
        `The bar chart will be drawn when the function is called. "Context": The chart's X-axis represents six dimensions of the insurance product, with each dimension featuring three bars superposed corresponding to negative, neutral, positive and unknown sentiments. The Y-axis quantifies the total sentiment/emotion responses (for example, all negative responses) collected for the insurance data;` +
        'It shows a comparison of the sum of positive/neutral/negative sentiment/emotion for each dimensions;' +
        'You need to explain the chart more base on the data you got;',
    },
  },
]

const tools_name_map = tools.map((item) => item.function.name)

export enum TOOLS_NAMES {
  GET_WEATHER = 'get_current_weather',
  DRAW_RADAR_CHART = 'draw_radar_chart',
  DRAW_BAR_CHART = 'draw_bar_chart',
}

// example: https://platform.openai.com/docs/guides/function-calling/parallel-function-calling
export async function get_current_weather(location: string, unit: string) {
  await sleep(1000)
  if (location.toLowerCase().includes('tokyo')) {
    return JSON.stringify({
      location: 'Tokyo',
      temperature: '10',
      unit: 'celsius',
    })
  } else if (location.toLowerCase().includes('san francisco')) {
    return JSON.stringify({
      location: 'San Francisco',
      temperature: '72',
      unit: 'fahrenheit',
    })
  } else if (location.toLowerCase().includes('paris')) {
    return JSON.stringify({
      location: 'Paris',
      temperature: '22',
      unit: 'fahrenheit',
    })
  } else {
    return JSON.stringify({ location, temperature: 'unknown' })
  }
}
