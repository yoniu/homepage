import type { AxiosRequestConfig } from 'axios';

import axiosInstance from '@/src/shared/api/client';
import type { ApiResult } from '@/src/shared/api/result';

export type { ApiResult };

async function get<T>(url: string, params?: any): Promise<ApiResult<T>> {
  const response = await axiosInstance.get<ApiResult<T>>(url, { params });
  return response.data;
}

async function post<T>(url: string, data?: any): Promise<ApiResult<T>> {
  const response = await axiosInstance.post<ApiResult<T>>(url, data);
  return response.data;
}

async function put<T>(url: string, data?: any, options?: AxiosRequestConfig<any>): Promise<ApiResult<T>> {
  const response = await axiosInstance.put<ApiResult<T>>(url, data, options);
  return response.data;
}

async function patch<T>(url: string, data?: any): Promise<ApiResult<T>> {
  const response = await axiosInstance.patch<ApiResult<T>>(url, data);
  return response.data;
}

async function del<T>(url: string, params?: any): Promise<ApiResult<T>> {
  const response = await axiosInstance.delete<ApiResult<T>>(url, { params });
  return response.data;
}

export default { get, post, put, del, patch };

