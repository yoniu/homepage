"use client";

import { ArrowDownOutlined, ArrowLeftOutlined, ArrowUpOutlined, CommentOutlined, LoadingOutlined } from "@ant-design/icons";
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useState } from "react";
import Twikoo from "@/src/components/moments/comment/twikoo";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function MomentControl () {

  const { state, dispatch }  = useMomentStateContext();

  const [showComment, setShowComment] = useState(false)

  const router = useRouter()
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isHome = useMemo(() => {
    return pathname === '/' || pathname === '/v2'
  }, [pathname])

  const handleBackHome = useCallback(() => {
    router.push('/')
  }, [router])

  const handlePrev = () => {
    dispatch({ type: "PREVINDEX" });
  }

  const handleNext = () => {
    dispatch({ type: "NEXTINDEX" });
  }

  const publicClassName = "text-black flex items-center justify-center w-8 p-2 hover:bg-gray-300 rounded-full transition-all"

  const currentMoment = useMemo(() => {
    return state.momentList[state.currentIndex];
  }, [state.currentIndex, state.momentList])

  const currentMomentId = useMemo(() => {
    if (pathname === '/' || pathname === '/v2') {
      return currentMoment?.id
    } else {
      // 使用 useSearchParams 替代 window.location.search
      return searchParams.get('id')
    }
  }, [pathname, currentMoment, searchParams])

  // moment 列表分页 加载
  const momentLoading = useMemo(() => {
    return (state.currentIndex + 1 === state.momentList.length) && state.hasNextPage && state.loading;
  }, [state.currentIndex, state.hasNextPage])

  return (
    <div className="relative w-full flex items-center px-3 space-x-5 z-10">
      {
        isHome ?
        <div className="group/control flex items-center bg-white/90 rounded-full border-2 border-white space-x-1 p-1 shadow-lg transition-all">
          <button className={cn(publicClassName)} onClick={handlePrev}>
            <ArrowUpOutlined />
          </button>
          <div className="w-[1px] h-4 bg-gray-300"></div>
          {
            momentLoading ?
            <button className={cn(publicClassName)}>
              <LoadingOutlined /> {/* 分页加载中 */}
            </button>:
            <button className={cn(publicClassName)} onClick={handleNext}>
              <ArrowDownOutlined />
            </button>
          }
        </div> :
        <>
          <button
            className={
              cn(
                publicClassName,
                'w-auto p-3 bg-white/90 border-2 border-white rounded-full shadow-lg transition-all'
              )
            }
            onClick={handleBackHome}
          >
            <ArrowLeftOutlined />
          </button>
        </>
      }
      {/* 评论功能 */}
      <>
        <button
          className={
            cn(
              publicClassName,
              'w-auto p-3 bg-white/90 border-2 border-white rounded-full shadow-lg transition-all'
              )
            }
            onClick={() => setShowComment(!showComment)}
          >
          <CommentOutlined />
        </button>
        { currentMomentId && <Twikoo id={+currentMomentId} show={showComment} setShow={setShowComment} /> }
      </>
    </div>
  )
}
