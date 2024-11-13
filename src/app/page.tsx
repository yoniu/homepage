"use client";

import { StateProvider as PlayerStateProvider } from '@/src/stores/audio';


export default function Page() {

  return (
    <PlayerStateProvider>
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-sm text-gray-400">comming soon...</span>
      </div>
    </PlayerStateProvider>
  )
}
