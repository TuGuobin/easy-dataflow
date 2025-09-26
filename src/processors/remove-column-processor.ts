import type { DataProcessor } from "../types/processor";
import type { RemoveColumnNodeData } from "../types";
import type { CsvTable } from "../types";
import { removeColumns } from "../utils/data-processing-utils";

export class RemoveColumnProcessor implements DataProcessor<RemoveColumnNodeData> {
  process(sourceData: CsvTable[], config: RemoveColumnNodeData): CsvTable {
    const mainData = sourceData[0] || [];
    const columnsToRemove = config.columnsToRemove || [];
    return removeColumns(mainData, columnsToRemove);
  }
}