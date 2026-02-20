import { Request } from 'express';

export interface responseAuth {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}

// Forma del Payload que se guardó desde el JWT
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface UserActiveInterface {
  userId: string;
  role: string;
}

// Extendemos la Request de Express para incluir al usuario
export interface RequestWithUser extends Request {
  user: JwtPayload;
}
