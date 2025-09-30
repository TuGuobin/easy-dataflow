import { useCallback, useState } from "react"
import { COL_TYPES, type AddColumn, type AddColumnNodeData, type ColType, type NodeType } from "../../types"
import type { Node } from "reactflow"
import { BasePanel } from "./base-panel"
import { Input, Select } from "../common/input"
import { RuleList, EditForm, ActionButton } from "./common"
import { useTranslation } from "react-i18next"

interface AddColumnPanelProps {
  node: Node<AddColumnNodeData, NodeType>
  onUpdateColumns: (columns: Array<AddColumn>) => void
}

export const AddColumnPanel = ({ node, onUpdateColumns }: AddColumnPanelProps) => {
  const [newColumn, setNewColumn] = useState<AddColumn>({
    name: "",
    type: "string",
    defaultValue: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const { t } = useTranslation()

  const handleAddColumn = useCallback(() => {
    if (newColumn.name.trim()) {
      const currentColumns = node.data.newColumns || []
      const updatedColumns = [...currentColumns, { ...newColumn }]
      onUpdateColumns(updatedColumns)
      setNewColumn({
        name: "",
        type: "string",
        defaultValue: "",
      })
      setIsEditing(false)
    }
  }, [newColumn, node.data.newColumns, onUpdateColumns])

  const handleRemoveColumn = useCallback(
    (index: number) => {
      const currentColumns = node.data.newColumns || []
      const updatedColumns = currentColumns.filter((_, i) => i !== index)
      onUpdateColumns(updatedColumns)
    },
    [node.data.newColumns, onUpdateColumns]
  )

  const handleClearAll = useCallback(() => {
    onUpdateColumns([])
  }, [onUpdateColumns])

  const handleDefaultValueChange = useCallback((value: string) => {
    setNewColumn((prev) => {
      let finalValue: string | number | boolean = value

      if (prev.type === "number") {
        const numValue = Number(value)
        finalValue = !isNaN(numValue) ? numValue : 0
      } else if (prev.type === "boolean") {
        finalValue = value === "true" || value === "1"
      }

      return { ...prev, defaultValue: finalValue }
    })
  }, [])

  return (
    <BasePanel node={node}>
      {({ themeConfig }) => (
        <div className={`mb-5 ${themeConfig.text}`}>
          <RuleList
            items={(node.data.newColumns || []).map((column, index) => ({
              id: index,
              title: `${t("common.column")} ${index + 1}`,
              content: (themeConfig) => (
                <div className="text-xs">
                  <span className={`font-medium ${themeConfig.text}`}>{column.name}</span>
                  <span className="text-gray-500 ml-1">({column.type})</span>
                  <span className="text-gray-400 ml-2">{t("ui.defaultValue")}: {String(column.defaultValue)}</span>
                </div>
              ),
              onRemove: () => handleRemoveColumn(index),
            }))}
            title={t("ui.addNewColumn")}
            themeConfig={themeConfig}
            onClearAll={handleClearAll}
          />

          {!isEditing ? (
            <ActionButton onClick={() => setIsEditing(true)} themeConfig={themeConfig} icon="fa-plus" text={t("ui.addNewColumn")} className="mb-2" />
          ) : (
            <EditForm
              title={t("ui.addNewColumn")}
              onConfirm={handleAddColumn}
              onCancel={() => {
                setNewColumn({
                  name: "",
                  type: "string",
                  defaultValue: "",
                })
                setIsEditing(false)
              }}
              themeConfig={themeConfig}
              confirmDisabled={!newColumn.name.trim()}
            >
              <Input label={t("ui.columnName")} themeConfig={themeConfig} type="text" value={newColumn.name} onChange={(val) => setNewColumn((prev) => ({ ...prev, name: val }))} className="flex-1" />
              <Select
                label={t("ui.dataType")}
                themeConfig={themeConfig}
                value={newColumn.type}
                onChange={(value) => {
                  setNewColumn((prev) => ({ ...prev, type: value as ColType }))
                }}
                options={Object.entries(COL_TYPES).map(([key, value]) => ({ value: key, label: t(value) }))}
                className="flex-1"
              />
              <Input label={t("ui.defaultValue")} themeConfig={themeConfig} type="text" value={String(newColumn.defaultValue)} onChange={handleDefaultValueChange} className="flex-1" />
            </EditForm>
          )}
        </div>
      )}
    </BasePanel>
  )
}
