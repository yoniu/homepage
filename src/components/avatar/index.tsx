import { useState } from "react"

import { Howl } from 'howler'

import { PlayIcon, PauseIcon } from "@radix-ui/react-icons"

export default function Avatar() {

  const [playing, setPlay] = useState(false)
  const mp3 = "https://freetyst.nf.migu.cn/public%2Fproduct9th%2Fproduct45%2F2022%2F08%2F0520%2F2018%E5%B9%B411%E6%9C%8807%E6%97%A515%E7%82%B910%E5%88%86%E6%89%B9%E9%87%8F%E9%A1%B9%E7%9B%AESONY100%E9%A6%96-2%2F%E5%85%A8%E6%9B%B2%E8%AF%95%E5%90%AC%2FMp3_64_22_16%2F6005970YTPX204044.mp3?Key=c3c46990dc4ac321&Tim=1730354565790&channelid=01&msisdn=25955c9422344dc7abe5a4bf2a4318b9"
  const playBtnClass = "text-white opacity-0 group-hover/item:opacity-100 transition-all translate-y-2 group-hover/item:translate-y-0 rounded-full"

  const sound = new Howl({
    src: [mp3],
    onplay() {
      setPlay(true)
    },
    onpause() {
      setPlay(false)
    },
    onend() {
      setPlay(false)
    }
  });

  const handlePlay = () => {
    if (playing) {
      sound.pause()
      setPlay(false)
    } else {
      sound.play()
      setPlay(true)
    }
  }

  const playEffectClassName = () => {
    const defaultClassName = "w-10 rounded"
    if (playing) {
      return defaultClassName
    } else {
      return defaultClassName + " animate-bounce-xs group-hover/player:animate-none transition-all"
    }
  }

  return (
    <>
      <div className="group/player relative leading-none">
        <img className={playEffectClassName()} src="https://p2.music.126.net/cPyfIo_ZV6lfQnZa7J-HOg==/109951165991680568.jpg" alt="yoniu" />
        {/* Player */}
        <div onClick={handlePlay} className="group/item absolute inset-0 flex items-center justify-center  cursor-pointer">
          { !playing && <PlayIcon className={playBtnClass} /> }
          { playing && <PauseIcon className={playBtnClass} /> }
        </div>
      </div>
    </>
  )
}
