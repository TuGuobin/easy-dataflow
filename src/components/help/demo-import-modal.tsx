import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useWorkflowStore } from "../../stores/workflow-store"
import workflowData from "../../assets/workflow.json"
import { importWorkflow } from "../../utils/workflow-utils"
import { ModalOverlay } from "../common"

interface DemoImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export const DemoImportModal: React.FC<DemoImportModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const { setNodes, setEdges } = useWorkflowStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleImportWorkflow = async () => {
    setIsLoading(true)
    importWorkflow(setNodes, setEdges, workflowData)
    onClose()
    setIsLoading(false)
  }

  const handleSkipDemo = onClose

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto flex flex-col max-h-[80vh] overflow-hidden">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">🚀 {t("help.quickStart")}</h2>
            </div>
            <button onClick={onClose} className="text-white hover:text-blue-200 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{t("help.demoWorkflow")}</h3>
            <div className="border rounded-lg p-4 bg-blue-50 border-blue-200 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4 mt-1">
                  <div className="w-4 h-4 rounded-full border-2 bg-blue-500 border-blue-500">
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">📊</span>
                    <h4 className="font-semibold text-gray-800">{t("help.dataAnalysisWorkflow")}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{t("help.completeDataProcessingFlow")}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <i className="fas fa-sitemap mr-1"></i>
                    <span>{t("help.nodesCount", { nodes: workflowData.nodes.length, edges: workflowData.edges.length })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 功能介绍 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
              {t("help.features")}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                <span>{t("help.dragAndDropDesign")}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                <span>{t("help.realTimePreview")}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                <span>{t("help.multipleDataProcessing")}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                <span>{t("help.visualizationCharts")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="bg-gray-50 p-4 flex justify-between items-center">
          <button onClick={handleSkipDemo} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            {t("help.skipCreate")}
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleImportWorkflow}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${!isLoading ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  {t("help.importing")}
                </div>
              ) : (
                t("help.importWorkflow")
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  )
}
