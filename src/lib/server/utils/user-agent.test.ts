import { describe, it, expect } from 'vitest';
import { parseUserAgent } from './user-agent';

describe('parseUserAgent', () => {
  it('detects Chrome on Windows', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const result = parseUserAgent(ua);

    expect(result.browser).toContain('Chrome');
    expect(result.os).toContain('Windows');
    expect(result.device).toBe('Desktop');
  });

  it('detects Edge correctly (not Chrome)', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0';
    const result = parseUserAgent(ua);

    expect(result.browser).toContain('Edge');
  });

  it('detects Safari on macOS', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
    const result = parseUserAgent(ua);

    expect(result.browser).toContain('Safari');
    expect(result.os).toContain('macOS');
  });

  it('detects mobile devices', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    const result = parseUserAgent(ua);

    expect(result.device).toBe('Mobile');
    expect(result.os).toContain('iOS');
  });

  it('handles undefined user agent', () => {
    const result = parseUserAgent(undefined);

    expect(result.browser).toBe('Unknown');
    expect(result.os).toBe('Unknown');
    expect(result.device).toBe('Unknown');
  });
});
