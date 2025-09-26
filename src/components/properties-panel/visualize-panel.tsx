import { useState, useEffect } from "react"
import type { Node } from "reactflow"
import type { VisualizeNodeData, NodeType } from "../../types"
import type { ChartConfig } from "../../utils/visualize-utils"
import { getChartTypeDisplayName } from "../../utils/visualize-utils"
import { ChartType, type ChartTypeType } from "../../types"
import { ChartPreview } from "./chart-preview"
import { BasePanel } from "./base-panel"
import { NoData } from "./no-data"
import { Select } from "../common/input"

interface VisualizePanelProps {
  node: Node<VisualizeNodeData, NodeType>
  columns: string[]
  onUpdateChartConfig: (chartConfig: ChartConfig) => void
}

const chartTypes = Object.values(ChartType)

export const VisualizePanel = ({ node, columns, onUpdateChartConfig }: VisualizePanelProps) => {
  const [chartConfig, setChartConfig] = useState<ChartConfig>(node.data.chartConfig || { type: ChartType.BAR })
  const chartType = chartConfig.type

  useEffect(() => {
    setChartConfig(node.data.chartConfig || { type: ChartType.BAR })
  }, [node.data.chartConfig])

  const handleChartTypeChange = (newChartType: ChartTypeType) => {
    const newConfig = { ...chartConfig, type: newChartType }
    setChartConfig(newConfig)
    onUpdateChartConfig(newConfig)
  }

  const handleConfigChange = (field: keyof ChartConfig, value: string) => {
    const updatedConfig = { ...chartConfig, [field]: value }
    setChartConfig(updatedConfig)
    onUpdateChartConfig(updatedConfig)
  }

  return (
    <BasePanel node={node}>
      {({ themeConfig }) => {
        if (!node?.data?.data || node.data.data.length === 0) {
          return <NoData title="请先连接数据源节点" />
        }

        return (
          <div className={`mb-5 ${themeConfig.text}`}>
            <div className="mb-4">
              <Select label="图表类型" themeConfig={themeConfig} value={chartType} onChange={(value) => handleChartTypeChange(value)} options={chartTypes.map((type) => ({ value: type, label: getChartTypeDisplayName(type) }))} />
            </div>

            {chartType && (
              <div className="space-y-3">
                {(chartType === "bar" || chartType === "line" || chartType === "scatter") && (
                  <>
                    <div>
                      <Select label="X轴" themeConfig={themeConfig} value={chartConfig.xAxis || ""} onChange={(value) => handleConfigChange("xAxis", value)} options={columns.map((col) => ({ value: col, label: col }))} />
                    </div>

                    <div>
                      <Select label="Y轴" themeConfig={themeConfig} value={chartConfig.yAxis || ""} onChange={(value) => handleConfigChange("yAxis", value)} options={columns.map((col) => ({ value: col, label: col }))} />
                    </div>
                  </>
                )}

                {(chartType === "bar" || chartType === "line") && (
                  <div>
                    <Select label="分组（可选）" themeConfig={themeConfig} value={chartConfig.groupBy || ""} onChange={(value) => handleConfigChange("groupBy", value)} options={columns.map((col) => ({ value: col, label: col }))} />
                  </div>
                )}

                {chartType === "pie" && (
                  <>
                    <div>
                      <Select label="标签列" themeConfig={themeConfig} value={chartConfig.labels || ""} onChange={(value) => handleConfigChange("labels", value)} options={columns.map((col) => ({ value: col, label: col }))} />
                    </div>

                    <div>
                      <Select label="数值列" themeConfig={themeConfig} value={chartConfig.values || ""} onChange={(value) => handleConfigChange("values", value)} options={columns.map((col) => ({ value: col, label: col }))} />
                    </div>
                  </>
                )}

                {chartType === "histogram" && (
                  <>
                    <div>
                      <Select label="数值列" themeConfig={themeConfig} value={chartConfig.values || ""} onChange={(value) => handleConfigChange("values", value)} options={columns.map((col) => ({ value: col, label: col }))} />
                    </div>

                    <div>
                      <Select label="分组列" themeConfig={themeConfig} value={chartConfig.groupBy || ""} onChange={(value) => handleConfigChange("groupBy", value)} options={columns.map((col) => ({ value: col, label: col }))} />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 图表预览区域 */}
            {chartType && node?.data?.data && node.data.data.length > 0 && (
              <div className="my-4">
                <div className="text-xs font-semibold mb-2.5 text-gray-500 uppercase tracking-wide">
                  <i className="fa-solid fa-eye mr-2"></i>图表预览
                </div>
                <ChartPreview chartType={chartType} chartConfig={chartConfig} data={node.data.data} height={250} />
              </div>
            )}
          </div>
        )
      }}
    </BasePanel>
  )
}
