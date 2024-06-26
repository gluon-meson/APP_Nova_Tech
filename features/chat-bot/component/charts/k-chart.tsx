'use client'
import * as echarts from 'echarts'
import React, { useEffect, useRef } from 'react'

import { K_LINE_DATA } from '@/features/chat-bot/types'

const upColor = '#00da3c'
const downColor = '#ec0000'

function splitData(rawData: K_LINE_DATA) {
  let categoryData: string[] = []
  let values: number[][] = []
  let volumes: (number | string)[][] = []

  for (let i = 0; i < rawData.length; i++) {
    const [date, open, close, low, high, volume] = rawData[i]
    categoryData.push(date)
    values.push([open, close, low, high, volume])
    volumes.push([i, volume, open > close ? 1 : -1])
  }

  return {
    categoryData,
    values,
    volumes,
  }
}

function calculateMA(dayCount: number, data: { values: number[][] }) {
  let result = []
  for (let i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-')
      continue
    }
    let sum = 0
    for (let j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1]
    }
    result.push(+(sum / dayCount).toFixed(3))
  }
  return result
}

export default function KChart({
  originalData,
  incorporation,
}: {
  originalData: K_LINE_DATA
  incorporation: string
}) {
  const chartRef = useRef(null)

  useEffect(() => {
    let chartInstance = echarts.init(chartRef.current)

    const data = splitData(originalData)

    let option = {
      animation: false,
      legend: {
        bottom: 10,
        left: 'center',
        data: [incorporation, 'MA5', 'MA10', 'MA20', 'MA30'],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
          color: '#000',
        },
        position: function (
          pos: number[],
          params: any,
          el: any,
          elRect: any,
          size: { viewSize: number[] },
        ) {
          const obj: Record<string, number> = {
            top: 10,
          }
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
          return obj
        },
        extraCssText: 'width: 170px',
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: 'all',
          },
        ],
        label: {
          backgroundColor: '#777',
        },
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: false,
          },
          brush: {
            type: ['lineX', 'clear'],
          },
        },
      },
      brush: {
        xAxisIndex: 'all',
        brushLink: 'all',
        outOfBrush: {
          colorAlpha: 0.1,
        },
      },
      visualMap: {
        show: false,
        seriesIndex: 5,
        dimension: 2,
        pieces: [
          {
            value: 1,
            color: downColor,
          },
          {
            value: -1,
            color: upColor,
          },
        ],
      },
      grid: [
        {
          left: '10%',
          right: '8%',
          height: '50%',
        },
        {
          left: '10%',
          right: '8%',
          top: '63%',
          height: '16%',
        },
      ],
      xAxis: [
        {
          type: 'category',
          data: data.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            z: 100,
          },
        },
        {
          type: 'category',
          gridIndex: 1,
          data: data.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          min: 'dataMin',
          max: 'dataMax',
        },
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true,
          },
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 0,
          end: 60,
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          top: '85%',
          start: 0,
          end: 60,
        },
      ],
      series: [
        {
          name: incorporation,
          type: 'candlestick',
          data: data.values,
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: null,
            borderColor0: null,
          },
        },
        {
          name: 'MA5',
          type: 'line',
          data: calculateMA(5, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'MA10',
          type: 'line',
          data: calculateMA(10, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'MA20',
          type: 'line',
          data: calculateMA(20, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'MA30',
          type: 'line',
          data: calculateMA(30, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: data.volumes,
        },
      ],
    }

    chartInstance.setOption(option)

    return () => {
      chartInstance.dispose()
    }
  }, [originalData])

  return (
    <div
      ref={chartRef}
      style={{ height: '500px', width: '100%' }}
    />
  )
}
