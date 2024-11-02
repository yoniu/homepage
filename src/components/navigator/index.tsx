"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"

import navigator from "@/src/configs/navigator.json"
import { Fragment } from "react";

type TNav = typeof navigator[0]

export default function Navigator() {

  const pathname = usePathname()

  const className = (item: TNav) => {
    const url = item.url.includes("/") ? item.url : `/${item.url}`
    if (pathname === url)
      return "shadow-[inset_0_-5px_0_rgba(0,0,0,0.2)] hover:shadow-[inset_0_0_0_black] hover:underline underline-offset-4 transition-all"
    else 
      return "hover:underline underline-offset-4"
  }

  const linkItem = (item: TNav, index: number) => (
    <Fragment key={item.name}>
      <Link className={className(item)} href={item.url} title={item.description}>{ item.name }</Link>
      {
        index !== navigator.length - 1 && <Separator orientation="vertical" />
      }
    </Fragment>
  )
  const aItem = (item: TNav, index: number) => (
    <Fragment key={item.name}>
      <a className={className(item)} href={item.url} target="_blank" rel="noreferrer" title={item.description}>{ item.name }</a>
      {
        index !== navigator.length - 1 && <Separator orientation="vertical" />
      }
    </Fragment>
  )

  
  return (
    <div className="flex h-5 items-center space-x-4 text-sm">
      {
        navigator.map((item, index) => (
          item.type === "link" ?
          linkItem(item, index) :
          aItem(item, index)
        ))
      }
      
    </div>
  )
}
