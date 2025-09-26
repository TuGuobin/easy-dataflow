import { useCallback, useMemo, useState } from "react"
import type { NodeType, RemoveRowNodeData, FilterOperatorType, RemoveRow } from "../../types"
import type { Node } from "reactflow"
import { BasePanel } from "./base-panel"
import { NoData } from "./no-data"
import { Input, Select } from "../common/input"
import { FILTER_OPERATORS } from "../../types"
import { RuleList, EditForm, ActionButton } from "./common"

interface RemoveRowPanelProps {
  node: Node<RemoveRowNodeData, NodeType>
  columns: string[]
  onUpdateRules: (rules: Array<RemoveRow>, logic: "AND" | "OR") => void
}

const withoutInputList = ["exists", "notExists"]
const defaultRule: RemoveRow = {
  column: "",
  operator: "eq",
  value: "",
}

export const RemoveRowPanel = ({ node, columns, onUpdateRules }: RemoveRowPanelProps) => {
  const [newRule, setNewRule] = useState(defaultRule)
  const [isEditing, setIsEditing] = useState(false)

  const availableColumns = useMemo(() => {
    return columns || []
  }, [columns])

  const handleAddRule = useCallback(() => {
    const isValueRequired = !withoutInputList.includes(newRule.operator)
    if (newRule.column && (!isValueRequired || newRule.value !== "")) {
      const currentRules = node.data.removeRules || []
      const ruleValue = isValueRequired ? newRule.value : ""
      const updatedRules = [...currentRules, { ...newRule, value: ruleValue }]
      onUpdateRules(updatedRules, node.data.logic || "AND")
      setNewRule(defaultRule)
      setIsEditing(false)
    }
  }, [newRule, node.data.removeRules, node.data.logic, onUpdateRules])

  const handleRemoveRule = useCallback(
    (index: number) => {
      const currentRules = node.data.removeRules || []
      const updatedRules = currentRules.filter((_, i) => i !== index)
      onUpdateRules(updatedRules, node.data.logic || "AND")
    },
    [node.data.removeRules, node.data.logic, onUpdateRules]
  )

  const handleClearAll = useCallback(() => {
    onUpdateRules([], node.data.logic || "AND")
  }, [node.data.logic, onUpdateRules])

  const handleLogicChange = useCallback(
    (logic: "AND" | "OR") => {
      onUpdateRules(node.data.removeRules || [], logic)
    },
    [node.data.removeRules, onUpdateRules]
  )

  const getOperatorOptions = useCallback(() => {
    return Object.entries(FILTER_OPERATORS).map(([value, label]) => ({
      value,
      label,
    }))
  }, [])

  return (
    <BasePanel node={node}>
      {({ themeConfig }) => {
        if (!availableColumns?.length) {
          return <NoData title="没有可用的列" />
        }

        return (
          <div className={`mb-5 ${themeConfig.text}`}>
            {!!node.data.removeRules?.length && (
              <RuleList
                items={node.data.removeRules.map((rule, index) => ({
                  id: index.toString(),
                  content: (themeConfig) => (
                    <div className="text-xs">
                      <span className={`font-medium ${themeConfig.text}`}>{rule.column}</span>
                      <span className="text-gray-500 mx-1">{FILTER_OPERATORS[rule.operator]}</span>
                      {!withoutInputList.includes(rule.operator) && <span className="text-gray-600">{String(rule.value)}</span>}
                    </div>
                  ),
                  title: `条件 ${index + 1}`,
                  onRemove: () => handleRemoveRule(index),
                }))}
                title="筛选条件"
                onClearAll={handleClearAll}
                themeConfig={themeConfig}
              />
            )}

            <div className="mb-3">
              <div className="text-xs font-medium text-gray-600 mb-2">逻辑关系:</div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLogicChange("AND")}
                  className={`px-3 py-1 text-xs rounded transition-colors ${node.data.logic === "AND" || !node.data.logic ? `${themeConfig.bgDark} text-white` : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                  且 (AND)
                </button>
                <button onClick={() => handleLogicChange("OR")} className={`px-3 py-1 text-xs rounded transition-colors ${node.data.logic === "OR" ? `${themeConfig.bgDark} text-white` : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                  或 (OR)
                </button>
              </div>
            </div>

            {!isEditing ? (
              <ActionButton onClick={() => setIsEditing(true)} themeConfig={themeConfig} text="添加移除规则" icon="fa-solid fa-plus" />
            ) : (
              <EditForm
                title="移除规则配置"
                onConfirm={handleAddRule}
                onCancel={() => {
                  setNewRule({
                    column: "",
                    operator: "eq",
                    value: "",
                  })
                  setIsEditing(false)
                }}
                themeConfig={themeConfig}
                confirmDisabled={!newRule.column || (!withoutInputList.includes(newRule.operator) && newRule.value === "")}
              >
                <div className="mb-3">
                  <Select
                    label="列名"
                    themeConfig={themeConfig}
                    value={newRule.column}
                    onChange={(value) => setNewRule((prev) => ({ ...prev, column: value }))}
                    options={availableColumns.map((column) => ({ value: column, label: column }))}
                    className="flex-1"
                  />
                  <Select label="操作符" themeConfig={themeConfig} value={newRule.operator} onChange={(value) => setNewRule((prev) => ({ ...prev, operator: value as FilterOperatorType }))} options={getOperatorOptions()} className="flex-1" />
                  {!newRule.operator ||
                    (!withoutInputList.includes(newRule.operator) && <Input label="值" themeConfig={themeConfig} type="text" value={String(newRule.value)} onChange={(e) => setNewRule((prev) => ({ ...prev, value: e.target.value }))} className="flex-1" />)}
                </div>
              </EditForm>
            )}
          </div>
        )
      }}
    </BasePanel>
  )
}
