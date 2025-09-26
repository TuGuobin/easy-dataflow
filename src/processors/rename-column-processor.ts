import type { DataProcessor, RenameColumnNodeData } from "../types";
import type { CsvTable } from "../types";
import { renameColumns } from "../utils/data-processing-utils";

export class RenameColumnProcessor implements DataProcessor<RenameColumnNodeData> {
  process(sourceData: CsvTable[], config: RenameColumnNodeData): CsvTable {
    const [data] = sourceData;
    const { renames } = config;
    return renameColumns(data, renames);
  }
}