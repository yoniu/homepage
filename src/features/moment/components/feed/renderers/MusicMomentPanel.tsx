import { useMemo } from 'react';

import { ShowMusicPlainContent } from '@/src/components/editor/plainContent';
import PlayerView from '@/src/components/play/PlayerView';
import { TMusicMomentAttributes } from '@/src/types/moments';

interface IProps {
  item: IMomentItem;
}

export default function MusicMomentPanel({ item }: IProps) {
  const musicAttributes = item.attributes as TMusicMomentAttributes;

  const textType = useMemo(() => musicAttributes?.textType ?? 'LIGHT', [musicAttributes]);

  const textColor = useMemo(() => {
    return textType === 'LIGHT' ? '#fff' : '#000';
  }, [textType]);

  const bg = useMemo(() => {
    if (musicAttributes.backgroundType === 'PLAIN') {
      return musicAttributes.backgroundColor || '#951B1B';
    }

    if (musicAttributes.backgroundType === 'GRADIENT') {
      return `linear-gradient(${musicAttributes.gradientColors?.join(', ')})`;
    }

    return '#951B1B';
  }, [musicAttributes.backgroundColor, musicAttributes.backgroundType, musicAttributes.gradientColors]);

  const name = useMemo(() => musicAttributes?.music?.name, [musicAttributes.music?.name]);
  const cover = useMemo(() => musicAttributes?.music?.cover, [musicAttributes.music?.cover]);
  const url = useMemo(() => musicAttributes?.music?.url, [musicAttributes.music?.url]);
  const singer = useMemo(() => musicAttributes?.music?.singer, [musicAttributes.music?.singer]);
  const lrc = useMemo(() => musicAttributes?.music?.lrc, [musicAttributes.music?.lrc]);

  return (
    <div
      className="text-[var(--text-color)] absolute left-0 top-0 w-full h-full"
      style={{
        background: bg,
        '--text-color': textColor,
      } as React.CSSProperties}
    >
      <div className="overflow-hidden flex flex-col items-center justify-center w-full h-full max-w-[960px] m-auto">
        <PlayerView
          name={name ?? ''}
          cover={cover ?? ''}
          url={url ?? ''}
          singer={singer ?? ''}
          lrc={lrc}
        />
        {item.content && (
          <ShowMusicPlainContent
            content={item.content}
            author={item.author.name}
            mail={item.author?.email}
            date={item.create_time}
          />
        )}
      </div>
    </div>
  );
}
