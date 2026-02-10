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

// Definir una interface que represente el "Payload" del JWT y otra para el objeto User que se inyecta en la petición.

export interface JwtPayload {
  sub: string; // El user_id
  email: string;
  role: string;
  iat?: number; // Issued at (generado por JWT)
  exp?: number; // Expiration (generado por JWT)
}

// Este es el tipo que tendrá req.user después de pasar por el Guard
export interface AuthenticatedUser {
  user_id: string;
  email: string;
  role: string;
}
