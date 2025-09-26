import type { nodeConfigs } from "../config/node-config"

export type CsvData = string | number | boolean | Date | null
export type CsvRow<T = CsvData> = Record<string, T>
export type CsvTable<T = CsvData> = CsvRow<T>[]

export type GetType<T extends Record<string, unknown>> = T[keyof T]

export const FilterOperator = {
  EQ: "eq",
  NEQ: "neq",
  GT: "gt",
  LT: "lt",
  GTE: "gte",
  LTE: "lte",
  CONTAINS: "contains",
  STARTS_WITH: "startsWith",
  ENDS_WITH: "endsWith",
  EXISTS: "exists",
  NOT_EXISTS: "notExists",
} as const

export type FilterOperatorType = GetType<typeof FilterOperator>

export const TransformOperation = {
  UPPERCASE: "uppercase",
  LOWERCASE: "lowercase",
  TRIM: "trim",
  ROUND: "round",
  ABS: "abs",
  REPLACE: "replace",
} as const

export type TransformOperationType = GetType<typeof TransformOperation>

// 聚合操作类型
export const AggregationOperation = {
  SUM: "sum",
  AVG: "avg",
  COUNT: "count",
  MIN: "min",
  MAX: "max",
  UNIQUE: "unique",
} as const

export type AggregationOperationType = GetType<typeof AggregationOperation>

// 图表类型
export const ChartType = {
  BAR: "bar",
  LINE: "line",
  PIE: "pie",
  SCATTER: "scatter",
  HISTOGRAM: "histogram",
} as const

export type ChartTypeType = GetType<typeof ChartType>

export type { DataProcessor } from "./processor"

// 图表类型显示名称映射
export const CHART_TYPE_NAMES: Record<ChartTypeType, string> = {
  [ChartType.BAR]: "柱状图",
  [ChartType.LINE]: "折线图",
  [ChartType.PIE]: "饼图",
  [ChartType.SCATTER]: "散点图",
  [ChartType.HISTOGRAM]: "直方图",
}

// 过滤条件接口
export interface FilterCondition {
  column: string
  operator: FilterOperatorType
  value: string | number
}

// 转换规则接口
export interface TransformRule {
  column: string
  operation: TransformOperationType
  parameters?: Record<string, CsvData>
}

// 聚合规则接口
export interface AggregationRule {
  column: string
  operation: AggregationOperationType
  alias?: string
}

// 图表配置接口
export interface ChartConfig {
  type: ChartTypeType
  xAxis?: string
  yAxis?: string
  groupBy?: string
  labels?: string
  values?: string
  title?: string
  width?: number
  height?: number
}

// 图表数据接口
export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }>
}

export interface BaseNodeData {
  name: string
  title: string
  data?: CsvTable
}

export interface UploadNodeData extends BaseNodeData {
  fileName: string
  fileSize: string
}

export interface FilterNodeData extends BaseNodeData {
  conditions: FilterCondition[]
}

export interface TransformNodeData extends BaseNodeData {
  transformations: TransformRule[]
}

export interface AggregateNodeData extends BaseNodeData {
  groupBy: string
  aggregations: AggregationRule[]
}

export interface VisualizeNodeData extends BaseNodeData {
  chartConfig?: ChartConfig
  chartData?: ChartData
}

export interface RemoveColumnNodeData extends BaseNodeData {
  columnsToRemove: string[]
}

export interface RenameColumn {
  oldName: string
  newName: string
}

export interface RenameColumnNodeData extends BaseNodeData {
  renames: Array<RenameColumn>
}

export const Col = {
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  DATE: "date",
} as const

export type ColType = GetType<typeof Col>

export interface AddColumn {
  name: string
  type: ColType
  defaultValue: CsvData
}

export interface AddColumnNodeData extends BaseNodeData {
  newColumns: Array<AddColumn>
}

export interface RemoveRow {
  column: string
  operator: FilterOperatorType
  value: CsvData
}

export interface RemoveRowNodeData extends BaseNodeData {
  removeRules: Array<RemoveRow>
  logic: "AND" | "OR"
}

export interface AddRowNodeData extends BaseNodeData {
  newRows: CsvRow[]
}

export interface JoinNodeData extends BaseNodeData {
  joinRules: JoinRule[]
}

export const JoinOperation = {
  LEFT_JOIN: "leftJoin",
  RIGHT_JOIN: "rightJoin",
  INNER_JOIN: "innerJoin",
  FULL_JOIN: "fullJoin",
} as const

export type JoinOperationType = GetType<typeof JoinOperation>

export interface JoinRule {
  leftColumn: string
  rightColumn: string
  operation: JoinOperationType
}

export type NodeType = keyof typeof nodeConfigs

export type NodeData = UploadNodeData | FilterNodeData | TransformNodeData | AggregateNodeData | VisualizeNodeData | RemoveColumnNodeData | RenameColumnNodeData | AddColumnNodeData | RemoveRowNodeData | AddRowNodeData | JoinNodeData | BaseNodeData

export const FILTER_OPERATORS: Record<FilterOperatorType, string> = {
  [FilterOperator.EQ]: "等于",
  [FilterOperator.NEQ]: "不等于",
  [FilterOperator.GT]: "大于",
  [FilterOperator.LT]: "小于",
  [FilterOperator.GTE]: "大于等于",
  [FilterOperator.LTE]: "小于等于",
  [FilterOperator.CONTAINS]: "包含",
  [FilterOperator.STARTS_WITH]: "开始包含",
  [FilterOperator.ENDS_WITH]: "结束包含",
  [FilterOperator.EXISTS]: "存在",
  [FilterOperator.NOT_EXISTS]: "不存在",
}

export const TRANSFORM_OPERATORS: Record<TransformOperationType, string> = {
  [TransformOperation.UPPERCASE]: "转换为大写",
  [TransformOperation.LOWERCASE]: "转换为小写",
  [TransformOperation.TRIM]: "去除空格",
  [TransformOperation.ROUND]: "四舍五入",
  [TransformOperation.ABS]: "取绝对值",
  [TransformOperation.REPLACE]: "替换文本",
}

export const AGGREGATION_OPERATORS: Record<AggregationOperationType, string> = {
  [AggregationOperation.SUM]: "求和",
  [AggregationOperation.AVG]: "平均值",
  [AggregationOperation.COUNT]: "计数",
  [AggregationOperation.MIN]: "最小值",
  [AggregationOperation.MAX]: "最大值",
  [AggregationOperation.UNIQUE]: "唯一值计数",
}

export const JOIN_OPERATORS: Record<JoinOperationType, string> = {
  [JoinOperation.LEFT_JOIN]: "左连接",
  [JoinOperation.RIGHT_JOIN]: "右连接",
  [JoinOperation.INNER_JOIN]: "内连接",
  [JoinOperation.FULL_JOIN]: "全连接",
}

export const COL_TYPES: Record<ColType, string> = {
  [Col.STRING]: "字符串",
  [Col.NUMBER]: "数字",
  [Col.BOOLEAN]: "布尔值",
  [Col.DATE]: "日期"
}