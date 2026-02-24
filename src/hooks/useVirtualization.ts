/**
 * useVirtualization Hook
 *
 * Provides virtual scrolling capabilities for large lists of components.
 * Supports both fixed and dynamic height items, with windowing for optimal performance.
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface VirtualizationOptions {
  /** Total number of items */
  itemCount: number;
  /** Fixed height for each item (use for fixed-height lists) */
  itemHeight?: number;
  /** Function to get item height (use for dynamic heights) */
  getItemHeight?: (index: number) => number;
  /** Number of items to render above/below viewport */
  overscan?: number;
  /** Estimated average item height for dynamic lists */
  estimatedItemHeight?: number;
  /** Whether to enable smooth scrolling */
  smoothScroll?: boolean;
  /** Scroll direction */
  direction?: 'vertical' | 'horizontal';
}

export interface VirtualItem {
  index: number;
  start: number;
  end: number;
  size: number;
}

export interface VirtualizationResult {
  /** Virtual items currently in view */
  virtualItems: VirtualItem[];
  /** Total size of the virtualized content */
  totalSize: number;
  /** Callback to set the scroll container ref */
  setContainerRef: (node: HTMLElement | null) => void;
  /** Scroll to a specific index */
  scrollToIndex: (index: number, options?: ScrollToOptions) => void;
  /** Scroll to a specific offset */
  scrollToOffset: (offset: number, options?: ScrollToOptions) => void;
  /** Current scroll offset */
  scrollOffset: number;
  /** Whether the list is scrolling */
  isScrolling: boolean;
  /** Range of visible items */
  visibleRange: { start: number; end: number };
  /** Measure a specific item (for dynamic heights) */
  measureItem: (index: number, size: number) => void;
}

