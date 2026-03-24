"use client";

import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { useCallback, useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Divider } from 'antd';
import MasonryVideoItem from '@/src/components/moments/item/masonry/video';
import Masonry from 'react-masonry-css';
import MasonryTextItem from '@/src/components/moments/item/masonry/text';
import MasonryImageItem from '@/src/components/moments/item/masonry/image';
import MasonryLoadingItem from '@/src/components/moments/item/masonry/loading';
import type { MomentEntity } from '@/src/features/moment/api';
import { EMomentType, type EMomentType as TMomentType } from '@/src/types/moment';

export default function MomentsMasonry() {

  const { state, dispatch }  = useMomentStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const displayer: Record<TMomentType, (key: number, item: MomentEntity) => JSX.Element> = {
    text: (key, item) => <MasonryTextItem key={key} item={item} />,
    image: (key, item) => <MasonryImageItem key={key} item={item} />,
    video: (key, item) => <MasonryVideoItem key={key} item={item} />,
    live: (key) => <div key={key}>live</div>,
    music: (key) => <div key={key}>music</div>,
  }

  const loadNext = useCallback(() => {
    if (state.hasNextPage) {
      dispatch({
        type: 'SETINDEX',
        index: state.momentList.length - 1,
      })
    }
  }, [dispatch, state.hasNextPage, state.momentList.length])

  const breakpointColumnsObj = {
    default: 2,
  };

  // 在客户端渲染之前显示加载状态
  if (!isClient) {
    return (
      <div id="content" className="relative w-[auto] h-[calc(100%_+_1rem)] sm:w-full sm:h-full overflow-y-auto -m-2 sm:m-0">
        <div className="flex items-center justify-center h-full">
          <MasonryLoadingItem />
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="content" className="relative w-[auto] h-[calc(100%_+_1rem)] sm:w-full sm:h-full overflow-y-auto -m-2 sm:m-0">
        <InfiniteScroll
          dataLength={state.momentList.length}
          next={loadNext}
          loader={<MasonryLoadingItem />}
          hasMore={state.hasNextPage}
          endMessage={<Divider plain>我也是有底线的 🤐</Divider>}
          scrollableTarget="content"
          scrollThreshold={0.8}
        >
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto"
            columnClassName="sm:pr-4 pr-1 bg-clip-padding"
          >
            {
              state.momentList.map((item) => {
                const type: TMomentType = item.attributes?.type ?? EMomentType.Text;
                return displayer[type](item.id, item as MomentEntity)
              })
            }
          </Masonry>
        </InfiniteScroll>
      </div>
    </>
  )
}
