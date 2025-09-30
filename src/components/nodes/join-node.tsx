import type { NodeProps } from "reactflow"
import type { JoinNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { useTranslation } from "react-i18next"
import React from "react"

type JoinNodeProps = NodeProps<JoinNodeData>

export const JoinNode = ({ data, ...attrs }: JoinNodeProps) => {
  const { t } = useTranslation()
  
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.joinRules?.length} emptyStateMessage="messages.noJoinConditionsSet">
      {({ themeConfig }) => (
        <>
          <div className="grid grid-cols-[auto_auto_auto] gap-x-2 gap-y-1">
            {data.joinRules?.slice(0, 2).map((rule, index) => (
              <React.Fragment key={index}>
                <span className="truncate text-left max-w-20">{rule.leftColumn}</span>
                <i className="fas fa-link w-fit self-center"></i>
                <span className={`truncate font-medium text-xs ${themeConfig.text} text-right max-w-20`}>{rule.rightColumn}</span>
              </React.Fragment>
            ))}
          </div>
          {data.joinRules?.length > 2 && <div className="text-xs text-gray-500 text-center mt-3 mb-1">+{data.joinRules.length - 2} {t("common.more")}</div>}
        </>
      )}
    </BaseNode>
  )
}
