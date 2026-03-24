import axios, { AxiosError, type AxiosInstance } from 'axios';

import consts from '@/src/configs/consts';

import { createApiError, type ApiError } from './error';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOMEPAGE_API,
  timeout: 60000,
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};

    if (!config.url?.includes('/user/login') && typeof window !== 'undefined') {
      const token = localStorage.getItem(consts.LS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    config.headers.Accept = 'application/json';
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => Promise.reject(
    error.response?.data ?? createApiError(error.message),
  ),
);

export default apiClient;
