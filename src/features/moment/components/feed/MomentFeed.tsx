"use client";

import { Spin } from 'antd';
import dynamic from 'next/dynamic';

import { useMomentFeed } from '@/src/features/moment/hooks/useMomentFeed';
import MomentMobileMenuButton from '@/src/features/moment/components/feed/MomentMobileMenuButton';

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
      <div className="pointer-events-none absolute top-0 left-0 z-30 flex w-full px-3 py-4 sm:hidden">
        <div className="pointer-events-auto">
          <MomentMobileMenuButton />
        </div>
      </div>
      {displayType === 'masonry' ? <MomentMasonryView /> : <MomentSpotlightView />}
    </div>
  );
}
