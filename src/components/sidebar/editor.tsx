'use client';

import { useState } from "react";

import { cn } from "@/lib/utils"

import OtherFooter from "@/src/components/footer/other";
import SidebarSpread from "./spread";
import SelectType from "@/src/components/editor/selectType";
import SelectVisible from "@/src/components/editor/selectVisible";
import Upload from "@/src/components/editor/Upload";
import Save from "@/src/components/editor/Save";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function EditorSidebar() {

  const [show, setShow] = useState(false)

  const isShow = () => {
    return show ? 'translate-x-0' : 'translate-x-full'
  }

  const toggleShow = () => {
    setShow(!show)
  }

  return (
    <div className={cn("fixed flex flex-col md:static bg-white w-56 h-screen md:h-full md:w-full z-10 md:z-0 top-0 right-0 md:right-auto md:top-auto p-4 md:p-0 shadow-lg md:shadow-none transition-all", isShow(), 'md:translate-x-0')}>
      <SidebarSpread show={show} toggleShow={toggleShow} />
      <Link href="/" className="group/back flex items-center mb-2 py-2 rounded hover:px-2 hover:bg-blue-200 transition-all">
        <ArrowLeftOutlined className="group-hover/back:px-2" />
        <span className="opacity-0 group-hover/back:opacity-100 group-hover/back:px-1 transition-all">Back Home</span>
      </Link>
      <div className="flex-1 space-y-3 overflow-y-auto">
        <SelectVisible />
        <SelectType />
        <Upload />
        <Save />
      </div>
      <OtherFooter />
    </div>
  )
}
