import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import type { Edge, Node } from "reactflow"
import Panels from "./panel-types"
import { NoData } from "./no-data"
import { DataPreview } from "../common/data-preview"
import { getAllParentNodes } from "../../utils/workflow-utils"
import { prepareChartData } from "../../utils/visualize-utils"
import type {
  NodeData,
  ChartConfig,
  JoinRule,
  NodeType,
  UploadNodeData,
  RemoveColumnNodeData,
  RenameColumnNodeData,
  AddColumnNodeData,
  RemoveRowNodeData,
  AddRowNodeData,
  CsvRow,
  TransformNodeData,
  AggregateNodeData,
  AggregationRule,
  JoinNodeData,
  AddColumn,
  RemoveRow,
  RenameColumn,
  CsvTable,
  CodeNodeData,
} from "../../types"
import { formatFileSize } from "../../utils/csv-utils"
import { getNodeThemeConfig } from "../../config/node-config"
import { NodeInfoPanel } from "./node-info-panel"
import { processData } from "../../processors"
import { getAllColumns } from "../../utils/data-processing-utils"

interface PropertiesPanelProps {
  selectedNode: Node<NodeData, NodeType> | null
  onNodeUpdate: (nodeId: string, data: Partial<NodeData>) => void
  nodes: Node<NodeData, NodeType>[]
  edges: Edge[]
}

interface NodeHandlerContext {
  selectedNode: Node<NodeData, NodeType>
  parents: Node<NodeData, NodeType>[]
  updateNodeData: (newData: NodeData, shouldProcess?: boolean) => void
  nodes: Node<NodeData, NodeType>[]
  edges: Edge[]
}

const useNodeUpdater = (nodeId: string, nodeType: NodeType, parents: Node<NodeData, NodeType>[], onNodeUpdate: (nodeId: string, data: Partial<NodeData>) => void) => {
  return useCallback(
    async (newData: NodeData, shouldProcess: boolean = true) => {
      if (!shouldProcess) {
        onNodeUpdate(nodeId, newData)
        return
      }
      const parentDataList = parents.map((p) => p.data.data || [])
      const resultData = await processData(nodeType, parentDataList, newData as NodeData)
      onNodeUpdate(nodeId, { ...newData, data: resultData })
    },
    [nodeId, nodeType, parents, onNodeUpdate]
  )
}

