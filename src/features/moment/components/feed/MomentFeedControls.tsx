"use client";

import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowUpOutlined,
  CommentOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useDebounceFn } from 'ahooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import Twikoo from '@/src/components/moments/comment/twikoo';
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';

import MomentAudioControl from './MomentAudioControl';

export default function MomentFeedControls() {
  const { state, dispatch } = useMomentStateContext();

  const [showComment, setShowComment] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isHome = useMemo(() => pathname === '/', [pathname]);

  const handleBackHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const handlePrev = useCallback(() => {
    dispatch({ type: 'PREVINDEX' });
  }, [dispatch]);

  const handleNext = useCallback(() => {
    dispatch({ type: 'NEXTINDEX' });
  }, [dispatch]);

  const { run: handleWheel } = useDebounceFn(
    (event: WheelEvent) => {
      if (document.getElementById('text-item')?.contains(event.target as Node)) {
        return;
      }

      if (event.deltaY > 0) {
        handleNext();
      } else if (event.deltaY < 0) {
        handlePrev();
      }
    },
    { wait: 500 }
  );

  useEffect(() => {
    document.addEventListener('wheel', handleWheel);

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  const publicClassName =
    'text-black flex items-center justify-center w-8 p-2 hover:bg-gray-300 rounded-full transition-all';

  const currentMoment = useMemo(() => {
    return state.momentList[state.currentIndex];
  }, [state.currentIndex, state.momentList]);

  const isMusic = useMemo(() => {
    return currentMoment?.attributes?.type === 'music';
  }, [currentMoment]);

  const currentMomentId = useMemo(() => {
    if (pathname === '/') {
      return currentMoment?.id;
    }

    return searchParams.get('id');
  }, [currentMoment, pathname, searchParams]);

  const momentLoading = useMemo(() => {
    return state.currentIndex + 1 === state.momentList.length && state.hasNextPage && state.loading;
  }, [state.currentIndex, state.hasNextPage, state.loading, state.momentList.length]);

  return (
    <div className="relative z-10 flex w-full items-center justify-end px-3">
      <div className="relative flex items-center flex-row-reverse sm:flex-row space-x-3 space-x-reverse sm:space-x-5">
        {isHome ? (
          <div className="group/control flex items-center bg-white/90 rounded-full border-2 border-white space-x-1 p-1 shadow-lg transition-all">
            <button className={cn(publicClassName)} onClick={handlePrev}>
              <ArrowUpOutlined />
            </button>
            <div className="w-[1px] h-4 bg-gray-300"></div>
            {momentLoading ? (
              <button className={cn(publicClassName)}>
                <LoadingOutlined />
              </button>
            ) : (
              <button className={cn(publicClassName)} onClick={handleNext}>
                <ArrowDownOutlined />
              </button>
            )}
          </div>
        ) : (
          <button
            className={cn(
              publicClassName,
              'w-auto p-3 bg-white/90 border-2 border-white rounded-full shadow-lg transition-all'
            )}
            onClick={handleBackHome}
          >
            <ArrowLeftOutlined />
          </button>
        )}
        <button
          className={cn(
            publicClassName,
            'w-auto p-3 bg-white/90 border-2 border-white rounded-full shadow-lg transition-all'
          )}
          onClick={() => setShowComment(!showComment)}
        >
          <CommentOutlined />
        </button>
        {currentMomentId && <Twikoo id={+currentMomentId} show={showComment} setShow={setShowComment} />}
        {!isMusic && <MomentAudioControl />}
      </div>
    </div>
  );
}
