"use client";

import { useRouter, useSearchParams } from "next/navigation"
import TextItem from '@/src/components/moments/item/text';
import ImageItem from '@/src/components/moments/item/image';
import VideoItem from '@/src/components/moments/item/video';
import api from "@/src/utils/api";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { App, Spin } from "antd";
import { TResponseError } from "@/src/utils/axiosInstance";
import Sidebar from "@/src/components/sidebar"

export default function Page() {
  return (
    <Suspense>
      <Moment />
    </Suspense>
  )
}

function Moment() {

  const router = useRouter()
  const query = useSearchParams()

  const { modal, message: messageApi } = App.useApp()

  const confirm = useRef<any>(null)

  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<IMomentItem<any>>()

  const displayer: Record<EMomentType, () => JSX.Element> = {
    text: () => item ? <TextItem key={item.id} item={item} /> : <></>,
    image: () => item ? <ImageItem key={item.id} item={item} /> : <></>,
    video: () => item ? <VideoItem key={item.id} item={item} /> : <></>,
    live: () => item ? <div key={item.id}>live</div> : <></>,
  }
  
  const currentMomentType = useMemo<EMomentType>(() => {
    if (item && item.attributes && item.attributes.type) {
      return item.attributes.type
    }
    return 'text'
  }, [item])

  useEffect(() => {
    if (query.has('id')) {
      const id = query.get('id')
      if (id) {
        setLoading(true)
        getMomentDetail(+id).then(res => {
          if (res.data) {
            setItem(res.data)
          } else {
            messageApi.error('请使用正确的食用姿势')
            router.replace('/')
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
      } else {
        if (confirm.current) return
        confirm.current = modal.confirm({
          title: '提示',
          content: "请使用正确的食用姿势",
          closable: true,
          onOk: () => {
            router.replace('/')
          },
          onCancel: () => {
            router.replace('/')
          }
        })
      }
    }
  }, [query])

  return (
    <>
      <Spin spinning={loading} fullscreen={true} />
      <div id="main">
        <div id="content" className="relative flex items-center justify-center w-full h-full shadow-lg border rounded bg-white overflow-hidden">
          {
            item ? displayer[currentMomentType]() : <></>
          }
        </div>
      </div>
      <div id="sidebar">
        <Sidebar />
      </div>
    </>
  )
}

function getMomentDetail(id: number) {
  return api.get<IMomentItem<any>>(`/moment/public/${id}`)
}
