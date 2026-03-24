"use client";

import { App, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

import Sidebar from "@/src/components/sidebar"
import ImageItem from '@/src/components/moments/item/image';
import TextItem from '@/src/components/moments/item/text';
import VideoItem from '@/src/components/moments/item/video';
import { getPublicMomentById } from "@/src/features/moment/api";
import { normalizeApiError } from "@/src/shared/api/error";

export default function Page() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Moment />
    </Suspense>
  )
}

function Moment() {

  const router = useRouter()
  const query = useSearchParams()

  const { modal, message: messageApi } = App.useApp()

  const confirm = useRef<{ destroy: () => void } | null>(null)
  const momentId = query.get('id')

  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<IMomentItem<any>>()

  const displayer: Record<EMomentType, () => JSX.Element> = {
    text: () => item ? <TextItem key={item.id} item={item} /> : <></>,
    image: () => item ? <ImageItem key={item.id} item={item} /> : <></>,
    video: () => item ? <VideoItem key={item.id} item={item} /> : <></>,
    live: () => item ? <div key={item.id}>live</div> : <></>,
    music: () => item ? <div key={item.id}>music</div> : <></>,
  }
  
  const currentMomentType = useMemo<EMomentType>(() => {
    if (item && item.attributes && item.attributes.type) {
      return item.attributes.type
    }
    return 'text'
  }, [item])

  useEffect(() => {
    if (!momentId) {
      setLoading(false)

      if (confirm.current) return
      confirm.current = modal.confirm({
        title: '提示',
        content: "请使用正确的食用姿势",
        closable: true,
        onOk: () => {
          confirm.current = null
          router.replace('/')
        },
        onCancel: () => {
          confirm.current = null
          router.replace('/')
        }
      })

      return
    }

    const parsedId = Number(momentId)
    if (Number.isNaN(parsedId)) {
      messageApi.error('请使用正确的食用姿势')
      setLoading(false)
      router.replace('/')
      return
    }

    setLoading(true)
    getPublicMomentById(parsedId).then(res => {
      if (res.data) {
        setItem(res.data)
      } else {
        messageApi.error('请使用正确的食用姿势')
        router.replace('/')
      }
    }).catch((error) => {
      normalizeApiError(messageApi, error)
    }).finally(() => {
      setLoading(false)
    })
  }, [messageApi, modal, momentId, router])

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
