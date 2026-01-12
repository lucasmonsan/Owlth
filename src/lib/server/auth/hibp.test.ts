import { describe, it, expect } from 'vitest';
import { isPasswordPwned } from './hibp';

describe('isPasswordPwned', () => {
  it('detects common pwned password', async () => {
    const isPwned = await isPasswordPwned('password123');
    expect(isPwned).toBe(true);
  });

  it('accepts secure unique password', async () => {
    const isPwned = await isPasswordPwned('X9$mK2#pL8@qR5!nW3vY7');
    expect(isPwned).toBe(false);
  });
});
