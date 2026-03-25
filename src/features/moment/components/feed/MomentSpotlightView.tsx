"use client";

import { useMemo } from 'react';

import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { EMomentType, type EMomentType as TMomentType } from '@/src/types/moment';

import MomentFeedControls from './MomentFeedControls';
import MomentFeedLoading from './MomentFeedLoading';
import ImageMomentPanel from './renderers/ImageMomentPanel';
import MusicMomentPanel from './renderers/MusicMomentPanel';
import TextMomentPanel from './renderers/TextMomentPanel';
import VideoMomentPanel from './renderers/VideoMomentPanel';

export default function MomentSpotlightView() {
  const { state } = useMomentStateContext();
  const currentMoment = state.momentList[state.currentIndex] ?? null;

  const displayer: Record<TMomentType, (key: number) => React.JSX.Element> = {
    text: (key) => (currentMoment ? <TextMomentPanel key={key} item={currentMoment} /> : <></>),
    image: (key) => (currentMoment ? <ImageMomentPanel key={key} item={currentMoment} /> : <></>),
    video: (key) => (currentMoment ? <VideoMomentPanel key={key} item={currentMoment} /> : <></>),
    live: (key) => <div key={key}>live</div>,
    music: (key) => (currentMoment ? <MusicMomentPanel key={key} item={currentMoment} /> : <></>),
  };

  const currentMomentType = useMemo<TMomentType>(() => {
    if (currentMoment?.attributes?.type) {
      return currentMoment.attributes.type;
    }

    return EMomentType.Text;
  }, [currentMoment]);

  return (
    <>
      <div className="absolute top-0 left-0 w-full py-4 z-20">
        <MomentFeedControls key={currentMoment?.id} />
      </div>
      <div className="header-filter absolute w-full h-24 top-0 left-0 bg-white/10 backdrop-blur-xl z-10"></div>
      <div id="content" className="relative w-full h-full">
        {!currentMoment ? <MomentFeedLoading /> : displayer[currentMomentType](currentMoment.id)}
      </div>
    </>
  );
}
