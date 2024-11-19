import api from '@/src/utils/api';
import consts from '@/src/configs/consts';

interface ILogin {
  name: string;
  password: string;
}

interface ILoginResponse {
  id: number;
  name: string;
  email: string;
  access_token: string;
}

/**
 * 用户登录
 * @param data 登录表单
 * @returns 
 */
export function login(data: ILogin): Promise<ILoginResponse> {
  return api.post<ILoginResponse>('/user/login', data).then((res) => {
    const { access_token } = res.data
    localStorage.setItem(consts.LS_TOKEN, access_token);
    return res.data;
  });
}

/**
 * 判断是否登录
 * @returns {boolean}
 */
export function logged() {
  const token = localStorage.getItem(consts.LS_TOKEN);
  if (token) {
    return true;
  } else {
    return false;
  }
}

