import React, { useState } from "react"
import { nodeConfigs, getNodeIconClass } from "../../config/node-config"
import { useTranslation } from "react-i18next"
import { ModalOverlay } from "../common"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

const quickStartSteps = [
  {
    icon: "fa-upload",
    titleKey: "help.step1Upload",
    descriptionKey: "help.uploadCSVStart",
    color: "blue",
  },
  {
    icon: "fa-filter",
    titleKey: "help.step2AddNodes",
    descriptionKey: "help.addFilterTransform",
    color: "green",
  },
  {
    icon: "fa-link",
    titleKey: "help.step3ConnectNodes",
    descriptionKey: "help.dragConnectInOrder",
    color: "orange",
  },
  {
    icon: "fa-chart-bar",
    titleKey: "help.step4Visualize",
    descriptionKey: "help.addChartNode",
    color: "purple",
  },
]

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<"quickstart" | "nodes" | "tips">("quickstart")



  const tips = [
    {
      icon: "fa-keyboard",
      titleKey: "help.shortcuts",
      contentKey: "help.deleteKeyRemove",
      color: "blue",
    },
    {
      icon: "fa-save",
      titleKey: "help.importExportWorkflow",
      contentKey: "help.saveForNext",
      color: "green",
    },
  ]

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto flex flex-col max-h-[80vh] overflow-hidden">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">📖 {t("help.usageHelp")}</h2>
            </div>
            <button onClick={onClose} className="text-white hover:text-blue-200 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* 标签页 */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button className={`px-4 py-3 font-medium transition-colors ${activeTab === "quickstart" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-800"}`} onClick={() => setActiveTab("quickstart")}>
              <i className="fas fa-rocket mr-2"></i>
              {t("help.quickStartTitle")}
            </button>
            <button className={`px-4 py-3 font-medium transition-colors ${activeTab === "nodes" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-800"}`} onClick={() => setActiveTab("nodes")}>
              <i className="fas fa-sitemap mr-2"></i>
              {t("help.nodeTypes")}
            </button>
            <button className={`px-4 py-3 font-medium transition-colors ${activeTab === "tips" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-800"}`} onClick={() => setActiveTab("tips")}>
              <i className="fas fa-lightbulb mr-2"></i>
              {t("help.usageTips")}
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-4 flex-1 overflow-y-auto max-h-[60vh]">
          {activeTab === "quickstart" && (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">🎯 {t("help.fourStepsComplete")}</h3>
                <p className="text-gray-600">{t("help.followSteps")}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickStartSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-${step.color}-100 flex items-center justify-center`}>
                      <i className={`fas ${step.icon} text-${step.color}-600 text-lg`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{t(step.titleKey)}</h4>
                      <p className="text-sm text-gray-600">{t(step.descriptionKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                  <span className="font-semibold text-blue-800">💡 {t("help.tip")}</span>
                </div>
                <p className="text-blue-700 text-sm">{t("help.clickExampleButton")}</p>
              </div>
            </div>
          )}

          {activeTab === "nodes" && (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">🔧 {t("help.nodeTypes")}</h3>
                <p className="text-gray-600">{t("help.nodeTypesDescription")}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(nodeConfigs).map((node) => (
                  <div key={node.type} className="border flex items-center border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex-1 flex flex-col">
                      <h4 className="font-semibold text-gray-800">{t(node.name)}</h4>
                      <p className="text-sm text-gray-600">{t(node.description)}</p>
                    </div>
                    <div className={`w-8 h-8 ml-3 rounded-md flex items-center justify-center ${node.theme.bg}`}>
                      <i className={`${node.theme.text} ${getNodeIconClass(node.type)}`}></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tips" && (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">🚀 {t("help.usageTips")}</h3>
                <p className="text-gray-600">{t("help.tipsDescription")}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${tip.color}-100 flex items-center justify-center`}>
                      <i className={`fas ${tip.icon} text-${tip.color}-600`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{t(tip.titleKey)}</h4>
                      <p className="text-sm text-gray-600">{t(tip.contentKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end items-center">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            {t("help.startUsing")}
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}
