import { Request } from 'express';

export interface responseAuth {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}

export interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  };
}
