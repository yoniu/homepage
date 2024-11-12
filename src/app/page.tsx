"use client";

import { GraphQLClient, ClientContext } from 'graphql-hooks'

import { Separator } from "@/components/ui/separator"

import Articles from "@/src/components/articles"
import Friends from "@/src/components/friends"
import { StateProvider as PlayerStateProvider } from '@/src/stores/audio';
import Player from '../components/play/player';
import { useState } from 'react';

const client = new GraphQLClient({
  url: 'https://gql.hashnode.com'
})

export default function Page() {

  const [play, setPlay] = useState({
    url: "https://freetyst.nf.migu.cn/public%2Fproduct9th%2Fproduct45%2F2022%2F08%2F0520%2F2018%E5%B9%B411%E6%9C%8807%E6%97%A515%E7%82%B910%E5%88%86%E6%89%B9%E9%87%8F%E9%A1%B9%E7%9B%AESONY100%E9%A6%96-2%2F%E5%85%A8%E6%9B%B2%E8%AF%95%E5%90%AC%2FMp3_64_22_16%2F6005970YTPX204044.mp3?Key=c3c46990dc4ac321&Tim=1730354565790&channelid=01&msisdn=25955c9422344dc7abe5a4bf2a4318b9",
    name: 'if i was the one',
    singer: 'luther vandross',
    avatar: "https://p2.music.126.net/cPyfIo_ZV6lfQnZa7J-HOg==/109951165991680568.jpg"
  })

  const handlePrev = () => {
    setPlay({
      url: "https://dlink.host/1drv/aHR0cHM6Ly8xZHJ2Lm1zL3UvYy80MTcwYjhlN2MxYTIwMDFhL0VRZ2F0LWFGQTNsRmpQMXF5QW9sY19BQmUtWklEY21BV0VXekp5b09nWlUzWmc_ZT1UcHVWWVo.mp3",
      name: 'I\'d give anything',
      singer: 'gerald',
      avatar: "https://mcontent.migu.cn/newlv2/new/album/20230509/1001552177/s_S67S8S1OGRDD3nFC.jpg"
    })
  }

  const handleNext = () => {
    setPlay({
      url: "https://freetyst.nf.migu.cn/public%2Fproduct9th%2Fproduct45%2F2022%2F08%2F0520%2F2018%E5%B9%B411%E6%9C%8807%E6%97%A515%E7%82%B910%E5%88%86%E6%89%B9%E9%87%8F%E9%A1%B9%E7%9B%AESONY100%E9%A6%96-2%2F%E5%85%A8%E6%9B%B2%E8%AF%95%E5%90%AC%2FMp3_64_22_16%2F6005970YTPX204044.mp3?Key=c3c46990dc4ac321&Tim=1730354565790&channelid=01&msisdn=25955c9422344dc7abe5a4bf2a4318b9",
      name: 'if i was the one',
      singer: 'luther vandross',
      avatar: "https://p2.music.126.net/cPyfIo_ZV6lfQnZa7J-HOg==/109951165991680568.jpg"
    })
  }

  return (
    <PlayerStateProvider>
      <ClientContext.Provider value={client}>
        <Player url={play.url} name={play.name} singer={play.singer} avatar={play.avatar} />
        <div className='flex items-center justify-between my-2'>
          <button className='border-red-950 border-2 px-2 py-1 rounded-md text-xs' onClick={handlePrev}>Prev</button>
          <button className='border-red-950 border-2 px-2 py-1 rounded-md text-xs' onClick={handleNext}>Next</button>
        </div>
        <Articles />
        <Separator className="my-4" />
        <Friends />
      </ClientContext.Provider>
    </PlayerStateProvider>
  )
}
