import React from "react"
import type { Node } from "reactflow"
import type { ThemeConfig } from "../../themes/color-theme"
import { Input, Select } from "../common/input"
import type { NodeData } from "../../types"

interface NodeInfoPanelProps {
  selectedNode?: Node<NodeData>
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  themeConfig: ThemeConfig
}

export const NodeInfoPanel = ({ selectedNode, onTitleChange, themeConfig }: NodeInfoPanelProps) => {
  return (
    <div className="mb-5">
      <div className="text-xs font-semibold mb-3 text-gray-500 uppercase tracking-wide">节点信息</div>
      <div className="mb-2">
        <Select label="节点类型" options={[{ label: selectedNode?.data.name || "", value: selectedNode?.data.name || "" }]} value={selectedNode?.data.name || ""} themeConfig={themeConfig} disabled={!selectedNode} />
      </div>
      <div className="mb-2">
        <Input themeConfig={themeConfig} label="节点标题" type="text" value={selectedNode?.data.title || ""} disabled={!selectedNode} onChange={onTitleChange} />
      </div>
    </div>
  )
}
