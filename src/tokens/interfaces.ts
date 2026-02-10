import { AuthorizationToken } from '../common/enums/authorization-token.enum';

export interface CreateToken {
  userId: string;
  type: AuthorizationToken;
  ttl?: number;
}

export interface PayloadToken {
  userId: string;
  type: AuthorizationToken;
  ttl: number;
}
export interface RevokeToken {
  userId: string;
  type: AuthorizationToken;
}
export interface ResponseToken {
  token: string;
}
