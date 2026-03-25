"use client";

import { Spin } from "antd";
import { Suspense } from "react";

import Menu from "@/src/components/menu/Index";
import MomentDetailControls from "@/src/features/moment/components/detail/MomentDetailControls";
import MomentFeedLoading from "@/src/features/moment/components/feed/MomentFeedLoading";
import ImageMomentPanel from "@/src/features/moment/components/feed/renderers/ImageMomentPanel";
import MusicMomentPanel from "@/src/features/moment/components/feed/renderers/MusicMomentPanel";
import TextMomentPanel from "@/src/features/moment/components/feed/renderers/TextMomentPanel";
import VideoMomentPanel from "@/src/features/moment/components/feed/renderers/VideoMomentPanel";
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

  const displayer: Record<EMomentType, () => React.JSX.Element> = {
    text: () => item ? <TextMomentPanel key={item.id} item={item} /> : <></>,
    image: () => item ? <ImageMomentPanel key={item.id} item={item} /> : <></>,
    video: () => item ? <VideoMomentPanel key={item.id} item={item} /> : <></>,
    live: () => item ? <div key={item.id}>live</div> : <></>,
    music: () => item ? <MusicMomentPanel key={item.id} item={item} /> : <></>,
  }

  return (
    <>
      <div className="absolute h-full w-full flex items-stretch overflow-hidden">
        <Menu />
        <div className="relative w-full sm:w-[80%] h-full">
          <Spin spinning={loading} fullscreen={true} />
          <div className="relative w-full h-full overflow-hidden">
            {item && (
              <div className="absolute top-0 left-0 w-full py-4 z-20">
                <MomentDetailControls item={item} />
              </div>
            )}
            <div className="header-filter absolute w-full h-24 top-0 left-0 bg-white/10 backdrop-blur-xl z-10"></div>
            <div id="content" className="relative w-full h-full">
              {!item ? <MomentFeedLoading /> : displayer[currentMomentType]()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
