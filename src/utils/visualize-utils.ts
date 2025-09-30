import type { CsvRow, ChartConfig, ChartData, ChartTypeType, DataPoint } from "../types"
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
 */
export function prepareChartData(data: CsvRow[], config: ChartConfig): ChartData {
  // 重置颜色索引确保每次调用颜色序列一致
  resetColorIndex()

  if (!data || data.length === 0) {
    return { labels: [], datasets: [] }
  }

  switch (config.type) {
    case ChartType.BAR:
    case ChartType.LINE:
      return prepareBarOrLineData(data, config)
    case ChartType.PIE:
    case ChartType.DOUGHNUT:
    case ChartType.POLAR_AREA:
      return preparePieLikeData(data, config)
    case ChartType.RADAR:
      return prepareRadarData(data, config)
    case ChartType.SCATTER:
      return prepareScatterData(data, config)
    case ChartType.BUBBLE:
      return prepareBubbleData(data, config)
    default:
      return { labels: [], datasets: [] }
  }
}

// === 工具函数 ===

function hasField(data: CsvRow[], field?: string): boolean {
  if (!field) return false
  return data.some((row) => field in row)
}

function safeGetField(row: CsvRow, key: string): string | undefined {
  return key in row ? String(row[key]) : undefined
}

function safeGetNumber(row: CsvRow, column: string): number | undefined {
  const val = row[column]
  if (val === null || val === undefined || val === "") return undefined
  const num = Number(val)
  return isNaN(num) ? undefined : num
}

// === 图表数据准备函数 ===

function prepareBarOrLineData(data: CsvRow[], config: ChartConfig): ChartData {
  const { xAxis, yAxis, groupBy } = config

  if (!xAxis || !yAxis || !hasField(data, xAxis) || !hasField(data, yAxis)) {
    return { labels: [], datasets: [] }
  }

  if (groupBy && hasField(data, groupBy)) {
    const groups = new Map<string, Map<string, number[]>>()

    data.forEach((row) => {
      const groupKey = safeGetField(row, groupBy)
      const xValue = safeGetField(row, xAxis)
      const yValue = safeGetNumber(row, yAxis)

      if (groupKey === undefined || xValue === undefined || yValue === undefined) return

      if (!groups.has(groupKey)) {
        groups.set(groupKey, new Map())
      }
      const groupMap = groups.get(groupKey)!
      if (!groupMap.has(xValue)) {
        groupMap.set(xValue, [])
      }
      groupMap.get(xValue)!.push(yValue)
    })

    // 保持原始数据顺序（不排序）
    const allXValues = new Set<string>()
    data.forEach((row) => {
      const x = safeGetField(row, xAxis)
      if (x !== undefined) allXValues.add(x)
    })
    const labels = Array.from(allXValues)

    const datasets = Array.from(groups.entries()).map(([groupName, groupMap]) => ({
      label: groupName,
      data: labels.map((label) => {
        const values = groupMap.get(label) || []
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
      }),
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      borderWidth: 1,
    }))

    return { labels, datasets }
  } else {
    const aggregated = new Map<string, number[]>()

    data.forEach((row) => {
      const xValue = safeGetField(row, xAxis)
      const yValue = safeGetNumber(row, yAxis)
      if (xValue === undefined || yValue === undefined) return

      if (!aggregated.has(xValue)) {
        aggregated.set(xValue, [])
      }
      aggregated.get(xValue)!.push(yValue)
    })

    const labels = Array.from(aggregated.keys())
    const values = labels.map((label) => {
      const vals = aggregated.get(label)!
      return vals.reduce((a, b) => a + b, 0) / vals.length
    })

    return {
      labels,
      datasets: [
        {
          label: yAxis || "值",
          data: values,
          backgroundColor: getRandomColor(),
          borderColor: getRandomColor(),
          borderWidth: 1,
        },
      ],
    }
  }
}

