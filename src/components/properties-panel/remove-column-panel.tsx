import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import type { NodeType, RemoveColumnNodeData } from "../../types"
import type { Node } from "reactflow"
import { BasePanel } from "./base-panel"
import { NoData } from "./no-data"

interface RemoveColumnPanelProps {
  node: Node<RemoveColumnNodeData, NodeType>
  columns: string[]
  onUpdateColumns: (columns: string[]) => void
}

export const RemoveColumnPanel = ({ node, columns, onUpdateColumns }: RemoveColumnPanelProps) => {
  const { t } = useTranslation()
  const handleColumnToggle = useCallback(
    (column: string) => {
      const currentColumns = node.data.columnsToRemove || []
      const updatedColumns = currentColumns.includes(column) ? currentColumns.filter((col) => col !== column) : [...currentColumns, column]

      onUpdateColumns(updatedColumns)
    },
    [node.data.columnsToRemove, onUpdateColumns]
  )

  const checkboxState = useMemo(() => {
    if (!node.data.columnsToRemove?.length) return "empty"
    if (node.data.columnsToRemove.length === columns.length) return "checked"
    return "partial"
  }, [node.data.columnsToRemove, columns])

  const handleToggleAll = useCallback(() => {
    if (checkboxState === "empty" || checkboxState === "partial") {
      onUpdateColumns([...columns])
    } else {
      onUpdateColumns([])
    }
  }, [checkboxState, columns, onUpdateColumns])

  const selectedCount = node.data.columnsToRemove?.length || 0

  return (
    <BasePanel node={node}>
      {({ themeConfig }) => {
        if (!columns?.length) {
          return <NoData title={t('errors.noAvailableColumns')}></NoData>
        }

        return (
          <div className={`space-y-3 ${themeConfig.text}`}>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
              <button
                onClick={handleToggleAll}
                className={`flex items-center gap-2 px-2 py-1 rounded-md border text-sm transition-all duration-200 ${
                  checkboxState === "checked" ? `${themeConfig.bgLight} ${themeConfig.border} ${themeConfig.text}` : checkboxState === "partial" ? "bg-yellow-50 border-yellow-300 text-yellow-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {checkboxState === "checked" ? (
                    <i className={`w-3 h-3 fa-solid fa-check-square ${themeConfig.text}`} />
                  ) : checkboxState === "partial" ? (
                    <i className={`w-3 h-3 fa-solid fa-minus-square ${themeConfig.textLight}`} />
                  ) : (
                    <div className="w-3 h-3 border-1 border-gray-400 rounded-xs" />
                  )}
                </div>
                <span className="font-medium">{t('common.selectAll')}</span>
              </button>

              <div className="text-xs text-gray-500">
                {selectedCount > 0 ? <span className={themeConfig.text}>{selectedCount}</span> : <span>0</span>}
                <span className="mx-1">/</span>
                <span>{columns.length} {t('common.columns')}</span>
              </div>
            </div>

            {/* 列选择列表 */}
            <div className="space-y-1">
              {columns.map((column) => {
                const isSelected = node.data.columnsToRemove?.includes(column)
                return (
                  <div
                    key={column}
                    onClick={() => handleColumnToggle(column)}
                    className={`group flex items-center justify-between py-1.5 px-2.5 rounded-md border cursor-pointer transition-all duration-200 ${
                      isSelected ? `${themeConfig.bgLighter} ${themeConfig.borderLight} ${themeConfig.textDark}` : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-sm font-medium truncate pr-2">{column}</span>
                    <div className={`flex items-center justify-center w-4 h-4 rounded-md border transition-all duration-200 ${isSelected ? `${themeConfig.border} bg-white` : "border-gray-300 bg-gray-50 group-hover:border-gray-400"}`}>
                      {isSelected ? <i className={`text-xs fa-solid fa-check ${themeConfig.text}`} /> : <div className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-gray-500 transition-colors" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }}
    </BasePanel>
  )
}
