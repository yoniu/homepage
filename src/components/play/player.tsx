import { useStateContext } from "@/src/stores/audio.tsx"
import { useEffect, useState } from "react"
import { Howl } from 'howler';
import useIcon from '@/src/hooks/icon'

interface IProps {
  url: string;
  name: string;
  singer: string;
  avatar: string;
}

export default function Player(props: IProps) {
  const {state, dispatch} = useStateContext()
  const IconFont = useIcon()

  const [playing, setPlaying] = useState('yonghu')

  useEffect(() => {
    if (!props.url) return console.log('无 URL');
    console.log('url 改变')
    const howler = new Howl({
      src: [props.url],
      volume: 1.0,
      loop: true,
      onplay() {
        setPlaying('yonghufill')
      },
      onpause() {
        setPlaying('yonghu')
      }
    });
    dispatch({type: 'CLEAN'})
    dispatch({type: 'SET', howler: howler})
    howler.once('load', () => {
      console.log('加载完成开始播放')
      // 播放音频
      howler.play();
    })
  }, [dispatch, props.url, setPlaying])

  const togglePlay = () => {
    if (state.howler) {
      console.log(state.howler.playing())
      state.howler[state.howler.playing() ? 'pause' : 'play']()
    }
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <img src={props.avatar} alt={props.name} className="w-12 h-12 rounded-full mr-4" />
        <div className="flex flex-col">
          <span className="text-xs font-bold">{props.name}</span>
          <span className="text-xs text-gray-500">{props.singer}</span>
        </div>
      </div>
      <div className="">
        <IconFont className="text-lg cursor-pointer" type={`icon-${playing}`} onClick={togglePlay} />
      </div>
    </div>
  )
}
