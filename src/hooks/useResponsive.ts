'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  TAILWIND_BREAKPOINTS,
  getBreakpointForWidth,
  resolveResponsiveValue,
  type BreakpointConfig,
  type ResponsiveValue,
} from '@/lib/responsiveSystem';
import {
  type DevicePreset,
  type DeviceOrientation,
  getOrientedDimensions,
} from '@/lib/breakpointPresets';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Current viewport state
 */
export interface ViewportState {
  width: number;
  height: number;
  orientation: DeviceOrientation;
  pixelRatio: number;
  isTouchDevice: boolean;
  isRetina: boolean;
}

/**
 * Current breakpoint information
 */
export interface BreakpointState {
  current: string;
  config: BreakpointConfig | undefined;
  isAbove: (breakpoint: string) => boolean;
  isBelow: (breakpoint: string) => boolean;
  isBetween: (min: string, max: string) => boolean;
  matches: (breakpoint: string) => boolean;
}

/**
 * Media query match state
 */
export interface MediaQueryState {
  matches: boolean;
  query: string;
}

/**
 * Responsive hook options
 */
export interface UseResponsiveOptions {
  breakpoints?: BreakpointConfig[];
  debounceMs?: number;
  enableSSR?: boolean;
  defaultWidth?: number;
  defaultHeight?: number;
}

/**
 * Breakpoint change callback
 */
export type BreakpointChangeCallback = (
  current: string,
  previous: string | null,
  direction: 'up' | 'down' | null
) => void;

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * useResponsive - Comprehensive responsive hook
 *
 * Provides current breakpoint detection, viewport information,
 * breakpoint change callbacks, and responsive value resolution.
 *
 * @param options - Configuration options
 * @returns Responsive state and utilities
 *
 * @example
 * const { breakpoint, viewport, value, on } = useResponsive();
 *
 * // Get current breakpoint
 * console.log(breakpoint.current); // 'lg'
 *
 * // Resolve responsive values
 * const fontSize = value({ sm: '14px', lg: '16px' }, '12px');
 *
 * // Check breakpoint conditions
 * if (breakpoint.isAbove('md')) {
 *   // Desktop layout
 * }
 */
