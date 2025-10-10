import React, { useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import type { NodeType, UploadNodeData, CsvTable } from "../../types"
import type { Node } from "reactflow"
import { BasePanel } from "./base-panel"
import { showAlert } from "../../utils/alert"
import { parseFile } from "../../utils/csv-utils"

interface UploadPanelProps {
  node: Node<UploadNodeData, NodeType>
  onFileChange: (data: CsvTable, rowCount?: number, columnCount?: number) => void
}

const sampleData: CsvTable = [
  { id: 1, name: "Sample 1", value: 100, category: "A" },
  { id: 2, name: "Sample 2", value: 200, category: "B" },
  { id: 3, name: "Sample 3", value: 300, category: "A" },
  { id: 4, name: "Sample 4", value: 150, category: "C" },
  { id: 5, name: "Sample 5", value: 250, category: "B" }
]

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
        const rowCount = data.length
        const columnCount = data.length > 0 ? Object.keys(data[0]).length : 0
        onFileChange(data, rowCount, columnCount)
      } catch (error) {
        console.error("Parse file error:", error)
        showAlert(t("errors.failedToParseFile"))
      }
    },
    [onFileChange, t]
  )

  const handleLoadSampleData = useCallback(() => {
    const rowCount = sampleData.length
    const columnCount = sampleData.length > 0 ? Object.keys(sampleData[0]).length : 0
    onFileChange(sampleData, rowCount, columnCount)
  }, [onFileChange])

  const handleClearData = useCallback(() => {
    onFileChange([], 0, 0)
  }, [onFileChange])

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
            <div className="mb-2">
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

            <div className="mb-1">
              <button
                onClick={handleLoadSampleData}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${themeConfig.bgDark} ${themeConfig.hoverBgDark} text-white`}
              >
                <i className="fa fa-database mr-2"></i>
                {t("uploadPanel.loadSampleData")}
              </button>
            </div>

            {node.data.data && node.data.data.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={handleClearData}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors bg-red-500 hover:bg-red-600 text-white`}
                >
                  <i className="fa fa-trash mr-2"></i>
                  {t("uploadPanel.clearData")}
                </button>
              </div>
            )}

            {node.data.data && node.data.data.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-xs mb-1 text-gray-500">{t("uploadPanel.fileInfo")}</label>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>{t("ui.rowCount")}: {node.data.rowCount || 0}</span>
                  <span>{t("ui.columnCount")}: {node.data.columnCount || 0}</span>
                </div>
              </div>
            )}
          </div>
        )
      }}
    </BasePanel>
  )
}
