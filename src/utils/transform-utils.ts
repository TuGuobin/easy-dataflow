import type { CsvRow, TransformRule, TransformOperationType, CsvData } from "../types"
import { TRANSFORM_OPERATORS, TransformOperation } from "../types"

export type { CsvRow, TransformRule, TransformOperationType as TransformOperation } from "../types"
export { TRANSFORM_OPERATORS } from "../types"

interface CompiledTransformRule {
  column: string
  operation: TransformOperationType
  precision?: number
  search?: string
  replace?: string
  separator?: string
  suffix?: string
}

/**
 * 预编译转换规则（一次处理，多次使用）
 */
function compileRules(rules: TransformRule[]): CompiledTransformRule[] {
  return rules.map((rule) => {
    const compiled: CompiledTransformRule = {
      column: rule.column,
      operation: rule.operation,
    }

    const params = rule.parameters || {}
    switch (rule.operation) {
      case TransformOperation.ROUND:
        compiled.precision = Number(params.precision) || 0
        break
      case TransformOperation.REPLACE:
        compiled.search = String(params.search ?? "")
        compiled.replace = String(params.replace ?? "")
        break
    }
    return compiled
  })
}


function applyTransform(value: CsvData, rule: CompiledTransformRule): CsvData {
  if (value == null) return value

  switch (rule.operation) {
    case TransformOperation.UPPERCASE:
      return String(value).toUpperCase()
    case TransformOperation.LOWERCASE:
      return String(value).toLowerCase()
    case TransformOperation.TRIM:
      return String(value).trim()
    case TransformOperation.ROUND: {
      const num = Number(value)
      if (isNaN(num)) return value
      const p = rule.precision!
      const factor = Math.pow(10, p)
      return Math.round(num * factor) / factor
    }
    case TransformOperation.ABS:
      return Math.abs(Number(value))
    case TransformOperation.REPLACE: {
      const str = String(value)
      const search = rule.search!
      if (search === "") return str
      return str.split(search).join(rule.replace!)
    }
    default:
      return value
  }
}

export function transformData(data: CsvRow[], rules: TransformRule[]): CsvRow[] {
  if (!rules?.length || !data?.length) return data

  const compiledRules = compileRules(rules)
  const validRules = compiledRules.filter((rule) => data.some((row) => Object.prototype.hasOwnProperty.call(row, rule.column)))

  if (validRules.length === 0) return data

  return data.map((row) => {
    let newRow: CsvRow | null = null

    for (const rule of validRules) {
      if (Object.prototype.hasOwnProperty.call(row, rule.column)) {
        if (newRow === null) {
          newRow = { ...row }
        }
        newRow[rule.column] = applyTransform(newRow[rule.column], rule)
      }
    }

    return newRow ?? row
  })
}

export function getAvailableTransformOperations(dataType: string): TransformOperationType[] {
  switch (dataType) {
    case "string":
      return [TransformOperation.UPPERCASE, TransformOperation.LOWERCASE, TransformOperation.TRIM, TransformOperation.REPLACE]
    case "number":
      return [TransformOperation.ROUND, TransformOperation.ABS]
    default:
      return []
  }
}

export function getTransformOperationDisplayName(operation: TransformOperationType): string {
  return TRANSFORM_OPERATORS[operation] || operation
}
