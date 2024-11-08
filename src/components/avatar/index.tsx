"use client";

import { useEffect, useRef, useState } from "react"

import { Howl } from 'howler'

import { PlayIcon, PauseIcon } from "@radix-ui/react-icons"

export default function Avatar() {

  const [playing, setPlay] = useState(false)
  const [loading, setLoading] = useState(true)
  //const mp3 = "https://freetyst.nf.migu.cn/public%2Fproduct9th%2Fproduct45%2F2022%2F08%2F0520%2F2018%E5%B9%B411%E6%9C%8807%E6%97%A515%E7%82%B910%E5%88%86%E6%89%B9%E9%87%8F%E9%A1%B9%E7%9B%AESONY100%E9%A6%96-2%2F%E5%85%A8%E6%9B%B2%E8%AF%95%E5%90%AC%2FMp3_64_22_16%2F6005970YTPX204044.mp3?Key=c3c46990dc4ac321&Tim=1730354565790&channelid=01&msisdn=25955c9422344dc7abe5a4bf2a4318b9"
  const mp3 = "https://dlink.host/1drv/aHR0cHM6Ly8xZHJ2Lm1zL3UvYy80MTcwYjhlN2MxYTIwMDFhL0VRZ2F0LWFGQTNsRmpQMXF5QW9sY19BQmUtWklEY21BV0VXekp5b09nWlUzWmc_ZT1UcHVWWVo.mp3"
  const playBtnClass = "text-white opacity-0 group-hover/item:opacity-100 transition-all translate-y-2 group-hover/item:translate-y-0 rounded-full"

  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [mp3],
      volume: 1.0,
      onload: () => {
        setLoading(false)
      },
      onend() {
        setPlay(false)
      },
    });

    return () => {
      if (soundRef.current) {
        soundRef.current?.stop()
      }
    };
  }, []);

  const handlePlay = () => {
    if (loading) return
    if (!playing) {
      soundRef.current?.play();
      setPlay(true)
    } else {
      soundRef.current?.pause();
      setPlay(false)
    }
  }

  const playEffectClassName = () => {
    const defaultClassName = "w-10 rounded"
    if (loading) return defaultClassName + " animate-pulse"
    if (playing) {
      return defaultClassName
    } else {
      return defaultClassName + " animate-bounce-xs group-hover/player:animate-none transition-all"
    }
  }

  return (
    <>
      <div className="group/player relative leading-none">
        <img className={playEffectClassName()} src="https://mcontent.migu.cn/newlv2/new/album/20230509/1001552177/s_S67S8S1OGRDD3nFC.jpg" alt="yoniu" />
        {/* Player */}
        <div onClick={handlePlay} className="group/item absolute inset-0 flex items-center justify-center  cursor-pointer">
          {!playing && <PlayIcon className={playBtnClass} />}
          {playing && <PauseIcon className={playBtnClass} />}
        </div>
      </div>
    </>
  )
}
