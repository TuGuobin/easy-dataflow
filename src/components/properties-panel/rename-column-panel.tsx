import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import type { NodeType, RenameColumn, RenameColumnNodeData } from "../../types"
import type { Node } from "reactflow"
import { BasePanel } from "./base-panel"
import { Input, Select } from "../common/input"
import { RuleList, EditForm, ActionButton, RuleContent } from "./common"

interface RenameColumnPanelProps {
  node: Node<RenameColumnNodeData, NodeType>
  columns: string[]
  onUpdateRenames: (renames: Array<RenameColumn>) => void
}

export const RenameColumnPanel = ({ node, columns, onUpdateRenames }: RenameColumnPanelProps) => {
  const { t } = useTranslation()
  const [newRename, setNewRename] = useState({ oldName: "", newName: "" })
  const [isEditing, setIsEditing] = useState(false)

  const availableColumns = useMemo(() => {
    return columns || []
  }, [columns])

  const handleAddRename = useCallback(() => {
    if (newRename.oldName && newRename.newName && newRename.oldName !== newRename.newName) {
      const currentRenames = node.data.renames || []
      const existingIndex = currentRenames.findIndex((r) => r.oldName === newRename.oldName)

      let updatedRenames
      if (existingIndex >= 0) {
        updatedRenames = [...currentRenames]
        updatedRenames[existingIndex] = { ...newRename }
      } else {
        updatedRenames = [...currentRenames, { ...newRename }]
      }

      onUpdateRenames(updatedRenames)
      setNewRename({ oldName: "", newName: "" })
      setIsEditing(false)
    }
  }, [newRename, node.data.renames, onUpdateRenames])

  const handleRemoveRename = useCallback(
    (index: number) => {
      const currentRenames = node.data.renames || []
      const updatedRenames = currentRenames.filter((_, i) => i !== index)
      onUpdateRenames(updatedRenames)
    },
    [node.data.renames, onUpdateRenames]
  )

  const handleClearAll = useCallback(() => {
    onUpdateRenames([])
  }, [onUpdateRenames])

  return (
    <BasePanel node={node}>
      {({ themeConfig }) => (
        <div className={`mb-5 ${themeConfig.text}`}>
          <RuleList
            items={(node.data.renames || []).map((rename, index) => ({
              id: index,
              title: `${t("common.rule")} ${index + 1}`,
              content: (themeConfig) => <RuleContent column={rename.oldName} operation="→" value={rename.newName} themeConfig={themeConfig} />,
              onRemove: () => handleRemoveRename(index),
            }))}
            title={t("ui.renameRule")}
            themeConfig={themeConfig}
            onClearAll={handleClearAll}
          />

          {!isEditing ? (
            <ActionButton onClick={() => setIsEditing(true)} themeConfig={themeConfig} icon="fa-plus" text={t("ui.addNewRule")} className="mb-2" />
          ) : (
            <EditForm
              title={t("ui.addNewRule")}
              onConfirm={handleAddRename}
              onCancel={() => {
                setNewRename({ oldName: "", newName: "" })
                setIsEditing(false)
              }}
              themeConfig={themeConfig}
              confirmDisabled={!newRename.oldName || !newRename.newName || newRename.oldName === newRename.newName}
            >
              <Select
                label={t("ui.originalName")}
                themeConfig={themeConfig}
                value={newRename.oldName}
                labelClassName="bg-gray-50!" 
                onChange={(value) => setNewRename((prev) => ({ ...prev, oldName: value }))}
                options={availableColumns.map((column) => ({ value: column, label: column }))}
                className="flex-1"
              />
              <Input label={t("ui.newName")} labelClassName="bg-gray-50!" themeConfig={themeConfig} type="text" value={newRename.newName} onChange={(val) => setNewRename((prev) => ({ ...prev, newName: val }))} className="flex-1" />
            </EditForm>
          )}
        </div>
      )}
    </BasePanel>
  )
}
