"use client";

import MomentLoading from '@/src/components/moments/item/loading';

import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { useMemo } from 'react';
import TextItem from '@/src/components/moments/item/text';
import ImageItem from '@/src/components/moments/item/image';
import VideoItem from '@/src/components/moments/item/video';

export default function MomentsTiktok() {

  const { state }  = useMomentStateContext();
  const currentMoment = state.momentList[state.currentIndex] ?? null;

  const displayer: Record<EMomentType, (key: number) => JSX.Element> = {
    text: (key) => currentMoment ? <TextItem key={key} item={currentMoment} /> : <></>,
    image: (key) => currentMoment ? <ImageItem key={key} item={currentMoment} /> : <></>,
    video: (key) => currentMoment ? <VideoItem key={key} item={currentMoment} /> : <></>,
    live: (key) => <div key={key}>live</div>,
    music: (key) => <div key={key}>music</div>,
  }

  const currentMomentType = useMemo<EMomentType>(() => {
    if (currentMoment?.attributes?.type) {
      return currentMoment.attributes.type
    }
    return EMomentType.Text
  }, [currentMoment])

  return (
    <>
      <div id="content" className="relative flex items-center justify-center w-full h-full shadow-lg border rounded bg-white overflow-hidden">
        { !currentMoment ? <MomentLoading /> : displayer[currentMomentType](currentMoment.id) }
      </div>
    </>
  )
}
