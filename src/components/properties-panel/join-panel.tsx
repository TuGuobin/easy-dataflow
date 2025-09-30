import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import type { Node } from "reactflow"
import type { JoinNodeData, JoinRule, JoinOperationType, NodeType, NodeData } from "../../types"
import { JOIN_OPERATORS, JoinOperation } from "../../types"
import { BasePanel } from "./base-panel"
import { NoData } from "./no-data"
import { Select } from "../common/input"
import { RuleList, EditForm, ActionButton } from "./common"
import { getAllColumns } from "../../utils/data-processing-utils"

interface JoinPanelProps {
  node: Node<JoinNodeData, NodeType>
  parents: Node<NodeData, NodeType>[]
  onUpdateJoinRules: (joinRules: JoinRule[]) => void
}

export const JoinPanel = ({ node, parents, onUpdateJoinRules }: JoinPanelProps) => {
  const { t } = useTranslation()
  const [joinRules, setJoinRules] = useState<JoinRule[]>(node.data.joinRules || [])
  const [leftColumns, setLeftColumns] = useState<string[]>([])
  const [rightColumns, setRightColumns] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [newRule, setNewRule] = useState<JoinRule>({
    leftColumn: "",
    rightColumn: "",
    operation: JoinOperation.LEFT_JOIN,
  })

  useEffect(() => {
    if (parents.length >= 1 && parents?.[0]?.data?.data?.length) {
      const leftCols = getAllColumns(parents?.[0]?.data?.data || [])
      setLeftColumns(leftCols)
    }

    if (parents.length >= 2 && parents?.[1]?.data?.data?.length) {
      const rightCols = getAllColumns(parents?.[1]?.data?.data || [])
      setRightColumns(rightCols)
    }
  }, [node, parents])

  const handleAddRule = useCallback(() => {
    if (newRule.leftColumn.trim() && newRule.rightColumn.trim()) {
      const updatedRules = [...joinRules, { ...newRule }]
      setJoinRules(updatedRules)
      onUpdateJoinRules(updatedRules)
      setNewRule({
        leftColumn: "",
        rightColumn: "",
        operation: JoinOperation.LEFT_JOIN,
      })
      setIsEditing(false)
    }
  }, [newRule, joinRules, onUpdateJoinRules])

  const handleRemoveRule = useCallback(
    (index: number) => {
      const newRules = joinRules.filter((_, i) => i !== index)
      setJoinRules(newRules)
      onUpdateJoinRules(newRules)
    },
    [joinRules, onUpdateJoinRules]
  )

  const handleClearAll = useCallback(() => {
    setJoinRules([])
    onUpdateJoinRules([])
  }, [onUpdateJoinRules])

  const handleCancelAdd = useCallback(() => {
    setNewRule({
      leftColumn: "",
      rightColumn: "",
      operation: JoinOperation.LEFT_JOIN,
    })
    setIsEditing(false)
  }, [])

  return (
    <BasePanel node={node}>
      {({ themeConfig }) => {
        if (parents.length < 2) {
          return <NoData title={t("messages.needTwoDataSource")} />
        }

        const leftParent = parents[0]
        const rightParent = parents[1]

        if (!leftParent?.data?.data?.length || !rightParent?.data?.data?.length) {
          return <NoData title={t("messages.insufficientData")} />
        }

        return (
          <div className={`space-y-4 ${themeConfig.text}`}>
            <div>
              {!!joinRules?.length && (
                <RuleList
                  items={joinRules.map((rule, index) => ({
                    id: index.toString(),
                    content: (themeConfig) => (
                      <div className="text-xs">
                        <span className={`font-medium ${themeConfig.text}`}>{rule.leftColumn}</span>
                        <span className="text-gray-500 mx-1">{t(JOIN_OPERATORS[rule.operation])}</span>
                        <span className="text-gray-600">{rule.rightColumn}</span>
                      </div>
                    ),
                    title: `${t("common.rule")} ${index + 1}`,
                    onRemove: () => handleRemoveRule(index),
                  }))}
                  title={t("ui.joinRules")}
                  onClearAll={handleClearAll}
                  themeConfig={themeConfig}
                />
              )}

              <div className="mb-2">
                {!isEditing ? (
                  <ActionButton onClick={() => setIsEditing(true)} themeConfig={themeConfig} text={t("ui.addNewRule")} icon="fa-solid fa-plus" />
                ) : (
                  <EditForm title={t("ui.addNewRule")} onConfirm={handleAddRule} onCancel={handleCancelAdd} themeConfig={themeConfig} confirmDisabled={!newRule.leftColumn.trim() || !newRule.rightColumn.trim()}>
                    <div className="space-y-2">
                      <div>
                        <Select
                          label={`${t("common.column")} [${leftParent.data.title}]`}
                          themeConfig={themeConfig}
                          value={newRule.leftColumn}
                          onChange={(value) => setNewRule((prev) => ({ ...prev, leftColumn: value }))}
                          options={leftColumns.map((col) => ({ value: col, label: col }))}
                        />
                      </div>

                      <div>
                        <Select
                          label={t("ui.joinOperation")}
                          themeConfig={themeConfig}
                          value={newRule.operation}
                          onChange={(value) => setNewRule((prev) => ({ ...prev, operation: value as JoinOperationType }))}
                          options={Object.entries(JOIN_OPERATORS).map(([key, label]) => ({
                            value: key,
                            label: t(label),
                          }))}
                        />
                      </div>

                      <div>
                        <Select
                          label={`${t("common.column")} [${rightParent.data.title}]`}
                          themeConfig={themeConfig}
                          value={newRule.rightColumn}
                          onChange={(value) => setNewRule((prev) => ({ ...prev, rightColumn: value }))}
                          options={rightColumns.map((col) => ({ value: col, label: col }))}
                        />
                      </div>
                    </div>
                  </EditForm>
                )}
              </div>
            </div>
          </div>
        )
      }}
    </BasePanel>
  )
}