// 🧩 节点处理器（提取到组件外，避免闭包问题）
const createNodeHandlers = (): Partial<Record<NodeType, (ctx: NodeHandlerContext) => React.ReactNode>> => {
  return {
    upload: ({ selectedNode, updateNodeData }) => {
      const handleFileChange = (data: CsvTable, file: File) => {
        updateNodeData(
          {
            ...selectedNode.data,
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            data,
          },
          false
        )
      }

      return <Panels.upload node={selectedNode as Node<UploadNodeData, "upload">} onFileChange={handleFileChange} />
    },

    removeColumn: ({ selectedNode, parents, updateNodeData }) => {
      const parent = parents[0]
      if (!parent?.data?.data?.length) return <NoData />
      const columns = getAllColumns(parent.data.data)
      const handleUpdate = (columnsToRemove: string[]) => {
        updateNodeData({ ...selectedNode.data, columnsToRemove })
      }
      return <Panels.removeColumn node={selectedNode as Node<RemoveColumnNodeData, "removeColumn">} columns={columns} onUpdateColumns={handleUpdate} />
    },

    renameColumn: ({ selectedNode, parents, updateNodeData }) => {
      const parent = parents[0]
      if (!parent?.data?.data?.length) return <NoData />
      const columns = getAllColumns(parent.data.data)
      const handleUpdate = (renames: RenameColumn[]) => {
        updateNodeData({ ...selectedNode.data, renames })
      }
      return <Panels.renameColumn node={selectedNode as Node<RenameColumnNodeData, "renameColumn">} columns={columns} onUpdateRenames={handleUpdate} />
    },

    addColumn: ({ selectedNode, parents, updateNodeData }) => {
      const parent = parents[0]
      if (!parent?.data?.data?.length) return <NoData />
      const handleUpdate = (newColumns: Array<AddColumn>) => {
        updateNodeData({ ...selectedNode.data, newColumns })
      }
      return <Panels.addColumn node={selectedNode as Node<AddColumnNodeData, "addColumn">} onUpdateColumns={handleUpdate} />
    },

    removeRow: ({ selectedNode, parents, updateNodeData }) => {
      const parent = parents[0]
      if (!parent?.data?.data?.length) return <NoData />
      const columns = getAllColumns(parent.data.data)
      const handleUpdate = (removeRules: Array<RemoveRow>, logic: "AND" | "OR") => {
        updateNodeData({ ...selectedNode.data, removeRules, logic })
      }
      return <Panels.removeRow node={selectedNode as Node<RemoveRowNodeData, "removeRow">} columns={columns} onUpdateRules={handleUpdate} />
    },

    addRow: ({ selectedNode, parents, updateNodeData }) => {
      const parent = parents[0]
      if (!parent?.data?.data?.length) return <NoData />
      const columns = getAllColumns(parent.data.data)
      const handleUpdate = (newRows: CsvRow[]) => {
        updateNodeData({ ...selectedNode.data, newRows })
      }
      return <Panels.addRow node={selectedNode as Node<AddRowNodeData, "addRow">} columns={columns} onUpdateRows={handleUpdate} />
    },

    transform: ({ selectedNode, parents, updateNodeData }) => {
      const parent = parents[0]
      if (!parent?.data?.data?.length) return <NoData />
      const columns = getAllColumns(parent.data.data)
      const handleUpdate = (transformations: TransformNodeData["transformations"]) => {
        updateNodeData({ ...selectedNode.data, transformations })
      }
      return <Panels.transform node={selectedNode as Node<TransformNodeData, "transform">} columns={columns} onUpdateTransformations={handleUpdate} />
    },

    aggregate: ({ selectedNode, parents, updateNodeData }) => {
      const parent = parents[0]
      if (!parent?.data?.data?.length) return <NoData />
      const columns = getAllColumns(parent.data.data)
      const handleUpdateAggregations = (aggregations: AggregationRule[]) => {
        updateNodeData({ ...selectedNode.data, aggregations })
      }
      const handleUpdateGroupBy = (groupBy: string) => {
        updateNodeData({ ...selectedNode.data, groupBy })
      }
      return <Panels.aggregate node={selectedNode as Node<AggregateNodeData, "aggregate">} columns={columns} onUpdateAggregations={handleUpdateAggregations} onUpdateGroupBy={handleUpdateGroupBy} />
    },

    join: ({ selectedNode, parents, updateNodeData }) => {
      const handleUpdate = (joinRules: JoinRule[]) => {
        updateNodeData({ ...selectedNode.data, joinRules })
      }

      return <Panels.join node={selectedNode as Node<JoinNodeData, "join">} parents={parents} onUpdateJoinRules={handleUpdate} />
    },

    visualize: ({ selectedNode, parents, updateNodeData }) => {
      const parent = parents[0]
      if (!parent?.data?.data?.length) return <NoData />
      const columns = getAllColumns(parent.data.data)
      const handleUpdate = (chartConfig: ChartConfig) => {
        const chartData = prepareChartData(parent.data.data!, chartConfig)
        updateNodeData({ ...selectedNode.data, chartConfig, chartData }, false)
      }
      return <Panels.visualize node={selectedNode} columns={columns} onUpdateChartConfig={handleUpdate} />
    },

    code: ({ selectedNode, parents, updateNodeData }) => {
      const parent = parents[0]
      if (!parent?.data?.data?.length) return <NoData />
      const handleUpdateCode = (code: string) => {
        updateNodeData({ ...selectedNode.data, code })
      }
      return <Panels.code node={selectedNode as Node<CodeNodeData, "code">} onUpdateCode={handleUpdateCode} />
    },
  }
}

const NODE_HANDLERS = createNodeHandlers()

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedNode, onNodeUpdate, nodes, edges }) => {
  const { t } = useTranslation()
  const nodeType = useMemo(() => selectedNode?.type as NodeType | undefined, [selectedNode])
  const themeConfig = useMemo(() => (nodeType ? getNodeThemeConfig(nodeType) : null), [nodeType])
  const csvData = useMemo(() => selectedNode?.data?.data || [], [selectedNode])
  const parents = useMemo(() => {
    return selectedNode ? getAllParentNodes(selectedNode, nodes, edges) : []
  }, [selectedNode, nodes, edges])

  const updateNodeData = useNodeUpdater(selectedNode?.id || "", nodeType!, parents, onNodeUpdate)

  const handleTitleChange = useCallback(
    (value: string) => {
      if (selectedNode) {
        onNodeUpdate(selectedNode.id, { ...selectedNode.data, title: value })
      }
    },
    [selectedNode, onNodeUpdate]
  )

  const renderNodePanel = () => {
    if (!selectedNode || !nodeType) return null
    const handler = NODE_HANDLERS[nodeType]
    if (!handler) return null

    return handler({
      selectedNode,
      parents,
      updateNodeData,
      nodes,
      edges,
    })
  }

  return (
    <div className="w-full h-full bg-white flex flex-col transition-all duration-500 ease-out">
      <div className="p-4 text-lg font-semibold border-b border-gray-200 relative overflow-hidden">
        <div className={`transition-all duration-500 ease-out`}>{t("propertiesPanel.title")}</div>
      </div>

      <div className={`flex-1 overflow-hidden transition-all duration-500 ease-out`}>
        <div className="p-4 overflow-y-auto h-full">
          <NodeInfoPanel selectedNode={selectedNode || undefined} onTitleChange={handleTitleChange} themeConfig={themeConfig!} />
          {renderNodePanel()}
          {!!csvData.length && <DataPreview data={csvData} className="my-4" />}
        </div>
      </div>
    </div>
  )
}
