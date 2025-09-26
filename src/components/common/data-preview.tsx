import { useState, useCallback, useRef, useMemo } from "react"
import { downloadCSV, downloadExcel, getTimestampString } from "../../utils/download-utils"
import { DropdownMenu, type MenuItem } from "./dropdown-menu"
import { NoData } from "../properties-panel/no-data"
import { getAllColumns } from "../../utils/data-processing-utils"
import type { CsvTable } from "../../types"
import { displayCsvData, getDisplayIcon } from "../../utils/csv-utils"

type SortDirection = "asc" | "desc" | null

type SortConfig = {
  column: string
  direction: SortDirection
}

interface DataPreviewProps {
  data: CsvTable
  title?: string
  maxHeight?: string
  showCount?: boolean
  className?: string
}

export const DataPreview = ({ data, title = "数据预览", maxHeight = "max-h-80", showCount = true, className = "" }: DataPreviewProps) => {
  const [displayCount, setDisplayCount] = useState(10)
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  const sortedData = useMemo(() => {
    if (sortConfigs.length === 0) return data

    return [...data].sort((a, b) => {
      for (const config of sortConfigs) {
        const { column, direction } = config
        if (direction === null) continue

        const aValue = a[column]
        const bValue = b[column]

        let comparison = 0

        // 处理空值
        if (aValue === null || aValue === undefined || aValue === "") {
          comparison = bValue === null || bValue === undefined || bValue === "" ? 0 : 1
        } else if (bValue === null || bValue === undefined || bValue === "") {
          comparison = -1
        } else {
          // 尝试数字比较
          const aNum = Number(aValue)
          const bNum = Number(bValue)

          if (!isNaN(aNum) && !isNaN(bNum)) {
            comparison = aNum - bNum
          } else {
            // 字符串比较
            comparison = String(aValue).localeCompare(String(bValue))
          }
        }

        if (comparison !== 0) {
          return direction === "asc" ? comparison : -comparison
        }
      }
      return 0
    })
  }, [data, sortConfigs])

  const displayData = useMemo(() => displayCsvData(sortedData), [sortedData])

  const loadMoreRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && sortedData.length > displayCount) {
          setDisplayCount((prev) => Math.min(prev + 10, sortedData.length))
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [sortedData.length, displayCount]
  )

  const handleSort = (column: string) => {
    setSortConfigs((prevConfigs) => {
      const existingConfigIndex = prevConfigs.findIndex((config) => config.column === column)

      if (existingConfigIndex !== -1) {
        const existingConfig = prevConfigs[existingConfigIndex]
        const newDirection = existingConfig.direction === "asc" ? "desc" : existingConfig.direction === "desc" ? null : "asc"

        if (newDirection === null) {
          return prevConfigs.filter((config) => config.column !== column)
        } else {
          const newConfigs = [...prevConfigs]
          newConfigs[existingConfigIndex] = { ...existingConfig, direction: newDirection }
          return newConfigs
        }
      } else {
        return [...prevConfigs, { column, direction: "asc" }]
      }
    })
  }

  const getSortIcon = (column: string) => {
    const config = sortConfigs.find((config) => config.column === column)
    if (!config) return "fa-sort"
    return config.direction === "asc" ? "fa-sort-up" : "fa-sort-down"
  }

  const getArrowColorIntensity = (column: string) => {
    const index = sortConfigs.findIndex((config) => config.column === column)
    if (index === -1) return "text-gray-300"

    const intensityLevel = Math.min(index, 4)
    const intensities = ["text-blue-700", "text-blue-600", "text-blue-500", "text-blue-400", "text-blue-300"]
    return intensities[intensityLevel]
  }

  const handleDownloadCSV = () => {
    const timestamp = getTimestampString()
    const filename = `${title}_${timestamp}.csv`
    downloadCSV(sortedData, filename)
  }

  const handleDownloadExcel = () => {
    const timestamp = getTimestampString()
    const filename = `${title}_${timestamp}.xlsx`
    downloadExcel(sortedData, filename)
  }

  const downloadMenuItems: MenuItem[] = [
    {
      label: "下载 CSV",
      icon: "fas fa-file-csv",
      iconClassName: "text-green-600",
      onClick: handleDownloadCSV,
    },
    {
      label: "下载 Excel",
      icon: "fas fa-file-excel",
      iconClassName: "text-blue-600",
      onClick: handleDownloadExcel,
    },
  ]

  if (!data || data.length === 0) {
    return <NoData title="当前无数据预览" />
  }

  const headers = getAllColumns(data)

  return (
    <div className={className}>
      <div className="flex justify-between text-xs font-semibold mb-2.5 text-gray-500 uppercase tracking-wide">
        <span className="select-none">
          {title} {showCount && `(${Math.min(displayCount, displayData.length)}/${displayData.length})`}
        </span>
        <DropdownMenu items={downloadMenuItems} position="right" menuClassName="top-6" trigger={<i className="fas fa-download text-blue-500 hover:text-blue-600 transition-colors" title="下载数据"></i>} />
      </div>
      <div className={`border border-gray-200 rounded overflow-auto ${maxHeight}`}>
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50 sticky top-0 z-20">
            <tr>
              <th className="px-2 py-1.5 text-left font-medium text-gray-500 tracking-wider whitespace-nowrap sticky left-0 top-0 bg-gray-50">#</th>
              {headers.map((header) => {
                const sortIcon = getSortIcon(header)
                const arrowColorIntensity = getArrowColorIntensity(header)
                return (
                  <th key={header} className="px-2 py-1.5 text-left font-medium text-gray-500 tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort(header)}>
                    <div className="flex items-center mr-4">
                      <span>{header}</span>
                      <div className="flex items-center ml-1">
                        <i className={`text-xs fa ${sortIcon} ${arrowColorIntensity}`}></i>
                      </div>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayData.slice(0, displayCount).map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-1.5 whitespace-nowrap sticky left-0 bg-inherit z-10 text-gray-500">{index + 1}</td>
                {headers.map((header) => {
                  const displayValue = row[header]
                  const icon = getDisplayIcon(displayValue.type)

                  return (
                    <td key={header} className="px-2 py-1.5 whitespace-nowrap">
                      {displayValue.type !== "null" ? (
                        <span className={`inline-flex items-center gap-1`}>
                          {icon && <i className={`text-xs ${icon}`}></i>}
                          {displayValue.value}
                        </span>
                      ) : (
                        <span className="text-gray-300 inline-flex items-center gap-1">
                          <i className="fa fa-question-circle"></i>
                          N/A
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
            {displayCount < displayData.length && (
              <tr ref={loadMoreRef}>
                <td colSpan={headers.length + 1} className="px-2 py-1.5 text-center text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span>加载更多数据...</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
