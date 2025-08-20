import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { useStateContext } from "@/src/stores/audio.tsx";
import { useMemo, useRef, useState, useEffect } from 'react';
import { Howl } from 'howler';
import { IMusicItem } from "@/src/components/editor/music";
import CONST from "@/src/configs/consts";
import { CaretRightFilled, LoadingOutlined, PauseOutlined } from "@ant-design/icons";
import Marquee from "react-fast-marquee";
import { Tooltip } from "antd";
import { cn } from "@udecode/cn";

function MusicPlayer(props: IMusicItem) {
  const {state, dispatch} = useStateContext()

  const [playing, setPlaying] = useState(false)

  const [loading, setLoading] = useState(true)

  const playerRef = useRef<Howl | null>(null)

  // todo: 这里可能由于 howler 的 once 是异步方法，不能自动播放音乐
  useEffect(() => {
    if (!props.url) return;
    dispatch({type: 'CLEAN'})
    if (playerRef.current) return dispatch({type: 'SET', howler: playerRef.current})
    setLoading(true)
    const howler = new Howl({
      src: [props.url],
      volume: 1.0,
      loop: true,
      onplay() {
        setPlaying(true)
      },
      onpause() {
        setPlaying(false)
      }
    });
    dispatch({type: 'SET', howler: howler})
    playerRef.current = howler
    howler.once('load', () => {
      // 播放音频
      howler.play();
      setLoading(false)
    })

    return () => {
      dispatch({type: 'CLEAN'})
    }
  }, [])

  const togglePlay = () => {
    if (state.howler) {
      state.howler[state.howler.playing() ? 'pause' : 'play']()
    }
  }

  return (
    <div className="group/control flex items-center bg-white/90 rounded-full border-2 border-white space-x-1 p-1 shadow-lg transition-all">
      <Tooltip title={ playing ? '暂停' : '播放' } placement="bottom">
        <div className="relative">
          <img
            className={cn("w-8 h-8 rounded-full", loading ? "animate-pulse" : "")}
            src={props.cover ?? CONST.LUTHER}
          />
          <button className="absolute top-0 left-0 size-full flex items-center justify-center text-white hover:backdrop-blur-lg rounded-full" onClick={togglePlay}>
            {
              loading ?
              <LoadingOutlined /> :
              playing ? <PauseOutlined /> : <CaretRightFilled />
            }
          </button>
        </div>
      </Tooltip>
      <div className="text-gray-500 max-w-48 w-[1/3]">
        <Marquee play={playing}>
          { `${props.name} - ${props.singer}` }
        </Marquee>
      </div>
    </div>
  )
}

export default function MusicControl() {

  const { state: momentState }  = useMomentStateContext();
  
  /**
   * 当前 moment
   */
  const currentMoment = useMemo(() => {
    if (momentState.momentList && momentState.momentList[momentState.currentIndex]) {
      return momentState.momentList[momentState.currentIndex]
    }
    return null
  }, [momentState.momentList[momentState.currentIndex]])

  /**
   * 当前 moment 是否有音乐
   */
  const hasMusic = useMemo(() => {
    return currentMoment && currentMoment.attributes && currentMoment.attributes.music
  }, [currentMoment])
  
  return (
    <>
      {
        (!currentMoment || !hasMusic) ? null : (
          <MusicPlayer key={currentMoment.id} {...currentMoment.attributes.music} />
        )
      }
    </>
  )
}