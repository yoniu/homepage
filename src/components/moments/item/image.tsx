import { IMusicItem } from "@/src/components/editor/music";
import MomentControl from "@/src/components/moments/control";
import MusicPlayer from "@/src/components/play/music";
import { useEffect, useMemo, useState } from "react";
import CarouselImage from "@/src/components/carousel";
import { ShowPlainContent } from "@/src/components/editor/plainContent";
import dayFormat from "@/src/utils/dayFormat";
import {
  IFixedTextItem,
  ShowFixedText,
  resolveImageFixedText,
} from "@/src/components/editor/fixedText";

export interface IImageItem {
  music?: Partial<IMusicItem>
  photosets?: IPhotosetItem[]
  fixedText?: IFixedTextItem[]
}

interface IProps {
  item: IMomentItem<IImageItem>
}

export default function ImageItem({ item }: IProps) {

  const photosets = useMemo(
    () => (item.attributes?.photosets ?? []) as IPhotosetItem[],
    [item.attributes?.photosets]
  )
  const [bg, setBg] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleCarouselChange = (current: number) => {
    setCurrentIndex(current)
    const selectedPhotoset = photosets[current];
    if (selectedPhotoset) {
      setBg(selectedPhotoset.url)
    }
  }

  useEffect(() => {
    if (photosets.length) {
      setCurrentIndex(0)
      setBg(photosets[0].url)
      return;
    }

    setCurrentIndex(0)
    setBg('')
  }, [photosets])

  const currentFixedText = useMemo(() => {
    return resolveImageFixedText(
      photosets[currentIndex],
      (item.attributes?.fixedText ?? []) as IFixedTextItem[]
    )
  }, [currentIndex, item.attributes?.fixedText, photosets])

  return (
    <div className="flex flex-col rounded-md overflow-hidden w-full h-full">
      {(item && item.attributes && item.attributes.music) ? <MusicPlayer {...item.attributes.music} /> : null }
      <div className="relative w-full h-full flex-1 bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden flex items-center justify-center">
          { bg ? <img src={bg} alt="background" className="absolute w-full h-full object-cover transform scale-125 blur" /> : null }
          {photosets.length ? (
            <CarouselImage
              key={item.id}
              images={photosets}
              afterChange={handleCarouselChange}
              interval={2000}
            />
          ) : null}
          {
            Boolean(currentFixedText.length) && <ShowFixedText fixedText={currentFixedText} />
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
          </ShowPlainContent>
        }
        <MomentControl />
      </div>
    </div>
  )
}
