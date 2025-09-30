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
  [FilterOperator.EQ]: "filterOperators.eq",
  [FilterOperator.NEQ]: "filterOperators.neq",
  [FilterOperator.GT]: "filterOperators.gt",
  [FilterOperator.LT]: "filterOperators.lt",
  [FilterOperator.GTE]: "filterOperators.gte",
  [FilterOperator.LTE]: "filterOperators.lte",
  [FilterOperator.CONTAINS]: "filterOperators.contains",
  [FilterOperator.STARTS_WITH]: "filterOperators.startsWith",
  [FilterOperator.ENDS_WITH]: "filterOperators.endsWith",
  [FilterOperator.EXISTS]: "filterOperators.exists",
  [FilterOperator.NOT_EXISTS]: "filterOperators.notExists",
}

export const TRANSFORM_OPERATORS: Record<TransformOperationType, string> = {
  [TransformOperation.UPPERCASE]: "transformOperations.uppercase",
  [TransformOperation.LOWERCASE]: "transformOperations.lowercase",
  [TransformOperation.TRIM]: "transformOperations.trim",
  [TransformOperation.ROUND]: "transformOperations.round",
  [TransformOperation.ABS]: "transformOperations.abs",
  [TransformOperation.REPLACE]: "transformOperations.replace",
}

export const AGGREGATION_OPERATORS: Record<AggregationOperationType, string> = {
  [AggregationOperation.SUM]: "aggregationOperations.sum",
  [AggregationOperation.AVG]: "aggregationOperations.avg",
  [AggregationOperation.COUNT]: "aggregationOperations.count",
  [AggregationOperation.MIN]: "aggregationOperations.min",
  [AggregationOperation.MAX]: "aggregationOperations.max",
  [AggregationOperation.UNIQUE]: "aggregationOperations.unique",
}

export const JOIN_OPERATORS: Record<JoinOperationType, string> = {
  [JoinOperation.LEFT_JOIN]: "joinOperations.leftJoin",
  [JoinOperation.RIGHT_JOIN]: "joinOperations.rightJoin",
  [JoinOperation.INNER_JOIN]: "joinOperations.innerJoin",
  [JoinOperation.FULL_JOIN]: "joinOperations.fullJoin",
}

export const COL_TYPES: Record<ColType, string> = {
  [Col.STRING]: "dataTypes.string",
  [Col.NUMBER]: "dataTypes.number",
  [Col.BOOLEAN]: "dataTypes.boolean",
  [Col.DATE]: "dataTypes.date",
}