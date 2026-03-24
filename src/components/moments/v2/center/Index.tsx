"use client";

import { Spin } from 'antd';
import dynamic from 'next/dynamic';

import { useMomentFeed } from '@/src/features/moment/hooks/useMomentFeed';

const MomentsMasonry = dynamic(() => import("@/src/components/moments/v2/center/Masonry"), {
  ssr: false,
})

const MomentsTiktok = dynamic(() => import("@/src/components/moments/v2/center/Tiktok"), {
  ssr: false,
})

export default function Center() {
  const { displayType, loading } = useMomentFeed();

  return (
    <>
      <div className="relative w-full sm:w-[80%] h-full">
        <Spin spinning={loading} fullscreen={true} />
        {
          displayType === 'masonry' ? 
          <MomentsMasonry /> :
          <MomentsTiktok />
        }
      </div>
    </>
  )
}
