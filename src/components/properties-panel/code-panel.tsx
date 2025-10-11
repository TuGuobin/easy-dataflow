import { useState, useEffect, useCallback, useRef } from "react"
import { useTranslation } from "react-i18next"
import type { Node } from "reactflow"
import type { NodeType, CodeNodeData } from "../../types"
import { BasePanel } from "./base-panel"
import { MonacoEditor } from "../common/monaco-editor"
import { errorBus } from "../../utils/pubsub"

interface CodePanelProps {
  node: Node<CodeNodeData, NodeType>
  onUpdateCode: (code: string) => void
}

const FRAMEWORK_CODE = `/**
 * @typedef {string | number | boolean | Date | null} CsvData
 * @typedef {{ [key: string]: CsvData }} CsvRow
 * @typedef {CsvRow[]} CsvTable
 */

/**
 * 数据处理函数
 * @param {CsvTable} data 原始数据对象
 * @returns {CsvTable} 返回处理后的数据对象，格式与输入相同
 */
function processData(data) {
  // 在这里编写你的数据处理逻辑
  // 例如，你可以对数据进行过滤、转换等操作
  // data = data.slice(0, 10) // 示例：只保留前10行数据
  return data;
}`

export const CodePanel = ({ node, onUpdateCode }: CodePanelProps) => {
  const { t } = useTranslation()
  const [code, setCode] = useState(node.data.code || FRAMEWORK_CODE)
  const [error, setError] = useState<string | null>(null)
  const debounceTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const initialCode = node.data.code || FRAMEWORK_CODE
    setCode(initialCode)
  }, [node.data.code])

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value)
      setError(null)

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        onUpdateCode(value)
      }, 500)
    },
    [onUpdateCode]
  )

  useEffect(() => {
    const handleError = (err: string) => {
      setError(err)
    }

    errorBus.on("error", handleError)

    return () => {
      errorBus.off("error", handleError)
    }
  }, [])

  return (
    <BasePanel node={node}>
      {({ themeConfig }) => (
        <div className={`mb-5 ${themeConfig.text}`}>
          <div className="mb-4">
            <div className="border rounded-md border-gray-200 bg-white overflow-hidden">
              <MonacoEditor value={code} onChange={handleCodeChange} language="javascript" theme="vs" height="400px" className="w-full" />
            </div>

            {error && (
              <div className="mt-2 text-xs text-red-400 bg-red-50 p-2 rounded-md border border-red-500">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  <span>
                    {t("errors.invalidCode")}: {error}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </BasePanel>
  )
}
