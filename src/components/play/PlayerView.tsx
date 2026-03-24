import { CaretRightFilled, LoadingOutlined, PauseOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { cn } from "@udecode/cn";
import { Howl } from "howler";
import { useEffect, useMemo, useRef, useState } from "react";

import { IMusicItem } from "@/src/components/editor/music";
import CONST from "@/src/configs/consts";
import { disposeHowler, useStateContext } from "@/src/stores/audio.tsx";
import { getCurrentLyric, parseLrc } from "@/src/utils/lrcParser";

type IProps = Partial<IMusicItem> & {
  direction?: "col" | "row";
};

export default function MusicPlayerView(props: IProps) {
  const { dispatch } = useStateContext();

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLyric, setCurrentLyric] = useState("");

  const direction = props.direction ?? "row";

  const playerRef = useRef<Howl | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const lyricsRef = useRef<Array<{ time: number; text: string }>>([]);

  const updateProgress = () => {
    if (playerRef.current && playerRef.current.playing()) {
      const seek = playerRef.current.seek();
      const total = playerRef.current.duration();

      if (typeof seek === "number" && typeof total === "number") {
        setProgress(seek);
        setDuration(total);

        const lyric = getCurrentLyric(lyricsRef.current, seek);
        setCurrentLyric(lyric);
      }
    }
  };

  useEffect(() => {
    if (!props.lrc) {
      setCurrentLyric("");
      lyricsRef.current = [];
      return;
    }

    let cancelled = false;

    fetch(props.lrc)
      .then((res) => res.text())
      .then((lrcContent) => {
        if (cancelled) {
          return;
        }

        lyricsRef.current = parseLrc(lrcContent);
      })
      .catch((error) => {
        console.error("Failed to load lyrics:", error);
        lyricsRef.current = [];
      });

    return () => {
      cancelled = true;
    };
  }, [props.lrc]);

  useEffect(() => {
    if (!props.url) {
      if (playerRef.current) {
        dispatch({ type: "CLEAN_MATCH", howler: playerRef.current });
      }

      playerRef.current = null;
      setPlaying(false);
      setLoading(false);
      setProgress(0);
      setDuration(0);
      return;
    }

    let disposed = false;

    setLoading(true);
    setPlaying(false);
    setProgress(0);
    setDuration(0);
    setCurrentLyric("");

    const howler = new Howl({
      src: [props.url],
      volume: 1.0,
      loop: true,
      onplay() {
        setPlaying(true);
        if (progressRef.current) {
          clearInterval(progressRef.current);
        }
        progressRef.current = setInterval(updateProgress, 100);
      },
      onpause() {
        setPlaying(false);
        if (progressRef.current) {
          clearInterval(progressRef.current);
          progressRef.current = null;
        }
      },
      onstop() {
        setPlaying(false);
        if (progressRef.current) {
          clearInterval(progressRef.current);
          progressRef.current = null;
        }
        setProgress(0);
      },
      onend() {
        setProgress(0);
        setCurrentLyric("");
      },
    });

    dispatch({ type: "SET", howler });
    playerRef.current = howler;

    howler.once("load", () => {
      if (disposed) {
        return;
      }

      howler.play();
      setLoading(false);
      setDuration(howler.duration());
    });

    return () => {
      disposed = true;

      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }

      if (playerRef.current === howler) {
        playerRef.current = null;
      }

      disposeHowler(howler);
      dispatch({ type: "CLEAN_MATCH", howler });
    };
  }, [dispatch, props.url]);

  const togglePlay = () => {
    if (playerRef.current) {
      playerRef.current[playerRef.current.playing() ? "pause" : "play"]();
    }
  };

  const containerCss = useMemo(() => {
    const baseFlex = "flex justify-center items-center";
    const smallScreen = "flex-col space-y-4";
    const largeScreen = direction === "col" ? "lg:flex-col lg:space-y-4" : "lg:flex-row lg:space-x-12";

    return `${baseFlex} ${smallScreen} ${largeScreen} text-center`;
  }, [direction]);

  const leftCss = useMemo(() => {
    let css = "w-full max-w-[200px] ";

    if (direction === "row") {
      css += "lg:w-1/2 lg:max-w-[300px]";
    } else {
      css += "lg:w-full lg:max-w-[200px]";
    }

    css += " bg-[url('/images/decorate/player/record-border.png')] bg-cover bg-center bg-no-repeat";
    css += " rounded-full border-4 border-solid border-white/5";

    return css;
  }, [direction]);

  const rightCss = useMemo(() => {
    let css = "w-full max-w-[200px] space-y-4 items-center ";

    if (direction === "row") {
      css += "lg:w-1/2 lg:max-w-[300px]";
    } else {
      css += "lg:w-full lg:max-w-[200px]";
    }

    return css;
  }, [direction]);

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || loading || !duration) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    playerRef.current.seek(newTime);
    setProgress(newTime);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || Number.isNaN(seconds)) {
      return "0:00";
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("flex-1 w-full", containerCss)}>
      <div
        className={cn(
          "relative flex items-center justify-center aspect-square",
          "after:box-content",
          "after:content-[''] after:absolute after:rounded-full after:border-4 after:border-solid after:border-black",
          "after:w-2 after:h-2 after:bg-white after:top-1/2 after:left-1/2 after:translate-x-[-50%] after:translate-y-[-50%]",
          leftCss
        )}
      >
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
      <div className={cn("flex flex-col w-1/2", rightCss)}>
        <div className="flex flex-col space-y-2">
          <div className="text-lg font-bold">{props.name}</div>
          <div className="opacity-60 max-w-64 w-[2/3]">{props.singer}</div>
        </div>

        {currentLyric && <div className="w-full text-center text-sm opacity-90">{currentLyric}</div>}

        {!loading && (
          <div className="w-full space-y-1">
            <div
              className="relative h-2 bg-white/20 rounded-full cursor-pointer hover:bg-white/30 transition-colors"
              onClick={handleProgressClick}
            >
              <div
                className="absolute h-full bg-white rounded-full transition-all duration-100"
                style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        <Tooltip title={playing ? "暂停" : "播放"} placement="bottom">
          <button
            className="
              border-2 border-solid border-white
              bg-white/90 backdrop-blur-md rounded-full
              text-black flex items-center justify-center w-12 p-2
            "
            onClick={togglePlay}
          >
            {loading ? <LoadingOutlined /> : playing ? <PauseOutlined /> : <CaretRightFilled />}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
