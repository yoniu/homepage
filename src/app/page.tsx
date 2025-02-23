"use client";

import Sidebar from "@/src/components/sidebar"
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { useEffect, useState } from 'react';
import api from '@/src/utils/api';
import { App, Spin } from 'antd';
import { TResponseError } from '@/src/utils/axiosInstance';
import MomentsTiktok from '@/src/components/moments/list/tiktok';

export default function Page() {

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
      if (state.currentIndex + 2 === state.momentList.length) {
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
      <Spin spinning={loading} fullscreen={true} />
      <div id="main">
        <MomentsTiktok />
      </div>
      <div id="sidebar">
        <Sidebar />
      </div>
    </>
  )
}

function getPublicAll(page: number, pageSize: number) {
  return api.get<IGetMomentListResponse>('/moment/public', { page, pageSize });
}
