/**
 * Advanced Color System - Professional color utilities for designers
 *
 * Provides comprehensive color manipulation, conversion, and generation tools
 * including all major color formats, harmony generators, and manipulation functions.
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface RGBA extends RGB {
  a: number; // 0-1
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface HSLA extends HSL {
  a: number; // 0-1
}

export interface HSB {
  h: number; // 0-360
  s: number; // 0-100
  b: number; // 0-100
}

export interface LAB {
  l: number; // 0-100
  a: number; // -128 to 127
  b: number; // -128 to 127
}

export interface CMYK {
  c: number; // 0-100
  m: number; // 0-100
  y: number; // 0-100
  k: number; // 0-100
}

export interface XYZ {
  x: number;
  y: number;
  z: number;
}

export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hsb' | 'lab' | 'cmyk';

export type HarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'square'
  | 'monochromatic';

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion';

export interface ColorShade {
  shade: string;
  hex: string;
  rgb: RGB;
  hsl: HSL;
}

export interface ColorPalette {
  name: string;
  colors: string[];
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Clamp a number between min and max values
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Round to specified decimal places
 */
function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// =============================================================================
// COLOR FORMAT CONVERSIONS
// =============================================================================

/**
 * Parse any color string to RGB
 */
export function parseColor(color: string): RGB | null {
  // Remove whitespace
  color = color.trim().toLowerCase();

  // HEX format
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }

  // RGB/RGBA format
  if (color.startsWith('rgb')) {
    const match = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
      };
    }
  }

  // HSL/HSLA format
  if (color.startsWith('hsl')) {
    const match = color.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/);
    if (match) {
      const hsl: HSL = {
        h: parseInt(match[1], 10),
        s: parseInt(match[2], 10),
        l: parseInt(match[3], 10),
      };
      return hslToRgb(hsl);
    }
  }

  // Named colors
  const namedColors: Record<string, string> = {
    white: '#ffffff',
    black: '#000000',
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    yellow: '#ffff00',
    cyan: '#00ffff',
    magenta: '#ff00ff',
    transparent: '#00000000',
  };

  if (namedColors[color]) {
    return hexToRgb(namedColors[color]);
  }

  return null;
}

/**
 * Convert HEX to RGB
 */
