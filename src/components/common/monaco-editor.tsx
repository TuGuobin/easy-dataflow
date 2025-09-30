import { useCallback } from "react"
import Editor, { type OnMount } from "@monaco-editor/react"

interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: string
  height?: string
  placeholder?: string
  className?: string
  libSource?: string
}

const tsLibSource = `
type CsvData = string | number | boolean | Date | null;
type CsvRow<T = CsvData> = Record<string, T>;
type CsvTable<T = CsvData> = CsvRow<T>[];
`

const jsLibSource = `
/**
 * @typedef {string | number | boolean | Date | null} CsvData
 * @typedef {{ [key: string]: CsvData }} CsvRow
 * @typedef {CsvRow[]} CsvTable
 */
`

export const MonacoEditor = ({ value, onChange, language = "typescript", libSource, theme = "vs", height = "300px", placeholder = "Coding here...", className = "" }: MonacoEditorProps) => {
  const handleEditorDidMount: OnMount = useCallback(
    (editor, monaco) => {
      if (language === "typescript") {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(libSource || tsLibSource, "global-data.d.ts")
      } else if (language === "javascript") {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource || jsLibSource, "global-data.d.ts")
      }
      editor.updateOptions({
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: "on",
        renderLineHighlight: "all",
        selectOnLineNumbers: true,
        matchBrackets: "always",
        autoClosingBrackets: "always",
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        parameterHints: { enabled: true },
        hover: { enabled: true },
        folding: true,
        automaticLayout: true,
        wordWrap: "on",
        smoothScrolling: true,
        cursorBlinking: "smooth",
      })
    },
    [language, libSource]
  )

  const handleChange = useCallback(
    (value: string | undefined) => {
      onChange(value || "")
    },
    [onChange]
  )

  return (
    <div className={`monaco-editor-container ${className}`}>
      <Editor
        height={height}
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={handleChange}
        theme={theme}
        onMount={handleEditorDidMount}
        options={{
          placeholder,
          fontSize: 14,
          fontFamily: "Consolas, Monaco, 'Courier New', monospace",
          lineHeight: 20,
          padding: { top: 10, bottom: 10 },
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          matchBrackets: "always",
          autoClosingBrackets: "always",
          formatOnPaste: true,
          formatOnType: true,
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          parameterHints: { enabled: true },
          hover: { enabled: true },
          folding: true,
          lineNumbers: "on",
          renderLineHighlight: "all",
          selectOnLineNumbers: true,
          automaticLayout: true,
          wordWrap: "on",
        }}
      />
    </div>
  )
}
