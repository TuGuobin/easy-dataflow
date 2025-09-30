import type { NodeProps } from "reactflow"
import type { RemoveRowNodeData } from "../../types"
import { BaseNode } from "./base-node"

type RemoveRowNodeProps = NodeProps<RemoveRowNodeData>

export const RemoveRowNode = ({ data, ...attrs }: RemoveRowNodeProps) => {
  const hasRules = data.removeRules && data.removeRules.length > 0
  
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!hasRules} emptyStateMessage="messages.noRemoveConditionsSet">
      {({ themeConfig }) => (
        <>
          <div className="flex justify-between items-center mb-1">
            <span>条件:</span>
            <span className={`font-medium ${themeConfig.text}`}>{data.removeRules?.length || 0}</span>
          </div>
          {data.logic && (
            <div className="flex justify-between items-center mb-1">
              <span>逻辑:</span>
              <span className={`font-medium ${themeConfig.text}`}>{data.logic}</span>
            </div>
          )}
        </>
      )}
    </BaseNode>
  )
}
