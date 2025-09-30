import type { NodeProps } from "reactflow"
import type { TransformNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { getTransformOperationDisplayName } from "../../utils/transform-utils"

type TransformNodeProps = NodeProps<TransformNodeData>

export const TransformNode = ({ data, ...attrs }: TransformNodeProps) => {
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.transformations?.length} emptyStateMessage="messages.noTransformRulesSet">
      {({ themeConfig }) => (
        <>
          <div className="flex justify-between items-center mb-1">
            <span>转换:</span>
            <span className={`font-medium ${themeConfig.text}`}>{data.transformations?.length || 0}</span>
          </div>
          {data.transformations?.slice(0, 2).map((rule, index) => (
            <div key={index} className="flex justify-between items-center mb-1">
              <span className="truncate max-w-16">{rule.column}:</span>
              <span className={`font-medium text-xs ${themeConfig.text}`}>{getTransformOperationDisplayName(rule.operation)}</span>
            </div>
          ))}
          {data.transformations?.length > 2 && (
            <div className="text-xs text-gray-500 text-center">+{data.transformations.length - 2} 更多</div>
          )}
        </>
      )}
    </BaseNode>
  )
}
