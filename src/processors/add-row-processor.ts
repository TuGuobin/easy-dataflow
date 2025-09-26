import type { DataProcessor } from "../types/processor"
import type { AddRowNodeData } from "../types"
import type { CsvTable } from "../types"
import { addRows } from "../utils/data-processing-utils"

export class AddRowProcessor implements DataProcessor<AddRowNodeData> {
  process(sourceData: CsvTable[], config: AddRowNodeData): CsvTable {
    const mainData = sourceData[0] || []
    const newRows = config.newRows || []
    return addRows(mainData, newRows)
  }
}
