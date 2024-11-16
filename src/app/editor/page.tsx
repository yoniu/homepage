"use client";

import AdminSidebar from '@/src/components/sidebar/admin';
import { StateProvider as PlayerStateProvider } from '@/src/stores/audio';
import { StateProvider as UserStateProvider } from '@/src/stores/user';
import { logged } from '@/src/utils/login';
import { App } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {

  const router = useRouter()
  const query = useSearchParams()
  const { modal, message } = App.useApp()

  const id  = query.get('id')

  // 守卫：如果无 ID 则弹窗是否创建
  useEffect(() => {
    if (!logged()) {
      message.error('请先登录')
      return router.replace('/')
    }
    if (query.get('id') === null) {
      modal.confirm({
        title: 'No Id Number',
        content: "Create A New Moment?",
        closable: true,
        onOk: () => {},
        onCancel: () => {
          router.replace('/admin')
        }
      })
    }
  }, [])

  return (
    <UserStateProvider>
      <PlayerStateProvider>
        <div id="main">
          <div className="relative flex flex-col w-full h-full">
            editor {id ?? 'no id'}
          </div>
        </div>
        <div id="sidebar">
          <AdminSidebar />
        </div>
      </PlayerStateProvider>
    </UserStateProvider>
  )
}
