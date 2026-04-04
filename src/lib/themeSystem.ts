/**
 * Theme System - Complete theme customization for Tailwind Builder
 *
 * This module provides a comprehensive theming system with:
 * - 20+ pre-built color palettes
 * - Typography presets
 * - Spacing scale systems
 * - Border radius presets
 * - Shadow presets
 * - Animation presets
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/** Color shade scale from 50 to 950 */
export type ColorShade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';

/** Complete color scale with all shades */
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

/** Semantic color definitions */
export interface SemanticColors {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
}

/** Color palette with all semantic colors */
export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: SemanticColors;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  foreground: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: {
    default: string;
    subtle: string;
    strong: string;
  };
}

/** Typography font family configuration */
export interface FontFamily {
  heading: string;
  body: string;
  mono: string;
}

/** Typography font size scale */
export interface FontSizeScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
  '7xl': string;
  '8xl': string;
  '9xl': string;
}

/** Typography line height scale */
export interface LineHeightScale {
  none: string;
  tight: string;
  snug: string;
  normal: string;
  relaxed: string;
  loose: string;
}

/** Typography letter spacing scale */
export interface LetterSpacingScale {
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
  wider: string;
  widest: string;
}

/** Typography font weight scale */
export interface FontWeightScale {
  thin: string;
  extralight: string;
  light: string;
  normal: string;
  medium: string;
  semibold: string;
  bold: string;
  extrabold: string;
  black: string;
}

/** Complete typography preset */
export interface TypographyPreset {
  id: string;
  name: string;
  description: string;
  fontFamily: FontFamily;
  fontSize: FontSizeScale;
  lineHeight: LineHeightScale;
  letterSpacing: LetterSpacingScale;
  fontWeight: FontWeightScale;
}

/** Spacing scale configuration */
export interface SpacingScale {
  0: string;
  px: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
  36: string;
  40: string;
  44: string;
  48: string;
  52: string;
  56: string;
  60: string;
  64: string;
  72: string;
  80: string;
  96: string;
}

/** Spacing preset configuration */
export interface SpacingPreset {
  id: string;
  name: string;
  description: string;
  scale: SpacingScale;
  baseUnit: number; // in rem
}

