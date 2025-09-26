import type { DataProcessor, AggregateNodeData } from "../types"
import type { CsvTable } from "../types"
import { aggregateData } from "../utils/aggregate-utils"

export class AggregateProcessor implements DataProcessor<AggregateNodeData> {
  process(sourceData: CsvTable[], config: AggregateNodeData): CsvTable {
    const [data] = sourceData
    const { groupBy, aggregations } = config
    return aggregateData(data, groupBy, aggregations)
  }
}
