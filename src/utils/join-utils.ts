import type { JoinRule, JoinOperationType, CsvTable, CsvRow } from "../types"

type JoinKey = (string | null | undefined)[]

function createKey(row: CsvRow, columns: string[]): JoinKey {
  return columns.map((col) => {
    const val = row[col]
    return val == null ? null : String(val)
  })
}

function keyToString(key: JoinKey): string {
  return key.map((v) => (v === null ? "␀" : v)).join("␞")
}

function createIndex(data: CsvTable, rightColumns: string[]): Map<string, number[]> {
  const index = new Map<string, number[]>()
  for (let i = 0; i < data.length; i++) {
    const keyStr = keyToString(createKey(data[i], rightColumns))
    if (!index.has(keyStr)) index.set(keyStr, [])
    index.get(keyStr)!.push(i)
  }
  return index
}

function shouldKeepUnmatchedLeft(op: JoinOperationType): boolean {
  return op === "leftJoin" || op === "fullJoin"
}

function shouldKeepUnmatchedRight(op: JoinOperationType): boolean {
  return op === "rightJoin" || op === "fullJoin"
}

export function joinData(leftData: CsvTable, rightData: CsvTable, joinRules: JoinRule[]): CsvTable {
  if (!leftData.length || !rightData.length || !joinRules.length) {
    return leftData
  }

  const operation = joinRules[0].operation
  const leftColumns = joinRules.map((r) => r.leftColumn)
  const rightColumns = joinRules.map((r) => r.rightColumn)

  const rightPrefixedColumns: [string, string][] = []
  if (rightData.length > 0) {
    for (const key in rightData[0]) {
      if (Object.prototype.hasOwnProperty.call(rightData[0], key)) {
        rightPrefixedColumns.push([key, `right_${key}`])
      }
    }
  }

  const rightIndex = createIndex(rightData, rightColumns)
  const result: CsvRow[] = []
  const matchedRightIndices = new Set<number>()

  for (let i = 0; i < leftData.length; i++) {
    const leftRow = leftData[i]
    const queryKey = keyToString(createKey(leftRow, leftColumns))
    const rightIndices = rightIndex.get(queryKey) || []

    if (rightIndices.length > 0) {
      for (const rIdx of rightIndices) {
        matchedRightIndices.add(rIdx)
        const combined: CsvRow = {}

        for (const key in leftRow) {
          if (Object.prototype.hasOwnProperty.call(leftRow, key)) {
            combined[key] = leftRow[key]
          }
        }

        const rightRow = rightData[rIdx]
        for (const [origKey, prefixedKey] of rightPrefixedColumns) {
          combined[prefixedKey] = rightRow[origKey]
        }

        result.push(combined)
      }
    } else if (shouldKeepUnmatchedLeft(operation)) {
      const combined: CsvRow = {}
      for (const key in leftRow) {
        if (Object.prototype.hasOwnProperty.call(leftRow, key)) {
          combined[key] = leftRow[key]
        }
      }
      result.push(combined)
    }
  }

  if (shouldKeepUnmatchedRight(operation)) {
    for (let i = 0; i < rightData.length; i++) {
      if (!matchedRightIndices.has(i)) {
        const combined: CsvRow = {}
        const rightRow = rightData[i]
        for (const [origKey, prefixedKey] of rightPrefixedColumns) {
          combined[prefixedKey] = rightRow[origKey]
        }
        result.push(combined)
      }
    }
  }

  return result
}
