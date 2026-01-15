"use client";

import { useMemo } from "react";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor"
import { ShowMusicPlainContent } from "@/src/components/editor/plainContent";
import { TMusicMomentAttributes } from "@/src/types/moments";
import PlayerView from "@/src/components/play/PlayerView";

export default function MusicEditor() {

  const { state } = useEditorStateContext() 

  const musicAttributes = state.attributes as TMusicMomentAttributes;

  const textType = useMemo(() => musicAttributes?.textType ?? "LIGHT", [musicAttributes]);

  const textColor = useMemo(() => {
    return textType === "LIGHT" ? "#fff" : "#000"
  }, [textType])

  const bg = useMemo(() => {
    if (musicAttributes.backgroundType === 'PLAIN') {
      return musicAttributes.backgroundColor || '#951B1B'
    } else if (musicAttributes.backgroundType === 'GRADIENT') {
      return `linear-gradient(${musicAttributes.gradientColors?.join(', ')})`
    }
    return '#951B1B'
  }, [musicAttributes.backgroundColor, musicAttributes.backgroundType, musicAttributes.gradientColors])

  const name = useMemo(() => {
    return musicAttributes?.music?.name
  }, [musicAttributes.music?.name])

  const cover = useMemo(() => {
    return musicAttributes?.music?.cover
  }, [musicAttributes.music?.cover])

  const url = useMemo(() => {
    return musicAttributes?.music?.url
  }, [musicAttributes.music?.url])

  const singer = useMemo(() => {
    return musicAttributes?.music?.singer
  }, [musicAttributes.music?.singer])

  const hasMusic = useMemo(() => {
    return musicAttributes && name && cover && url && singer
  }, [musicAttributes, name, cover, url, singer])

  return (
    <>
      <div
        className="
          border overflow-hidden
          flex flex-col items-center justify-center
          absolute left-0 top-0 w-full h-full rounded-md
          text-[var(--text-color)]
        "
        style={{ 
          background: bg,
          '--text-color': textColor 
        } as React.CSSProperties}
      >
        {
          hasMusic ?
          <PlayerView
            name={name ?? ""}
            cover={cover ?? ""}
            url={url ?? ""}
            singer={singer ?? ""}
            direction="col"
          /> :
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-gray-500">No music found</p>
          </div>
        }
        { state.content && <ShowMusicPlainContent content={state.content} author={state.author?.name} mail={state.author?.email} /> }
      </div>
    </>
  )
}
