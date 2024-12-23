"use client";

import MomentLoading from '@/src/components/moments/item/loading';

import Sidebar from "@/src/components/sidebar"
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { useEffect, useMemo, useState } from 'react';
import api from '@/src/utils/api';
import { App, Spin } from 'antd';
import { TResponseError } from '@/src/utils/axiosInstance';
import TextItem from '@/src/components/moments/item/text';
import ImageItem from '@/src/components/moments/item/image';
import VideoItem from '@/src/components/moments/item/video';

export default function Page() {

  const { state, dispatch }  = useMomentStateContext();
  const { message: messageApi } = App.useApp()

  const [loading, setLoading] = useState(true);

  const displayer: Record<EMomentType, (key: number) => JSX.Element> = {
    text: (key) => <TextItem key={key} item={state.momentList[state.currentIndex]} />,
    image: (key) => <ImageItem key={key} item={state.momentList[state.currentIndex]} />,
    video: (key) => <VideoItem key={key} item={state.momentList[state.currentIndex]} />,
    live: (key) => <div key={key}>live</div>,
  }

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

  const currentMomentType = useMemo<EMomentType>(() => {
    if (state.momentList[state.currentIndex] && state.momentList[state.currentIndex].attributes && state.momentList[state.currentIndex].attributes.type) {
      return state.momentList[state.currentIndex].attributes.type
    }
    return 'text'
  }, [state.momentList[state.currentIndex]])

  const currentMoment = useMemo(() => {
    if (state.momentList && state.momentList[state.currentIndex]) {
      return state.momentList[state.currentIndex]
    }
    return null
  }, [state.momentList[state.currentIndex]])

  return (
    <>
      <Spin spinning={loading} fullscreen={true} />
      <div id="main" className="chrismas">
        <div id="content" className="relative flex items-center justify-center w-full h-full shadow-lg border rounded overflow-hidden">
          { !currentMoment ? <MomentLoading /> : displayer[currentMomentType](currentMoment.id) }
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
