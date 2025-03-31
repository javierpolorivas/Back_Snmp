import { Injectable } from '@nestjs/common';

interface CacheEntry {
  data: any;
  expiry: number;
}

@Injectable()
export class AuthCacheService {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 15 * 60 * 1000; // 15 minutos en milisegundos

  get(key: string): any {
    const entry = this.cache.get(key);
    if (entry && entry.expiry > Date.now()) {
      return entry.data;
    }
    this.cache.delete(key); // Eliminar la entrada si ha expirado
    return null;
  }

  set(key: string, data: any): void {
    const expiry = Date.now() + this.CACHE_TTL;
    this.cache.set(key, { data, expiry });
  }
}