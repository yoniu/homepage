import { cn } from "@/lib/utils"
import { useCallback, useEffect, useRef, useState } from "react"

interface IProps {
  images: IPhotosetItem[]
  interval?: number
  beforeChange?: (currentIndex: number, nextIndex: number) => void
  afterChange?: (currentIndex: number) => void
}

export default function CarouselImage({ images, interval, beforeChange, afterChange }: IProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleSetCurrentIndex = useCallback((index: number) => {
    if (beforeChange) beforeChange(currentIndex, index)
    setCurrentIndex(index)
    if (afterChange) afterChange(index)
  }, [beforeChange, currentIndex, afterChange])

  useEffect(() => {
    if (interval) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % images.length;
        if (beforeChange) beforeChange(currentIndex, nextIndex);
        setCurrentIndex(nextIndex);
        if (afterChange) afterChange(nextIndex);
      }, interval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [interval, images.length, currentIndex, beforeChange, afterChange]);

  return (
    <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
      {/* 轮播内容 */}
      <div
        className="flex transition-all duration-300 ease-in-out w-full h-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`, // 控制滑动
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="min-w-full h-full bg-center bg-contain bg-no-repeat"
            style={{
              backgroundImage: `url(${image.url})`,
            }}
          ></div>
        ))}
      </div>
      {/* 控制按钮 */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center">
        {images.map((_, index) => (
          <button
            key={index}
            className="p-2"
            onClick={() => handleSetCurrentIndex(index)}
          >
            {/* 用于扩大点击范围 */}
            <div
              className={
                cn(
                  `w-2 h-2 rounded-full bg-white bg-opacity-50 hover:bg-opacity-100 transition-all`,
                  currentIndex === index ? 'h-6 bg-opacity-100' : ''
                )
              }
            ></div>
          </button>
        ))}
      </div>
    </div>
  )
}
