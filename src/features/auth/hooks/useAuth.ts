"use client";

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { useStateContext as useUserStateContext } from '@/src/stores/user';

import {
  logged,
  login as loginRequest,
  logout as logoutRequest,
  type LoginPayload,
} from '../api';

export function useAuth() {
  const { state, dispatch } = useUserStateContext();

  const syncLoginState = useCallback(() => {
    dispatch({ type: 'UPDATELOGIN' });
  }, [dispatch]);

  const login = useCallback(async (payload: LoginPayload) => {
    const user = await loginRequest(payload);
    syncLoginState();
    return user;
  }, [syncLoginState]);

  const logout = useCallback(() => {
    logoutRequest();
    syncLoginState();
  }, [syncLoginState]);

  return {
    isLogin: state.isLogin,
    logged,
    login,
    logout,
    syncLoginState,
  };
}

export function useRequireLogin(redirectTo = '/') {
  const router = useRouter();
  const { message } = App.useApp();
  const { syncLoginState } = useAuth();

  useEffect(() => {
    syncLoginState();

    if (!logged()) {
      message.error('请先登录');
      router.replace(redirectTo);
    }
  }, [message, redirectTo, router, syncLoginState]);
}
