"use client";

import { useStateContext as useEditorStateContext } from "@/src/stores/editor"
import { useEffect, useMemo, useState } from "react";
import { ShowPlainContent } from "@/src/components/editor/plainContent";
import { IFixedTextItem, ShowFixedText } from "@/src/components/editor/fixedText";
import VideoPlayer from "@/src/components/play/video";
import { App, Input } from "antd";

export default function VideoEditor() {

  const { state, dispatch } = useEditorStateContext() 
  const { modal } = App.useApp()

  const [bg, setBg] = useState('')

  useEffect(() => {
    if (state.attributes && state.attributes.video) {
      const video = state.attributes.video as IVideoItem;
      if (video && video.cover) setBg(video.cover)
    }
  }, [state.attributes, state.attributes?.video, state.attributes.video?.cover])

  const hasVideo = useMemo(() => {
    return state.attributes && state.attributes.video && state.attributes.video.url
  }, [state.attributes])

  const hasFixedText = useMemo(() => {
    return state.attributes && state.attributes.fixedText && state.attributes.fixedText.length
  }, [state.attributes])

  const handleVideoSetting = (video?: Partial<IVideoItem>) => {
    if (!video) return;
    const prevAttributes = state.attributes ?? null;
    const prevVideo = prevAttributes?.video as IVideoItem ?? {};
    prevVideo.url = video.url ?? "";
    prevVideo.cover = video.cover ?? "";
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        video: prevVideo
      }
    }});
  }

  const handleDoubleClick = () => {
    modal.confirm({
      title: '设置视频',
      content: <UpdateVideoSetting video={state.attributes?.video as IVideoItem} onChange={handleVideoSetting} />,
    })
  }

  return (
    <>
      <div
        className="absolute left-0 top-0 w-full h-full rounded-md border bg-black overflow-hidden flex items-center justify-center"
        onDoubleClick={handleDoubleClick}
      >
        { bg && <img src={bg} alt="background" className="absolute w-full h-full object-cover transform scale-125 blur" /> }
        { hasVideo && <VideoPlayer url={state.attributes.video.url} /> }
        {
          hasFixedText && <ShowFixedText fixedText={state.attributes.fixedText as IFixedTextItem[]} />
        }
        { state.content && <ShowPlainContent content={state.content} /> }
      </div>
    </>
  )
}

function UpdateVideoSetting({ video, onChange }: { video?: IVideoItem, onChange?: (video?: Partial<IVideoItem>) => void }) {

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ ...video, url: e.target.value })
  }
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ ...video, cover: e.target.value })
  }

  return (
    <div className="space-y-2">
      <Input addonBefore="视频 URL" value={video?.url} onChange={handleUrlChange} />
      <Input addonBefore="视频封面图" value={video?.cover} onChange={handleCoverChange} />
    </div>
  )
}
