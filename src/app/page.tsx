"use client";

import { StateProvider as PlayerStateProvider } from '@/src/stores/audio';
import { StateProvider as UserStateProvider } from '@/src/stores/user';

import MomentLoading from '@/src/components/moments/item/loading';

import Sidebar from "@/src/components/sidebar"

export default function Page() {

  return (
    <UserStateProvider>
      <PlayerStateProvider>
        <div id="main">
          <div className="flex items-center justify-center w-full h-full">
            <MomentLoading />
          </div>
        </div>
        <div id="sidebar">
          <Sidebar />
        </div>
      </PlayerStateProvider>
    </UserStateProvider>
  )
}
