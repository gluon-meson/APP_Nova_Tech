'use client'

import * as echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import React from 'react'

export const LineBarChart = ({
  xAxisData,
  yAxisData,
  name,
}: {
  xAxisData: string[]
  yAxisData: number[]
  name: string
}) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: {
          show: true,
          type: ['line', 'bar'],
        },
        dataZoom: {
          yAxisIndex: 'none',
        },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    // legend: {
    //   data: ['Volume'],
    // },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
    },
    yAxis: [
      {
        type: 'value',
        name: name,
        min: 0,
        position: 'right',
        axisLabel: {
          formatter: '{value}',
        },
        boundaryGap: [0, '20%'],
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 40,
        end: 100,
      },
      {
        start: 40,
        end: 100,
      },
    ],
    series: [
      {
        name: name,
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(255, 70, 131)',
        },
        data: yAxisData,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 158, 68)',
            },
            {
              offset: 1,
              color: 'rgb(255, 70, 131)',
            },
          ]),
        },
        // itemStyle: {
        //   normal: {
        //     color: '#3398DB',
        //     label: {
        //       show: true,
        //       position: 'top',
        //     },
        //   },
        // },
      },
    ],
  }

  return (
    <ReactEcharts
      option={option}
      style={{ height: '500px', width: '100%' }}
    />
  )
}
