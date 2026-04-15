// AI Assistance Disclosure:
// Tool: Claude, date: 2026-04-05
// Scope: Generated Jest unit tests for avatar utility functions including URL validation, bucket path correctness, and avatar key verification.
// Author review: Accepted as-is and integrated directly into test suite to improve coverage.
import { getDefaultAvatar, getRandomAvatar, AVATAR_OPTIONS } from '../../config/avatar';

describe('avatar config', () => {
  const BUCKET = 'https://storage.googleapis.com/test-bucket';

  beforeEach(() => {
    process.env.GCS_BUCKET_URL = BUCKET;
  });

  describe('getDefaultAvatar', () => {
    it('returns the default avatar URL', () => {
      expect(getDefaultAvatar()).toBe(`${BUCKET}/default.png`);
    });
  });

  describe('getRandomAvatar', () => {
    it('returns a URL ending in .png', () => {
      const url = getRandomAvatar();
      expect(url).toMatch(/\.png$/);
    });

    it('returns a URL using the bucket URL', () => {
      const url = getRandomAvatar();
      expect(url).toContain(BUCKET);
    });

    it('returns a URL from a known avatar key', () => {
      const url = getRandomAvatar();
      const key = url.replace(`${BUCKET}/`, '').replace('.png', '');
      expect(AVATAR_OPTIONS).toContain(key);
    });
  });
});