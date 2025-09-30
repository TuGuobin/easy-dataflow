import type { Node, Edge } from "reactflow"
import type { NodeData, NodeType } from "../types"
import { getNodeDefaultData } from "../config/node-config"

export const connectionRules: Record<NodeType, NodeType[]> = {
  upload: ["removeColumn", "renameColumn", "addColumn", "removeRow", "addRow", "transform", "aggregate", "visualize", "join", "unknown"],
  removeColumn: ["removeColumn", "renameColumn", "addColumn", "removeRow", "addRow", "transform", "aggregate", "visualize", "join", "unknown"],
  renameColumn: ["removeColumn", "renameColumn", "addColumn", "removeRow", "addRow", "transform", "aggregate", "visualize", "join", "unknown"],
  addColumn: ["removeColumn", "renameColumn", "addColumn", "removeRow", "addRow", "transform", "aggregate", "visualize", "join", "unknown"],
  removeRow: ["removeColumn", "renameColumn", "addColumn", "removeRow", "addRow", "transform", "aggregate", "visualize", "join", "unknown"],
  addRow: ["removeColumn", "renameColumn", "addColumn", "removeRow", "addRow", "transform", "aggregate", "visualize", "join", "unknown"],
  transform: ["removeColumn", "renameColumn", "addColumn", "removeRow", "addRow", "transform", "aggregate", "visualize", "join", "unknown"],
  aggregate: ["removeColumn", "renameColumn", "addColumn", "removeRow", "addRow", "transform", "aggregate", "visualize", "join", "unknown"],
  join: ["removeColumn", "renameColumn", "addColumn", "removeRow", "addRow", "transform", "aggregate", "visualize", "join", "unknown"],
  unknown: ["removeColumn", "renameColumn", "addColumn", "removeRow", "addRow", "transform", "aggregate", "visualize", "join", "unknown"],
  visualize: [],
}

export const getParentNode = (node: Node<NodeData> | string, nodes: Node<NodeData>[], edges: Edge[]): Node<NodeData> | null => {
  const nodeId = typeof node === "string" ? node : node.id
  const parentEdge = edges.find((edge) => edge.target === nodeId)
  if (parentEdge) {
    return nodes.find((n) => n.id === parentEdge.source) || null
  }
  return null
}

export const getAllParentNodes = (node: Node<NodeData, NodeType> | string, nodes: Node<NodeData, NodeType>[], edges: Edge[]): Node<NodeData, NodeType>[] => {
  const nodeId = typeof node === "string" ? node : node.id
  const parentEdges = edges.filter((edge) => edge.target === nodeId)
  return nodes.filter((n) => parentEdges.some((edge) => edge.source === n.id)) || []
}

// 获取节点的父节点ID列表
export const getParentNodeIds = (node: Node<NodeData> | string, edges: Edge[]): string[] => {
  const nodeId = typeof node === "string" ? node : node.id
  const parentEdges = edges.filter((edge) => edge.target === nodeId)
  return parentEdges.map((edge) => edge.source)
}

// 获取节点的父节点数量
export const getParentNodeCount = (node: Node<NodeData> | string, edges: Edge[]): number => {
  const nodeId = typeof node === "string" ? node : node.id
  return edges.filter((edge) => edge.target === nodeId).length
}

// 检查节点是否有父节点
export const hasParentNode = (node: Node<NodeData> | string, edges: Edge[]): boolean => {
  const nodeId = typeof node === "string" ? node : node.id
  return edges.some((edge) => edge.target === nodeId)
}

// 获取节点的直接子节点
export const getChildNodes = (node: Node<NodeData> | string, nodes: Node<NodeData>[], edges: Edge[]): Node<NodeData>[] => {
  const nodeId = typeof node === "string" ? node : node.id
  const childEdges = edges.filter((edge) => edge.source === nodeId)
  return nodes.filter((n) => childEdges.some((edge) => edge.target === n.id))
}

// 获取节点的所有子节点（递归）
export const getAllChildNodes = (node: Node<NodeData> | string, nodes: Node<NodeData>[], edges: Edge[]): Node<NodeData>[] => {
  const nodeId = typeof node === "string" ? node : node.id
  const childNodes = getChildNodes(nodeId, nodes, edges)
  const allChildNodes: Node<NodeData>[] = []

  for (const child of childNodes) {
    allChildNodes.push(child)
    const grandChildren = getAllChildNodes(child, nodes, edges)
    allChildNodes.push(...grandChildren)
  }

  return allChildNodes
}

export const createNodeData = (type?: NodeType): NodeData => {
  return { ...getNodeDefaultData(type) }
}

export const exportWorkflow = (nodes: Node[], edges: Edge[]) => {
  const flow = {
    nodes,
    edges,
  }
  const data = JSON.stringify(flow, null, 2)
  const blob = new Blob([data], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "workflow.json"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const importWorkflow = (setNodes: (nodes: Node<NodeData, NodeType>[]) => void, setEdges: (edges: Edge[]) => void, workflow?: Record<string, unknown>) => {
  if (workflow) {
    setNodes(workflow.nodes as Node<NodeData, NodeType>[])
    setEdges(workflow.edges as Edge[])
    return
  }

  const input = document.createElement("input")
  input.type = "file"
  input.accept = ".json"
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const data = JSON.parse(event.target?.result as string)
      setNodes(data.nodes || [])
      setEdges(data.edges || [])
    }
    reader.readAsText(file)
  }
  input.click()
}
