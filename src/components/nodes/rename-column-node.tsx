import type { NodeProps } from "reactflow"
import type { RenameColumnNodeData } from "../../types"
import { BaseNode } from "./base-node"

type RenameColumnNodeProps = NodeProps<RenameColumnNodeData>

export const RenameColumnNode = ({ data, ...attrs }: RenameColumnNodeProps) => {
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.renames?.length} emptyStateMessage="messages.noRenameRulesSet">
      {({ themeConfig }) => (
        <>
          <div className="flex justify-between items-center mb-1">
            <span>重命名:</span>
            <span className={`font-medium ${themeConfig.text}`}>{data.renames?.length || 0}</span>
          </div>
          {data.renames?.slice(0, 2).map((rule, index) => (
            <div key={index} className="flex justify-between items-center mb-1">
              <span className="truncate max-w-12">{rule.oldName}:</span>
              <span className={`font-medium text-xs ${themeConfig.text}`}>{rule.newName}</span>
            </div>
          ))}
          {data.renames?.length > 2 && (
            <div className="text-xs text-gray-500 text-center">+{data.renames.length - 2} 更多</div>
          )}
        </>
      )}
    </BaseNode>
  )
}
