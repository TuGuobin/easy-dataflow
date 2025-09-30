import React from "react"
import type { Node } from "reactflow"
import type { ThemeConfig } from "../../themes/color-theme"
import { Input, Select } from "../common/input"
import type { NodeData } from "../../types"
import { useTranslation } from "react-i18next"

interface NodeInfoPanelProps {
  selectedNode?: Node<NodeData>
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  themeConfig: ThemeConfig
}

export const NodeInfoPanel = ({ selectedNode, onTitleChange, themeConfig }: NodeInfoPanelProps) => {
  const { t } = useTranslation()
  const nodeName = t(selectedNode?.data.name || "")

  return (
    <div className="mb-5">
      <div className="text-xs font-semibold mb-3 text-gray-500 uppercase tracking-wide">{t("propertiesPanel.nodeInfo")}</div>
      <div className="mb-2">
        <Select label={t("propertiesPanel.nodeType")} options={[{ label: nodeName, value: nodeName }]} value={nodeName} themeConfig={themeConfig} disabled={!selectedNode} />
      </div>
      <div className="mb-2">
        <Input themeConfig={themeConfig} label={t("propertiesPanel.nodeTitle")} type="text" value={selectedNode?.data.title || ""} disabled={!selectedNode} onChange={onTitleChange} />
      </div>
    </div>
  )
}
