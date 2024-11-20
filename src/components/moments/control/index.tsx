import { ArrowDownOutlined, ArrowUpOutlined, CommentOutlined } from "@ant-design/icons";
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import Twikoo from "@/src/components/moments/comment/twikoo";

export default function MomentControl () {

  const { state, dispatch }  = useMomentStateContext();

  const [showComment, setShowComment] = useState(false)

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

  return (
    <div className="absolute bottom-3 left-0 w-full flex items-center justify-center space-x-5">
      <div className="group/control flex items-center p-3  backdrop-blur bg-white opacity-70 hover:opacity-100 rounded-full border shadow-md transition-all z-50">
        <button className={cn("border-r border-gray-400 border-opacity-50", publicClassName)} onClick={handlePrev}>
          <ArrowUpOutlined />
        </button>
        <button className={cn(publicClassName)} onClick={handleNext}>
          <ArrowDownOutlined />
        </button>
      </div>
      {/* 评论功能 */}
      <>
        <button
          className={
            cn(
              publicClassName,
              'w-auto p-3 backdrop-blur bg-white opacity-70 hover:opacity-100 rounded-full border shadow-md transition-all z-50'
              )
            }
            onClick={() => setShowComment(!showComment)}
          >
          <CommentOutlined />
        </button>
        { currentMoment && <Twikoo id={currentMoment.id} show={showComment} setShow={setShowComment} /> }
      </>
    </div>
  )
}
