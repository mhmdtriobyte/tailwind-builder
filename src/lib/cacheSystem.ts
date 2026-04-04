/**
 * Cache System
 *
 * Intelligent caching utilities for the Tailwind Builder.
 * Includes memoization, style computation cache, code generation cache,
 * thumbnail cache, and IndexedDB storage for large data.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccess: number;
  size?: number;
}

export interface CacheOptions {
  /** Time to live in milliseconds */
  ttl?: number;
  /** Maximum number of entries */
  maxSize?: number;
  /** Maximum memory usage in bytes */
  maxMemory?: number;
  /** Eviction policy */
  evictionPolicy?: 'lru' | 'lfu' | 'fifo';
  /** Whether to persist to storage */
  persist?: boolean;
  /** Storage key prefix */
  storagePrefix?: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  memoryUsage: number;
  hitRate: number;
  evictions: number;
}

export interface IndexedDBConfig {
  dbName: string;
  storeName: string;
  version?: number;
}

// ============================================================================
// LRU CACHE IMPLEMENTATION
// ============================================================================

/**
 * LRU Cache with configurable options
 */
export class LRUCache<K, V> {
  private cache: Map<K, CacheEntry<V>>;
  private readonly options: Required<CacheOptions>;
  private stats: CacheStats;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.options = {
      ttl: options.ttl ?? 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize ?? 1000,
      maxMemory: options.maxMemory ?? 50 * 1024 * 1024, // 50MB default
      evictionPolicy: options.evictionPolicy ?? 'lru',
      persist: options.persist ?? false,
      storagePrefix: options.storagePrefix ?? 'cache_',
    };
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      memoryUsage: 0,
      hitRate: 0,
      evictions: 0,
    };

    // Load persisted data
    if (this.options.persist) {
      this.loadFromStorage();
    }
  }

  /**
   * Gets a value from the cache
   */
  get(key: K): V | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return undefined;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return undefined;
    }

    // Update access info
    entry.accessCount++;
    entry.lastAccess = Date.now();

    // Move to end (most recently used) for LRU
    if (this.options.evictionPolicy === 'lru') {
      this.cache.delete(key);
      this.cache.set(key, entry);
    }

    this.stats.hits++;
    this.updateHitRate();

    return entry.value;
  }

  /**
   * Sets a value in the cache
   */
  set(key: K, value: V, ttl?: number): void {
    // Evict if necessary
    this.evictIfNeeded();

    const entry: CacheEntry<V> = {
      value,
      timestamp: Date.now(),
      ttl: ttl ?? this.options.ttl,
      accessCount: 1,
      lastAccess: Date.now(),
      size: this.estimateSize(value),
    };

    // Delete existing entry first (for LRU ordering)
    if (this.cache.has(key)) {
      const existing = this.cache.get(key);
      if (existing) {
        this.stats.memoryUsage -= existing.size ?? 0;
      }
      this.cache.delete(key);
    }

    this.cache.set(key, entry);
    this.stats.size = this.cache.size;
    this.stats.memoryUsage += entry.size ?? 0;

    // Persist if enabled
    if (this.options.persist) {
      this.persistToStorage();
    }
  }

  /**
   * Checks if cache has a key
   */
  has(key: K): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (this.isExpired(entry)) {
      this.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Deletes a key from the cache
   */
  delete(key: K): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.stats.memoryUsage -= entry.size ?? 0;
    }
    const result = this.cache.delete(key);
    this.stats.size = this.cache.size;
    return result;
  }

  /**
   * Clears the entire cache
   */
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    this.stats.memoryUsage = 0;

    if (this.options.persist) {
      this.clearStorage();
    }
  }

  /**
   * Gets cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Gets all keys in the cache
   */
  keys(): K[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Gets all values in the cache
   */
  values(): V[] {
    return Array.from(this.cache.values())
      .filter((entry) => !this.isExpired(entry))
      .map((entry) => entry.value);
  }

  /**
   * Iterates over cache entries
   */
  forEach(callback: (value: V, key: K) => void): void {
    this.cache.forEach((entry, key) => {
      if (!this.isExpired(entry)) {
        callback(entry.value, key);
      }
    });
  }

  /**
   * Prunes expired entries
   */
  prune(): number {
    let pruned = 0;
    const now = Date.now();

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        this.delete(key);
        pruned++;
      }
    });

    return pruned;
  }

  // Private methods

  private isExpired(entry: CacheEntry<V>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictIfNeeded(): void {
    // Check size limit
    while (this.cache.size >= this.options.maxSize) {
      this.evictOne();
    }

    // Check memory limit
    while (this.stats.memoryUsage >= this.options.maxMemory) {
      this.evictOne();
    }
  }

  private evictOne(): void {
    let keyToEvict: K | undefined;

    switch (this.options.evictionPolicy) {
      case 'lru': {
        // First key is least recently used
        keyToEvict = this.cache.keys().next().value;
        break;
      }
      case 'lfu': {
        // Find least frequently used
        let minCount = Infinity;
        this.cache.forEach((entry, key) => {
          if (entry.accessCount < minCount) {
            minCount = entry.accessCount;
            keyToEvict = key;
          }
        });
        break;
      }
      case 'fifo': {
        // First key is oldest
        keyToEvict = this.cache.keys().next().value;
        break;
      }
    }

    if (keyToEvict !== undefined) {
      this.delete(keyToEvict);
      this.stats.evictions++;
    }
  }

  private estimateSize(value: V): number {
    try {
      return new Blob([JSON.stringify(value)]).size;
    } catch {
      return 100; // Default estimate
    }
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  private persistToStorage(): void {
    try {
      const data = JSON.stringify(Array.from(this.cache.entries()));
      localStorage.setItem(this.options.storagePrefix + 'data', data);
    } catch (e) {
      console.warn('Failed to persist cache:', e);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.options.storagePrefix + 'data');
      if (data) {
        const entries = JSON.parse(data) as Array<[K, CacheEntry<V>]>;
        entries.forEach(([key, entry]) => {
          if (!this.isExpired(entry)) {
            this.cache.set(key, entry);
            this.stats.memoryUsage += entry.size ?? 0;
          }
        });
        this.stats.size = this.cache.size;
      }
    } catch (e) {
      console.warn('Failed to load cache:', e);
    }
  }

  private clearStorage(): void {
    try {
      localStorage.removeItem(this.options.storagePrefix + 'data');
    } catch (e) {
      console.warn('Failed to clear cache storage:', e);
    }
  }
}

