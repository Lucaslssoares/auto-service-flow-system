
import React from 'react';

/**
 * Utilitários para otimização de performance
 */

// Debounce para reduzir calls de API
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
};

// Throttle para controlar frequência de execução
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};

// Cache simples para resultados de funções
export const memoize = <T extends (...args: any[]) => any>(func: T): T => {
  const cache = new Map();
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func.apply(null, args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Lazy loading para componentes
export const createLazyComponent = (importFn: () => Promise<any>) => {
  return React.lazy(importFn);
};
