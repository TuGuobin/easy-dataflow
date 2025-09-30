import { UploadPanel } from "./upload-panel"
import { RemoveColumnPanel } from "./remove-column-panel"
import { RenameColumnPanel } from "./rename-column-panel"
import { AddColumnPanel } from "./add-column-panel"
import { RemoveRowPanel } from "./remove-row-panel"
import { AddRowPanel } from "./add-row-panel"
import { TransformPanel } from "./transform-panel"
import { AggregatePanel } from "./aggregate-panel"
import { JoinPanel } from "./join-panel"
import { VisualizePanel } from "./visualize-panel"

export default {
  upload: UploadPanel,
  transform: TransformPanel,
  aggregate: AggregatePanel,
  visualize: VisualizePanel,
  removeColumn: RemoveColumnPanel,
  renameColumn: RenameColumnPanel,
  addColumn: AddColumnPanel,
  removeRow: RemoveRowPanel,
  addRow: AddRowPanel,
  join: JoinPanel,
}
