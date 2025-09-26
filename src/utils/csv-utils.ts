import type { ColType, CsvData, CsvRow, CsvTable } from "../types"
export type { CsvData, CsvRow } from "../types"

function inferType(value: string): CsvData {
  if (value === "" || value.toLowerCase() === "null") {
    return null
  }

  const lowerValue = value.toLowerCase()
  if (lowerValue === "true") return true
  if (lowerValue === "false") return false

  if (/^-?\d+\.?\d*$/.test(value) && !isNaN(Number(value))) {
    return Number(value)
  }

  const date = new Date(value)
  if (!isNaN(date.getTime())) {
    if (/\d{4}-\d{2}-\d{2}/.test(value) || /\d{2}\/\d{2}\/\d{4}/.test(value) || /\d{2}-\d{2}-\d{4}/.test(value)) {
      return date
    }
  }

  return value
}

export function parseCSV(text: string, delimiter = ","): CsvRow[] {
  const lines = text.trim().split("\n")
  if (lines.length === 0) return []

  const headers = lines[0].split(delimiter).map((header) => header.trim())
  const data: CsvRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map((value) => value.trim())
    const row: CsvRow = {}

    headers.forEach((header, index) => {
      const rawValue = values[index] ?? ""
      row[header] = inferType(rawValue)
    })

    data.push(row)
  }

  return data
}

export function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 ** 2) return `${(size / 1024).toFixed(2)} KB`
  if (size < 1024 ** 3) return `${(size / 1024 ** 2).toFixed(2)} MB`
  return `${(size / 1024 ** 3).toFixed(2)} GB`
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

interface DisplayType {
  value: string
  type: ColType | "null"
}

export function getDisplayValue(value: CsvData): string {
  if (value === null || value === undefined) return ""
  if (value instanceof Date) return formatDateTime(value)
  if (typeof value === "number") return String(value)
  if (typeof value === "boolean") return value ? "true" : "false"
  if (typeof value === "string") return value
  return String(value)
}

export function getDisplayType(value: CsvData): ColType | "null" {
  if (value === null || value === undefined) return "null"
  if (value instanceof Date) return "date"
  if (typeof value === "number") return "number"
  if (typeof value === "boolean") return "boolean"
  if (typeof value === "string") return "string"
  return "null"
}

export function displayCsvData(data: CsvTable): CsvTable<DisplayType> {
  return data.map((row) => {
    return Object.fromEntries(
      Object.entries(row).map(([key, val]) => {
        const type = getDisplayType(val)
        const value = getDisplayValue(val)
        return [key, { value, type }]
      })
    )
  })
}

export function getDisplayIcon(type: ColType | "null"): string {
  switch (type) {
    case "date":
      return "fas fa-calendar-alt text-orange-400"
    case "number":
      return "fas fa-hashtag text-blue-400"
    case "boolean":
      return "fas fa-check-square text-red-400"
    case "string":
      return "fas fa-font text-gray-400"
    default:
      return ""
  }
}