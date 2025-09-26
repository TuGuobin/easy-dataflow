import { createThemeConfig, type Color, type ThemeConfig } from "../themes/color-theme"
import type { IconConfig } from "../themes/icon-theme"
import type { NodeData, NodeType } from "../types"

type Category = "dataInput" | "dataProcessing" | "columnOperations" | "dataOutput" | "other"

export const categoryConfig = {
  dataInput: { title: "数据输入", icon: "fa-solid fa-database" },
  dataProcessing: { title: "数据处理", icon: "fa-solid fa-cog" },
  columnOperations: { title: "列操作", icon: "fa-solid fa-columns" },
  dataOutput: { title: "数据输出", icon: "fa-solid fa-line-chart" },
  other: { title: "其他", icon: "fa-solid fa-folder" },
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
  removeRows: "cyan",
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
  removeRows: { primary: "fa-eraser", secondary: "fa-trash-alt", type: "fa-solid" },
  aggregate: { primary: "fa-layer-group", secondary: "fa-sitemap", type: "fa-solid" },
  join: { primary: "fa-code-branch", secondary: "fa-link", type: "fa-solid" },
  removeColumn: { primary: "fa-trash-alt", secondary: "fa-minus-square", type: "fa-solid" },
  visualize: { primary: "fa-chart-bar", secondary: "fa-chart-line", type: "fa-solid" },
  default: { primary: "fa-question-circle", secondary: "fa-unlock-alt", type: "fa-solid" },
} as const

export const nodeConfigs: Record<string, NodeConfig> = {
  upload: {
    type: "upload",
    title: "数据上传",
    name: "数据上传",
    description: "上传CSV文件，支持拖拽上传",
    category: "dataInput",
    icon: NodeIconTheme.upload,
    color: NodeColorTheme.upload,
    theme: createThemeConfig(NodeColorTheme.upload),
    defaultData: {
      title: "数据上传",
      name: "数据上传",
    },
  },
  transform: {
    type: "transform",
    title: "数据转换",
    name: "数据转换",
    description: "对数据进行格式转换、计算等操作",
    category: "dataProcessing",
    icon: NodeIconTheme.transform,
    color: NodeColorTheme.transform,
    theme: createThemeConfig(NodeColorTheme.transform),
    defaultData: {
      title: "数据转换",
      name: "数据转换",
    },
  },
  aggregate: {
    type: "aggregate",
    title: "数据聚合",
    name: "数据聚合",
    description: "按指定字段分组聚合数据",
    category: "dataProcessing",
    icon: NodeIconTheme.aggregate,
    color: NodeColorTheme.aggregate,
    theme: createThemeConfig(NodeColorTheme.aggregate),
    defaultData: {
      title: "数据聚合",
      name: "数据聚合",
    },
  },
  visualize: {
    type: "visualize",
    title: "数据可视化",
    name: "数据可视化",
    description: "生成柱状图、折线图、饼图等多种图表",
    category: "dataOutput",
    icon: NodeIconTheme.visualize,
    color: NodeColorTheme.visualize,
    theme: createThemeConfig(NodeColorTheme.visualize),
    defaultData: {
      title: "数据可视化",
      name: "数据可视化",
    },
  },
  join: {
    type: "join",
    title: "数据连接",
    name: "数据连接",
    description: "连接两个数据集",
    category: "dataProcessing",
    icon: NodeIconTheme.join,
    color: NodeColorTheme.join,
    theme: createThemeConfig(NodeColorTheme.join),
    defaultData: {
      title: "数据连接",
      name: "数据连接",
    },
  },
  removeColumn: {
    type: "removeColumn",
    title: "移除列",
    name: "移除列",
    description: "删除不需要的数据列",
    category: "columnOperations",
    icon: NodeIconTheme.removeColumn,
    color: NodeColorTheme.removeColumn,
    theme: createThemeConfig(NodeColorTheme.removeColumn),
    defaultData: {
      title: "移除列",
      name: "移除列",
      columnsToRemove: [],
    },
  },
  renameColumn: {
    type: "renameColumn",
    title: "重命名列",
    name: "重命名列",
    description: "修改列名称",
    category: "columnOperations",
    icon: NodeIconTheme.renameColumn,
    color: NodeColorTheme.renameColumn,
    theme: createThemeConfig(NodeColorTheme.renameColumn),
    defaultData: {
      title: "重命名列",
      name: "重命名列",
      renames: [],
    },
  },
  addColumn: {
    type: "addColumn",
    title: "新增列",
    name: "新增列",
    description: "添加新的数据列",
    category: "columnOperations",
    icon: NodeIconTheme.addColumn,
    color: NodeColorTheme.addColumn,
    theme: createThemeConfig(NodeColorTheme.addColumn),
    defaultData: {
      title: "新增列",
      name: "新增列",
    },
  },
  removeRows: {
    type: "removeRows",
    title: "移除行",
    name: "移除行",
    description: "根据条件删除数据行",
    category: "dataProcessing",
    icon: NodeIconTheme.removeRows,
    color: NodeColorTheme.removeRows,
    theme: createThemeConfig(NodeColorTheme.removeRows),
    defaultData: {
      title: "移除行",
      name: "移除行",
      removeRules: [],
      logic: "AND",
    },
  },
  addRow: {
    type: "addRow",
    title: "新增行",
    name: "新增行",
    description: "手动添加新的数据行",
    category: "dataInput",
    icon: NodeIconTheme.addRow,
    color: NodeColorTheme.addRow,
    theme: createThemeConfig(NodeColorTheme.addRow),
    defaultData: {
      title: "新增行",
      name: "新增行",
    },
  },
  default: {
    type: "default",
    title: "未知节点",
    name: "未知节点",
    description: "未知节点类型",
    category: "other",
    icon: NodeIconTheme.default,
    color: NodeColorTheme.default,
    theme: createThemeConfig(NodeColorTheme.default),
    defaultData: {
      title: "未知节点",
      name: "未知节点",
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
