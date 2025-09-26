import { useEffect, useState } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, ScatterController } from "chart.js"
import { Bar, Line, Pie, Scatter } from "react-chartjs-2"
import type { ChartData, ChartTypeType, CsvRow } from "../../types"
import { ChartType } from "../../types"
import { prepareChartData } from "../../utils/visualize-utils"
import type { ChartConfig } from "../../utils/visualize-utils"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, ScatterController)

interface ChartPreviewProps {
  chartType: ChartTypeType
  chartConfig: ChartConfig
  data: CsvRow[]
  title?: string
  width?: string | number
  height?: number | string
}

export const ChartPreview = ({ chartType, chartConfig, data, title = "数据图表", width = "100%", height = 300 }: ChartPreviewProps) => {
  const [chartData, setChartData] = useState<ChartData | null>(null)

  // 准备图表数据
  useEffect(() => {
    if (data && data.length > 0 && chartType && chartConfig) {
      try {
        const preparedData = prepareChartData(data, { ...chartConfig, type: chartType })
        setChartData(preparedData)
      } catch (error) {
        console.error("准备图表数据失败:", error)
        setChartData(null)
      }
    }
  }, [data, chartType, chartConfig])

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: !!title,
        text: title,
        font: {
          size: 14,
          weight: "bold" as const,
        },
      },
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales:
      chartType === ChartType.PIE
        ? {}
        : {
            x: {
              display: true,
              title: {
                display: true,
                text: chartData?.datasets[0]?.label || "X轴",
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Y轴",
              },
            },
          },
  }

  const renderChart = () => {
    if (!chartData || !chartData.labels || chartData.labels.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 border border-gray-300 rounded text-gray-500">
          <i className="fa-solid fa-info-circle"></i>
          <span className="ml-2">暂无数据</span>
        </div>
      )
    }

    switch (chartType) {
      case ChartType.BAR:
      case ChartType.HISTOGRAM:
        return <Bar data={chartData} options={commonOptions} />
      case ChartType.LINE:
        return <Line data={chartData} options={commonOptions} />
      case ChartType.PIE:
        return <Pie data={chartData} options={commonOptions} />
      case ChartType.SCATTER:
        return <Scatter data={chartData} options={commonOptions} />
      default:
        return <Bar data={chartData} options={commonOptions} />
    }
  }

  return (
    <div className="chart-preview flex align-center justify-center" style={{ width: typeof width === "number" ? `${width}px` : width, height: typeof height === "number" ? `${height}px` : height }}>
      {renderChart()}
    </div>
  )
}
