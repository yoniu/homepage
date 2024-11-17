import MomentControl from "../control";

export default function MomentLoading() {
  return (
    <div className="flex flex-col shadow-lg rounded-md overflow-hidden w-full h-full border">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex space-x-1">
          <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-16 h-6 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="w-16 h-6 bg-gray-300 rounded animate-pulse"></div>
      </div>
      <div className="relative w-full bg-gray-300 animate-pulse flex-1 flex items-center justify-center">
        <span className="absolute text-sm bg-orange-400 py-1 px-2 text-white left-0 top-0 translate-x-6 translate-y-9">comming soon</span>
        <span className="absolute text-sm bg-orange-400 py-1 px-2 text-white left-0 top-0 translate-x-32 translate-y-80">抖音小红书常驻用户罢了</span>
        <MomentControl />
      </div>
    </div>
  )
}
