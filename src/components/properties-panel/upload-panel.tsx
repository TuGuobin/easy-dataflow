import React, { useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import type { NodeType, UploadNodeData, CsvTable } from "../../types"
import type { Node } from "reactflow"
import { BasePanel } from "./base-panel"
import { showAlert } from "../../utils/alert"
import { parseFile } from "../../utils/csv-utils"

interface UploadPanelProps {
  node: Node<UploadNodeData, NodeType>
  onFileChange: (data: CsvTable, file: File) => void
}

export const UploadPanel = ({ node, onFileChange }: UploadPanelProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const inputFile = useCallback(
    async (file?: File) => {
      if (!file) return

      const fileName = file.name.toLowerCase()
      const isValid = fileName.endsWith(".csv") || fileName.endsWith(".xlsx") || fileName.endsWith(".xls")

      if (!isValid) {
        showAlert(t("errors.uploadCSVOrExcel"))
        return
      }

      try {
        const data = await parseFile(file)
        onFileChange(data, file)
      } catch (error) {
        console.error("Parse file error:", error)
        showAlert(t("errors.failedToParseFile"))
      }
    },
    [onFileChange, t]
  )

  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      inputFile(file)
    },
    [inputFile]
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
        inputFile(file)
      }
    },
    [inputFile]
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
                <div className="text-sm font-bold">{isDragOver ? t("uploadPanel.releaseToUpload") : t("uploadPanel.clickOrDragToUpload")}</div>
                <div className="text-xs text-gray-500 mt-1">{t("uploadPanel.supportCSVOrExcelFormat")}</div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" onChange={handleFileInput} />
            </div>

            {node.data.fileSize && (
              <div className="mb-4">
                <label className="block text-xs mb-1 text-gray-500">{t("uploadPanel.fileInfo")}</label>
                <div className="text-sm text-gray-700">
                  {t("uploadPanel.fileName")}: {node.data.fileName || t("uploadPanel.notUploaded")}
                </div>
                {node.data.fileSize && (
                  <div className="text-sm text-gray-700">
                    {t("uploadPanel.fileSize")}: {node.data.fileSize}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      }}
    </BasePanel>
  )
}
