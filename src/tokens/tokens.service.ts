import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateToken, PayloadToken, RevokeToken } from './interfaces';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { AuthorizationToken } from '../common/enums/authorization-token.enum';

@Injectable()
export class TokensService {
  private readonly randomToken = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    console.log('CacheManager:', this.cacheManager);
  }

  private readonly getKey = ({
    userId,
    type,
  }: {
    userId: string;
    type: AuthorizationToken;
  }) => `token:${type}:user:${userId}`;

  async generateToken({ userId, type, ttl = 900000 }: CreateToken) {
    const key = this.getKey({ userId, type });
    const payload = { userId, type, token: this.randomToken() };

    console.log('--- INTENTANDO GUARDAR EN REDIS ---');
    console.log('Llave:', key);

    try {
      // Forzamos un log del resultado del SET
      const result = await this.cacheManager.set(key, payload, ttl);
      console.log('Resultado del SET (debería ser "OK" o el objeto):', result);

      // Verificación inmediata
      const check = await this.cacheManager.get(key);
      console.log('Verificación inmediata GET:', check);

      return result;
    } catch (error) {
      console.error('ERROR CRÍTICO AL GUARDAR EN REDIS:', error);
    }
  }

  // Ahora necesitamos el tipo para poder reconstruir la llave y encontrar el dato
  async getToken(payload: CreateToken) {
    const key = this.getKey({ userId: payload.userId, type: payload.type });
    const cachedData = await this.cacheManager.get(key);
    return cachedData;
  }

  async validateToken({ userId, type, token }: PayloadToken) {
    console.log('Recibiendo token:', token);

    const key = this.getKey({ userId, type });
    const payload = await this.cacheManager.get<PayloadToken>(key);

    // Si no hay payload o el token no coincide, lanzamos una excepción
    if (!payload || payload.token !== token) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return payload;
  }

  async revokeToken({ userId, type }: RevokeToken) {
    try {
      const key = this.getKey({ userId, type });
      await this.cacheManager.del(key);
    } catch (error) {
      throw new BadRequestException(
        'Error al revocar el token {' + error + '}',
      );
    }
  }
}
