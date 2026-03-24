import {
  LoadingOutlined,
  MutedOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import ReactPlayer from "react-player";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useStateContext as useAudioStateContext } from "@/src/stores/audio";

export default function VideoPlayer({
  url,
  autoPlay = false,
}: {
  url: string
  autoPlay?: boolean
}) {
  const { state: audioState, dispatch } = useAudioStateContext()
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(autoPlay)
  const [controlsVisible, setControlsVisible] = useState(true)

  const controlsHideTimerRef = useRef<NodeJS.Timeout | null>(null)

  const scheduleControlsHide = useCallback(() => {
    if (controlsHideTimerRef.current) {
      clearTimeout(controlsHideTimerRef.current)
    }

    controlsHideTimerRef.current = setTimeout(() => {
      setControlsVisible(false)
    }, 5000)
  }, [])

  const showControls = useCallback(() => {
    setControlsVisible(true)
    scheduleControlsHide()
  }, [scheduleControlsHide])

  useEffect(() => {
    showControls()

    return () => {
      if (controlsHideTimerRef.current) {
        clearTimeout(controlsHideTimerRef.current)
      }
      controlsHideTimerRef.current = null
    }
  }, [showControls])

  const handleTogglePlay = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setPlaying((prev) => !prev)
    showControls()
  }

  const handleToggleMuted = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    dispatch({
      type: "SET_MUTED",
      muted: !audioState.muted,
    })
    showControls()
  }

  const controlsClassName = cn(
    "flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/75",
    controlsVisible
      ? "pointer-events-auto opacity-100"
      : "pointer-events-none opacity-0"
  )

  return (
    <div
      className="absolute inset-0 flex items-center justify-center text-white"
      onMouseEnter={showControls}
      onMouseLeave={() => setControlsVisible(false)}
      onMouseMove={showControls}
    >
      <ReactPlayer
        loop
        url={url}
        muted={audioState.muted}
        playing={playing}
        config={{
          file: {
            attributes: {
              playsInline: true,
              webkitplaysinline: "true",
              x5videoplayertype: "h5-page",
            },
          },
        }}
        onStart={() => setLoading(false)}
        className="absolute inset-0"
        width="100%"
        height="100%"
      />
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="pointer-events-auto absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3">
          <button
            aria-label={playing ? "Pause video" : "Play video"}
            className={controlsClassName}
            onClick={handleTogglePlay}
            type="button"
          >
            {playing ? <PauseOutlined /> : <PlayCircleOutlined />}
          </button>
          <button
            aria-label={audioState.muted ? "Unmute video" : "Mute video"}
            className={controlsClassName}
            onClick={handleToggleMuted}
            type="button"
          >
            {audioState.muted ? <MutedOutlined /> : <SoundOutlined />}
          </button>
        </div>
      </div>
      {loading ? (
        <LoadingOutlined className="pointer-events-none z-10 text-2xl drop-shadow-md" />
      ) : null}
    </div>
  );
}
