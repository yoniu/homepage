"use client";

import MomentLoading from '@/src/components/moments/item/loading';

import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { useMemo } from 'react';
import TextItem from '@/src/components/moments/item/text';
import ImageItem from '@/src/components/moments/item/image';
import VideoItem from '@/src/components/moments/item/video';

export default function MomentsTiktok() {

  const { state }  = useMomentStateContext();

  const displayer: Record<EMomentType, (key: number) => JSX.Element> = {
    text: (key) => <TextItem key={key} item={state.momentList[state.currentIndex]} />,
    image: (key) => <ImageItem key={key} item={state.momentList[state.currentIndex]} />,
    video: (key) => <VideoItem key={key} item={state.momentList[state.currentIndex]} />,
    live: (key) => <div key={key}>live</div>,
  }

  const currentMomentType = useMemo<EMomentType>(() => {
    if (state.momentList[state.currentIndex] && state.momentList[state.currentIndex].attributes && state.momentList[state.currentIndex].attributes.type) {
      return state.momentList[state.currentIndex].attributes.type
    }
    return 'text'
  }, [state.momentList[state.currentIndex]])

  const currentMoment = useMemo(() => {
    if (state.momentList && state.momentList[state.currentIndex]) {
      return state.momentList[state.currentIndex]
    }
    return null
  }, [state.momentList[state.currentIndex]])

  return (
    <>
      <div id="content" className="relative flex items-center justify-center w-full h-full shadow-lg border rounded bg-white overflow-hidden">
        { !currentMoment ? <MomentLoading /> : displayer[currentMomentType](currentMoment.id) }
      </div>
    </>
  )
}
