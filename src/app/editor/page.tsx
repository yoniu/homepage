"use client";

import AdminSidebar from '@/src/components/sidebar/admin';
import { useStateContext as useEditorStateContext } from '@/src/stores/editor';
import { logged } from '@/src/utils/login';
import { App } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import api from '@/src/utils/api';
import TextEditor from '@/src/components/moments/editor/text';

export default function Page() {

  const router = useRouter()
  const query = useSearchParams()
  const { modal, message } = App.useApp()

  const { dispatch } = useEditorStateContext()

  // 守卫：如果无 ID 则弹窗是否创建
  useEffect(() => {
    if (!logged()) {
      message.error('请先登录')
      return router.replace('/')
    }
    const id  = query.get('id')
    if (id === null) {
      modal.confirm({
        title: 'No Id Number',
        content: "Create A New Moment?",
        closable: true,
        onOk: () => {},
        onCancel: () => {
          router.replace('/admin')
        }
      })
    } else {
      getMomentDetail(+id).then(res => {
        if (res.data) {
          dispatch({
            type: 'UPDATE',
            states: res.data
          })
        } else {
          message.error('Moment Not Found')
          router.replace('/admin')
        }
      })
    }
  }, [])

  return (
    <>
      <div id="main">
        <div className="relative flex flex-col w-full h-full">
          <TextEditor />
        </div>
      </div>
      <div id="sidebar">
        <AdminSidebar />
      </div>
    </>
  )
}

function getMomentDetail(id: number) {
  return api.get<IMomentItem<any>>(`/moment/owner/${id}`)
}
