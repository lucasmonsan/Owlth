import { UAParser } from 'ua-parser-js';

export interface DeviceInfo {
  device: string;
  browser: string;
  os: string;
  ip: string;
  userAgent: string;
}

export function parseUserAgent(userAgent: string | null): Omit<DeviceInfo, 'ip' | 'userAgent'> {
  if (!userAgent) {
    return {
      device: 'Unknown Device',
      browser: 'Unknown Browser',
      os: 'Unknown OS'
    };
  }

  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  return {
    device: device.model ? `${device.vendor || ''} ${device.model}`.trim() : 'Desktop',
    browser: `${browser.name || 'Unknown'} ${browser.version || ''}`.trim(),
    os: `${os.name || 'Unknown'} ${os.version || ''}`.trim()
  };
}
