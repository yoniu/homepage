"use client";

import { useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import friend_links from '@/src/configs/friends.json'

interface ILink {
  name: string;
  description: string;
  link: string;
  image: string;
}

import { cn } from "@/lib/utils";

function Friend_Item(item: ILink) {
  return (
    <a className="flex items-center hover:bg-gray-300 rounded px-3 py-2 -mx-3 space-x-2 transition-all" href={item.link} key={item.name} target="_blank" rel="noreferrer">
      <img className="rounded w-6" src={item.image} alt={item.name} />
      <span className="text-sm">{ item.name }</span>
    </a>
  )
}

export default function Friends({ className }: { className?: string }) {
  const [collapsed, setCollapsed] = useState(false)
  const [overflowHidden, setOverflowHidden] = useState(false)

  const handleToggle = () => {
    if (!collapsed) {
      // 即将收起，先加 overflow-hidden
      setOverflowHidden(true)
    }
    setCollapsed(!collapsed)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <button
        className="flex items-center space-x-1 text-xs leading-none opacity-60 hover:opacity-100 transition-all"
        onClick={handleToggle}
      >
        <span>Links</span>
        {collapsed ? <DownOutlined className="text-[10px]" /> : <UpOutlined className="text-[10px]" />}
      </button>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          overflowHidden && "overflow-hidden",
          collapsed ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
        )}
        onTransitionEnd={() => {
          if (collapsed) {
            setOverflowHidden(true)
          } else {
            setOverflowHidden(false)
          }
        }}
      >
        <div className="flex flex-col">
          {
            friend_links.map((link: ILink) => {
              return Friend_Item(link)
            })
          }
        </div>
      </div>
    </div>
  )
}
