import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { getThemeConfig } from "../../themes/color-theme"
import { ModalOverlay } from "../common"

interface WelcomeGuideProps {
  isOpen: boolean
  onClose: () => void
  onStartDemo: () => void
}

const steps = [
  {
    titleKey: "help.welcome.title",
    descriptionKey: "help.welcome.description",
    icon: "fa-hand-spock",
    color: getThemeConfig("blue"),
  },
  {
    titleKey: "help.welcome.dragDrop",
    descriptionKey: "help.welcome.dragDropDesc",
    icon: "fa-mouse-pointer",
    color: getThemeConfig("green"),
  },
  {
    titleKey: "help.welcome.nodeTypes",
    descriptionKey: "help.welcome.nodeTypesDesc",
    icon: "fa-sitemap",
    color: getThemeConfig("purple"),
  },
  {
    titleKey: "help.welcome.quickStart",
    descriptionKey: "help.welcome.quickStartDesc",
    icon: "fa-rocket",
    color: getThemeConfig("orange"),
  },
]

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ isOpen, onClose, onStartDemo }) => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)

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
    onClose()
  }

  const handleFinish = () => {
    onClose()
    onStartDemo()
  }

  if (!isOpen) return null

  const currentStepData = steps[currentStep]

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleSkip} closeOnOverlayClick={true}>
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-auto">
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
            <h3 className="text-xl font-bold text-gray-800 mb-3">{t(currentStepData.titleKey)}</h3>
            <p className="text-gray-600 leading-relaxed">{t(currentStepData.descriptionKey)}</p>
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
              {t("common.skip")}
            </button>

            <div className="flex space-x-3">
              {currentStep > 0 && (
                <button onClick={handlePrevious} className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  {t("common.previous")}
                </button>
              )}
              <button onClick={handleNext} className={`px-6 py-2 text-white rounded-lg transition-all duration-200 ${currentStepData.color.bgDark} ${currentStepData.color.hoverBg}`}>
                {currentStep === steps.length - 1 ? t("help.startUsing") : t("common.next")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalOverlay>
  )
}
