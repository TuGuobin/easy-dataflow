import type { CsvRow, ChartConfig, ChartData, ChartTypeType } from "../types"
import { ChartType, CHART_TYPE_NAMES } from "../types"

// 重新导出类型以保持向后兼容性
export type { CsvRow, ChartConfig, ChartData, ChartTypeType } from "../types"
export { CHART_TYPE_NAMES as chartTypeNames } from "../types"

/**
 * 获取图表类型的显示名称
 */
export function getChartTypeDisplayName(type: ChartTypeType): string {
  return CHART_TYPE_NAMES[type]
}

/**
 * 准备图表数据
 * @param data 原始数据
 * @param config 图表配置
 * @returns 图表数据
 */
export function prepareChartData(data: CsvRow[], config: ChartConfig): ChartData {
  if (!data || data.length === 0) {
    return { labels: [], datasets: [] }
  }

  switch (config.type) {
    case ChartType.BAR:
    case ChartType.LINE:
      return prepareBarOrLineData(data, config)
    case ChartType.PIE:
      return preparePieData(data, config)
    case ChartType.SCATTER:
      return prepareScatterData(data, config)
    case ChartType.HISTOGRAM:
      return prepareHistogramData(data, config)
    default:
      return { labels: [], datasets: [] }
  }
}

/**
 * 准备柱状图或折线图数据
 */
function prepareBarOrLineData(data: CsvRow[], config: ChartConfig): ChartData {
  const { xAxis, yAxis, groupBy } = config
  
  if (!xAxis || !yAxis || !Object.prototype.hasOwnProperty.call(data[0], xAxis) || !Object.prototype.hasOwnProperty.call(data[0], yAxis)) {
    return { labels: [], datasets: [] }
  }

  if (groupBy && Object.prototype.hasOwnProperty.call(data[0], groupBy)) {
    // 分组数据
    const groups = new Map<string, Map<string, number[]>>()
    
    data.forEach((row) => {
      const groupKey = String(row[groupBy])
      const xValue = String(row[xAxis])
      const yValue = Number(row[yAxis])
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, new Map())
      }
      
      const groupData = groups.get(groupKey)!
      if (!groupData.has(xValue)) {
        groupData.set(xValue, [])
      }
      
      groupData.get(xValue)!.push(yValue)
    })

    const labels = [...new Set(data.map((row) => String(row[xAxis])))]
    const datasets = Array.from(groups.entries()).map(([groupName, groupData]) => ({
      label: groupName,
      data: labels.map((label) => {
        const values = groupData.get(label) || []
        return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
      }),
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      borderWidth: 1,
    }))

    return { labels, datasets }
  } else {
    // 简单数据
    const aggregated = new Map<string, number[]>()
    
    data.forEach((row) => {
      const xValue = String(row[xAxis])
      const yValue = Number(row[yAxis])
      
      if (!aggregated.has(xValue)) {
        aggregated.set(xValue, [])
      }
      
      aggregated.get(xValue)!.push(yValue)
    })

    const labels = Array.from(aggregated.keys())
    const values = labels.map((label) => {
      const vals = aggregated.get(label)!
      return vals.reduce((sum, val) => sum + val, 0) / vals.length
    })

    return {
      labels,
      datasets: [{
        label: yAxis,
        data: values,
        backgroundColor: getRandomColor(),
        borderColor: getRandomColor(),
        borderWidth: 1,
      }],
    }
  }
}

/**
 * 准备饼图数据
 */
function preparePieData(data: CsvRow[], config: ChartConfig): ChartData {
  const { groupBy, yAxis } = config
  
  if (!groupBy || !Object.prototype.hasOwnProperty.call(data[0], groupBy)) {
    return { labels: [], datasets: [] }
  }

  const aggregated = new Map<string, number>()
  
  data.forEach((row) => {
    const groupKey = String(row[groupBy])
    const value = yAxis ? Number(row[yAxis]) : 1
    
    aggregated.set(groupKey, (aggregated.get(groupKey) || 0) + value)
  })

  const labels = Array.from(aggregated.keys())
  const values = Array.from(aggregated.values())

  return {
    labels,
    datasets: [{
      label: "数据",
      data: values,
      backgroundColor: labels.map(() => getRandomColor()),
      borderColor: "#fff",
      borderWidth: 2,
    }],
  }
}

/**
 * 准备散点图数据
 */
function prepareScatterData(data: CsvRow[], config: ChartConfig): ChartData {
  const { xAxis, yAxis, groupBy } = config
  
  if (!xAxis || !yAxis || !Object.prototype.hasOwnProperty.call(data[0], xAxis) || !Object.prototype.hasOwnProperty.call(data[0], yAxis)) {
    return { labels: [], datasets: [] }
  }

  if (groupBy && Object.prototype.hasOwnProperty.call(data[0], groupBy)) {
    const groups = new Map<string, Array<{ x: number; y: number }>>()
    
    data.forEach((row) => {
      const groupKey = String(row[groupBy])
      const xValue = Number(row[xAxis])
      const yValue = Number(row[yAxis])
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, [])
      }
      
      groups.get(groupKey)!.push({ x: xValue, y: yValue })
    })

    const datasets = Array.from(groups.entries()).map(([groupName, points]) => ({
      label: groupName,
      data: points.map((point) => point.y),
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      borderWidth: 1,
    }))

    return {
      labels: data.map((row) => String(row[xAxis])),
      datasets,
    }
  } else {
    return {
      labels: data.map((row) => String(row[xAxis])),
      datasets: [{
        label: yAxis,
        data: data.map((row) => Number(row[yAxis])),
        backgroundColor: getRandomColor(),
        borderColor: getRandomColor(),
        borderWidth: 1,
      }],
    }
  }
}

/**
 * 准备直方图数据
 */
function prepareHistogramData(data: CsvRow[], config: ChartConfig): ChartData {
  const { xAxis } = config
  
  if (!xAxis || !Object.prototype.hasOwnProperty.call(data[0], xAxis)) {
    return { labels: [], datasets: [] }
  }

  const values = data.map((row) => Number(row[xAxis])).filter((val) => !isNaN(val))
  
  if (values.length === 0) {
    return { labels: [], datasets: [] }
  }

  // 创建直方图分组
  const min = Math.min(...values)
  const max = Math.max(...values)
  const binCount = Math.min(10, Math.ceil(Math.sqrt(values.length)))
  const binWidth = (max - min) / binCount

  const labels: string[] = []
  const counts: number[] = []

  for (let i = 0; i < binCount; i++) {
    const binStart = min + i * binWidth
    const binEnd = min + (i + 1) * binWidth
    const count = values.filter((val) => val >= binStart && val < binEnd).length
    
    labels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`)
    counts.push(count)
  }

  return {
    labels,
    datasets: [{
      label: "频数",
      data: counts,
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      borderWidth: 1,
    }],
  }
}

/**
 * 获取随机颜色
 */
function getRandomColor(): string {
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FF6384",
    "#C9CBCF",
    "#4BC0C0",
    "#FF6384",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}