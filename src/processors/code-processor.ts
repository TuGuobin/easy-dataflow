import type { DataProcessor, CodeNodeData } from "../types"
import type { CsvTable } from "../types"
import { generateId } from "../utils/id"
import { errorBus } from "../utils/pubsub"

const SANDBOX_URL = new URL("../sandbox/code-sandbox.html", import.meta.url).href

export class CodeProcessor implements DataProcessor<CodeNodeData> {
  private iframe: HTMLIFrameElement | null = null
  private messageHandlers = new Map<string, (result: CsvTable, error?: string) => void>()

  private ensureIframe(): HTMLIFrameElement {
    if (this.iframe && this.iframe.contentWindow) {
      return this.iframe
    }

    const iframe = document.createElement("iframe")
    iframe.src = SANDBOX_URL
    iframe.style.display = "none"
    document.body.appendChild(iframe)
    this.iframe = iframe

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const { id, result, error } = event.data
      const handler = this.messageHandlers.get(id)
      if (handler) {
        this.messageHandlers.delete(id)
        try {
          handler(result, error)
        } catch (err) {
          errorBus.emit('error', err instanceof Error ? err.message : "Unknown error")
        }
      }
    }

    window.addEventListener("message", handleMessage)

    iframe.addEventListener("load", () => {
      console.log("Sandbox iframe loaded successfully")
    })

    return iframe
  }

  private validateCsvTable(data: CsvTable): data is CsvTable {
    if (!Array.isArray(data)) return false
    for (const row of data) {
      if (row == null || typeof row !== "object" || Array.isArray(row)) {
        return false
      }
      for (const key in row) {
        if (typeof key !== "string") return false
      }
    }
    return true
  }

  async process(sourceData: CsvTable[], config: CodeNodeData): Promise<CsvTable> {
    const [originalData] = sourceData
    const { code } = config

    if (!code || !code.trim()) {
      return originalData
    }

    const id = "code-" + generateId()

    return new Promise<CsvTable>((resolve) => {
      const iframe = this.ensureIframe()
      const timeout = 5000

      const cleanup = () => {
        this.messageHandlers.delete(id)
      }

      this.messageHandlers.set(id, (result, error) => {
        cleanup()

        if (error) {
          throw new Error(error)
        }

        if (result && this.validateCsvTable(result)) {
          resolve(result)
          return
        }

        resolve(originalData)
      })

      const wrappedCode = `
        // User code
        ${code}
        
        // Ensure processData function exists
        if (typeof processData !== 'function' && typeof ctx.processData === 'undefined') {
          ctx.processData = function(data) { return data; }
        } else if (typeof processData === 'function') {
          ctx.processData = processData
        }
      `

      iframe.contentWindow?.postMessage({ id, data: originalData, code: wrappedCode, timeout }, window.location.origin)

      setTimeout(() => {
        if (this.messageHandlers.has(id)) {
          cleanup()
          throw new Error("Code execution timed out")
        }
      }, timeout)
    })
  }
}
