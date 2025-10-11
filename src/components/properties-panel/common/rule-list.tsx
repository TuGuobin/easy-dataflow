import React from "react"
import { useTranslation } from "react-i18next"
import type { ThemeConfig } from "../../../themes/color-theme"

export interface RuleItem {
  id: string | number
  title: string
  content: React.ReactNode | ((themeConfig: ThemeConfig) => React.ReactNode)
  onRemove: (id: string | number) => void
}

export interface RuleListProps {
  items: RuleItem[]
  title: string
  themeConfig: ThemeConfig
  onClearAll?: () => void
}

export const RuleList: React.FC<RuleListProps> = ({ items, title, themeConfig, onClearAll }) => {
  const { t } = useTranslation()
  if (!items.length) {
    return null
  }

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs font-medium text-gray-600">{t(title)}</div>
        {onClearAll && (
          <button onClick={onClearAll} className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 active:bg-red-700 transition-colors">
            {t('common.clearAll')}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="p-2 pl-3 border border-gray-200 rounded-md bg-white">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">{t(item.title)}</span>
              <button onClick={() => item.onRemove(item.id)} className="text-xs text-red-500 hover:text-red-600 active:text-red-700 transition-colors cursor-pointer">
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
            <div className="text-xs text-gray-500">{typeof item.content === "function" ? item.content(themeConfig) : item.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
