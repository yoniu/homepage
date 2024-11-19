"use client";

import { useStateContext as useEditorStateContext } from "@/src/stores/editor"
import { useEffect, useMemo, useState } from "react";
import CarouselImage from "@/src/components/carousel";

export default function ImageEditor() {

  const { state } = useEditorStateContext() 

  const [bg, setBg] = useState('')

  const handleCarouselChange = (current: number) => {
    const photosets = state.attributes.photosets as IPhotosetItem[];
    const selectedPhotoset = photosets[current];
    setBg(selectedPhotoset.url)
  }

  useEffect(() => {
    if (state.attributes && state.attributes.photosets) {
      const photosets = state.attributes.photosets as IPhotosetItem[];
      if (photosets.length) setBg(photosets[0].url)
    }
  }, [state.attributes])

  const hasCarousel = useMemo(() => {
    return state.attributes && state.attributes.photosets && state.attributes.photosets.length
  }, [state.attributes])

  return (
    <>
      <div className="absolute left-0 top-0 w-full h-full rounded-md border overflow-hidden flex items-center justify-center">
        { bg && hasCarousel ? <img src={bg} alt="background" className="absolute w-full h-full object-cover transform scale-125 blur" /> : null }
        {
          hasCarousel ?
          <CarouselImage images={state.attributes.photosets as IPhotosetItem[]} afterChange={handleCarouselChange} /> :
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-gray-500">No images found</p>
          </div>
        }
      </div>
    </>
  )
}