/** Border radius scale */
export interface BorderRadiusScale {
  none: string;
  sm: string;
  default: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

/** Border radius preset */
export interface BorderRadiusPreset {
  id: string;
  name: string;
  description: string;
  scale: BorderRadiusScale;
}

/** Shadow scale */
export interface ShadowScale {
  sm: string;
  default: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

/** Shadow preset */
export interface ShadowPreset {
  id: string;
  name: string;
  description: string;
  scale: ShadowScale;
}

/** Animation timing function */
export interface AnimationTimingFunction {
  linear: string;
  easeIn: string;
  easeOut: string;
  easeInOut: string;
  bounce: string;
  elastic: string;
}

/** Animation duration scale */
export interface AnimationDurationScale {
  fastest: string;
  fast: string;
  normal: string;
  slow: string;
  slowest: string;
}

/** Animation preset */
export interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  duration: AnimationDurationScale;
  timing: AnimationTimingFunction;
  keyframes: Record<string, Record<string, string>>;
}

/** Complete theme configuration */
export interface Theme {
  id: string;
  name: string;
  description: string;
  version: string;
  colorPalette: ColorPalette;
  typography: TypographyPreset;
  spacing: SpacingPreset;
  borderRadius: BorderRadiusPreset;
  shadows: ShadowPreset;
  animations: AnimationPreset;
  darkMode: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Theme customization overrides */
export interface ThemeOverrides {
  colorPalette?: Partial<ColorPalette>;
  typography?: Partial<TypographyPreset>;
  spacing?: Partial<SpacingPreset>;
  borderRadius?: Partial<BorderRadiusPreset>;
  shadows?: Partial<ShadowPreset>;
  animations?: Partial<AnimationPreset>;
}

// =============================================================================
// COLOR PALETTES (20+ Pre-built)
// =============================================================================

/** Generate color scale from a base hex color */
function generateColorScale(baseHex: string): ColorScale {
  // Convert hex to HSL and generate shades
  const hex = baseHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  const hslToHex = (h: number, s: number, l: number): string => {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let rVal: number, gVal: number, bVal: number;
    if (s === 0) {
      rVal = gVal = bVal = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      rVal = hue2rgb(p, q, h + 1 / 3);
      gVal = hue2rgb(p, q, h);
      bVal = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number): string => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(rVal)}${toHex(gVal)}${toHex(bVal)}`;
  };

  return {
    50: hslToHex(h, s * 0.9, 0.97),
    100: hslToHex(h, s * 0.95, 0.94),
    200: hslToHex(h, s * 0.9, 0.86),
    300: hslToHex(h, s * 0.85, 0.74),
    400: hslToHex(h, s * 0.8, 0.60),
    500: hslToHex(h, s, 0.50),
    600: hslToHex(h, s * 1.05, 0.42),
    700: hslToHex(h, s * 1.1, 0.34),
    800: hslToHex(h, s * 1.1, 0.26),
    900: hslToHex(h, s * 1.15, 0.18),
    950: hslToHex(h, s * 1.2, 0.10),
  };
}

export const COLOR_PALETTES: Record<string, ColorPalette> = {
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary color scheme with blue accents',
    colors: {
      primary: generateColorScale('#3B82F6'),
      secondary: generateColorScale('#6366F1'),
      accent: generateColorScale('#8B5CF6'),
      neutral: generateColorScale('#6B7280'),
      success: generateColorScale('#22C55E'),
      warning: generateColorScale('#F59E0B'),
      error: generateColorScale('#EF4444'),
      info: generateColorScale('#06B6D4'),
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
    },
    foreground: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#9CA3AF',
    },
    border: {
      default: '#E5E7EB',
      subtle: '#F3F4F6',
      strong: '#D1D5DB',
    },
  },

  retro: {
    id: 'retro',
    name: 'Retro',
    description: 'Nostalgic colors inspired by 70s and 80s design',
    colors: {
      primary: generateColorScale('#D97706'),
      secondary: generateColorScale('#7C3AED'),
      accent: generateColorScale('#DC2626'),
      neutral: generateColorScale('#78716C'),
      success: generateColorScale('#16A34A'),
      warning: generateColorScale('#EAB308'),
      error: generateColorScale('#B91C1C'),
      info: generateColorScale('#0369A1'),
    },
    background: {
      primary: '#FFFBEB',
      secondary: '#FEF3C7',
      tertiary: '#FDE68A',
    },
    foreground: {
      primary: '#292524',
      secondary: '#44403C',
      muted: '#A8A29E',
    },
    border: {
      default: '#D6D3D1',
      subtle: '#E7E5E4',
      strong: '#A8A29E',
    },
  },

  neon: {
    id: 'neon',
    name: 'Neon',
    description: 'Vibrant neon colors for cyberpunk aesthetics',
    colors: {
      primary: generateColorScale('#00FF87'),
      secondary: generateColorScale('#00D9FF'),
      accent: generateColorScale('#FF00E5'),
      neutral: generateColorScale('#4B5563'),
      success: generateColorScale('#00FF9F'),
      warning: generateColorScale('#FFD600'),
      error: generateColorScale('#FF0055'),
      info: generateColorScale('#00BFFF'),
    },
    background: {
      primary: '#0A0A0F',
      secondary: '#12121A',
      tertiary: '#1A1A25',
    },
    foreground: {
      primary: '#FFFFFF',
      secondary: '#E5E7EB',
      muted: '#9CA3AF',
    },
    border: {
      default: '#2D2D3A',
      subtle: '#1F1F2B',
      strong: '#3D3D4A',
    },
  },

  pastel: {
    id: 'pastel',
    name: 'Pastel',
    description: 'Soft and gentle pastel tones',
    colors: {
      primary: generateColorScale('#93C5FD'),
      secondary: generateColorScale('#C4B5FD'),
      accent: generateColorScale('#FCA5A5'),
      neutral: generateColorScale('#D1D5DB'),
      success: generateColorScale('#86EFAC'),
      warning: generateColorScale('#FDE68A'),
      error: generateColorScale('#FDA4AF'),
      info: generateColorScale('#A5F3FC'),
    },
    background: {
      primary: '#FEFEFE',
      secondary: '#F8FAFC',
      tertiary: '#F1F5F9',
    },
    foreground: {
      primary: '#475569',
      secondary: '#64748B',
      muted: '#94A3B8',
    },
    border: {
      default: '#E2E8F0',
      subtle: '#F1F5F9',
      strong: '#CBD5E1',
    },
  },

  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Elegant dark theme with subtle accents',
    colors: {
      primary: generateColorScale('#60A5FA'),
      secondary: generateColorScale('#A78BFA'),
      accent: generateColorScale('#F472B6'),
      neutral: generateColorScale('#6B7280'),
      success: generateColorScale('#4ADE80'),
      warning: generateColorScale('#FBBF24'),
      error: generateColorScale('#F87171'),
      info: generateColorScale('#38BDF8'),
    },
    background: {
      primary: '#111827',
      secondary: '#1F2937',
      tertiary: '#374151',
    },
    foreground: {
      primary: '#F9FAFB',
      secondary: '#E5E7EB',
      muted: '#9CA3AF',
    },
    border: {
      default: '#374151',
      subtle: '#1F2937',
      strong: '#4B5563',
    },
  },

  light: {
    id: 'light',
    name: 'Light',
    description: 'Bright and airy light theme',
    colors: {
      primary: generateColorScale('#2563EB'),
      secondary: generateColorScale('#7C3AED'),
      accent: generateColorScale('#EC4899'),
      neutral: generateColorScale('#6B7280'),
      success: generateColorScale('#16A34A'),
      warning: generateColorScale('#D97706'),
      error: generateColorScale('#DC2626'),
      info: generateColorScale('#0891B2'),
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
    },
    foreground: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6B7280',
    },
    border: {
      default: '#E5E7EB',
      subtle: '#F3F4F6',
      strong: '#D1D5DB',
    },
  },

  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep blue oceanic colors',
    colors: {
      primary: generateColorScale('#0369A1'),
      secondary: generateColorScale('#0891B2'),
      accent: generateColorScale('#14B8A6'),
      neutral: generateColorScale('#64748B'),
      success: generateColorScale('#059669'),
      warning: generateColorScale('#D97706'),
      error: generateColorScale('#E11D48'),
      info: generateColorScale('#0284C7'),
    },
    background: {
      primary: '#0C4A6E',
      secondary: '#075985',
      tertiary: '#0369A1',
    },
    foreground: {
      primary: '#F0F9FF',
      secondary: '#E0F2FE',
      muted: '#BAE6FD',
    },
    border: {
      default: '#0284C7',
      subtle: '#0369A1',
      strong: '#0EA5E9',
    },
  },

  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural greens inspired by forests',
    colors: {
      primary: generateColorScale('#166534'),
      secondary: generateColorScale('#15803D'),
      accent: generateColorScale('#A16207'),
      neutral: generateColorScale('#57534E'),
      success: generateColorScale('#22C55E'),
      warning: generateColorScale('#CA8A04'),
      error: generateColorScale('#B91C1C'),
      info: generateColorScale('#0369A1'),
    },
    background: {
      primary: '#F0FDF4',
      secondary: '#DCFCE7',
      tertiary: '#BBF7D0',
    },
    foreground: {
      primary: '#14532D',
      secondary: '#166534',
      muted: '#4D7C0F',
    },
    border: {
      default: '#86EFAC',
      subtle: '#BBF7D0',
      strong: '#4ADE80',
    },
  },

  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm sunset gradient colors',
    colors: {
      primary: generateColorScale('#EA580C'),
      secondary: generateColorScale('#DC2626'),
      accent: generateColorScale('#DB2777'),
      neutral: generateColorScale('#78716C'),
      success: generateColorScale('#65A30D'),
      warning: generateColorScale('#EAB308'),
      error: generateColorScale('#B91C1C'),
      info: generateColorScale('#0891B2'),
    },
    background: {
      primary: '#FFF7ED',
      secondary: '#FFEDD5',
      tertiary: '#FED7AA',
    },
    foreground: {
      primary: '#7C2D12',
      secondary: '#9A3412',
      muted: '#C2410C',
    },
    border: {
      default: '#FDBA74',
      subtle: '#FED7AA',
      strong: '#FB923C',
    },
  },

  midnight: {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep midnight blues and purples',
    colors: {
      primary: generateColorScale('#4F46E5'),
      secondary: generateColorScale('#7C3AED'),
      accent: generateColorScale('#EC4899'),
      neutral: generateColorScale('#475569'),
      success: generateColorScale('#10B981'),
      warning: generateColorScale('#F59E0B'),
      error: generateColorScale('#EF4444'),
      info: generateColorScale('#06B6D4'),
    },
    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
    },
    foreground: {
      primary: '#F8FAFC',
      secondary: '#E2E8F0',
      muted: '#94A3B8',
    },
    border: {
      default: '#334155',
      subtle: '#1E293B',
      strong: '#475569',
    },
  },

  candy: {
    id: 'candy',
    name: 'Candy',
    description: 'Sweet and playful candy colors',
    colors: {
      primary: generateColorScale('#EC4899'),
      secondary: generateColorScale('#A855F7'),
      accent: generateColorScale('#06B6D4'),
      neutral: generateColorScale('#9CA3AF'),
      success: generateColorScale('#22C55E'),
      warning: generateColorScale('#FBBF24'),
      error: generateColorScale('#EF4444'),
      info: generateColorScale('#3B82F6'),
    },
    background: {
      primary: '#FDF2F8',
      secondary: '#FCE7F3',
      tertiary: '#FBCFE8',
    },
    foreground: {
      primary: '#831843',
      secondary: '#9D174D',
      muted: '#BE185D',
    },
    border: {
      default: '#F9A8D4',
      subtle: '#FBCFE8',
      strong: '#F472B6',
    },
  },

  earth: {
    id: 'earth',
    name: 'Earth',
    description: 'Grounded earthy tones',
    colors: {
      primary: generateColorScale('#92400E'),
      secondary: generateColorScale('#78350F'),
      accent: generateColorScale('#166534'),
      neutral: generateColorScale('#57534E'),
      success: generateColorScale('#15803D'),
      warning: generateColorScale('#A16207'),
      error: generateColorScale('#991B1B'),
      info: generateColorScale('#0E7490'),
    },
    background: {
      primary: '#FAFAF9',
      secondary: '#F5F5F4',
      tertiary: '#E7E5E4',
    },
    foreground: {
      primary: '#292524',
      secondary: '#44403C',
      muted: '#78716C',
    },
    border: {
      default: '#D6D3D1',
      subtle: '#E7E5E4',
      strong: '#A8A29E',
    },
  },

  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Classic black and white with grays',
    colors: {
      primary: generateColorScale('#18181B'),
      secondary: generateColorScale('#27272A'),
      accent: generateColorScale('#3F3F46'),
      neutral: generateColorScale('#71717A'),
      success: generateColorScale('#22C55E'),
      warning: generateColorScale('#EAB308'),
      error: generateColorScale('#EF4444'),
      info: generateColorScale('#3B82F6'),
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#FAFAFA',
      tertiary: '#F4F4F5',
    },
    foreground: {
      primary: '#18181B',
      secondary: '#27272A',
      muted: '#71717A',
    },
    border: {
      default: '#E4E4E7',
      subtle: '#F4F4F5',
      strong: '#D4D4D8',
    },
  },

  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold and energetic colors',
    colors: {
      primary: generateColorScale('#7C3AED'),
      secondary: generateColorScale('#EC4899'),
      accent: generateColorScale('#F97316'),
      neutral: generateColorScale('#6B7280'),
      success: generateColorScale('#10B981'),
      warning: generateColorScale('#F59E0B'),
      error: generateColorScale('#EF4444'),
      info: generateColorScale('#06B6D4'),
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#FAF5FF',
      tertiary: '#F3E8FF',
    },
    foreground: {
      primary: '#4C1D95',
      secondary: '#6D28D9',
      muted: '#A78BFA',
    },
    border: {
      default: '#DDD6FE',
      subtle: '#EDE9FE',
      strong: '#C4B5FD',
    },
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and minimalist design',
    colors: {
      primary: generateColorScale('#0F172A'),
      secondary: generateColorScale('#1E293B'),
      accent: generateColorScale('#0EA5E9'),
      neutral: generateColorScale('#64748B'),
      success: generateColorScale('#22C55E'),
      warning: generateColorScale('#F59E0B'),
      error: generateColorScale('#EF4444'),
      info: generateColorScale('#3B82F6'),
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      tertiary: '#F1F5F9',
    },
    foreground: {
      primary: '#0F172A',
      secondary: '#334155',
      muted: '#64748B',
    },
    border: {
      default: '#E2E8F0',
      subtle: '#F1F5F9',
      strong: '#CBD5E1',
    },
  },

  corporate: {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional business colors',
    colors: {
      primary: generateColorScale('#1E40AF'),
      secondary: generateColorScale('#3730A3'),
      accent: generateColorScale('#0E7490'),
      neutral: generateColorScale('#6B7280'),
      success: generateColorScale('#15803D'),
      warning: generateColorScale('#B45309'),
      error: generateColorScale('#B91C1C'),
      info: generateColorScale('#0369A1'),
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
    },
    foreground: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6B7280',
    },
    border: {
      default: '#E5E7EB',
      subtle: '#F3F4F6',
      strong: '#D1D5DB',
    },
  },

  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic and creative palette',
    colors: {
      primary: generateColorScale('#DB2777'),
      secondary: generateColorScale('#9333EA'),
      accent: generateColorScale('#F97316'),
      neutral: generateColorScale('#78716C'),
      success: generateColorScale('#22C55E'),
      warning: generateColorScale('#EAB308'),
      error: generateColorScale('#DC2626'),
      info: generateColorScale('#0EA5E9'),
    },
    background: {
      primary: '#FFFBEB',
      secondary: '#FEF3C7',
      tertiary: '#FDE68A',
    },
    foreground: {
      primary: '#78350F',
      secondary: '#92400E',
      muted: '#B45309',
    },
    border: {
      default: '#FCD34D',
      subtle: '#FDE68A',
      strong: '#FBBF24',
    },
  },

  tech: {
    id: 'tech',
    name: 'Tech',
    description: 'Modern technology-inspired colors',
    colors: {
      primary: generateColorScale('#06B6D4'),
      secondary: generateColorScale('#8B5CF6'),
      accent: generateColorScale('#10B981'),
      neutral: generateColorScale('#475569'),
      success: generateColorScale('#22C55E'),
      warning: generateColorScale('#F59E0B'),
      error: generateColorScale('#EF4444'),
      info: generateColorScale('#3B82F6'),
    },
    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
    },
    foreground: {
      primary: '#F1F5F9',
      secondary: '#CBD5E1',
      muted: '#94A3B8',
    },
    border: {
      default: '#334155',
      subtle: '#1E293B',
      strong: '#475569',
    },
  },

  nature: {
    id: 'nature',
    name: 'Nature',
    description: 'Natural and organic colors',
    colors: {
      primary: generateColorScale('#059669'),
      secondary: generateColorScale('#0D9488'),
      accent: generateColorScale('#84CC16'),
      neutral: generateColorScale('#57534E'),
      success: generateColorScale('#22C55E'),
      warning: generateColorScale('#CA8A04'),
      error: generateColorScale('#DC2626'),
      info: generateColorScale('#0891B2'),
    },
    background: {
      primary: '#ECFDF5',
      secondary: '#D1FAE5',
      tertiary: '#A7F3D0',
    },
    foreground: {
      primary: '#064E3B',
      secondary: '#065F46',
      muted: '#047857',
    },
    border: {
      default: '#6EE7B7',
      subtle: '#A7F3D0',
      strong: '#34D399',
    },
  },

  luxury: {
    id: 'luxury',
    name: 'Luxury',
    description: 'Sophisticated and luxurious palette',
    colors: {
      primary: generateColorScale('#B8860B'),
      secondary: generateColorScale('#78350F'),
      accent: generateColorScale('#7C3AED'),
      neutral: generateColorScale('#44403C'),
      success: generateColorScale('#15803D'),
      warning: generateColorScale('#A16207'),
      error: generateColorScale('#991B1B'),
      info: generateColorScale('#0E7490'),
    },
    background: {
      primary: '#1C1917',
      secondary: '#292524',
      tertiary: '#44403C',
    },
    foreground: {
      primary: '#FAFAF9',
      secondary: '#E7E5E4',
      muted: '#A8A29E',
    },
    border: {
      default: '#57534E',
      subtle: '#44403C',
      strong: '#78716C',
    },
  },
};

// =============================================================================
// TYPOGRAPHY PRESETS (10 Pre-built)
// =============================================================================

const baseTypographyScale: Omit<TypographyPreset, 'id' | 'name' | 'description' | 'fontFamily'> = {
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};

export const TYPOGRAPHY_PRESETS: Record<string, TypographyPreset> = {
  sans: {
    id: 'sans',
    name: 'Sans',
    description: 'Clean sans-serif typography using Inter',
    fontFamily: {
      heading: 'Inter, ui-sans-serif, system-ui, sans-serif',
      body: 'Inter, ui-sans-serif, system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    ...baseTypographyScale,
  },

  serif: {
    id: 'serif',
    name: 'Serif',
    description: 'Classic serif typography using Georgia',
    fontFamily: {
      heading: 'Georgia, Cambria, "Times New Roman", Times, serif',
      body: 'Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    ...baseTypographyScale,
  },

  mono: {
    id: 'mono',
    name: 'Mono',
    description: 'Technical monospace typography',
    fontFamily: {
      heading: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      body: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    ...baseTypographyScale,
  },

  display: {
    id: 'display',
    name: 'Display',
    description: 'Bold display typography for impact',
    fontFamily: {
      heading: '"Playfair Display", Georgia, serif',
      body: 'Inter, ui-sans-serif, system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    ...baseTypographyScale,
  },

  handwritten: {
    id: 'handwritten',
    name: 'Handwritten',
    description: 'Casual handwritten style',
    fontFamily: {
      heading: '"Caveat", cursive',
      body: '"Nunito", ui-sans-serif, system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    ...baseTypographyScale,
  },

  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary modern typography',
    fontFamily: {
      heading: '"Poppins", ui-sans-serif, system-ui, sans-serif',
      body: '"Open Sans", ui-sans-serif, system-ui, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace',
    },
    ...baseTypographyScale,
  },

  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless classic typography',
    fontFamily: {
      heading: '"Merriweather", Georgia, serif',
      body: '"Source Sans Pro", ui-sans-serif, sans-serif',
      mono: '"Source Code Pro", ui-monospace, monospace',
    },
    ...baseTypographyScale,
  },

  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated elegant typography',
    fontFamily: {
      heading: '"Cormorant Garamond", Georgia, serif',
      body: '"Lato", ui-sans-serif, system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    ...baseTypographyScale,
  },

  bold: {
    id: 'bold',
    name: 'Bold',
    description: 'Strong bold typography for impact',
    fontFamily: {
      heading: '"Oswald", ui-sans-serif, system-ui, sans-serif',
      body: '"Roboto", ui-sans-serif, system-ui, sans-serif',
      mono: '"Roboto Mono", ui-monospace, monospace',
    },
    ...baseTypographyScale,
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean minimal typography',
    fontFamily: {
      heading: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      body: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      mono: '"DM Mono", ui-monospace, monospace',
    },
    ...baseTypographyScale,
  },
};

// =============================================================================
// SPACING PRESETS (4 Pre-built)
// =============================================================================

const baseSpacingScale: SpacingScale = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

function scaleSpacing(base: SpacingScale, factor: number): SpacingScale {
  const scaled: Record<string, string> = {};
  for (const [key, value] of Object.entries(base)) {
    if (value === '0px' || value === '1px') {
      scaled[key] = value;
    } else {
      const numValue = parseFloat(value);
      const unit = value.replace(/[\d.]/g, '');
      scaled[key] = `${(numValue * factor).toFixed(3).replace(/\.?0+$/, '')}${unit}`;
    }
  }
  return scaled as unknown as SpacingScale;
}

export const SPACING_PRESETS: Record<string, SpacingPreset> = {
  compact: {
    id: 'compact',
    name: 'Compact',
    description: 'Tighter spacing for dense layouts',
    scale: scaleSpacing(baseSpacingScale, 0.75),
    baseUnit: 0.75,
  },

  normal: {
    id: 'normal',
    name: 'Normal',
    description: 'Standard Tailwind spacing scale',
    scale: baseSpacingScale,
    baseUnit: 1,
  },

  relaxed: {
    id: 'relaxed',
    name: 'Relaxed',
    description: 'More breathing room between elements',
    scale: scaleSpacing(baseSpacingScale, 1.25),
    baseUnit: 1.25,
  },

  loose: {
    id: 'loose',
    name: 'Loose',
    description: 'Maximum spacing for airy layouts',
    scale: scaleSpacing(baseSpacingScale, 1.5),
    baseUnit: 1.5,
  },
};

// =============================================================================
// BORDER RADIUS PRESETS (5 Pre-built)
// =============================================================================

export const BORDER_RADIUS_PRESETS: Record<string, BorderRadiusPreset> = {
  none: {
    id: 'none',
    name: 'None',
    description: 'Sharp corners with no rounding',
    scale: {
      none: '0px',
      sm: '0px',
      default: '0px',
      md: '0px',
      lg: '0px',
      xl: '0px',
      '2xl': '0px',
      '3xl': '0px',
      full: '0px',
    },
  },

  subtle: {
    id: 'subtle',
    name: 'Subtle',
    description: 'Minimal rounding for subtle softness',
    scale: {
      none: '0px',
      sm: '0.125rem',
      default: '0.1875rem',
      md: '0.25rem',
      lg: '0.375rem',
      xl: '0.5rem',
      '2xl': '0.625rem',
      '3xl': '0.75rem',
      full: '9999px',
    },
  },

  rounded: {
    id: 'rounded',
    name: 'Rounded',
    description: 'Standard Tailwind border radius',
    scale: {
      none: '0px',
      sm: '0.125rem',
      default: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
  },

  pill: {
    id: 'pill',
    name: 'Pill',
    description: 'Maximum rounding for pill shapes',
    scale: {
      none: '0px',
      sm: '0.5rem',
      default: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '2.5rem',
      '3xl': '3rem',
      full: '9999px',
    },
  },

  mixed: {
    id: 'mixed',
    name: 'Mixed',
    description: 'Variable rounding for visual interest',
    scale: {
      none: '0px',
      sm: '0.125rem',
      default: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.25rem',
      '2xl': '1.75rem',
      '3xl': '2.5rem',
      full: '9999px',
    },
  },
};

// =============================================================================
// SHADOW PRESETS (6 Pre-built)
// =============================================================================

export const SHADOW_PRESETS: Record<string, ShadowPreset> = {
  none: {
    id: 'none',
    name: 'None',
    description: 'No shadows for flat design',
    scale: {
      sm: 'none',
      default: 'none',
      md: 'none',
      lg: 'none',
      xl: 'none',
      '2xl': 'none',
      inner: 'none',
      none: 'none',
    },
  },

  subtle: {
    id: 'subtle',
    name: 'Subtle',
    description: 'Barely visible shadows',
    scale: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
      default: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
      md: '0 2px 4px -1px rgb(0 0 0 / 0.06)',
      lg: '0 4px 6px -2px rgb(0 0 0 / 0.05)',
      xl: '0 8px 10px -3px rgb(0 0 0 / 0.04)',
      '2xl': '0 12px 15px -4px rgb(0 0 0 / 0.03)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.03)',
      none: 'none',
    },
  },

  medium: {
    id: 'medium',
    name: 'Medium',
    description: 'Standard shadow depth',
    scale: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      none: 'none',
    },
  },

  heavy: {
    id: 'heavy',
    name: 'Heavy',
    description: 'Deep dramatic shadows',
    scale: {
      sm: '0 2px 4px 0 rgb(0 0 0 / 0.1)',
      default: '0 2px 6px 0 rgb(0 0 0 / 0.15), 0 2px 4px -1px rgb(0 0 0 / 0.15)',
      md: '0 6px 12px -2px rgb(0 0 0 / 0.2), 0 4px 6px -3px rgb(0 0 0 / 0.15)',
      lg: '0 15px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.15)',
      xl: '0 25px 40px -8px rgb(0 0 0 / 0.25), 0 12px 15px -8px rgb(0 0 0 / 0.15)',
      '2xl': '0 35px 60px -15px rgb(0 0 0 / 0.35)',
      inner: 'inset 0 4px 8px 0 rgb(0 0 0 / 0.1)',
      none: 'none',
    },
  },

  glow: {
    id: 'glow',
    name: 'Glow',
    description: 'Soft glowing shadows',
    scale: {
      sm: '0 0 8px 0 rgb(59 130 246 / 0.3)',
      default: '0 0 12px 0 rgb(59 130 246 / 0.35)',
      md: '0 0 20px 0 rgb(59 130 246 / 0.4)',
      lg: '0 0 30px 0 rgb(59 130 246 / 0.45)',
      xl: '0 0 45px 0 rgb(59 130 246 / 0.5)',
      '2xl': '0 0 60px 0 rgb(59 130 246 / 0.55)',
      inner: 'inset 0 0 12px 0 rgb(59 130 246 / 0.2)',
      none: 'none',
    },
  },

  neon: {
    id: 'neon',
    name: 'Neon',
    description: 'Vibrant neon glow effects',
    scale: {
      sm: '0 0 5px 0 rgb(0 255 135 / 0.5), 0 0 10px 0 rgb(0 255 135 / 0.3)',
      default: '0 0 8px 0 rgb(0 255 135 / 0.6), 0 0 15px 0 rgb(0 255 135 / 0.4)',
      md: '0 0 12px 0 rgb(0 255 135 / 0.7), 0 0 25px 0 rgb(0 255 135 / 0.5)',
      lg: '0 0 20px 0 rgb(0 255 135 / 0.8), 0 0 40px 0 rgb(0 255 135 / 0.6)',
      xl: '0 0 30px 0 rgb(0 255 135 / 0.9), 0 0 60px 0 rgb(0 255 135 / 0.7)',
      '2xl': '0 0 45px 0 rgb(0 255 135 / 1), 0 0 90px 0 rgb(0 255 135 / 0.8)',
      inner: 'inset 0 0 15px 0 rgb(0 255 135 / 0.3)',
      none: 'none',
    },
  },
};

// =============================================================================
// ANIMATION PRESETS (6 Pre-built)
// =============================================================================

export const ANIMATION_PRESETS: Record<string, AnimationPreset> = {
  none: {
    id: 'none',
    name: 'None',
    description: 'No animations',
    duration: {
      fastest: '0ms',
      fast: '0ms',
      normal: '0ms',
      slow: '0ms',
      slowest: '0ms',
    },
    timing: {
      linear: 'linear',
      easeIn: 'linear',
      easeOut: 'linear',
      easeInOut: 'linear',
      bounce: 'linear',
      elastic: 'linear',
    },
    keyframes: {},
  },

  subtle: {
    id: 'subtle',
    name: 'Subtle',
    description: 'Barely noticeable transitions',
    duration: {
      fastest: '50ms',
      fast: '100ms',
      normal: '150ms',
      slow: '200ms',
      slowest: '300ms',
    },
    timing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.4, 0, 0.2, 1)',
      elastic: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    keyframes: {
      fadeIn: {
        '0%': 'opacity: 0',
        '100%': 'opacity: 1',
      },
      slideIn: {
        '0%': 'transform: translateY(4px); opacity: 0',
        '100%': 'transform: translateY(0); opacity: 1',
      },
    },
  },

  smooth: {
    id: 'smooth',
    name: 'Smooth',
    description: 'Smooth natural transitions',
    duration: {
      fastest: '100ms',
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slowest: '500ms',
    },
    timing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    keyframes: {
      fadeIn: {
        '0%': 'opacity: 0',
        '100%': 'opacity: 1',
      },
      fadeOut: {
        '0%': 'opacity: 1',
        '100%': 'opacity: 0',
      },
      slideInUp: {
        '0%': 'transform: translateY(10px); opacity: 0',
        '100%': 'transform: translateY(0); opacity: 1',
      },
      slideInDown: {
        '0%': 'transform: translateY(-10px); opacity: 0',
        '100%': 'transform: translateY(0); opacity: 1',
      },
      scaleIn: {
        '0%': 'transform: scale(0.95); opacity: 0',
        '100%': 'transform: scale(1); opacity: 1',
      },
    },
  },

  bouncy: {
    id: 'bouncy',
    name: 'Bouncy',
    description: 'Playful bouncy animations',
    duration: {
      fastest: '150ms',
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      slowest: '700ms',
    },
    timing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
      easeOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    keyframes: {
      bounce: {
        '0%, 100%': 'transform: translateY(0)',
        '50%': 'transform: translateY(-10px)',
      },
      bounceIn: {
        '0%': 'transform: scale(0.3); opacity: 0',
        '50%': 'transform: scale(1.05)',
        '70%': 'transform: scale(0.9)',
        '100%': 'transform: scale(1); opacity: 1',
      },
      jello: {
        '0%, 100%': 'transform: scale3d(1, 1, 1)',
        '30%': 'transform: scale3d(1.25, 0.75, 1)',
        '40%': 'transform: scale3d(0.75, 1.25, 1)',
        '50%': 'transform: scale3d(1.15, 0.85, 1)',
        '65%': 'transform: scale3d(0.95, 1.05, 1)',
        '75%': 'transform: scale3d(1.05, 0.95, 1)',
      },
      pulse: {
        '0%, 100%': 'opacity: 1',
        '50%': 'opacity: 0.5',
      },
    },
  },

  elastic: {
    id: 'elastic',
    name: 'Elastic',
    description: 'Springy elastic animations',
    duration: {
      fastest: '200ms',
      fast: '300ms',
      normal: '400ms',
      slow: '600ms',
      slowest: '800ms',
    },
    timing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
      easeOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      easeInOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    keyframes: {
      elasticIn: {
        '0%': 'transform: scale(0); opacity: 0',
        '55%': 'transform: scale(1.1)',
        '70%': 'transform: scale(0.95)',
        '85%': 'transform: scale(1.02)',
        '100%': 'transform: scale(1); opacity: 1',
      },
      elasticOut: {
        '0%': 'transform: scale(1); opacity: 1',
        '15%': 'transform: scale(1.02)',
        '30%': 'transform: scale(0.95)',
        '45%': 'transform: scale(1.1)',
        '100%': 'transform: scale(0); opacity: 0',
      },
      wobble: {
        '0%': 'transform: translateX(0)',
        '15%': 'transform: translateX(-25px) rotate(-5deg)',
        '30%': 'transform: translateX(20px) rotate(3deg)',
        '45%': 'transform: translateX(-15px) rotate(-3deg)',
        '60%': 'transform: translateX(10px) rotate(2deg)',
        '75%': 'transform: translateX(-5px) rotate(-1deg)',
        '100%': 'transform: translateX(0)',
      },
      swing: {
        '20%': 'transform: rotate(15deg)',
        '40%': 'transform: rotate(-10deg)',
        '60%': 'transform: rotate(5deg)',
        '80%': 'transform: rotate(-5deg)',
        '100%': 'transform: rotate(0)',
      },
    },
  },

  dramatic: {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'Bold dramatic animations',
    duration: {
      fastest: '300ms',
      fast: '500ms',
      normal: '700ms',
      slow: '1000ms',
      slowest: '1500ms',
    },
    timing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
      easeOut: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
      easeInOut: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    keyframes: {
      zoomIn: {
        '0%': 'transform: scale(0); opacity: 0',
        '100%': 'transform: scale(1); opacity: 1',
      },
      zoomOut: {
        '0%': 'transform: scale(1); opacity: 1',
        '100%': 'transform: scale(0); opacity: 0',
      },
      flipIn: {
        '0%': 'transform: perspective(400px) rotateY(90deg); opacity: 0',
        '40%': 'transform: perspective(400px) rotateY(-10deg)',
        '70%': 'transform: perspective(400px) rotateY(10deg)',
        '100%': 'transform: perspective(400px) rotateY(0); opacity: 1',
      },
      rollIn: {
        '0%': 'transform: translateX(-100%) rotate(-120deg); opacity: 0',
        '100%': 'transform: translateX(0) rotate(0); opacity: 1',
      },
      flash: {
        '0%, 50%, 100%': 'opacity: 1',
        '25%, 75%': 'opacity: 0',
      },
    },
  },
};

// =============================================================================
// DEFAULT THEME
// =============================================================================

export const DEFAULT_THEME: Theme = {
  id: 'default',
  name: 'Default Theme',
  description: 'The default Tailwind Builder theme',
  version: '1.0.0',
  colorPalette: COLOR_PALETTES.modern,
  typography: TYPOGRAPHY_PRESETS.sans,
  spacing: SPACING_PRESETS.normal,
  borderRadius: BORDER_RADIUS_PRESETS.rounded,
  shadows: SHADOW_PRESETS.medium,
  animations: ANIMATION_PRESETS.smooth,
  darkMode: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Creates a new theme by merging overrides with a base theme
 */
export function createTheme(baseTheme: Theme, overrides: ThemeOverrides): Theme {
  return {
    ...baseTheme,
    colorPalette: overrides.colorPalette
      ? { ...baseTheme.colorPalette, ...overrides.colorPalette }
      : baseTheme.colorPalette,
    typography: overrides.typography
      ? { ...baseTheme.typography, ...overrides.typography }
      : baseTheme.typography,
    spacing: overrides.spacing
      ? { ...baseTheme.spacing, ...overrides.spacing }
      : baseTheme.spacing,
    borderRadius: overrides.borderRadius
      ? { ...baseTheme.borderRadius, ...overrides.borderRadius }
      : baseTheme.borderRadius,
    shadows: overrides.shadows
      ? { ...baseTheme.shadows, ...overrides.shadows }
      : baseTheme.shadows,
    animations: overrides.animations
      ? { ...baseTheme.animations, ...overrides.animations }
      : baseTheme.animations,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Gets all available palette names
 */
export function getColorPaletteNames(): string[] {
  return Object.keys(COLOR_PALETTES);
}

/**
 * Gets all available typography preset names
 */
export function getTypographyPresetNames(): string[] {
  return Object.keys(TYPOGRAPHY_PRESETS);
}

/**
 * Gets all available spacing preset names
 */
export function getSpacingPresetNames(): string[] {
  return Object.keys(SPACING_PRESETS);
}

/**
 * Gets all available border radius preset names
 */
export function getBorderRadiusPresetNames(): string[] {
  return Object.keys(BORDER_RADIUS_PRESETS);
}

/**
 * Gets all available shadow preset names
 */
export function getShadowPresetNames(): string[] {
  return Object.keys(SHADOW_PRESETS);
}

/**
 * Gets all available animation preset names
 */
export function getAnimationPresetNames(): string[] {
  return Object.keys(ANIMATION_PRESETS);
}

/**
 * Validates a theme object
 */
export function validateTheme(theme: unknown): theme is Theme {
  if (!theme || typeof theme !== 'object') return false;
  const t = theme as Record<string, unknown>;

  return (
    typeof t.id === 'string' &&
    typeof t.name === 'string' &&
    typeof t.colorPalette === 'object' &&
    typeof t.typography === 'object' &&
    typeof t.spacing === 'object' &&
    typeof t.borderRadius === 'object' &&
    typeof t.shadows === 'object' &&
    typeof t.animations === 'object'
  );
}

/**
 * Serializes a theme to JSON string
 */
export function serializeTheme(theme: Theme): string {
  return JSON.stringify(theme, null, 2);
}

/**
 * Deserializes a JSON string to a theme object
 */
export function deserializeTheme(json: string): Theme | null {
  try {
    const parsed = JSON.parse(json);
    if (validateTheme(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Generate a complete color scale from a single hex color
 */
export { generateColorScale };