export interface ScrollToOptions {
  align?: 'start' | 'center' | 'end' | 'auto';
  behavior?: 'auto' | 'smooth';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Binary search to find the item at a given offset
 */
function findItemAtOffset(
  itemCount: number,
  getItemOffset: (index: number) => number,
  offset: number
): number {
  let low = 0;
  let high = itemCount - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midOffset = getItemOffset(mid);

    if (midOffset === offset) {
      return mid;
    } else if (midOffset < offset) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return Math.max(0, low - 1);
}

/**
 * Calculates item offsets for fixed-height items
 */
function getFixedOffset(index: number, itemHeight: number): number {
  return index * itemHeight;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Hook for virtualizing large lists
 */
export function useVirtualization(options: VirtualizationOptions): VirtualizationResult {
  const {
    itemCount,
    itemHeight: fixedItemHeight,
    getItemHeight,
    overscan = 3,
    estimatedItemHeight = 50,
    smoothScroll = false,
    direction = 'vertical',
  } = options;

  // State
  const [scrollOffset, setScrollOffset] = useState(0);
  const [containerSize, setContainerSize] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Refs
  const containerRef = useRef<HTMLElement | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const measuredSizesRef = useRef<Map<number, number>>(new Map());
  const offsetCacheRef = useRef<number[]>([]);

  // Determine if using fixed or dynamic heights
  const isFixedHeight = fixedItemHeight !== undefined;

  /**
   * Gets the size of an item at a specific index
   */
  const getItemSize = useCallback(
    (index: number): number => {
      if (isFixedHeight) {
        return fixedItemHeight;
      }

      // Check measured sizes first
      const measured = measuredSizesRef.current.get(index);
      if (measured !== undefined) {
        return measured;
      }

      // Use custom function if provided
      if (getItemHeight) {
        return getItemHeight(index);
      }

      // Fall back to estimated height
      return estimatedItemHeight;
    },
    [isFixedHeight, fixedItemHeight, getItemHeight, estimatedItemHeight]
  );

  /**
   * Gets the offset of an item at a specific index
   */
  const getItemOffset = useCallback(
    (index: number): number => {
      if (isFixedHeight) {
        return getFixedOffset(index, fixedItemHeight);
      }

      // Check cache
      if (offsetCacheRef.current[index] !== undefined) {
        return offsetCacheRef.current[index];
      }

      // Calculate offset
      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += getItemSize(i);
      }

      // Cache the result
      offsetCacheRef.current[index] = offset;

      return offset;
    },
    [isFixedHeight, fixedItemHeight, getItemSize]
  );

  /**
   * Calculates the total size of all items
   */
  const totalSize = useMemo(() => {
    if (isFixedHeight) {
      return itemCount * fixedItemHeight;
    }

    let total = 0;
    for (let i = 0; i < itemCount; i++) {
      total += getItemSize(i);
    }
    return total;
  }, [isFixedHeight, fixedItemHeight, itemCount, getItemSize]);

  /**
   * Calculates visible range
   */
  const visibleRange = useMemo(() => {
    if (itemCount === 0) {
      return { start: 0, end: 0 };
    }

    const startIndex = findItemAtOffset(itemCount, getItemOffset, scrollOffset);
    let endIndex = startIndex;
    let accumulatedSize = 0;

    // Find end index
    while (endIndex < itemCount && accumulatedSize < containerSize) {
      accumulatedSize += getItemSize(endIndex);
      endIndex++;
    }

    // Apply overscan
    const start = Math.max(0, startIndex - overscan);
    const end = Math.min(itemCount, endIndex + overscan);

    return { start, end };
  }, [itemCount, scrollOffset, containerSize, getItemOffset, getItemSize, overscan]);

  /**
   * Generates virtual items for the visible range
   */
  const virtualItems = useMemo(() => {
    const items: VirtualItem[] = [];

    for (let i = visibleRange.start; i < visibleRange.end; i++) {
      const start = getItemOffset(i);
      const size = getItemSize(i);

      items.push({
        index: i,
        start,
        end: start + size,
        size,
      });
    }

    return items;
  }, [visibleRange, getItemOffset, getItemSize]);

  /**
   * Sets the container ref and sets up observers
   */
  const setContainerRef = useCallback((node: HTMLElement | null) => {
    containerRef.current = node;

    if (node) {
      // Set initial container size
      const size = direction === 'vertical' ? node.clientHeight : node.clientWidth;
      setContainerSize(size);

      // Set up resize observer
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newSize =
            direction === 'vertical'
              ? entry.contentRect.height
              : entry.contentRect.width;
          setContainerSize(newSize);
        }
      });

      resizeObserver.observe(node);

      // Set up scroll handler
      const handleScroll = () => {
        const offset = direction === 'vertical' ? node.scrollTop : node.scrollLeft;
        setScrollOffset(offset);
        setIsScrolling(true);

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Set scrolling to false after delay
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };

      node.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        resizeObserver.disconnect();
        node.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [direction]);

  /**
   * Scrolls to a specific index
   */
  const scrollToIndex = useCallback(
    (index: number, scrollOptions: ScrollToOptions = {}) => {
      const { align = 'start', behavior = smoothScroll ? 'smooth' : 'auto' } = scrollOptions;

      if (!containerRef.current || index < 0 || index >= itemCount) {
        return;
      }

      const itemOffset = getItemOffset(index);
      const itemSize = getItemSize(index);
      let targetOffset: number;

      switch (align) {
        case 'start':
          targetOffset = itemOffset;
          break;
        case 'center':
          targetOffset = itemOffset - containerSize / 2 + itemSize / 2;
          break;
        case 'end':
          targetOffset = itemOffset - containerSize + itemSize;
          break;
        case 'auto':
        default:
          // Scroll only if item is not fully visible
          if (itemOffset < scrollOffset) {
            targetOffset = itemOffset;
          } else if (itemOffset + itemSize > scrollOffset + containerSize) {
            targetOffset = itemOffset + itemSize - containerSize;
          } else {
            return; // Already visible
          }
          break;
      }

      targetOffset = Math.max(0, Math.min(targetOffset, totalSize - containerSize));

      if (direction === 'vertical') {
        containerRef.current.scrollTo({ top: targetOffset, behavior });
      } else {
        containerRef.current.scrollTo({ left: targetOffset, behavior });
      }
    },
    [
      itemCount,
      getItemOffset,
      getItemSize,
      containerSize,
      scrollOffset,
      totalSize,
      smoothScroll,
      direction,
    ]
  );

