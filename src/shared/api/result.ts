export interface ApiResult<T> {
  statusCode: number;
  message: string | string[];
  data: T;
}
