import {
  CaretRightFilled,
  LoadingOutlined,
  MutedOutlined,
  PauseOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { cn } from '@udecode/cn';
import { Howl } from 'howler';
import Marquee from 'react-fast-marquee';
import { useEffect, useMemo, useRef, useState } from 'react';

import { IMusicItem } from '@/src/components/editor/music';
import CONST from '@/src/configs/consts';
import { disposeHowler, useStateContext as useAudioStateContext } from '@/src/stores/audio.tsx';
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';

function MomentAudioPlayer(props: Partial<IMusicItem>) {
  const { state: audioState, dispatch } = useAudioStateContext();

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const playerRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (!props.url) {
      if (playerRef.current) {
        dispatch({ type: 'CLEAN_MATCH', howler: playerRef.current });
      }

      playerRef.current = null;
      setPlaying(false);
      setLoading(false);
      return;
    }

    let disposed = false;

    setLoading(true);
    setPlaying(false);

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
      onstop() {
        setPlaying(false);
      },
    });

    dispatch({ type: 'SET', howler });
    playerRef.current = howler;

    howler.once('load', () => {
      if (disposed) {
        return;
      }

      howler.play();
      setLoading(false);
    });

    return () => {
      disposed = true;

      if (playerRef.current === howler) {
        playerRef.current = null;
      }

      disposeHowler(howler);
      dispatch({ type: 'CLEAN_MATCH', howler });
    };
  }, [dispatch, props.url]);

  const togglePlay = () => {
    if (playerRef.current) {
      playerRef.current[playerRef.current.playing() ? 'pause' : 'play']();
    }
  };

  const toggleMuted = () => {
    dispatch({
      type: 'SET_MUTED',
      muted: !audioState.muted,
    });
  };

  return (
    <div className="group/control flex items-center bg-white/90 rounded-full border-2 border-white space-x-1 p-1 shadow-lg transition-all">
      <Tooltip title={playing ? 'Pause' : 'Play'} placement="bottom">
        <div className="flex-shrink-0 relative">
          <img
            className={cn('w-8 h-8 rounded-full', loading ? 'animate-pulse' : '')}
            src={props.cover ?? CONST.LUTHER}
          />
          <button
            className="absolute top-0 left-0 size-full flex items-center justify-center rounded-full text-white hover:backdrop-blur-lg"
            onClick={togglePlay}
            type="button"
          >
            {loading ? <LoadingOutlined /> : playing ? <PauseOutlined /> : <CaretRightFilled />}
          </button>
        </div>
      </Tooltip>
      <div className="text-gray-500 max-w-32 w-[1/3] sm:max-w-48">
        <Marquee play={playing}>{`${props.name} - ${props.singer}`}</Marquee>
      </div>
      <Tooltip title={audioState.muted ? 'Unmute' : 'Mute'} placement="bottom">
        <button
          className="flex size-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-black/5 hover:text-black"
          onClick={toggleMuted}
          type="button"
        >
          {audioState.muted ? <MutedOutlined /> : <SoundOutlined />}
        </button>
      </Tooltip>
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
