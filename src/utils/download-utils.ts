import type { CsvTable } from "../types"
import { getAllColumns } from "./data-processing-utils"

/**
 * 通用文件下载函数
 * @param blob 文件Blob对象
 * @param filename 文件名
 */
function downloadFile(blob: Blob, filename: string): void {
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 将数据转换为CSV格式
 * @param data 数据数组
 * @returns CSV字符串
 */
function convertToCSV(data: CsvTable): string {
  if (!data || data.length === 0) {
    return ""
  }

  const headers = getAllColumns(data)
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          if (value && (String(value).includes(",") || String(value).includes('"'))) {
            return `"${String(value).replace(/"/g, '""')}"`
          }
          return value !== undefined && value !== null ? String(value) : ""
        })
        .join(",")
    ),
  ].join("\n")

  return csvContent
}

/**
 * 下载CSV文件
 * @param data 数据数组
 * @param filename 文件名
 */
export function downloadCSV(data: CsvTable, filename: string = "data.csv") {
  const csvContent = convertToCSV(data)
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  downloadFile(blob, filename)
}

/**
 * 简单的Excel导出（使用HTML表格方式）
 * @param data 数据数组
 * @param filename 文件名
 */
export function downloadExcel(data: CsvTable, filename: string = "data.xlsx") {
  if (!data || data.length === 0) {
    return
  }

  const headers = getAllColumns(data)

  // 创建HTML表格 - 优化样式
  let html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'/>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 20px;
      background-color: #f8f9fa;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
      background-color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    th {
      padding: 12px 15px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      border: none;
    }
    td {
      padding: 10px 15px;
      border-bottom: 1px solid #e9ecef;
      font-size: 13px;
      color: #495057;
    }
    tbody tr:hover {
      background-color: #f1f3f4;
    }
    tbody tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
  </style>
</head>
<body>
  <table>`

  // 添加表头
  html += "<thead><tr>"
  headers.forEach((header) => {
    html += `<th>${header}</th>`
  })
  html += "</tr></thead>"

  // 添加数据行
  html += "<tbody>"
  data.forEach((row) => {
    html += "<tr>"
    headers.forEach((header) => {
      const value = row[header]
      html += `<td>${value !== undefined && value !== null ? String(value) : ""}</td>`
    })
    html += "</tr>"
  })
  html += "</tbody>"

  html += "</table></body></html>"

  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" })
  downloadFile(blob, filename)
}

/**
 * 获取当前时间戳，用于文件名
 */
export function getTimestampString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")

  return `${year}${month}${day}_${hours}${minutes}${seconds}`
}
