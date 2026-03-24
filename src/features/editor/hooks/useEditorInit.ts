"use client";

import { App } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { logged } from '@/src/features/auth/api';
import { createMoment, getOwnerMoment } from '@/src/features/moment/api';
import { normalizeApiError } from '@/src/shared/api/error';
import { useStateContext as useEditorStateContext } from '@/src/stores/editor';

export function useEditorInit() {
  const router = useRouter();
  const query = useSearchParams();

  const { modal, message: messageApi } = App.useApp();
  const { dispatch } = useEditorStateContext();

  const [loading, setLoading] = useState(true);

  const confirmRef = useRef<{ destroy: () => void } | null>(null);
  const momentId = query.get('id');

  const handleCreateMoment = useCallback(async () => {
    setLoading(true);

    try {
      const response = await createMoment();
      router.replace(`/editor?id=${response.data.id}`);
    } catch (error) {
      normalizeApiError(messageApi, error);
      setLoading(false);
    }
  }, [messageApi, router]);

  useEffect(() => {
    if (!logged()) {
      messageApi.error('请先登录');
      setLoading(false);
      router.replace('/');
      return;
    }

    if (momentId === null) {
      setLoading(false);

      if (confirmRef.current) {
        return;
      }

      confirmRef.current = modal.confirm({
        title: '检测到无传入 id',
        content: '是否新建为草稿？',
        closable: true,
        onOk: async () => {
          confirmRef.current = null;
          await handleCreateMoment();
        },
        onCancel: () => {
          confirmRef.current = null;
          router.replace('/admin');
        },
      });

      return;
    }

    const parsedId = Number(momentId);
    if (Number.isNaN(parsedId)) {
      messageApi.error('未找到该 Moment');
      setLoading(false);
      router.replace('/admin');
      return;
    }

    setLoading(true);
    getOwnerMoment(parsedId)
      .then((response) => {
        if (!response.data) {
          messageApi.error('未找到该 Moment');
          router.replace('/admin');
          return;
        }

        dispatch({
          type: 'UPDATE',
          states: response.data,
        });
      })
      .catch((error) => {
        normalizeApiError(messageApi, error);
        router.replace('/admin');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, handleCreateMoment, messageApi, modal, momentId, router]);

  return {
    loading,
  };
}
