import { PauseIcon, PlayIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import ReactPlayer from 'react-player';

export default function VideoPlayer({ url, autoPlay = false }: { url: string, autoPlay?: boolean }) {

  const [playing, setPlaying] = useState(autoPlay)

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 group/video">
      <ReactPlayer
        url={url}
        playing={playing}
        className="absolute top-0 left-0 bottom-0 right-0"
        width="100%"
        height="100%"
      />
      <button
        className="text-white/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover/video:opacity-100 opacity-0 transition-opacity"
        onClick={() => setPlaying(!playing)}
      >
        {
          playing ?
          <PauseIcon width="36" height="36" /> :
          <PlayIcon width="36" height="36" />
        }
      </button>
    </div>
  );
}