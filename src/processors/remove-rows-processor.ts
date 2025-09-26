import type { DataProcessor, RemoveRowNodeData } from "../types"
import type { CsvTable, CsvData } from "../types"

type CompiledRule = {
  column: string
  operator: RemoveRowNodeData["removeRules"][0]["operator"]
  strValue?: string
  numValue?: number
  isValueExists?: boolean
}

export class RemoveRowsProcessor implements DataProcessor<RemoveRowNodeData> {
  process(sourceData: CsvTable[], config: RemoveRowNodeData): CsvTable {
    const [data = []] = sourceData
    const { removeRules = [], logic = "AND" } = config

    if (removeRules.length === 0 || data.length === 0) {
      return data
    }

    const compiledRules: CompiledRule[] = removeRules.map((rule) => {
      const { column, operator, value } = rule
      const compiled: CompiledRule = { column, operator }

      if (operator === "exists" || operator === "notExists") {
        // pass
      } else if (["gt", "lt", "gte", "lte"].includes(operator)) {
        const num = Number(value)
        compiled.numValue = isNaN(num) ? NaN : num
      } else {
        compiled.strValue = String(value).toLowerCase()
      }

      return compiled
    })

    const matchRule = (row: Record<string, CsvData>, rule: CompiledRule): boolean => {
      const cell = row[rule.column]
      if (cell == null) {
        return rule.operator === "notExists"
      }

      switch (rule.operator) {
        case "exists":
          return true
        case "notExists":
          return false
        case "eq":
          return String(cell).toLowerCase() === rule.strValue
        case "neq":
          return String(cell).toLowerCase() !== rule.strValue
        case "contains":
          return String(cell).toLowerCase().includes(rule.strValue!)
        case "startsWith":
          return String(cell).toLowerCase().startsWith(rule.strValue!)
        case "endsWith":
          return String(cell).toLowerCase().endsWith(rule.strValue!)
        case "gt":
          return Number(cell) > rule.numValue!
        case "lt":
          return Number(cell) < rule.numValue!
        case "gte":
          return Number(cell) >= rule.numValue!
        case "lte":
          return Number(cell) <= rule.numValue!
        default:
          return false
      }
    }

    if (logic === "OR") {
      return data.filter((row) => {
        return !compiledRules.some((rule) => matchRule(row, rule))
      })
    } else {
      return data.filter((row) => {
        return !compiledRules.every((rule) => matchRule(row, rule))
      })
    }
  }
}
