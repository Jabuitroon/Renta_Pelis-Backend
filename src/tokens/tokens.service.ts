import { Inject, Injectable } from '@nestjs/common';
import { CreateToken } from './interfaces';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TokensService {
  private readonly randomToken = () =>
    Math.floor(100000 + Math.random() * 1000000).toString();

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async generateToken({ userId, type, ttl = 900000 }: CreateToken) {
    return await this.cacheManager.set(
      `token: ${type}:user: ${userId}`,
      { userId, type, token: this.randomToken() },
      ttl,
    );
  }
}
