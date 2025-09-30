import type { ColType, CsvData, CsvRow, CsvTable } from "../types"
export type { CsvData, CsvRow } from "../types"
import * as XLSX from 'xlsx'

export async function parseFile(file: File): Promise<CsvRow[]> {
  const name = file.name.toLowerCase()
  if (name.endsWith('.csv')) {
    const text = await file.text()
    return parseCSV(text)
  } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    return parseExcel(file)
  } else {
    throw new Error('Unsupported file type')
  }
}

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

/**
 * 解析 Excel 文件（.xlsx / .xls）为 CsvRow[] 格式
 * @param file 用户选择的 File 对象
 * @returns Promise<CsvRow[]>
 */
export async function parseExcel(file: File): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        const json: Record<string, string>[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        })

        if (json.length === 0) {
          resolve([])
          return
        }

        const headers = json[0] as unknown as string[]
        const rows: CsvRow[] = []

        for (let i = 1; i < json.length; i++) {
          const rowArray = json[i] as unknown as string[]
          const row: CsvRow = {}

          headers.forEach((header, index) => {
            // 确保 header 是字符串（防止数字列名如 "1", "2"）
            const key = String(header).trim() || `col_${index}`
            const rawValue = rowArray[index] ?? ''
            // 使用你已有的 inferType 进行类型推断
            row[key] = inferType(String(rawValue))
          })

          rows.push(row)
        }

        resolve(rows)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsArrayBuffer(file)
  })
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