  /**
   * Scrolls to a specific offset
   */
  const scrollToOffset = useCallback(
    (offset: number, scrollOptions: ScrollToOptions = {}) => {
      const { behavior = smoothScroll ? 'smooth' : 'auto' } = scrollOptions;

      if (!containerRef.current) {
        return;
      }

      const targetOffset = Math.max(0, Math.min(offset, totalSize - containerSize));

      if (direction === 'vertical') {
        containerRef.current.scrollTo({ top: targetOffset, behavior });
      } else {
        containerRef.current.scrollTo({ left: targetOffset, behavior });
      }
    },
    [smoothScroll, totalSize, containerSize, direction]
  );

  /**
   * Measures an item (for dynamic heights)
   */
  const measureItem = useCallback((index: number, size: number) => {
    const currentSize = measuredSizesRef.current.get(index);
    if (currentSize !== size) {
      measuredSizesRef.current.set(index, size);
      // Invalidate offset cache from this index onwards
      offsetCacheRef.current = offsetCacheRef.current.slice(0, index);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    virtualItems,
    totalSize,
    setContainerRef,
    scrollToIndex,
    scrollToOffset,
    scrollOffset,
    isScrolling,
    visibleRange,
    measureItem,
  };
}

// ============================================================================
// WINDOW-BASED VIRTUALIZATION
// ============================================================================

/**
 * Hook for window-based virtualization (for infinite scroll, etc.)
 */
export function useWindowVirtualization(options: VirtualizationOptions): VirtualizationResult & {
  /** Whether the window scroll is being used */
  isUsingWindow: true;
} {
  const {
    itemCount,
    itemHeight: fixedItemHeight = 50,
    overscan = 5,
  } = options;

  const [scrollOffset, setScrollOffset] = useState(0);
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerTopRef = useRef(0);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const adjustedOffset = Math.max(0, scrollOffset - containerTopRef.current);
    const startIndex = Math.floor(adjustedOffset / fixedItemHeight);
    const endIndex = Math.ceil((adjustedOffset + windowHeight) / fixedItemHeight);

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(itemCount, endIndex + overscan),
    };
  }, [scrollOffset, windowHeight, fixedItemHeight, itemCount, overscan]);

  // Generate virtual items
  const virtualItems = useMemo(() => {
    const items: VirtualItem[] = [];

    for (let i = visibleRange.start; i < visibleRange.end; i++) {
      const start = i * fixedItemHeight;
      items.push({
        index: i,
        start,
        end: start + fixedItemHeight,
        size: fixedItemHeight,
      });
    }

    return items;
  }, [visibleRange, fixedItemHeight]);

  const totalSize = itemCount * fixedItemHeight;

  // Set up window scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const setContainerRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      containerTopRef.current = node.getBoundingClientRect().top + window.scrollY;
    }
  }, []);

  const scrollToIndex = useCallback(
    (index: number, scrollOptions: ScrollToOptions = {}) => {
      const { behavior = 'auto' } = scrollOptions;
      const targetOffset = containerTopRef.current + index * fixedItemHeight;
      window.scrollTo({ top: targetOffset, behavior });
    },
    [fixedItemHeight]
  );

  const scrollToOffset = useCallback((offset: number, scrollOptions: ScrollToOptions = {}) => {
    const { behavior = 'auto' } = scrollOptions;
    window.scrollTo({ top: offset, behavior });
  }, []);

  const measureItem = useCallback(() => {
    // No-op for fixed height window virtualization
  }, []);

  return {
    virtualItems,
    totalSize,
    setContainerRef,
    scrollToIndex,
    scrollToOffset,
    scrollOffset,
    isScrolling,
    visibleRange,
    measureItem,
    isUsingWindow: true,
  };
}

// ============================================================================
// GRID VIRTUALIZATION
// ============================================================================

