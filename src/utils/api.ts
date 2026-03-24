import type { AxiosRequestConfig } from 'axios';

import axiosInstance from '@/src/shared/api/client';
import type { ApiResult } from '@/src/shared/api/result';

export type { ApiResult };

async function get<T, P = Record<string, unknown>>(url: string, params?: P): Promise<ApiResult<T>> {
  const response = await axiosInstance.get<ApiResult<T>>(url, { params });
  return response.data;
}

async function post<T, D = unknown>(url: string, data?: D): Promise<ApiResult<T>> {
  const response = await axiosInstance.post<ApiResult<T>>(url, data);
  return response.data;
}

async function put<T, D = unknown>(url: string, data?: D, options?: AxiosRequestConfig<D>): Promise<ApiResult<T>> {
  const response = await axiosInstance.put<ApiResult<T>>(url, data, options);
  return response.data;
}

async function patch<T, D = unknown>(url: string, data?: D): Promise<ApiResult<T>> {
  const response = await axiosInstance.patch<ApiResult<T>>(url, data);
  return response.data;
}

async function del<T, P = Record<string, unknown>>(url: string, params?: P): Promise<ApiResult<T>> {
  const response = await axiosInstance.delete<ApiResult<T>>(url, { params });
  return response.data;
}

export default { get, post, put, del, patch };

