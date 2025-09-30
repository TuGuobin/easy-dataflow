import type { NodeProps } from "reactflow"
import type { CodeNodeData } from "../../types"
import { BaseNode } from "./base-node"
import { useTranslation } from "react-i18next"

type CodeNodeProps = NodeProps<CodeNodeData>

export const CodeNode = ({ data, ...attrs }: CodeNodeProps) => {
  const { t } = useTranslation()
  
  return (
    <BaseNode {...attrs} data={data} showEmptyState={!data.code?.trim()} emptyStateMessage="messages.noCodeSet">
      {({ themeConfig }) => (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">{t("common.code")}:</span>
            <span className={`text-xs px-2 py-1 rounded ${themeConfig.bg} ${themeConfig.text}`}>
              {data.code ? `${data.code.trim().split('\n').length} ${t("common.lines")}` : t("common.empty")}
            </span>
          </div>
          {data.code && data.code.trim() && (
            <div className="bg-white border-1 border-gray-300 rounded p-2 max-h-24 overflow-hidden mb-1">
              <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap truncate max-w-64">
                {data.code.trim().split('\n').slice(0, 3).join('\n')}
                {data.code.trim().length > 100 && "..."}
              </pre>
            </div>
          )}
        </div>
      )}
    </BaseNode>
  )
}