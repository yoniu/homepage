"use client";

import { Spin } from 'antd';
import dynamic from 'next/dynamic';

import { useMomentFeed } from '@/src/features/moment/hooks/useMomentFeed';

const MomentMasonryView = dynamic(
  () => import('@/src/features/moment/components/feed/MomentMasonryView'),
  { ssr: false }
);

const MomentSpotlightView = dynamic(
  () => import('@/src/features/moment/components/feed/MomentSpotlightView'),
  { ssr: false }
);

export default function MomentFeed() {
  const { displayType, loading } = useMomentFeed();

  return (
    <div className="relative w-full sm:w-[80%] h-full">
      <Spin spinning={loading} fullscreen={true} />
      {displayType === 'masonry' ? <MomentMasonryView /> : <MomentSpotlightView />}
    </div>
  );
}
