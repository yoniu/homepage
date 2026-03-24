import Link from "next/link"

import { ArrowLeftOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons"
import { App } from "antd"
import { useRouter } from "next/navigation"

import { logout } from "@/src/features/auth/api"

export default function AdminNavigator() {

  const { modal } = App.useApp()
  const router = useRouter()

  const handleClickLogout = () => {
    const alert = modal.warning({
      title: "退出登录",
      content: "是否清除登录状态？",
      okCancel: true,
      okText: "确定",
      cancelText: "取消",
      onOk() {
        logout()
        alert.destroy()
        router.push("/")
      }
    })
  }

  return (
    <div className="space-y-2 flex flex-col">
      <Link className="w-fill bg-blue-50 space-x-3 hover:bg-gray-200 px-3 py-2 rounded transition-all" href="/editor">
        <PlusOutlined />
        <span>Create Moment</span>
      </Link>
      <button onClick={handleClickLogout} className="w-fill text-left space-x-3 hover:bg-red-200 px-3 py-2 rounded transition-all">
        <LogoutOutlined />
        <span>Clear Login Status</span>
      </button>
      <Link className="w-fill space-x-3 hover:bg-gray-200 px-3 py-2 rounded transition-all" href="/">
        <ArrowLeftOutlined />
        <span>Back Home</span>
      </Link>
    </div>
  )
}
