"use client";

import { StateProvider as PlayerStateProvider } from '@/src/stores/audio';
import { StateProvider as UserStateProvider } from '@/src/stores/user';

import MomentLoading from '@/src/components/moments/item/loading';


export default function Page() {

  return (
    <UserStateProvider>
      <PlayerStateProvider>
        <div className="flex items-center justify-center w-full h-full">
          <MomentLoading />
          {/* <span className="text-sm text-gray-400">comming soon...</span> */}
        </div>
      </PlayerStateProvider>
    </UserStateProvider>
  )
}
