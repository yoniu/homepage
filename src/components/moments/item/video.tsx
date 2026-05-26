import { EnvironmentOutlined } from "@ant-design/icons"
import MomentControl from "@/src/components/moments/control";
import { useEffect, useState } from "react";
import { ShowPlainContent } from "@/src/components/editor/plainContent";
import dayFormat from "@/src/utils/dayFormat";
import { IFixedTextItem, ShowFixedText } from "@/src/components/editor/fixedText";
import VideoPlayer from "@/src/components/play/video";

export interface IVideoState {
  video?: Partial<IVideoItem>
  fixedText?: IFixedTextItem[]
  location?: IMomentLocation
}

interface IProps {
  item: IMomentItem<IVideoState>
}

export default function VideoItem({ item }: IProps) {

  const [bg, setBg] = useState('')
  const video = item.attributes?.video

  useEffect(() => {
    if (video) {
      if (video.cover) setBg(video.cover)
    }
  }, [video])

  return (
    <div className="flex flex-col rounded-md overflow-hidden w-full h-full">
      <div className="relative w-full h-full flex-1 bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden flex items-center justify-center">
          { bg ? <img src={bg} alt="background" className="absolute w-full h-full object-cover transform scale-125 blur" /> : null }
          {video?.url ? <VideoPlayer url={video.url} autoPlay /> : null }
          {
            (item.attributes && item.attributes.fixedText) && <ShowFixedText fixedText={item.attributes.fixedText as IFixedTextItem[]} />
          }
        </div>
        {
          item.content &&
          <ShowPlainContent className="pb-16" content={item.content}>
            <div className="space-x-3 flex items-center leading-4 mb-2">
              <span className="font-bold">{ item.author.name }</span>
              <i className="w-1 h-1 bg-gray-500 rounded-full"></i>
              <span className="text-sm py-1 px-2 bg-white/20 rounded">{ dayFormat(item.create_time) }</span>
            </div>
            {
              item.attributes?.location?.address &&
              <div className="flex items-center space-x-1 text-sm mb-2 opacity-80">
                <EnvironmentOutlined />
                <span>{item.attributes.location.address}</span>
              </div>
            }
          </ShowPlainContent>
        }
        {
          !item.content && item.attributes?.location?.address &&
          <div className="pointer-events-none absolute left-0 bottom-16 w-full px-6 text-white z-index-10">
            <div className="flex items-center space-x-1 text-sm">
              <EnvironmentOutlined />
              <span>{item.attributes.location.address}</span>
            </div>
          </div>
        }
        <MomentControl />
      </div>
    </div>
  )
}
