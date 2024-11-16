"use client";

import AdminSidebar from '@/src/components/sidebar/admin';
import { StateProvider as PlayerStateProvider } from '@/src/stores/audio';
import { StateProvider as UserStateProvider } from '@/src/stores/user';

interface IProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: IProps) {

  return (
    <UserStateProvider>
      <PlayerStateProvider>
        <div id="main">
          <div className="relative flex flex-col w-full h-full">
            editor {(await params).id}
          </div>
        </div>
        <div id="sidebar">
          <AdminSidebar />
        </div>
      </PlayerStateProvider>
    </UserStateProvider>
  )
}
