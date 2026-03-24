"use client";

import { App } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { normalizeApiError } from '@/src/shared/api/error';

import { getPublicMomentById, type MomentEntity } from '../api';

export function useMomentDetail() {
  const router = useRouter();
  const query = useSearchParams();

  const { modal, message: messageApi } = App.useApp();

  const confirmRef = useRef<{ destroy: () => void } | null>(null);
  const momentId = query.get('id');

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<MomentEntity>();

  const invalidUsage = useCallback(() => {
    messageApi.error('请使用正确的食用姿势');
    router.replace('/');
  }, [messageApi, router]);

  useEffect(() => {
    if (!momentId) {
      setLoading(false);

      if (confirmRef.current) {
        return;
      }

      confirmRef.current = modal.confirm({
        title: '提示',
        content: '请使用正确的食用姿势',
        closable: true,
        onOk: () => {
          confirmRef.current = null;
          router.replace('/');
        },
        onCancel: () => {
          confirmRef.current = null;
          router.replace('/');
        },
      });

      return;
    }

    const parsedId = Number(momentId);
    if (Number.isNaN(parsedId)) {
      setLoading(false);
      invalidUsage();
      return;
    }

    setLoading(true);
    getPublicMomentById(parsedId)
      .then((response) => {
        if (!response.data) {
          invalidUsage();
          return;
        }

        setItem(response.data);
      })
      .catch((error) => {
        normalizeApiError(messageApi, error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [invalidUsage, messageApi, modal, momentId, router]);

  const currentMomentType = useMemo<EMomentType>(() => {
    const type = item?.attributes?.type;
    return typeof type === 'string' ? (type as EMomentType) : EMomentType.Text;
  }, [item]);

  return {
    currentMomentType,
    item,
    loading,
  };
}
