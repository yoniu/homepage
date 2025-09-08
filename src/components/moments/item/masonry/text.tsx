import Link from "next/link"
import { Fragment, useMemo } from "react"

import { TTextBackgroundColor } from "@/src/components/editor/backgroundColor"

export interface ITextItem {
  photosets?: IPhotosetItem[]
  backgroundColor?: TTextBackgroundColor
}

interface IProps {
  item: IMomentItem<ITextItem>
}

export default function MasonryTextItem({ item }: IProps) {

  const href = useMemo(() => {
    return `/moment/?id=${item.id}`
  }, [item.id])
  
  
  const backgroundColor = useMemo<TTextBackgroundColor | undefined>(() => {
    if (item.attributes?.backgroundColor) {
      return item.attributes.backgroundColor
    }
  }, [item.attributes])

  const textColor = useMemo(() => {
    return backgroundColor?.textColor ?? '#333'
  }, [backgroundColor])

  const Background = () => {
    switch (backgroundColor?.type) {
      case 'solid':
        return <div className="absolute bottom-0 left-0 w-full h-full inset-0 z-0" style={{ backgroundColor: backgroundColor.color }}></div>
      case 'gradient':
        return <div className="absolute bottom-0 left-0 w-full h-full inset-0 z-0" style={{ background: `linear-gradient(to bottom, ${backgroundColor.colors?.join(',')})` }}></div>
      case 'image':
        return <div className="absolute bottom-0 left-0 w-full h-full inset-0 z-0 opacity-80 scale-110 blur-[2px]" style={{ backgroundImage: `url(${backgroundColor.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      default:
        return <div className="absolute bottom-0 left-0 w-full h-full inset-0 bg-gradient-to-t from-black/5 to-transparent z-0"></div>
    }
  }

  return (
    <Link className="flex flex-col rounded-md overflow-hidden border bg-white mb-1 sm:mb-4" href={href}>
      <div className="relative w-full pb-[133.33%] overflow-hidden">
        <div className="absolute flex items-center justify-center inset-0 p-4 overflow-hidden">
          <div className="relative line-clamp-[10] sm:line-clamp-[9] break-words text-sm sm:text-lg overflow-hidden text-ellipsis z-10" style={{ color: textColor }}>
            { 
              item.content && item.content.split('\n').map((line, index) => (
                <Fragment key={index}>
                  <p>{line}</p>
                </Fragment>
              ))
            }
          </div>
          <Background />
        </div>
      </div>
      <div className="py-2 px-4 text-md text-gray-500">
        {item.title}
      </div>
    </Link>
  )
}
