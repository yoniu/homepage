import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';

export default function MomentControl () {

  const { dispatch }  = useMomentStateContext();

  const handlePrev = () => {
    dispatch({ type: "PREVINDEX" });
  }

  const handleNext = () => {
    dispatch({ type: "NEXTINDEX" });
  }

  return (
    <div className="group/control absolute bottom-0 left-0 flex items-center justify-end w-full p-3">
      <button className="bg-opacity-30 bg-white text-white rounded-l border-r border-gray-400 border-opacity-20 w-5 h-5 flex items-center justify-center backdrop-brightness-50 group-hover/control:w-8 group-hover/control:h-8 transition-all" onClick={handlePrev}>
        <ArrowUpOutlined />
      </button>
      <button className="bg-opacity-30 bg-white text-white rounded-r w-5 h-5 flex items-center justify-center backdrop-brightness-50 group-hover/control:w-8 group-hover/control:h-8 transition-all" onClick={handleNext}>
        <ArrowDownOutlined />
      </button>
    </div>
  )
}
