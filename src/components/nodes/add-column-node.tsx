import { useTranslation } from "react-i18next"
import type { NodeProps } from "reactflow"
import type { AddColumnNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { getDisplayValue } from "../../utils/csv-utils"
import React from "react"

type AddColumnNodeProps = NodeProps<AddColumnNodeData>

export const AddColumnNode = ({ data, ...attrs }: AddColumnNodeProps) => {
  const { t } = useTranslation()

  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.newColumns?.length} emptyStateMessage="messages.noNewColumnsSet">
      {({ themeConfig }) => (
        <>
          <div className="grid grid-cols-[auto_auto_auto] gap-x-2 gap-y-1">
            {data.newColumns?.slice(0, 2).map((column, index) => (
              <React.Fragment key={index}>
                <span className="truncate text-left max-w-20">{column.name}</span>
                <i className="fas fa-arrow-right w-fit self-center justify-self-center"></i>
                <span className={`truncate font-medium text-xs ${themeConfig.text} text-right max-w-20`}>{getDisplayValue(column.defaultValue)}</span>
              </React.Fragment>
            ))}
          </div>
          {data.newColumns?.length > 2 && (
            <div className="text-xs text-gray-500 text-center mt-3 mb-1">
              +{data.newColumns.length - 2} {t("common.more")}
            </div>
          )}
        </>
      )}
    </BaseNode>
  )
}
