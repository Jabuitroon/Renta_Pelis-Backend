export interface SessionInterface {
  id: string;
  userId: string;
  userAgent: string;
  ipAddress: string;
  location: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: Date;
  lastUsedAt: Date;
}
