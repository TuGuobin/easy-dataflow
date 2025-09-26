import React, { useCallback, useRef, useState } from "react"
import type { NodeType, UploadNodeData } from "../../types"
import type { Node } from "reactflow"
import { BasePanel } from "./base-panel"
import { showAlert } from "../../utils/alert"

interface UploadPanelProps {
  node: Node<UploadNodeData, NodeType>
  onFileChange: (file: File) => void
}

export const UploadPanel = ({ node, onFileChange }: UploadPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        onFileChange(file)
      }
    },
    [onFileChange]
  )

  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragOver(false)

      const files = event.dataTransfer.files
      if (files && files.length > 0) {
        const file = files[0]
        if (file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")) {
          onFileChange(file)
        } else {
          showAlert("请上传CSV格式的文件")
        }
      }
    },
    [onFileChange]
  )

  return (
    <BasePanel node={node}>
      {({ themeConfig, iconClass, secondaryIconClass }) => {
        return (
          <div className={`mb-5 ${themeConfig.text}`}>
            <div className="mb-4">
              <div
                className={`border-2 border-dashed rounded p-5 text-center cursor-pointer transition-all ${isDragOver ? `${themeConfig.border} ${themeConfig.bgLight}` : `${themeConfig.hoverBorder} ${themeConfig.hoverBgLight} border-gray-200`}`}
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-3xl mb-2.5">
                  <i className={isDragOver ? iconClass : secondaryIconClass}></i>
                </div>
                <div className="text-sm font-bold">{isDragOver ? "释放文件以上传" : "点击或拖拽文件到此处上传"}</div>
                <div className="text-xs text-gray-500 mt-1">支持CSV格式文件</div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept=".csv,text/csv" onChange={handleFileInput} />
            </div>

            {node.data.fileSize && (
              <div className="mb-4">
                <label className="block text-xs mb-1 text-gray-500">文件信息</label>
                <div className="text-sm text-gray-700">文件名: {node.data.fileName || "未上传"}</div>
                {node.data.fileSize && <div className="text-sm text-gray-700">文件大小: {node.data.fileSize}</div>}
              </div>
            )}
          </div>
        )
      }}
    </BasePanel>
  )
}
