"use client";

import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Divider } from 'antd';
import MasonryVideoItem from '@/src/components/moments/item/masonry/video';
import Masonry from 'react-masonry-css';
import MasonryTextItem from '@/src/components/moments/item/masonry/text';
import MasonryImageItem from '@/src/components/moments/item/masonry/image';
import MasonryLoadingItem from '@/src/components/moments/item/masonry/loading';
import type { MomentEntity } from '@/src/features/moment/api';

export default function MomentsMasonry() {

  const { state, dispatch }  = useMomentStateContext();

  const displayer: Record<EMomentType, (key: number, item: MomentEntity) => JSX.Element> = {
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
    default: 4,
    1280: 3,
    1024: 2,
    768: 1,
    480: 1,
  };

  return (
    <>
      <div id="content" className="relative h-full overflow-y-auto py-4 pl-4">
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
                const type: EMomentType = item.attributes?.type ?? EMomentType.Text;
                return displayer[type](item.id, item as MomentEntity)
              })
            }
          </Masonry>
        </InfiniteScroll>
      </div>
    </>
  )
}
