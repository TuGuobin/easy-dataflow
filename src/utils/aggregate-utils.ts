import type { CsvRow, AggregationRule, AggregationOperationType, CsvTable } from "../types"
import { AGGREGATION_OPERATORS, AggregationOperation } from "../types"

export type { CsvRow, AggregationRule, AggregationOperationType as AggregationOperation } from "../types"
export { AGGREGATION_OPERATORS } from "../types"

export function aggregateData(data: CsvTable, groupBy: string, rules: AggregationRule[]): CsvTable {
  if (!data?.length || !rules?.length || !groupBy || !Object.prototype.hasOwnProperty.call(data[0], groupBy)) {
    return []
  }

  const validRules = rules.filter((rule) => data.some((row) => Object.prototype.hasOwnProperty.call(row, rule.column)))

  if (validRules.length === 0) return []

  const groups = new Map<string, CsvTable>()
  for (const row of data) {
    const key = String(row[groupBy])
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(row)
  }

  const result: CsvTable = []
  for (const [groupKey, groupData] of groups) {
    const aggregatedRow: CsvRow = { [groupBy]: groupKey }

    const columnValues = new Map<string, { numeric: number[]; string: string[] }>()

    for (const rule of validRules) {
      const col = rule.column
      if (columnValues.has(col)) continue

      const numeric: number[] = []
      const stringVals: string[] = []

      for (const row of groupData) {
        const val = row[col]
        if (val == null || val === "") continue

        const str = String(val)
        stringVals.push(str)

        const num = Number(val)
        if (!isNaN(num)) numeric.push(num)
      }

      columnValues.set(col, { numeric, string: stringVals })
    }

    for (const rule of validRules) {
      const resultKey = rule.alias || `${rule.column}_${rule.operation}`
      const values = columnValues.get(rule.column)!
      aggregatedRow[resultKey] = computeAggregation(values, rule.operation)
    }

    result.push(aggregatedRow)
  }

  return result
}

function computeAggregation(values: { numeric: number[]; string: string[] }, operation: AggregationOperationType): number | string {
  const { numeric, string } = values

  switch (operation) {
    case AggregationOperation.COUNT:
      return string.length

    case AggregationOperation.UNIQUE:
      return new Set(string).size

    case AggregationOperation.SUM: {
      if (numeric.length === 0) return ""
      let sum = 0
      for (const n of numeric) sum += n
      return sum
    }

    case AggregationOperation.AVG: {
      if (numeric.length === 0) return ""
      let sum = 0
      for (const n of numeric) sum += n
      return sum / numeric.length
    }

    case AggregationOperation.MIN: {
      if (numeric.length === 0) return ""
      let min = numeric[0]
      for (let i = 1; i < numeric.length; i++) {
        if (numeric[i] < min) min = numeric[i]
      }
      return min
    }

    case AggregationOperation.MAX: {
      if (numeric.length === 0) return ""
      let max = numeric[0]
      for (let i = 1; i < numeric.length; i++) {
        if (numeric[i] > max) max = numeric[i]
      }
      return max
    }

    default:
      return 0
  }
}

export function getAvailableAggregationOperations(dataType: string): AggregationOperationType[] {
  switch (dataType) {
    case "number":
      return [AggregationOperation.SUM, AggregationOperation.AVG, AggregationOperation.COUNT, AggregationOperation.MIN, AggregationOperation.MAX]
    case "string":
      return [AggregationOperation.COUNT, AggregationOperation.UNIQUE]
    default:
      return [AggregationOperation.COUNT]
  }
}

export function getAggregationOperationDisplayName(operation: AggregationOperationType): string {
  return AGGREGATION_OPERATORS[operation] || operation
}
