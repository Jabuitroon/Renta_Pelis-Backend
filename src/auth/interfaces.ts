import { Request } from 'express';

export interface responseAuth {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}

export interface UserActiveInterface {
  email: string;
  role: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface RequestWithUser extends Request {
  user: UserProfile;
}
