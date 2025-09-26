import { create } from "zustand"
import type { Node, Edge, ReactFlowInstance } from "reactflow"
import type { NodeData, NodeType } from "../types"

interface WorkflowState {
  nodes: Node<NodeData, NodeType>[]
  edges: Edge[]
  selectedNode: Node<NodeData, NodeType> | null
  reactFlowInstance: ReactFlowInstance | null

  setNodes: (nodes: Node<NodeData, NodeType>[]) => void
  setEdges: (edges: Edge[]) => void
  setSelectedNode: (node: Node<NodeData, NodeType> | null) => void
  setReactFlowInstance: (instance: ReactFlowInstance | null) => void
  updateNode: (id: string, data: Partial<NodeData>) => void
  updateNodes: (updates: Array<{ id: string; data: Partial<NodeData> }>) => void
  clearWorkflow: () => void
}

export const useWorkflowStore = create<WorkflowState>()((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  reactFlowInstance: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNode: (selectedNode) => set({ selectedNode }),
  setReactFlowInstance: (reactFlowInstance) => set({ reactFlowInstance }),
  updateNode: (id: string, data: Partial<NodeData>) =>
    set((state: WorkflowState) => {
      const updatedNodes = state.nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...data } } : node))
      const updatedSelectedNode = state.selectedNode && state.selectedNode.id === id ? { ...state.selectedNode, data: { ...state.selectedNode.data, ...data } } : state.selectedNode

      return {
        nodes: updatedNodes,
        selectedNode: updatedSelectedNode,
      }
    }),
  updateNodes: (updates: Array<{ id: string; data: Partial<NodeData> }>) =>
    set((state: WorkflowState) => {
      const updatedNodes = state.nodes.map((node) => {
        const update = updates.find((u) => u.id === node.id)
        if (update) {
          return { ...node, data: { ...node.data, ...update.data } }
        }
        return node
      })
      
      const updatedSelectedNode = state.selectedNode 
        ? updatedNodes.find((n) => n.id === state.selectedNode!.id) || state.selectedNode
        : state.selectedNode

      return {
        nodes: updatedNodes,
        selectedNode: updatedSelectedNode,
      }
    }),
  clearWorkflow: () =>
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      reactFlowInstance: null,
    }),
}))
