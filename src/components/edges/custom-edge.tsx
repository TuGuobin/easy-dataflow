import React from "react"
import { BaseEdge, EdgeLabelRenderer, getBezierPath, Position } from "reactflow"
import { getThemeConfig } from "../../themes/color-theme"

interface EdgeProps {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
  style?: React.CSSProperties
  markerEnd?: string
  id?: string
  selected?: boolean
}

const CustomEdge: React.FC<EdgeProps> = ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd = "arrow", selected }) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.3,
  })

  const themeConfig = getThemeConfig("gray")

  const theme = {
    stroke: themeConfig.handleBorder,
    gradientStart: themeConfig.handleBg,
    gradientMiddle: themeConfig.handleBg,
    circle: themeConfig.handleBg,
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: selected ? theme.stroke : style.stroke || "#94a3b8",
          animation: selected ? "flow 50s infinite linear" : "none",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        ></div>
      </EdgeLabelRenderer>
    </>
  )
}

export default CustomEdge
