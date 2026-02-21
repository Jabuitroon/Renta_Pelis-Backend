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
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface UserActiveInterface {
  sub: string;
  role: string;
}

// Extendemos la Request de Express para incluir al usuario
export interface RequestWithUser extends Request {
  user: JwtPayload;
}
