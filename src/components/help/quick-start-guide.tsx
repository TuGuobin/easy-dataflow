import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useWorkflowStore } from "../../stores/workflow-store"
import { getThemeConfig, type Color } from "../../themes/color-theme"

interface QuickStartGuideProps {
  onStartDemo: () => void
  onShowHelp: () => void
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ onStartDemo, onShowHelp }) => {
  const { t } = useTranslation()
  const { nodes } = useWorkflowStore()
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsVisible(nodes.length === 0)
  }, [nodes.length])

  if (!isVisible) return null

  const handleMinimize = () => {
    setIsAnimating(true)
    setIsMinimized(!isMinimized)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  const getActionTheme = (color: Color) => {
    const themeConfig = getThemeConfig(color)
    return {
      borderHover: themeConfig.hoverBorder,
      bg: themeConfig.bgLight,
      text: themeConfig.text,
    }
  }

  const quickActions = [
    {
      titleKey: "help.demoWorkflow",
      descriptionKey: "help.completeDataProcessingFlow",
      action: onStartDemo,
      color: "blue",
      icon: "fa-magic",
    },
    {
      titleKey: "help.usageHelp",
      descriptionKey: "help.tipsDescription",
      action: onShowHelp,
      color: "purple",
      icon: "fa-book",
    },
  ]

  return (
    <>
      <div className={`fixed bottom-4 right-4 z-40 transition-all duration-300 ease-in-out transform origin-bottom-right ${isMinimized && !isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"}`}>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="flex items-center space-x-2">
            <button onClick={handleMinimize} className="text-gray-500 hover:text-gray-700 transition-colors" title={t("help.maximize")}>
              <i className="fas fa-chevron-up"></i>
            </button>
            <span className="text-sm text-gray-600">{t("help.quickStartGuide")}</span>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors" title={t("help.close")}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <div className={`fixed bottom-4 right-4 z-40 transition-all duration-300 ease-in-out transform origin-bottom-right ${!isMinimized && !isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"}`}>
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 max-h-[70vh] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <i className="fas fa-rocket text-blue-600 mr-2"></i>
              {t("help.quickStartGuide")}
            </h3>
            <div className="flex space-x-2">
              <button onClick={handleMinimize} className="text-gray-400 hover:text-gray-600 transition-colors" title={t("help.minimize")}>
                <i className="fas fa-minus"></i>
              </button>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors" title={t("help.close")}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {quickActions.map((action, index) => {
              const theme = getActionTheme(action.color as Color)
              return (
                <div key={index} className={`flex p-3 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${theme.borderHover}`} onClick={action.action}>
                  <div className={`w-8 h-8 rounded-md ${theme.bg} flex items-center justify-center`}>
                    <i className={`fas ${action.icon} ${theme.text}`}></i>
                  </div>
                  <div className="flex flex-col items-start ml-3 flex-1">
                    <h4 className="text-sm font-medium text-gray-800 m-0 p-0 mb-2">{t(action.titleKey)}</h4>
                    <p className="text-xs text-gray-600">{t(action.descriptionKey)}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 flex-shrink-0">
            <p className="text-xs text-gray-500 text-center">💡 {t("common.dragNodesToCanvas")}</p>
          </div>
        </div>
      </div>
    </>
  )
}
