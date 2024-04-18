'use client'

import ReactEcharts from 'echarts-for-react'
import React from 'react'

export const LineBarChart = ({
  xAxisData,
  yAxisData,
  name,
  dataBelongs,
}: {
  xAxisData: string[]
  dataBelongs: string[]
  yAxisData: number[][]
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
        start: 0,
        end: 60,
      },
      {
        start: 0,
        end: 60,
      },
    ],
    series: dataBelongs.map((data_name, index) => {
      return {
        name: data_name,
        type: 'line',
        data: yAxisData[index],
      }
    }),
  }

  return (
    <ReactEcharts
      option={option}
      style={{ height: '400px', width: '100%', paddingBottom: '20px' }}
    />
  )
}

export const PieChart = ({
  title,
  data,
}: {
  title: string
  data: [{ value: number; name: string }]
}) => {
  const option = {
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }

  return (
    <ReactEcharts
      option={option}
      style={{ height: '400px', width: '100%', paddingBottom: '20px' }}
    />
  )
}
