"use client";

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo } from "react";

import CarouselImage from "@/src/components/carousel";
import {
  IFixedTextItem,
  ShowFixedText,
  resolveImageFixedText,
} from "@/src/components/editor/fixedText";
import { ShowPlainContent } from "@/src/components/editor/plainContent";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";

export default function ImageEditor() {
  const { state, dispatch } = useEditorStateContext();
  const attributes = state.attributes;

  const photosets = useMemo(
    () => (attributes?.photosets ?? []) as IPhotosetItem[],
    [attributes?.photosets]
  );
  const selectedPhotosetId = state.selectedPhotosetId;

  const currentIndex = useMemo(() => {
    if (!photosets.length) {
      return 0;
    }

    const matchedIndex = photosets.findIndex((item) => item.id === selectedPhotosetId);
    return matchedIndex > -1 ? matchedIndex : 0;
  }, [photosets, selectedPhotosetId]);

  const currentPhotoset = photosets[currentIndex] ?? null;
  const bg = currentPhotoset?.url ?? "";

  const handleCarouselChange = (current: number) => {
    const selectedPhotoset = photosets[current];
    if (!selectedPhotoset) {
      return;
    }

    dispatch({
      type: "UPDATE",
      states: {
        selectedPhotosetId: selectedPhotoset.id,
      },
    });
  };

  useEffect(() => {
    if (!photosets.length) {
      if (selectedPhotosetId !== undefined) {
        dispatch({
          type: "UPDATE",
          states: {
            selectedPhotosetId: undefined,
          },
        });
      }
      return;
    }

    const hasSelectedPhotoset = photosets.some((item) => item.id === selectedPhotosetId);
    if (!hasSelectedPhotoset) {
      dispatch({
        type: "UPDATE",
        states: {
          selectedPhotosetId: photosets[0].id,
        },
      });
    }
  }, [dispatch, photosets, selectedPhotosetId]);

  const hasCarousel = useMemo(() => Boolean(photosets.length), [photosets]);

  const currentFixedText = useMemo(
    () =>
      resolveImageFixedText(
        photosets[currentIndex],
        (attributes?.fixedText ?? []) as IFixedTextItem[]
      ),
    [attributes?.fixedText, currentIndex, photosets]
  );

  const hasFixedText = useMemo(() => Boolean(currentFixedText.length), [currentFixedText]);
  const canMoveCurrentPhotosetUp = currentIndex > 0;
  const canMoveCurrentPhotosetDown = currentIndex < photosets.length - 1;

  const handleMoveCurrentPhotoset = (direction: -1 | 1) => {
    if (!currentPhotoset) {
      return;
    }

    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= photosets.length) {
      return;
    }

    const prevAttributes = attributes ?? null;
    const nextPhotosets = [...photosets];

    [nextPhotosets[currentIndex], nextPhotosets[nextIndex]] = [
      nextPhotosets[nextIndex],
      nextPhotosets[currentIndex],
    ];

    dispatch({
      type: "UPDATE",
      states: {
        attributes: {
          ...prevAttributes,
          photosets: nextPhotosets,
        },
        selectedPhotosetId: currentPhotoset.id,
      },
    });
  };

  const handleDeleteCurrentPhotoset = () => {
    if (!currentPhotoset) {
      return;
    }

    const prevAttributes = attributes ?? null;
    const nextPhotosets = photosets.filter((item) => item.id !== currentPhotoset.id);
    const nextSelectedPhotoset = nextPhotosets[Math.min(currentIndex, nextPhotosets.length - 1)];

    dispatch({
      type: "UPDATE",
      states: {
        attributes: {
          ...prevAttributes,
          photosets: nextPhotosets,
        },
        selectedPhotosetId: nextSelectedPhotoset?.id,
      },
    });
  };

  return (
    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center overflow-hidden rounded-md border">
      {bg && hasCarousel ? (
        <img
          src={bg}
          alt="background"
          className="absolute h-full w-full scale-125 transform object-cover blur"
        />
      ) : null}
      {hasCarousel ? (
        <div className="pointer-events-none absolute inset-0 z-30">
          <div className="pointer-events-auto absolute right-4 top-4 flex items-center gap-2">
            <button
              aria-label="上移当前图片"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-35"
              disabled={!canMoveCurrentPhotosetUp}
              onClick={() => handleMoveCurrentPhotoset(-1)}
              type="button"
            >
              <ArrowUpOutlined />
            </button>
            <button
              aria-label="下移当前图片"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-35"
              disabled={!canMoveCurrentPhotosetDown}
              onClick={() => handleMoveCurrentPhotoset(1)}
              type="button"
            >
              <ArrowDownOutlined />
            </button>
            <button
              aria-label="删除当前图片"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/75"
              onClick={handleDeleteCurrentPhotoset}
              type="button"
            >
              <DeleteOutlined />
            </button>
          </div>
        </div>
      ) : null}
      {hasCarousel ? (
        <CarouselImage
          images={photosets}
          currentIndex={currentIndex}
          afterChange={handleCarouselChange}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-gray-500">No images found</p>
        </div>
      )}
      {hasFixedText ? <ShowFixedText fixedText={currentFixedText} /> : null}
      {state.content ? <ShowPlainContent content={state.content} /> : null}
    </div>
  );
}
