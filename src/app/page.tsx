"use client";

import MomentLoading from '@/src/components/moments/item/loading';

import Sidebar from "@/src/components/sidebar"
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { useEffect, useMemo, useState } from 'react';
import api from '@/src/utils/api';
import { App, Spin } from 'antd';
import { TResponseError } from '@/src/utils/axiosInstance';
import TextItem from '../components/moments/item/text';
import ImageItem from '../components/moments/item/image';

export default function Page() {

  const { state, dispatch }  = useMomentStateContext();
  const { message: messageApi } = App.useApp()

  const [loading, setLoading] = useState(true);

  const displayer: Record<EMomentType, JSX.Element> = {
    text: <TextItem item={state.momentList[state.currentIndex]} />,
    image: <ImageItem item={state.momentList[state.currentIndex]} />,
    video: <div>video</div>,
    live: <div>live</div>,
  }

  useEffect(() => {
    handleGetPublicAll()
  }, [])

  const handleGetPublicAll = () => {
    setLoading(true)
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
    })
  }

  const currentMomentType = useMemo<EMomentType>(() => {
    if (state.momentList[state.currentIndex] && state.momentList[state.currentIndex].attributes && state.momentList[state.currentIndex].attributes.type) {
      return state.momentList[state.currentIndex].attributes.type
    }
    return 'text'
  }, [state.momentList[state.currentIndex]])

  return (
    <>
      <Spin spinning={loading} fullscreen={true} />
      <div id="main">
        <div className="flex items-center justify-center w-full h-full">
          { !state.momentList.length ? <MomentLoading /> : displayer[currentMomentType] }
        </div>
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
