"use client";

import { useStateContext as useEditorStateContext } from "@/src/stores/editor"
import { useEffect, useMemo, useState } from "react";
import CarouselImage from "@/src/components/carousel";
import { ShowPlainContent } from "@/src/components/editor/plainContent";
import { IFixedTextItem, ShowFixedText } from "@/src/components/editor/fixedText";

export default function ImageEditor() {

  const { state } = useEditorStateContext() 
  const attributes = state.attributes;

  const [bg, setBg] = useState('')

  const handleCarouselChange = (current: number) => {
    const photosets = (attributes?.photosets ?? []) as IPhotosetItem[];
    const selectedPhotoset = photosets[current];
    if (selectedPhotoset) {
      setBg(selectedPhotoset.url)
    }
  }

  useEffect(() => {
    if (attributes?.photosets) {
      const photosets = attributes.photosets as IPhotosetItem[];
      if (photosets.length) setBg(photosets[0].url)
    }
  }, [attributes])

  const hasCarousel = useMemo(() => {
    return Boolean(attributes?.photosets?.length)
  }, [attributes?.photosets])

  const hasFixedText = useMemo(() => {
    return Boolean(attributes?.fixedText?.length)
  }, [attributes?.fixedText])

  return (
    <>
      <div className="absolute left-0 top-0 w-full h-full rounded-md border overflow-hidden flex items-center justify-center">
        { bg && hasCarousel ? <img src={bg} alt="background" className="absolute w-full h-full object-cover transform scale-125 blur" /> : null }
        {
          hasCarousel ?
          <CarouselImage images={(attributes?.photosets ?? []) as IPhotosetItem[]} afterChange={handleCarouselChange} /> :
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-gray-500">No images found</p>
          </div>
        }
        {
          hasFixedText && <ShowFixedText fixedText={(attributes?.fixedText ?? []) as IFixedTextItem[]} />
        }
        { state.content && <ShowPlainContent content={state.content} /> }
      </div>
    </>
  )
}
