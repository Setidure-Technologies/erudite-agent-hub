import { describe, it, expect } from 'vitest';
import { getScoreBadgeVariant } from '@/lib/getScoreBadgeVariant';

describe('getScoreBadgeVariant', () => {
  it('returns "secondary" for null', () => {
    expect(getScoreBadgeVariant(null)).toBe('secondary');
  });

  it('returns "destructive" for 0', () => {
    expect(getScoreBadgeVariant(0)).toBe('destructive');
  });

  it('returns "secondary" for 65', () => {
    expect(getScoreBadgeVariant(65)).toBe('secondary');
  });

  it('returns "default" for 85', () => {
    expect(getScoreBadgeVariant(85)).toBe('default');
  });
});