export function hexToRgb(hex: string): RGB | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Handle shorthand (e.g., #FFF)
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  // Handle 8-character hex (with alpha)
  if (hex.length === 8) {
    hex = hex.substring(0, 6);
  }

  if (hex.length !== 6) {
    return null;
  }

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    return null;
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Convert RGB to HEX
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number): string => {
    const hex = clamp(Math.round(n), 0, 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Convert RGBA to HEX with alpha
 */
export function rgbaToHex(rgba: RGBA): string {
  const toHex = (n: number): string => {
    const hex = clamp(Math.round(n), 0, 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const alphaHex = toHex(rgba.a * 255);
  return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}${alphaHex}`;
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }

  return {
    h: round(h * 360, 1),
    s: round(s * 100, 1),
    l: round(l * 100, 1),
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

/**
 * Convert RGB to HSB (HSV)
 */
export function rgbToHsb(rgb: RGB): HSB {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (diff !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }

  return {
    h: round(h * 360, 1),
    s: round(s * 100, 1),
    b: round(v * 100, 1),
  };
}

/**
 * Convert HSB to RGB
 */
export function hsbToRgb(hsb: HSB): RGB {
  const h = hsb.h / 360;
  const s = hsb.s / 100;
  const v = hsb.b / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0, g = 0, b = 0;

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Convert RGB to XYZ (intermediate for LAB)
 */
export function rgbToXyz(rgb: RGB): XYZ {
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  r *= 100;
  g *= 100;
  b *= 100;

  // sRGB to XYZ matrix
  return {
    x: r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
    y: r * 0.2126729 + g * 0.7151522 + b * 0.0721750,
    z: r * 0.0193339 + g * 0.1191920 + b * 0.9503041,
  };
}

/**
 * Convert XYZ to RGB
 */
export function xyzToRgb(xyz: XYZ): RGB {
  const x = xyz.x / 100;
  const y = xyz.y / 100;
  const z = xyz.z / 100;

  // XYZ to sRGB matrix
  let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  let g = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
  let b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  // Apply gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  return {
    r: clamp(Math.round(r * 255), 0, 255),
    g: clamp(Math.round(g * 255), 0, 255),
    b: clamp(Math.round(b * 255), 0, 255),
  };
}

/**
 * Convert XYZ to LAB
 */
export function xyzToLab(xyz: XYZ): LAB {
  // D65 illuminant reference values
  const refX = 95.047;
  const refY = 100.000;
  const refZ = 108.883;

  let x = xyz.x / refX;
  let y = xyz.y / refY;
  let z = xyz.z / refZ;

  const epsilon = 0.008856;
  const kappa = 903.3;

  x = x > epsilon ? Math.pow(x, 1 / 3) : (kappa * x + 16) / 116;
  y = y > epsilon ? Math.pow(y, 1 / 3) : (kappa * y + 16) / 116;
  z = z > epsilon ? Math.pow(z, 1 / 3) : (kappa * z + 16) / 116;

  return {
    l: round(116 * y - 16, 2),
    a: round(500 * (x - y), 2),
    b: round(200 * (y - z), 2),
  };
}

/**
 * Convert LAB to XYZ
 */
export function labToXyz(lab: LAB): XYZ {
  const refX = 95.047;
  const refY = 100.000;
  const refZ = 108.883;

  const epsilon = 0.008856;
  const kappa = 903.3;

  const fy = (lab.l + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;

  const xr = Math.pow(fx, 3) > epsilon ? Math.pow(fx, 3) : (116 * fx - 16) / kappa;
  const yr = lab.l > kappa * epsilon ? Math.pow((lab.l + 16) / 116, 3) : lab.l / kappa;
  const zr = Math.pow(fz, 3) > epsilon ? Math.pow(fz, 3) : (116 * fz - 16) / kappa;

  return {
    x: xr * refX,
    y: yr * refY,
    z: zr * refZ,
  };
}

/**
 * Convert RGB to LAB
 */
export function rgbToLab(rgb: RGB): LAB {
  return xyzToLab(rgbToXyz(rgb));
}

/**
 * Convert LAB to RGB
 */
export function labToRgb(lab: LAB): RGB {
  return xyzToRgb(labToXyz(lab));
}

/**
 * Convert RGB to CMYK
 */
export function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  return {
    c: round((1 - r - k) / (1 - k) * 100, 1),
    m: round((1 - g - k) / (1 - k) * 100, 1),
    y: round((1 - b - k) / (1 - k) * 100, 1),
    k: round(k * 100, 1),
  };
}

/**
 * Convert CMYK to RGB
 */
export function cmykToRgb(cmyk: CMYK): RGB {
  const c = cmyk.c / 100;
  const m = cmyk.m / 100;
  const y = cmyk.y / 100;
  const k = cmyk.k / 100;

  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k)),
  };
}

// =============================================================================
// COLOR STRING FORMATTING
// =============================================================================

/**
 * Format color to specified format string
 */
export function formatColor(color: RGB | RGBA, format: ColorFormat): string {
  const rgb = color as RGB;
  const hasAlpha = 'a' in color;
  const alpha = hasAlpha ? (color as RGBA).a : 1;

  switch (format) {
    case 'hex':
      return hasAlpha && alpha < 1 ? rgbaToHex({ ...rgb, a: alpha }) : rgbToHex(rgb);

    case 'rgb':
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    case 'rgba':
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${round(alpha, 2)})`;

    case 'hsl': {
      const hsl = rgbToHsl(rgb);
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }

    case 'hsla': {
      const hsl = rgbToHsl(rgb);
      return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${round(alpha, 2)})`;
    }

    case 'hsb': {
      const hsb = rgbToHsb(rgb);
      return `hsb(${hsb.h}, ${hsb.s}%, ${hsb.b}%)`;
    }

    case 'lab': {
      const lab = rgbToLab(rgb);
      return `lab(${lab.l}% ${lab.a} ${lab.b})`;
    }

    case 'cmyk': {
      const cmyk = rgbToCmyk(rgb);
      return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    }

    default:
      return rgbToHex(rgb);
  }
}

// =============================================================================
// COLOR MANIPULATION
// =============================================================================

/**
 * Lighten a color by percentage
 */
export function lighten(color: RGB, amount: number): RGB {
  const hsl = rgbToHsl(color);
  hsl.l = clamp(hsl.l + amount, 0, 100);
  return hslToRgb(hsl);
}

/**
 * Darken a color by percentage
 */
export function darken(color: RGB, amount: number): RGB {
  const hsl = rgbToHsl(color);
  hsl.l = clamp(hsl.l - amount, 0, 100);
  return hslToRgb(hsl);
}

/**
 * Saturate a color by percentage
 */
export function saturate(color: RGB, amount: number): RGB {
  const hsl = rgbToHsl(color);
  hsl.s = clamp(hsl.s + amount, 0, 100);
  return hslToRgb(hsl);
}

/**
 * Desaturate a color by percentage
 */
export function desaturate(color: RGB, amount: number): RGB {
  const hsl = rgbToHsl(color);
  hsl.s = clamp(hsl.s - amount, 0, 100);
  return hslToRgb(hsl);
}

/**
 * Rotate hue by degrees
 */
export function rotateHue(color: RGB, degrees: number): RGB {
  const hsl = rgbToHsl(color);
  hsl.h = (hsl.h + degrees) % 360;
  if (hsl.h < 0) hsl.h += 360;
  return hslToRgb(hsl);
}

/**
 * Invert a color
 */
export function invert(color: RGB): RGB {
  return {
    r: 255 - color.r,
    g: 255 - color.g,
    b: 255 - color.b,
  };
}

/**
 * Convert to grayscale
 */
export function grayscale(color: RGB): RGB {
  const gray = Math.round(0.299 * color.r + 0.587 * color.g + 0.114 * color.b);
  return { r: gray, g: gray, b: gray };
}

/**
 * Adjust color temperature (warm/cool)
 * Positive values = warmer, Negative values = cooler
 */
export function adjustTemperature(color: RGB, amount: number): RGB {
  const strength = Math.abs(amount) / 100;

  if (amount > 0) {
    // Warm (add orange/red)
    return {
      r: clamp(Math.round(color.r + (255 - color.r) * strength * 0.3), 0, 255),
      g: clamp(Math.round(color.g + (128 - color.g) * strength * 0.1), 0, 255),
      b: clamp(Math.round(color.b - color.b * strength * 0.3), 0, 255),
    };
  } else {
    // Cool (add blue)
    return {
      r: clamp(Math.round(color.r - color.r * strength * 0.3), 0, 255),
      g: clamp(Math.round(color.g + (200 - color.g) * strength * 0.1), 0, 255),
      b: clamp(Math.round(color.b + (255 - color.b) * strength * 0.3), 0, 255),
    };
  }
}

/**
 * Mix two colors together
 */
export function mix(color1: RGB, color2: RGB, ratio: number = 0.5): RGB {
  const r = clamp(ratio, 0, 1);
  return {
    r: Math.round(color1.r * (1 - r) + color2.r * r),
    g: Math.round(color1.g * (1 - r) + color2.g * r),
    b: Math.round(color1.b * (1 - r) + color2.b * r),
  };
}

/**
 * Set opacity for a color
 */
export function setAlpha(color: RGB, alpha: number): RGBA {
  return {
    ...color,
    a: clamp(alpha, 0, 1),
  };
}

// =============================================================================
// COLOR BLENDING MODES
// =============================================================================

/**
 * Blend two colors using specified blend mode
 */
export function blend(base: RGB, blend: RGB, mode: BlendMode, opacity: number = 1): RGB {
  const b = {
    r: base.r / 255,
    g: base.g / 255,
    b: base.b / 255,
  };

  const l = {
    r: blend.r / 255,
    g: blend.g / 255,
    b: blend.b / 255,
  };

  let result: { r: number; g: number; b: number };

  switch (mode) {
    case 'multiply':
      result = {
        r: b.r * l.r,
        g: b.g * l.g,
        b: b.b * l.b,
      };
      break;

    case 'screen':
      result = {
        r: 1 - (1 - b.r) * (1 - l.r),
        g: 1 - (1 - b.g) * (1 - l.g),
        b: 1 - (1 - b.b) * (1 - l.b),
      };
      break;

    case 'overlay':
      result = {
        r: b.r < 0.5 ? 2 * b.r * l.r : 1 - 2 * (1 - b.r) * (1 - l.r),
        g: b.g < 0.5 ? 2 * b.g * l.g : 1 - 2 * (1 - b.g) * (1 - l.g),
        b: b.b < 0.5 ? 2 * b.b * l.b : 1 - 2 * (1 - b.b) * (1 - l.b),
      };
      break;

    case 'darken':
      result = {
        r: Math.min(b.r, l.r),
        g: Math.min(b.g, l.g),
        b: Math.min(b.b, l.b),
      };
      break;

    case 'lighten':
      result = {
        r: Math.max(b.r, l.r),
        g: Math.max(b.g, l.g),
        b: Math.max(b.b, l.b),
      };
      break;

    case 'color-dodge':
      result = {
        r: l.r === 1 ? 1 : Math.min(1, b.r / (1 - l.r)),
        g: l.g === 1 ? 1 : Math.min(1, b.g / (1 - l.g)),
        b: l.b === 1 ? 1 : Math.min(1, b.b / (1 - l.b)),
      };
      break;

    case 'color-burn':
      result = {
        r: l.r === 0 ? 0 : Math.max(0, 1 - (1 - b.r) / l.r),
        g: l.g === 0 ? 0 : Math.max(0, 1 - (1 - b.g) / l.g),
        b: l.b === 0 ? 0 : Math.max(0, 1 - (1 - b.b) / l.b),
      };
      break;

    case 'hard-light':
      result = {
        r: l.r < 0.5 ? 2 * b.r * l.r : 1 - 2 * (1 - b.r) * (1 - l.r),
        g: l.g < 0.5 ? 2 * b.g * l.g : 1 - 2 * (1 - b.g) * (1 - l.g),
        b: l.b < 0.5 ? 2 * b.b * l.b : 1 - 2 * (1 - b.b) * (1 - l.b),
      };
      break;

    case 'soft-light':
      result = {
        r: l.r < 0.5
          ? b.r - (1 - 2 * l.r) * b.r * (1 - b.r)
          : b.r + (2 * l.r - 1) * ((b.r < 0.25 ? ((16 * b.r - 12) * b.r + 4) * b.r : Math.sqrt(b.r)) - b.r),
        g: l.g < 0.5
          ? b.g - (1 - 2 * l.g) * b.g * (1 - b.g)
          : b.g + (2 * l.g - 1) * ((b.g < 0.25 ? ((16 * b.g - 12) * b.g + 4) * b.g : Math.sqrt(b.g)) - b.g),
        b: l.b < 0.5
          ? b.b - (1 - 2 * l.b) * b.b * (1 - b.b)
          : b.b + (2 * l.b - 1) * ((b.b < 0.25 ? ((16 * b.b - 12) * b.b + 4) * b.b : Math.sqrt(b.b)) - b.b),
      };
      break;

    case 'difference':
      result = {
        r: Math.abs(b.r - l.r),
        g: Math.abs(b.g - l.g),
        b: Math.abs(b.b - l.b),
      };
      break;

    case 'exclusion':
      result = {
        r: b.r + l.r - 2 * b.r * l.r,
        g: b.g + l.g - 2 * b.g * l.g,
        b: b.b + l.b - 2 * b.b * l.b,
      };
      break;

    default:
      result = l;
  }

  // Apply opacity blending
  const finalR = b.r + (result.r - b.r) * opacity;
  const finalG = b.g + (result.g - b.g) * opacity;
  const finalB = b.b + (result.b - b.b) * opacity;

  return {
    r: clamp(Math.round(finalR * 255), 0, 255),
    g: clamp(Math.round(finalG * 255), 0, 255),
    b: clamp(Math.round(finalB * 255), 0, 255),
  };
}

// =============================================================================
// COLOR HARMONY GENERATORS
// =============================================================================

/**
 * Generate complementary color (180 degrees)
 */
export function getComplementary(color: RGB): RGB[] {
  return [color, rotateHue(color, 180)];
}

/**
 * Generate analogous colors (30 degrees apart)
 */
export function getAnalogous(color: RGB, angle: number = 30): RGB[] {
  return [
    rotateHue(color, -angle),
    color,
    rotateHue(color, angle),
  ];
}

/**
 * Generate triadic colors (120 degrees apart)
 */
export function getTriadic(color: RGB): RGB[] {
  return [
    color,
    rotateHue(color, 120),
    rotateHue(color, 240),
  ];
}

/**
 * Generate split-complementary colors
 */
export function getSplitComplementary(color: RGB, angle: number = 30): RGB[] {
  return [
    color,
    rotateHue(color, 180 - angle),
    rotateHue(color, 180 + angle),
  ];
}

/**
 * Generate tetradic (rectangular) colors
 */
export function getTetradic(color: RGB, angle: number = 60): RGB[] {
  return [
    color,
    rotateHue(color, angle),
    rotateHue(color, 180),
    rotateHue(color, 180 + angle),
  ];
}

/**
 * Generate square colors (90 degrees apart)
 */
export function getSquare(color: RGB): RGB[] {
  return [
    color,
    rotateHue(color, 90),
    rotateHue(color, 180),
    rotateHue(color, 270),
  ];
}

/**
 * Generate monochromatic colors (same hue, varying lightness)
 */
export function getMonochromatic(color: RGB, count: number = 5): RGB[] {
  const hsl = rgbToHsl(color);
  const colors: RGB[] = [];

  const step = 80 / (count - 1);

  for (let i = 0; i < count; i++) {
    colors.push(hslToRgb({
      h: hsl.h,
      s: hsl.s,
      l: 10 + i * step,
    }));
  }

  return colors;
}

/**
 * Generate color harmony based on type
 */
export function generateHarmony(color: RGB, type: HarmonyType): RGB[] {
  switch (type) {
    case 'complementary':
      return getComplementary(color);
    case 'analogous':
      return getAnalogous(color);
    case 'triadic':
      return getTriadic(color);
    case 'split-complementary':
      return getSplitComplementary(color);
    case 'tetradic':
      return getTetradic(color);
    case 'square':
      return getSquare(color);
    case 'monochromatic':
      return getMonochromatic(color);
    default:
      return [color];
  }
}

// =============================================================================
// SHADE GENERATION (TAILWIND-STYLE)
// =============================================================================

/**
 * Generate Tailwind-style shade scale (50-950)
 */
export function generateShadeScale(baseColor: RGB): ColorShade[] {
  const hsl = rgbToHsl(baseColor);

  const shadeConfig = [
    { shade: '50', lightness: 97, saturation: 0.95 },
    { shade: '100', lightness: 94, saturation: 0.95 },
    { shade: '200', lightness: 86, saturation: 0.95 },
    { shade: '300', lightness: 76, saturation: 0.92 },
    { shade: '400', lightness: 63, saturation: 0.88 },
    { shade: '500', lightness: 50, saturation: 1.0 },
    { shade: '600', lightness: 42, saturation: 1.0 },
    { shade: '700', lightness: 34, saturation: 0.95 },
    { shade: '800', lightness: 26, saturation: 0.90 },
    { shade: '900', lightness: 20, saturation: 0.85 },
    { shade: '950', lightness: 12, saturation: 0.80 },
  ];

  return shadeConfig.map(config => {
    const rgb = hslToRgb({
      h: hsl.h,
      s: clamp(hsl.s * config.saturation, 0, 100),
      l: config.lightness,
    });

    return {
      shade: config.shade,
      hex: rgbToHex(rgb),
      rgb,
      hsl: rgbToHsl(rgb),
    };
  });
}

/**
 * Generate tints (add white)
 */
export function generateTints(color: RGB, count: number = 10): RGB[] {
  const white: RGB = { r: 255, g: 255, b: 255 };
  const tints: RGB[] = [];

  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1);
    tints.push(mix(color, white, ratio));
  }

  return tints;
}

/**
 * Generate shades (add black)
 */
export function generateShades(color: RGB, count: number = 10): RGB[] {
  const black: RGB = { r: 0, g: 0, b: 0 };
  const shades: RGB[] = [];

  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1);
    shades.push(mix(color, black, ratio));
  }

  return shades;
}

/**
 * Generate tones (add gray)
 */
export function generateTones(color: RGB, count: number = 10): RGB[] {
  const gray: RGB = { r: 128, g: 128, b: 128 };
  const tones: RGB[] = [];

  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1);
    tones.push(mix(color, gray, ratio));
  }

  return tones;
}

// =============================================================================
// COLOR NAMING
// =============================================================================

/**
 * Basic color name lookup based on hue
 */
const colorNames: { min: number; max: number; name: string }[] = [
  { min: 0, max: 15, name: 'Red' },
  { min: 15, max: 45, name: 'Orange' },
  { min: 45, max: 65, name: 'Yellow' },
  { min: 65, max: 80, name: 'Lime' },
  { min: 80, max: 150, name: 'Green' },
  { min: 150, max: 180, name: 'Cyan' },
  { min: 180, max: 200, name: 'Teal' },
  { min: 200, max: 240, name: 'Blue' },
  { min: 240, max: 280, name: 'Indigo' },
  { min: 280, max: 320, name: 'Purple' },
  { min: 320, max: 345, name: 'Pink' },
  { min: 345, max: 360, name: 'Red' },
];

/**
 * Get color name based on HSL values
 */
export function getColorName(color: RGB): string {
  const hsl = rgbToHsl(color);

  // Handle grayscale
  if (hsl.s < 10) {
    if (hsl.l < 10) return 'Black';
    if (hsl.l > 90) return 'White';
    if (hsl.l < 30) return 'Dark Gray';
    if (hsl.l > 70) return 'Light Gray';
    return 'Gray';
  }

  // Find base color name
  let baseName = 'Unknown';
  for (const { min, max, name } of colorNames) {
    if (hsl.h >= min && hsl.h < max) {
      baseName = name;
      break;
    }
  }

  // Add lightness modifier
  if (hsl.l < 25) {
    return `Dark ${baseName}`;
  } else if (hsl.l > 75) {
    return `Light ${baseName}`;
  } else if (hsl.s < 40) {
    return `Muted ${baseName}`;
  }

  return baseName;
}

/**
 * Get a creative/fancy color name
 */
export function getFancyColorName(color: RGB): string {
  const hsl = rgbToHsl(color);

  const fancyNames: Record<string, string[]> = {
    Red: ['Crimson', 'Scarlet', 'Ruby', 'Vermillion', 'Carmine', 'Coral'],
    Orange: ['Tangerine', 'Amber', 'Apricot', 'Persimmon', 'Mandarin', 'Rust'],
    Yellow: ['Canary', 'Lemon', 'Maize', 'Saffron', 'Honey', 'Mustard'],
    Lime: ['Chartreuse', 'Pistachio', 'Pear', 'Spring', 'Apple', 'Kiwi'],
    Green: ['Emerald', 'Jade', 'Forest', 'Mint', 'Sage', 'Moss'],
    Cyan: ['Aqua', 'Turquoise', 'Tiffany', 'Seafoam', 'Aquamarine', 'Caribbean'],
    Teal: ['Peacock', 'Ocean', 'Lagoon', 'Aegean', 'Marine', 'Petrol'],
    Blue: ['Sapphire', 'Azure', 'Cerulean', 'Cobalt', 'Denim', 'Navy'],
    Indigo: ['Midnight', 'Iris', 'Periwinkle', 'Dusk', 'Twilight', 'Blueberry'],
    Purple: ['Amethyst', 'Violet', 'Lavender', 'Plum', 'Grape', 'Orchid'],
    Pink: ['Rose', 'Fuchsia', 'Blush', 'Peony', 'Carnation', 'Flamingo'],
    Gray: ['Slate', 'Stone', 'Ash', 'Silver', 'Pewter', 'Graphite'],
    Black: ['Onyx', 'Obsidian', 'Jet', 'Charcoal', 'Ebony', 'Raven'],
    White: ['Snow', 'Pearl', 'Ivory', 'Alabaster', 'Cream', 'Frost'],
  };

  const baseName = getColorName(color).replace(/^(Dark |Light |Muted )/, '');
  const names = fancyNames[baseName] || [baseName];

  // Use color values to consistently pick a name
  const index = (color.r + color.g + color.b) % names.length;
  let prefix = '';

  if (hsl.l < 25) {
    prefix = 'Deep ';
  } else if (hsl.l > 75) {
    prefix = 'Pale ';
  } else if (hsl.s > 80) {
    prefix = 'Vivid ';
  } else if (hsl.s < 40) {
    prefix = 'Dusty ';
  }

  return prefix + names[index];
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Calculate perceived brightness (0-255)
 */
export function getLuminance(color: RGB): number {
  return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
}

/**
 * Check if color is light or dark
 */
export function isLight(color: RGB): boolean {
  return getLuminance(color) > 128;
}

/**
 * Get optimal text color (black or white) for background
 */
export function getContrastText(backgroundColor: RGB): RGB {
  return isLight(backgroundColor)
    ? { r: 0, g: 0, b: 0 }
    : { r: 255, g: 255, b: 255 };
}

/**
 * Calculate relative luminance for WCAG
 */
export function getRelativeLuminance(color: RGB): number {
  const sRGB = [color.r, color.g, color.b].map(val => {
    const normalized = val / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Generate a random color
 */
export function randomColor(): RGB {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
}

/**
 * Generate a random color with specific saturation and lightness ranges
 */
export function randomColorConstrained(
  saturationRange: [number, number] = [50, 80],
  lightnessRange: [number, number] = [40, 60]
): RGB {
  const hsl: HSL = {
    h: Math.floor(Math.random() * 360),
    s: saturationRange[0] + Math.random() * (saturationRange[1] - saturationRange[0]),
    l: lightnessRange[0] + Math.random() * (lightnessRange[1] - lightnessRange[0]),
  };

  return hslToRgb(hsl);
}

/**
 * Check if two colors are similar within a threshold
 */
export function areColorsSimilar(color1: RGB, color2: RGB, threshold: number = 30): boolean {
  const lab1 = rgbToLab(color1);
  const lab2 = rgbToLab(color2);

  // Calculate Delta E (CIE76)
  const deltaE = Math.sqrt(
    Math.pow(lab1.l - lab2.l, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  );

  return deltaE < threshold;
}

/**
 * Sort colors by hue
 */
export function sortByHue(colors: RGB[]): RGB[] {
  return [...colors].sort((a, b) => {
    const hslA = rgbToHsl(a);
    const hslB = rgbToHsl(b);
    return hslA.h - hslB.h;
  });
}

/**
 * Sort colors by lightness
 */
export function sortByLightness(colors: RGB[]): RGB[] {
  return [...colors].sort((a, b) => {
    const hslA = rgbToHsl(a);
    const hslB = rgbToHsl(b);
    return hslA.l - hslB.l;
  });
}

// =============================================================================
// GRADIENT UTILITIES
// =============================================================================

export interface GradientStop {
  color: RGB;
  position: number; // 0-100
}

export type GradientDirection =
  | 'to-t' | 'to-tr' | 'to-r' | 'to-br'
  | 'to-b' | 'to-bl' | 'to-l' | 'to-tl';

/**
 * Generate CSS gradient string
 */
export function generateGradientCSS(
  stops: GradientStop[],
  direction: GradientDirection = 'to-r'
): string {
  const directionMap: Record<GradientDirection, string> = {
    'to-t': 'to top',
    'to-tr': 'to top right',
    'to-r': 'to right',
    'to-br': 'to bottom right',
    'to-b': 'to bottom',
    'to-bl': 'to bottom left',
    'to-l': 'to left',
    'to-tl': 'to top left',
  };

  const colorStops = stops
    .sort((a, b) => a.position - b.position)
    .map(stop => `${rgbToHex(stop.color)} ${stop.position}%`)
    .join(', ');

  return `linear-gradient(${directionMap[direction]}, ${colorStops})`;
}

/**
 * Interpolate between gradient stops
 */
export function interpolateGradient(stops: GradientStop[], count: number): RGB[] {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const colors: RGB[] = [];

  for (let i = 0; i < count; i++) {
    const position = (i / (count - 1)) * 100;

    let startStop = sortedStops[0];
    let endStop = sortedStops[sortedStops.length - 1];

    for (let j = 0; j < sortedStops.length - 1; j++) {
      if (position >= sortedStops[j].position && position <= sortedStops[j + 1].position) {
        startStop = sortedStops[j];
        endStop = sortedStops[j + 1];
        break;
      }
    }

    const range = endStop.position - startStop.position;
    const ratio = range === 0 ? 0 : (position - startStop.position) / range;

    colors.push(mix(startStop.color, endStop.color, ratio));
  }

  return colors;
}
