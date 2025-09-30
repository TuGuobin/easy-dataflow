import type { NodeProps } from "reactflow"
import type { VisualizeNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { getChartTypeDisplayName } from "../../utils/visualize-utils"

type VisualizeNodeProps = NodeProps<VisualizeNodeData>

export const VisualizeNode = ({ data, ...attrs }: VisualizeNodeProps) => {
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.chartConfig?.type} emptyStateMessage="messages.noChartTypeSet">
      {({ themeConfig }) => (
        <>
          <div className="flex justify-between items-center mb-1">
            <span>类型:</span>
            <span className={`font-medium truncate max-w-20 ${themeConfig.text}`}>
              {data.chartConfig?.type ? getChartTypeDisplayName(data.chartConfig.type) : '未设置'}
            </span>
          </div>
          {data.chartConfig?.xAxis && (
            <div className="flex justify-between items-center mb-1">
              <span>X轴:</span>
              <span className={`font-medium truncate max-w-16 ${themeConfig.text}`}>{data.chartConfig.xAxis}</span>
            </div>
          )}
          {data.chartConfig?.yAxis && (
            <div className="flex justify-between items-center mb-1">
              <span>Y轴:</span>
              <span className={`font-medium truncate max-w-16 ${themeConfig.text}`}>{data.chartConfig.yAxis}</span>
            </div>
          )}
          {data.chartConfig?.groupBy && (
            <div className="flex justify-between items-center mb-1">
              <span>分组:</span>
              <span className={`font-medium truncate max-w-16 ${themeConfig.text}`}>{data.chartConfig.groupBy}</span>
            </div>
          )}
        </>
      )}
    </BaseNode>
  )
}