export interface GridVirtualizationOptions {
  /** Total number of items */
  itemCount: number;
  /** Number of columns */
  columnCount: number;
  /** Width of each column */
  columnWidth: number;
  /** Height of each row */
  rowHeight: number;
  /** Gap between items */
  gap?: number;
  /** Overscan rows */
  overscanRows?: number;
}

export interface VirtualGridItem {
  index: number;
  row: number;
  column: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GridVirtualizationResult {
  virtualItems: VirtualGridItem[];
  totalHeight: number;
  totalWidth: number;
  setContainerRef: (node: HTMLElement | null) => void;
  scrollToIndex: (index: number) => void;
}

/**
 * Hook for virtualizing grid layouts
 */
export function useGridVirtualization(options: GridVirtualizationOptions): GridVirtualizationResult {
  const {
    itemCount,
    columnCount,
    columnWidth,
    rowHeight,
    gap = 0,
    overscanRows = 2,
  } = options;

  const [scrollOffset, setScrollOffset] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLElement | null>(null);

  const rowCount = Math.ceil(itemCount / columnCount);
  const totalHeight = rowCount * (rowHeight + gap) - gap;
  const totalWidth = columnCount * (columnWidth + gap) - gap;

  const visibleRowRange = useMemo(() => {
    const startRow = Math.floor(scrollOffset / (rowHeight + gap));
    const endRow = Math.ceil((scrollOffset + containerHeight) / (rowHeight + gap));

    return {
      start: Math.max(0, startRow - overscanRows),
      end: Math.min(rowCount, endRow + overscanRows),
    };
  }, [scrollOffset, containerHeight, rowHeight, gap, rowCount, overscanRows]);

  const virtualItems = useMemo(() => {
    const items: VirtualGridItem[] = [];

    for (let row = visibleRowRange.start; row < visibleRowRange.end; row++) {
      for (let col = 0; col < columnCount; col++) {
        const index = row * columnCount + col;
        if (index >= itemCount) break;

        items.push({
          index,
          row,
          column: col,
          x: col * (columnWidth + gap),
          y: row * (rowHeight + gap),
          width: columnWidth,
          height: rowHeight,
        });
      }
    }

    return items;
  }, [visibleRowRange, columnCount, columnWidth, rowHeight, gap, itemCount]);

  const setContainerRef = useCallback((node: HTMLElement | null) => {
    containerRef.current = node;

    if (node) {
      setContainerHeight(node.clientHeight);

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(node);

      const handleScroll = () => {
        setScrollOffset(node.scrollTop);
      };

      node.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        resizeObserver.disconnect();
        node.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (!containerRef.current) return;

      const row = Math.floor(index / columnCount);
      const targetOffset = row * (rowHeight + gap);

      containerRef.current.scrollTo({ top: targetOffset, behavior: 'smooth' });
    },
    [columnCount, rowHeight, gap]
  );

  return {
    virtualItems,
    totalHeight,
    totalWidth,
    setContainerRef,
    scrollToIndex,
  };
}

// ============================================================================
// CANVAS ELEMENT VIRTUALIZATION
// ============================================================================

export interface CanvasVirtualizationOptions {
  /** All elements in the canvas */
  elements: Array<{
    id: string;
    height?: number;
  }>;
  /** Default height for elements without specified height */
  defaultHeight?: number;
  /** Overscan count */
  overscan?: number;
}

/**
 * Hook specifically for virtualizing canvas elements in the builder
 */
export function useCanvasVirtualization(options: CanvasVirtualizationOptions) {
  const { elements, defaultHeight = 100, overscan = 3 } = options;

  // Create height getter
  const getItemHeight = useCallback(
    (index: number) => elements[index]?.height || defaultHeight,
    [elements, defaultHeight]
  );

  // Use main virtualization hook
  const virtualization = useVirtualization({
    itemCount: elements.length,
    getItemHeight,
    overscan,
    estimatedItemHeight: defaultHeight,
  });

  // Map virtual items to elements
  const virtualElements = useMemo(() => {
    return virtualization.virtualItems.map((item) => ({
      ...item,
      element: elements[item.index],
    }));
  }, [virtualization.virtualItems, elements]);

  return {
    ...virtualization,
    virtualElements,
  };
}
