'use client';

import { useState } from "react";

import { cn } from "@/lib/utils"

import OtherFooter from "@/src/components/footer/other";
import SidebarSpread from "./spread";
import SelectType from "@/src/components/editor/selectType";
import SelectVisible from "@/src/components/editor/selectVisible";
import { useStateContext as useEditorStateContext } from '@/src/stores/editor';
import Save from "@/src/components/editor/Save";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import TextEditorSidebar from "@/src/components/editor/text/sidebar";
import ImageEditorSidebar from "@/src/components/editor/image/sidebar";

export default function EditorSidebar() {

  const { state } = useEditorStateContext()
  const [show, setShow] = useState(false)

  const editorSidebar: Record<EMomentType, JSX.Element> = {
    text: <TextEditorSidebar />,
    image: <ImageEditorSidebar />,
    video: <TextEditorSidebar />,
    live: <TextEditorSidebar />,
  }

  const isShow = () => {
    return show ? 'translate-x-0' : 'translate-x-full'
  }

  const toggleShow = () => {
    setShow(!show)
  }

  return (
    <div className={cn("fixed flex flex-col md:static w-72 h-screen md:h-full md:w-full z-10 md:z-0 top-0 right-0 md:right-auto md:top-auto p-4 md:p-0 shadow-lg md:shadow-none transition-all", isShow(), 'md:translate-x-0')}>
      <SidebarSpread show={show} toggleShow={toggleShow} />
      <div className="flex items-center justify-between mb-2 space-x-2">
        <Link href="/" className="group/back flex items-center py-2">
          <ArrowLeftOutlined className="group-hover/back:px-2 transition-all" />
          <span className="text-nowrap opacity-0 group-hover/back:opacity-100 group-hover/back:px-1 transition-all">Back Home</span>
        </Link>
        <Save />
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto">
        <SelectVisible />
        <SelectType />
        {
          (state.attributes && state.attributes.type) ?
          editorSidebar[state.attributes.type as EMomentType] :
          editorSidebar.text
        }
      </div>
      <OtherFooter />
    </div>
  )
}
