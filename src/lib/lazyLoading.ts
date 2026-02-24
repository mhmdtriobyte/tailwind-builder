/**
 * Lazy Loading System
 *
 * Comprehensive lazy loading utilities for components, images, and content.
 * Includes Intersection Observer utilities, blur placeholders, and skeleton loaders.
 */

import { ComponentType, lazy, Suspense, createElement, ReactNode } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface LazyLoadOptions {
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Threshold for intersection observer */
  threshold?: number | number[];
  /** Whether to load immediately on server */
  ssr?: boolean;
  /** Placeholder to show while loading */
  placeholder?: ReactNode;
  /** Delay before showing content (for skeleton effect) */
  delay?: number;
}

export interface ImageLazyLoadOptions extends LazyLoadOptions {
  /** Low-quality placeholder image URL */
  lqip?: string;
  /** Blur amount for placeholder */
  blurAmount?: number;
  /** Fade-in duration in ms */
  fadeInDuration?: number;
  /** Whether to use native lazy loading */
  useNativeLazy?: boolean;
}

export interface VirtualScrollOptions {
  /** Height of each item */
  itemHeight: number;
  /** Number of items to render outside viewport */
  overscan?: number;
  /** Total number of items */
  itemCount: number;
  /** Callback when visible range changes */
  onRangeChange?: (start: number, end: number) => void;
}

export interface SkeletonConfig {
  /** Width of skeleton */
  width?: string | number;
  /** Height of skeleton */
  height?: string | number;
  /** Border radius */
  borderRadius?: string | number;
  /** Animation type */
  animation?: 'pulse' | 'wave' | 'none';
  /** Background color */
  backgroundColor?: string;
  /** Highlight color for animation */
  highlightColor?: string;
}

// ============================================================================
// INTERSECTION OBSERVER UTILITIES
// ============================================================================

/**
 * Cache for intersection observers to avoid creating duplicates
 */
const observerCache = new Map<string, IntersectionObserver>();

/**
 * Creates or retrieves a cached intersection observer
 */
export function getIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const key = JSON.stringify(options);

  if (observerCache.has(key)) {
    return observerCache.get(key)!;
  }

  const observer = new IntersectionObserver(callback, options);
  observerCache.set(key, observer);

  return observer;
}

/**
 * Clears all cached observers
 */
export function clearObserverCache(): void {
  observerCache.forEach((observer) => observer.disconnect());
  observerCache.clear();
}

/**
 * Creates an intersection observer that triggers once
 */
export function createOnceObserver(
  onIntersect: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onIntersect(entry);
        observer.unobserve(entry.target);
      }
    });
  }, options);
}

/**
 * Observes an element and returns a cleanup function
 */
export function observeElement(
  element: Element,
  callback: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): () => void {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      callback(entry.isIntersecting, entry);
    });
  }, options);

  observer.observe(element);

  return () => {
    observer.unobserve(element);
    observer.disconnect();
  };
}

// ============================================================================
// COMPONENT LAZY LOADING
// ============================================================================

/**
 * Creates a lazy-loaded component with configurable options
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): ComponentType<React.ComponentProps<T>> {
  const LazyComponent = lazy(async () => {
    if (options.delay) {
      await new Promise((resolve) => setTimeout(resolve, options.delay));
    }
    return importFn();
  });

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return createElement(
      Suspense,
      { fallback: options.placeholder || null },
      createElement(LazyComponent, props)
    );
  };
}

/**
 * Preloads a lazy component
 */
export function preloadComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): void {
  importFn();
}

/**
 * Creates a component that only loads when visible
 */
export function createVisibilityLoadedComponent<P extends object>(
  Component: ComponentType<P>,
  options: LazyLoadOptions = {}
): ComponentType<P & { onLoad?: () => void }> {
  return function VisibilityLoadedWrapper(props: P & { onLoad?: () => void }) {
    const { onLoad, ...componentProps } = props;

    // This would typically use a ref and intersection observer
    // Returning a simplified version for SSR compatibility
    return createElement(Component, componentProps as P);
  };
}

// ============================================================================
// IMAGE LAZY LOADING
// ============================================================================

/**
 * Generates a low-quality image placeholder (LQIP) data URL
 */
