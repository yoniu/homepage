"use client";

import { App } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';

import { normalizeApiError } from '@/src/shared/api/error';
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';

import { getPublicMoments } from '../api';
import { consumeMomentFeedStale } from '../utils/feedRefresh';

export function useMomentFeed() {
  const { state, dispatch } = useMomentStateContext();
  const { message: messageApi } = App.useApp();

  const [loading, setLoading] = useState(true);

  const initializedRef = useRef(false);
  const fetchingRef = useRef(false);

  const handleGetPublicAll = useCallback(async (targetPage: number, replace = false) => {
    if (fetchingRef.current) {
      return;
    }

    fetchingRef.current = true;
    dispatch({ type: 'SETLOADING', state: true });

    if (replace || (targetPage === 1 && state.momentList.length === 0)) {
      setLoading(true);
    }

    try {
      const response = await getPublicMoments(targetPage, state.pageSize);
      const { hasNextPage, moments } = response.data;

      dispatch({
        type: 'UPDATELIST',
        momentList: replace ? moments : [...state.momentList, ...moments],
        page: targetPage + 1,
        hasNextPage,
      });
    } catch (error) {
      normalizeApiError(messageApi, error);
    } finally {
      setLoading(false);
      dispatch({ type: 'SETLOADING', state: false });
      fetchingRef.current = false;
    }
  }, [dispatch, messageApi, state.momentList, state.pageSize]);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    const shouldRefresh = consumeMomentFeedStale();

    if (shouldRefresh) {
      dispatch({ type: 'RESETFEED' });
      void handleGetPublicAll(1, true);
      return;
    }

    if (state.momentList.length === 0) {
      void handleGetPublicAll(1, true);
      return;
    }

    setLoading(false);
  }, [dispatch, handleGetPublicAll, state.momentList.length]);

  useEffect(() => {
    if (!state.hasNextPage || fetchingRef.current) {
      return;
    }

    if (state.currentIndex + 2 < state.momentList.length) {
      return;
    }

    void handleGetPublicAll(state.page);
  }, [handleGetPublicAll, state.currentIndex, state.hasNextPage, state.momentList.length, state.page]);

  return {
    displayType: state.displayType,
    loading,
  };
}