// ============================================================================
// MEMOIZATION UTILITIES
// ============================================================================

/**
 * Creates a memoized version of a function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    maxSize?: number;
    ttl?: number;
    keyFn?: (...args: Parameters<T>) => string;
  } = {}
): T & { cache: LRUCache<string, ReturnType<T>>; clear: () => void } {
  const cache = new LRUCache<string, ReturnType<T>>({
    maxSize: options.maxSize ?? 100,
    ttl: options.ttl ?? 60 * 1000,
  });

  const keyFn = options.keyFn ?? ((...args) => JSON.stringify(args));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memoized = function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = keyFn(...args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn.apply(this, args);
    cache.set(key, result);

    return result;
  } as T & { cache: LRUCache<string, ReturnType<T>>; clear: () => void };

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
}

/**
 * Creates a memoized async function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    maxSize?: number;
    ttl?: number;
    keyFn?: (...args: Parameters<T>) => string;
  } = {}
): T & { cache: LRUCache<string, Awaited<ReturnType<T>>>; clear: () => void } {
  const cache = new LRUCache<string, Awaited<ReturnType<T>>>({
    maxSize: options.maxSize ?? 100,
    ttl: options.ttl ?? 60 * 1000,
  });

  const pendingPromises = new Map<string, Promise<Awaited<ReturnType<T>>>>();
  const keyFn = options.keyFn ?? ((...args) => JSON.stringify(args));

  const memoized = async function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this: any,
    ...args: Parameters<T>
  ): Promise<Awaited<ReturnType<T>>> {
    const key = keyFn(...args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    // Check if there's a pending promise for this key
    if (pendingPromises.has(key)) {
      return pendingPromises.get(key)!;
    }

    const promise = fn.apply(this, args).then((result: Awaited<ReturnType<T>>) => {
      cache.set(key, result);
      pendingPromises.delete(key);
      return result;
    });

    pendingPromises.set(key, promise);

    return promise;
  } as T & { cache: LRUCache<string, Awaited<ReturnType<T>>>; clear: () => void };

  memoized.cache = cache;
  memoized.clear = () => {
    cache.clear();
    pendingPromises.clear();
  };

  return memoized;
}

// ============================================================================
// SPECIALIZED CACHES
// ============================================================================

/**
 * Style computation cache for Tailwind classes
 */