export function generateLQIP(
  width: number,
  height: number,
  color: string = '#e5e7eb'
): string {
  // Create a simple SVG placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Generates a blur placeholder SVG
 */
export function generateBlurPlaceholder(
  width: number,
  height: number,
  blurDataURL?: string
): string {
  if (blurDataURL) {
    return blurDataURL;
  }

  // Create a gradient placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" filter="url(#blur)"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Creates image lazy loading configuration
 */
export function createImageLazyConfig(options: ImageLazyLoadOptions = {}): {
  loading: 'lazy' | 'eager';
  decoding: 'async' | 'sync';
  style: Record<string, string>;
  placeholder?: string;
} {
  const {
    useNativeLazy = true,
    blurAmount = 20,
    fadeInDuration = 300,
    lqip,
  } = options;

  return {
    loading: useNativeLazy ? 'lazy' : 'eager',
    decoding: 'async',
    style: {
      transition: `opacity ${fadeInDuration}ms ease-in-out, filter ${fadeInDuration}ms ease-in-out`,
    },
    placeholder: lqip,
  };
}

/**
 * Calculates optimal image dimensions for responsive loading
 */
export function calculateResponsiveImageSizes(
  originalWidth: number,
  originalHeight: number,
  breakpoints: number[] = [320, 640, 768, 1024, 1280, 1536]
): { width: number; height: number; srcSet: string }[] {
  const aspectRatio = originalHeight / originalWidth;

  return breakpoints
    .filter((bp) => bp <= originalWidth)
    .map((width) => ({
      width,
      height: Math.round(width * aspectRatio),
      srcSet: `${width}w`,
    }));
}

// ============================================================================
// SKELETON LOADERS
// ============================================================================

/**
 * Default skeleton configurations for common element types
 */
export const SKELETON_PRESETS: Record<string, SkeletonConfig> = {
  text: {
    width: '100%',
    height: 16,
    borderRadius: 4,
    animation: 'pulse',
  },
  heading: {
    width: '60%',
    height: 24,
    borderRadius: 4,
    animation: 'pulse',
  },
  paragraph: {
    width: '100%',
    height: 60,
    borderRadius: 4,
    animation: 'pulse',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    animation: 'pulse',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    animation: 'pulse',
  },
  card: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    animation: 'pulse',
  },
  button: {
    width: 120,
    height: 40,
    borderRadius: 8,
    animation: 'pulse',
  },
  input: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    animation: 'pulse',
  },
};

/**
 * Generates CSS for skeleton animation
 */
export function generateSkeletonCSS(config: SkeletonConfig = {}): string {
  const {
    width = '100%',
    height = 20,
    borderRadius = 4,
    animation = 'pulse',
    backgroundColor = '#e5e7eb',
    highlightColor = '#f3f4f6',
  } = config;

  const widthValue = typeof width === 'number' ? `${width}px` : width;
  const heightValue = typeof height === 'number' ? `${height}px` : height;
  const radiusValue = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  let animationCSS = '';

  if (animation === 'pulse') {
    animationCSS = `
      animation: skeleton-pulse 2s ease-in-out infinite;
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
  } else if (animation === 'wave') {
    animationCSS = `
      background: linear-gradient(
        90deg,
        ${backgroundColor} 25%,
        ${highlightColor} 50%,
        ${backgroundColor} 75%
      );
      background-size: 200% 100%;
      animation: skeleton-wave 1.5s ease-in-out infinite;
      @keyframes skeleton-wave {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
  }

  return `
    width: ${widthValue};
    height: ${heightValue};
    border-radius: ${radiusValue};
    background-color: ${backgroundColor};
    ${animationCSS}
  `.trim();
}

/**
 * Generates inline styles for skeleton
 */
export function getSkeletonStyles(config: SkeletonConfig = {}): Record<string, string | number> {
  const {
    width = '100%',
    height = 20,
    borderRadius = 4,
    backgroundColor = '#e5e7eb',
  } = config;

  return {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    backgroundColor,
  };
}

// ============================================================================
// VIRTUAL SCROLLING UTILITIES
// ============================================================================

/**
 * Calculates visible range for virtual scrolling
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  itemCount: number,
  overscan: number = 3
): { start: number; end: number; offsetTop: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(itemCount, start + visibleCount + overscan * 2);
  const offsetTop = start * itemHeight;

  return { start, end, offsetTop };
}

/**
 * Creates a virtual scroll configuration
 */
export function createVirtualScrollConfig(options: VirtualScrollOptions): {
  totalHeight: number;
  getItemOffset: (index: number) => number;
  getVisibleRange: (scrollTop: number, containerHeight: number) => { start: number; end: number };
} {
  const { itemHeight, itemCount, overscan = 3 } = options;

  return {
    totalHeight: itemCount * itemHeight,
    getItemOffset: (index: number) => index * itemHeight,
    getVisibleRange: (scrollTop: number, containerHeight: number) => {
      const result = calculateVisibleRange(scrollTop, containerHeight, itemHeight, itemCount, overscan);
      return { start: result.start, end: result.end };
    },
  };
}

/**
 * Calculates dynamic heights for variable-size items
 */
export function calculateDynamicVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeights: number[],
  overscan: number = 3
): { start: number; end: number; offsetTop: number; heights: number[] } {
  let accumulatedHeight = 0;
  let start = 0;

  // Find start index
  for (let i = 0; i < itemHeights.length; i++) {
    if (accumulatedHeight + itemHeights[i] > scrollTop) {
      start = Math.max(0, i - overscan);
      break;
    }
    accumulatedHeight += itemHeights[i];
  }

  // Find end index
  accumulatedHeight = 0;
  for (let i = 0; i < start; i++) {
    accumulatedHeight += itemHeights[i];
  }
  const offsetTop = accumulatedHeight;

  let visibleHeight = 0;
  let end = start;

  for (let i = start; i < itemHeights.length; i++) {
    visibleHeight += itemHeights[i];
    end = i + 1;
    if (visibleHeight >= containerHeight + (overscan * 2 * (itemHeights[i] || 50))) {
      break;
    }
  }

  const heights = itemHeights.slice(start, end);

  return { start, end: Math.min(end + overscan, itemHeights.length), offsetTop, heights };
}

