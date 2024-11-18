import { useStateContext } from "@/src/stores/audio.tsx"
import { useEffect, useState } from "react"
import { Howl } from 'howler';
import { IMusicItem } from "@/src/components/editor/music";
import CONST from "@/src/configs/consts";
import { CaretRightFilled, PauseOutlined } from "@ant-design/icons";
import Marquee from "react-fast-marquee";
import { Tooltip } from "antd";

interface IProps extends IMusicItem {}

export default function MusicPlayer(props: IProps) {
  const {state, dispatch} = useStateContext()

  const [playing, setPlaying] = useState(false)

  // todo: 这里可能由于 howler 的 once 是异步方法，不能自动播放音乐
  useEffect(() => {
    if (!props.url) return;
    dispatch({type: 'CLEAN'})
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
    <div className="flex items-center justify-between px-3 py-2 border-b space-x-2">
      <div className="flex items-center space-x-2 w-full">
        <img className="w-6 h-6 rounded" src={props.cover ?? CONST.LUTHER} />
        <div className="text-gray-500 max-w-64 w-[2/3]">
          <Marquee play={playing}>
            { `${props.name} - ${props.singer}` }
          </Marquee>
        </div>
      </div>
      <Tooltip title={ playing ? '暂停' : '播放' } placement="bottom">
        <button onClick={togglePlay}>
            { playing ? <PauseOutlined /> : <CaretRightFilled /> }
        </button>
      </Tooltip>
    </div>
  )
}
