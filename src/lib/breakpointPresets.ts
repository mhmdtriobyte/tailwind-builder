/**
 * Breakpoint Presets - Device-specific breakpoint configurations
 *
 * Provides comprehensive device presets for mobile phones, tablets, and
 * desktop screens with accurate dimensions, pixel densities, and
 * orientation support.
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

/**
 * Device category for organization
 */
export type DeviceCategory = 'mobile' | 'tablet' | 'desktop' | 'custom';

/**
 * Device orientation
 */
export type DeviceOrientation = 'portrait' | 'landscape';

/**
 * Complete device preset configuration
 */
export interface DevicePreset {
  id: string;
  name: string;
  category: DeviceCategory;
  brand: string;
  model: string;

  // Dimensions (CSS pixels)
  width: number;
  height: number;

  // Physical dimensions (mm) - optional
  physicalWidth?: number;
  physicalHeight?: number;

  // Display properties
  pixelDensity: number;        // Device pixel ratio (DPR)
  physicalPixelWidth?: number; // Physical pixels = CSS pixels * DPR
  physicalPixelHeight?: number;
  ppi?: number;                // Pixels per inch

  // Features
  hasNotch?: boolean;
  hasDynamicIsland?: boolean;
  hasHomeIndicator?: boolean;
  hasNavigationBar?: boolean;
  cornerRadius?: number;       // Corner radius in px

  // Safe areas (in CSS pixels)
  safeAreaTop?: number;
  safeAreaBottom?: number;
  safeAreaLeft?: number;
  safeAreaRight?: number;

  // Year released
  releaseYear?: number;

  // Default orientation
  defaultOrientation: DeviceOrientation;
}

/**
 * Orientation-specific dimensions
 */
export interface OrientedDimensions {
  width: number;
  height: number;
  safeAreaTop: number;
  safeAreaBottom: number;
  safeAreaLeft: number;
  safeAreaRight: number;
}

/**
 * Desktop breakpoint preset
 */
export interface DesktopPreset {
  id: string;
  name: string;
  category: 'desktop';
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  isRetina?: boolean;
}

/**
 * Custom breakpoint definition
 */
export interface CustomBreakpointPreset {
  id: string;
  name: string;
  minWidth: number;
  maxWidth?: number;
  description?: string;
  color?: string;
  icon?: string;
}

// ============================================================================
// MOBILE DEVICE PRESETS
// ============================================================================

/**
 * iPhone device presets
 */
export const IPHONE_PRESETS: DevicePreset[] = [
  // iPhone SE (3rd Gen)
  {
    id: 'iphone-se-3',
    name: 'iPhone SE',
    category: 'mobile',
    brand: 'Apple',
    model: 'iPhone SE (3rd Generation)',
    width: 375,
    height: 667,
    pixelDensity: 2,
    physicalPixelWidth: 750,
    physicalPixelHeight: 1334,
    ppi: 326,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: false,
    cornerRadius: 0,
    safeAreaTop: 20,
    safeAreaBottom: 0,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2022,
    defaultOrientation: 'portrait',
  },

  // iPhone 14
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    category: 'mobile',
    brand: 'Apple',
    model: 'iPhone 14',
    width: 390,
    height: 844,
    pixelDensity: 3,
    physicalPixelWidth: 1170,
    physicalPixelHeight: 2532,
    ppi: 460,
    hasNotch: true,
    hasDynamicIsland: false,
    hasHomeIndicator: true,
    cornerRadius: 47.33,
    safeAreaTop: 47,
    safeAreaBottom: 34,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2022,
    defaultOrientation: 'portrait',
  },

  // iPhone 14 Plus
  {
    id: 'iphone-14-plus',
    name: 'iPhone 14 Plus',
    category: 'mobile',
    brand: 'Apple',
    model: 'iPhone 14 Plus',
    width: 428,
    height: 926,
    pixelDensity: 3,
    physicalPixelWidth: 1284,
    physicalPixelHeight: 2778,
    ppi: 458,
    hasNotch: true,
    hasDynamicIsland: false,
    hasHomeIndicator: true,
    cornerRadius: 53.33,
    safeAreaTop: 47,
    safeAreaBottom: 34,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2022,
    defaultOrientation: 'portrait',
  },

  // iPhone 14 Pro
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    category: 'mobile',
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    width: 393,
    height: 852,
    pixelDensity: 3,
    physicalPixelWidth: 1179,
    physicalPixelHeight: 2556,
    ppi: 460,
    hasNotch: false,
    hasDynamicIsland: true,
    hasHomeIndicator: true,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2022,
    defaultOrientation: 'portrait',
  },

  // iPhone 14 Pro Max
  {
    id: 'iphone-14-pro-max',
    name: 'iPhone 14 Pro Max',
    category: 'mobile',
    brand: 'Apple',
    model: 'iPhone 14 Pro Max',
    width: 430,
    height: 932,
    pixelDensity: 3,
    physicalPixelWidth: 1290,
    physicalPixelHeight: 2796,
    ppi: 460,
    hasNotch: false,
    hasDynamicIsland: true,
    hasHomeIndicator: true,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2022,
    defaultOrientation: 'portrait',
  },

  // iPhone 15
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    category: 'mobile',
    brand: 'Apple',
    model: 'iPhone 15',
    width: 393,
    height: 852,
    pixelDensity: 3,
    physicalPixelWidth: 1179,
    physicalPixelHeight: 2556,
    ppi: 460,
    hasNotch: false,
    hasDynamicIsland: true,
    hasHomeIndicator: true,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2023,
    defaultOrientation: 'portrait',
  },

  // iPhone 15 Pro Max
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    category: 'mobile',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    width: 430,
    height: 932,
    pixelDensity: 3,
    physicalPixelWidth: 1290,
    physicalPixelHeight: 2796,
    ppi: 460,
    hasNotch: false,
    hasDynamicIsland: true,
    hasHomeIndicator: true,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2023,
    defaultOrientation: 'portrait',
  },
];

