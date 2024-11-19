import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { cn } from "@/lib/utils";

export default function MomentControl () {

  const { dispatch }  = useMomentStateContext();

  const handlePrev = () => {
    dispatch({ type: "PREVINDEX" });
  }

  const handleNext = () => {
    dispatch({ type: "NEXTINDEX" });
  }
  const publicClassName = "text-black flex items-center justify-center w-8 group-hover/control:w-10 transition-all"

  return (
    <div className="group/control absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center p-3  backdrop-blur bg-white opacity-70 hover:opacity-100 rounded-full border shadow-md transition-all z-50">
      <button className={cn("border-r border-gray-400 border-opacity-50", publicClassName)} onClick={handlePrev}>
        <ArrowUpOutlined />
      </button>
      <button className={cn(publicClassName)} onClick={handleNext}>
        <ArrowDownOutlined />
      </button>
    </div>
  )
}
