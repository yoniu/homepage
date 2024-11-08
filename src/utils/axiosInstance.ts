import axios, { AxiosInstance } from 'axios';
import consts from '@/src/configs/consts';
import { ApiResult } from '@/src/utils/api';

export type TResponseError = ApiResult<null>

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOMEPAGE_API,
  timeout: 5000,
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.url?.includes('login')) {
      config.headers.Authorization = `Bearer ${localStorage.getItem(consts.LS_TOKEN)}`;
    }
    config.headers.Accept = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error.response.data as TResponseError);
  },
);

export default axiosInstance;