/**
 * Android device presets
 */
export const ANDROID_PRESETS: DevicePreset[] = [
  // Google Pixel 7
  {
    id: 'pixel-7',
    name: 'Pixel 7',
    category: 'mobile',
    brand: 'Google',
    model: 'Pixel 7',
    width: 412,
    height: 915,
    pixelDensity: 2.625,
    physicalPixelWidth: 1080,
    physicalPixelHeight: 2400,
    ppi: 416,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: false,
    hasNavigationBar: true,
    cornerRadius: 28,
    safeAreaTop: 24,
    safeAreaBottom: 48,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2022,
    defaultOrientation: 'portrait',
  },

  // Google Pixel 7 Pro
  {
    id: 'pixel-7-pro',
    name: 'Pixel 7 Pro',
    category: 'mobile',
    brand: 'Google',
    model: 'Pixel 7 Pro',
    width: 412,
    height: 892,
    pixelDensity: 3.5,
    physicalPixelWidth: 1440,
    physicalPixelHeight: 3120,
    ppi: 512,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: false,
    hasNavigationBar: true,
    cornerRadius: 32,
    safeAreaTop: 24,
    safeAreaBottom: 48,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2022,
    defaultOrientation: 'portrait',
  },

  // Google Pixel 8
  {
    id: 'pixel-8',
    name: 'Pixel 8',
    category: 'mobile',
    brand: 'Google',
    model: 'Pixel 8',
    width: 412,
    height: 915,
    pixelDensity: 2.625,
    physicalPixelWidth: 1080,
    physicalPixelHeight: 2400,
    ppi: 428,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: false,
    hasNavigationBar: true,
    cornerRadius: 32,
    safeAreaTop: 24,
    safeAreaBottom: 48,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2023,
    defaultOrientation: 'portrait',
  },

  // Samsung Galaxy S23
  {
    id: 'galaxy-s23',
    name: 'Galaxy S23',
    category: 'mobile',
    brand: 'Samsung',
    model: 'Galaxy S23',
    width: 360,
    height: 780,
    pixelDensity: 3,
    physicalPixelWidth: 1080,
    physicalPixelHeight: 2340,
    ppi: 425,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: false,
    hasNavigationBar: true,
    cornerRadius: 24,
    safeAreaTop: 24,
    safeAreaBottom: 48,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2023,
    defaultOrientation: 'portrait',
  },

  // Samsung Galaxy S23 Ultra
  {
    id: 'galaxy-s23-ultra',
    name: 'Galaxy S23 Ultra',
    category: 'mobile',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    width: 384,
    height: 824,
    pixelDensity: 4,
    physicalPixelWidth: 1440,
    physicalPixelHeight: 3088,
    ppi: 500,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: false,
    hasNavigationBar: true,
    cornerRadius: 28,
    safeAreaTop: 24,
    safeAreaBottom: 48,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2023,
    defaultOrientation: 'portrait',
  },

  // Samsung Galaxy Z Fold 5 (unfolded inner display)
  {
    id: 'galaxy-z-fold-5',
    name: 'Galaxy Z Fold 5',
    category: 'mobile',
    brand: 'Samsung',
    model: 'Galaxy Z Fold 5 (Inner)',
    width: 674,
    height: 836,
    pixelDensity: 2.75,
    physicalPixelWidth: 1812,
    physicalPixelHeight: 2176,
    ppi: 373,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: false,
    hasNavigationBar: true,
    cornerRadius: 32,
    safeAreaTop: 24,
    safeAreaBottom: 48,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2023,
    defaultOrientation: 'portrait',
  },

  // Samsung Galaxy Z Flip 5 (cover display)
  {
    id: 'galaxy-z-flip-5-cover',
    name: 'Galaxy Z Flip 5 Cover',
    category: 'mobile',
    brand: 'Samsung',
    model: 'Galaxy Z Flip 5 (Cover)',
    width: 260,
    height: 290,
    pixelDensity: 2.625,
    physicalPixelWidth: 720,
    physicalPixelHeight: 748,
    ppi: 305,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: false,
    hasNavigationBar: false,
    cornerRadius: 40,
    safeAreaTop: 0,
    safeAreaBottom: 0,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2023,
    defaultOrientation: 'portrait',
  },
];

