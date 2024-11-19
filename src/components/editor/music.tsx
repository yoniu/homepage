"use client";

import { App, Button, Input } from "antd";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import SidebarCollapse from "@/src/components/editor/collapse";
import Meting, { TMetingResponse } from "@/src/components/meting";
import { useRef } from "react";

export interface IMusicItem {
  name: string;
  singer: string;
  url: string;
  cover?: string;
}

export default function EditorMusic() {

  const { modal } = App.useApp()

  const { state, dispatch } = useEditorStateContext();

  const modalRef = useRef<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string, type: string) => {
    const prevAttributes = state.attributes ?? null;
    const prevMusic = prevAttributes?.music ?? null;
    const music = {
      ...prevMusic,
      [type]: (typeof e === 'string') ? e : e.target.value
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

  const handleMetingSubmit = (meting: TMetingResponse) => {
    const prevAttributes = state.attributes ?? null;
    const music = {
      name: meting.name,
      singer: meting.artist,
      url: meting.url,
      cover: meting.pic,
    }
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        music
      }
    }});
    modalRef.current?.destroy();
  }

  const handleClickApiQuery = () => {
    modalRef.current = modal.info({
      title: "获取音乐信息",
      centered: true,
      content: <Meting onSubmit={handleMetingSubmit} />,
      okText: "插入",
      cancelText: "取消",
      closable: true,
      footer: null,
    })
  }
  
  return (
    <SidebarCollapse title="背景音乐" className="space-y-1">
      <Input placeholder="歌曲名称" value={state.attributes?.music?.name} onChange={handleChangeName} />
      <Input placeholder="歌手名称" value={state.attributes?.music?.singer} onChange={handleChangeSinger} />
      <Input placeholder="歌曲链接" value={state.attributes?.music?.url} onChange={handleChangeUrl} />
      <Input placeholder="歌曲封面链接 (可空)" value={state.attributes?.music?.cover} onChange={handleChangeCover} />
      <div className="flex w-full items-center justify-end">
        <Button onClick={handleClickApiQuery}>API 获取</Button>
      </div>
    </SidebarCollapse>
  )
}
