import { IMusicItem } from "@/src/components/editor/music";
import MomentControl from "@/src/components/moments/control";
import MusicPlayer from "@/src/components/play/music";
import { useEffect, useState } from "react";
import CarouselImage from "../../carousel";

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
    const photosets = item.attributes?.photosets as IPhotosetItem[];
    const selectedPhotoset = photosets[current];
    setBg(selectedPhotoset.url)
  }

  useEffect(() => {
    if (item.attributes && item.attributes.photosets) {
      const photosets = item.attributes.photosets as IPhotosetItem[];
      if (photosets.length) setBg(photosets[0].url)
    }
  }, [item])

  return (
    <div className="flex flex-col shadow-lg rounded-md overflow-hidden w-full h-full border">
      {(item && item.attributes && item.attributes.music) ? <MusicPlayer {...item.attributes.music} /> : null }
      <div className="relative w-full h-full flex-1 bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden flex items-center justify-center">
          { bg ? <img src={bg} alt="background" className="absolute w-full h-full object-cover transform scale-125 blur" /> : null }
          {
            (item.attributes && item.attributes.photosets) ?
            <CarouselImage key={item.id} images={item.attributes.photosets as IPhotosetItem[]} afterChange={handleCarouselChange} interval={2000} /> :
            null
          }
        </div>
        <MomentControl />
      </div>
    </div>
  )
}
