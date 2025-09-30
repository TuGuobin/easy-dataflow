import type { NodeProps } from "reactflow"
import type { TransformNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { getTransformOperationDisplayName } from "../../utils/transform-utils"
import { useTranslation } from "react-i18next"
import React from "react"

type TransformNodeProps = NodeProps<TransformNodeData>

export const TransformNode = ({ data, ...attrs }: TransformNodeProps) => {
  const { t } = useTranslation()
  
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.transformations?.length} emptyStateMessage="messages.noTransformRulesSet">
      {({ themeConfig }) => (
        <>
          <div className="grid grid-cols-[auto_auto_auto] gap-x-2 gap-y-1">
            {data.transformations?.slice(0, 2).map((rule, index) => (
              <React.Fragment key={index}>
                <span className="truncate text-left max-w-20">{rule.column}</span>
                <i className="fas fa-arrow-right w-fit self-center justify-self-center"></i>
                <span className={`truncate font-medium text-xs ${themeConfig.text} text-right max-w-36`}>{t(getTransformOperationDisplayName(rule.operation))}</span>
              </React.Fragment>
            ))}
          </div>
          {data.transformations?.length > 2 && (
            <div className="text-xs text-gray-500 text-center mt-3 mb-1">+{data.transformations.length - 2} {t("common.more")}</div>
          )}
        </>
      )}
    </BaseNode>
  )
}
