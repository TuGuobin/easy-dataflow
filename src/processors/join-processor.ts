import { joinData } from "../utils/join-utils";
import type { DataProcessor } from "../types/processor";
import type { JoinNodeData } from "../types";
import type { CsvTable } from "../types";

export class JoinProcessor implements DataProcessor<JoinNodeData> {
  process(sourceData: CsvTable[], config: JoinNodeData): CsvTable {
    if (sourceData.length < 2) return [];
    const [left, right] = sourceData;
    return joinData(left, right, config.joinRules || []);
  }
}