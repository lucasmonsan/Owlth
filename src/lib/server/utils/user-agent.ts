const UAParser = require('ua-parser-js');

export interface ParsedUserAgent {
  device: string;
  browser: string;
  os: string;
}

/**
 * Extrai informações de device, browser e OS do user-agent
 * Usado para login history e session tracking
 */
export function parseUserAgent(userAgent: string | undefined): ParsedUserAgent {
  if (!userAgent) {
    return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };
  }

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Device
  const deviceType = result.device.type;
  let device = 'Desktop';
  if (deviceType === 'mobile') device = 'Mobile';
  else if (deviceType === 'tablet') device = 'Tablet';

  // Browser com versão
  const browserName = result.browser.name || 'Unknown';
  const browserVersion = result.browser.version || '';
  const browser = browserVersion ? `${browserName} ${browserVersion.split('.')[0]}` : browserName;

  // OS com versão
  const osName = result.os.name || 'Unknown';
  const osVersion = result.os.version || '';
  const os = osVersion ? `${osName} ${osVersion.split('.')[0]}` : osName;

  return { device, browser, os };
}
