export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: string;
  isVerified: boolean;
  profilePicture: string | null;
  twoFactorSecret: string | null;
  twoFactorEnabled: boolean;
  recoveryCode: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Omit<User, 'passwordHash' | 'twoFactorSecret' | 'recoveryCode'>;

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  device: string | null;
  browser: string | null;
  lastActivityAt: Date;
}

export interface LoginHistory {
  id: string;
  userId: string;
  ip: string;
  userAgent: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  success: boolean;
  riskLevel: string | null;
  createdAt: Date;
}
