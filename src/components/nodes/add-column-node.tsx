import { useTranslation } from "react-i18next"
import type { NodeProps } from "reactflow"
import type { AddColumnNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { getDisplayValue } from "../../utils/csv-utils"

type AddColumnNodeProps = NodeProps<AddColumnNodeData>

export const AddColumnNode = ({ data, ...attrs }: AddColumnNodeProps) => {
  const { t } = useTranslation()

  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.newColumns?.length} emptyStateMessage="messages.noNewColumnsSet">
      {({ themeConfig }) => (
        <>
          <div className="flex justify-between items-center mb-1">
            <span>{t("ui.columnCount")}:</span>
            <span className={`font-medium ${themeConfig.text}`}>{data.newColumns?.length || 0}</span>
          </div>
          {data.newColumns?.slice(0, 3).map((column, index) => (
            <div key={index} className="flex justify-between items-center mb-1">
              <span className="truncate max-w-16">{column.name}:</span>
              <span className={`font-medium text-xs ${themeConfig.text}`}>{getDisplayValue(column.defaultValue)}</span>
            </div>
          ))}
          {data.newColumns?.length > 3 && (
            <div className="text-xs text-gray-500 text-center">
              +{data.newColumns.length - 3} {t("common.more")}
            </div>
          )}
        </>
      )}
    </BaseNode>
  )
}
