export const NoData = ({ title = "请先连接已有数据的源节点" }: { title?: string }) => {
  return (
    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-200 w-full">
      <i className="fa-solid fa-info-circle mr-2"></i>
      {title}
    </div>
  )
}
