import consts from '@/src/configs/consts';
import api from '@/src/utils/api';

export interface LoginPayload {
  name: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  access_token: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/user/login', payload);

  if (typeof window !== 'undefined') {
    localStorage.setItem(consts.LS_TOKEN, response.data.access_token);
  }

  return response.data;
}

export function logged() {
  if (typeof window === 'undefined') {
    return false;
  }

  return Boolean(localStorage.getItem(consts.LS_TOKEN));
}

export function logout() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(consts.LS_TOKEN);
}
