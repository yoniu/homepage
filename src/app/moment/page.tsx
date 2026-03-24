"use client";

import { Spin } from "antd";
import { Suspense } from "react";

import Sidebar from "@/src/components/sidebar"
import ImageItem from '@/src/components/moments/item/image';
import TextItem from '@/src/components/moments/item/text';
import VideoItem from '@/src/components/moments/item/video';
import MusicMomentPanel from "@/src/features/moment/components/feed/renderers/MusicMomentPanel";
import { useMomentDetail } from "@/src/features/moment/hooks/useMomentDetail";
import type { EMomentType } from '@/src/types/moment';

export default function Page() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Moment />
    </Suspense>
  )
}

function Moment() {
  const { currentMomentType, item, loading } = useMomentDetail()

  const displayer: Record<EMomentType, () => JSX.Element> = {
    text: () => item ? <TextItem key={item.id} item={item} /> : <></>,
    image: () => item ? <ImageItem key={item.id} item={item} /> : <></>,
    video: () => item ? <VideoItem key={item.id} item={item} /> : <></>,
    live: () => item ? <div key={item.id}>live</div> : <></>,
    music: () => item ? <MusicMomentPanel key={item.id} item={item} /> : <></>,
  }

  return (
    <>
      <Spin spinning={loading} fullscreen={true} />
      <div id="main">
        <div id="content" className="relative flex items-center justify-center w-full h-full shadow-lg border rounded bg-white overflow-hidden">
          {
            item ? displayer[currentMomentType]() : <></>
          }
        </div>
      </div>
      <div id="sidebar">
        <Sidebar />
      </div>
    </>
  )
}
