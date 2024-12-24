import { MutedFilled, MutedOutlined } from '@ant-design/icons';
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import ReactPlayer from 'react-player';

export default function VideoPlayer({ url, autoPlay = false }: { url: string, autoPlay?: boolean }) {

  const [playing, setPlaying] = useState(autoPlay)
  const [muted, setMuted] = useState(true)

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 group/video">
      <ReactPlayer
        url={url}
        playing={playing}
        muted={muted}
        className="absolute top-0 left-0 bottom-0 right-0"
        width="100%"
        height="100%"
        loop
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center space-x-2">
        <button
          className="text-white/80 group-hover/video:opacity-100 opacity-0 transition-opacity"
          onClick={() => setPlaying(!playing)}
        >
          {
            playing ?
            <PauseIcon width="36" height="36" /> :
            <PlayIcon width="36" height="36" />
          }
        </button>
        <button
          className="text-white/80 group-hover/video:opacity-100 opacity-0 transition-opacity"
          onClick={() => setMuted(!muted)}
        >
          {
            muted ?
            <MutedFilled className="text-[36px]" width="36" height="36" /> :
            <MutedOutlined className="text-[36px]" width="36" height="36" />
          }
        </button>
      </div>
    </div>
  );
}