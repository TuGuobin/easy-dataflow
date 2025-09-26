import React from "react"
import type { ThemeConfig } from "../../../themes/color-theme"

export interface ContentWithArrowProps {
  items: Array<{
    text: string
    className?: string
  }>
}

export const ContentWithArrow: React.FC<ContentWithArrowProps> = ({ items }) => {
  return (
    <>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className={item.className || ""}>{item.text}</span>
          {index < items.length - 1 && <i className="fa-solid fa-arrow-right mx-2 text-gray-400"></i>}
        </React.Fragment>
      ))}
    </>
  )
}

export interface RuleContentProps {
  column: string
  operation: string
  value?: string | number
  operationClassName?: string
  valueClassName?: string
  themeConfig?: ThemeConfig
}

export const RuleContent: React.FC<RuleContentProps> = ({ column, operation, value, operationClassName = "text-gray-500", valueClassName = "text-gray-600", themeConfig }) => {
  return (
    <div className="text-xs">
      <span className={themeConfig ? themeConfig.text : "text-blue-600 font-medium"}>{column}</span>
      <span className={operationClassName}> {operation} </span>
      {value !== undefined && <span className={valueClassName}>{String(value)}</span>}
    </div>
  )
}
