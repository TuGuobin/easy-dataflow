import React, { useState, useEffect } from "react"
import { AlertColors } from "../../themes/color-theme"

export type AlertType = "info" | "success" | "warning" | "error" | "confirm"

export interface AlertOptions {
  title?: string
  message: string
  type?: AlertType
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

interface AlertPromptProps {
  isOpen: boolean
  onClose: () => void
  options: AlertOptions
}

const AlertPrompt: React.FC<AlertPromptProps> = ({ isOpen, onClose, options }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen && !isAnimating) return null

  const { title, message, type = "info", confirmText = "确定", cancelText = "取消", onConfirm, onCancel } = options

  const getIcon = () => {
    const iconMap = {
      info: "fa-info-circle",
      success: "fa-check-circle",
      warning: "fa-exclamation-triangle",
      error: "fa-times-circle",
      confirm: "fa-question-circle",
    }
    return iconMap[type]
  }

  const getIconColor = () => {
    return AlertColors[type]?.icon || AlertColors.info.icon
  }

  const getHeaderColor = () => {
    return AlertColors[type]?.header || AlertColors.info.header
  }

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  return (
    <div className={`fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={handleOverlayClick}>
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        {/* 头部 */}
        <div className={`bg-gradient-to-r ${getHeaderColor()} text-white px-4 py-3 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className={`fas ${getIcon()} text-xl mr-3`}></i>
              <h2 className="text-lg font-bold">{title || (type === "confirm" ? "确认操作" : "提示")}</h2>
            </div>
            <button onClick={handleCancel} className="text-white hover:text-gray-200 transition-colors">
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6">
          <div className="flex items-start">
            <div className={`flex-shrink-0 mr-4`}>
              <i className={`fas ${getIcon()} text-2xl ${getIconColor()}`}></i>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{message}</p>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="bg-gray-50 p-3 rounded-b-lg flex justify-end gap-3">
          {type === "confirm" ? (
            <>
              <button onClick={handleCancel} className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                {cancelText}
              </button>
              <button onClick={handleConfirm} className={`px-6 py-2 text-white rounded-lg transition-colors ${type === "confirm" ? AlertColors.error.button : AlertColors.info.button}`}>
                {confirmText}
              </button>
            </>
          ) : (
            <button onClick={handleConfirm} className={`px-6 py-2 ${AlertColors.info.button} text-white rounded-lg transition-colors`}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AlertPrompt

export class AlertManager {
  private static instance: AlertManager
  private listeners: ((options: AlertOptions) => void)[] = []

  static getInstance(): AlertManager {
    if (!AlertManager.instance) {
      AlertManager.instance = new AlertManager()
    }
    return AlertManager.instance
  }

  show(options: AlertOptions) {
    this.listeners.forEach((listener) => listener(options))
  }

  showConfirm(message: string, title?: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.show({
        message,
        title,
        type: "confirm",
        onConfirm: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        },
      })
    })
  }

  subscribe(listener: (options: AlertOptions) => void) {
    this.listeners.push(listener)
  }

  unsubscribe(listener: (options: AlertOptions) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }
}
