'use client';

import {
  ArrowLeftOutlined,
  CommentOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import CommentPanel from '@/src/components/moments/comment';
import { useStateContext as useUserStateContext } from '@/src/stores/user';

import MomentAudioControl from '../feed/MomentAudioControl';

interface IProps {
  item: IMomentItem;
}

export default function MomentDetailControls({ item }: IProps) {
  const router = useRouter();
  const [showComment, setShowComment] = useState(false);
  const { state: userState, dispatch: userDispatch } = useUserStateContext();

  const isMusic = useMemo(
    () => item.attributes?.type === 'music',
    [item.attributes?.type],
  );
  const backgroundMusic = useMemo(
    () => item.attributes?.music ?? null,
    [item.attributes?.music],
  );

  const handleBackHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const publicClassName =
    'text-black flex items-center justify-center w-8 p-2 hover:bg-gray-300 rounded-full transition-all';

  return (
    <div className="relative w-full flex items-center justify-between px-3 z-10">
      <button
        className="flex-shrink-0 w-auto p-3 flex sm:hidden items-center justify-center bg-white/90 border-2 border-white rounded-full shadow-lg transition-all"
        onClick={() =>
          userDispatch({ type: 'SETMENUSHOW', show: !userState.menuShow })
        }
      >
        <MenuOutlined />
      </button>
      <div className="relative flex items-center space-x-3 sm:space-x-5">
        <button
          className={cn(
            publicClassName,
            'w-auto p-3 bg-white/90 border-2 border-white rounded-full shadow-lg transition-all',
          )}
          onClick={handleBackHome}
        >
          <ArrowLeftOutlined />
        </button>
        <button
          className={cn(
            publicClassName,
            'w-auto p-3 bg-white/90 border-2 border-white rounded-full shadow-lg transition-all',
          )}
          onClick={() => setShowComment(!showComment)}
        >
          <CommentOutlined />
        </button>
        <CommentPanel
          id={item.id}
          show={showComment}
          setShow={setShowComment}
        />
        {!isMusic && backgroundMusic && (
          <MomentAudioControl music={backgroundMusic} />
        )}
      </div>
    </div>
  );
}
