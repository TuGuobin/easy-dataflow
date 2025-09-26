import type { NodeProps } from "reactflow"
import type { AggregateNodeData } from "../../types"
import { BaseNode } from "./base-node"

type AggregateNodeProps = NodeProps<AggregateNodeData>

export const AggregateNode = ({ data, ...attrs }: AggregateNodeProps) => {
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.aggregations?.length} emptyStateMessage="未设置聚合操作">
      {({ themeConfig }) => (
        <>
          {data.groupBy && (
            <div className="flex justify-between items-center mb-1">
              <span>分组:</span>
              <span className={`font-medium truncate max-w-16 ${themeConfig.text}`}>{data.groupBy}</span>
            </div>
          )}
          <div className="flex justify-between items-center mb-1">
            <span>聚合:</span>
            <span className={`font-medium ${themeConfig.text}`}>{data.aggregations?.length || 0}</span>
          </div>
          {data.aggregations?.slice(0, 2).map((agg, index) => (
            <div key={index} className="flex justify-between items-center mb-1">
              <span className="truncate max-w-16">{agg.column}:</span>
              <span className={`font-medium text-xs ${themeConfig.text}`}>{agg.operation}</span>
            </div>
          ))}
          {data.aggregations?.length > 2 && (
            <div className="text-xs text-gray-500 text-center">+{data.aggregations.length - 2} 更多</div>
          )}
        </>
      )}
    </BaseNode>
  )
}
