import React, { useState, useEffect } from "react"
import { getThemeConfig } from "../../themes/color-theme"

interface WelcomeGuideProps {
  isOpen: boolean
  onClose: () => void
  onStartDemo: () => void
}

const steps = [
  {
    title: "👋 欢迎使用 Easy DataFlow",
    description: "简单易用，让数据分析轻松有趣",
    icon: "fa-hand-spock",
    color: getThemeConfig("blue"),
  },
  {
    title: "🎯 拖拽操作",
    description: "拖拽节点，构建连接，完善数据处理流程",
    icon: "fa-mouse-pointer",
    color: getThemeConfig("green"),
  },
  {
    title: "📊 节点类型",
    description: "你需要的功能，这里都有",
    icon: "fa-sitemap",
    color: getThemeConfig("purple"),
  },
  {
    title: "🚀 快速开始",
    description: "快速体验，或从零开始创建自己的流程",
    icon: "fa-rocket",
    color: getThemeConfig("orange"),
  },
]

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ isOpen, onClose, onStartDemo }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowWelcome(true)
      setCurrentStep(0)
    }
  }, [isOpen])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    setShowWelcome(false)
    onClose()
  }

  const handleFinish = () => {
    setShowWelcome(false)
    onClose()
    onStartDemo()
  }

  if (!isOpen || !showWelcome) return null

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${showWelcome ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="flex justify-center pt-6 pb-2">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep ? `${currentStepData.color.bgDark} w-8` : index < currentStep ? `${currentStepData.color.bg} w-2` : "bg-gray-200"}`} />
            ))}
          </div>
        </div>

        {/* 内容 */}
        <div className="px-8 py-6 text-center">
          <div className="mb-6">
            <div className={`w-16 h-16 rounded-full ${currentStepData.color.bgLight} flex items-center justify-center mx-auto mb-4`}>
              <i className={`fas ${currentStepData.icon} ${currentStepData.color.text} text-2xl`}></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{currentStepData.title}</h3>
            <p className="text-gray-600 leading-relaxed">{currentStepData.description}</p>
          </div>

          {/* 步骤指示 */}
          <div className="text-sm text-gray-500 mb-6">
            {currentStep + 1} / {steps.length}
          </div>
        </div>

        {/* 按钮 */}
        <div className="px-8 pb-6">
          <div className="flex justify-between items-center mb-2">
            <button onClick={handleSkip} className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
              跳过引导
            </button>

            <div className="flex space-x-3">
              {currentStep > 0 && (
                <button onClick={handlePrevious} className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  上一步
                </button>
              )}
              <button onClick={handleNext} className={`px-6 py-2 text-white rounded-lg transition-all duration-200 ${currentStepData.color.bgDark} ${currentStepData.color.hoverBg}`}>
                {currentStep === steps.length - 1 ? "开始体验" : "下一步"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
