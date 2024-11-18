"use client";

import { useStateContext as useEditorStateContext } from '@/src/stores/editor';
import { logged } from '@/src/utils/login';
import { App, Spin } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import api from '@/src/utils/api';
import TextEditor from '@/src/components/editor/text';
import EditorSidebar from '@/src/components/sidebar/editor';
import { TResponseError } from '@/src/utils/axiosInstance';
import ImageEditor from '@/src/components/editor/image';

export default function Page() {
  return (
    <Suspense>
      <Editor />
    </Suspense>
  )
}

function Editor() {

  const router = useRouter()
  const query = useSearchParams()
  const { modal, message: messageApi } = App.useApp()

  const { state, dispatch } = useEditorStateContext()

  const [loading, setLoading] = useState(true)

  const confirm = useRef<any>(null)

  const editors: Record<EMomentType, JSX.Element> = {
    text: <TextEditor />,
    image: <ImageEditor />,
    video: <TextEditor />,
    live: <TextEditor />,
  }

  const handleCreateMoment = () => {
    setLoading(true)
    createNullMoment().then(res => {
      const { id } = res.data
      router.replace(`/editor?id=${id}`)
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

  // 守卫：如果无 ID 则弹窗是否创建
  useEffect(() => {
    if (!logged()) {
      messageApi.error('请先登录')
      return router.replace('/')
    }
    const id  = query.get('id')
    if (id === null) {
      if (confirm.current) return
      confirm.current = modal.confirm({
        title: '检测到无传入 id',
        content: "是否新建为草稿？",
        closable: true,
        onOk: handleCreateMoment,
        onCancel: () => {
          router.replace('/admin')
        }
      })
    } else {
      setLoading(true)
      getMomentDetail(+id).then(res => {
        if (res.data) {
          dispatch({
            type: 'UPDATE',
            states: res.data
          })
        } else {
          messageApi.error('未找到该 Moment')
          router.replace('/admin')
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
  }, [query])

  return (
    <>
      <Spin spinning={loading} fullscreen={true} />
      <div id="main">
        <div className="relative flex flex-col w-full h-full">
          {
            (state.attributes && state.attributes.type) ?
            editors[state.attributes.type as EMomentType] :
            editors.text
          }
        </div>
      </div>
      <div id="sidebar">
        <EditorSidebar />
      </div>
    </>
  )
}

function getMomentDetail(id: number) {
  return api.get<IMomentItem<any>>(`/moment/owner/${id}`)
}

function createNullMoment() {
  return api.post<IMomentItem<any>>(`/moment`)
}
