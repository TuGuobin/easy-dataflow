import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import type { Node } from "reactflow"
import type { NodeType, TransformNodeData } from "../../types"
import type { TransformRule, TransformOperation } from "../../utils/transform-utils"
import { getAvailableTransformOperations, getTransformOperationDisplayName } from "../../utils/transform-utils"
import { BasePanel } from "./base-panel"
import { NoData } from "./no-data"
import { Select } from "../common/input"
import { RuleList, EditForm, ActionButton } from "./common"

interface TransformPanelProps {
  node: Node<TransformNodeData, NodeType>
  columns: string[]
  onUpdateTransformations: (transformations: TransformRule[]) => void
}

export const TransformPanel = ({ node, columns, onUpdateTransformations }: TransformPanelProps) => {
  const { t } = useTranslation()
  const [transformations, setTransformations] = useState<TransformRule[]>(node.data.transformations || [])
  const [availableColumns, setAvailableColumns] = useState<string[]>([])
  const [availableOperations, setAvailableOperations] = useState<TransformOperation[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [newTransformation, setNewTransformation] = useState<TransformRule>({
    column: "",
    operation: "uppercase" as TransformOperation,
    parameters: {},
  })

  useEffect(() => {
    setTransformations(node.data.transformations || [])
  }, [node.data.transformations])

  useEffect(() => {
    setAvailableColumns(columns || [])
    setAvailableOperations(getAvailableTransformOperations("string"))
  }, [columns])

  const handleAddTransformation = useCallback(() => {
    if (newTransformation.column.trim()) {
      const updated = [...transformations, { ...newTransformation }]
      setTransformations(updated)
      onUpdateTransformations(updated)
      setNewTransformation({
        column: "",
        operation: "uppercase" as TransformOperation,
        parameters: {},
      })
      setIsEditing(false)
    }
  }, [newTransformation, transformations, onUpdateTransformations])

  const handleRemoveTransformation = useCallback(
    (index: number) => {
      const updated = transformations.filter((_, i) => i !== index)
      setTransformations(updated)
      onUpdateTransformations(updated)
    },
    [transformations, onUpdateTransformations]
  )

  const handleClearAll = useCallback(() => {
    setTransformations([])
    onUpdateTransformations([])
  }, [onUpdateTransformations])

  const handleCancelAdd = useCallback(() => {
    setNewTransformation({
      column: "",
      operation: "uppercase" as TransformOperation,
      parameters: {},
    })
    setIsEditing(false)
  }, [])

  return (
    <BasePanel node={node}>
      {({ themeConfig }) => {
        if (!columns || columns.length === 0) {
          return <NoData title={t("messages.insufficientData")} />
        }

        return (
          <div className={`mb-5 ${themeConfig.text}`}>
            {!!transformations?.length && (
              <RuleList
                items={transformations.map((transformation, index) => ({
                  id: index.toString(),
                  content: (themeConfig) => (
                    <div className="text-xs">
                      <span className={`font-medium ${themeConfig.text}`}>{transformation.column}</span>
                      <span className="text-gray-500 mx-1">→</span>
                      <span className="text-gray-600">{t(getTransformOperationDisplayName(transformation.operation))}</span>
                    </div>
                  ),
                  title: `${t("common.rule")} ${index + 1}`,
                  onRemove: () => handleRemoveTransformation(index),
                }))}
                title={t("ui.transformRule")}
                onClearAll={handleClearAll}
                themeConfig={themeConfig}
              />
            )}

            {!isEditing ? (
              <ActionButton onClick={() => setIsEditing(true)} themeConfig={themeConfig} text={t("ui.addNewRule")} icon="fa-solid fa-plus" />
            ) : (
              <EditForm title={t("ui.addNewRule")} onConfirm={handleAddTransformation} onCancel={handleCancelAdd} themeConfig={themeConfig} confirmDisabled={!newTransformation.column.trim()}>
                <div className="space-y-2">
                  <Select
                    label={t("ui.selectColumn")}
                    labelClassName="bg-gray-50!"
                    themeConfig={themeConfig}
                    value={newTransformation.column}
                    onChange={(value) => setNewTransformation((prev) => ({ ...prev, column: value }))}
                    options={availableColumns.map((col) => ({ value: col, label: col }))}
                  />
                  <Select
                    label={t("ui.transformOperation")}
                    themeConfig={themeConfig}
                    labelClassName="bg-gray-50!"
                    value={newTransformation.operation}
                    onChange={(value) => setNewTransformation((prev) => ({ ...prev, operation: value as TransformOperation }))}
                    options={availableOperations.map((op) => ({
                      value: op,
                      label: t(getTransformOperationDisplayName(op)),
                    }))}
                  />
                </div>
              </EditForm>
            )}
          </div>
        )
      }}
    </BasePanel>
  )
}
