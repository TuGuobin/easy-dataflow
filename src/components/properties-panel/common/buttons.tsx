import React from "react"
import type { ThemeConfig } from "../../../themes/color-theme"

export interface ActionButtonProps {
  onClick: () => void
  themeConfig: ThemeConfig
  icon?: string
  text: string
  className?: string
  disabled?: boolean
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, themeConfig, icon = "fa-plus", text, className = "", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-2 ${themeConfig.bgDark} text-white rounded ${themeConfig.hoverBgDark} ${themeConfig.activeBgDark} text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
    >
      {icon && <i className={`fa-solid ${icon} mr-2`}></i>}
      {text}
    </button>
  )
}

export interface SecondaryButtonProps {
  onClick: () => void
  text: string
  className?: string
  disabled?: boolean
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ onClick, text, className = "", disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled} className={`px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}>
      {text}
    </button>
  )
}

export interface DangerButtonProps {
  onClick: () => void
  text: string
  className?: string
  size?: "sm" | "md"
}

export const DangerButton: React.FC<DangerButtonProps> = ({ onClick, text, className = "", size = "sm" }) => {
  const sizeClass = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"

  return (
    <button onClick={onClick} className={`${sizeClass} bg-red-500 text-white rounded hover:bg-red-600 active:bg-red-700 transition-colors ${className}`}>
      {text}
    </button>
  )
}
