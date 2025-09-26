import type { NodeProps } from "reactflow"
import type { JoinNodeData } from "../../types"
import { BaseNode } from "./base-node"

type JoinNodeProps = NodeProps<JoinNodeData>

export const JoinNode = ({ data, ...attrs }: JoinNodeProps) => {
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.joinRules?.length} emptyStateMessage="未设置连接条件">
      {({ themeConfig }) => (
        <>
          <div className="flex justify-between items-center mb-1">
            <span>条件:</span>
            <span className={`font-medium ${themeConfig.text}`}>{data.joinRules?.length || 0}</span>
          </div>
          {data.joinRules?.[0] && (
            <div className="flex justify-between items-center mb-1">
              <span className="truncate max-w-16">{data.joinRules[0].leftColumn}:</span>
              <span className={`font-medium text-xs ${themeConfig.text}`}>{data.joinRules[0].rightColumn}</span>
            </div>
          )}
          {data.joinRules?.length > 1 && (
            <div className="text-xs text-gray-500 text-center">+{data.joinRules.length - 1} 更多</div>
          )}
        </>
      )}
    </BaseNode>
  )
}
