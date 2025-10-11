import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import type { NodeType } from "../../types"
import { getNodeIconClass, getNodeThemeConfig, getCategoriedNodes, categoryConfig } from "../../config/node-config"

interface ToolboxItemProps {
  type: NodeType
  label: string
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void
}

const ToolboxItem: React.FC<ToolboxItemProps> = ({ type, label, onDragStart }) => {
  const themeConfig = getNodeThemeConfig(type)
  const iconClass = getNodeIconClass(type)

  const theme = {
    base: `bg-white ${themeConfig.borderLight} text-gray-700`,
    hover: `${themeConfig.hoverBgLight} ${themeConfig.hoverBorder}`,
    active: `${themeConfig.activeBorder}`,
    icon: `${themeConfig.text} ${themeConfig.bgLight}`,
  }

  return (
    <div
      className={`group flex items-center p-2 mb-1 border rounded-lg cursor-grab transition-all duration-150 active:cursor-grabbing text-xs gap-2 ${theme.base} ${theme.hover} ${theme.active}`}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
      data-tauri-drag-region
      title={label}
    >
      <div className={`flex items-center justify-center w-6 h-6 rounded-md ${theme.icon} transition-all duration-150 flex-shrink-0`}>
        <i className={`text-xs ${iconClass} ${themeConfig.primary}`}></i>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-800 truncate">{label}</div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
        <i className={`text-xs fa-grip-vertical fa-solid`}></i>
      </div>
    </div>
  )
}

interface ToolboxCategoryProps {
  title: string
  icon: string
  items: Array<{
    type: NodeType
    label: string
    icon: string
    themeColor: string
  }>
  defaultExpanded?: boolean
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void
}

const ToolboxCategory: React.FC<ToolboxCategoryProps> = ({ title, icon, items, defaultExpanded = true, onDragStart }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="mb-2">
      <button className="flex items-center w-full px-2 py-1 text-left hover:bg-gray-100 rounded-md transition-colors group" onClick={() => setIsExpanded(!isExpanded)}>
        <i className={`text-xs ${icon} text-gray-500 mr-2 w-3.5 text-center`}></i>
        <span className="text-xs font-medium text-gray-700 flex-1">{title}</span>
        <span className="text-xs text-gray-500">{items.length}</span>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
        <div className="ml-2 space-y-0.5">
          {items.map((item) => (
            <ToolboxItem key={item.type} type={item.type} label={item.label} onDragStart={onDragStart} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface ToolboxProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void
}

export const Toolbox: React.FC<ToolboxProps> = ({ onDragStart }) => {
  const { t } = useTranslation()
  const categoriedNodes = getCategoriedNodes()
  const categories = Object.entries(categoriedNodes).map(([category, nodes]) => {
    const config = categoryConfig[category as keyof typeof categoryConfig]
    if (!config) return null

    const items = nodes.map((node) => ({
      type: node.type,
      label: t(node.title),
      icon: `${node.icon.type} ${node.icon.primary}`,
      themeColor: node.color,
    }))

    return {
      title: t(config.title),
      icon: config.icon,
      items,
    }
  })

  return <div className="p-1.5 overflow-y-auto flex-1">{categories.map((category) => !!category && <ToolboxCategory key={category.title} title={category.title} icon={category.icon} items={category.items} onDragStart={onDragStart} />)}</div>
}
