import React, { useCallback, useRef, useState, useEffect } from "react"
import ReactFlow, { Background, ReactFlowProvider } from "reactflow"
import type { Connection, Edge, Node, NodeDragHandler, NodeMouseHandler, OnEdgesChange, OnNodesChange } from "reactflow"
import "reactflow/dist/style.css"
import { nodeTypes } from "./components/nodes/node-types"
import { edgeTypes } from "./components/edges/edge-types"
import { Toolbox } from "./components/toolbox/toolbox"
import { PropertiesPanel } from "./components/properties-panel/properties-panel"
import { DemoImportModal } from "./components/help/demo-import-modal"
import { HelpModal } from "./components/help/help-modal"
import { WelcomeGuide } from "./components/help/welcome-guide"
import { QuickStartGuide } from "./components/help/quick-start-guide"
import ContextMenu from "./components/common/context-menu"
import type { NodeType, NodeData } from "./types"
import { connectionRules, createNodeData, exportWorkflow, getParentNodeCount, hasParentNode, importWorkflow, getAllChildNodes, getAllParentNodes } from "./utils/workflow-utils"
import { useWorkflowStore } from "./stores/workflow-store"
import { processData } from "./processors"
import { AlertProvider } from "./components/alert/alert-provider"
import { showError, showConfirm } from "./utils/alert"
import { generateId } from "./utils/id"
import { ResizablePanel } from "./components/common/resizable-panel"

const edgeStyle = {
  stroke: "#94a3b8",
  strokeWidth: 2,
  strokeDasharray: "5, 5",
}

interface ContextMenuInfo {
  id: string
  top: number
  left: number
  needsPositionAdjustment?: boolean
  type?: "node" | "edge"
}

