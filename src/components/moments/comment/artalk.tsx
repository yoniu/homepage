'use client';

import 'artalk/Artalk.css';

import { useEffect, useRef, useState } from 'react';

import CommentNotice from './CommentNotice';

type ArtalkModule = typeof import('artalk');
type ArtalkInstance = InstanceType<ArtalkModule['default']>;

interface ArtalkCommentProps {
  id: number;
}

export default function ArtalkComment({ id }: ArtalkCommentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const server = process.env.NEXT_PUBLIC_ARTALK_SERVER?.trim();
  const site = process.env.NEXT_PUBLIC_ARTALK_SITE_NAME?.trim();

  useEffect(() => {
    const container = containerRef.current;

    if (!id || !server || !site || !container) {
      return;
    }

    let artalk: ArtalkInstance | null = null;
    let disposed = false;

    setLoadError(null);

    const initArtalk = async () => {
      try {
        const { default: Artalk } = await import('artalk');

        if (disposed) {
          return;
        }

        container.replaceChildren();

        artalk = Artalk.init({
          el: container,
          pageKey: `/moment/?id=${id}`,
          pageTitle: `Moment #${id}`,
          server,
          site,
        });
      } catch {
        if (!disposed) {
          setLoadError(
            'Artalk init failed. Please verify the server URL and site name.',
          );
        }
      }
    };

    void initArtalk();

    return () => {
      disposed = true;
      artalk?.destroy();
      container.replaceChildren();
    };
  }, [id, server, site]);

  if (!server || !site) {
    return (
      <CommentNotice
        title="Artalk not configured"
        hint="Set NEXT_PUBLIC_ARTALK_SERVER and NEXT_PUBLIC_ARTALK_SITE_NAME in .env."
      />
    );
  }

  if (loadError) {
    return <CommentNotice title="Artalk failed to load" hint={loadError} />;
  }

  return (
    <div
      ref={containerRef}
      className="comment-provider comment-provider--artalk"
    />
  );
}
