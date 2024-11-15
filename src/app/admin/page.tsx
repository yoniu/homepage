"use client";

import AdminMomentList from '@/src/components/moments/list/admin';
import AdminSidebar from '@/src/components/sidebar/admin';
import { StateProvider as PlayerStateProvider } from '@/src/stores/audio';
import { StateProvider as UserStateProvider } from '@/src/stores/user';

export default function Page() {

  return (
    <UserStateProvider>
      <PlayerStateProvider>
        <div id="main">
          <div className="flex flex-col w-full h-full">
            <AdminMomentList />
          </div>
        </div>
        <div id="sidebar">
          <AdminSidebar />
        </div>
      </PlayerStateProvider>
    </UserStateProvider>
  )
}
