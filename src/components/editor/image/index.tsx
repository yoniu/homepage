"use client";

import { useStateContext as useEditorStateContext } from "@/src/stores/editor"
import { useEffect, useMemo, useState } from "react";
import CarouselImage from "@/src/components/carousel";
import { ShowPlainContent } from "@/src/components/editor/plainContent";
import {
  IFixedTextItem,
  ShowFixedText,
  resolveImageFixedText,
} from "@/src/components/editor/fixedText";

export default function ImageEditor() {

  const { state } = useEditorStateContext() 
  const attributes = state.attributes;

  const photosets = useMemo(
    () => (attributes?.photosets ?? []) as IPhotosetItem[],
    [attributes?.photosets]
  );

  const [bg, setBg] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleCarouselChange = (current: number) => {
    setCurrentIndex(current);
    const selectedPhotoset = photosets[current];
    if (selectedPhotoset) {
      setBg(selectedPhotoset.url)
    }
  }

  useEffect(() => {
    if (photosets.length) {
      setCurrentIndex(0);
      setBg(photosets[0].url)
      return;
    }

    setCurrentIndex(0);
    setBg('');
  }, [photosets])

  const hasCarousel = useMemo(() => {
    return Boolean(photosets.length)
  }, [photosets])

  const currentFixedText = useMemo(() => {
    return resolveImageFixedText(
      photosets[currentIndex],
      (attributes?.fixedText ?? []) as IFixedTextItem[]
    );
  }, [attributes?.fixedText, currentIndex, photosets])

  const hasFixedText = useMemo(() => {
    return Boolean(currentFixedText.length)
  }, [currentFixedText])

  return (
    <>
      <div className="absolute left-0 top-0 w-full h-full rounded-md border overflow-hidden flex items-center justify-center">
        { bg && hasCarousel ? <img src={bg} alt="background" className="absolute w-full h-full object-cover transform scale-125 blur" /> : null }
        {
          hasCarousel ?
          <CarouselImage images={photosets} afterChange={handleCarouselChange} /> :
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-gray-500">No images found</p>
          </div>
        }
        {
          hasFixedText && <ShowFixedText fixedText={currentFixedText} />
        }
        { state.content && <ShowPlainContent content={state.content} /> }
      </div>
    </>
  )
}
