import { createThemeConfig, type Color, type ThemeConfig } from "../themes/color-theme"
import type { IconConfig } from "../themes/icon-theme"
import type { NodeData, NodeType } from "../types"

type Category = "dataInput" | "dataProcessing" | "columnOperations" | "dataOutput" | "other"

export const categoryConfig = {
  dataInput: { title: "categories.dataInput", icon: "fa-solid fa-database" },
  dataProcessing: { title: "categories.dataProcessing", icon: "fa-solid fa-cog" },
  columnOperations: { title: "categories.columnOperations", icon: "fa-solid fa-columns" },
  dataOutput: { title: "categories.dataOutput", icon: "fa-solid fa-line-chart" },
  other: { title: "categories.other", icon: "fa-solid fa-folder" },
}

export interface NodeConfig {
  type: NodeType
  title: string
  name: string
  description: string
  category: Category
  icon: IconConfig
  color: Color
  theme: ThemeConfig
  defaultData: NodeData
}

const NodeColorTheme: Record<NodeType, Color> = {
  upload: "blue",
  addColumn: "amber",
  transform: "yellow",
  renameColumn: "orange",
  removeRow: "cyan",
  aggregate: "purple",
  addRow: "rose",
  join: "indigo",
  removeColumn: "red",
  visualize: "pink",
  default: "gray",
} as const

const NodeIconTheme: Record<NodeType, IconConfig> = {
  upload: { primary: "fa-upload", secondary: "fa-cloud-upload-alt", type: "fa-solid" },
  addRow: { primary: "fa-th-list", secondary: "fa-plus-circle", type: "fa-solid" },
  addColumn: { primary: "fa-columns", secondary: "fa-plus-square", type: "fa-solid" },
  transform: { primary: "fa-exchange-alt", secondary: "fa-random", type: "fa-solid" },
  renameColumn: { primary: "fa-font", secondary: "fa-i-cursor", type: "fa-solid" },
  removeRow: { primary: "fa-eraser", secondary: "fa-trash-alt", type: "fa-solid" },
  aggregate: { primary: "fa-layer-group", secondary: "fa-sitemap", type: "fa-solid" },
  join: { primary: "fa-code-branch", secondary: "fa-link", type: "fa-solid" },
  removeColumn: { primary: "fa-trash-alt", secondary: "fa-minus-square", type: "fa-solid" },
  visualize: { primary: "fa-chart-bar", secondary: "fa-chart-line", type: "fa-solid" },
  default: { primary: "fa-question-circle", secondary: "fa-unlock-alt", type: "fa-solid" },
} as const

