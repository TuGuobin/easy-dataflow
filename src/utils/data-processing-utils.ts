import type { AddColumn, CsvRow, CsvTable, RenameColumn } from "../types"

export function removeColumns(data: CsvTable, columnsToRemove: string[]): CsvTable {
  if (!columnsToRemove?.length || !data?.length) return data

  const toRemoveSet = new Set(columnsToRemove)

  return data.map((row) => {
    const newRow: CsvRow = {}
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key) && !toRemoveSet.has(key)) {
        newRow[key] = row[key]
      }
    }
    return newRow
  })
}

export function renameColumns(data: CsvTable, renames: Array<RenameColumn>): CsvTable {
  if (!renames?.length || !data?.length) return data

  const renameMap = new Map(renames.map((r) => [r.oldName, r.newName]))

  return data.map((row) => {
    const newRow: CsvRow = {}
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        const newKey = renameMap.get(key) ?? key
        newRow[newKey] = row[key]
      }
    }
    return newRow
  })
}

export function addColumns(data: CsvTable, newColumns: Array<AddColumn>): CsvTable {
  if (!newColumns?.length || !data?.length) return data

  const columnsToAdd = newColumns.map((col) => ({ name: col.name, value: col.defaultValue }))

  return data.map((row) => {
    const newRow = Object.assign({}, row)
    for (const col of columnsToAdd) {
      newRow[col.name] = col.value
    }
    return newRow
  })
}

export function removeRow(data: CsvTable, checkAllColumns: boolean, columnsToCheck: string[] = []): CsvTable {
  if (!data?.length) return data

  if (checkAllColumns) {
    return data.filter((row) => {
      for (const key in row) {
        if (Object.prototype.hasOwnProperty.call(row, key)) {
          const val = row[key]
          if (val != null && val !== "" && (typeof val !== "string" || val.trim() !== "")) {
            return true
          }
        }
      }
      return false
    })
  } else {
    if (!columnsToCheck.length) return data

    return data.filter((row) => {
      for (const col of columnsToCheck) {
        const val = row[col]
        if (val != null && val !== "" && (typeof val !== "string" || val.trim() !== "")) {
          return true
        }
      }
      return false
    })
  }
}

export function addRows(data: CsvTable, newRows: CsvTable): CsvTable {
  if (!newRows?.length) return data ?? []
  return [...(data ?? []), ...newRows]
}

export function getAllColumns(data: CsvTable): string[] {
  if (!data?.length) return []

  const columnsSet = new Set<string>()
  for (const row of data) {
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        columnsSet.add(key)
      }
    }
  }
  return Array.from(columnsSet)
}
