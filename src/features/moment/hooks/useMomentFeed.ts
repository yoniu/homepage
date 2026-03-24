"use client";

import { App } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { normalizeApiError } from '@/src/shared/api/error';
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';

import { getPublicMoments } from '../api';

export function useMomentFeed() {
  const { state, dispatch } = useMomentStateContext();
  const { message: messageApi } = App.useApp();

  const [loading, setLoading] = useState(true);

  const initializedRef = useRef(false);
  const fetchingRef = useRef(false);

  const handleGetPublicAll = async () => {
    if (fetchingRef.current) {
      return;
    }

    fetchingRef.current = true;
    dispatch({ type: 'SETLOADING', state: true });

    if (state.page === 1 && state.momentList.length === 0) {
      setLoading(true);
    }

    try {
      const response = await getPublicMoments(state.page, state.pageSize);
      const { hasNextPage, moments } = response.data;

      dispatch({
        type: 'UPDATELIST',
        momentList: state.page > 1 ? [...state.momentList, ...moments] : moments,
        page: state.page + 1,
        hasNextPage,
      });
    } catch (error) {
      normalizeApiError(messageApi, error);
    } finally {
      setLoading(false);
      dispatch({ type: 'SETLOADING', state: false });
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    void handleGetPublicAll();
  }, []);

  useEffect(() => {
    if (!state.hasNextPage || fetchingRef.current) {
      return;
    }

    if (state.currentIndex + 2 < state.momentList.length) {
      return;
    }

    void handleGetPublicAll();
  }, [state.currentIndex, state.hasNextPage, state.momentList.length]);

  return {
    displayType: state.displayType,
    loading,
  };
}
