import React, { useState } from "react"
import { nodeConfigs, getNodeIconClass } from "../../config/node-config"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

const quickStartSteps = [
  {
    icon: "fa-upload",
    title: "1. 上传数据",
    description: "拖拽'数据上传'节点到画布，上传CSV文件开始数据处理",
    color: "blue",
  },
  {
    icon: "fa-filter",
    title: "2. 添加处理节点",
    description: "根据需求添加过滤、转换、聚合等处理节点",
    color: "green",
  },
  {
    icon: "fa-link",
    title: "3. 连接节点",
    description: "拖拽连接线将节点按处理顺序连接起来",
    color: "orange",
  },
  {
    icon: "fa-chart-bar",
    title: "4. 可视化结果",
    description: "添加可视化节点，选择合适的图表类型展示数据",
    color: "purple",
  },
]

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"quickstart" | "nodes" | "tips">("quickstart")

  if (!isOpen) return null

  const tips = [
    {
      icon: "fa-keyboard",
      title: "快捷键",
      content: "Delete键删除选中节点",
      color: "blue",
    },
    {
      icon: "fa-save",
      title: "导入/导出工作流",
      content: "使用导出功能保存工作流，方便下次导入使用",
      color: "green",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 flex flex-col max-h-[80vh] overflow-hidden">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">📖 使用帮助</h2>
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
              快速开始
            </button>
            <button className={`px-4 py-3 font-medium transition-colors ${activeTab === "nodes" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-800"}`} onClick={() => setActiveTab("nodes")}>
              <i className="fas fa-sitemap mr-2"></i>
              节点类型
            </button>
            <button className={`px-4 py-3 font-medium transition-colors ${activeTab === "tips" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-800"}`} onClick={() => setActiveTab("tips")}>
              <i className="fas fa-lightbulb mr-2"></i>
              使用技巧
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-4 flex-1 overflow-y-auto max-h-[60vh]">
          {activeTab === "quickstart" && (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">🎯 四步完成数据处理</h3>
                <p className="text-gray-600">按照以下步骤，轻松完成数据处理任务</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickStartSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-${step.color}-100 flex items-center justify-center`}>
                      <i className={`fas ${step.icon} text-${step.color}-600 text-lg`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                  <span className="font-semibold text-blue-800">💡 提示</span>
                </div>
                <p className="text-blue-700 text-sm">点击顶部菜单栏的"示例"按钮可以快速导入预设的工作流模板，帮助您快速了解系统功能！</p>
              </div>
            </div>
          )}

          {activeTab === "nodes" && (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">🔧 节点类型详解</h3>
                <p className="text-gray-600">了解每个节点的功能和使用场景</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(nodeConfigs)
                  .filter((node) => node.type !== "default")
                  .map((node) => (
                    <div key={node.type} className="border flex items-center border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex-1 flex flex-col">
                        <h4 className="font-semibold text-gray-800">{node.name}</h4>
                        <p className="text-sm text-gray-600">{node.description}</p>
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
                <h3 className="text-xl font-semibold text-gray-800 mb-2">🚀 使用技巧</h3>
                <p className="text-gray-600">掌握这些技巧，让您的工作更高效</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${tip.color}-100 flex items-center justify-center`}>
                      <i className={`fas ${tip.icon} text-${tip.color}-600`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{tip.title}</h4>
                      <p className="text-sm text-gray-600">{tip.content}</p>
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
            开始使用
          </button>
        </div>
      </div>
    </div>
  )
}
