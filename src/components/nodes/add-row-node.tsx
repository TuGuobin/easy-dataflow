import type { NodeProps } from "reactflow"
import type { AddRowNodeData } from "../../types"
import { BaseNode } from "./base-node"

type AddRowNodeProps = NodeProps<AddRowNodeData>

export const AddRowNode = ({ data, ...attrs }: AddRowNodeProps) => {
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.newRows?.length} emptyStateMessage="未设置新增行数据">
      {({ themeConfig }) => (
        <>
          <div className="flex justify-between items-center mb-1">
            <span>行数:</span>
            <span className={`font-medium ${themeConfig.text}`}>{data.newRows?.length || 0}</span>
          </div>
          {data.newRows?.[0] && (
            <div className="flex justify-between items-center mb-1">
              <span>列数:</span>
              <span className={`font-medium ${themeConfig.text}`}>{Object.keys(data.newRows[0]).length}</span>
            </div>
          )}
        </>
      )}
    </BaseNode>
  )
}
