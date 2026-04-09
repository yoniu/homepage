import { IMusicItem } from "@/src/components/editor/music";

export type TTextType = "LIGHT" | "DARK";
export type TMusicBackgroundIconPlacement = "FULL" | "TOP" | "BOTTOM";

export type TMusicBackgroundIconEntry = {
  content: string;
  placement?: TMusicBackgroundIconPlacement;
  coverageHeight?: number;
};

export type TMusicMomentBackgroundType = "DEFAULT" | "PLAIN" | "GRADIENT";

export type TMusicMomentAttributes = {
  music?: Partial<IMusicItem>;
  textType?: TTextType;
  backgroundType?: TMusicMomentBackgroundType;
  backgroundColor?: string;
  gradientColors?: string[];
  backgroundIcons?: Array<string | TMusicBackgroundIconEntry>;
  backgroundIconPlacement?: TMusicBackgroundIconPlacement;
  backgroundIconCoverageHeight?: number;
};
