import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

export default function MomentControl () {
  return (
    <div className="absolute bottom-0 left-0 space-x-3 flex items-center justify-end w-full p-3">
      <button className="bg-opacity-30 bg-white text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-brightness-50">
        <ArrowUpOutlined />
      </button>
      <button className="bg-opacity-30 bg-white text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-brightness-50">
        <ArrowDownOutlined />
      </button>
    </div>
  )
}
