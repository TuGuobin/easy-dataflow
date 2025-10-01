import type { Node } from "reactflow"
import type { ThemeConfig } from "../../themes/color-theme"
import { Input } from "../common/input"
import type { NodeData } from "../../types"
import { useTranslation } from "react-i18next"

interface NodeInfoPanelProps {
  selectedNode?: Node<NodeData>
  onTitleChange: (value: string) => void
  themeConfig: ThemeConfig
}

export const NodeInfoPanel = ({ selectedNode, onTitleChange, themeConfig }: NodeInfoPanelProps) => {
  const { t } = useTranslation()

  return (
    <div className="mb-5">
      <div className="text-xs font-semibold mb-3 text-gray-500 uppercase tracking-wide">{t("propertiesPanel.nodeInfo")}</div>
      <div className="mb-2">
        <Input themeConfig={themeConfig} label={t("propertiesPanel.nodeTitle")} type="text" value={selectedNode?.data.title || ""} disabled={!selectedNode} onChange={onTitleChange} />
      </div>
    </div>
  )
}
