// ResizablePanel.tsx
import React, { useState, useRef, useEffect, useCallback } from "react"

type WidthValue = number | string

interface ResizablePanelProps {
  children: React.ReactNode
  minWidth?: WidthValue
  maxWidth?: WidthValue
  defaultWidth?: WidthValue
  className?: string
  side?: "left" | "right"
}

const convertToPx = (value: WidthValue, containerWidth: number = window.innerWidth): number => {
  if (typeof value === "number") return value

  const str = value.trim()

  if (str.endsWith("px")) {
    return parseFloat(str)
  }
  if (str.endsWith("vw")) {
    const vw = parseFloat(str)
    return (vw / 100) * window.innerWidth
  }
  if (str.endsWith("vh")) {
    const vh = parseFloat(str)
    return (vh / 100) * window.innerHeight
  }
  if (str.endsWith("rem")) {
    const rem = parseFloat(str)
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
  }
  if (str.endsWith("em")) {
    const em = parseFloat(str)
    return em * parseFloat(getComputedStyle(document.documentElement).fontSize)
  }
  if (str.endsWith("%")) {
    const percent = parseFloat(str)
    return (percent / 100) * containerWidth
  }

  return parseFloat(str) || 0
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({ children, minWidth = "100px", maxWidth = "50vw", defaultWidth = "200px", className = "", side = "left" }) => {
  const initialMin = convertToPx(minWidth)
  const initialMax = convertToPx(maxWidth)
  const initialDefault = convertToPx(defaultWidth)

  const [width, setWidth] = useState(initialDefault)
  const widthRef = useRef(initialDefault)
  widthRef.current = width

  const startPosRef = useRef(0)
  const startWidthRef = useRef(initialDefault)
  const isResizingRef = useRef(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizingRef.current = true
    startPosRef.current = e.clientX
    startWidthRef.current = widthRef.current
    document.body.style.userSelect = "none"
    e.preventDefault()
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizingRef.current) return

      const delta = e.clientX - startPosRef.current
      let newWidth = startWidthRef.current + delta * (side === "left" ? -1 : 1)
      newWidth = Math.min(initialMax, Math.max(initialMin, newWidth))
      setWidth(newWidth)
    },
    [initialMin, initialMax, side]
  )

  const handleMouseUp = useCallback(() => {
    if (isResizingRef.current) {
      isResizingRef.current = false
      document.body.style.userSelect = ""
    }
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      document.body.style.userSelect = ""
    }
  }, [handleMouseMove, handleMouseUp])

  const borderClass = side === "left" ? "border-l" : "border-r"
  const handlePosition = side === "left" ? "-left-1" : "-right-1"

  return (
    <div className={`relative flex flex-col bg-white ${borderClass} border-gray-200 ${className}`} style={{ width: `${width}px` }}>
      <div className={`absolute top-0 ${handlePosition} w-1 cursor-col-resize z-20 hover:bg-blue-200 active:bg-blue-400 transition-colors duration-100`} style={{ height: "100%" }} onMouseDown={handleMouseDown} />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
