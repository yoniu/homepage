"use client";
import { Fragment, useMemo } from "react";

import CryptoJS from 'crypto-js';

import { Input } from 'antd';

import { cn } from "@/lib/utils";

import { useStateContext as useEditorStateContext } from "@/src/stores/editor";

import SidebarCollapse from "@/src/components/editor/collapse";
import dayFormat from "@/src/utils/dayFormat";

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
    <div className={cn("absolute left-0 bottom-4 w-full py-4 px-6 text-white text-lg sm:text-xl z-index-10", className)}>
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

export function ShowMusicPlainContent(
  {
    content,
    children,
    mail,
    author,
    date,
    className,
  }:
  {
    content: string,
    children?: React.ReactNode,
    author?: string,
    mail?: string,
    className?: string,
    date?: Date,
  }
) {

  const avatar = useMemo(() => CryptoJS.MD5(mail || '').toString(), [mail])
  const dateStr = useMemo(() => date && dayFormat(date), [date])

  return (
    <div className={cn(
      "shrink-0 flex items-start px-4 py-2 rounded-xl m-4 w-[calc(100%-2rem)] space-x-2",
      "bg-white/10 border-2 border-solid border-white/20",
      "hover:shadow-lg hover:shadow-white/20 hover:translate-y-[-2px] transition-all duration-300",
      className
    )}>
      <div className="shrink-0">
        <img src={`https://weavatar.com/avatar/${avatar}?s=100`} alt="author" className="w-8 h-8 rounded-full border-2 border-solid border-white/30 box-content" />
      </div>
      <div className="flex-1">
        <div className="font-bold">
          { author + (dateStr ? ' · ' + dateStr : '') }
        </div>
        <div className="opacity-60 text-sm sm:text-base">
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
      </div>
    </div>
  )
}
