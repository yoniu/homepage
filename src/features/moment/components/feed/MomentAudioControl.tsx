import { CaretRightFilled, LoadingOutlined, PauseOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { cn } from '@udecode/cn';
import { Howl } from 'howler';
import Marquee from 'react-fast-marquee';
import { useEffect, useMemo, useRef, useState } from 'react';

import { IMusicItem } from '@/src/components/editor/music';
import CONST from '@/src/configs/consts';
import { useStateContext as useAudioStateContext } from '@/src/stores/audio.tsx';
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';

function MomentAudioPlayer(props: Partial<IMusicItem>) {
  const { state, dispatch } = useAudioStateContext();

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const playerRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (!props.url) {
      dispatch({ type: 'CLEAN' });
      playerRef.current = null;
      return;
    }

    dispatch({ type: 'CLEAN' });
    setLoading(true);

    const howler = new Howl({
      src: [props.url],
      volume: 1.0,
      loop: true,
      onplay() {
        setPlaying(true);
      },
      onpause() {
        setPlaying(false);
      },
    });

    dispatch({ type: 'SET', howler });
    playerRef.current = howler;

    howler.once('load', () => {
      howler.play();
      setLoading(false);
    });

    return () => {
      playerRef.current = null;
      dispatch({ type: 'CLEAN' });
    };
  }, [dispatch, props.url]);

  const togglePlay = () => {
    if (state.howler) {
      state.howler[state.howler.playing() ? 'pause' : 'play']();
    }
  };

  return (
    <div className="group/control flex items-center bg-white/90 rounded-full border-2 border-white space-x-1 p-1 shadow-lg transition-all">
      <Tooltip title={playing ? '暂停' : '播放'} placement="bottom">
        <div className="flex-shrink-0 relative">
          <img
            className={cn('w-8 h-8 rounded-full', loading ? 'animate-pulse' : '')}
            src={props.cover ?? CONST.LUTHER}
          />
          <button
            className="absolute top-0 left-0 size-full flex items-center justify-center text-white hover:backdrop-blur-lg rounded-full"
            onClick={togglePlay}
          >
            {loading ? <LoadingOutlined /> : playing ? <PauseOutlined /> : <CaretRightFilled />}
          </button>
        </div>
      </Tooltip>
      <div className="text-gray-500 max-w-32 w-[1/3] sm:max-w-48">
        <Marquee play={playing}>{`${props.name} - ${props.singer}`}</Marquee>
      </div>
    </div>
  );
}

export default function MomentAudioControl() {
  const { state: momentState } = useMomentStateContext();

  const currentMoment = useMemo(() => {
    return momentState.momentList[momentState.currentIndex] ?? null;
  }, [momentState.currentIndex, momentState.momentList]);

  const currentMusic = currentMoment?.attributes?.music;

  if (!currentMoment || !currentMusic) {
    return null;
  }

  return <MomentAudioPlayer key={currentMoment.id} {...currentMusic} />;
}
