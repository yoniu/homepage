declare enum EMomentStatus {
  Draft = 0,
  Published = 1,
  Self = 2,
}

declare enum EMomentType {
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Live = 'live',
  Music = 'music',
}

declare type TTextType = "LIGHT" | "DARK";
declare type TMusicMomentBackgroundType = "DEFAULT" | "PLAIN" | "GRADIENT";

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

declare interface IMomentAttributes {
  type?: EMomentType;
  photosets?: IPhotosetItem[];
  fixedText?: IFixedTextItem[];
  music?: Partial<IMusicItem>;
  video?: Partial<IVideoItem>;
  backgroundColor?: TTextBackgroundColor | string;
  location?: IMomentLocation;
  textType?: TTextType;
  backgroundType?: TMusicMomentBackgroundType;
  gradientColors?: string[];
}

declare interface IMomentItem<T = IMomentAttributes> {
  id: number
  title?: string
  content?: string
  author: IUser
  attributes?: T
  status: EMomentStatus
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
}

declare interface IVideoItem {
  url: string;
  cover: string;
}
