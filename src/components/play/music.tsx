import {
  CaretRightFilled,
  LoadingOutlined,
  MutedOutlined,
  PauseOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { cn } from "@udecode/cn";
import { Howl } from "howler";
import Marquee from "react-fast-marquee";
import { useEffect, useRef, useState } from "react";

import { IMusicItem } from "@/src/components/editor/music";
import CONST from "@/src/configs/consts";
import { disposeHowler, useStateContext } from "@/src/stores/audio.tsx";

type IProps = Partial<IMusicItem>;

export default function MusicPlayer(props: IProps) {
  const { state: audioState, dispatch } = useStateContext();

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const playerRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (!props.url) {
      if (playerRef.current) {
        dispatch({ type: "CLEAN_MATCH", howler: playerRef.current });
      }

      playerRef.current = null;
      setPlaying(false);
      setLoading(false);
      return;
    }

    let disposed = false;

    setLoading(true);
    setPlaying(false);

    const howler = new Howl({
      src: [props.url],
      volume: 1.0,
      loop: true,
      onplay() {
        setPlaying(true);
      },
      onpause() {
        setPlaying(false);
      },
      onstop() {
        setPlaying(false);
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
    });

    return () => {
      disposed = true;

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

  const toggleMuted = () => {
    dispatch({
      type: "SET_MUTED",
      muted: !audioState.muted,
    });
  };

  return (
    <div className="flex items-center justify-between border-b px-3 py-2 space-x-2">
      <div className="flex items-center space-x-2 w-full">
        <img
          className={cn("w-6 h-6 rounded", loading ? "animate-pulse" : "")}
          src={props.cover ?? CONST.LUTHER}
        />
        <div className="text-gray-500 max-w-64 w-[2/3]">
          <Marquee play={playing}>{`${props.name} - ${props.singer}`}</Marquee>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Tooltip title={audioState.muted ? "Unmute" : "Mute"} placement="bottom">
          <button
            className="flex items-center justify-center text-gray-500 transition-colors hover:text-black"
            onClick={toggleMuted}
            type="button"
          >
            {audioState.muted ? <MutedOutlined /> : <SoundOutlined />}
          </button>
        </Tooltip>
        <Tooltip title={playing ? "Pause" : "Play"} placement="bottom">
          <button
            className="flex items-center justify-center text-gray-500 transition-colors hover:text-black"
            onClick={togglePlay}
            type="button"
          >
            {loading ? <LoadingOutlined /> : playing ? <PauseOutlined /> : <CaretRightFilled />}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