export function useResponsive(options: UseResponsiveOptions = {}) {
  const {
    breakpoints = TAILWIND_BREAKPOINTS,
    debounceMs = 100,
    // enableSSR reserved for future SSR support
    defaultWidth = 1024,
    defaultHeight = 768,
  } = options;

  // Refs for callbacks and cleanup
  const breakpointCallbacksRef = useRef<Set<BreakpointChangeCallback>>(new Set());
  const previousBreakpointRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Viewport state
  const [viewport, setViewport] = useState<ViewportState>(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
        pixelRatio: window.devicePixelRatio || 1,
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        isRetina: (window.devicePixelRatio || 1) >= 2,
      };
    }
    return {
      width: defaultWidth,
      height: defaultHeight,
      orientation: defaultWidth > defaultHeight ? 'landscape' : 'portrait',
      pixelRatio: 1,
      isTouchDevice: false,
      isRetina: false,
    };
  });

  // Get current breakpoint configuration
  const currentBreakpointConfig = useMemo(() => {
    return getBreakpointForWidth(viewport.width, breakpoints);
  }, [viewport.width, breakpoints]);

  // Create breakpoint state object
  const breakpoint = useMemo<BreakpointState>(() => {
    const current = currentBreakpointConfig?.name || 'xs';
    const sortedBreakpoints = [...breakpoints].sort((a, b) => a.minWidth - b.minWidth);
    const currentIndex = sortedBreakpoints.findIndex((bp) => bp.name === current);

    const isAbove = (bp: string): boolean => {
      const targetIndex = sortedBreakpoints.findIndex((b) => b.name === bp);
      return targetIndex !== -1 && currentIndex >= targetIndex;
    };

    const isBelow = (bp: string): boolean => {
      const targetIndex = sortedBreakpoints.findIndex((b) => b.name === bp);
      return targetIndex !== -1 && currentIndex < targetIndex;
    };

    const isBetween = (min: string, max: string): boolean => {
      return isAbove(min) && isBelow(max);
    };

    const matches = (bp: string): boolean => {
      return current === bp;
    };

    return {
      current,
      config: currentBreakpointConfig,
      isAbove,
      isBelow,
      isBetween,
      matches,
    };
  }, [currentBreakpointConfig, breakpoints]);

  // Resolve responsive values
  const value = useCallback(
    <T>(responsiveValue: ResponsiveValue<T>, defaultValue?: T): T | undefined => {
      const resolved = resolveResponsiveValue(
        responsiveValue,
        breakpoint.current,
        breakpoints.map((bp) => bp.name)
      );
      return resolved !== undefined ? resolved : defaultValue;
    },
    [breakpoint.current, breakpoints]
  );

  // Register breakpoint change callback
  const onBreakpointChange = useCallback((callback: BreakpointChangeCallback) => {
    breakpointCallbacksRef.current.add(callback);
    return () => {
      breakpointCallbacksRef.current.delete(callback);
    };
  }, []);

  // Handle resize with debouncing
  const handleResize = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      setViewport({
        width: newWidth,
        height: newHeight,
        orientation: newWidth > newHeight ? 'landscape' : 'portrait',
        pixelRatio: window.devicePixelRatio || 1,
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        isRetina: (window.devicePixelRatio || 1) >= 2,
      });
    }, debounceMs);
  }, [debounceMs]);

  // Watch for breakpoint changes and fire callbacks
  useEffect(() => {
    const current = breakpoint.current;
    const previous = previousBreakpointRef.current;

    if (previous !== null && previous !== current) {
      const sortedBreakpoints = [...breakpoints].sort((a, b) => a.minWidth - b.minWidth);
      const currentIndex = sortedBreakpoints.findIndex((bp) => bp.name === current);
      const previousIndex = sortedBreakpoints.findIndex((bp) => bp.name === previous);
      const direction = currentIndex > previousIndex ? 'up' : 'down';

      breakpointCallbacksRef.current.forEach((callback) => {
        callback(current, previous, direction);
      });
    }

    previousBreakpointRef.current = current;
  }, [breakpoint.current, breakpoints]);

  // Set up resize listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [handleResize]);

  return {
    viewport,
    breakpoint,
    value,
    onBreakpointChange,
  };
}

// ============================================================================
// MEDIA QUERY HOOK
// ============================================================================

/**
 * useMediaQuery - Match a specific media query
 *
 * @param query - CSS media query string
 * @returns Whether the media query matches
 *
 * @example
 * const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 * const prefersColorScheme = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Use the modern API with fallback
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}

/**
 * useMediaQueries - Match multiple media queries
 *
 * @param queries - Object of named media queries
 * @returns Object with match results for each query
 *
 * @example
 * const { isMobile, isTablet, isDesktop } = useMediaQueries({
 *   isMobile: '(max-width: 767px)',
 *   isTablet: '(min-width: 768px) and (max-width: 1023px)',
 *   isDesktop: '(min-width: 1024px)',
 * });
 */
export function useMediaQueries<T extends Record<string, string>>(
  queries: T
): Record<keyof T, boolean> {
  const [matches, setMatches] = useState<Record<keyof T, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (typeof window !== 'undefined') {
      Object.entries(queries).forEach(([key, query]) => {
        initial[key] = window.matchMedia(query).matches;
      });
    } else {
      Object.keys(queries).forEach((key) => {
        initial[key] = false;
      });
    }
    return initial as Record<keyof T, boolean>;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueries: Map<string, MediaQueryList> = new Map();
    const handlers: Map<string, (event: MediaQueryListEvent) => void> = new Map();

    Object.entries(queries).forEach(([key, query]) => {
      const mq = window.matchMedia(query);
      mediaQueries.set(key, mq);

      const handler = (event: MediaQueryListEvent) => {
        setMatches((prev) => ({ ...prev, [key]: event.matches }));
      };
      handlers.set(key, handler);

      if (mq.addEventListener) {
        mq.addEventListener('change', handler);
      } else {
        mq.addListener(handler);
      }

      // Set initial value
      setMatches((prev) => ({ ...prev, [key]: mq.matches }));
    });

    return () => {
      mediaQueries.forEach((mq, key) => {
        const handler = handlers.get(key);
        if (handler) {
          if (mq.removeEventListener) {
            mq.removeEventListener('change', handler);
          } else {
            mq.removeListener(handler);
          }
        }
      });
    };
  }, [queries]);

  return matches;
}

