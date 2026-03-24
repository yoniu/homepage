"use client";

import { EditOutlined } from "@ant-design/icons";
import { App, Button, Input } from "antd";
import { useEffect, useMemo, useState } from "react";

import { IFixedTextItem, ShowFixedText } from "@/src/components/editor/fixedText";
import { ShowPlainContent } from "@/src/components/editor/plainContent";
import VideoPlayer from "@/src/components/play/video";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";

export default function VideoEditor() {
  const { state, dispatch } = useEditorStateContext();
  const { modal } = App.useApp();
  const attributes = state.attributes;

  const [bg, setBg] = useState("");

  useEffect(() => {
    const video = attributes?.video as IVideoItem | undefined;
    setBg(video?.cover ?? "");
  }, [attributes?.video]);

  const hasVideo = useMemo(() => {
    return Boolean(attributes?.video?.url);
  }, [attributes?.video?.url]);

  const hasFixedText = useMemo(() => {
    return Boolean(attributes?.fixedText?.length);
  }, [attributes?.fixedText]);

  const handleVideoSetting = (video?: Partial<IVideoItem>) => {
    if (!video) return;

    const prevAttributes = state.attributes ?? null;
    const prevVideo = (prevAttributes?.video as Partial<IVideoItem>) ?? {};

    dispatch({
      type: "UPDATE",
      states: {
        attributes: {
          ...prevAttributes,
          video: {
            ...prevVideo,
            url: video.url ?? prevVideo.url ?? "",
            cover: video.cover ?? prevVideo.cover ?? "",
          },
        },
      },
    });
  };

  const openVideoSetting = () => {
    modal.confirm({
      title: "设置视频",
      content: <UpdateVideoSetting video={attributes?.video as IVideoItem} onChange={handleVideoSetting} />,
    });
  };

  const handleClickVideoSetting = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    openVideoSetting();
  };

  return (
    <div
      className="absolute left-0 top-0 flex h-full w-full items-center justify-center overflow-hidden rounded-md border bg-black"
      onDoubleClick={openVideoSetting}
    >
      <div className="absolute right-3 top-3 z-20">
        <Button type="primary" size="small" icon={<EditOutlined />} onClick={handleClickVideoSetting}>
          编辑视频信息
        </Button>
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
        双击视频也可快速打开设置
      </div>
      {bg && <img src={bg} alt="background" className="absolute h-full w-full scale-125 transform object-cover blur" />}
      {hasVideo && attributes?.video?.url && <VideoPlayer url={attributes.video.url} />}
      {hasFixedText && <ShowFixedText fixedText={(attributes?.fixedText ?? []) as IFixedTextItem[]} />}
      {state.content && <ShowPlainContent content={state.content} />}
    </div>
  );
}

function UpdateVideoSetting({
  video,
  onChange,
}: {
  video?: Partial<IVideoItem>;
  onChange?: (video?: Partial<IVideoItem>) => void;
}) {
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ ...video, url: e.target.value });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ ...video, cover: e.target.value });
  };

  return (
    <div className="space-y-2">
      <Input addonBefore="视频 URL" value={video?.url} onChange={handleUrlChange} />
      <Input addonBefore="视频封面图" value={video?.cover} onChange={handleCoverChange} />
    </div>
  );
}
