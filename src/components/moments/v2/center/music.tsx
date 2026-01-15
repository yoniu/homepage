import { useMemo } from "react";
import { ShowMusicPlainContent } from "@/src/components/editor/plainContent";
import { IFixedTextItem } from "@/src/components/editor/fixedText";
import { TMusicMomentAttributes } from "@/src/types/moments";
import PlayerView from "@/src/components/play/PlayerView";

export interface IVideoState {
  video?: IVideoItem
  fixedText?: IFixedTextItem[]
}

interface IProps {
  item: IMomentItem<IVideoState>
}

export default function MusicItem({ item }: IProps) {

  const musicAttributes = item.attributes as TMusicMomentAttributes;

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

  return (
    <div
      className="text-[var(--text-color)] absolute left-0 top-0 w-full h-full"
      style={{ 
        background: bg,
        '--text-color': textColor 
      } as React.CSSProperties}
    >
      <div
        className="
          overflow-hidden
          flex flex-col items-center justify-center
          w-full h-full max-w-[960px] m-auto
        "
      >
        <PlayerView
          name={name ?? ""}
          cover={cover ?? ""}
          url={url ?? ""}
          singer={singer ?? ""}
        />
        { item.content && <ShowMusicPlainContent content={item.content} author={item.author.name} mail={item.author?.email} /> }
      </div>
    </div>
  )
}
