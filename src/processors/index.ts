import type { NodeData, NodeType } from "../types"
import type { DataProcessor } from "../types/processor"
import type { CsvTable } from "../types"
import { AddRowProcessor } from "./add-row-processor"
import { JoinProcessor } from "./join-processor"
import { RemoveColumnProcessor } from "./remove-column-processor"
import { RenameColumnProcessor } from "./rename-column-processor"
import { AddColumnProcessor } from "./add-column-processor"
import { RemoveRowsProcessor } from "./remove-rows-processor"
import { TransformProcessor } from "./transform-processor"
import { AggregateProcessor } from "./aggregate-processor"
import { CodeProcessor } from "./code-processor"

class DefaultProcessor<T> implements DataProcessor<T> {
  process(sourceData: CsvTable[]): CsvTable {
    return sourceData[0] || []
  }
}

const PROCESSORS: Partial<Record<NodeType, DataProcessor<NodeData>>> = {
  addRow: new AddRowProcessor(),
  join: new JoinProcessor(),
  removeColumn: new RemoveColumnProcessor(),
  renameColumn: new RenameColumnProcessor(),
  addColumn: new AddColumnProcessor(),
  removeRow: new RemoveRowsProcessor(),
  transform: new TransformProcessor(),
  aggregate: new AggregateProcessor(),
  code: new CodeProcessor(),
}

export const processData = async <T extends NodeData>(nodeType: NodeType, sourceData: CsvTable[], config: T): Promise<CsvTable> => {
  const processor = PROCESSORS[nodeType] || new DefaultProcessor()
  return await processor.process(sourceData, config)
}

export const getProcessor = (nodeType: NodeType) => PROCESSORS[nodeType]
