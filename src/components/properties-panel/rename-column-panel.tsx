import { useCallback, useMemo, useState } from "react"
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
              title: `重命名 ${index + 1}`,
              content: (themeConfig) => <RuleContent column={rename.oldName} operation="→" value={rename.newName} themeConfig={themeConfig} />,
              onRemove: () => handleRemoveRename(index),
            }))}
            title="列重命名"
            themeConfig={themeConfig}
            onClearAll={handleClearAll}
          />

          {!isEditing ? (
            <ActionButton onClick={() => setIsEditing(true)} themeConfig={themeConfig} icon="fa-plus" text="添加重命名规则" className="mb-2" />
          ) : (
            <EditForm
              title="重命名配置"
              onConfirm={handleAddRename}
              onCancel={() => {
                setNewRename({ oldName: "", newName: "" })
                setIsEditing(false)
              }}
              themeConfig={themeConfig}
              confirmDisabled={!newRename.oldName || !newRename.newName || newRename.oldName === newRename.newName}
              confirmText="添加"
            >
              <Select
                label="原列名"
                themeConfig={themeConfig}
                value={newRename.oldName}
                onChange={(value) => setNewRename((prev) => ({ ...prev, oldName: value }))}
                options={availableColumns.map((column) => ({ value: column, label: column }))}
                className="flex-1"
              />
              <Input label="新列名" themeConfig={themeConfig} type="text" value={newRename.newName} onChange={(e) => setNewRename((prev) => ({ ...prev, newName: e.target.value }))} className="flex-1" />
            </EditForm>
          )}
        </div>
      )}
    </BasePanel>
  )
}
