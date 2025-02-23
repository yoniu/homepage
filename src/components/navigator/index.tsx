"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation"

import navigator from "@/src/configs/navigator.json"
import { Fragment } from "react";
import useIcon from "@/src/hooks/icon";
import { useStateContext as useUserstateContext } from "@/src/stores/user";
import { useStateContext as useMomentstateContext } from "@/src/stores/moment";
import { GlobalOutlined, TikTokOutlined } from "@ant-design/icons";

// 动态导入，禁止服务端渲染
const MomentLogin = dynamic(() => import("@/src/components/moments/login"), {
  ssr: false,
})

type TNav = typeof navigator[0]

export default function Navigator() {

  const pathname = usePathname()
  const IconFont = useIcon()

  const { state } = useUserstateContext()
  const { state: momentState, dispatch } = useMomentstateContext()

  const className = (item: TNav) => {
    const url = item.url.includes("/") ? item.url : `/${item.url}`
    if (pathname === url)
      return "flex flex-col items-center bg-gray-100 hover:bg-gray-200 text-lg rounded px-3 py-2 space-y-1 mb-2 border transition-all min-w-16"
    else 
      return "flex flex-col items-center hover:bg-gray-100 text-lg rounded px-3 py-2 space-y-1 mb-2 transition-all min-w-16"
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

  const handleSwitch = () => {
    if (momentState.displayType === 'tiktok') {
      return dispatch({
        type: 'SETDISPLAYTYPE',
        displayType: 'masonry',
      })
    }
    dispatch({
      type: 'SETDISPLAYTYPE',
      displayType: 'tiktok',
    })
  }

  const Switch = () => (
    <button className="flex flex-col items-center hover:bg-gray-100 text-lg rounded px-3 py-2 space-y-1 mb-2 transition-all" onClick={handleSwitch}>
      <TikTokOutlined />
      <span className="text-xs">切换布局</span>
    </button>
  )
  
  return (
    <div className="grid grid-cols-3 gap-2 text-sm mb-4">
      {
        navigator.map((item) => (
          item.type === "link" ?
          linkItem(item) :
          aItem(item)
        ))
      }
      { !state.isLogin && <MomentLogin /> }
      { state.isLogin && <Admin /> }
      <Switch />
    </div>
  )
}
