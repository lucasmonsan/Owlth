import { sha1 } from '@oslojs/crypto/sha1';
import { encodeHexUpperCase } from '@oslojs/encoding';

/**
 * Check if a password has been exposed in data breaches using Have I Been Pwned API
 * Uses k-anonymity model - only sends first 5 chars of SHA-1 hash
 * @param password - Password to check
 * @returns true if password found in breach database, false otherwise
 */
export async function isPasswordPwned(password: string): Promise<boolean> {
  const hash = encodeHexUpperCase(sha1(new TextEncoder().encode(password)));
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'User-Agent': 'Owlth-Password-Checker'
      }
    });

    if (!response.ok) {
      // If API fails, don't block user - log error and allow
      console.error('HIBP API error:', response.status);
      return false;
    }

    const text = await response.text();
    return text.includes(suffix);
  } catch (error) {
    // Network error - don't block user
    console.error('HIBP check failed:', error);
    return false;
  }
}
