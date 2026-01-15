import { IMusicItem } from "@/src/components/editor/music";

export type TTextType = "LIGHT" | "DARK";

/**
 * 音乐动态背景类型
 */
export type TMusicMomentBackgroundType = "DEFAULT" | "PLAIN" | "GRADIENT";

/**
 * 音乐动态属性
 */
export type TMusicMomentAttributes = {
  music?: IMusicItem;
  textType?: TTextType;
  backgroundType?: TMusicMomentBackgroundType;
  backgroundColor?: string;
  gradientColors?: string[];
}