// ============================================================================
// BREAKPOINT HOOKS
// ============================================================================

/**
 * useBreakpoint - Simple current breakpoint hook
 *
 * @param breakpoints - Optional custom breakpoints
 * @returns Current breakpoint name
 */
export function useBreakpoint(
  breakpoints: BreakpointConfig[] = TAILWIND_BREAKPOINTS
): string {
  const { breakpoint } = useResponsive({ breakpoints });
  return breakpoint.current;
}

/**
 * useIsBreakpoint - Check if current breakpoint matches
 *
 * @param targetBreakpoint - Breakpoint to check
 * @param breakpoints - Optional custom breakpoints
 * @returns Whether the current breakpoint matches
 */
export function useIsBreakpoint(
  targetBreakpoint: string,
  breakpoints: BreakpointConfig[] = TAILWIND_BREAKPOINTS
): boolean {
  const { breakpoint } = useResponsive({ breakpoints });
  return breakpoint.matches(targetBreakpoint);
}

/**
 * useIsAboveBreakpoint - Check if viewport is at or above breakpoint
 *
 * @param targetBreakpoint - Breakpoint to check against
 * @param breakpoints - Optional custom breakpoints
 * @returns Whether viewport is at or above the breakpoint
 */
export function useIsAboveBreakpoint(
  targetBreakpoint: string,
  breakpoints: BreakpointConfig[] = TAILWIND_BREAKPOINTS
): boolean {
  const { breakpoint } = useResponsive({ breakpoints });
  return breakpoint.isAbove(targetBreakpoint);
}

/**
 * useIsBelowBreakpoint - Check if viewport is below breakpoint
 *
 * @param targetBreakpoint - Breakpoint to check against
 * @param breakpoints - Optional custom breakpoints
 * @returns Whether viewport is below the breakpoint
 */
export function useIsBelowBreakpoint(
  targetBreakpoint: string,
  breakpoints: BreakpointConfig[] = TAILWIND_BREAKPOINTS
): boolean {
  const { breakpoint } = useResponsive({ breakpoints });
  return breakpoint.isBelow(targetBreakpoint);
}

// ============================================================================
// DEVICE DETECTION HOOKS
// ============================================================================

/**
 * useDeviceType - Detect general device type
 *
 * @returns Device type information
 */
export function useDeviceType() {
  const { viewport, breakpoint } = useResponsive();

  return useMemo(() => {
    const isMobile = breakpoint.isBelow('md');
    const isTablet = breakpoint.isAbove('md') && breakpoint.isBelow('lg');
    const isDesktop = breakpoint.isAbove('lg');

    return {
      isMobile,
      isTablet,
      isDesktop,
      isTouch: viewport.isTouchDevice,
      isRetina: viewport.isRetina,
      orientation: viewport.orientation,
      type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    };
  }, [viewport, breakpoint]);
}

/**
 * useOrientation - Track viewport orientation
 *
 * @returns Current orientation
 */
export function useOrientation(): DeviceOrientation {
  const { viewport } = useResponsive();
  return viewport.orientation;
}

/**
 * useViewportSize - Get current viewport dimensions
 *
 * @returns Width and height
 */
