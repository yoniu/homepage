import consts from '@/src/configs/consts';

function canUseSessionStorage() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

export function markMomentFeedStale() {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.setItem(consts.SS_MOMENT_FEED_STALE, '1');
}

export function consumeMomentFeedStale() {
  if (!canUseSessionStorage()) {
    return false;
  }

  const isStale = window.sessionStorage.getItem(consts.SS_MOMENT_FEED_STALE) === '1';

  if (isStale) {
    window.sessionStorage.removeItem(consts.SS_MOMENT_FEED_STALE);
  }

  return isStale;
}
