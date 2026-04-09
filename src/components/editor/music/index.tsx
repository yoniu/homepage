"use client";

import { useMemo } from "react";

import { ShowMusicPlainContent } from "@/src/components/editor/plainContent";
import {
  DecorativeMusicBackgroundIcons,
  getMusicBackgroundIconEntries,
  getMusicMomentBackground,
  getMusicMomentTextColor,
} from "@/src/components/music/DecorativeBackground";
import PlayerView from "@/src/components/play/PlayerView";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import { TMusicMomentAttributes } from "@/src/types/moments";

export default function MusicEditor() {
  const { state } = useEditorStateContext();
  const musicAttributes = state.attributes as TMusicMomentAttributes;

  const textColor = useMemo(() => getMusicMomentTextColor(musicAttributes), [musicAttributes]);
  const background = useMemo(() => getMusicMomentBackground(musicAttributes), [musicAttributes]);
  const backgroundIconEntries = useMemo(() => getMusicBackgroundIconEntries(musicAttributes), [musicAttributes]);

  const name = useMemo(() => musicAttributes?.music?.name, [musicAttributes.music?.name]);
  const cover = useMemo(() => musicAttributes?.music?.cover, [musicAttributes.music?.cover]);
  const url = useMemo(() => musicAttributes?.music?.url, [musicAttributes.music?.url]);
  const singer = useMemo(() => musicAttributes?.music?.singer, [musicAttributes.music?.singer]);

  const hasMusic = useMemo(() => Boolean(musicAttributes && name && cover && url && singer), [musicAttributes, name, cover, url, singer]);

  const decorativeSeed = useMemo(() => {
    return `${state.id ?? "editor"}:${url ?? ""}:${name ?? ""}:${singer ?? ""}`;
  }, [name, singer, state.id, url]);

  return (
    <div
      className="
        absolute left-0 top-0 h-full w-full overflow-hidden rounded-md border
        text-[var(--text-color)]
      "
      style={
        {
          background,
          "--text-color": textColor,
        } as React.CSSProperties
      }
    >
      <DecorativeMusicBackgroundIcons
        icons={backgroundIconEntries}
        seed={decorativeSeed}
        color={textColor}
      />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        {hasMusic ? (
          <PlayerView
            name={name ?? ""}
            cover={cover ?? ""}
            url={url ?? ""}
            singer={singer ?? ""}
            direction="col"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-gray-500">No music found</p>
          </div>
        )}

        {state.content && (
          <ShowMusicPlainContent content={state.content} author={state.author?.name} mail={state.author?.email} />
        )}
      </div>
    </div>
  );
}
