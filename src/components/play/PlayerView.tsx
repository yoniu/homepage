import { useStateContext } from "@/src/stores/audio.tsx"
import { useEffect, useMemo, useRef, useState } from "react"
import { Howl } from 'howler';
import { IMusicItem } from "@/src/components/editor/music";
import CONST from "@/src/configs/consts";
import { CaretRightFilled, LoadingOutlined, PauseOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { cn } from "@udecode/cn";

type IProps = IMusicItem & {
  direction?: "col" | "row",
}

export default function MusicPlayerView(props: IProps) {
  const {dispatch} = useStateContext()

  const [playing, setPlaying] = useState(false)

  const [loading, setLoading] = useState(true)

  const [progress, setProgress] = useState(0)

  const [duration, setDuration] = useState(0)

  const direction = props.direction ?? "row"

  const playerRef = useRef<Howl | null>(null)

  const progressRef = useRef<NodeJS.Timeout | null>(null)

  // 更新进度
  const updateProgress = () => {
    if (playerRef.current && playerRef.current.playing()) {
      const seek = playerRef.current.seek();
      const duration = playerRef.current.duration();
      if (typeof seek === 'number' && typeof duration === 'number') {
        setProgress(seek);
        setDuration(duration);
      }
    }
  }

  // todo: 这里可能由于 howler 的 once 是异步方法，不能自动播放音乐
  useEffect(() => {
    if (!props.url) return;
    dispatch({type: 'CLEAN'})
    if (playerRef.current) return dispatch({type: 'SET', howler: playerRef.current})
    setLoading(true)
    const howler = new Howl({
      src: [props.url],
      volume: 1.0,
      loop: true,
      
      onplay() {
        setPlaying(true)
        // 开始进度更新
        if (progressRef.current) clearInterval(progressRef.current);
        progressRef.current = setInterval(updateProgress, 100);
      },
      onpause() {
        setPlaying(false)
        // 暂停时清除进度更新
        if (progressRef.current) {
          clearInterval(progressRef.current);
          progressRef.current = null;
        }
      },
      onend() {
        // 循环播放时重置进度
        setProgress(0);
      }
    });
    dispatch({type: 'SET', howler: howler})
    playerRef.current = howler
    howler.once('load', () => {
      // 播放音频
      howler.play();
      setLoading(false)
      // 获取时长
      setDuration(howler.duration());
    })

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
      dispatch({type: 'CLEAN'})
    }
  }, [])

  const togglePlay = () => {
    if (playerRef.current) {
      playerRef.current[playerRef.current.playing() ? 'pause' : 'play']()
    }
  }

  // 容器样式
  const containerCss = useMemo(() => {
    if (direction === "row") {
      return "flex items-center space-x-4 justify-center"
    } else {
      return "flex flex-col items-center space-y-4 text-center justify-center"
    }
  }, [direction])

  // 左侧样式
  const leftCss = useMemo(() => {
    let css = ""
    if (direction === "row") {
      css += " w-1/2"
    } else {
      css += " w-full max-w-[200px]"
    }
    css += " bg-[url('/images/decorate/player/record-border.png')] bg-cover bg-center bg-no-repeat"
    css += " rounded-full border-4 border-solid border-white/5"
    return css
  }, [direction])

  // 进度条点击处理
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || loading) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * duration;
    
    playerRef.current.seek(newTime);
    setProgress(newTime);
  }

  // 格式化时间
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <div className={cn('flex-1 w-full', containerCss)}>
      {/* 左侧 */}
      <div className={cn(
        "relative flex items-center justify-center aspect-square",
        "after:box-content",
        "after:content-[''] after:absolute after:rounded-full after:border-4 after:border-solid after:border-black",
        "after:w-2 after:h-2 after:bg-white after:top-1/2 after:left-1/2 after:translate-x-[-50%] after:translate-y-[-50%]",
        leftCss,
      )}>
        <img
          className={cn(
            "relative w-[70%] aspect-square rounded-full",
            "border-4 border-solid border-black",
            loading ? "animate-pulse" : "",
            playing ? "duration-3000 animate-[spin_5s_linear_infinite]" : ""
          )}
          src={props.cover ?? CONST.LUTHER}
        />
      </div>
      {/* 右侧 */}
      <div className={cn(
        "flex flex-col w-1/2",
        containerCss,
      )}>
        {/* 歌曲信息 */}
        <div className="flex flex-col space-y-2">
          <div className="text-lg font-bold">
            { props.name }
          </div>
          <div className="opacity-60 max-w-64 w-[2/3]">
            { props.singer }
          </div>
        </div>
        
        {/* 进度条 - 在播放按钮上方 */}
        {!loading && (
          <div className="w-full space-y-1">
            <div 
              className="relative h-2 bg-white/20 rounded-full cursor-pointer hover:bg-white/30 transition-colors"
              onClick={handleProgressClick}
            >
              <div 
                className="absolute h-full bg-white rounded-full transition-all duration-100"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
        
        {/* 播放按钮 */}
        <Tooltip title={ playing ? '暂停' : '播放' } placement="bottom">
          <button
            className="
              border-2 border-solid border-white
              bg-white/90 backdrop-blur-md rounded-full
              text-black flex items-center justify-center w-12 p-2 
            "
            onClick={togglePlay}
          >
              {
                loading ?
                <LoadingOutlined /> :
                playing ? <PauseOutlined /> : <CaretRightFilled />
              }
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
