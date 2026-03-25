'use client';

import { useEffect, useId, useState } from 'react';

import CommentNotice from './CommentNotice';
import './twikoo.scss';

interface TwikooCommentProps {
  id: number;
}

declare global {
  interface Window {
    twikoo?: {
      init: (options: { envId: string; el: string; path: string }) => void;
    };
  }
}

const TWIKOO_SCRIPT_SELECTOR = 'script[data-comment-provider="twikoo"]';

function loadTwikooScript() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    if (window.twikoo) {
      resolve();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(
      TWIKOO_SCRIPT_SELECTOR,
    );

    const handleLoad = () => {
      cleanup();
      resolve();
    };

    const handleError = () => {
      cleanup();
      reject(new Error('Failed to load Twikoo script.'));
    };

    const cleanup = () => {
      script?.removeEventListener('load', handleLoad);
      script?.removeEventListener('error', handleError);
    };

    if (!script) {
      script = document.createElement('script');
      script.src = '/js/twikoo.all.min.js';
      script.async = true;
      script.dataset.commentProvider = 'twikoo';
      document.body.appendChild(script);
    }

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);
  });
}

export default function TwikooComment({ id }: TwikooCommentProps) {
  const [loadError, setLoadError] = useState<string | null>(null);
  const twikooEnvId = process.env.NEXT_PUBLIC_TWIKOO_ENVID?.trim();
  const containerId = `tcomment-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    if (!id || !twikooEnvId) {
      return;
    }

    let disposed = false;

    setLoadError(null);

    const initTwikoo = async () => {
      try {
        await loadTwikooScript();

        if (disposed || !window.twikoo) {
          return;
        }

        const container = document.getElementById(containerId);
        container?.replaceChildren();

        window.twikoo.init({
          envId: twikooEnvId,
          el: `#${containerId}`,
          path: `/moment?id=${id}`,
        });
      } catch {
        if (!disposed) {
          setLoadError(
            'Twikoo script failed to load. Check public/js/twikoo.all.min.js and env config.',
          );
        }
      }
    };

    void initTwikoo();

    return () => {
      disposed = true;
      document.getElementById(containerId)?.replaceChildren();
    };
  }, [containerId, id, twikooEnvId]);

  if (!twikooEnvId) {
    return (
      <CommentNotice
        title="Twikoo not configured"
        hint="Set NEXT_PUBLIC_TWIKOO_ENVID in .env."
      />
    );
  }

  if (loadError) {
    return <CommentNotice title="Twikoo failed to load" hint={loadError} />;
  }

  return (
    <div
      id={containerId}
      className="comment-provider comment-provider--twikoo"
    />
  );
}
