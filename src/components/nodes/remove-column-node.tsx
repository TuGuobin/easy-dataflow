import type { NodeProps } from "reactflow"
import type { RemoveColumnNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { useTranslation } from "react-i18next"
import React from "react"

type RemoveColumnNodeProps = NodeProps<RemoveColumnNodeData>

export const RemoveColumnNode = ({ data, ...attrs }: RemoveColumnNodeProps) => {
  const { t } = useTranslation()

  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.columnsToRemove?.length} emptyStateMessage="messages.noRemoveColumnsSet">
      {({ themeConfig }) => (
        <>
          <div className="grid grid-cols-[auto_auto] gap-x-2 gap-y-1">
            {data.columnsToRemove?.slice(0, 3).map((column, index) => (
              <React.Fragment key={index}>
                <span className="truncate text-left max-w-20">{column}</span>
                <span className={`truncate font-medium text-xs ${themeConfig.text} text-right max-w-20`}>
                <i className="fas fa-times w-fit self-center justify-self-center"></i></span>
              </React.Fragment>
            ))}
          </div>
          {data.columnsToRemove?.length > 3 && <div className="text-xs text-gray-500 text-center mt-3 mb-1">+{data.columnsToRemove.length - 3} {t("common.more")}</div>}
        </>
      )}
    </BaseNode>
  )
}