export function useViewportSize(): { width: number; height: number } {
  const { viewport } = useResponsive();
  return { width: viewport.width, height: viewport.height };
}

// ============================================================================
// RESPONSIVE VALUE HOOK
// ============================================================================

/**
 * useResponsiveValue - Resolve a responsive value based on current breakpoint
 *
 * @param values - Responsive value object or single value
 * @param defaultValue - Default value if no match found
 * @returns Resolved value for current breakpoint
 *
 * @example
 * const columns = useResponsiveValue({ sm: 1, md: 2, lg: 4 }, 1);
 * const padding = useResponsiveValue({ default: 16, lg: 24 });
 */
export function useResponsiveValue<T>(
  values: ResponsiveValue<T>,
  defaultValue?: T
): T | undefined {
  const { value } = useResponsive();
  return value(values, defaultValue);
}

// ============================================================================
// CONTAINER QUERY HOOK
// ============================================================================

/**
 * useContainerQuery - Observe container size for container queries
 *
 * @param containerRef - Ref to the container element
 * @param breakpoints - Container breakpoint configurations
 * @returns Current container breakpoint and size
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const { containerBreakpoint, containerWidth } = useContainerQuery(ref, [
 *   { name: 'sm', minWidth: 320 },
 *   { name: 'md', minWidth: 480 },
 *   { name: 'lg', minWidth: 640 },
 * ]);
 */
export function useContainerQuery(
  containerRef: React.RefObject<HTMLElement>,
  breakpoints: { name: string; minWidth: number }[]
) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [containerRef]);

  const containerBreakpoint = useMemo(() => {
    const sorted = [...breakpoints].sort((a, b) => b.minWidth - a.minWidth);
    for (const bp of sorted) {
      if (containerSize.width >= bp.minWidth) {
        return bp.name;
      }
    }
    return breakpoints[0]?.name || 'xs';
  }, [containerSize.width, breakpoints]);

  return {
    containerBreakpoint,
    containerWidth: containerSize.width,
    containerHeight: containerSize.height,
    containerSize,
  };
}

// ============================================================================
// DEVICE PREVIEW HOOK
// ============================================================================

/**
 * useDevicePreview - Simulate a device preset dimensions
 *
 * @param preset - Device preset to simulate
 * @param orientation - Orientation override
 * @returns Simulated viewport dimensions and utilities
 */
export function useDevicePreview(
  preset: DevicePreset | null,
  orientation?: DeviceOrientation
) {
  const dims = useMemo(() => {
    if (!preset) return null;
    return getOrientedDimensions(preset, orientation || preset.defaultOrientation);
  }, [preset, orientation]);

  const frameStyles = useMemo(() => {
    if (!dims || !preset) return {};

    return {
      width: `${dims.width}px`,
      height: `${dims.height}px`,
      borderRadius: preset.cornerRadius ? `${preset.cornerRadius}px` : undefined,
      '--safe-area-top': `${dims.safeAreaTop}px`,
      '--safe-area-bottom': `${dims.safeAreaBottom}px`,
      '--safe-area-left': `${dims.safeAreaLeft}px`,
      '--safe-area-right': `${dims.safeAreaRight}px`,
    } as React.CSSProperties;
  }, [dims, preset]);

  return {
    dimensions: dims,
    frameStyles,
    hasNotch: preset?.hasNotch || false,
    hasDynamicIsland: preset?.hasDynamicIsland || false,
    hasHomeIndicator: preset?.hasHomeIndicator || false,
    hasNavigationBar: preset?.hasNavigationBar || false,
    pixelDensity: preset?.pixelDensity || 1,
  };
}

// ============================================================================
// PREFERENCE HOOKS
// ============================================================================

/**
 * usePrefersReducedMotion - Check if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * usePrefersDarkMode - Check if user prefers dark mode
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * usePrefersHighContrast - Check if user prefers high contrast
 */
export function usePrefersHighContrast(): boolean {
  return useMediaQuery('(prefers-contrast: more)');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default useResponsive;
