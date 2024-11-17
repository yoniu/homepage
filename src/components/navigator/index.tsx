"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation"

import navigator from "@/src/configs/navigator.json"
import { Fragment } from "react";
import useIcon from "@/src/hooks/icon";
import { useStateContext as useUserstateContext } from "@/src/stores/user";
import { GlobalOutlined } from "@ant-design/icons";

// 动态导入，禁止服务端渲染
const MomentLogin = dynamic(() => import("@/src/components/moments/login"), {
  ssr: false,
})

type TNav = typeof navigator[0]

export default function Navigator() {

  const pathname = usePathname()
  const IconFont = useIcon()

  const { state } = useUserstateContext()

  const className = (item: TNav) => {
    const url = item.url.includes("/") ? item.url : `/${item.url}`
    if (pathname === url)
      return "flex flex-col items-center bg-gray-100 hover:bg-gray-200 text-lg rounded px-3 py-2 space-y-1 mb-2 border transition-all"
    else 
      return "flex flex-col items-center hover:bg-gray-100 text-lg rounded px-3 py-2 space-y-1 mb-2 transition-all"
  }

  const linkItem = (item: TNav) => (
    <Fragment key={item.name}>
      <Link className={className(item)} href={item.url} title={item.description}>
        <IconFont type={`icon-${item.icon}`} />
        <span className="text-xs">{item.name}</span>
      </Link>
    </Fragment>
  )
  const aItem = (item: TNav) => (
    <Fragment key={item.name}>
      <a className={className(item)} href={item.url} target="_blank" rel="noreferrer" title={item.description}>
        <IconFont type={`icon-${item.icon}`} />
        <span className="text-xs">{item.name}</span>
      </a>
    </Fragment>
  )

  const Admin = () => (
    <Link className="flex flex-col items-center hover:bg-gray-100 text-lg rounded px-3 py-2 space-y-1 mb-2 transition-all" href="/admin">
      <GlobalOutlined />
      <span className="text-xs">Admin</span>
    </Link>
  )
  
  return (
    <div className="flex items-center justify-between flex-wrap text-sm mb-4">
      {
        navigator.map((item) => (
          item.type === "link" ?
          linkItem(item) :
          aItem(item)
        ))
      }
      { !state.isLogin && <MomentLogin /> }
      { state.isLogin && <Admin /> }
    </div>
  )
}