/**
 * All mobile device presets
 */
export const MOBILE_PRESETS: DevicePreset[] = [
  ...IPHONE_PRESETS,
  ...ANDROID_PRESETS,
];

// ============================================================================
// TABLET DEVICE PRESETS
// ============================================================================

/**
 * iPad device presets
 */
export const IPAD_PRESETS: DevicePreset[] = [
  // iPad Mini (6th Gen)
  {
    id: 'ipad-mini-6',
    name: 'iPad Mini',
    category: 'tablet',
    brand: 'Apple',
    model: 'iPad Mini (6th Generation)',
    width: 744,
    height: 1133,
    pixelDensity: 2,
    physicalPixelWidth: 1488,
    physicalPixelHeight: 2266,
    ppi: 326,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: true,
    cornerRadius: 21.5,
    safeAreaTop: 24,
    safeAreaBottom: 20,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2021,
    defaultOrientation: 'portrait',
  },

  // iPad (10th Gen)
  {
    id: 'ipad-10',
    name: 'iPad (10th Gen)',
    category: 'tablet',
    brand: 'Apple',
    model: 'iPad (10th Generation)',
    width: 820,
    height: 1180,
    pixelDensity: 2,
    physicalPixelWidth: 1640,
    physicalPixelHeight: 2360,
    ppi: 264,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: true,
    cornerRadius: 18,
    safeAreaTop: 24,
    safeAreaBottom: 20,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2022,
    defaultOrientation: 'portrait',
  },

  // iPad Air (5th Gen)
  {
    id: 'ipad-air-5',
    name: 'iPad Air',
    category: 'tablet',
    brand: 'Apple',
    model: 'iPad Air (5th Generation)',
    width: 820,
    height: 1180,
    pixelDensity: 2,
    physicalPixelWidth: 1640,
    physicalPixelHeight: 2360,
    ppi: 264,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: true,
    cornerRadius: 18,
    safeAreaTop: 24,
    safeAreaBottom: 20,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2022,
    defaultOrientation: 'portrait',
  },

  // iPad Pro 11"
  {
    id: 'ipad-pro-11',
    name: 'iPad Pro 11"',
    category: 'tablet',
    brand: 'Apple',
    model: 'iPad Pro 11-inch (4th Generation)',
    width: 834,
    height: 1194,
    pixelDensity: 2,
    physicalPixelWidth: 1668,
    physicalPixelHeight: 2388,
    ppi: 264,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: true,
    cornerRadius: 18,
    safeAreaTop: 24,
    safeAreaBottom: 20,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2022,
    defaultOrientation: 'portrait',
  },

  // iPad Pro 12.9"
  {
    id: 'ipad-pro-12',
    name: 'iPad Pro 12.9"',
    category: 'tablet',
    brand: 'Apple',
    model: 'iPad Pro 12.9-inch (6th Generation)',
    width: 1024,
    height: 1366,
    pixelDensity: 2,
    physicalPixelWidth: 2048,
    physicalPixelHeight: 2732,
    ppi: 264,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: true,
    cornerRadius: 18,
    safeAreaTop: 24,
    safeAreaBottom: 20,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2022,
    defaultOrientation: 'portrait',
  },
];

