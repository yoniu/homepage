import { useMemo } from "react";

import { ShowMusicPlainContent } from "@/src/components/editor/plainContent";
import {
  DecorativeMusicBackgroundIcons,
  getMusicBackgroundIconEntries,
  getMusicMomentBackground,
  getMusicMomentTextColor,
} from "@/src/components/music/DecorativeBackground";
import PlayerView from "@/src/components/play/PlayerView";
import { TMusicMomentAttributes } from "@/src/types/moments";

interface IProps {
  item: IMomentItem;
}

export default function MusicMomentPanel({ item }: IProps) {
  const musicAttributes = item.attributes as TMusicMomentAttributes;

  const textColor = useMemo(() => getMusicMomentTextColor(musicAttributes), [musicAttributes]);
  const background = useMemo(() => getMusicMomentBackground(musicAttributes), [musicAttributes]);
  const backgroundIconEntries = useMemo(() => getMusicBackgroundIconEntries(musicAttributes), [musicAttributes]);

  const name = useMemo(() => musicAttributes?.music?.name, [musicAttributes.music?.name]);
  const cover = useMemo(() => musicAttributes?.music?.cover, [musicAttributes.music?.cover]);
  const url = useMemo(() => musicAttributes?.music?.url, [musicAttributes.music?.url]);
  const singer = useMemo(() => musicAttributes?.music?.singer, [musicAttributes.music?.singer]);
  const lrc = useMemo(() => musicAttributes?.music?.lrc, [musicAttributes.music?.lrc]);

  return (
    <div
      className="absolute left-0 top-0 h-full w-full text-[var(--text-color)]"
      style={
        {
          background,
          "--text-color": textColor,
        } as React.CSSProperties
      }
    >
      <DecorativeMusicBackgroundIcons
        icons={backgroundIconEntries}
        seed={`moment-${item.id}`}
        color={textColor}
      />

      <div className="relative z-10 m-auto flex h-full w-full max-w-[960px] flex-col items-center justify-center overflow-hidden">
        <PlayerView
          name={name ?? ""}
          cover={cover ?? ""}
          url={url ?? ""}
          singer={singer ?? ""}
          lrc={lrc}
        />
        {item.content && (
          <ShowMusicPlainContent
            content={item.content}
            author={item.author.name}
            mail={item.author?.email}
            date={item.create_time}
          />
        )}
      </div>
    </div>
  );
}
