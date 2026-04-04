/**
 * Shape Generator - SVG shape generation for the Tailwind Builder
 *
 * Features:
 * - Blob generator with randomness control
 * - Wave generator (top, bottom, both)
 * - Geometric patterns
 * - Divider shapes
 * - Corner decorations
 * - Background decorations
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface BlobConfig {
  complexity: number; // 3-20, number of points
  randomness: number; // 0-1, how organic the shape is
  size: number; // Size in pixels
  seed?: number; // Optional seed for reproducibility
  color?: string;
  gradient?: GradientConfig;
}

export interface WaveConfig {
  width: number;
  height: number;
  waves: number; // Number of wave peaks
  amplitude: number; // Wave height (0-1 of total height)
  position: 'top' | 'bottom' | 'both';
  smooth: boolean;
  color?: string;
  gradient?: GradientConfig;
}

export interface DividerConfig {
  width: number;
  height: number;
  type: DividerType;
  color?: string;
  gradient?: GradientConfig;
  flip?: boolean;
}

export type DividerType =
  | 'wave'
  | 'wave-smooth'
  | 'curve'
  | 'triangle'
  | 'triangle-asymmetric'
  | 'slant'
  | 'slant-reverse'
  | 'zigzag'
  | 'arrow'
  | 'cloud'
  | 'drops'
  | 'mountains'
  | 'tilt';

export interface CornerConfig {
  size: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  type: CornerType;
  color?: string;
}

export type CornerType =
  | 'curve'
  | 'wave'
  | 'triangle'
  | 'circle'
  | 'organic'
  | 'leaf';

export interface GeometricPatternConfig {
  width: number;
  height: number;
  type: PatternType;
  spacing: number;
  size: number;
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
}

export type PatternType =
  | 'dots'
  | 'grid'
  | 'diagonal-lines'
  | 'horizontal-lines'
  | 'vertical-lines'
  | 'circles'
  | 'triangles'
  | 'hexagons'
  | 'squares'
  | 'diamonds'
  | 'crosses'
  | 'plus'
  | 'zigzag'
  | 'waves'
  | 'checkerboard';

export interface GradientConfig {
  type: 'linear' | 'radial';
  angle?: number; // For linear gradients
  stops: Array<{
    offset: number; // 0-100
    color: string;
  }>;
}

export interface DecorationConfig {
  type: DecorationType;
  width: number;
  height: number;
  color?: string;
  gradient?: GradientConfig;
  options?: Record<string, number | string | boolean>;
}

export type DecorationType =
  | 'blob-top-left'
  | 'blob-top-right'
  | 'blob-bottom-left'
  | 'blob-bottom-right'
  | 'circle-cluster'
  | 'dots-pattern'
  | 'geometric-abstract'
  | 'flowing-lines'
  | 'noise-texture';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Seeded random number generator for reproducibility
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

/**
 * Creates a new seeded random generator
 */
function createRandom(seed?: number): SeededRandom {
  return new SeededRandom(seed ?? Math.random() * 10000);
}

/**
 * Interpolates between two points
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Creates a smooth cubic bezier point
 */
function bezierPoint(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const cx = 3 * (p1.x - p0.x);
  const bx = 3 * (p2.x - p1.x) - cx;
  const ax = p3.x - p0.x - cx - bx;

  const cy = 3 * (p1.y - p0.y);
  const by = 3 * (p2.y - p1.y) - cy;
  const ay = p3.y - p0.y - cy - by;

  const tSquared = t * t;
  const tCubed = tSquared * t;

  return {
    x: ax * tCubed + bx * tSquared + cx * t + p0.x,
    y: ay * tCubed + by * tSquared + cy * t + p0.y,
  };
}

/**
 * Generates a gradient definition
 */
function generateGradientDef(id: string, config: GradientConfig): string {
  const stops = config.stops
    .map((stop) => `<stop offset="${stop.offset}%" stop-color="${stop.color}" />`)
    .join('\n    ');

  if (config.type === 'radial') {
    return `<radialGradient id="${id}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
    ${stops}
  </radialGradient>`;
  }

  const angle = config.angle ?? 0;
  const angleRad = (angle * Math.PI) / 180;
  const x1 = 50 - Math.cos(angleRad) * 50;
  const y1 = 50 - Math.sin(angleRad) * 50;
  const x2 = 50 + Math.cos(angleRad) * 50;
  const y2 = 50 + Math.sin(angleRad) * 50;

  return `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
    ${stops}
  </linearGradient>`;
}

