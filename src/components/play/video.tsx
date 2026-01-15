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
              playsInline: true,        // iOS 内联播放 (标准属性用布尔值)
              webkitplaysinline: "true",  // 兼容 Safari (非标准属性用小写字符串)
              x5videoplayertype: "h5-page", // 用于腾讯浏览器 (非标准属性用小写字符串)
            },
          },
        }}
        onStart={() => setLoading(false)}
        className="absolute top-0 left-0 bottom-0 right-0"
        width="100%"
        height="100%"
      />
      {/* 播放控制 */}
      <div className="absolute top-0 left-0 right-0 bottom-0 text-white p-3 flex items-center justify-center space-x-3 cursor-pointer opacity-0 hover:opacity-100 transition-all" onClick={() => setMuted(!muted)}>
        <div
          className="w-[48px] h-[48px] flex items-center justify-center bg-black/50 rounded-full"
          onClick={handlePlay}
        >
          {
            playing ? <PauseIcon width="24" height="24" /> : <PlayIcon width="24" height="24" />
          }
        </div>
        {
          !muted ?
          <div className="w-[48px] h-[48px] flex items-center justify-center bg-black/50 rounded-full">
            <SoundOutlined width="24" height="24" />
          </div> :
          <div className="flex items-center space-x-2">
            <div className="w-[48px] h-[48px] flex items-center justify-center bg-black/50 rounded-full">
              <MutedOutlined className="-m-3" width="24" height="24" />
            </div>
          </div>
        }
      </div>
      {/* 加载效果 */}
      { loading && <LoadingOutlined className="drop-shadow-md text-2xl" /> }
    </div>
  );
}
