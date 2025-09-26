import { useCallback, useState } from "react"
import type { AddRowNodeData, NodeType } from "../../types"
import type { Node } from "reactflow"
import type { CsvRow } from "../../utils/csv-utils"
import { BasePanel } from "./base-panel"
import { Input } from "../common/input"
import { RuleList, EditForm, ActionButton } from "./common"

interface AddRowPanelProps {
  node: Node<AddRowNodeData, NodeType>
  columns: string[]
  onUpdateRows: (rows: CsvRow[]) => void
}

export const AddRowPanel = ({ node, columns, onUpdateRows }: AddRowPanelProps) => {
  const [newRow, setNewRow] = useState<CsvRow>({})
  const [isEditing, setIsEditing] = useState(false)

  const handleAddRow = useCallback(() => {
    if (Object.keys(newRow).length > 0) {
      const currentRows = node.data.newRows || []
      const updatedRows = [...currentRows, { ...newRow }]
      onUpdateRows(updatedRows)

      setNewRow({})
      setIsEditing(false)
    }
  }, [newRow, node.data.newRows, onUpdateRows])

  const handleRemoveRow = useCallback(
    (index: number) => {
      const currentRows = node.data.newRows || []
      const updatedRows = currentRows.filter((_, i) => i !== index)
      onUpdateRows(updatedRows)
    },
    [node.data.newRows, onUpdateRows]
  )

  const handleClearAll = useCallback(() => {
    onUpdateRows([])
  }, [onUpdateRows])

  const handleCellChange = useCallback((column: string, value: string) => {
    setNewRow((prev: CsvRow) => {
      const updated = { ...prev }
      if (value.trim() === "") {
        delete updated[column]
      } else {
        // 尝试转换为数字
        const numValue = Number(value)
        updated[column] = !isNaN(numValue) ? numValue : value
      }
      return updated
    })
  }, [])

  return (
    <BasePanel node={node}>
      {({ themeConfig }) => {
        return (
          <div className={`mb-5 ${themeConfig.text}`}>
            {!!node.data.newRows?.length && (
              <RuleList
                items={node.data.newRows.map((row, index) => ({
                  id: index.toString(),
                  content: (themeConfig) => (
                    <div className="text-xs flex flex-wrap">
                      {Object.entries(row).map(([key, value], i, arr) => (
                        <span key={key}>
                          <span className={themeConfig.text}>{key}:</span>
                          <span className="text-gray-600 ml-1">{String(value)}</span>
                          {i < arr.length - 1 && <span className="text-gray-400 mx-1">|</span>}
                        </span>
                      ))}
                    </div>
                  ),
                  title: `数据 ${index + 1}`,
                  onRemove: () => handleRemoveRow(index),
                }))}
                title="新增数据"
                onClearAll={handleClearAll}
                themeConfig={themeConfig}
              />
            )}
            {!isEditing ? (
              <ActionButton onClick={() => setIsEditing(true)} themeConfig={themeConfig} text="添加新行" icon="fa-solid fa-plus" />
            ) : (
              <EditForm
                title="新行数据"
                onConfirm={handleAddRow}
                onCancel={() => {
                  setNewRow({})
                  setIsEditing(false)
                }}
                themeConfig={themeConfig}
                confirmDisabled={Object.keys(newRow).length === 0}
              >
                <div className="mb-3">
                  {columns.map((column, index) => (
                    <Input key={`${column}-${index}`} label={column} themeConfig={themeConfig} type="text" value={String(newRow[column] || "")} onChange={(e) => handleCellChange(column, e.target.value)} className="flex-1" />
                  ))}
                </div>
              </EditForm>
            )}
          </div>
        )
      }}
    </BasePanel>
  )
}
