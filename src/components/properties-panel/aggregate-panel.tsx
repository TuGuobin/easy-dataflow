import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import type { Node } from "reactflow"
import type { NodeType, AggregateNodeData } from "../../types"
import type { AggregationRule, AggregationOperation } from "../../utils/aggregate-utils"
import { getAggregationOperationDisplayName } from "../../utils/aggregate-utils"
import { BasePanel } from "./base-panel"
import { Input, Select } from "../common/input"
import { RuleList, EditForm, ActionButton } from "./common"

interface AggregatePanelProps {
  node: Node<AggregateNodeData, NodeType>
  columns: string[]
  onUpdateAggregations: (aggregations: AggregationRule[]) => void
  onUpdateGroupBy: (groupBy: string) => void
}

export const AggregatePanel = ({ node, columns, onUpdateAggregations, onUpdateGroupBy }: AggregatePanelProps) => {
  const { t } = useTranslation()
  const [aggregations, setAggregations] = useState<AggregationRule[]>(node.data.aggregations || [])
  const [groupBy, setGroupBy] = useState<string>(node.data.groupBy || "")
  const [availableOperations, setAvailableOperations] = useState<AggregationOperation[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [newAggregation, setNewAggregation] = useState<AggregationRule>({
    column: "",
    operation: "sum",
    alias: "",
  })

  useEffect(() => {
    setAggregations(node.data.aggregations || [])
    setGroupBy(node.data.groupBy || "")
  }, [node.data])

  useEffect(() => {
    setAvailableOperations(["sum" as AggregationOperation, "avg" as AggregationOperation, "count" as AggregationOperation, "min" as AggregationOperation, "max" as AggregationOperation, "unique" as AggregationOperation])
  }, [])

  const handleAddAggregation = useCallback(() => {
    if (newAggregation.column.trim()) {
      const updated = [...aggregations, { ...newAggregation }]
      setAggregations(updated)
      onUpdateAggregations(updated)
      setNewAggregation({
        column: "",
        operation: "sum",
        alias: "",
      })
      setIsEditing(false)
    }
  }, [newAggregation, aggregations, onUpdateAggregations])

  const handleRemoveAggregation = useCallback(
    (index: number) => {
      const updated = aggregations.filter((_, i) => i !== index)
      setAggregations(updated)
      onUpdateAggregations(updated)
    },
    [aggregations, onUpdateAggregations]
  )

  const handleGroupByChange = useCallback(
    (value: string) => {
      setGroupBy(value)
      onUpdateGroupBy(value)
    },
    [onUpdateGroupBy]
  )

  const handleClearAll = useCallback(() => {
    setAggregations([])
    onUpdateAggregations([])
  }, [onUpdateAggregations])

  const handleCancelAdd = useCallback(() => {
    setNewAggregation({
      column: "",
      operation: "sum",
      alias: "",
    })
    setIsEditing(false)
  }, [])

  return (
    <BasePanel node={node}>
      {({ themeConfig }) => {
        return (
          <div className={`mb-5 ${themeConfig.text}`}>
            <div className="mb-6">
              <div className="mb-4">
                <Select label={t("ui.selectGroupByColumn")} themeConfig={themeConfig} value={groupBy} onChange={handleGroupByChange} options={columns.map((col) => ({ value: col, label: col }))} />
              </div>
              {!!aggregations?.length && (
                <RuleList
                  items={aggregations.map((aggregation, index) => ({
                    id: index.toString(),
                    content: (themeConfig) => (
                      <div className="text-xs">
                        <span className={`font-medium ${themeConfig.text}`}>{aggregation.column}</span>
                        <span className="text-gray-500 mx-1">{t(getAggregationOperationDisplayName(aggregation.operation))}</span>
                        {aggregation.alias && (
                          <span className="text-gray-600">→ {aggregation.alias}</span>
                        )}
                      </div>
                    ),
                    title: `${t("common.rule")} ${index + 1}`,
                    onRemove: () => handleRemoveAggregation(index),
                  }))}
                  title={t("ui.aggregationRule")}
                  onClearAll={handleClearAll}
                  themeConfig={themeConfig}
                />
              )}

              {!isEditing ? (
                <ActionButton
                  onClick={() => setIsEditing(true)}
                  themeConfig={themeConfig}
                  text={t("ui.addNewRule")}
                  icon="fa-solid fa-plus"
                />
              ) : (
                <EditForm
                  title={t("ui.addNewRule")}
                  onConfirm={handleAddAggregation}
                  onCancel={handleCancelAdd}
                  themeConfig={themeConfig}
                  confirmDisabled={!newAggregation.column.trim()}
                >
                  <div className="space-y-2">
                    <div>
                      <Select label={t("ui.selectColumn")} themeConfig={themeConfig} labelClassName="bg-gray-50!" value={newAggregation.column} onChange={(value) => setNewAggregation(prev => ({ ...prev, column: value }))} options={columns.map((col) => ({ value: col, label: col }))} />
                    </div>

                    <div>
                      <Select
                        label={t("ui.aggregationOperation")}
                        themeConfig={themeConfig}
                        labelClassName="bg-gray-50!"
                        value={newAggregation.operation}
                        onChange={(value) => setNewAggregation(prev => ({ ...prev, operation: value as AggregationOperation }))}
                        options={availableOperations.map((op) => ({
                          value: op,
                          label: t(getAggregationOperationDisplayName(op)),
                        }))}
                      />
                    </div>

                    <div>
                      <Input label={t("ui.alias")} labelClassName="bg-gray-50!" themeConfig={themeConfig} value={newAggregation.alias} onChange={(val) => setNewAggregation(prev => ({ ...prev, alias: val }))} />
                    </div>
                  </div>
                </EditForm>
              )}
            </div>
          </div>
        )
      }}
    </BasePanel>
  )
}
