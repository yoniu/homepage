import Friends from "./Friends";
import Author from "./Author";
import List from "./List";

/**
 * 菜单
 */
export default function Menu() {
  return (
    <div className="w-[20%] h-full p-4">
      <div className="bg-white/50 p-4 rounded-3xl shadow-lg h-full border-2 border-white space-y-4 overflow-y-auto">
        <Author />
        <List />
        <Friends />
      </div>
    </div>
  )
}
