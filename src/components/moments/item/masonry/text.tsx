import Link from "next/link"
import { Fragment, useMemo } from "react"

export interface ITextItem {
  photosets?: IPhotosetItem[]
}

interface IProps {
  item: IMomentItem<ITextItem>
}

export default function MasonryTextItem({ item }: IProps) {

  const href = useMemo(() => {
    return `/moment/?id=${item.id}`
  }, [item.id])

  return (
    <Link className="flex flex-col rounded-md overflow-hidden border mb-4" href={href}>
      <div className="relative w-full pb-[100%] sm:pb-[133.33%] overflow-hidden">
        <div className="absolute flex items-center justify-center inset-0 p-4 overflow-hidden">
          <div className="relative line-clamp-[9] break-words text-2xl sm:text-lg overflow-hidden text-ellipsis z-10">
            { 
              item.content && item.content.split('\n').map((line, index) => (
                <Fragment key={index}>
                  <span>{line}</span>
                  <br />
                </Fragment>
              ))
            }
          </div>
          <div className="absolute bottom-0 left-0 w-full h-full inset-0 bg-gradient-to-t from-black/5 to-transparent z-0"></div>
        </div>
      </div>
      <div className="py-2 px-4 text-md text-gray-500">
        {item.title}
      </div>
    </Link>
  )
}
