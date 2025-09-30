import { useEffect, useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  DoughnutController,
  PolarAreaController,
  RadarController,
  BubbleController,
  RadialLinearScale,
  Filler,
} from "chart.js"
import { Bar, Line, Pie, Scatter, Bubble, Doughnut, PolarArea, Radar } from "react-chartjs-2"
import type { ChartData, ChartTypeType, CsvTable } from "../../types"
import { ChartType } from "../../types"
import { prepareChartData } from "../../utils/visualize-utils"
import type { ChartConfig } from "../../utils/visualize-utils"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, ScatterController, DoughnutController, PolarAreaController, RadarController, BubbleController, RadialLinearScale, Filler)

interface ChartPreviewProps {
  chartType: ChartTypeType
  chartConfig: ChartConfig
  data?: CsvTable
  title?: string
  width?: string | number
  height?: number | string
}

const useChartOptions = (chartType: ChartTypeType, chartData: ChartData | null, chartTitle: string, t: (key: string) => string) => {
  return useMemo(() => {
    const basePlugins = {
      title: {
        display: !!chartTitle,
        text: chartTitle,
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
    }

    switch (chartType) {
      case ChartType.PIE:
      case ChartType.DOUGHNUT:
        return {
          responsive: true,
          maintainAspectRatio: false,
          plugins: basePlugins,
          cutout: "50%",
        }

      case ChartType.POLAR_AREA:
      case ChartType.RADAR:
        return {
          responsive: true,
          maintainAspectRatio: false,
          plugins: basePlugins,
          scales: {
            r: {
              beginAtZero: true,
            },
          },
        }

      case ChartType.SCATTER:
      case ChartType.BUBBLE:
        return {
          responsive: true,
          maintainAspectRatio: false,
          plugins: basePlugins,
          scales: {
            x: {
              type: "linear" as const,
              display: true,
            },
            y: {
              type: "linear" as const,
              display: true,
            },
          },
        }

      case ChartType.BAR:
      case ChartType.LINE:
      default:
        return {
          responsive: true,
          maintainAspectRatio: false,
          plugins: basePlugins,
          scales: {
            x: {
              type: "category" as const,
              display: true,
              title: {
                display: true,
                text: chartData?.datasets[0]?.label || t("common.xAxis"),
              },
            },
            y: {
              type: "linear" as const,
              display: true,
              title: {
                display: true,
                text: t("common.yAxis"),
              },
            },
          },
        }
    }
  }, [chartType, chartData, chartTitle, t])
}

export const ChartPreview = ({ chartType, chartConfig, data, title, width = "100%", height = 300 }: ChartPreviewProps) => {
  const { t } = useTranslation()
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const chartTitle = title || ""

  const config = useMemo(
    () => ({
      ...chartConfig,
    }),
    [chartConfig]
  )

  useEffect(() => {
    if (!data?.length) {
      setChartData(null)
      setError(null)
      return
    }

    try {
      setError(null)
      const preparedData = prepareChartData(data, config)
      setChartData(preparedData)
    } catch (err) {
      console.error("图表数据准备失败:", err)
      setError(t("errors.chartDataPrepareFailed"))
      setChartData(null)
    }
  }, [data, config, t])

  const options = useChartOptions(chartType, chartData, chartTitle, t)

  const renderChart = () => {
    if (error) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded text-red-600 text-sm p-4 text-center">
          <i className="fa-solid fa-triangle-exclamation text-xl mb-2"></i>
          <span>{error}</span>
        </div>
      )
    }

    if (!chartData || !chartData.datasets.length) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded text-gray-500 text-sm">
          <i className="fa-solid fa-info-circle mr-2"></i>
          <span>{t("common.noData")}</span>
        </div>
      )
    }

    switch (chartType) {
      case ChartType.BAR:
        return <Bar data={chartData} options={options} />
      case ChartType.LINE:
        return <Line data={chartData} options={options} />
      case ChartType.PIE:
        return <Pie data={chartData} options={options} />
      case ChartType.DOUGHNUT:
        return <Doughnut data={chartData} options={options} />
      case ChartType.POLAR_AREA:
        // @ts-expect-error 实际上这个类型是存在的
        return <PolarArea data={chartData} options={options} />
      case ChartType.RADAR:
        // @ts-expect-error 实际上这个类型是存在的
        return <Radar data={chartData} options={options} />
      case ChartType.SCATTER:
        return <Scatter data={chartData} options={options} />
      case ChartType.BUBBLE:
        return <Bubble data={chartData} options={options} />
      default:
        return <Bar data={chartData} options={options} />
    }
  }

  return (
    <div
      className="chart-preview flex items-center justify-center border border-gray-200 rounded bg-white p-2"
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        minHeight: typeof height === "number" ? `${height}px` : undefined,
      }}
    >
      {renderChart()}
    </div>
  )
}
