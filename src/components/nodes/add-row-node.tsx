import type { NodeProps } from "reactflow"
import type { AddRowNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { useTranslation } from "react-i18next"

type AddRowNodeProps = NodeProps<AddRowNodeData>

export const AddRowNode = ({ data, ...attrs }: AddRowNodeProps) => {
  const { t } = useTranslation()
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.newRows?.length} emptyStateMessage="messages.noNewRowsSet">
      {({ themeConfig }) => (
        <>
          <div className="flex justify-between items-center mb-1">
            <span>{t("ui.rowCount")}:</span>
            <span className={`font-medium ${themeConfig.text}`}>{data.newRows?.length || 0}</span>
          </div>
          {data.newRows?.[0] && (
            <div className="flex justify-between items-center mb-1">
              <span>{t("ui.columnCount")}:</span>
              <span className={`font-medium ${themeConfig.text}`}>{Object.keys(data.newRows[0]).length}</span>
            </div>
          )}
          {data.newRows?.length > 0 && (
            <div className="text-xs text-gray-500 text-center">
              {t("ui.preview")}: {JSON.stringify(data.newRows[0]).slice(0, 30)}...
            </div>
          )}
        </>
      )}
    </BaseNode>
  )
}
