import { useTranslation } from "react-i18next"

export const NoData = ({ title = "errors.connectDataSourceFirst" }: { title?: string }) => {
  const { t } = useTranslation()
  return (
    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-200 w-full">
      <i className="fa-solid fa-info-circle mr-2"></i>
      {t(title)}
    </div>
  )
}
