import type { DataProcessor, AddColumnNodeData } from "../types"
import type { CsvTable } from "../types"
import { addColumns } from "../utils/data-processing-utils"

export class AddColumnProcessor implements DataProcessor<AddColumnNodeData> {
  process(sourceData: CsvTable[], config: AddColumnNodeData): CsvTable {
    const [data] = sourceData
    const { newColumns } = config
    return addColumns(data, newColumns)
  }
}
