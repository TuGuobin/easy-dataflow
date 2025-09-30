import React from "react"

interface NavButtonProps {
  onClick: () => void
  icon: string
  children: React.ReactNode
  className?: string
  title?: string
  iconClassName?: string
}

export const NavButton: React.FC<NavButtonProps> = ({ onClick, icon, children, className = "", title, iconClassName = "" }) => (
  <div className={`px-3 py-1.5 rounded cursor-pointer transition-all ${className}`} onClick={onClick} title={title}>
    <span className="whitespace-nowrap">
      <i className={`${icon} ${iconClassName}`}></i> {children}
    </span>
  </div>
)
