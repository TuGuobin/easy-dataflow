import React from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import type { BaseNodeData, NodeType } from "../../types"
import { getNodeThemeConfig, getNodeIconClass, getNodeSecondaryIconClass } from "../../config/node-config"
import { useTranslation } from "react-i18next"

interface EmptyStateProps {
  themeConfig: ReturnType<typeof getNodeThemeConfig>
  iconClass: ReturnType<typeof getNodeSecondaryIconClass>
  message: string
}

export const EmptyState = ({ themeConfig, iconClass, message }: EmptyStateProps) => (
  <div className="text-center py-2">
    <div className="mb-2">
      <i className={`text-2xl ${iconClass} ${themeConfig.text}`}></i>
    </div>
    <div className="text-xs">{message}</div>
  </div>
)

interface BaseNodeProps extends NodeProps {
  data: BaseNodeData
  showEmptyState?: boolean
  emptyStateMessage?: string
  children?: React.ReactNode | ((config: { themeConfig: ReturnType<typeof getNodeThemeConfig>; iconClass: ReturnType<typeof getNodeIconClass>; secondaryIconClass: ReturnType<typeof getNodeSecondaryIconClass> }) => React.ReactNode)
}

export const BaseNode = ({ data, showEmptyState, emptyStateMessage, children, selected, type }: BaseNodeProps) => {
  const themeConfig = getNodeThemeConfig(type as NodeType)
  const iconClass = getNodeIconClass(type as NodeType)
  const secondaryIconClass = getNodeSecondaryIconClass(type as NodeType)
  const { t } = useTranslation()

  return (
    <div
      className={`py-2 px-3 rounded-lg shadow-sm min-w-44 transition-all duration-200 hover:shadow-md relative border-2 border-t-${themeConfig.primary}-500 ${
        selected ? `${themeConfig.border} ${themeConfig.bgLighter} shadow-lg` : `border-gray-300 bg-white hover:shadow-md `
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: selected ? themeConfig.handleBg : "#64748b",
          border: selected ? `2px solid ${themeConfig.handleBorder}` : "2px solid #475569",
          width: "8px",
          height: "8px",
        }}
      />

      <div className={`flex items-center mb-2 pb-2 transition-all duration-200 border-b-2 ${selected ? themeConfig.border : "border-gray-300"}`}>
        <div className={`text-base mr-2 ${themeConfig.text}`}>
          <i className={`${iconClass} ${themeConfig.text}`}></i>
        </div>
        <div className={`font-medium text-sm ${themeConfig.text}`}>{data.title}</div>
      </div>
      <div className="text-xs text-gray-600">
        {showEmptyState ? <EmptyState themeConfig={themeConfig} iconClass={secondaryIconClass} message={t(emptyStateMessage || "common.noData")} /> : typeof children === "function" ? children({ themeConfig, iconClass, secondaryIconClass }) : children}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: selected ? themeConfig.handleBg : "#64748b",
          border: selected ? `2px solid ${themeConfig.handleBorder}` : "2px solid #475569",
          width: "8px",
          height: "8px",
        }}
      />
    </div>
  )
}
