"use client";

import { App } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { normalizeApiError } from '@/src/shared/api/error';

import { deleteMoment, getAllMoments, type MomentEntity } from '../api';

export function useAdminMomentList(pageSize = 12) {
  const { message: messageApi } = App.useApp();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [items, setItems] = useState<MomentEntity[]>([]);

  const getMomentList = useCallback(async (targetPage: number, reset = false) => {
    setLoading(true);

    try {
      const response = await getAllMoments(targetPage, pageSize);
      setHasNextPage(response.data.hasNextPage);
      setItems((prevItems) => (
        reset ? response.data.moments : [...prevItems, ...response.data.moments]
      ));
    } catch (error) {
      normalizeApiError(messageApi, error);
    } finally {
      setLoading(false);
    }
  }, [messageApi, pageSize]);

  useEffect(() => {
    void getMomentList(1, true);
  }, [getMomentList]);

  const loadMore = useCallback(() => {
    if (!hasNextPage || loading) {
      return;
    }

    const nextPage = page + 1;
    setPage(nextPage);
    void getMomentList(nextPage);
  }, [getMomentList, hasNextPage, loading, page]);

  const remove = useCallback((id: number) => {
    if (loading) {
      return;
    }

    setLoading(true);
    deleteMoment(id)
      .then(() => {
        messageApi.success('删除成功');
        setPage(1);
        return getMomentList(1, true);
      })
      .catch((error) => {
        normalizeApiError(messageApi, error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getMomentList, loading, messageApi]);

  return {
    hasNextPage,
    items,
    loadMore,
    loading,
    remove,
  };
}
