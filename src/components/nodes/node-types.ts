import { UploadNode } from "./upload-node"
import { TransformNode } from "./transform-node"
import { AggregateNode } from "./aggregate-node"
import { VisualizeNode } from "./visualize-node"
import { RemoveColumnNode } from "./remove-column-node"
import { RenameColumnNode } from "./rename-column-node"
import { AddColumnNode } from "./add-column-node"
import { RemoveRowNode } from "./remove-row-node"
import { AddRowNode } from "./add-row-node"
import { JoinNode } from "./join-node"
import { CodeNode } from "./code-node"
import { BaseNode } from "./base-node"


export const nodeTypes = {
  upload: UploadNode,
  transform: TransformNode,
  aggregate: AggregateNode,
  visualize: VisualizeNode,
  removeColumn: RemoveColumnNode,
  renameColumn: RenameColumnNode,
  addColumn: AddColumnNode,
  removeRow: RemoveRowNode,
  addRow: AddRowNode,
  join: JoinNode,
  code: CodeNode,
  unknown: BaseNode
}