"use client";

import MomentLoading from './Loading';
import MomentControl from './Control';

import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { useMemo } from 'react';
import TextItem from '@/src/components/moments/v2/center/text';
import ImageItem from '@/src/components/moments/v2/center/image';
import VideoItem from '@/src/components/moments/v2/center/video';

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
      <div className="absolute top-0 left-0 w-full py-4 z-20">
        <MomentControl key={currentMoment?.id} />
      </div>
      <div className="header-filter absolute w-full h-40 top-0 left-0 bg-white/10 backdrop-blur-xl z-10"></div>
      <div id="content" className="relative w-full h-full">
        { !currentMoment ? <MomentLoading /> : displayer[currentMomentType](currentMoment.id) }
      </div>
    </>
  )
}
