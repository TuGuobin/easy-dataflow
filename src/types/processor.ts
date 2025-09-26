import type { CsvTable } from "./index";

export interface DataProcessor<TConfig> {
  process(sourceData: CsvTable[], config: TConfig): CsvTable;
}