export const nodeConfigs: Record<string, NodeConfig> = {
  upload: {
    type: "upload",
    title: "nodeTypes.upload.title",
    name: "nodeTypes.upload.name",
    description: "nodeTypes.upload.description",
    category: "dataInput",
    icon: NodeIconTheme.upload,
    color: NodeColorTheme.upload,
    theme: createThemeConfig(NodeColorTheme.upload),
    defaultData: {
      title: "nodeTypes.upload.title",
      name: "nodeTypes.upload.name",
    },
  },
  transform: {
    type: "transform",
    title: "nodeTypes.transform.title",
    name: "nodeTypes.transform.name",
    description: "nodeTypes.transform.description",
    category: "dataProcessing",
    icon: NodeIconTheme.transform,
    color: NodeColorTheme.transform,
    theme: createThemeConfig(NodeColorTheme.transform),
    defaultData: {
      title: "nodeTypes.transform.title",
      name: "nodeTypes.transform.name",
    },
  },
  aggregate: {
    type: "aggregate",
    title: "nodeTypes.aggregate.title",
    name: "nodeTypes.aggregate.name",
    description: "nodeTypes.aggregate.description",
    category: "dataProcessing",
    icon: NodeIconTheme.aggregate,
    color: NodeColorTheme.aggregate,
    theme: createThemeConfig(NodeColorTheme.aggregate),
    defaultData: {
      title: "nodeTypes.aggregate.title",
      name: "nodeTypes.aggregate.name",
    },
  },
  visualize: {
    type: "visualize",
    title: "nodeTypes.visualize.title",
    name: "nodeTypes.visualize.name",
    description: "nodeTypes.visualize.description",
    category: "dataOutput",
    icon: NodeIconTheme.visualize,
    color: NodeColorTheme.visualize,
    theme: createThemeConfig(NodeColorTheme.visualize),
    defaultData: {
      title: "nodeTypes.visualize.title",
      name: "nodeTypes.visualize.name",
    },
  },
  join: {
    type: "join",
    title: "nodeTypes.join.title",
    name: "nodeTypes.join.name",
    description: "nodeTypes.join.description",
    category: "dataProcessing",
    icon: NodeIconTheme.join,
    color: NodeColorTheme.join,
    theme: createThemeConfig(NodeColorTheme.join),
    defaultData: {
      title: "nodeTypes.join.title",
      name: "nodeTypes.join.name",
    },
  },
  removeColumn: {
    type: "removeColumn",
    title: "nodeTypes.removeColumn.title",
    name: "nodeTypes.removeColumn.name",
    description: "nodeTypes.removeColumn.description",
    category: "columnOperations",
    icon: NodeIconTheme.removeColumn,
    color: NodeColorTheme.removeColumn,
    theme: createThemeConfig(NodeColorTheme.removeColumn),
    defaultData: {
      title: "nodeTypes.removeColumn.title",
      name: "nodeTypes.removeColumn.name",
      columnsToRemove: [],
    },
  },
  renameColumn: {
    type: "renameColumn",
    title: "nodeTypes.renameColumn.title",
    name: "nodeTypes.renameColumn.name",
    description: "nodeTypes.renameColumn.description",
    category: "columnOperations",
    icon: NodeIconTheme.renameColumn,
    color: NodeColorTheme.renameColumn,
    theme: createThemeConfig(NodeColorTheme.renameColumn),
    defaultData: {
      title: "nodeTypes.renameColumn.title",
      name: "nodeTypes.renameColumn.name",
      renames: [],
    },
  },
  addColumn: {
    type: "addColumn",
    title: "nodeTypes.addColumn.title",
    name: "nodeTypes.addColumn.name",
    description: "nodeTypes.addColumn.description",
    category: "columnOperations",
    icon: NodeIconTheme.addColumn,
    color: NodeColorTheme.addColumn,
    theme: createThemeConfig(NodeColorTheme.addColumn),
    defaultData: {
      title: "nodeTypes.addColumn.title",
      name: "nodeTypes.addColumn.name",
    },
  },
  removeRow: {
    type: "removeRow",
    title: "nodeTypes.removeRow.title",
    name: "nodeTypes.removeRow.name",
    description: "nodeTypes.removeRow.description",
    category: "dataProcessing",
    icon: NodeIconTheme.removeRow,
    color: NodeColorTheme.removeRow,
    theme: createThemeConfig(NodeColorTheme.removeRow),
    defaultData: {
      title: "nodeTypes.removeRow.title",
      name: "nodeTypes.removeRow.name",
      removeRules: [],
      logic: "AND",
    },
  },
  addRow: {
    type: "addRow",
    title: "nodeTypes.addRow.title",
    name: "nodeTypes.addRow.name",
    description: "nodeTypes.addRow.description",
    category: "dataInput",
    icon: NodeIconTheme.addRow,
    color: NodeColorTheme.addRow,
    theme: createThemeConfig(NodeColorTheme.addRow),
    defaultData: {
      title: "nodeTypes.addRow.title",
      name: "nodeTypes.addRow.name",
    },
  },
  default: {
    type: "default",
    title: "nodeTypes.default.title",
    name: "nodeTypes.default.name",
    description: "nodeTypes.default.description",
    category: "other",
    icon: NodeIconTheme.default,
    color: NodeColorTheme.default,
    theme: createThemeConfig(NodeColorTheme.default),
    defaultData: {
      title: "nodeTypes.default.title",
      name: "nodeTypes.default.name",
    },
  },
}

export const getNodeConfig = (type?: NodeType): NodeConfig => {
  return nodeConfigs[type || "default"]
}

export const getNodeCategory = (type?: NodeType): string => {
  return nodeConfigs[type || "default"].category
}

export const getNodeIconClass = (type?: NodeType): string => {
  const config = nodeConfigs[type || "default"]
  return `${config.icon.type} ${config.icon.primary}`
}

export const getNodeSecondaryIconClass = (type?: NodeType): string => {
  const config = nodeConfigs[type || "default"]
  return `${config.icon.type} ${config.icon.secondary}`
}

export const getNodeThemeConfig = (type?: NodeType): ThemeConfig => {
  return nodeConfigs[type || "default"].theme
}

export const getNodeDefaultData = (type?: NodeType): NodeData => {
  return nodeConfigs[type || "default"].defaultData
}

export const getNodesByCategory = (category: string): NodeConfig[] => {
  return Object.values(nodeConfigs).filter((config) => config.category === category)
}

export const getAllCategories = (): string[] => {
  return [...new Set(Object.values(nodeConfigs).map((config) => config.category))]
}

export const getCategoriedNodes = () => {
  return Object.fromEntries(getAllCategories().map((category) => [category, getNodesByCategory(category)]))
}
