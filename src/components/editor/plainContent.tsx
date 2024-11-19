"use client";

import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import SidebarCollapse from "@/src/components/editor/collapse";
import { Input } from 'antd';
import { Fragment } from "react";
import { cn } from "@/lib/utils";

const { TextArea } = Input;

export default function EditorPlainContent() {

  const { state, dispatch } = useEditorStateContext();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: "UPDATE",
      states: {
        content: e.target.value
      }
    })
    console.log(state.content)
  }
  
  return (
    <SidebarCollapse title="编辑内容" className="space-y-1" defaultOpen={true}>
      <TextArea value={state.content ?? ''} onChange={handleChange} />
    </SidebarCollapse>
  )
}

export function ShowPlainContent(
  {
    content,
    children,
    className
  }:
  {
    content: string,
    children?: React.ReactNode,
    className?: string,
  }
) {
  return (
    <div className={cn("absolute left-0 bottom-0 w-full py-4 px-6 bg-gradient-to-t from-black/100 via-black/80 to-transparent text-white text-xl z-index-10", className)}>
      { children }
      { 
        content.split('\n').map((line, index) => (
          <Fragment key={index}>
            <span>{line}</span>
            <br />
          </Fragment>
        ))
      }
    </div>
  )
}
