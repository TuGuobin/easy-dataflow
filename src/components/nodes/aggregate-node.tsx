import type { NodeProps } from "reactflow"
import type { AggregateNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { getAggregationOperationDisplayName } from "../../utils/aggregate-utils"
import { useTranslation } from "react-i18next"
import React from "react"

type AggregateNodeProps = NodeProps<AggregateNodeData>

export const AggregateNode = ({ data, ...attrs }: AggregateNodeProps) => {
  const { t } = useTranslation()

  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.aggregations?.length} emptyStateMessage="messages.noAggregationOperationsSet">
      {({ themeConfig }) => (
        <>
          {data.groupBy && (
            <div className="flex justify-between items-center mb-1">
              <span>{t("common.groupBy")}:</span>
              <span className={`font-medium truncate max-w-16 ${themeConfig.text}`}>{data.groupBy}</span>
            </div>
          )}
          <div className="grid grid-cols-[auto_auto_auto] gap-x-2 gap-y-1">
            {data.aggregations?.slice(0, 2).map((agg, index) => (
              <React.Fragment key={index}>
                <span className="truncate text-left max-w-20">{agg.column}</span>
                <i className="fas fa-arrow-right w-fit self-center justify-self-center"></i>
                <span className={`truncate font-medium text-xs ${themeConfig.text} text-right max-w-20`}>{t(getAggregationOperationDisplayName(agg.operation))}</span>
              </React.Fragment>
            ))}
          </div>
          {data.aggregations?.length > 2 && <div className="text-xs text-gray-500 text-center mt-3 mb-1">+{data.aggregations.length - 2} {t("common.more")}</div>}
        </>
      )}
    </BaseNode>
  )
}
