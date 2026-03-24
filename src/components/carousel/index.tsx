import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { cn } from "@/lib/utils"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react"

interface IProps {
  images: IPhotosetItem[]
  interval?: number
  currentIndex?: number
  beforeChange?: (currentIndex: number, nextIndex: number) => void
  afterChange?: (currentIndex: number) => void
}

export default function CarouselImage({
  images,
  interval,
  currentIndex: controlledCurrentIndex,
  beforeChange,
  afterChange,
}: IProps) {
  const [currentIndex, setCurrentIndex] = useState(controlledCurrentIndex ?? 0)
  const [controlsVisible, setControlsVisible] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [timerSeed, setTimerSeed] = useState(0)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const controlsHideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const activePointerIdRef = useRef<number | null>(null)
  const dragStartXRef = useRef(0)

  const scheduleControlsHide = useCallback(() => {
    if (controlsHideTimerRef.current) {
      clearTimeout(controlsHideTimerRef.current)
    }

    controlsHideTimerRef.current = setTimeout(() => {
      setControlsVisible(false)
    }, 5000)
  }, [])

  const handleMouseActivity = useCallback(() => {
    if (images.length <= 1) {
      return
    }

    setControlsVisible(true)
    scheduleControlsHide()
  }, [images.length, scheduleControlsHide])

  const handleSetCurrentIndex = useCallback((index: number) => {
    if (beforeChange) beforeChange(currentIndex, index)
    setCurrentIndex(index)
    setTimerSeed((seed) => seed + 1)
    if (afterChange) afterChange(index)
  }, [afterChange, beforeChange, currentIndex])

  const handleMovePrevious = useCallback(() => {
    if (images.length <= 1) {
      return
    }

    handleSetCurrentIndex((currentIndex - 1 + images.length) % images.length)
  }, [currentIndex, handleSetCurrentIndex, images.length])

  const handleMoveNext = useCallback(() => {
    if (images.length <= 1) {
      return
    }

    handleSetCurrentIndex((currentIndex + 1) % images.length)
  }, [currentIndex, handleSetCurrentIndex, images.length])

  useEffect(() => {
    if (controlledCurrentIndex === undefined) {
      return
    }

    setCurrentIndex(controlledCurrentIndex)
  }, [controlledCurrentIndex])

  useEffect(() => {
    if (interval && images.length > 1) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      timerRef.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % images.length
        if (beforeChange) beforeChange(currentIndex, nextIndex)
        setCurrentIndex(nextIndex)
        if (afterChange) afterChange(nextIndex)
      }, interval)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      timerRef.current = null
    }
  }, [afterChange, beforeChange, currentIndex, images.length, interval, timerSeed])

  useEffect(() => {
    if (!images.length) {
      if (currentIndex !== 0) {
        setCurrentIndex(0)
      }
      return
    }

    if (currentIndex > images.length - 1) {
      handleSetCurrentIndex(images.length - 1)
    }
  }, [currentIndex, handleSetCurrentIndex, images.length])

  useEffect(() => {
    return () => {
      if (controlsHideTimerRef.current) {
        clearTimeout(controlsHideTimerRef.current)
      }
      controlsHideTimerRef.current = null
    }
  }, [])

  const resetDragState = () => {
    activePointerIdRef.current = null
    dragStartXRef.current = 0
    setDragOffset(0)
    setIsDragging(false)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (images.length <= 1) {
      return
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return
    }

    activePointerIdRef.current = event.pointerId
    dragStartXRef.current = event.clientX
    setDragOffset(0)
    setIsDragging(true)
    handleMouseActivity()
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return
    }

    const nextOffset = event.clientX - dragStartXRef.current
    setDragOffset(nextOffset)
    handleMouseActivity()
  }

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const containerWidth = containerRef.current?.offsetWidth ?? 0
    const threshold = Math.max(60, Math.min(140, containerWidth * 0.12))
    const shouldMovePrevious = dragOffset > threshold
    const shouldMoveNext = dragOffset < -threshold

    if (shouldMovePrevious) {
      handleMovePrevious()
    } else if (shouldMoveNext) {
      handleMoveNext()
    }

    resetDragState()
  }

  const handleMouseLeave = () => {
    if (activePointerIdRef.current !== null) {
      return
    }

    if (controlsHideTimerRef.current) {
      clearTimeout(controlsHideTimerRef.current)
    }
    controlsHideTimerRef.current = null
    setControlsVisible(false)
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      onMouseEnter={handleMouseActivity}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseActivity}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      style={{ touchAction: images.length > 1 ? "pan-y" : "auto" }}
    >
      <div
        className={cn(
          "flex h-full w-full ease-in-out",
          isDragging ? "transition-none" : "transition-all duration-300"
        )}
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="h-full min-w-full bg-center bg-contain bg-no-repeat"
            style={{
              backgroundImage: `url(${image.url})`,
            }}
          ></div>
        ))}
      </div>
      {images.length > 1 ? (
        <>
          <button
            aria-label="Previous image"
            className={cn(
              "absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/75",
              controlsVisible
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            )}
            onClick={() => {
              handleMouseActivity()
              handleMovePrevious()
            }}
            onPointerDown={(event) => {
              event.stopPropagation()
            }}
            type="button"
          >
            <LeftOutlined />
          </button>
          <button
            aria-label="Next image"
            className={cn(
              "absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/75",
              controlsVisible
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            )}
            onClick={() => {
              handleMouseActivity()
              handleMoveNext()
            }}
            onPointerDown={(event) => {
              event.stopPropagation()
            }}
            type="button"
          >
            <RightOutlined />
          </button>
        </>
      ) : null}
      <div className="absolute bottom-1 left-1 right-1 flex items-center space-x-1">
        {images.map((_, index: number) => (
          <button
            key={index}
            className={
              cn(
                "h-2 flex-1 rounded-sm bg-white bg-opacity-50 shadow-md transition-all hover:bg-opacity-100",
                currentIndex === index ? "bg-opacity-100" : ""
              )
            }
            onClick={() => handleSetCurrentIndex(index)}
            onPointerDown={(event) => {
              event.stopPropagation()
            }}
            type="button"
          />
        ))}
      </div>
    </div>
  )
}
