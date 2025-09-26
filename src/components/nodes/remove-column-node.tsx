import type { NodeProps } from "reactflow"
import type { RemoveColumnNodeData } from "../../types"
import { BaseNode } from "./base-node"

type RemoveColumnNodeProps = NodeProps<RemoveColumnNodeData>

export const RemoveColumnNode = ({ data, ...attrs }: RemoveColumnNodeProps) => {
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.columnsToRemove?.length} emptyStateMessage="未设置移除列">
      {({ themeConfig }) => (
        <>
          <div className="flex justify-between items-center mb-1">
            <span>移除:</span>
            <span className={`font-medium ${themeConfig.text}`}>{data.columnsToRemove?.length || 0}</span>
          </div>
          {data.columnsToRemove?.slice(0, 3).map((column, index) => (
            <div key={index} className="flex justify-between items-center mb-1">
              <span className="truncate max-w-20">{column}</span>
            </div>
          ))}
          {data.columnsToRemove?.length > 3 && (
            <div className="text-xs text-gray-500 text-center">+{data.columnsToRemove.length - 3} 更多</div>
          )}
        </>
      )}
    </BaseNode>
  )
}