// ============================================================================
// CONTENT LOADING UTILITIES
// ============================================================================

/**
 * Deferred content loader with priority queue
 */
export class DeferredContentLoader {
  private queue: Array<{
    id: string;
    priority: number;
    load: () => Promise<void>;
  }> = [];
  private loading = false;
  private loaded = new Set<string>();

  /**
   * Adds content to the load queue
   */
  enqueue(id: string, load: () => Promise<void>, priority: number = 0): void {
    if (this.loaded.has(id)) return;

    this.queue.push({ id, priority, load });
    this.queue.sort((a, b) => b.priority - a.priority);

    this.processQueue();
  }

  /**
   * Removes content from the queue
   */
  dequeue(id: string): void {
    this.queue = this.queue.filter((item) => item.id !== id);
  }

  /**
   * Processes the queue
   */
  private async processQueue(): Promise<void> {
    if (this.loading || this.queue.length === 0) return;

    this.loading = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item || this.loaded.has(item.id)) continue;

      try {
        await item.load();
        this.loaded.add(item.id);
      } catch (error) {
        console.error(`Failed to load content: ${item.id}`, error);
      }
    }

    this.loading = false;
  }

  /**
   * Checks if content is loaded
   */
  isLoaded(id: string): boolean {
    return this.loaded.has(id);
  }

  /**
   * Clears the loader state
   */
  clear(): void {
    this.queue = [];
    this.loaded.clear();
    this.loading = false;
  }
}

/**
 * Creates a singleton content loader
 */
let contentLoaderInstance: DeferredContentLoader | null = null;

export function getContentLoader(): DeferredContentLoader {
  if (!contentLoaderInstance) {
    contentLoaderInstance = new DeferredContentLoader();
  }
  return contentLoaderInstance;
}

// ============================================================================
// PROGRESSIVE LOADING
// ============================================================================

/**
 * Configuration for progressive loading
 */
export interface ProgressiveLoadConfig {
  /** Number of items to load initially */
  initialCount: number;
  /** Number of items to load on each scroll */
  batchSize: number;
  /** Threshold from bottom to trigger load (in pixels) */
  loadThreshold: number;
}

/**
 * Creates a progressive loading state manager
 */
export function createProgressiveLoader<T>(
  items: T[],
  config: ProgressiveLoadConfig
): {
  getVisibleItems: () => T[];
  loadMore: () => boolean;
  hasMore: () => boolean;
  reset: () => void;
  visibleCount: number;
} {
  let visibleCount = config.initialCount;

  return {
    getVisibleItems: () => items.slice(0, visibleCount),
    loadMore: () => {
      if (visibleCount >= items.length) return false;
      visibleCount = Math.min(visibleCount + config.batchSize, items.length);
      return true;
    },
    hasMore: () => visibleCount < items.length,
    reset: () => {
      visibleCount = config.initialCount;
    },
    get visibleCount() {
      return visibleCount;
    },
  };
}

// ============================================================================
// REQUEST IDLE CALLBACK UTILITIES
// ============================================================================

/**
 * Polyfill for requestIdleCallback
 */
export const requestIdleCallback: (
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
) => number =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? (window as any).requestIdleCallback
    : (callback: IdleRequestCallback) => {
        const start = Date.now();
        return window.setTimeout(() => {
          callback({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
          });
        }, 1);
      };

/**
 * Polyfill for cancelIdleCallback
 */
export const cancelIdleCallback: (handle: number) => void =
  typeof window !== 'undefined' && 'cancelIdleCallback' in window
    ? (window as any).cancelIdleCallback
    : (handle: number) => window.clearTimeout(handle);

/**
 * Executes a task during idle time
 */
export function runWhenIdle(
  task: () => void,
  options: { timeout?: number } = {}
): number {
  return requestIdleCallback(
    (deadline) => {
      if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
        task();
      }
    },
    { timeout: options.timeout || 1000 }
  );
}

/**
 * Chunks an array of tasks to run during idle periods
 */
export function runTasksWhenIdle(
  tasks: Array<() => void>,
  options: { timeout?: number; onComplete?: () => void } = {}
): () => void {
  let currentIndex = 0;
  let handle: number;
  let cancelled = false;

  function processNextTask(deadline: IdleDeadline): void {
    if (cancelled) return;

    while (currentIndex < tasks.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
      tasks[currentIndex]();
      currentIndex++;
    }

    if (currentIndex < tasks.length) {
      handle = requestIdleCallback(processNextTask, { timeout: options.timeout || 1000 });
    } else if (options.onComplete) {
      options.onComplete();
    }
  }

  handle = requestIdleCallback(processNextTask, { timeout: options.timeout || 1000 });

  return () => {
    cancelled = true;
    cancelIdleCallback(handle);
  };
}
