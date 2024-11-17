import { IPhotosetItem } from "@/src/components/editor/text/sidebar";
import { IMusicItem } from "@/src/components/editor/music";
import MomentControl from "@/src/components/moments/control";
import CONST from "@/src/configs/consts";
import markdownit from 'markdown-it';

export interface ITextItem {
  music?: IMusicItem
  photosets?: IPhotosetItem
}

interface IProps {
  item: IMomentItem<ITextItem>
}

export default function TextItem({ item }: IProps) {

  const md = markdownit()

  const Music = () => {
    if (item && item.attributes && item.attributes.music) {
      const { name, singer, cover } = item.attributes.music
      return (
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <div className="flex items-center space-x-2">
            <img className="w-6 h-6 rounded" src={cover ?? CONST.LUTHER} />
            <div className="text-gray-500">{name} - {singer}</div>
          </div>
          <div className="w-16 h-6 bg-gray-300 rounded animate-pulse"></div>
        </div>
      )
    } else {
      return <></>
    }
  }

  return (
    <div className="flex flex-col shadow-lg rounded-md overflow-hidden w-full h-full border">
      <Music />
      <div className="relative w-full h-full flex-1 bg-white">
        <div className="absolute top-0 left-0 w-full h-full p-3 overflow-y-auto overflow-x-hidden">
          { item.title && <h3 className="text-xl font-bold mb-2">{item.title}</h3> }
          { item.content && <div dangerouslySetInnerHTML={{ __html: md.render(item.content) }} /> }
        </div>
        {/* todo: 显示 photosets */}
        <MomentControl />
      </div>
    </div>
  )
}