/**
 * Android tablet presets
 */
export const ANDROID_TABLET_PRESETS: DevicePreset[] = [
  // Samsung Galaxy Tab S9
  {
    id: 'galaxy-tab-s9',
    name: 'Galaxy Tab S9',
    category: 'tablet',
    brand: 'Samsung',
    model: 'Galaxy Tab S9',
    width: 753,
    height: 1200,
    pixelDensity: 2.25,
    physicalPixelWidth: 1600,
    physicalPixelHeight: 2560,
    ppi: 274,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: false,
    hasNavigationBar: true,
    cornerRadius: 16,
    safeAreaTop: 24,
    safeAreaBottom: 48,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2023,
    defaultOrientation: 'portrait',
  },

  // Samsung Galaxy Tab S9+
  {
    id: 'galaxy-tab-s9-plus',
    name: 'Galaxy Tab S9+',
    category: 'tablet',
    brand: 'Samsung',
    model: 'Galaxy Tab S9+',
    width: 879,
    height: 1400,
    pixelDensity: 2.25,
    physicalPixelWidth: 1752,
    physicalPixelHeight: 2800,
    ppi: 266,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: false,
    hasNavigationBar: true,
    cornerRadius: 16,
    safeAreaTop: 24,
    safeAreaBottom: 48,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2023,
    defaultOrientation: 'portrait',
  },

  // Samsung Galaxy Tab S9 Ultra
  {
    id: 'galaxy-tab-s9-ultra',
    name: 'Galaxy Tab S9 Ultra',
    category: 'tablet',
    brand: 'Samsung',
    model: 'Galaxy Tab S9 Ultra',
    width: 960,
    height: 1514,
    pixelDensity: 2.625,
    physicalPixelWidth: 2960,
    physicalPixelHeight: 1848,
    ppi: 239,
    hasNotch: false,
    hasDynamicIsland: false,
    hasHomeIndicator: false,
    hasNavigationBar: true,
    cornerRadius: 20,
    safeAreaTop: 24,
    safeAreaBottom: 48,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    releaseYear: 2023,
    defaultOrientation: 'landscape',
  },
];

/**
 * All tablet presets
 */
export const TABLET_PRESETS: DevicePreset[] = [
  ...IPAD_PRESETS,
  ...ANDROID_TABLET_PRESETS,
];

// ============================================================================
// DESKTOP PRESETS
// ============================================================================

/**
 * Desktop screen presets
 */
export const DESKTOP_PRESETS: DesktopPreset[] = [
  // Standard breakpoints
  {
    id: 'desktop-sm',
    name: 'Small Desktop',
    category: 'desktop',
    width: 1280,
    height: 800,
    aspectRatio: '16:10',
    description: 'Small laptop screens (13" MacBook, etc.)',
  },
  {
    id: 'desktop-md',
    name: 'Medium Desktop',
    category: 'desktop',
    width: 1440,
    height: 900,
    aspectRatio: '16:10',
    description: 'Standard laptop screens (15" MacBook, etc.)',
  },
  {
    id: 'desktop-lg',
    name: 'Large Desktop',
    category: 'desktop',
    width: 1680,
    height: 1050,
    aspectRatio: '16:10',
    description: 'Large laptop screens',
  },
  {
    id: 'desktop-fhd',
    name: 'Full HD',
    category: 'desktop',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    description: 'Full HD monitors (1080p)',
  },
  {
    id: 'desktop-qhd',
    name: 'QHD (2K)',
    category: 'desktop',
    width: 2560,
    height: 1440,
    aspectRatio: '16:9',
    description: 'QHD monitors (1440p)',
  },
  {
    id: 'desktop-uhd',
    name: 'UHD (4K)',
    category: 'desktop',
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    description: 'UHD monitors (2160p)',
  },

  // Common monitor sizes
  {
    id: 'monitor-24',
    name: '24" Monitor',
    category: 'desktop',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    description: 'Standard 24" Full HD monitor',
  },
  {
    id: 'monitor-27',
    name: '27" Monitor',
    category: 'desktop',
    width: 2560,
    height: 1440,
    aspectRatio: '16:9',
    description: 'Standard 27" QHD monitor',
  },
  {
    id: 'monitor-32',
    name: '32" Monitor',
    category: 'desktop',
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    description: 'Standard 32" 4K monitor',
  },

  // Ultrawide monitors
  {
    id: 'ultrawide-34',
    name: '34" Ultrawide',
    category: 'desktop',
    width: 3440,
    height: 1440,
    aspectRatio: '21:9',
    description: '34" Ultrawide QHD monitor',
  },
  {
    id: 'ultrawide-49',
    name: '49" Super Ultrawide',
    category: 'desktop',
    width: 5120,
    height: 1440,
    aspectRatio: '32:9',
    description: '49" Super Ultrawide monitor',
  },

  // MacBook sizes
  {
    id: 'macbook-air-13',
    name: 'MacBook Air 13"',
    category: 'desktop',
    width: 1470,
    height: 956,
    aspectRatio: '16:10',
    description: 'MacBook Air 13" (M2)',
    isRetina: true,
  },
  {
    id: 'macbook-pro-14',
    name: 'MacBook Pro 14"',
    category: 'desktop',
    width: 1512,
    height: 982,
    aspectRatio: '16:10',
    description: 'MacBook Pro 14" (M3)',
    isRetina: true,
  },
  {
    id: 'macbook-pro-16',
    name: 'MacBook Pro 16"',
    category: 'desktop',
    width: 1728,
    height: 1117,
    aspectRatio: '16:10',
    description: 'MacBook Pro 16" (M3)',
    isRetina: true,
  },
];

