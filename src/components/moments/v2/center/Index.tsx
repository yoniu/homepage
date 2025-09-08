"use client";

import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { useEffect, useState } from 'react';
import api from '@/src/utils/api';
import { App, Spin } from 'antd';
import { TResponseError } from '@/src/utils/axiosInstance';
import dynamic from 'next/dynamic';

const MomentsMasonry = dynamic(() => import("@/src/components/moments/v2/center/Masonry"), {
  ssr: false,
})

const MomentsTiktok = dynamic(() => import("@/src/components/moments/v2/center/Tiktok"), {
  ssr: false,
})

export default function Center() {

  const { state, dispatch }  = useMomentStateContext();
  const { message: messageApi } = App.useApp()

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    handleGetPublicAll()
  }, [])

  // 加载下一页
  useEffect(() => {
    if (state.hasNextPage) {
      // 提前加载
      if (state.currentIndex + 2 >= state.momentList.length) {
        handleGetPublicAll()
      }
    }
  }, [state.currentIndex])

  const handleGetPublicAll = () => {
    dispatch({ type: 'SETLOADING', state: true })
    getPublicAll(state.page, state.pageSize).then(res => {
      const { hasNextPage, moments } = res.data
      // 如果当前分页大于 1 则推入栈，否则直接赋值
      if (state.page) {
        dispatch({
          type: "UPDATELIST",
          momentList: [...state.momentList, ...moments],
          page: state.page + 1,
          hasNextPage
        })
      } else {
        dispatch({
          type: "UPDATELIST",
          momentList: [...res.data.moments],
          page: state.page + 1,
          hasNextPage
        })
      }
    }).catch(err => {
      const { message } = err as TResponseError
      if (Array.isArray(message)) {
        message.map((msg) => messageApi.error(msg))
      } else {
        messageApi.error(message)
      }
    }).finally(() => {
      setLoading(false)
      dispatch({ type: 'SETLOADING', state: false })
    })
  }

  return (
    <>
      <div className="relative w-full sm:w-[80%] h-full">
        <Spin spinning={loading} fullscreen={true} />
        {
          state.displayType === 'masonry' ? 
          <MomentsMasonry /> :
          <MomentsTiktok />
        }
      </div>
    </>
  )
}

function getPublicAll(page: number, pageSize: number) {
  return api.get<IGetMomentListResponse>('/moment/public', { page, pageSize });
}
