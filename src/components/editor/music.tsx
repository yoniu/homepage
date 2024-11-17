"use client";

import { Input } from "antd";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import SidebarCollapse from "./collapse";

export default function EditorMusic() {

  const { state, dispatch } = useEditorStateContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const prevAttributes = state.attributes ?? null;
    const prevMusic = prevAttributes?.music ?? null;
    const music = {
      ...prevMusic,
      [type]: e.target.value
    }
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        music
      }
    }});
  }
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 'name');
  const handleChangeSinger = (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 'singer');
  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 'url');
  const handleChangeCover = (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 'cover');
  
  return (
    <SidebarCollapse title="背景音乐" className="space-y-1">
      <Input placeholder="歌曲名称" value={state.attributes?.music?.name} onChange={handleChangeName} />
      <Input placeholder="歌手名称" value={state.attributes?.music?.singer} onChange={handleChangeSinger} />
      <Input placeholder="歌曲链接" value={state.attributes?.music?.url} onChange={handleChangeUrl} />
      <Input placeholder="歌曲封面链接 (可空)" value={state.attributes?.music?.cover} onChange={handleChangeCover} />
    </SidebarCollapse>
  )
}
