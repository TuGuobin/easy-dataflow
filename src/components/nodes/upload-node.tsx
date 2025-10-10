import type { NodeProps } from "reactflow"
import type { UploadNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { useTranslation } from "react-i18next"

type UploadNodeProps = NodeProps<UploadNodeData>

export const UploadNode = ({ data, ...attrs }: UploadNodeProps) => {
  const { t } = useTranslation()
  
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.data || data.data.length === 0} emptyStateMessage="messages.noFileUploaded">
      {({ themeConfig }) => (
        <>
          <div className="flex justify-between items-center mb-1">
            <span>{t("ui.rowCount")}:</span>
            <span className={`font-medium ${themeConfig.text}`}>{data.rowCount || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>{t("ui.columnCount")}:</span>
            <span className={`font-medium ${themeConfig.text}`}>{data.columnCount || 0}</span>
          </div>
        </>
      )}
    </BaseNode>
  )
}
