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
}

declare interface IUser {
  email: string
  id: number
  name: string
}

declare interface IMomentItem<T> {
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
  moments: IMomentItem<any>[]
}
declare interface IPhotosetItem {
  id: number;
  url: string;
  type: string;
  name: string;
}
