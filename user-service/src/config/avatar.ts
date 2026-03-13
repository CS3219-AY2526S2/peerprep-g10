import AVATAR_OPTIONS from './avatars.json';

export { AVATAR_OPTIONS };

export const getRandomAvatar = (): string => {
  return AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)] ?? 'default';
};