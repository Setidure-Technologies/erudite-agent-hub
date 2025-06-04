import { describe, it, expect } from 'vitest';
import { getScoreBadgeVariant } from '../VoiceTraining';

describe('getScoreBadgeVariant', () => {
  it('returns "secondary" for null', () => {
    expect(getScoreBadgeVariant(null)).toBe('secondary');
  });

  it('returns "destructive" for 0', () => {
    expect(getScoreBadgeVariant(0)).toBe('destructive');
  });

  it('returns "secondary" for 60', () => {
    expect(getScoreBadgeVariant(60)).toBe('secondary');
  });

  it('returns "default" for 80', () => {
    expect(getScoreBadgeVariant(80)).toBe('default');
  });
});
