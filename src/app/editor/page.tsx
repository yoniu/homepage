"use client";

import { Suspense } from 'react';
import { Spin } from 'antd';

import TextEditor from '@/src/components/editor/text';
import EditorSidebar from '@/src/components/sidebar/editor';
import ImageEditor from '@/src/components/editor/image';
import VideoEditor from '@/src/components/editor/video';
import MusicEditor from '@/src/components/editor/music/index';
import { useEditorInit } from '@/src/features/editor/hooks/useEditorInit';
import { useStateContext as useEditorStateContext } from '@/src/stores/editor';

export default function Page() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Editor />
    </Suspense>
  )
}

function Editor() {
  const { state } = useEditorStateContext()
  const { loading } = useEditorInit()

  const editors: Record<EMomentType, JSX.Element> = {
    text: <TextEditor />,
    image: <ImageEditor />,
    video: <VideoEditor />,
    live: <TextEditor />,
    music: <MusicEditor />,
  }

  return (
    <>
      <Spin spinning={loading} fullscreen={true} />
      <div id="main">
        <div className="relative flex flex-col w-full h-full">
          {
            (state.attributes && state.attributes.type) ?
            editors[state.attributes.type as EMomentType] :
            editors.text
          }
        </div>
      </div>
      <div id="sidebar">
        <EditorSidebar />
      </div>
    </>
  )
}
