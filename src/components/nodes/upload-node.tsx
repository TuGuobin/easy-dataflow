import type { NodeProps } from "reactflow"
import type { UploadNodeData } from "../../types"
import { BaseNode } from "./base-node"

type UploadNodeProps = NodeProps<UploadNodeData>

export const UploadNode = ({ data, ...attrs }: UploadNodeProps) => {
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.fileName} emptyStateMessage="messages.noFileUploaded">
      {({ themeConfig }) => (
        <>
          <div className="flex justify-between items-center mb-1">
            <span>文件:</span>
            <span className={`font-medium truncate max-w-24 ${themeConfig.text}`}>{data.fileName}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span>大小:</span>
            <span className={`font-medium ${themeConfig.text}`}>{data.fileSize}</span>
          </div>
        </>
      )}
    </BaseNode>
  )
}
