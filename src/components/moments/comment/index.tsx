'use client';

import { cn } from '@/lib/utils';
import { type WheelEvent, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import ArtalkComment from './artalk';
import TwikooComment from './twikoo';
import './comment.scss';

type CommentProvider = 'twikoo' | 'artalk';

interface CommentPanelProps {
  id: number;
  show?: boolean;
  setShow: (value: boolean) => void;
}

function resolveCommentProvider(): CommentProvider {
  const provider =
    process.env.NEXT_PUBLIC_COMMENT_PROVIDER?.trim().toLowerCase();

  return provider === 'artalk' ? 'artalk' : 'twikoo';
}

const commentProvider = resolveCommentProvider();

export default function CommentPanel({
  id,
  show = false,
  setShow,
}: CommentPanelProps) {
  const [client, setClient] = useState(false);

  const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    return null;
  }

  const portalTarget = document.querySelector('#content');

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <>
      <div
        className={cn(
          'absolute left-0 top-0 z-10 h-full w-full bg-black/60 transition-all',
          show ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setShow(false)}
      ></div>
      <div
        className={cn(
          'absolute bottom-0 left-1/2 z-20 w-full max-w-[500px] -translate-x-1/2 overflow-hidden rounded-t-2xl rounded-b-none bg-white transition-all sm:bottom-4 sm:rounded-b-2xl',
          show ? 'h-3/5 max-h-[400px] border' : 'h-0 border-transparent',
        )}
        onWheel={handleWheel}
      >
        <div className="comment-panel__body">
          {commentProvider === 'artalk' ? (
            <ArtalkComment id={id} />
          ) : (
            <TwikooComment id={id} />
          )}
        </div>
        <div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-b from-transparent via-white/80 to-white"></div>
      </div>
    </>,
    portalTarget,
  );
}
