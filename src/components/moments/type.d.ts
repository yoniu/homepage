declare type TTextType = "LIGHT" | "DARK";
declare type TMusicMomentBackgroundType = "DEFAULT" | "PLAIN" | "GRADIENT";
declare type TMusicBackgroundIconPlacement = "FULL" | "TOP" | "BOTTOM";

declare interface IUser {
  email: string
  id: number
  name: string
}

declare interface IMusicItem {
  name: string;
  singer: string;
  url: string;
  cover?: string;
  lrc?: string;
}

declare interface IFixedTextItem {
  id: string;
  content: string;
  top: string;
  left: string;
  type: number;
}

declare type TBackgroundColor = "solid" | "gradient" | "image" | "none";

declare interface TTextBackgroundColor {
  type: TBackgroundColor;
  textColor?: string;
  color?: string;
  colors?: string[];
  image?: string;
}

declare interface IMomentLocation {
  latitude: string;
  longitude: string;
  province: string;
  city: string;
  address: string;
}

declare interface TMusicBackgroundIconEntry {
  content: string;
  placement?: TMusicBackgroundIconPlacement;
  coverageHeight?: number;
}

declare interface IMomentAttributes {
  type?: import("@/src/types/moment").EMomentType;
  photosets?: IPhotosetItem[];
  fixedText?: IFixedTextItem[];
  music?: Partial<IMusicItem>;
  video?: Partial<IVideoItem>;
  backgroundColor?: TTextBackgroundColor | string;
  location?: IMomentLocation;
  textType?: TTextType;
  backgroundType?: TMusicMomentBackgroundType;
  gradientColors?: string[];
  backgroundIcons?: Array<string | TMusicBackgroundIconEntry>;
  backgroundIconPlacement?: TMusicBackgroundIconPlacement;
  backgroundIconCoverageHeight?: number;
}

declare interface IMomentItem<T = IMomentAttributes> {
  id: number
  title?: string
  content?: string
  author: IUser
  attributes?: T
  status: import("@/src/types/moment").EMomentStatus
  create_time: Date
  update_time: Date
}

declare interface IGetMomentListResponse {
  hasNextPage: boolean
  totalCount: number
  moments: IMomentItem[]
}
declare interface IPhotosetItem {
  id: number;
  url: string;
  type: string;
  name: string;
  fixedText?: IFixedTextItem[];
}

declare interface IVideoItem {
  url: string;
  cover: string;
}