function App() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { nodes, edges, selectedNode, reactFlowInstance, setNodes, setEdges, updateNode, updateNodes, setSelectedNode, setReactFlowInstance, clearWorkflow } = useWorkflowStore()
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false)
  const [contextMenuInfo, setContextMenuInfo] = useState<ContextMenuInfo | null>(null)

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome")
    const hasSeenDemo = localStorage.getItem("hasSeenDemo")

    if (!hasSeenWelcome) {
      setShowWelcomeGuide(true)
    } else if (!hasSeenDemo) {
      setShowDemoModal(true)
    }
  }, [])

  const handleDemoModalClose = () => {
    setShowDemoModal(false)
    localStorage.setItem("hasSeenDemo", "true")
  }

  const handleWelcomeGuideClose = () => {
    setShowWelcomeGuide(false)
    localStorage.setItem("hasSeenWelcome", "true")
  }

  const handleStartDemo = () => {
    setShowDemoModal(true)
  }

  const handleHelpClick = () => {
    setShowHelpModal(true)
  }

  const handleHelpModalClose = () => {
    setShowHelpModal(false)
  }

  const onNodesChange = useCallback<OnNodesChange>(
    (changes) => {
      // @ts-expect-error TODO: Fix this
      const newNodes: Node<NodeData, NodeType>[] = changes.reduce((acc, change) => {
        if (change.type === "position" && change.position) {
          return acc.map((node) => (node.id === change.id ? { ...node, position: change.position } : { ...node }))
        } else if (change.type === "remove") {
          return acc.filter((node) => node.id !== change.id)
        } else if (change.type === "select") {
          return acc.map((node) => (node.id === change.id ? { ...node, selected: change.selected } : { ...node }))
        }
        return acc
      }, nodes)
      setNodes(newNodes)
    },
    [nodes, setNodes]
  )

  const onEdgesChange = useCallback<OnEdgesChange>(
    (changes) => {
      setEdges(
        changes.reduce((acc, change) => {
          if (change.type === "remove") {
            return acc.filter((edge) => edge.id !== change.id)
          } else if (change.type === "select") {
            return acc.map((edge) => (edge.id === change.id ? { ...edge, selected: change.selected } : { ...edge, selected: false }))
          }
          return acc
        }, edges)
      )
    },
    [edges, setEdges]
  )

  const canConnect = useCallback((sourceNodeType: NodeType, targetNodeType: NodeType): boolean => {
    return connectionRules[sourceNodeType]?.includes(targetNodeType) || false
  }, [])

  const onConnect = useCallback(
    async (params: Connection) => {
      if (!params.source || !params.target) return
      const sourceNode = nodes.find((node) => node.id === params.source)
      const targetNode = nodes.find((node) => node.id === params.target)
      if (!sourceNode || !targetNode) return
      if (!canConnect(sourceNode.type as NodeType, targetNode.type as NodeType)) {
        showError(`不能从 [${sourceNode.type}] 节点连接到 [${targetNode.type}] 节点`)
        return
      }

      const existingEdge = edges.find((edge) => edge.source === params.source && edge.target === params.target)
      if (existingEdge) return

      if (targetNode.type === "join") {
        const parentCount = getParentNodeCount(params.target, edges)
        if (parentCount >= 2) {
          showError(`[${targetNode.type}] 节点最多只能有 2 个父节点`)
          return
        }
      } else {
        if (hasParentNode(params.target, edges)) {
          showError(`[${targetNode.type}] 节点只能有 1 个父节点`)
          return
        }
      }

      const newEdge: Edge = {
        ...params,
        id: `${sourceNode.type}-${targetNode.type}-${generateId()}`,
        source: params.source,
        target: params.target,
        type: "custom",
        animated: false,
        style: edgeStyle,
      }

      setEdges([...edges, newEdge])
      updateNode(params.target, { data: sourceNode.data.data })
    },
    [canConnect, setEdges, nodes, edges, updateNode]
  )

  const onDragStart = useCallback((event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const rfInstance = reactFlowInstance
      if (!rfInstance || !reactFlowWrapper.current) return

      const type = event.dataTransfer.getData("application/reactflow") as NodeType

      if (!type || !["upload", "removeColumn", "renameColumn", "addColumn", "removeRows", "addRow", "transform", "aggregate", "visualize", "join"].includes(type)) {
        return
      }

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const data = createNodeData(type)
      const newNode: Node<NodeData, NodeType> = {
        id: `${type}-${generateId()}`,
        type,
        position,
        data,
      }

      setNodes([...nodes, newNode])
    },
    [reactFlowWrapper, nodes, setNodes, reactFlowInstance]
  )

  const onNodeUpdate = useCallback(
    (id: string, data: Partial<NodeData>) => {
      const currentNodes = nodes;
      const currentEdges = edges;

      const currentNodeMap = new Map<string, Node<NodeData, NodeType>>(currentNodes.map((node) => [node.id, { ...node }]))
      const targetNode = currentNodeMap.get(id)
      if (!targetNode) return
      currentNodeMap.set(id, {
        ...targetNode,
        data: { ...targetNode.data, ...data },
      })

      const visited = new Set<string>()
      visited.add(id)
      let currentLayer: string[] = [id]

      while (currentLayer.length > 0) {
        const nextLayer: string[] = []

        for (const parentId of currentLayer) {
          const parentNode = currentNodeMap.get(parentId)
          if (!parentNode) continue

          const directChildren = getAllChildNodes(parentNode, Array.from(currentNodeMap.values()), currentEdges)
          for (const child of directChildren) {
            if (!visited.has(child.id)) {
              visited.add(child.id)
              nextLayer.push(child.id)
            }
          }
        }

        if (nextLayer.length === 0) break

        for (const childId of nextLayer) {
          const childNode = currentNodeMap.get(childId)
          if (!childNode) continue
          const parents = getAllParentNodes(childNode, Array.from(currentNodeMap.values()), currentEdges)
          const parentData = parents.map((p) => p.data.data || [])
          const processedData = processData(childNode.type as NodeType, parentData, childNode.data)

          currentNodeMap.set(childId, {
            ...childNode,
            data: { ...childNode.data, data: processedData },
          })
        }

        currentLayer = nextLayer
      }

      const updates = Array.from(visited).map((nodeId) => {
        const node = currentNodeMap.get(nodeId)!
        return { id: nodeId, data: node.data }
      })

      updateNodes(updates)
    },
    [updateNodes, nodes, edges]
  )

  const onNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      _.stopPropagation()
      setSelectedNode(node as Node<NodeData, NodeType>)
    },
    [setSelectedNode]
  )

  const onNodeDragStart = useCallback<NodeDragHandler>(
    (_, node) => {
      _.stopPropagation()
      setSelectedNode(node as Node<NodeData, NodeType>)
    },
    [setSelectedNode]
  )

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setContextMenuInfo(null)
  }, [setSelectedNode])

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node<NodeData>) => {
      event.preventDefault()

      if (reactFlowWrapper.current) {
        const pane = reactFlowWrapper.current.getBoundingClientRect()
        const left = event.clientX - pane.left
        const top = event.clientY - pane.top

        setContextMenuInfo({
          id: node.id,
          top: top,
          left: left,
          needsPositionAdjustment: true,
          type: "node",
        })
      }
    },
    [reactFlowWrapper]
  )

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault()

      if (reactFlowWrapper.current) {
        const pane = reactFlowWrapper.current.getBoundingClientRect()
        const left = event.clientX - pane.left
        const top = event.clientY - pane.top

        setContextMenuInfo({
          id: edge.id,
          top: top,
          left: left,
          needsPositionAdjustment: true,
          type: "edge",
        })
      }
    },
    [reactFlowWrapper]
  )

  const onClearWorkflow = async () => {
    const confirmed = await showConfirm("确定要清空工作流吗？")
    if (confirmed) {
      clearWorkflow()
    }
  }

  const onExportWorkflow = () => {
    exportWorkflow(nodes, edges)
  }

  const onImportWorkflow = () => {
    importWorkflow(setNodes, setEdges)
  }

  const onDemoImport = () => {
    setShowDemoModal(true)
  }

  return (
    <AlertProvider>
      <div className="flex flex-col h-screen w-screen">
        <div className="flex justify-between items-center p-0 h-16 bg-white border-b border-gray-200 z-10 px-5">
          <div className="flex items-center">
            <div className="text-lg font-semibold flex items-center gap-2">
              <span>
                <i className="fa-solid fa-code-branch text-blue-500"></i> Easy DataFlow
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">v1.0.0</span>
            </div>
            <div className="ml-6 px-3 py-1.5 rounded cursor-pointer transition-all hover:bg-gray-100" onClick={handleHelpClick}>
              <span>
                <i className="fa-solid fa-question-circle text-gray-400"></i> 帮助
              </span>
            </div>
            <div className="px-3 py-1.5 rounded cursor-pointer transition-all hover:bg-blue-50" onClick={onDemoImport}>
              <span>
                <i className="fa-solid fa-magic text-blue-400"></i> 示例
              </span>
            </div>
          </div>
          <div className="flex items-center"></div>
          <div className="flex items-center">
            <div className="px-3 py-1.5 rounded cursor-pointer transition-all hover:bg-red-50" onClick={onClearWorkflow}>
              <span>
                <i className="fa-solid fa-trash text-red-400"></i> 清空
              </span>
            </div>
            <div className="px-3 py-1.5 rounded cursor-pointer transition-all hover:bg-orange-50" onClick={onExportWorkflow}>
              <span>
                <i className="fa-solid fa-file-export text-orange-400"></i> 导出
              </span>
            </div>
            <div className="px-3 py-1.5 rounded cursor-pointer transition-all hover:bg-purple-50" onClick={onImportWorkflow}>
              <span>
                <i className="fa-solid fa-file-import text-purple-400"></i> 导入
              </span>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex flex-1 overflow-hidden">
          <ResizablePanel side="right" defaultWidth={200} minWidth={150} maxWidth={250}>
            <div className="w-full bg-gradient-to-b from-gray-50 to-white border-gray-200 flex flex-col overflow-hidden">
              <div className="px-3 py-2 bg-white border-b border-gray-200">
                <div className="flex items-center">
                  <i className="fas fa-toolbox text-gray-600 mr-2 text-sm"></i>
                  <span className="text-sm font-semibold text-gray-800">工具箱</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">拖拽节点到画布</div>
              </div>
              <Toolbox onDragStart={onDragStart} />
            </div>
          </ResizablePanel>

          {/* 中间画布 */}
          <div className="flex-1 flex flex-col relative overflow-hidden" ref={reactFlowWrapper}>
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={(instance) => setReactFlowInstance(instance)}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeDragStart={onNodeDragStart}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onNodeContextMenu={onNodeContextMenu}
                onEdgeContextMenu={onEdgeContextMenu}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionLineStyle={edgeStyle}
              >
                <Background gap={24} size={1} />
                {contextMenuInfo && <ContextMenu {...contextMenuInfo} onClose={() => setContextMenuInfo(null)} />}
              </ReactFlow>
            </ReactFlowProvider>
          </div>

          <ResizablePanel side="left" minWidth={200} defaultWidth={300} maxWidth={"50%"}>
            <PropertiesPanel nodes={nodes} edges={edges} selectedNode={selectedNode} onNodeUpdate={onNodeUpdate} />
          </ResizablePanel>
        </div>

        <DemoImportModal isOpen={showDemoModal} onClose={handleDemoModalClose} />
        <HelpModal isOpen={showHelpModal} onClose={handleHelpModalClose} />
        <WelcomeGuide isOpen={showWelcomeGuide} onClose={handleWelcomeGuideClose} onStartDemo={handleStartDemo} />
        <QuickStartGuide onStartDemo={handleStartDemo} onShowHelp={handleHelpClick} />
      </div>
    </AlertProvider>
  )
}

export default App
