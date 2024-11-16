"use client";

import AdminMomentList from '@/src/components/moments/list/admin';
import AdminSidebar from '@/src/components/sidebar/admin';
import { logged } from '@/src/utils/login';
import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {

  const router = useRouter()

  const { message } = App.useApp()

  useEffect(() => {
    if (!logged()) {
      message.error('请先登录')
      return router.replace('/')
    }
  })

  return (
    <>
      <div id="main">
        <div className="relative flex flex-col w-full h-full">
          <AdminMomentList />
        </div>
      </div>
      <div id="sidebar">
        <AdminSidebar />
      </div>
    </>
  )
}
