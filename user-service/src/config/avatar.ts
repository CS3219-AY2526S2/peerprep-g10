import AVATAR_OPTIONS from './avatars.json';

export { AVATAR_OPTIONS };

export const getDefaultAvatar = (): string => {
  return `${process.env.GCS_BUCKET_URL}/default.png`;
};

export const getRandomAvatar = (): string => {
  const key = AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)] ?? 'default';
  return `${process.env.GCS_BUCKET_URL}/${key}.png`;
};