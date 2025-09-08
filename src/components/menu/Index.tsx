import Friends from "./Friends";
import Author from "./Author";
import List from "./List";
import { cn } from "@/lib/utils";
import { useStateContext as useUserstateContext } from "@/src/stores/user";
import { CloseOutlined } from "@ant-design/icons";

/**
 * 菜单
 */
export default function Menu() {

  const { state, dispatch } = useUserstateContext()

  const handleClose = () => {
    dispatch({ type: 'SETMENUSHOW', show: false })
  }

  return (
    <div className={
      cn(
        "absolute top-0 left-0 w-full bg-[#f3f4f6] sm:relative sm:w-[20%] h-full p-4 sm:translate-x-0 transition-all z-50",
        state.menuShow ? '  translate-x-0' : '-translate-x-full transition-all'
      )
    }>
      <div className="relative bg-white/50 p-4 rounded-3xl shadow-lg h-full border-2 border-white space-y-4 overflow-y-auto">
        <button onClick={handleClose} className="sm:hidden absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white/50 border-2 border-white rounded-full shadow-lg transition-all">
          <CloseOutlined />
        </button>
        <Author />
        <List />
        <Friends />
      </div>
    </div>
  )
}
