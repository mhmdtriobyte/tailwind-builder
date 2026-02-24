/**
 * Smart Guides System - Visual alignment guides for design tools
 *
 * Features:
 * - Show guides when aligning
 * - Snap to guides
 * - Distance indicators
 * - Center guides
 * - Edge guides
 * - Custom guide positions
 * - Guide colors customization
 */

// ============================================================================
// TYPES
// ============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type GuideType =
  | 'edge-left'
  | 'edge-right'
  | 'edge-top'
  | 'edge-bottom'
  | 'center-horizontal'
  | 'center-vertical'
  | 'spacing'
  | 'custom';

export type GuideOrientation = 'horizontal' | 'vertical';

export interface Guide {
  id: string;
  type: GuideType;
  orientation: GuideOrientation;
  position: number;
  start: number;
  end: number;
  sourceElementId?: string;
  targetElementId?: string;
  distance?: number;
  color?: string;
  isSnapping?: boolean;
}

export interface DistanceIndicator {
  id: string;
  from: Point;
  to: Point;
  distance: number;
  orientation: GuideOrientation;
  label?: string;
}

export interface CustomGuide {
  id: string;
  orientation: GuideOrientation;
  position: number;
  color: string;
  locked: boolean;
  name?: string;
}

export interface GuideColors {
  edge: string;
  center: string;
  spacing: string;
  custom: string;
  snapping: string;
}

export interface SmartGuidesConfig {
  enabled: boolean;
  snapThreshold: number;
  showEdgeGuides: boolean;
  showCenterGuides: boolean;
  showSpacingGuides: boolean;
  showDistanceIndicators: boolean;
  colors: GuideColors;
  customGuides: CustomGuide[];
}

export interface SnapResult {
  snapped: boolean;
  snapX: number | null;
  snapY: number | null;
  guides: Guide[];
  distances: DistanceIndicator[];
}

