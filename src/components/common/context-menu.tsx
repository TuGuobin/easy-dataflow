import { useCallback, useEffect, useRef, useState } from "react"
import { useWorkflowStore } from "../../stores/workflow-store"
import { getThemeConfig } from "../../themes/color-theme"
import { DropdownMenu, type MenuItem } from "./dropdown-menu"

interface ContextMenuProps {
  id: string
  top?: number
  left?: number
  right?: number
  bottom?: number
  onClose: () => void
  needsPositionAdjustment?: boolean
  type?: "node" | "edge"
}

export default function ContextMenu({ id, top, left, right, bottom, onClose, needsPositionAdjustment, type = "node" }: ContextMenuProps) {
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore()
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(true)
  const themeConfig = getThemeConfig("red")

  const deleteNode = useCallback(() => {
    const newNodes = nodes.filter((node) => node.id !== id)
    const newEdges = edges.filter((edge) => edge.source !== id && edge.target !== id)

    setNodes(newNodes)
    setEdges(newEdges)

    setIsOpen(false)
    onClose()
  }, [id, nodes, edges, setNodes, setEdges, onClose])

  const deleteEdge = useCallback(() => {
    const newEdges = edges.filter((edge) => edge.id !== id)
    setEdges(newEdges)

    setIsOpen(false)
    onClose()
  }, [id, edges, setEdges, onClose])

  const menuItems: MenuItem[] = [
    {
      label: type === "node" ? "删除节点" : "删除边",
      icon: "fas fa-trash",
      iconClassName: themeConfig.text,
      onClick: type === "node" ? deleteNode : deleteEdge,
      className: "hover:bg-red-50",
    },
  ]

  useEffect(() => {
    if (needsPositionAdjustment && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect()
      const paneRect = menuRef.current.closest(".react-flow")?.getBoundingClientRect()

      if (paneRect) {
        let adjustedTop = top || 0
        let adjustedLeft = left || 0

        if (adjustedLeft + menuRect.width > paneRect.width) {
          adjustedLeft = paneRect.width - menuRect.width
        }

        if (adjustedTop + menuRect.height > paneRect.height) {
          adjustedTop = paneRect.height - menuRect.height
        }

        menuRef.current.style.top = `${adjustedTop}px`
        menuRef.current.style.left = `${adjustedLeft}px`
      }
    }
  }, [needsPositionAdjustment, top, left])

  return (
    <div ref={menuRef} style={{ top, left, right, bottom }} className="absolute z-50" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu
        items={menuItems}
        menuClassName="bg-white rounded-lg shadow-lg border border-gray-200 min-w-32 top-unset"
        isOpen={isOpen}
        onToggle={(open) => {
          setIsOpen(open)
          if (!open) {
            onClose()
          }
        }}
      />
    </div>
  )
}
