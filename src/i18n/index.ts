import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import enTranslations from "./locales/en"
import zhTranslations from "./locales/zh"

const resources = {
  en: {
    translation: enTranslations,
  },
  zh: {
    translation: zhTranslations,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "zh",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