export class StyleComputationCache {
  private cache: LRUCache<string, string>;
  private classMap: Map<string, Set<string>>;

  constructor() {
    this.cache = new LRUCache<string, string>({
      maxSize: 5000,
      ttl: 30 * 60 * 1000, // 30 minutes
      evictionPolicy: 'lfu',
    });
    this.classMap = new Map();
  }

  /**
   * Gets computed styles for a class combination
   */
  getStyles(classes: string[]): string | undefined {
    const key = classes.sort().join(' ');
    return this.cache.get(key);
  }

  /**
   * Sets computed styles for a class combination
   */
  setStyles(classes: string[], computedStyle: string): void {
    const key = classes.sort().join(' ');
    this.cache.set(key, computedStyle);

    // Track which keys use each class (for invalidation)
    classes.forEach((cls) => {
      if (!this.classMap.has(cls)) {
        this.classMap.set(cls, new Set());
      }
      this.classMap.get(cls)!.add(key);
    });
  }

  /**
   * Invalidates all entries containing a specific class
   */
  invalidateClass(className: string): void {
    const keys = this.classMap.get(className);
    if (keys) {
      keys.forEach((key) => this.cache.delete(key));
      this.classMap.delete(className);
    }
  }

  /**
   * Clears the entire cache
   */
  clear(): void {
    this.cache.clear();
    this.classMap.clear();
  }

  /**
   * Gets cache statistics
   */
  getStats(): CacheStats {
    return this.cache.getStats();
  }
}

/**
 * Code generation cache
 */
export class CodeGenerationCache {
  private cache: LRUCache<string, { jsx: string; tsx: string }>;

  constructor() {
    this.cache = new LRUCache({
      maxSize: 500,
      ttl: 10 * 60 * 1000, // 10 minutes
      evictionPolicy: 'lru',
    });
  }

  /**
   * Gets cached code for an element
   */
  getCode(elementId: string, elementHash: string): { jsx: string; tsx: string } | undefined {
    const key = `${elementId}_${elementHash}`;
    return this.cache.get(key);
  }

  /**
   * Caches generated code for an element
   */
  setCode(elementId: string, elementHash: string, code: { jsx: string; tsx: string }): void {
    const key = `${elementId}_${elementHash}`;
    this.cache.set(key, code);
  }

  /**
   * Invalidates cache for an element
   */
  invalidateElement(elementId: string): void {
    this.cache.keys()
      .filter((key) => key.startsWith(`${elementId}_`))
      .forEach((key) => this.cache.delete(key));
  }

  /**
   * Clears the entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Gets cache statistics
   */
  getStats(): CacheStats {
    return this.cache.getStats();
  }
}

/**
 * Thumbnail cache for component previews
 */
export class ThumbnailCache {
  private cache: LRUCache<string, string>; // Base64 encoded images
  private pendingRenders: Map<string, Promise<string>>;

  constructor() {
    this.cache = new LRUCache({
      maxSize: 200,
      ttl: 60 * 60 * 1000, // 1 hour
      maxMemory: 20 * 1024 * 1024, // 20MB for thumbnails
      evictionPolicy: 'lru',
      persist: true,
      storagePrefix: 'thumbnail_cache_',
    });
    this.pendingRenders = new Map();
  }

  /**
   * Gets a cached thumbnail
   */
  getThumbnail(componentType: string): string | undefined {
    return this.cache.get(componentType);
  }

  /**
   * Sets a thumbnail in cache
   */
  setThumbnail(componentType: string, dataUrl: string): void {
    this.cache.set(componentType, dataUrl);
  }

