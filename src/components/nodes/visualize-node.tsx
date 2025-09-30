import type { NodeProps } from "reactflow"
import type { VisualizeNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { getChartTypeDisplayName } from "../../utils/visualize-utils"
import { useTranslation } from "react-i18next"

type VisualizeNodeProps = NodeProps<VisualizeNodeData>

export const VisualizeNode = ({ data, ...attrs }: VisualizeNodeProps) => {
  const { t } = useTranslation()
  
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.chartConfig?.type} emptyStateMessage="messages.noChartTypeSet">
      {({ themeConfig }) => (
        <>
          <div className="flex justify-between items-center mb-1 gap-1">
            <span>{t("common.type")}:</span>
            <span className={`font-medium truncate max-w-20 ${themeConfig.text}`}>
              {data.chartConfig?.type ? t(getChartTypeDisplayName(data.chartConfig.type)) : t("common.notSet")}
            </span>
          </div>
          {data.chartConfig?.xAxis && (
            <div className="flex justify-between items-center mb-1 gap-1">
              <span>{t("ui.labelColumn")}:</span>
              <span className={`font-medium truncate max-w-16 ${themeConfig.text}`}>{data.chartConfig.xAxis}</span>
            </div>
          )}
          {data.chartConfig?.yAxis && (
            <div className="flex justify-between items-center mb-1 gap-1">
              <span>{t("ui.valueColumn")}:</span>
              <span className={`font-medium truncate max-w-16 ${themeConfig.text}`}>{data.chartConfig.yAxis}</span>
            </div>
          )}
          {data.chartConfig?.groupBy && (
            <div className="flex justify-between items-center mb-1 gap-1">
              <span>{t("ui.groupByColumn")}:</span>
              <span className={`font-medium truncate max-w-16 ${themeConfig.text}`}>{data.chartConfig.groupBy}</span>
            </div>
          )}
        </>
      )}
    </BaseNode>
  )
}
