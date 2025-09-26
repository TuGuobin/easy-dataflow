import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

export interface MenuItem {
  label: string
  icon?: string
  iconClassName?: string
  onClick: () => void
  className?: string
}

interface DropdownMenuProps {
  trigger?: ReactNode
  items: MenuItem[]
  position?: "left" | "right"
  className?: string
  menuClassName?: string
  itemClassName?: string
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
}

export const DropdownMenu = ({ trigger, items, position, className = "", menuClassName = "", itemClassName = "", isOpen: controlledIsOpen, onToggle }: DropdownMenuProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = useCallback(
    (value: boolean) => {
      if (controlledIsOpen === undefined) {
        setInternalIsOpen(value)
      }
      onToggle?.(value)
    },
    [controlledIsOpen, setInternalIsOpen, onToggle]
  )
  const menuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    },
    [setIsOpen]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isOpen, handleClickOutside])

  const handleItemClick = (item: MenuItem) => {
    item.onClick()
    setIsOpen(false)
  }

  const handleTriggerClick = () => {
    setIsOpen(!isOpen)
  }

  const positionClasses = position ? (position === "left" ? "left-0" : "right-0") : ""

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <div onClick={handleTriggerClick} className="cursor-pointer">
        {trigger}
      </div>

      <div
        className={`absolute ${positionClasses} p-0.5 bg-white border border-gray-200 rounded-md shadow-lg z-30 min-w-32 transform transition-all duration-200 ease-out font-normal ${
          isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        } ${menuClassName}`}
      >
        {items.map((item, index) => (
          <button key={index} onClick={() => handleItemClick(item)} className={`w-full text-left px-2.5 rounded-sm py-2 text-xs text-gray-700 transition-colors flex items-center space-x-2 ${itemClassName || "hover:bg-gray-100"} ${item.className}`}>
            {item.icon && <i className={`${item.icon} ${item.iconClassName}`}></i>}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
