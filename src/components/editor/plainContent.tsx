"use client";

import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import SidebarCollapse from "@/src/components/editor/collapse";
import TextArea from "antd/es/input/TextArea";

export default function EditorPlainContent() {

  const { state, dispatch } = useEditorStateContext();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: "UPDATE",
      states: {
        title: e.target.value
      }
    })
  }
  
  return (
    <SidebarCollapse title="编辑内容" className="space-y-1" defaultOpen={true}>
      <TextArea value={state.content} onChange={handleChange} />
    </SidebarCollapse>
  )
}
