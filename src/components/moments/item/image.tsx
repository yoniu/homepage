import { IMusicItem } from "@/src/components/editor/music";
import MomentControl from "@/src/components/moments/control";
import { Carousel } from "antd";
import MusicPlayer from "@/src/components/play/music";
import { memo, useEffect, useState } from "react";

export interface IImageItem {
  music?: IMusicItem
  photosets?: IPhotosetItem[]
}

interface IProps {
  item: IMomentItem<IImageItem>
}

export default function ImageItem({ item }: IProps) {

  const [bg, setBg] = useState('')

  const handleCarouselChange = (current: number) => {
    console.log('改变')
    const photosets = item.attributes?.photosets as IPhotosetItem[];
    const selectedPhotoset = photosets[current];
    setBg(selectedPhotoset.url)
  }

  useEffect(() => {
    if (item.attributes && item.attributes.photosets) {
      const photosets = item.attributes.photosets as IPhotosetItem[];
      if (photosets.length) setBg(photosets[0].url)
    }
  }, [item.attributes])

  const Photosets = memo(() => {
    if (item.attributes && item.attributes.photosets) {
      return (
        <Carousel
         rootClassName="w-full"
         dotPosition="bottom"
         adaptiveHeight={true}
         autoplay={true}
         autoplaySpeed={2000}
         afterChange={handleCarouselChange}
        >
          {
            (item.attributes.photosets as IPhotosetItem[]).map((photoset) => (
              <div className="h-full flex justify-center items-center" key={photoset.id}>
                <img src={photoset.url} alt={photoset.name} className="w-full h-full object-contain" />
              </div>
            ))
          }
        </Carousel>
      )
    }
    return (
      <></>
    )
  })
  Photosets.displayName = "Photosets";

  return (
    <div className="flex flex-col shadow-lg rounded-md overflow-hidden w-full h-full border">
      {(item && item.attributes && item.attributes.music) ? <MusicPlayer {...item.attributes.music} /> : null }
      <div className="relative w-full h-full flex-1 bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden flex items-center justify-center">
          { bg ? <img src={bg} alt="background" className="absolute w-full h-full object-cover transform scale-125 blur" /> : null }
          <Photosets />
        </div>
        <MomentControl />
      </div>
    </div>
  )
}
