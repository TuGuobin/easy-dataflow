import type { DataProcessor, TransformNodeData } from "../types";
import type { CsvTable } from "../types";
import { transformData } from "../utils/transform-utils";

export class TransformProcessor implements DataProcessor<TransformNodeData> {
  process(sourceData: CsvTable[], config: TransformNodeData): CsvTable {
    const [data] = sourceData;
    const { transformations } = config;
    return transformData(data, transformations);
  }
}