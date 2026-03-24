export const EMomentStatus = {
  Draft: 0,
  Published: 1,
  Self: 2,
} as const;

export type EMomentStatus = (typeof EMomentStatus)[keyof typeof EMomentStatus];

export const EMomentType = {
  Text: 'text',
  Image: 'image',
  Video: 'video',
  Live: 'live',
  Music: 'music',
} as const;

export type EMomentType = (typeof EMomentType)[keyof typeof EMomentType];