// ============================================================================
// ALL PRESETS
// ============================================================================

/**
 * All device presets combined
 */
export const ALL_DEVICE_PRESETS: DevicePreset[] = [
  ...MOBILE_PRESETS,
  ...TABLET_PRESETS,
];

/**
 * Categorized presets for UI display
 */
export const PRESET_CATEGORIES = {
  mobile: {
    label: 'Mobile Phones',
    presets: MOBILE_PRESETS,
  },
  tablet: {
    label: 'Tablets',
    presets: TABLET_PRESETS,
  },
  desktop: {
    label: 'Desktop Screens',
    presets: DESKTOP_PRESETS,
  },
};

// ============================================================================
// ORIENTATION UTILITIES
// ============================================================================

/**
 * Get dimensions for a specific orientation
 */
export function getOrientedDimensions(
  preset: DevicePreset,
  orientation: DeviceOrientation
): OrientedDimensions {
  const isLandscape = orientation === 'landscape';
  const isDefaultLandscape = preset.defaultOrientation === 'landscape';

  // If requested orientation matches default, return as-is
  if ((isLandscape && isDefaultLandscape) || (!isLandscape && !isDefaultLandscape)) {
    return {
      width: preset.width,
      height: preset.height,
      safeAreaTop: preset.safeAreaTop || 0,
      safeAreaBottom: preset.safeAreaBottom || 0,
      safeAreaLeft: preset.safeAreaLeft || 0,
      safeAreaRight: preset.safeAreaRight || 0,
    };
  }

  // Swap dimensions for rotated orientation
  return {
    width: preset.height,
    height: preset.width,
    safeAreaTop: preset.safeAreaLeft || 0,
    safeAreaBottom: preset.safeAreaRight || 0,
    safeAreaLeft: preset.safeAreaTop || 0,
    safeAreaRight: preset.safeAreaBottom || 0,
  };
}

/**
 * Check if device supports landscape orientation
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function supportsLandscape(preset: DevicePreset): boolean {
  // All devices support landscape, but some may have specific behaviors
  return true;
}

/**
 * Get aspect ratio for orientation
 */
export function getAspectRatio(
  preset: DevicePreset,
  orientation: DeviceOrientation
): string {
  const dims = getOrientedDimensions(preset, orientation);
  const gcd = calculateGCD(dims.width, dims.height);
  return `${dims.width / gcd}:${dims.height / gcd}`;
}

/**
 * Calculate Greatest Common Divisor
 */
function calculateGCD(a: number, b: number): number {
  return b === 0 ? a : calculateGCD(b, a % b);
}

// ============================================================================
// CUSTOM BREAKPOINT UTILITIES
// ============================================================================

/**
 * Create a custom breakpoint preset
 */
