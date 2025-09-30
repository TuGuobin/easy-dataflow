import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import type { Node } from "reactflow"
import type { VisualizeNodeData, NodeType, ChartTypeType } from "../../types"
import type { ChartConfig } from "../../utils/visualize-utils"
import { getChartTypeDisplayName } from "../../utils/visualize-utils"
import { ChartType } from "../../types"
import { ChartPreview } from "./chart-preview"
import { BasePanel } from "./base-panel"
import { NoData } from "./no-data"
import { Select } from "../common/input"

interface VisualizePanelProps {
  node: Node<VisualizeNodeData, NodeType>
  columns: string[]
  onUpdateChartConfig: (chartConfig: ChartConfig) => void
}

const CHART_FIELD_REQUIREMENTS: Record<ChartTypeType, (keyof Partial<ChartConfig>)[]> = {
  [ChartType.BAR]: ["xAxis", "yAxis", "groupBy"],
  [ChartType.LINE]: ["xAxis", "yAxis", "groupBy"],
  [ChartType.SCATTER]: ["xAxis", "yAxis", "groupBy"],
  [ChartType.BUBBLE]: ["xAxis", "yAxis", "groupBy"],
  [ChartType.PIE]: ["groupBy", "yAxis"],
  [ChartType.DOUGHNUT]: ["groupBy", "yAxis"],
  [ChartType.POLAR_AREA]: ["groupBy", "yAxis"],
  [ChartType.RADAR]: ["groupBy", "yAxis"],
}

const FIELD_LABELS = {
  xAxis: "ui.selectLabelColumn",
  yAxis: "ui.selectValueColumn",
  groupBy: "ui.selectGroupByColumn",
} as const

export const VisualizePanel = ({ node, columns, onUpdateChartConfig }: VisualizePanelProps) => {
  const { t } = useTranslation()
  const [chartConfig, setChartConfig] = useState<ChartConfig>(node.data.chartConfig || { type: ChartType.BAR })

  useEffect(() => {
    setChartConfig(node.data.chartConfig || { type: ChartType.BAR })
  }, [node.data.chartConfig])

  const handleChartTypeChange = (newChartType: ChartTypeType) => {
    const currentConfig = chartConfig
    const requiredFields = CHART_FIELD_REQUIREMENTS[newChartType]

    const newConfig: ChartConfig = { type: newChartType }
    for (const field of requiredFields) {
      const value = currentConfig[field] as string
      if (value && columns.includes(value)) {
        ;(newConfig[field] as string) = value
      }
    }

    setChartConfig(newConfig)
    onUpdateChartConfig(newConfig)
  }

  const handleConfigChange = (field: keyof ChartConfig, value: string | number) => {
    const updatedConfig = { ...chartConfig }
    if (value) {
      ;(updatedConfig[field] as string | number) = value
    } else {
      delete updatedConfig[field]
    }
    setChartConfig(updatedConfig)
    onUpdateChartConfig(updatedConfig)
  }

  const chartType = chartConfig.type
  const requiredFields = CHART_FIELD_REQUIREMENTS[chartType]

  return (
    <BasePanel node={node}>
      {({ themeConfig }) => {
        const hasData = node?.data?.data && node.data.data.length > 0
        if (!hasData) {
          return <NoData title={t("messages.insufficientParentData")} />
        }

        return (
          <div className={`mb-5 ${themeConfig.text}`}>
            {/* 图表类型选择 */}
            <div className="mb-4">
              <Select
                label={t("common.chartType")}
                themeConfig={themeConfig}
                value={chartType}
                onChange={handleChartTypeChange}
                options={Object.values(ChartType).map((type) => ({
                  value: type,
                  label: t(getChartTypeDisplayName(type)),
                }))}
              />
            </div>

            {/* 动态字段配置 */}
            <div className="space-y-3">
              {requiredFields.map((field) => (
                <div key={field}>
                  <Select
                    label={t(FIELD_LABELS[field as keyof typeof FIELD_LABELS])}
                    themeConfig={themeConfig}
                    value={chartConfig[field] || ""}
                    onChange={(value) => handleConfigChange(field, value)}
                    options={columns.map((col) => ({ value: col, label: col }))}
                  />
                </div>
              ))}
            </div>

            {/* 图表预览 */}
            <div className="my-4">
              <div className="text-xs font-semibold mb-2.5 text-gray-500 uppercase tracking-wide">
                <i className="fa-solid fa-eye mr-2"></i>
                {t("common.preview")}
              </div>
              <ChartPreview chartType={chartType} chartConfig={chartConfig} data={node.data.data} height={250} />
            </div>
          </div>
        )
      }}
    </BasePanel>
  )
}
