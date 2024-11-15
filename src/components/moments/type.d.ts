declare enum EMomentStatus {
  Draft = 0,
  Published = 1,
  Self = 2,
}

declare interface IMomentItem<T> {
  id: number
  title?: string
  content?: string
  author: number
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
