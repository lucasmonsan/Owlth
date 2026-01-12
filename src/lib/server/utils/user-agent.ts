export function parseUserAgent(userAgent: string | undefined): {
  device: string;
  browser: string;
  os: string;
} {
  if (!userAgent) {
    return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };
  }

  // Device detection
  let device = 'Desktop';
  if (/mobile/i.test(userAgent)) device = 'Mobile';
  if (/tablet|ipad/i.test(userAgent)) device = 'Tablet';

  // Browser detection
  let browser = 'Unknown';
  if (/edg/i.test(userAgent)) browser = 'Edge';
  else if (/chrome/i.test(userAgent)) browser = 'Chrome';
  else if (/firefox/i.test(userAgent)) browser = 'Firefox';
  else if (/safari/i.test(userAgent)) browser = 'Safari';
  else if (/opera|opr/i.test(userAgent)) browser = 'Opera';

  // OS detection
  let os = 'Unknown';
  if (/windows/i.test(userAgent)) os = 'Windows';
  else if (/mac os/i.test(userAgent)) os = 'macOS';
  else if (/linux/i.test(userAgent)) os = 'Linux';
  else if (/android/i.test(userAgent)) os = 'Android';
  else if (/ios|iphone|ipad/i.test(userAgent)) os = 'iOS';

  return { device, browser, os };
}
