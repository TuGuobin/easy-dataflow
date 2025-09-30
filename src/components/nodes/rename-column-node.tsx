import type { NodeProps } from "reactflow"
import type { RenameColumnNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { useTranslation } from "react-i18next"
import React from "react"

type RenameColumnNodeProps = NodeProps<RenameColumnNodeData>

export const RenameColumnNode = ({ data, ...attrs }: RenameColumnNodeProps) => {
  const { t } = useTranslation()
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.renames?.length} emptyStateMessage="messages.noRenameRulesSet">
      {({ themeConfig }) => (
        <>
          <div className="grid grid-cols-[auto_auto_auto] gap-x-2 gap-y-1">
            {data.renames?.slice(0, 2).map((rule, index) => (
              <React.Fragment key={index}>
                <span className="truncate text-left max-w-20">{rule.oldName}</span>
                <i className="fas fa-arrow-right w-fit self-center justify-self-center"></i>
                <span className={`truncate font-medium text-xs ${themeConfig.text} text-right max-w-20`}>{rule.newName}</span>
              </React.Fragment>
            ))}
          </div>
          {data.renames?.length > 2 && (
            <div className="text-xs text-gray-500 text-center mt-3 mb-1">
              +{data.renames.length - 2} {t("common.more")}
            </div>
          )}
        </>
      )}
    </BaseNode>
  )
}
