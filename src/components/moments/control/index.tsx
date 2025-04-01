"use client";

import { ArrowDownOutlined, ArrowLeftOutlined, ArrowUpOutlined, CommentOutlined, LoadingOutlined } from "@ant-design/icons";
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useState } from "react";
import Twikoo from "@/src/components/moments/comment/twikoo";
import { usePathname, useRouter } from "next/navigation";

export default function MomentControl () {

  const { state, dispatch }  = useMomentStateContext();

  const [showComment, setShowComment] = useState(false)

  const router = useRouter()
  const pathname = usePathname();

  const isHome = useMemo(() => {
    return pathname === '/'
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

  const publicClassName = "text-black flex items-center justify-center w-8 group-hover/control:w-10 transition-all"

  const currentMoment = useMemo(() => {
    return state.momentList[state.currentIndex];
  }, [state.currentIndex, state.momentList])

  const currentMomentId = useMemo(() => {
    if (pathname === '/') {
      return currentMoment?.id
    } else {
      // 获取 pathname 中的 query id
      const query = new URLSearchParams(window.location.search);
      return query.get('id')
    }
  }, [pathname, currentMoment])

  // moment 列表分页 加载
  const momentLoading = useMemo(() => {
    return (state.currentIndex + 1 === state.momentList.length) && state.hasNextPage && state.loading;
  }, [state.currentIndex, state.hasNextPage])

  return (
    <div className="absolute bottom-3 left-0 w-full flex items-center justify-center space-x-5">
      {
        isHome ?
        <div className="group/control flex items-center p-3 backdrop-blur bg-white/50 hover:bg-white rounded-full border shadow-md transition-all z-50">
          <button className={cn("border-r border-gray-400 border-opacity-50", publicClassName)} onClick={handlePrev}>
            <ArrowUpOutlined />
          </button>
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
                'w-auto p-3 backdrop-blur bg-white/50 hover:bg-white rounded-full border shadow-md transition-all z-50'
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
              'w-auto p-3 backdrop-blur bg-white/50 hover:bg-white rounded-full border shadow-md transition-all z-50'
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
