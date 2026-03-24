"use client";

import MomentLoading from './Loading';
import MomentControl from './Control';

import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { useMemo } from 'react';
import TextItem from '@/src/components/moments/v2/center/text';
import ImageItem from '@/src/components/moments/v2/center/image';
import VideoItem from '@/src/components/moments/v2/center/video';
import MusicItem from '@/src/components/moments/v2/center/music';

export default function MomentsTiktok() {

  const { state }  = useMomentStateContext();
  const currentMoment = state.momentList[state.currentIndex] ?? null;

  const displayer: Record<EMomentType, (key: number) => JSX.Element> = {
    text: (key) => currentMoment ? <TextItem key={key} item={currentMoment} /> : <></>,
    image: (key) => currentMoment ? <ImageItem key={key} item={currentMoment} /> : <></>,
    video: (key) => currentMoment ? <VideoItem key={key} item={currentMoment} /> : <></>,
    live: (key) => <div key={key}>live</div>,
    music: (key) => currentMoment ? <MusicItem key={key} item={currentMoment} /> : <></>,
  }

  const currentMomentType = useMemo<EMomentType>(() => {
    if (currentMoment?.attributes?.type) {
      return currentMoment.attributes.type
    }
    return EMomentType.Text
  }, [currentMoment])

  return (
    <>
      <div className="absolute top-0 left-0 w-full py-4 z-20">
        <MomentControl key={currentMoment?.id} />
      </div>
      <div className="header-filter absolute w-full h-24 top-0 left-0 bg-white/10 backdrop-blur-xl z-10"></div>
      <div id="content" className="relative w-full h-full">
        { !currentMoment ? <MomentLoading /> : displayer[currentMomentType](currentMoment.id) }
      </div>
    </>
  )
}
