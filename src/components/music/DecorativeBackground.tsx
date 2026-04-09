"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";
import {
  TMusicMomentAttributes,
  type TMusicBackgroundIconEntry,
  type TMusicBackgroundIconPlacement,
} from "@/src/types/moments";

type DecorativeMusicBackgroundIconsProps = {
  icons?: TMusicBackgroundIconEntry[];
  seed: string | number;
  color?: string;
  className?: string;
};

type DecorativeIcon = {
  key: string;
  content: string;
  kind: "svg" | "emoji";
  left: number;
  top: number;
  size: number;
  rotation: number;
  baseOpacity: number;
  drift: number;
  duration: number;
  delay: number;
};

type GetBackgroundIconEntriesOptions = {
  preserveEmpty?: boolean;
};

const MIN_COPY_COUNT = 12;
const COPIES_PER_ICON = 8;
const MAX_COPY_COUNT = 32;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0 || 1;

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function isSvgMarkup(content: string) {
  const normalized = content.trim().toLowerCase();
  return normalized.startsWith("<svg") && normalized.includes("</svg>");
}

function getDefaultCoverageHeight(placement: TMusicBackgroundIconPlacement) {
  return placement === "FULL" ? 100 : 50;
}

function getLegacyMusicBackgroundIconPlacement(attributes?: TMusicMomentAttributes): TMusicBackgroundIconPlacement {
  return attributes?.backgroundIconPlacement ?? "FULL";
}

function getLegacyMusicBackgroundIconCoverageHeight(attributes?: TMusicMomentAttributes) {
  const placement = getLegacyMusicBackgroundIconPlacement(attributes);
  return clamp(
    Math.round(attributes?.backgroundIconCoverageHeight ?? getDefaultCoverageHeight(placement)),
    10,
    100,
  );
}

function getEntryPlacement(
  entry: string | TMusicBackgroundIconEntry,
  attributes?: TMusicMomentAttributes,
): TMusicBackgroundIconPlacement {
  if (typeof entry === "string") {
    return getLegacyMusicBackgroundIconPlacement(attributes);
  }

  return entry.placement ?? getLegacyMusicBackgroundIconPlacement(attributes);
}

function getEntryCoverageHeight(
  entry: string | TMusicBackgroundIconEntry,
  attributes?: TMusicMomentAttributes,
  placement?: TMusicBackgroundIconPlacement,
) {
  if (typeof entry === "string") {
    return getLegacyMusicBackgroundIconCoverageHeight(attributes);
  }

  const fallbackPlacement = placement ?? getEntryPlacement(entry, attributes);
  return clamp(
    Math.round(entry.coverageHeight ?? getDefaultCoverageHeight(fallbackPlacement)),
    10,
    100,
  );
}

export function getMusicMomentTextColor(attributes?: TMusicMomentAttributes) {
  return attributes?.textType === "DARK" ? "#000000" : "#ffffff";
}

export function getMusicMomentBackground(attributes?: TMusicMomentAttributes) {
  if (attributes?.backgroundType === "PLAIN") {
    return attributes.backgroundColor || "#951B1B";
  }

  if (attributes?.backgroundType === "GRADIENT" && attributes.gradientColors?.length) {
    return `linear-gradient(${attributes.gradientColors.join(", ")})`;
  }

  return "#951B1B";
}

export function getMusicBackgroundIconEntries(
  attributes?: TMusicMomentAttributes,
  options?: GetBackgroundIconEntriesOptions,
): TMusicBackgroundIconEntry[] {
  return (attributes?.backgroundIcons ?? [])
    .map((entry) => {
      const content = typeof entry === "string" ? entry.trim() : entry.content.trim();
      const placement = getEntryPlacement(entry, attributes);
      const coverageHeight = getEntryCoverageHeight(entry, attributes, placement);

      return {
        content,
        placement,
        coverageHeight,
      };
    })
    .filter((entry) => options?.preserveEmpty || Boolean(entry.content));
}

function getVerticalRange(placement: TMusicBackgroundIconPlacement, coverageHeight: number) {
  if (placement === "TOP") {
    return {
      start: 0,
      end: coverageHeight,
    };
  }

  if (placement === "BOTTOM") {
    return {
      start: 100 - coverageHeight,
      end: 100,
    };
  }

  const start = (100 - coverageHeight) / 2;

  return {
    start,
    end: start + coverageHeight,
  };
}

export function DecorativeMusicBackgroundIcons({
  icons,
  seed,
  color = "rgba(255, 255, 255, 0.92)",
  className,
}: DecorativeMusicBackgroundIconsProps) {
  const normalizedIcons = useMemo(
    () =>
      (icons ?? [])
        .map((entry) => ({
          ...entry,
          content: entry.content.trim(),
        }))
        .filter((entry) => Boolean(entry.content)),
    [icons],
  );

  const decorativeIcons = useMemo<DecorativeIcon[]>(() => {
    if (!normalizedIcons.length) {
      return [];
    }

    const totalCount = clamp(normalizedIcons.length * COPIES_PER_ICON, MIN_COPY_COUNT, MAX_COPY_COUNT);
    const random = createSeededRandom(
      hashString(`${seed}::${normalizedIcons.map((entry) => `${entry.content}:${entry.placement}:${entry.coverageHeight}`).join("||")}`),
    );

    return Array.from({ length: totalCount }, (_, index) => {
      const entry =
        normalizedIcons[Math.floor(random() * normalizedIcons.length)] ??
        normalizedIcons[index % normalizedIcons.length];
      const kind = isSvgMarkup(entry.content) ? "svg" : "emoji";
      const size = kind === "svg" ? 28 + random() * 44 : 20 + random() * 34;
      const { start, end } = getVerticalRange(entry.placement ?? "FULL", clamp(entry.coverageHeight ?? 100, 10, 100));

      return {
        key: `${seed}-${index}-${hashString(`${entry.content}:${entry.placement}:${entry.coverageHeight}`)}`,
        content: entry.content,
        kind,
        left: 4 + random() * 92,
        top: start + random() * Math.max(end - start, 1),
        size,
        rotation: -24 + random() * 48,
        baseOpacity: 0.12 + random() * 0.22,
        drift: 4 + random() * 10,
        duration: 3.2 + random() * 3.8,
        delay: random() * 6,
      };
    });
  }, [normalizedIcons, seed]);

  if (!decorativeIcons.length) {
    return null;
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {decorativeIcons.map((icon) => (
        <div key={icon.key} className="absolute" style={{ left: `${icon.left}%`, top: `${icon.top}%` }}>
          <div style={{ transform: `translate(-50%, -50%) rotate(${icon.rotation}deg)` }}>
            <div
              className="music-background-icon flex items-center justify-center"
              style={
                {
                  width: icon.size,
                  height: icon.size,
                  color,
                  "--music-icon-base-opacity": icon.baseOpacity,
                  "--music-icon-drift": `${icon.drift}px`,
                  animationDuration: `${icon.duration}s`,
                  animationDelay: `-${icon.delay}s`,
                } as React.CSSProperties
              }
            >
              {icon.kind === "svg" ? (
                <div
                  data-music-bg-icon-svg="true"
                  className="h-full w-full"
                  dangerouslySetInnerHTML={{ __html: icon.content }}
                />
              ) : (
                <span className="select-none leading-none" style={{ fontSize: icon.size }}>
                  {icon.content}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
