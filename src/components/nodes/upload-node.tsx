import type { NodeProps } from "reactflow"
import type { UploadNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { useTranslation } from "react-i18next"

type UploadNodeProps = NodeProps<UploadNodeData>

export const UploadNode = ({ data, ...attrs }: UploadNodeProps) => {
  const { t } = useTranslation()
  
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.fileName} emptyStateMessage="messages.noFileUploaded">
      {({ themeConfig }) => (
        <>
          <div className="flex justify-between items-center mb-1">
            <span>{t("uploadPanel.fileName")}:</span>
            <span className={`font-medium truncate max-w-20 ${themeConfig.text}`}>{data.fileName}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span>{t("uploadPanel.fileSize")}:</span>
            <span className={`font-medium ${themeConfig.text}`}>{data.fileSize}</span>
          </div>
        </>
      )}
    </BaseNode>
  )
}
