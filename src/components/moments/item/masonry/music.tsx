import Link from "next/link";
import { useMemo, type CSSProperties } from "react";

import CONST from "@/src/configs/consts";
import { TMusicMomentAttributes } from "@/src/types/moments";

interface IProps {
  item: IMomentItem;
}

export default function MasonryMusicItem({ item }: IProps) {
  const musicAttributes = useMemo(() => item.attributes as TMusicMomentAttributes, [item.attributes]);

  const textColor = useMemo(() => {
    return musicAttributes?.textType === "DARK" ? "#111111" : "#FFFFFF";
  }, [musicAttributes?.textType]);

  const background = useMemo(() => {
    if (musicAttributes?.backgroundType === "PLAIN") {
      return musicAttributes.backgroundColor || "#951B1B";
    }

    if (musicAttributes?.backgroundType === "GRADIENT" && musicAttributes.gradientColors?.length) {
      return `linear-gradient(${musicAttributes.gradientColors?.join(", ")})`;
    }

    return "linear-gradient(160deg, #5f0f40 0%, #9a031e 45%, #fb8b24 100%)";
  }, [musicAttributes?.backgroundColor, musicAttributes?.backgroundType, musicAttributes?.gradientColors]);

  const href = useMemo(() => `/moment/?id=${item.id}`, [item.id]);
  const cover = useMemo(() => musicAttributes?.music?.cover || CONST.LUTHER, [musicAttributes?.music?.cover]);
  const name = useMemo(() => musicAttributes?.music?.name || item.title || "Untitled Track", [item.title, musicAttributes?.music?.name]);
  const singer = useMemo(() => musicAttributes?.music?.singer || item.author?.name || "Unknown Artist", [item.author?.name, musicAttributes?.music?.singer]);
  const preview = useMemo(() => {
    if (!item.content) {
      return "";
    }

    const [firstLine] = item.content.split("\n");
    return firstLine;
  }, [item.content]);

  return (
    <Link className="mb-1 block overflow-hidden rounded-md border bg-white shadow-sm sm:mb-4" href={href}>
      <div
        className="relative flex min-h-[360px] flex-col overflow-hidden p-4"
        style={
          {
            background,
            color: textColor,
          } as CSSProperties
        }
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.18),_transparent_30%)]" />

        <div className="relative flex flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="relative w-32 shrink-0 rounded-full border-4 border-black/50 bg-black/20 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/50 bg-white/90" />
              <img className="aspect-square w-full rounded-full object-cover" src={cover} alt={name} />
            </div>

            <div className="min-w-0 space-y-2">
              <div className="line-clamp-2 text-xl font-semibold leading-tight">{name}</div>
              <div className="truncate text-sm opacity-80">{singer}</div>
            </div>
          </div>

          {(item.title || preview) && (
            <div className="mt-auto rounded-2xl border border-white/15 bg-black/15 p-4 backdrop-blur-sm">
              {item.title && <div className="mb-2 text-sm font-medium opacity-90">{item.title}</div>}
              {preview && <p className="line-clamp-3 text-sm opacity-80">{preview}</p>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
