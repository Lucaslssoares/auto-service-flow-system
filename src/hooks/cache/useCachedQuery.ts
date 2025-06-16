
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useCacheManager } from "./useCacheManager";
import { useCallback } from "react";

interface CachedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryFn'> {
  queryFn: () => Promise<T>;
  cacheKey?: string;
  cacheTTL?: number;
  useLocalCache?: boolean;
}

export const useCachedQuery = <T>({
  queryKey,
  queryFn,
  cacheKey,
  cacheTTL = 5 * 60 * 1000, // 5 minutos padrão
  useLocalCache = true,
  ...options
}: CachedQueryOptions<T>): UseQueryResult<T> & { invalidateLocalCache: () => void } => {
  const { get, set, delete: deleteCache } = useCacheManager();
  
  const localCacheKey = cacheKey || queryKey?.join('-') || 'unknown';

  const cachedQueryFn = useCallback(async (): Promise<T> => {
    // Tentar buscar do cache local primeiro
    if (useLocalCache) {
      const cachedData = get<T>(localCacheKey);
      if (cachedData !== null) {
        console.log(`Cache hit para: ${localCacheKey}`);
        return cachedData;
      }
    }

    // Se não está no cache, buscar dos dados originais
    console.log(`Cache miss para: ${localCacheKey}, buscando dados...`);
    const data = await queryFn();
    
    // Salvar no cache local
    if (useLocalCache) {
      set(localCacheKey, data, cacheTTL);
    }
    
    return data;
  }, [queryFn, localCacheKey, useLocalCache, get, set, cacheTTL]);

  const invalidateLocalCache = useCallback(() => {
    deleteCache(localCacheKey);
  }, [deleteCache, localCacheKey]);

  const result = useQuery({
    queryKey,
    queryFn: cachedQueryFn,
    ...options
  });

  return {
    ...result,
    invalidateLocalCache
  };
};