/**
 * Generates unique ID for SVG elements
 */
function generateUniqueId(): string {
  return `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// BLOB GENERATOR
// ============================================================================

/**
 * Generates an organic blob shape
 */
export function generateBlob(config: BlobConfig): string {
  const {
    complexity,
    randomness,
    size,
    seed,
    color = 'currentColor',
    gradient,
  } = config;

  const random = createRandom(seed);
  const points: Array<{ x: number; y: number; angle: number }> = [];
  const numPoints = Math.max(3, Math.min(20, complexity));
  const center = size / 2;
  const baseRadius = size * 0.35;

  // Generate points around the center
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const radiusVariation = 1 + (random.next() - 0.5) * randomness;
    const radius = baseRadius * radiusVariation;

    points.push({
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      angle,
    });
  }

  // Create smooth path
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length; i++) {
    const p0 = points[i];
    const p1 = points[(i + 1) % points.length];

    // Control point distance based on randomness
    const tension = 0.3 + randomness * 0.2;
    const dist = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));

    // Calculate control points
    const angle0 = p0.angle + Math.PI / 2;
    const angle1 = p1.angle - Math.PI / 2;

    const cp1x = p0.x + Math.cos(angle0) * dist * tension;
    const cp1y = p0.y + Math.sin(angle0) * dist * tension;
    const cp2x = p1.x + Math.cos(angle1) * dist * tension;
    const cp2y = p1.y + Math.sin(angle1) * dist * tension;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }

  path += ' Z';

  const gradientId = gradient ? generateUniqueId() : null;
  const fill = gradientId ? `url(#${gradientId})` : color;

  let defs = '';
  if (gradient && gradientId) {
    defs = `<defs>${generateGradientDef(gradientId, gradient)}</defs>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  ${defs}
  <path d="${path}" fill="${fill}" />
</svg>`;
}

/**
 * Generates multiple blob configurations for variety
 */
export function generateBlobVariants(baseConfig: Partial<BlobConfig>, count: number = 6): BlobConfig[] {
  const variants: BlobConfig[] = [];
  const baseComplexity = baseConfig.complexity ?? 8;
  const baseRandomness = baseConfig.randomness ?? 0.5;

  for (let i = 0; i < count; i++) {
    variants.push({
      complexity: baseComplexity + (i % 3) - 1,
      randomness: baseRandomness + (i * 0.1) - 0.2,
      size: baseConfig.size ?? 200,
      seed: i * 1000 + Date.now(),
      color: baseConfig.color,
      gradient: baseConfig.gradient,
    });
  }

  return variants;
}

// ============================================================================
// WAVE GENERATOR
// ============================================================================

/**
 * Generates a wave divider shape
 */
export function generateWave(config: WaveConfig): string {
  const {
    width,
    height,
    waves,
    amplitude,
    position,
    smooth,
    color = 'currentColor',
    gradient,
  } = config;

  const waveHeight = height * amplitude;
  const segmentWidth = width / waves;
  const points: Array<{ x: number; y: number }> = [];

  // Generate wave points
  for (let i = 0; i <= waves; i++) {
    const x = i * segmentWidth;
    const isTop = position === 'top' || (position === 'both' && i % 2 === 0);

    if (smooth) {
      // Smooth sine wave
      const y = isTop
        ? waveHeight * (1 - Math.sin((i / waves) * Math.PI * waves))
        : waveHeight * Math.sin((i / waves) * Math.PI * waves);
      points.push({ x, y: position === 'bottom' ? height - y : y });
    } else {
      // Sharp wave peaks
      const y = i % 2 === 0 ? 0 : waveHeight;
      points.push({ x, y: position === 'bottom' ? height - y : y });
    }
  }

  let path = '';

  if (position === 'top' || position === 'both') {
    path = `M 0 ${height} `;

    if (smooth) {
      // Use bezier curves for smooth waves
      path += `L 0 ${points[0].y} `;
      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const cpX = (current.x + next.x) / 2;
        path += `Q ${current.x + segmentWidth / 2} ${current.y}, ${cpX} ${(current.y + next.y) / 2} `;
      }
      path += `L ${width} ${points[points.length - 1].y} L ${width} ${height} Z`;
    } else {
      // Sharp zigzag
      path += `L 0 ${points[0].y} `;
      for (const point of points) {
        path += `L ${point.x} ${point.y} `;
      }
      path += `L ${width} ${height} Z`;
    }
  } else {
    // Bottom position
    path = `M 0 0 `;

    if (smooth) {
      path += `L 0 ${points[0].y} `;
      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const cpX = (current.x + next.x) / 2;
        path += `Q ${current.x + segmentWidth / 2} ${current.y}, ${cpX} ${(current.y + next.y) / 2} `;
      }
      path += `L ${width} ${points[points.length - 1].y} L ${width} 0 Z`;
    } else {
      path += `L 0 ${points[0].y} `;
      for (const point of points) {
        path += `L ${point.x} ${point.y} `;
      }
      path += `L ${width} 0 Z`;
    }
  }

  const gradientId = gradient ? generateUniqueId() : null;
  const fill = gradientId ? `url(#${gradientId})` : color;

  let defs = '';
  if (gradient && gradientId) {
    defs = `<defs>${generateGradientDef(gradientId, gradient)}</defs>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" width="100%" height="${height}">
  ${defs}
  <path d="${path}" fill="${fill}" />
</svg>`;
}

// ============================================================================
// DIVIDER GENERATOR
// ============================================================================

/**
 * Pre-defined divider paths
 */
const dividerPaths: Record<DividerType, (width: number, height: number, flip: boolean) => string> = {
  wave: (w, h, flip) => {
    const y1 = flip ? 0 : h;
    const y2 = flip ? h : 0;
    return `M0,${y1} C${w * 0.25},${y2} ${w * 0.75},${y1} ${w},${y2} L${w},${flip ? 0 : h} L0,${flip ? 0 : h} Z`;
  },
  'wave-smooth': (w, h, flip) => {
    const y1 = flip ? 0 : h;
    const y2 = flip ? h : 0;
    const mid = h / 2;
    return `M0,${y1} Q${w * 0.25},${y2} ${w * 0.5},${mid} Q${w * 0.75},${y1} ${w},${y2} L${w},${flip ? 0 : h} L0,${flip ? 0 : h} Z`;
  },
  curve: (w, h, flip) => {
    const y = flip ? 0 : h;
    return `M0,${y} Q${w / 2},${flip ? h : 0} ${w},${y} L${w},${flip ? 0 : h} L0,${flip ? 0 : h} Z`;
  },
  triangle: (w, h, flip) => {
    if (flip) {
      return `M0,0 L${w / 2},${h} L${w},0 L${w},0 L0,0 Z`;
    }
    return `M0,${h} L${w / 2},0 L${w},${h} Z`;
  },
  'triangle-asymmetric': (w, h, flip) => {
    if (flip) {
      return `M0,0 L${w * 0.7},${h} L${w},0 Z`;
    }
    return `M0,${h} L${w * 0.3},0 L${w},${h} Z`;
  },
  slant: (w, h, flip) => {
    if (flip) {
      return `M0,${h} L${w},0 L${w},${h} Z`;
    }
    return `M0,0 L${w},${h} L0,${h} Z`;
  },
  'slant-reverse': (w, h, flip) => {
    if (flip) {
      return `M0,0 L${w},${h} L${w},0 Z`;
    }
    return `M0,${h} L${w},0 L0,0 Z`;
  },
  zigzag: (w, h, flip) => {
    const peaks = 5;
    const segmentWidth = w / peaks;
    let path = flip ? `M0,0 ` : `M0,${h} `;

    for (let i = 0; i <= peaks; i++) {
      const x = i * segmentWidth;
      const y = flip
        ? i % 2 === 0 ? 0 : h
        : i % 2 === 0 ? h : 0;
      path += `L${x},${y} `;
    }

    path += flip ? `L${w},0 L0,0 Z` : `L${w},${h} L0,${h} Z`;
    return path;
  },
  arrow: (w, h, flip) => {
    const arrowWidth = w * 0.15;
    if (flip) {
      return `M0,0 L${w / 2 - arrowWidth},${h * 0.6} L${w / 2},${h} L${w / 2 + arrowWidth},${h * 0.6} L${w},0 Z`;
    }
    return `M0,${h} L${w / 2 - arrowWidth},${h * 0.4} L${w / 2},0 L${w / 2 + arrowWidth},${h * 0.4} L${w},${h} Z`;
  },
  cloud: (w, h, flip) => {
    const y = flip ? 0 : h;
    const cy = flip ? h * 0.7 : h * 0.3;
    return `M0,${y}
            Q${w * 0.1},${cy} ${w * 0.2},${y * 0.7}
            Q${w * 0.3},${cy * 0.5} ${w * 0.4},${y * 0.8}
            Q${w * 0.5},${cy * 0.3} ${w * 0.6},${y * 0.6}
            Q${w * 0.7},${cy * 0.5} ${w * 0.8},${y * 0.75}
            Q${w * 0.9},${cy} ${w},${y}
            L${w},${flip ? 0 : h} L0,${flip ? 0 : h} Z`;
  },
  drops: (w, h, flip) => {
    const baseY = flip ? 0 : h;
    const tipY = flip ? h : 0;
    const drops = 4;
    const dropWidth = w / drops;
    let path = `M0,${baseY} `;

    for (let i = 0; i < drops; i++) {
      const startX = i * dropWidth;
      const midX = startX + dropWidth / 2;
      const endX = startX + dropWidth;
      path += `Q${midX},${tipY} ${endX},${baseY} `;
    }

    path += `L${w},${flip ? 0 : h} L0,${flip ? 0 : h} Z`;
    return path;
  },
  mountains: (w, h, flip) => {
    const baseY = flip ? 0 : h;
    const peaks = [
      { x: w * 0.2, y: flip ? h * 0.6 : h * 0.4 },
      { x: w * 0.5, y: flip ? h : 0 },
      { x: w * 0.8, y: flip ? h * 0.7 : h * 0.3 },
    ];

    let path = `M0,${baseY} `;
    for (const peak of peaks) {
      path += `L${peak.x},${peak.y} `;
    }
    path += `L${w},${baseY} L${w},${flip ? 0 : h} L0,${flip ? 0 : h} Z`;
    return path;
  },
  tilt: (w, h, flip) => {
    const angle = h * 0.3;
    if (flip) {
      return `M0,${angle} L${w},0 L${w},${h} L0,${h} Z`;
    }
    return `M0,0 L${w},${angle} L${w},${h} L0,${h} Z`;
  },
};

/**
 * Generates a section divider shape
 */
export function generateDivider(config: DividerConfig): string {
  const {
    width,
    height,
    type,
    color = 'currentColor',
    gradient,
    flip = false,
  } = config;

  const pathGenerator = dividerPaths[type];
  if (!pathGenerator) {
    return '';
  }

  const path = pathGenerator(width, height, flip);
  const gradientId = gradient ? generateUniqueId() : null;
  const fill = gradientId ? `url(#${gradientId})` : color;

  let defs = '';
  if (gradient && gradientId) {
    defs = `<defs>${generateGradientDef(gradientId, gradient)}</defs>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" width="100%" height="${height}">
  ${defs}
  <path d="${path}" fill="${fill}" />
</svg>`;
}

/**
 * Gets all available divider types
 */
export function getDividerTypes(): DividerType[] {
  return Object.keys(dividerPaths) as DividerType[];
}

// ============================================================================
// CORNER DECORATION GENERATOR
// ============================================================================

/**
 * Generates a corner decoration
 */
export function generateCorner(config: CornerConfig): string {
  const { size, position, type, color = 'currentColor' } = config;

  let path = '';
  let transform = '';

  // Generate base path (always for top-left, then transform)
  switch (type) {
    case 'curve':
      path = `M0,0 L${size},0 Q0,0 0,${size} Z`;
      break;
    case 'wave':
      path = `M0,0 L${size},0 Q${size * 0.5},${size * 0.3} 0,${size} Z`;
      break;
    case 'triangle':
      path = `M0,0 L${size},0 L0,${size} Z`;
      break;
    case 'circle':
      path = `M0,0 L${size},0 A${size},${size} 0 0,0 0,${size} Z`;
      break;
    case 'organic':
      path = `M0,0 L${size},0 C${size * 0.8},${size * 0.2} ${size * 0.2},${size * 0.8} 0,${size} Z`;
      break;
    case 'leaf':
      path = `M0,0 L${size},0 Q${size * 0.3},${size * 0.5} 0,${size} Z`;
      break;
  }

  // Apply transform based on position
  switch (position) {
    case 'top-right':
      transform = `scale(-1, 1) translate(-${size}, 0)`;
      break;
    case 'bottom-left':
      transform = `scale(1, -1) translate(0, -${size})`;
      break;
    case 'bottom-right':
      transform = `scale(-1, -1) translate(-${size}, -${size})`;
      break;
  }

  const transformAttr = transform ? ` transform="${transform}"` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <path d="${path}" fill="${color}"${transformAttr} />
</svg>`;
}

// ============================================================================
// GEOMETRIC PATTERN GENERATOR
// ============================================================================

/**
 * Generates a repeating geometric pattern
 */
export function generatePattern(config: GeometricPatternConfig): string {
  const {
    width,
    height,
    type,
    spacing,
    size: elementSize,
    color = 'currentColor',
    strokeWidth = 1,
    fill = false,
  } = config;

  const patternId = generateUniqueId();
  let patternContent = '';
  let patternWidth = spacing;
  let patternHeight = spacing;

  const stroke = fill ? 'none' : color;
  const fillColor = fill ? color : 'none';

  switch (type) {
    case 'dots':
      patternContent = `<circle cx="${spacing / 2}" cy="${spacing / 2}" r="${elementSize / 2}" fill="${color}" />`;
      break;

    case 'grid':
      patternContent = `
        <line x1="0" y1="0" x2="${spacing}" y2="0" stroke="${color}" stroke-width="${strokeWidth}" />
        <line x1="0" y1="0" x2="0" y2="${spacing}" stroke="${color}" stroke-width="${strokeWidth}" />
      `;
      break;

    case 'diagonal-lines':
      patternContent = `<line x1="0" y1="${spacing}" x2="${spacing}" y2="0" stroke="${color}" stroke-width="${strokeWidth}" />`;
      break;

    case 'horizontal-lines':
      patternContent = `<line x1="0" y1="${spacing / 2}" x2="${spacing}" y2="${spacing / 2}" stroke="${color}" stroke-width="${strokeWidth}" />`;
      break;

    case 'vertical-lines':
      patternContent = `<line x1="${spacing / 2}" y1="0" x2="${spacing / 2}" y2="${spacing}" stroke="${color}" stroke-width="${strokeWidth}" />`;
      break;

    case 'circles':
      patternContent = `<circle cx="${spacing / 2}" cy="${spacing / 2}" r="${elementSize / 2}" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
      break;

    case 'triangles':
      const triH = elementSize * 0.866;
      patternContent = `<polygon points="${spacing / 2},${(spacing - triH) / 2} ${(spacing - elementSize) / 2},${(spacing + triH) / 2} ${(spacing + elementSize) / 2},${(spacing + triH) / 2}" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
      break;

    case 'hexagons':
      patternWidth = elementSize * 1.5;
      patternHeight = elementSize * 1.732;
      const hex = generateHexagonPath(elementSize, patternWidth / 2, patternHeight / 2);
      patternContent = `<path d="${hex}" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
      break;

    case 'squares':
      const offset = (spacing - elementSize) / 2;
      patternContent = `<rect x="${offset}" y="${offset}" width="${elementSize}" height="${elementSize}" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
      break;

    case 'diamonds':
      const dOffset = spacing / 2;
      const dSize = elementSize / 2;
      patternContent = `<polygon points="${dOffset},${dOffset - dSize} ${dOffset + dSize},${dOffset} ${dOffset},${dOffset + dSize} ${dOffset - dSize},${dOffset}" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
      break;

    case 'crosses':
      const cSize = elementSize / 3;
      const cCenter = spacing / 2;
      patternContent = `
        <rect x="${cCenter - cSize / 2}" y="${cCenter - elementSize / 2}" width="${cSize}" height="${elementSize}" fill="${color}" />
        <rect x="${cCenter - elementSize / 2}" y="${cCenter - cSize / 2}" width="${elementSize}" height="${cSize}" fill="${color}" />
      `;
      break;

    case 'plus':
      const pSize = elementSize / 4;
      const pCenter = spacing / 2;
      patternContent = `
        <line x1="${pCenter}" y1="${pCenter - elementSize / 2}" x2="${pCenter}" y2="${pCenter + elementSize / 2}" stroke="${color}" stroke-width="${pSize}" />
        <line x1="${pCenter - elementSize / 2}" y1="${pCenter}" x2="${pCenter + elementSize / 2}" y2="${pCenter}" stroke="${color}" stroke-width="${pSize}" />
      `;
      break;

    case 'zigzag':
      patternContent = `<polyline points="0,${spacing} ${spacing / 4},0 ${spacing / 2},${spacing} ${spacing * 3 / 4},0 ${spacing},${spacing}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />`;
      break;

    case 'waves':
      patternContent = `<path d="M0,${spacing / 2} Q${spacing / 4},0 ${spacing / 2},${spacing / 2} Q${spacing * 3 / 4},${spacing} ${spacing},${spacing / 2}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />`;
      break;

    case 'checkerboard':
      patternWidth = spacing * 2;
      patternHeight = spacing * 2;
      patternContent = `
        <rect x="0" y="0" width="${spacing}" height="${spacing}" fill="${color}" />
        <rect x="${spacing}" y="${spacing}" width="${spacing}" height="${spacing}" fill="${color}" />
      `;
      break;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <pattern id="${patternId}" x="0" y="0" width="${patternWidth}" height="${patternHeight}" patternUnits="userSpaceOnUse">
      ${patternContent}
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#${patternId})" />
</svg>`;
}

/**
 * Generates a hexagon path
 */
function generateHexagonPath(size: number, cx: number, cy: number): string {
  const points: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 30) * (Math.PI / 180);
    points.push({
      x: cx + size / 2 * Math.cos(angle),
      y: cy + size / 2 * Math.sin(angle),
    });
  }

  return `M${points.map((p) => `${p.x},${p.y}`).join(' L')} Z`;
}

/**
 * Gets all available pattern types
 */
export function getPatternTypes(): PatternType[] {
  return [
    'dots',
    'grid',
    'diagonal-lines',
    'horizontal-lines',
    'vertical-lines',
    'circles',
    'triangles',
    'hexagons',
    'squares',
    'diamonds',
    'crosses',
    'plus',
    'zigzag',
    'waves',
    'checkerboard',
  ];
}

// ============================================================================
// BACKGROUND DECORATION GENERATOR
// ============================================================================

/**
 * Generates a background decoration
 */
export function generateDecoration(config: DecorationConfig): string {
  const { type, width, height, color = 'currentColor', gradient, options = {} } = config;

  switch (type) {
    case 'blob-top-left':
    case 'blob-top-right':
    case 'blob-bottom-left':
    case 'blob-bottom-right':
      return generateCornerBlob(type, width, height, color, gradient);

    case 'circle-cluster':
      return generateCircleCluster(width, height, color, options);

    case 'dots-pattern':
      return generateDotsDecoration(width, height, color, options);

    case 'geometric-abstract':
      return generateGeometricAbstract(width, height, color, gradient);

    case 'flowing-lines':
      return generateFlowingLines(width, height, color, options);

    case 'noise-texture':
      return generateNoiseTexture(width, height, color, options);

    default:
      return '';
  }
}

function generateCornerBlob(
  position: string,
  width: number,
  height: number,
  color: string,
  gradient?: GradientConfig
): string {
  const blobSize = Math.min(width, height) * 0.6;
  const blob = generateBlob({
    complexity: 6,
    randomness: 0.4,
    size: blobSize,
    color,
    gradient,
  });

  let transform = '';
  switch (position) {
    case 'blob-top-left':
      transform = `translate(-${blobSize * 0.3}, -${blobSize * 0.3})`;
      break;
    case 'blob-top-right':
      transform = `translate(${width - blobSize * 0.7}, -${blobSize * 0.3})`;
      break;
    case 'blob-bottom-left':
      transform = `translate(-${blobSize * 0.3}, ${height - blobSize * 0.7})`;
      break;
    case 'blob-bottom-right':
      transform = `translate(${width - blobSize * 0.7}, ${height - blobSize * 0.7})`;
      break;
  }

  // Extract path from blob SVG and wrap in positioned group
  const pathMatch = blob.match(/<path[^>]*\/>/);
  const defsMatch = blob.match(/<defs>[\s\S]*<\/defs>/);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${defsMatch ? defsMatch[0] : ''}
  <g transform="${transform}">
    ${pathMatch ? pathMatch[0] : ''}
  </g>
</svg>`;
}

function generateCircleCluster(
  width: number,
  height: number,
  color: string,
  options: Record<string, number | string | boolean>
): string {
  const count = (options.count as number) || 5;
  const random = createRandom((options.seed as number) || Date.now());
  const circles: string[] = [];

  for (let i = 0; i < count; i++) {
    const cx = random.range(0, width);
    const cy = random.range(0, height);
    const r = random.range(20, Math.min(width, height) * 0.2);
    const opacity = random.range(0.1, 0.4);

    circles.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}" />`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${circles.join('\n  ')}
</svg>`;
}

function generateDotsDecoration(
  width: number,
  height: number,
  color: string,
  options: Record<string, number | string | boolean>
): string {
  const spacing = (options.spacing as number) || 30;
  const dotSize = (options.dotSize as number) || 3;
  const dots: string[] = [];

  for (let x = spacing / 2; x < width; x += spacing) {
    for (let y = spacing / 2; y < height; y += spacing) {
      const opacity = 0.1 + Math.random() * 0.2;
      dots.push(`<circle cx="${x}" cy="${y}" r="${dotSize}" fill="${color}" opacity="${opacity}" />`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${dots.join('\n  ')}
</svg>`;
}

function generateGeometricAbstract(
  width: number,
  height: number,
  color: string,
  gradient?: GradientConfig
): string {
  const random = createRandom(Date.now());
  const shapes: string[] = [];

  // Generate random geometric shapes
  for (let i = 0; i < 8; i++) {
    const shapeType = Math.floor(random.next() * 3);
    const x = random.range(0, width);
    const y = random.range(0, height);
    const size = random.range(30, 100);
    const rotation = random.range(0, 360);
    const opacity = random.range(0.05, 0.15);

    let shape = '';
    switch (shapeType) {
      case 0: // Circle
        shape = `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="${color}" opacity="${opacity}" />`;
        break;
      case 1: // Square
        shape = `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" fill="${color}" opacity="${opacity}" transform="rotate(${rotation} ${x} ${y})" />`;
        break;
      case 2: // Triangle
        const h = size * 0.866;
        shape = `<polygon points="${x},${y - h / 2} ${x - size / 2},${y + h / 2} ${x + size / 2},${y + h / 2}" fill="${color}" opacity="${opacity}" transform="rotate(${rotation} ${x} ${y})" />`;
        break;
    }
    shapes.push(shape);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${shapes.join('\n  ')}
</svg>`;
}

function generateFlowingLines(
  width: number,
  height: number,
  color: string,
  options: Record<string, number | string | boolean>
): string {
  const lineCount = (options.lineCount as number) || 5;
  const lines: string[] = [];

  for (let i = 0; i < lineCount; i++) {
    const y = (height / (lineCount + 1)) * (i + 1);
    const amplitude = height * 0.1;
    const frequency = 2 + i * 0.5;

    let d = `M0,${y}`;
    for (let x = 0; x <= width; x += 10) {
      const newY = y + Math.sin((x / width) * Math.PI * frequency) * amplitude;
      d += ` L${x},${newY}`;
    }

    lines.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="1" opacity="${0.2 - i * 0.03}" />`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${lines.join('\n  ')}
</svg>`;
}

function generateNoiseTexture(
  width: number,
  height: number,
  color: string,
  options: Record<string, number | string | boolean>
): string {
  const filterId = generateUniqueId();
  const opacity = (options.opacity as number) || 0.1;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <filter id="${filterId}">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
  </defs>
  <rect width="100%" height="100%" filter="url(#${filterId})" opacity="${opacity}" />
</svg>`;
}

// ============================================================================
// PRESET SHAPES
// ============================================================================

/**
 * Pre-made shape presets for quick use
 */
export const shapePresets = {
  blobs: [
    { name: 'Soft Blob', complexity: 5, randomness: 0.3 },
    { name: 'Organic Blob', complexity: 7, randomness: 0.5 },
    { name: 'Wild Blob', complexity: 10, randomness: 0.7 },
    { name: 'Minimal Blob', complexity: 4, randomness: 0.2 },
    { name: 'Complex Blob', complexity: 12, randomness: 0.4 },
  ],

  waves: [
    { name: 'Gentle Wave', waves: 1, amplitude: 0.3, smooth: true },
    { name: 'Double Wave', waves: 2, amplitude: 0.4, smooth: true },
    { name: 'Triple Wave', waves: 3, amplitude: 0.3, smooth: true },
    { name: 'Choppy Wave', waves: 4, amplitude: 0.5, smooth: false },
    { name: 'Subtle Wave', waves: 1, amplitude: 0.15, smooth: true },
  ],

  dividers: getDividerTypes().map((type) => ({
    name: type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    type,
  })),

  patterns: getPatternTypes().map((type) => ({
    name: type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    type,
  })),
};

// Types are already exported at their definitions above
