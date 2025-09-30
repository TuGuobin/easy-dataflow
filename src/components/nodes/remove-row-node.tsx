import type { NodeProps } from "reactflow"
import { FILTER_OPERATORS, type RemoveRowNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { useTranslation } from "react-i18next"
import { getDisplayValue } from "../../utils/csv-utils"
import React from "react"

type RemoveRowNodeProps = NodeProps<RemoveRowNodeData>

export const RemoveRowNode = ({ data, ...attrs }: RemoveRowNodeProps) => {
  const hasRules = data.removeRules && data.removeRules.length > 0
  const { t } = useTranslation()
  
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!hasRules} emptyStateMessage="messages.noRemoveConditionsSet">
      {({ themeConfig }) => (
        <>
          {data.logic && (
            <div className="flex justify-between items-center mb-1">
              <span>{t("common.logic")}:</span>
              <span className={`font-medium ${themeConfig.text}`}>{t(`common.${data.logic.toLowerCase()}`)}</span>
            </div>
          )}
          <div className="grid grid-cols-[auto_auto_auto] gap-x-2 gap-y-1">
            {data.removeRules?.slice(0, 2).map((rule, index) => (
              <React.Fragment key={index}>
                <span className="truncate text-left max-w-20">{rule.column}</span>
                <i className="w-fit self-center justify-self-center">{t(FILTER_OPERATORS[rule.operator])}</i>
                <span className={`truncate font-medium text-xs ${themeConfig.text} text-right max-w-20`}>{getDisplayValue(rule.value)}</span>
              </React.Fragment>
            ))}
          </div>
          {data?.removeRules.length > 2 && (
            <div className="text-xs text-gray-500 text-center  mt-3 mb-1">
              +{data.removeRules.length - 2} {t("common.more")}
            </div>
          )}
        </>
      )}
    </BaseNode>
  )
}
