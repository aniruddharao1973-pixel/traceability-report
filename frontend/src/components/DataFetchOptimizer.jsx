// src/components/DataFetchOptimizer.jsx
import React, { createContext, useContext, useRef, useCallback } from 'react';

// Create optimization context
const OptimizationContext = createContext();

export function OptimizationProvider({ children }) {
  const requestCache = useRef(new Map());
  const abortControllers = useRef(new Map());
  const prefetchCache = useRef(new Map());

  // 🎯 Smart caching with TTL
  const smartFetch = useCallback(async (url, options = {}, cacheKey, ttl = 300000) => { // 5 minutes
    const now = Date.now();
    
    // Check cache first
    if (cacheKey && requestCache.current.has(cacheKey)) {
      const cached = requestCache.current.get(cacheKey);
      if (now - cached.timestamp < ttl) {
        console.log('🚀 [Cache Hit]:', cacheKey);
        return cached.data;
      }
    }

    // Cancel previous same request
    if (abortControllers.current.has(cacheKey)) {
      abortControllers.current.get(cacheKey).abort();
    }

    const controller = new AbortController();
    abortControllers.current.set(cacheKey, controller);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        priority: 'high'
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      // Cache the response
      if (cacheKey) {
        requestCache.current.set(cacheKey, {
          data,
          timestamp: now
        });
      }

      return data;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('❌ Fetch error:', error);
        throw error;
      }
      console.log('⚠️ Request cancelled:', cacheKey);
    } finally {
      abortControllers.current.delete(cacheKey);
    }
  }, []);

  // 🔮 Prefetch data on hover
  const prefetch = useCallback((url, cacheKey) => {
    if (!prefetchCache.current.has(cacheKey)) {
      prefetchCache.current.set(cacheKey, 
        fetch(url, { priority: 'low' })
          .then(res => res.json())
          .then(data => {
            requestCache.current.set(cacheKey, {
              data,
              timestamp: Date.now()
            });
            return data;
          })
          .catch(error => {
            console.error('❌ Prefetch failed:', error);
            prefetchCache.current.delete(cacheKey);
          })
      );
    }
    return prefetchCache.current.get(cacheKey);
  }, []);

  // 🧹 Clear cache selectively
  const clearCache = useCallback((pattern) => {
    if (pattern) {
      for (const [key] of requestCache.current) {
        if (key.includes(pattern)) {
          requestCache.current.delete(key);
        }
      }
    } else {
      requestCache.current.clear();
    }
    prefetchCache.current.clear();
  }, []);

  // 📊 Get cache statistics
  const getCacheStats = useCallback(() => ({
    size: requestCache.current.size,
    keys: Array.from(requestCache.current.keys())
  }), []);

  const value = {
    smartFetch,
    prefetch,
    clearCache,
    getCacheStats
  };

  return (
    <OptimizationContext.Provider value={value}>
      {children}
    </OptimizationContext.Provider>
  );
}

// Hook to use optimizations
export function useOptimizedFetch() {
  const context = useContext(OptimizationContext);
  if (!context) {
    throw new Error('useOptimizedFetch must be used within OptimizationProvider');
  }
  return context;
}

export default OptimizationContext;