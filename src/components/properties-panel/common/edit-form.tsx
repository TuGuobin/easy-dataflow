import React from "react"
import { useTranslation } from "react-i18next"
import type { ThemeConfig } from "../../../themes/color-theme"

export interface EditFormProps {
  title: string
  children: React.ReactNode
  onConfirm: () => void
  onCancel: () => void
  themeConfig: ThemeConfig
  confirmDisabled?: boolean
  confirmText?: string
  cancelText?: string
}

export const EditForm: React.FC<EditFormProps> = ({ title, children, onConfirm, onCancel, themeConfig, confirmDisabled = false, confirmText = "common.add", cancelText = "common.cancel" }) => {
  const { t } = useTranslation()
  return (
    <div className="mb-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
      <div className="text-xs font-medium text-gray-600 mb-2">{t(title)}</div>
      <div className="space-y-2">{children}</div>

      <div className="flex gap-2 mt-3">
        <button onClick={onConfirm} disabled={confirmDisabled} className={`flex-1 px-3 py-2 ${themeConfig.bgDark} text-white rounded ${themeConfig.hoverBgDark} text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed`}>
          {t(confirmText)}
        </button>
        <button onClick={onCancel} className="flex-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium transition-colors">
          {t(cancelText)}
        </button>
      </div>
    </div>
  )
}