function preparePieLikeData(data: CsvRow[], config: ChartConfig): ChartData {
  const { groupBy, yAxis } = config

  if (!groupBy || !hasField(data, groupBy)) {
    return { labels: [], datasets: [] }
  }

  const aggregated = new Map<string, number>()

  data.forEach((row) => {
    const groupKey = safeGetField(row, groupBy)
    if (groupKey === undefined) return

    let value = 1
    if (yAxis && hasField(data, yAxis)) {
      const yVal = safeGetNumber(row, yAxis)
      if (yVal !== undefined) value = yVal
    }

    aggregated.set(groupKey, (aggregated.get(groupKey) || 0) + value)
  })

  const labels = Array.from(aggregated.keys())
  const values = Array.from(aggregated.values())

  return {
    labels,
    datasets: [
      {
        label: yAxis || "数据",
        data: values,
        backgroundColor: labels.map(() => getRandomColor()),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  }
}

function prepareScatterData(data: CsvRow[], config: ChartConfig): ChartData {
  const { xAxis, yAxis, groupBy } = config

  if (!xAxis || !yAxis || !hasField(data, xAxis) || !hasField(data, yAxis)) {
    return { labels: [], datasets: [] }
  }

  if (groupBy && hasField(data, groupBy)) {
    const groups = new Map<string, Array<{ x: number; y: number }>>()

    data.forEach((row) => {
      const groupKey = safeGetField(row, groupBy)
      const xVal = safeGetNumber(row, xAxis)
      const yVal = safeGetNumber(row, yAxis)
      if (groupKey === undefined || xVal === undefined || yVal === undefined) return

      if (!groups.has(groupKey)) {
        groups.set(groupKey, [])
      }
      groups.get(groupKey)!.push({ x: xVal, y: yVal })
    })

    const datasets = Array.from(groups.entries()).map(([label, points]) => ({
      label,
      data: points as DataPoint[], // 类型断言确保符合 DataPoint[]
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      borderWidth: 1,
    }))

    return { labels: [], datasets }
  } else {
    const points: { x: number; y: number }[] = []
    data.forEach((row) => {
      const xVal = safeGetNumber(row, xAxis)
      const yVal = safeGetNumber(row, yAxis)
      if (xVal !== undefined && yVal !== undefined) {
        points.push({ x: xVal, y: yVal })
      }
    })

    return {
      labels: [],
      datasets: [
        {
          label: yAxis || "散点",
          data: points as DataPoint[],
          backgroundColor: getRandomColor(),
          borderColor: getRandomColor(),
          borderWidth: 1,
        },
      ],
    }
  }
}

function prepareBubbleData(data: CsvRow[], config: ChartConfig): ChartData {
  const { xAxis, yAxis, groupBy } = config

  if (!xAxis || !yAxis || !hasField(data, xAxis) || !hasField(data, yAxis)) {
    return { labels: [], datasets: [] }
  }

  // 计算y轴数据的极值
  const yValues = data.map((row) => safeGetNumber(row, yAxis)).filter((v): v is number => v !== undefined)
  const minY = Math.min(...yValues)
  const maxY = Math.max(...yValues)
  const yRange = maxY - minY || 1

  const calculateRadius = (value: number): number => {
    const baseSize = 3
    const maxSize = 15

    if (value === 0) return baseSize
    const normalizedValue = (value - minY) / yRange
    const scaledSize = baseSize + Math.pow(normalizedValue, 0.7) * (maxSize - baseSize)

    return Math.min(Math.max(scaledSize, baseSize), maxSize)
  }

  if (groupBy && hasField(data, groupBy)) {
    const groups = new Map<string, Array<{ x: number; y: number; r: number }>>()

    data.forEach((row) => {
      const groupKey = safeGetField(row, groupBy)
      const xVal = safeGetNumber(row, xAxis)
      const yVal = safeGetNumber(row, yAxis)
      if (groupKey === undefined || xVal === undefined || yVal === undefined) return

      const rVal = calculateRadius(yVal)

      if (!groups.has(groupKey)) {
        groups.set(groupKey, [])
      }
      groups.get(groupKey)!.push({ x: xVal, y: yVal, r: rVal })
    })

    const datasets = Array.from(groups.entries()).map(([label, points]) => ({
      label,
      data: points as DataPoint[],
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      borderWidth: 1,
    }))

    return { labels: [], datasets }
  } else {
    const points: { x: number; y: number; r: number }[] = []
    data.forEach((row) => {
      const xVal = safeGetNumber(row, xAxis)
      const yVal = safeGetNumber(row, yAxis)
      if (xVal !== undefined && yVal !== undefined) {
        points.push({
          x: xVal,
          y: yVal,
          r: calculateRadius(yVal),
        })
      }
    })

    return {
      labels: [],
      datasets: [
        {
          label: yAxis || "气泡",
          data: points as DataPoint[],
          backgroundColor: getRandomColor(),
          borderColor: getRandomColor(),
          borderWidth: 1,
        },
      ],
    }
  }
}

function prepareRadarData(data: CsvRow[], config: ChartConfig): ChartData {
  const { groupBy, yAxis } = config

  if (!groupBy || !yAxis || !hasField(data, groupBy) || !hasField(data, yAxis)) {
    return { labels: [], datasets: [] }
  }

  const aggregated = new Map<string, number[]>()

  data.forEach((row) => {
    const label = safeGetField(row, groupBy)
    const value = safeGetNumber(row, yAxis)
    if (label === undefined || value === undefined) return

    if (!aggregated.has(label)) {
      aggregated.set(label, [])
    }
    aggregated.get(label)!.push(value)
  })

  const chartLabels = Array.from(aggregated.keys())
  const chartData = chartLabels.map((label) => {
    const values = aggregated.get(label)!
    return values.reduce((a, b) => a + b, 0) / values.length
  })

  return {
    labels: chartLabels,
    datasets: [
      {
        label: yAxis || "雷达值",
        data: chartData,
        backgroundColor: getRandomColor() + "33",
        borderColor: getRandomColor(),
        borderWidth: 2,
      },
    ],
  }
}

// === 颜色管理 ===

let colorIndex = 0
const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FFCD56", "#C9CBCF"]

function getRandomColor(): string {
  const color = COLORS[colorIndex % COLORS.length]
  colorIndex++
  return color
}

function resetColorIndex(): void {
  colorIndex = 0
}
