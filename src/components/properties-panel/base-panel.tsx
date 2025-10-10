import type { Node } from "reactflow"
import { useTranslation } from "react-i18next"
import { type ThemeConfig } from "../../themes/color-theme"
import type { NodeData, NodeType } from "../../types"
import type { ReactNode } from "react"
import { getNodeIconClass, getNodeSecondaryIconClass, getNodeThemeConfig } from "../../config/node-config"

interface BasePanelProps {
  node: Node<NodeData, NodeType> | null
  children: ReactNode | ((props: { themeConfig: ThemeConfig; iconClass: string; secondaryIconClass: string; node: Node<NodeData, NodeType> | null }) => ReactNode)
  className?: string
}

export const BasePanel = ({ node, children, className }: BasePanelProps) => {
  const { t } = useTranslation()
  const themeConfig = getNodeThemeConfig(node?.type)
  const iconClass = getNodeIconClass(node?.type)
  const secondaryIconClass = getNodeSecondaryIconClass(node?.type)

  return (
    <div className={className}>
      <div className="text-xs font-semibold mb-2.5 text-gray-500 uppercase tracking-wide">
        <i className={`fa fa-cog mr-1`}></i>
        {t('common.settings')}
      </div>
      {typeof children === "function" ? children({ themeConfig, iconClass, secondaryIconClass, node }) : children}
    </div>
  )
}
