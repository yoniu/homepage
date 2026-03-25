"use client";

import { useCallback } from 'react';
import { Divider } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';

import MasonryImageItem from '@/src/components/moments/item/masonry/image';
import MasonryLoadingItem from '@/src/components/moments/item/masonry/loading';
import MasonryMusicItem from '@/src/components/moments/item/masonry/music';
import MasonryTextItem from '@/src/components/moments/item/masonry/text';
import MasonryVideoItem from '@/src/components/moments/item/masonry/video';
import { useStateContext as useMomentStateContext } from '@/src/stores/moment';
import { EMomentType, type EMomentType as TMomentType } from '@/src/types/moment';

import type { MomentEntity } from '../../api';

export default function MomentMasonryView() {
  const { state, dispatch } = useMomentStateContext();

  const displayer: Record<TMomentType, (key: number, item: MomentEntity) => JSX.Element> = {
    text: (key, item) => <MasonryTextItem key={key} item={item} />,
    image: (key, item) => <MasonryImageItem key={key} item={item} />,
    video: (key, item) => <MasonryVideoItem key={key} item={item} />,
    live: (key) => <div key={key}>live</div>,
    music: (key, item) => <MasonryMusicItem key={key} item={item} />,
  };

  const loadNext = useCallback(() => {
    if (!state.hasNextPage) {
      return;
    }

    dispatch({
      type: 'SETINDEX',
      index: state.momentList.length - 1,
    });
  }, [dispatch, state.hasNextPage, state.momentList.length]);

  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    1024: 2,
    768: 1,
    480: 1,
  };

  return (
    <div id="content" className="relative h-full overflow-y-auto pb-4 pl-4 pt-20 sm:pt-4">
      <InfiniteScroll
        dataLength={state.momentList.length}
        next={loadNext}
        loader={<MasonryLoadingItem />}
        hasMore={state.hasNextPage}
        endMessage={<Divider plain>已经到底了</Divider>}
        scrollableTarget="content"
        scrollThreshold={0.8}
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto"
          columnClassName="sm:pr-4 pr-1 bg-clip-padding"
        >
          {state.momentList.map((item) => {
            const type: TMomentType = item.attributes?.type ?? EMomentType.Text;
            return displayer[type](item.id, item as MomentEntity);
          })}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
}