export interface ElementEdges {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const DEFAULT_SNAP_THRESHOLD = 5;

export const DEFAULT_GUIDE_COLORS: GuideColors = {
  edge: '#ff6b6b',      // Red for edge alignment
  center: '#4ecdc4',    // Teal for center alignment
  spacing: '#ffe66d',   // Yellow for spacing
  custom: '#a855f7',    // Purple for custom guides
  snapping: '#22c55e',  // Green when snapping
};

export const DEFAULT_CONFIG: SmartGuidesConfig = {
  enabled: true,
  snapThreshold: DEFAULT_SNAP_THRESHOLD,
  showEdgeGuides: true,
  showCenterGuides: true,
  showSpacingGuides: true,
  showDistanceIndicators: true,
  colors: DEFAULT_GUIDE_COLORS,
  customGuides: [],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique guide ID
 */
function generateGuideId(): string {
  return `guide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all edges and center points of a rectangle
 */
export function getElementEdges(rect: Rect): ElementEdges {
  return {
    left: rect.x,
    right: rect.x + rect.width,
    top: rect.y,
    bottom: rect.y + rect.height,
    centerX: rect.x + rect.width / 2,
    centerY: rect.y + rect.height / 2,
  };
}

/**
 * Check if a value is within threshold of a target
 */
export function isWithinThreshold(
  value: number,
  target: number,
  threshold: number
): boolean {
  return Math.abs(value - target) <= threshold;
}

/**
 * Get the snap value if within threshold, otherwise return null
 */
export function getSnapValue(
  value: number,
  target: number,
  threshold: number
): number | null {
  return isWithinThreshold(value, target, threshold) ? target : null;
}

// ============================================================================
// GUIDE GENERATION
// ============================================================================

/**
 * Generate edge guides from an element
 */
export function generateEdgeGuides(
  elementId: string,
  rect: Rect,
  canvasHeight: number,
  canvasWidth: number,
  colors: GuideColors
): Guide[] {
  const edges = getElementEdges(rect);
  const guides: Guide[] = [];

  // Left edge
  guides.push({
    id: generateGuideId(),
    type: 'edge-left',
    orientation: 'vertical',
    position: edges.left,
    start: 0,
    end: canvasHeight,
    sourceElementId: elementId,
    color: colors.edge,
  });

  // Right edge
  guides.push({
    id: generateGuideId(),
    type: 'edge-right',
    orientation: 'vertical',
    position: edges.right,
    start: 0,
    end: canvasHeight,
    sourceElementId: elementId,
    color: colors.edge,
  });

  // Top edge
  guides.push({
    id: generateGuideId(),
    type: 'edge-top',
    orientation: 'horizontal',
    position: edges.top,
    start: 0,
    end: canvasWidth,
    sourceElementId: elementId,
    color: colors.edge,
  });

  // Bottom edge
  guides.push({
    id: generateGuideId(),
    type: 'edge-bottom',
    orientation: 'horizontal',
    position: edges.bottom,
    start: 0,
    end: canvasWidth,
    sourceElementId: elementId,
    color: colors.edge,
  });

  return guides;
}

/**
 * Generate center guides from an element
 */
export function generateCenterGuides(
  elementId: string,
  rect: Rect,
  canvasHeight: number,
  canvasWidth: number,
  colors: GuideColors
): Guide[] {
  const edges = getElementEdges(rect);
  const guides: Guide[] = [];

  // Horizontal center
  guides.push({
    id: generateGuideId(),
    type: 'center-horizontal',
    orientation: 'vertical',
    position: edges.centerX,
    start: 0,
    end: canvasHeight,
    sourceElementId: elementId,
    color: colors.center,
  });

  // Vertical center
  guides.push({
    id: generateGuideId(),
    type: 'center-vertical',
    orientation: 'horizontal',
    position: edges.centerY,
    start: 0,
    end: canvasWidth,
    sourceElementId: elementId,
    color: colors.center,
  });

  return guides;
}

/**
 * Generate spacing guides between elements
 */
export function generateSpacingGuides(
  sourceId: string,
  sourceRect: Rect,
  targetId: string,
  targetRect: Rect,
  colors: GuideColors
): Guide[] {
  const guides: Guide[] = [];
  const sourceEdges = getElementEdges(sourceRect);
  const targetEdges = getElementEdges(targetRect);

  // Horizontal spacing (source to the left of target)
  if (sourceEdges.right < targetEdges.left) {
    const distance = targetEdges.left - sourceEdges.right;
    guides.push({
      id: generateGuideId(),
      type: 'spacing',
      orientation: 'horizontal',
      position: (sourceEdges.bottom + sourceEdges.top) / 2,
      start: sourceEdges.right,
      end: targetEdges.left,
      sourceElementId: sourceId,
      targetElementId: targetId,
      distance,
      color: colors.spacing,
    });
  }

  // Horizontal spacing (source to the right of target)
  if (sourceEdges.left > targetEdges.right) {
    const distance = sourceEdges.left - targetEdges.right;
    guides.push({
      id: generateGuideId(),
      type: 'spacing',
      orientation: 'horizontal',
      position: (sourceEdges.bottom + sourceEdges.top) / 2,
      start: targetEdges.right,
      end: sourceEdges.left,
      sourceElementId: sourceId,
      targetElementId: targetId,
      distance,
      color: colors.spacing,
    });
  }

  // Vertical spacing (source above target)
  if (sourceEdges.bottom < targetEdges.top) {
    const distance = targetEdges.top - sourceEdges.bottom;
    guides.push({
      id: generateGuideId(),
      type: 'spacing',
      orientation: 'vertical',
      position: (sourceEdges.left + sourceEdges.right) / 2,
      start: sourceEdges.bottom,
      end: targetEdges.top,
      sourceElementId: sourceId,
      targetElementId: targetId,
      distance,
      color: colors.spacing,
    });
  }

  // Vertical spacing (source below target)
  if (sourceEdges.top > targetEdges.bottom) {
    const distance = sourceEdges.top - targetEdges.bottom;
    guides.push({
      id: generateGuideId(),
      type: 'spacing',
      orientation: 'vertical',
      position: (sourceEdges.left + sourceEdges.right) / 2,
      start: targetEdges.bottom,
      end: sourceEdges.top,
      sourceElementId: sourceId,
      targetElementId: targetId,
      distance,
      color: colors.spacing,
    });
  }

  return guides;
}

// ============================================================================
// SNAPPING
// ============================================================================

/**
 * Calculate snap positions for a moving element
 */
export function calculateSnap(
  movingRect: Rect,
  staticElements: Array<{ id: string; rect: Rect }>,
  config: SmartGuidesConfig,
  canvasRect: Rect
): SnapResult {
  const result: SnapResult = {
    snapped: false,
    snapX: null,
    snapY: null,
    guides: [],
    distances: [],
  };

  if (!config.enabled) {
    return result;
  }

  const movingEdges = getElementEdges(movingRect);
  const threshold = config.snapThreshold;

  // Check custom guides first
  for (const customGuide of config.customGuides) {
    if (customGuide.orientation === 'vertical') {
      // Check left edge snap
      let snap = getSnapValue(movingEdges.left, customGuide.position, threshold);
      if (snap !== null && result.snapX === null) {
        result.snapX = snap;
        result.snapped = true;
        result.guides.push({
          id: generateGuideId(),
          type: 'custom',
          orientation: 'vertical',
          position: customGuide.position,
          start: 0,
          end: canvasRect.height,
          color: config.colors.snapping,
          isSnapping: true,
        });
      }

      // Check right edge snap
      snap = getSnapValue(movingEdges.right, customGuide.position, threshold);
      if (snap !== null && result.snapX === null) {
        result.snapX = snap - movingRect.width;
        result.snapped = true;
        result.guides.push({
          id: generateGuideId(),
          type: 'custom',
          orientation: 'vertical',
          position: customGuide.position,
          start: 0,
          end: canvasRect.height,
          color: config.colors.snapping,
          isSnapping: true,
        });
      }

      // Check center snap
      snap = getSnapValue(movingEdges.centerX, customGuide.position, threshold);
      if (snap !== null && result.snapX === null) {
        result.snapX = snap - movingRect.width / 2;
        result.snapped = true;
        result.guides.push({
          id: generateGuideId(),
          type: 'custom',
          orientation: 'vertical',
          position: customGuide.position,
          start: 0,
          end: canvasRect.height,
          color: config.colors.snapping,
          isSnapping: true,
        });
      }
    } else {
      // Check top edge snap
      let snap = getSnapValue(movingEdges.top, customGuide.position, threshold);
      if (snap !== null && result.snapY === null) {
        result.snapY = snap;
        result.snapped = true;
        result.guides.push({
          id: generateGuideId(),
          type: 'custom',
          orientation: 'horizontal',
          position: customGuide.position,
          start: 0,
          end: canvasRect.width,
          color: config.colors.snapping,
          isSnapping: true,
        });
      }

      // Check bottom edge snap
      snap = getSnapValue(movingEdges.bottom, customGuide.position, threshold);
      if (snap !== null && result.snapY === null) {
        result.snapY = snap - movingRect.height;
        result.snapped = true;
        result.guides.push({
          id: generateGuideId(),
          type: 'custom',
          orientation: 'horizontal',
          position: customGuide.position,
          start: 0,
          end: canvasRect.width,
          color: config.colors.snapping,
          isSnapping: true,
        });
      }

      // Check center snap
      snap = getSnapValue(movingEdges.centerY, customGuide.position, threshold);
      if (snap !== null && result.snapY === null) {
        result.snapY = snap - movingRect.height / 2;
        result.snapped = true;
        result.guides.push({
          id: generateGuideId(),
          type: 'custom',
          orientation: 'horizontal',
          position: customGuide.position,
          start: 0,
          end: canvasRect.width,
          color: config.colors.snapping,
          isSnapping: true,
        });
      }
    }
  }

  // Check canvas center guides
  if (config.showCenterGuides) {
    const canvasCenterX = canvasRect.x + canvasRect.width / 2;
    const canvasCenterY = canvasRect.y + canvasRect.height / 2;

    // Canvas center X
    let snap = getSnapValue(movingEdges.centerX, canvasCenterX, threshold);
    if (snap !== null && result.snapX === null) {
      result.snapX = snap - movingRect.width / 2;
      result.snapped = true;
      result.guides.push({
        id: generateGuideId(),
        type: 'center-horizontal',
        orientation: 'vertical',
        position: canvasCenterX,
        start: 0,
        end: canvasRect.height,
        color: config.colors.snapping,
        isSnapping: true,
      });
    }

    // Canvas center Y
    snap = getSnapValue(movingEdges.centerY, canvasCenterY, threshold);
    if (snap !== null && result.snapY === null) {
      result.snapY = snap - movingRect.height / 2;
      result.snapped = true;
      result.guides.push({
        id: generateGuideId(),
        type: 'center-vertical',
        orientation: 'horizontal',
        position: canvasCenterY,
        start: 0,
        end: canvasRect.width,
        color: config.colors.snapping,
        isSnapping: true,
      });
    }
  }

  // Check against static elements
  for (const staticElement of staticElements) {
    const staticEdges = getElementEdges(staticElement.rect);

    if (config.showEdgeGuides) {
      // Edge alignment
      const edgeChecks: Array<{
        moving: number;
        static: number;
        type: GuideType;
        orientation: GuideOrientation;
        isLeft: boolean;
        isTop: boolean;
      }> = [
        { moving: movingEdges.left, static: staticEdges.left, type: 'edge-left', orientation: 'vertical', isLeft: true, isTop: false },
        { moving: movingEdges.left, static: staticEdges.right, type: 'edge-right', orientation: 'vertical', isLeft: true, isTop: false },
        { moving: movingEdges.right, static: staticEdges.left, type: 'edge-left', orientation: 'vertical', isLeft: false, isTop: false },
        { moving: movingEdges.right, static: staticEdges.right, type: 'edge-right', orientation: 'vertical', isLeft: false, isTop: false },
        { moving: movingEdges.top, static: staticEdges.top, type: 'edge-top', orientation: 'horizontal', isLeft: false, isTop: true },
        { moving: movingEdges.top, static: staticEdges.bottom, type: 'edge-bottom', orientation: 'horizontal', isLeft: false, isTop: true },
        { moving: movingEdges.bottom, static: staticEdges.top, type: 'edge-top', orientation: 'horizontal', isLeft: false, isTop: false },
        { moving: movingEdges.bottom, static: staticEdges.bottom, type: 'edge-bottom', orientation: 'horizontal', isLeft: false, isTop: false },
      ];

      for (const check of edgeChecks) {
        const snap = getSnapValue(check.moving, check.static, threshold);
        if (snap !== null) {
          if (check.orientation === 'vertical' && result.snapX === null) {
            result.snapX = check.isLeft ? snap : snap - movingRect.width;
            result.snapped = true;
            result.guides.push({
              id: generateGuideId(),
              type: check.type,
              orientation: 'vertical',
              position: snap,
              start: Math.min(movingEdges.top, staticEdges.top),
              end: Math.max(movingEdges.bottom, staticEdges.bottom),
              sourceElementId: staticElement.id,
              color: config.colors.snapping,
              isSnapping: true,
            });
          } else if (check.orientation === 'horizontal' && result.snapY === null) {
            result.snapY = check.isTop ? snap : snap - movingRect.height;
            result.snapped = true;
            result.guides.push({
              id: generateGuideId(),
              type: check.type,
              orientation: 'horizontal',
              position: snap,
              start: Math.min(movingEdges.left, staticEdges.left),
              end: Math.max(movingEdges.right, staticEdges.right),
              sourceElementId: staticElement.id,
              color: config.colors.snapping,
              isSnapping: true,
            });
          }
        }
      }
    }

    if (config.showCenterGuides) {
      // Center alignment with other elements
      let snap = getSnapValue(movingEdges.centerX, staticEdges.centerX, threshold);
      if (snap !== null && result.snapX === null) {
        result.snapX = snap - movingRect.width / 2;
        result.snapped = true;
        result.guides.push({
          id: generateGuideId(),
          type: 'center-horizontal',
          orientation: 'vertical',
          position: staticEdges.centerX,
          start: Math.min(movingEdges.top, staticEdges.top),
          end: Math.max(movingEdges.bottom, staticEdges.bottom),
          sourceElementId: staticElement.id,
          color: config.colors.snapping,
          isSnapping: true,
        });
      }

      snap = getSnapValue(movingEdges.centerY, staticEdges.centerY, threshold);
      if (snap !== null && result.snapY === null) {
        result.snapY = snap - movingRect.height / 2;
        result.snapped = true;
        result.guides.push({
          id: generateGuideId(),
          type: 'center-vertical',
          orientation: 'horizontal',
          position: staticEdges.centerY,
          start: Math.min(movingEdges.left, staticEdges.left),
          end: Math.max(movingEdges.right, staticEdges.right),
          sourceElementId: staticElement.id,
          color: config.colors.snapping,
          isSnapping: true,
        });
      }
    }

    // Generate distance indicators
    if (config.showDistanceIndicators) {
      const distanceIndicators = generateDistanceIndicators(
        movingRect,
        staticElement.rect
      );
      result.distances.push(...distanceIndicators);
    }
  }

  return result;
}

// ============================================================================
// DISTANCE INDICATORS
// ============================================================================

/**
 * Generate distance indicators between two rectangles
 */
export function generateDistanceIndicators(
  rectA: Rect,
  rectB: Rect
): DistanceIndicator[] {
  const indicators: DistanceIndicator[] = [];
  const edgesA = getElementEdges(rectA);
  const edgesB = getElementEdges(rectB);

  // Horizontal distance
  if (edgesA.right < edgesB.left) {
    // A is to the left of B
    const distance = edgesB.left - edgesA.right;
    const midY = (Math.max(edgesA.top, edgesB.top) + Math.min(edgesA.bottom, edgesB.bottom)) / 2;
    indicators.push({
      id: generateGuideId(),
      from: { x: edgesA.right, y: midY },
      to: { x: edgesB.left, y: midY },
      distance,
      orientation: 'horizontal',
      label: `${Math.round(distance)}px`,
    });
  } else if (edgesB.right < edgesA.left) {
    // B is to the left of A
    const distance = edgesA.left - edgesB.right;
    const midY = (Math.max(edgesA.top, edgesB.top) + Math.min(edgesA.bottom, edgesB.bottom)) / 2;
    indicators.push({
      id: generateGuideId(),
      from: { x: edgesB.right, y: midY },
      to: { x: edgesA.left, y: midY },
      distance,
      orientation: 'horizontal',
      label: `${Math.round(distance)}px`,
    });
  }

  // Vertical distance
  if (edgesA.bottom < edgesB.top) {
    // A is above B
    const distance = edgesB.top - edgesA.bottom;
    const midX = (Math.max(edgesA.left, edgesB.left) + Math.min(edgesA.right, edgesB.right)) / 2;
    indicators.push({
      id: generateGuideId(),
      from: { x: midX, y: edgesA.bottom },
      to: { x: midX, y: edgesB.top },
      distance,
      orientation: 'vertical',
      label: `${Math.round(distance)}px`,
    });
  } else if (edgesB.bottom < edgesA.top) {
    // B is above A
    const distance = edgesA.top - edgesB.bottom;
    const midX = (Math.max(edgesA.left, edgesB.left) + Math.min(edgesA.right, edgesB.right)) / 2;
    indicators.push({
      id: generateGuideId(),
      from: { x: midX, y: edgesB.bottom },
      to: { x: midX, y: edgesA.top },
      distance,
      orientation: 'vertical',
      label: `${Math.round(distance)}px`,
    });
  }

  return indicators;
}

// ============================================================================
// CUSTOM GUIDES MANAGEMENT
// ============================================================================

/**
 * Create a custom guide
 */
export function createCustomGuide(
  orientation: GuideOrientation,
  position: number,
  color: string = DEFAULT_GUIDE_COLORS.custom,
  name?: string
): CustomGuide {
  return {
    id: generateGuideId(),
    orientation,
    position,
    color,
    locked: false,
    name,
  };
}

/**
 * Add a custom guide to config
 */
export function addCustomGuide(
  config: SmartGuidesConfig,
  guide: CustomGuide
): SmartGuidesConfig {
  return {
    ...config,
    customGuides: [...config.customGuides, guide],
  };
}

/**
 * Remove a custom guide from config
 */
export function removeCustomGuide(
  config: SmartGuidesConfig,
  guideId: string
): SmartGuidesConfig {
  return {
    ...config,
    customGuides: config.customGuides.filter(g => g.id !== guideId),
  };
}

/**
 * Update a custom guide
 */
export function updateCustomGuide(
  config: SmartGuidesConfig,
  guideId: string,
  updates: Partial<CustomGuide>
): SmartGuidesConfig {
  return {
    ...config,
    customGuides: config.customGuides.map(g =>
      g.id === guideId ? { ...g, ...updates } : g
    ),
  };
}

/**
 * Toggle custom guide lock
 */
export function toggleGuideLock(
  config: SmartGuidesConfig,
  guideId: string
): SmartGuidesConfig {
  return {
    ...config,
    customGuides: config.customGuides.map(g =>
      g.id === guideId ? { ...g, locked: !g.locked } : g
    ),
  };
}

/**
 * Clear all custom guides
 */
export function clearCustomGuides(
  config: SmartGuidesConfig
): SmartGuidesConfig {
  return {
    ...config,
    customGuides: [],
  };
}

// ============================================================================
// GUIDE VISIBILITY
// ============================================================================

/**
 * Get visible guides for hover state
 */
export function getHoverGuides(
  hoveredRect: Rect,
  otherElements: Array<{ id: string; rect: Rect }>,
  config: SmartGuidesConfig,
  canvasRect: Rect
): Guide[] {
  const guides: Guide[] = [];

  if (!config.enabled) {
    return guides;
  }

  // Edge guides from hovered element
  if (config.showEdgeGuides) {
    guides.push(
      ...generateEdgeGuides(
        'hovered',
        hoveredRect,
        canvasRect.height,
        canvasRect.width,
        config.colors
      )
    );
  }

  // Center guides from hovered element
  if (config.showCenterGuides) {
    guides.push(
      ...generateCenterGuides(
        'hovered',
        hoveredRect,
        canvasRect.height,
        canvasRect.width,
        config.colors
      )
    );
  }

  // Spacing guides to other elements
  if (config.showSpacingGuides) {
    for (const element of otherElements) {
      guides.push(
        ...generateSpacingGuides(
          'hovered',
          hoveredRect,
          element.id,
          element.rect,
          config.colors
        )
      );
    }
  }

  return guides;
}

/**
 * Filter guides to show only relevant ones (avoid clutter)
 */
export function filterRelevantGuides(
  guides: Guide[],
  maxGuides: number = 10
): Guide[] {
  // Prioritize snapping guides, then sort by type
  const priorityOrder: Record<GuideType, number> = {
    'center-horizontal': 1,
    'center-vertical': 1,
    'edge-left': 2,
    'edge-right': 2,
    'edge-top': 2,
    'edge-bottom': 2,
    'spacing': 3,
    'custom': 0,
  };

  return guides
    .sort((a, b) => {
      // Snapping guides first
      if (a.isSnapping && !b.isSnapping) return -1;
      if (!a.isSnapping && b.isSnapping) return 1;
      // Then by priority
      return priorityOrder[a.type] - priorityOrder[b.type];
    })
    .slice(0, maxGuides);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const smartGuides = {
  // Constants
  DEFAULT_SNAP_THRESHOLD,
  DEFAULT_GUIDE_COLORS,
  DEFAULT_CONFIG,

  // Utilities
  getElementEdges,
  isWithinThreshold,
  getSnapValue,

  // Guide generation
  generateEdgeGuides,
  generateCenterGuides,
  generateSpacingGuides,

  // Snapping
  calculateSnap,

  // Distance indicators
  generateDistanceIndicators,

  // Custom guides
  createCustomGuide,
  addCustomGuide,
  removeCustomGuide,
  updateCustomGuide,
  toggleGuideLock,
  clearCustomGuides,

  // Visibility
  getHoverGuides,
  filterRelevantGuides,
};

export default smartGuides;
