import Link from "next/link"

import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons"

export default function AdminNavigator() {

  return (
    <div className="space-y-2 flex flex-col">
      <Link className="w-fill bg-blue-50 space-x-3 hover:bg-gray-200 px-3 py-2 rounded transition-all" href="/editor">
        <PlusOutlined />
        <span>Create Moment</span>
      </Link>
      <Link className="w-fill space-x-3 hover:bg-gray-200 px-3 py-2 rounded transition-all" href="/">
        <ArrowLeftOutlined />
        <span>Back Home</span>
      </Link>
    </div>
  )
}