import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';

import api from '@/src/utils/api';

export enum EFileStatus {
  deleted,
  normal,
  explicit,
}

export interface EditorFileItem<T = Record<string, never>> {
  id: number;
  filename: string;
  url: string;
  size: number;
  format: string;
  type: string;
  moment: number;
  author: number;
  create_time: Date;
  update_time: Date;
  status: EFileStatus;
  meta: T;
}

export interface BMapLocationResponse {
  address: string;
  content: {
    address: string;
    address_detail: {
      city: string;
      city_code: number;
      province: string;
    };
    point: {
      x: string;
      y: string;
    };
  };
  status: number;
}

export interface BMapSuggestionResponse {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  uid: string;
  province: string;
  city: string;
  district: string;
  business: string;
  cityid: string;
  tag: string;
  address: string;
  children: [];
  adcode: string;
}

export async function getClientIp() {
  const response = await axios.get<{ origin: string }>('https://httpbin.org/ip');
  return response.data.origin;
}

export function uploadFile(formData: FormData, options?: AxiosRequestConfig<FormData>) {
  return api.put<EditorFileItem>('/file/upload', formData, options);
}

export function deleteFile(id: number) {
  return api.del<null>(`/file/remove/${id}`);
}

export function getMomentFiles(id: number) {
  return api.get<EditorFileItem[]>(`/file/moment/${id}`);
}

export function getLocationByIp(ip: string) {
  return api.get<BMapLocationResponse>(`/location/ip/${ip}`);
}

export function searchLocation(keyword: string, city: string) {
  return api.get<BMapSuggestionResponse[]>('/location/suggestion/', {
    keyword,
    city,
  });
}
