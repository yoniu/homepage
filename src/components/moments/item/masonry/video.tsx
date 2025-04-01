import { VideoCameraOutlined } from "@ant-design/icons"
import Link from "next/link"
import { useMemo } from "react"

export interface IVideoState {
  video?: IVideoItem
}

interface IProps {
  item: IMomentItem<IVideoState>
}

export default function MasonryVideoItem({ item }: IProps) {

  const content = useMemo(() => {
    if (item.content) {
      // 将内容按行分割，只取第一行
      const lines = item.content.split('\n')
      return lines[0] + (lines.length > 1 ? '...' : '')
    }
    return ''
  }, [item.content])

  const href = useMemo(() => {
    return `/moment/?id=${item.id}`
  }, [item.id])

  return (
    <Link className="flex flex-col rounded-md overflow-hidden bg-white border mb-1 sm:mb-4 group/item" href={href}>
      <div className="relative w-full pb-[75%]">
        <img className="absolute inset-0 w-full h-full object-cover" src={item.attributes?.video?.cover} />
        <div className="absolute top-0 left-0 w-full h-full bg-black/25 text-white group-hover/item:bg-black/10 transition-all">
          <VideoCameraOutlined className="absolute top-2 right-2" />
          {
            content &&
            <div className="absolute bottom-2 left-2 text-sm">
              {content}
            </div>
          }
        </div>
      </div>
      {
        item.title && (
          <div className="p-2 text-sm text-gray-500">
            {item.title}
          </div>
        )
      }
    </Link>
  )
}