export function createCustomBreakpoint(config: {
  name: string;
  minWidth: number;
  maxWidth?: number;
  description?: string;
  color?: string;
  icon?: string;
}): CustomBreakpointPreset {
  return {
    id: `custom-${config.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    name: config.name,
    minWidth: config.minWidth,
    maxWidth: config.maxWidth,
    description: config.description,
    color: config.color || '#6366f1',
    icon: config.icon || 'monitor',
  };
}

/**
 * Create a device-based breakpoint
 */
export function createDeviceBreakpoint(preset: DevicePreset): CustomBreakpointPreset {
  return {
    id: `device-${preset.id}`,
    name: preset.name,
    minWidth: preset.width,
    maxWidth: preset.width,
    description: `${preset.brand} ${preset.model}`,
    color: preset.category === 'mobile' ? '#10b981' : preset.category === 'tablet' ? '#3b82f6' : '#8b5cf6',
    icon: preset.category === 'mobile' ? 'smartphone' : preset.category === 'tablet' ? 'tablet' : 'monitor',
  };
}

/**
 * Generate breakpoints from device presets
 */
export function generateBreakpointsFromDevices(
  presets: DevicePreset[],
  orientation: DeviceOrientation = 'portrait'
): CustomBreakpointPreset[] {
  return presets.map((preset) => {
    const dims = getOrientedDimensions(preset, orientation);
    return {
      id: `device-${preset.id}`,
      name: preset.name,
      minWidth: dims.width,
      description: `${preset.brand} ${preset.model}`,
      color: preset.category === 'mobile' ? '#10b981' : '#3b82f6',
      icon: preset.category === 'mobile' ? 'smartphone' : 'tablet',
    };
  });
}

// ============================================================================
// PRESET SEARCH AND FILTERING
// ============================================================================

/**
 * Find preset by ID
 */
export function findPresetById(id: string): DevicePreset | DesktopPreset | undefined {
  const device = ALL_DEVICE_PRESETS.find((p) => p.id === id);
  if (device) return device;

  return DESKTOP_PRESETS.find((p) => p.id === id);
}

/**
 * Find presets by category
 */
export function findPresetsByCategory(category: DeviceCategory): DevicePreset[] {
  return ALL_DEVICE_PRESETS.filter((p) => p.category === category);
}

/**
 * Find presets by brand
 */
export function findPresetsByBrand(brand: string): DevicePreset[] {
  return ALL_DEVICE_PRESETS.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
}

/**
 * Find presets by width range
 */
export function findPresetsByWidthRange(
  minWidth: number,
  maxWidth: number
): DevicePreset[] {
  return ALL_DEVICE_PRESETS.filter((p) => p.width >= minWidth && p.width <= maxWidth);
}

/**
 * Get popular presets for quick selection
 */
export function getPopularPresets(): DevicePreset[] {
  const popularIds = [
    'iphone-15',
    'iphone-se-3',
    'pixel-8',
    'galaxy-s23',
    'ipad-pro-11',
    'ipad-mini-6',
  ];
  return popularIds
    .map((id) => ALL_DEVICE_PRESETS.find((p) => p.id === id))
    .filter((p): p is DevicePreset => p !== undefined);
}

// ============================================================================
// SAFE AREA UTILITIES
// ============================================================================

/**
 * Get CSS safe area inset values
 */
export function getSafeAreaCSS(preset: DevicePreset): string {
  return `
    --safe-area-top: ${preset.safeAreaTop || 0}px;
    --safe-area-bottom: ${preset.safeAreaBottom || 0}px;
    --safe-area-left: ${preset.safeAreaLeft || 0}px;
    --safe-area-right: ${preset.safeAreaRight || 0}px;
  `.trim();
}

/**
 * Get safe area inset Tailwind classes (using CSS env variables)
 */
export function getSafeAreaClasses(): string[] {
  return [
    'pt-[env(safe-area-inset-top)]',
    'pb-[env(safe-area-inset-bottom)]',
    'pl-[env(safe-area-inset-left)]',
    'pr-[env(safe-area-inset-right)]',
  ];
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export const BreakpointPresets = {
  // Presets
  MOBILE_PRESETS,
  TABLET_PRESETS,
  DESKTOP_PRESETS,
  ALL_DEVICE_PRESETS,
  PRESET_CATEGORIES,

  // Brand-specific
  IPHONE_PRESETS,
  ANDROID_PRESETS,
  IPAD_PRESETS,
  ANDROID_TABLET_PRESETS,

  // Utilities
  getOrientedDimensions,
  supportsLandscape,
  getAspectRatio,
  createCustomBreakpoint,
  createDeviceBreakpoint,
  generateBreakpointsFromDevices,

  // Search
  findPresetById,
  findPresetsByCategory,
  findPresetsByBrand,
  findPresetsByWidthRange,
  getPopularPresets,

  // Safe areas
  getSafeAreaCSS,
  getSafeAreaClasses,
};

export default BreakpointPresets;
