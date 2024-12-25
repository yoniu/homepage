import { LoadingOutlined, MutedOutlined, SoundOutlined } from '@ant-design/icons';
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
import ReactPlayer from 'react-player';

export default function VideoPlayer({ url, autoPlay = false }: { url: string, autoPlay?: boolean }) {

  const [loading, setLoading] = useState(true)

  const [playing, setPlaying] = useState(autoPlay)
  const [muted, setMuted] = useState(true)

  const handlePlay = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setPlaying(!playing)
  }

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center text-white group/video">
      {/* 播放器 */}
      <ReactPlayer
        loop
        url={url}
        muted={muted}
        playing={playing}
        config={{
          file: {
            attributes: {
              playsInline: true,        // iOS 内联播放
              webkitPlaysInline: true,  // 兼容 Safari
              x5VideoPlayerType: "h5-page", // 用于腾讯浏览器
            },
          },
        }}
        onStart={() => setLoading(false)}
        className="absolute top-0 left-0 bottom-0 right-0"
        width="100%"
        height="100%"
      />
      {/* 播放控制 */}
      <div className="absolute top-0 left-0 right-0 bottom-0 text-white p-3 flex items-start justify-between cursor-pointer" onClick={() => setMuted(!muted)}>
        <div
          className="w-[24px] h-[24px] flex items-center justify-center bg-black/20 rounded-full"
          onClick={handlePlay}
        >
          {
            playing ? <PauseIcon width="16" height="16" /> : <PlayIcon width="16" height="16" />
          }
        </div>
        {
          !muted ?
          <div className="w-[24px] h-[24px] flex items-center justify-center bg-black/20 rounded-full">
            <SoundOutlined />
          </div> :
          <div className="flex items-center space-x-2">
            <span className="opacity-80 drop-shadow-md">轻触视频播放声音</span>
            <div className="w-[24px] h-[24px] flex items-center justify-center bg-black/20 rounded-full">
              <MutedOutlined className="-m-3" />
            </div>
          </div>
        }
      </div>
      {/* 加载效果 */}
      { loading && <LoadingOutlined className="drop-shadow-md text-2xl" /> }
    </div>
  );
}
