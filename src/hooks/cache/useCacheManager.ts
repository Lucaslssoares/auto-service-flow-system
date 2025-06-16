
import { useState, useEffect, useCallback } from "react";

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  defaultTTL: number; // Time to live em milissegundos
  maxSize: number; // Máximo de itens no cache
}

class LocalCacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;

  constructor(config: CacheConfig = { defaultTTL: 5 * 60 * 1000, maxSize: 100 }) {
    this.config = config;
    
    // Limpeza automática a cada minuto
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.config.defaultTTL);

    // Se o cache está cheio, remove o item mais antigo
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Verifica se o item expirou
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // Verifica se ainda é válido
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  invalidatePattern(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  private getOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      usage: `${Math.round((this.cache.size / this.config.maxSize) * 100)}%`
    };
  }
}

// Instância global do cache
const cacheManager = new LocalCacheManager();

export const useCacheManager = () => {
  const [stats, setStats] = useState(cacheManager.getStats());

  const updateStats = useCallback(() => {
    setStats(cacheManager.getStats());
  }, []);

  useEffect(() => {
    const interval = setInterval(updateStats, 5000); // Atualiza stats a cada 5s
    return () => clearInterval(interval);
  }, [updateStats]);

  const set = useCallback(<T>(key: string, data: T, ttl?: number) => {
    cacheManager.set(key, data, ttl);
    updateStats();
  }, [updateStats]);

  const get = useCallback(<T>(key: string): T | null => {
    return cacheManager.get<T>(key);
  }, []);

  const has = useCallback((key: string): boolean => {
    return cacheManager.has(key);
  }, []);

  const deleteItem = useCallback((key: string) => {
    cacheManager.delete(key);
    updateStats();
  }, [updateStats]);

  const clear = useCallback(() => {
    cacheManager.clear();
    updateStats();
  }, [updateStats]);

  const invalidatePattern = useCallback((pattern: string) => {
    cacheManager.invalidatePattern(pattern);
    updateStats();
  }, [updateStats]);

  return {
    set,
    get,
    has,
    delete: deleteItem,
    clear,
    invalidatePattern,
    stats
  };
};

export default cacheManager;