  /**
   * Generates and caches a thumbnail
   */
  async generateThumbnail(
    componentType: string,
    renderFn: () => Promise<string>
  ): Promise<string> {
    // Check cache first
    const cached = this.getThumbnail(componentType);
    if (cached) return cached;

    // Check if already rendering
    if (this.pendingRenders.has(componentType)) {
      return this.pendingRenders.get(componentType)!;
    }

    // Render and cache
    const promise = renderFn().then((dataUrl) => {
      this.setThumbnail(componentType, dataUrl);
      this.pendingRenders.delete(componentType);
      return dataUrl;
    });

    this.pendingRenders.set(componentType, promise);
    return promise;
  }

  /**
   * Clears the entire cache
   */
  clear(): void {
    this.cache.clear();
    this.pendingRenders.clear();
  }

  /**
   * Gets cache statistics
   */
  getStats(): CacheStats {
    return this.cache.getStats();
  }
}

// ============================================================================
// INDEXEDDB STORAGE
// ============================================================================

/**
 * IndexedDB wrapper for large data storage
 */
export class IndexedDBCache {
  private dbName: string;
  private storeName: string;
  private version: number;
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor(config: IndexedDBConfig) {
    this.dbName = config.dbName;
    this.storeName = config.storeName;
    this.version = config.version ?? 1;
  }

  /**
   * Opens the database connection
   */
  private async openDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
    });

    return this.dbPromise;
  }

  /**
   * Gets a value from IndexedDB
   */
  async get<T>(key: string): Promise<T | undefined> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.expiry && Date.now() > result.expiry) {
          // Expired, delete and return undefined
          this.delete(key);
          resolve(undefined);
        } else {
          resolve(result?.value);
        }
      };
    });
  }

  /**
   * Sets a value in IndexedDB
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const data = {
        key,
        value,
        timestamp: Date.now(),
        expiry: ttl ? Date.now() + ttl : undefined,
      };

      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Deletes a value from IndexedDB
   */
  async delete(key: string): Promise<void> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Clears all data from the store
   */
  async clear(): Promise<void> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Gets all keys in the store
   */
  async keys(): Promise<string[]> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAllKeys();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as string[]);
    });
  }

  /**
   * Closes the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.dbPromise = null;
    }
  }
}

// ============================================================================
// GLOBAL CACHE INSTANCES
// ============================================================================

// Singleton instances for global use
let styleCache: StyleComputationCache | null = null;
let codeCache: CodeGenerationCache | null = null;
let thumbnailCache: ThumbnailCache | null = null;
let projectCache: IndexedDBCache | null = null;

/**
 * Gets the global style computation cache
 */
export function getStyleCache(): StyleComputationCache {
  if (!styleCache) {
    styleCache = new StyleComputationCache();
  }
  return styleCache;
}

/**
 * Gets the global code generation cache
 */
export function getCodeCache(): CodeGenerationCache {
  if (!codeCache) {
    codeCache = new CodeGenerationCache();
  }
  return codeCache;
}

/**
 * Gets the global thumbnail cache
 */
export function getThumbnailCache(): ThumbnailCache {
  if (!thumbnailCache) {
    thumbnailCache = new ThumbnailCache();
  }
  return thumbnailCache;
}

/**
 * Gets the global project IndexedDB cache
 */
export function getProjectCache(): IndexedDBCache {
  if (!projectCache) {
    projectCache = new IndexedDBCache({
      dbName: 'tailwind-builder',
      storeName: 'projects',
      version: 1,
    });
  }
  return projectCache;
}

/**
 * Clears all global caches
 */
export function clearAllCaches(): void {
  styleCache?.clear();
  codeCache?.clear();
  thumbnailCache?.clear();
  projectCache?.clear();
}

// ============================================================================
// CACHE HOOKS UTILITIES
// ============================================================================

/**
 * Creates a cache key from an object
 */
export function createCacheKey(obj: Record<string, unknown>): string {
  return JSON.stringify(obj, Object.keys(obj).sort());
}

/**
 * Creates a hash from a string (for cache keys)
 */
export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * Debounces cache writes
 */
export function createDebouncedCacheWriter<K, V>(
  cache: LRUCache<K, V>,
  delay: number = 100
): (key: K, value: V) => void {
  const pending = new Map<K, NodeJS.Timeout>();

  return (key: K, value: V) => {
    if (pending.has(key)) {
      clearTimeout(pending.get(key));
    }

    pending.set(
      key,
      setTimeout(() => {
        cache.set(key, value);
        pending.delete(key);
      }, delay)
    );
  };
}
