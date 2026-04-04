/**
 * Pre-built Color Palettes - Professional color collections for designers
 *
 * Includes Tailwind, Material Design, Open Color, brand colors,
 * nature-inspired palettes, and gradient collections.
 */

import { RGB, hexToRgb } from './colorSystem';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ColorDefinition {
  name: string;
  hex: string;
  rgb: RGB;
}

export interface ColorScale {
  name: string;
  colors: Record<string, ColorDefinition>;
}

export interface BrandColor {
  name: string;
  colors: ColorDefinition[];
}

export interface Gradient {
  name: string;
  colors: string[];
  angle?: number;
  category: 'warm' | 'cool' | 'neutral' | 'vibrant' | 'pastel' | 'dark' | 'nature';
}

export interface PaletteCollection {
  name: string;
  description: string;
  colors: ColorDefinition[];
}

// =============================================================================
// TAILWIND DEFAULT COLORS
// =============================================================================

export const tailwindColors: Record<string, Record<string, string>> = {
  slate: {
    '50': '#f8fafc', '100': '#f1f5f9', '200': '#e2e8f0', '300': '#cbd5e1',
    '400': '#94a3b8', '500': '#64748b', '600': '#475569', '700': '#334155',
    '800': '#1e293b', '900': '#0f172a', '950': '#020617',
  },
  gray: {
    '50': '#f9fafb', '100': '#f3f4f6', '200': '#e5e7eb', '300': '#d1d5db',
    '400': '#9ca3af', '500': '#6b7280', '600': '#4b5563', '700': '#374151',
    '800': '#1f2937', '900': '#111827', '950': '#030712',
  },
  zinc: {
    '50': '#fafafa', '100': '#f4f4f5', '200': '#e4e4e7', '300': '#d4d4d8',
    '400': '#a1a1aa', '500': '#71717a', '600': '#52525b', '700': '#3f3f46',
    '800': '#27272a', '900': '#18181b', '950': '#09090b',
  },
  neutral: {
    '50': '#fafafa', '100': '#f5f5f5', '200': '#e5e5e5', '300': '#d4d4d4',
    '400': '#a3a3a3', '500': '#737373', '600': '#525252', '700': '#404040',
    '800': '#262626', '900': '#171717', '950': '#0a0a0a',
  },
  stone: {
    '50': '#fafaf9', '100': '#f5f5f4', '200': '#e7e5e4', '300': '#d6d3d1',
    '400': '#a8a29e', '500': '#78716c', '600': '#57534e', '700': '#44403c',
    '800': '#292524', '900': '#1c1917', '950': '#0c0a09',
  },
  red: {
    '50': '#fef2f2', '100': '#fee2e2', '200': '#fecaca', '300': '#fca5a5',
    '400': '#f87171', '500': '#ef4444', '600': '#dc2626', '700': '#b91c1c',
    '800': '#991b1b', '900': '#7f1d1d', '950': '#450a0a',
  },
  orange: {
    '50': '#fff7ed', '100': '#ffedd5', '200': '#fed7aa', '300': '#fdba74',
    '400': '#fb923c', '500': '#f97316', '600': '#ea580c', '700': '#c2410c',
    '800': '#9a3412', '900': '#7c2d12', '950': '#431407',
  },
  amber: {
    '50': '#fffbeb', '100': '#fef3c7', '200': '#fde68a', '300': '#fcd34d',
    '400': '#fbbf24', '500': '#f59e0b', '600': '#d97706', '700': '#b45309',
    '800': '#92400e', '900': '#78350f', '950': '#451a03',
  },
  yellow: {
    '50': '#fefce8', '100': '#fef9c3', '200': '#fef08a', '300': '#fde047',
    '400': '#facc15', '500': '#eab308', '600': '#ca8a04', '700': '#a16207',
    '800': '#854d0e', '900': '#713f12', '950': '#422006',
  },
  lime: {
    '50': '#f7fee7', '100': '#ecfccb', '200': '#d9f99d', '300': '#bef264',
    '400': '#a3e635', '500': '#84cc16', '600': '#65a30d', '700': '#4d7c0f',
    '800': '#3f6212', '900': '#365314', '950': '#1a2e05',
  },
  green: {
    '50': '#f0fdf4', '100': '#dcfce7', '200': '#bbf7d0', '300': '#86efac',
    '400': '#4ade80', '500': '#22c55e', '600': '#16a34a', '700': '#15803d',
    '800': '#166534', '900': '#14532d', '950': '#052e16',
  },
  emerald: {
    '50': '#ecfdf5', '100': '#d1fae5', '200': '#a7f3d0', '300': '#6ee7b7',
    '400': '#34d399', '500': '#10b981', '600': '#059669', '700': '#047857',
    '800': '#065f46', '900': '#064e3b', '950': '#022c22',
  },
  teal: {
    '50': '#f0fdfa', '100': '#ccfbf1', '200': '#99f6e4', '300': '#5eead4',
    '400': '#2dd4bf', '500': '#14b8a6', '600': '#0d9488', '700': '#0f766e',
    '800': '#115e59', '900': '#134e4a', '950': '#042f2e',
  },
  cyan: {
    '50': '#ecfeff', '100': '#cffafe', '200': '#a5f3fc', '300': '#67e8f9',
    '400': '#22d3ee', '500': '#06b6d4', '600': '#0891b2', '700': '#0e7490',
    '800': '#155e75', '900': '#164e63', '950': '#083344',
  },
  sky: {
    '50': '#f0f9ff', '100': '#e0f2fe', '200': '#bae6fd', '300': '#7dd3fc',
    '400': '#38bdf8', '500': '#0ea5e9', '600': '#0284c7', '700': '#0369a1',
    '800': '#075985', '900': '#0c4a6e', '950': '#082f49',
  },
  blue: {
    '50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe', '300': '#93c5fd',
    '400': '#60a5fa', '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8',
    '800': '#1e40af', '900': '#1e3a8a', '950': '#172554',
  },
  indigo: {
    '50': '#eef2ff', '100': '#e0e7ff', '200': '#c7d2fe', '300': '#a5b4fc',
    '400': '#818cf8', '500': '#6366f1', '600': '#4f46e5', '700': '#4338ca',
    '800': '#3730a3', '900': '#312e81', '950': '#1e1b4b',
  },
  violet: {
    '50': '#f5f3ff', '100': '#ede9fe', '200': '#ddd6fe', '300': '#c4b5fd',
    '400': '#a78bfa', '500': '#8b5cf6', '600': '#7c3aed', '700': '#6d28d9',
    '800': '#5b21b6', '900': '#4c1d95', '950': '#2e1065',
  },
  purple: {
    '50': '#faf5ff', '100': '#f3e8ff', '200': '#e9d5ff', '300': '#d8b4fe',
    '400': '#c084fc', '500': '#a855f7', '600': '#9333ea', '700': '#7e22ce',
    '800': '#6b21a8', '900': '#581c87', '950': '#3b0764',
  },
  fuchsia: {
    '50': '#fdf4ff', '100': '#fae8ff', '200': '#f5d0fe', '300': '#f0abfc',
    '400': '#e879f9', '500': '#d946ef', '600': '#c026d3', '700': '#a21caf',
    '800': '#86198f', '900': '#701a75', '950': '#4a044e',
  },
  pink: {
    '50': '#fdf2f8', '100': '#fce7f3', '200': '#fbcfe8', '300': '#f9a8d4',
    '400': '#f472b6', '500': '#ec4899', '600': '#db2777', '700': '#be185d',
    '800': '#9d174d', '900': '#831843', '950': '#500724',
  },
  rose: {
    '50': '#fff1f2', '100': '#ffe4e6', '200': '#fecdd3', '300': '#fda4af',
    '400': '#fb7185', '500': '#f43f5e', '600': '#e11d48', '700': '#be123c',
    '800': '#9f1239', '900': '#881337', '950': '#4c0519',
  },
};

// =============================================================================
// MATERIAL DESIGN COLORS
// =============================================================================

export const materialColors: Record<string, Record<string, string>> = {
  red: {
    '50': '#ffebee', '100': '#ffcdd2', '200': '#ef9a9a', '300': '#e57373',
    '400': '#ef5350', '500': '#f44336', '600': '#e53935', '700': '#d32f2f',
    '800': '#c62828', '900': '#b71c1c', 'A100': '#ff8a80', 'A200': '#ff5252',
    'A400': '#ff1744', 'A700': '#d50000',
  },
  pink: {
    '50': '#fce4ec', '100': '#f8bbd0', '200': '#f48fb1', '300': '#f06292',
    '400': '#ec407a', '500': '#e91e63', '600': '#d81b60', '700': '#c2185b',
    '800': '#ad1457', '900': '#880e4f', 'A100': '#ff80ab', 'A200': '#ff4081',
    'A400': '#f50057', 'A700': '#c51162',
  },
  purple: {
    '50': '#f3e5f5', '100': '#e1bee7', '200': '#ce93d8', '300': '#ba68c8',
    '400': '#ab47bc', '500': '#9c27b0', '600': '#8e24aa', '700': '#7b1fa2',
    '800': '#6a1b9a', '900': '#4a148c', 'A100': '#ea80fc', 'A200': '#e040fb',
    'A400': '#d500f9', 'A700': '#aa00ff',
  },
  deepPurple: {
    '50': '#ede7f6', '100': '#d1c4e9', '200': '#b39ddb', '300': '#9575cd',
    '400': '#7e57c2', '500': '#673ab7', '600': '#5e35b1', '700': '#512da8',
    '800': '#4527a0', '900': '#311b92', 'A100': '#b388ff', 'A200': '#7c4dff',
    'A400': '#651fff', 'A700': '#6200ea',
  },
  indigo: {
    '50': '#e8eaf6', '100': '#c5cae9', '200': '#9fa8da', '300': '#7986cb',
    '400': '#5c6bc0', '500': '#3f51b5', '600': '#3949ab', '700': '#303f9f',
    '800': '#283593', '900': '#1a237e', 'A100': '#8c9eff', 'A200': '#536dfe',
    'A400': '#3d5afe', 'A700': '#304ffe',
  },
  blue: {
    '50': '#e3f2fd', '100': '#bbdefb', '200': '#90caf9', '300': '#64b5f6',
    '400': '#42a5f5', '500': '#2196f3', '600': '#1e88e5', '700': '#1976d2',
    '800': '#1565c0', '900': '#0d47a1', 'A100': '#82b1ff', 'A200': '#448aff',
    'A400': '#2979ff', 'A700': '#2962ff',
  },
  lightBlue: {
    '50': '#e1f5fe', '100': '#b3e5fc', '200': '#81d4fa', '300': '#4fc3f7',
    '400': '#29b6f6', '500': '#03a9f4', '600': '#039be5', '700': '#0288d1',
    '800': '#0277bd', '900': '#01579b', 'A100': '#80d8ff', 'A200': '#40c4ff',
    'A400': '#00b0ff', 'A700': '#0091ea',
  },
  cyan: {
    '50': '#e0f7fa', '100': '#b2ebf2', '200': '#80deea', '300': '#4dd0e1',
    '400': '#26c6da', '500': '#00bcd4', '600': '#00acc1', '700': '#0097a7',
    '800': '#00838f', '900': '#006064', 'A100': '#84ffff', 'A200': '#18ffff',
    'A400': '#00e5ff', 'A700': '#00b8d4',
  },
  teal: {
    '50': '#e0f2f1', '100': '#b2dfdb', '200': '#80cbc4', '300': '#4db6ac',
    '400': '#26a69a', '500': '#009688', '600': '#00897b', '700': '#00796b',
    '800': '#00695c', '900': '#004d40', 'A100': '#a7ffeb', 'A200': '#64ffda',
    'A400': '#1de9b6', 'A700': '#00bfa5',
  },
  green: {
    '50': '#e8f5e9', '100': '#c8e6c9', '200': '#a5d6a7', '300': '#81c784',
    '400': '#66bb6a', '500': '#4caf50', '600': '#43a047', '700': '#388e3c',
    '800': '#2e7d32', '900': '#1b5e20', 'A100': '#b9f6ca', 'A200': '#69f0ae',
    'A400': '#00e676', 'A700': '#00c853',
  },
  lightGreen: {
    '50': '#f1f8e9', '100': '#dcedc8', '200': '#c5e1a5', '300': '#aed581',
    '400': '#9ccc65', '500': '#8bc34a', '600': '#7cb342', '700': '#689f38',
    '800': '#558b2f', '900': '#33691e', 'A100': '#ccff90', 'A200': '#b2ff59',
    'A400': '#76ff03', 'A700': '#64dd17',
  },
  lime: {
    '50': '#f9fbe7', '100': '#f0f4c3', '200': '#e6ee9c', '300': '#dce775',
    '400': '#d4e157', '500': '#cddc39', '600': '#c0ca33', '700': '#afb42b',
    '800': '#9e9d24', '900': '#827717', 'A100': '#f4ff81', 'A200': '#eeff41',
    'A400': '#c6ff00', 'A700': '#aeea00',
  },
  yellow: {
    '50': '#fffde7', '100': '#fff9c4', '200': '#fff59d', '300': '#fff176',
    '400': '#ffee58', '500': '#ffeb3b', '600': '#fdd835', '700': '#fbc02d',
    '800': '#f9a825', '900': '#f57f17', 'A100': '#ffff8d', 'A200': '#ffff00',
    'A400': '#ffea00', 'A700': '#ffd600',
  },
  amber: {
    '50': '#fff8e1', '100': '#ffecb3', '200': '#ffe082', '300': '#ffd54f',
    '400': '#ffca28', '500': '#ffc107', '600': '#ffb300', '700': '#ffa000',
    '800': '#ff8f00', '900': '#ff6f00', 'A100': '#ffe57f', 'A200': '#ffd740',
    'A400': '#ffc400', 'A700': '#ffab00',
  },
  orange: {
    '50': '#fff3e0', '100': '#ffe0b2', '200': '#ffcc80', '300': '#ffb74d',
    '400': '#ffa726', '500': '#ff9800', '600': '#fb8c00', '700': '#f57c00',
    '800': '#ef6c00', '900': '#e65100', 'A100': '#ffd180', 'A200': '#ffab40',
    'A400': '#ff9100', 'A700': '#ff6d00',
  },
  deepOrange: {
    '50': '#fbe9e7', '100': '#ffccbc', '200': '#ffab91', '300': '#ff8a65',
    '400': '#ff7043', '500': '#ff5722', '600': '#f4511e', '700': '#e64a19',
    '800': '#d84315', '900': '#bf360c', 'A100': '#ff9e80', 'A200': '#ff6e40',
    'A400': '#ff3d00', 'A700': '#dd2c00',
  },
  brown: {
    '50': '#efebe9', '100': '#d7ccc8', '200': '#bcaaa4', '300': '#a1887f',
    '400': '#8d6e63', '500': '#795548', '600': '#6d4c41', '700': '#5d4037',
    '800': '#4e342e', '900': '#3e2723',
  },
  grey: {
    '50': '#fafafa', '100': '#f5f5f5', '200': '#eeeeee', '300': '#e0e0e0',
    '400': '#bdbdbd', '500': '#9e9e9e', '600': '#757575', '700': '#616161',
    '800': '#424242', '900': '#212121',
  },
  blueGrey: {
    '50': '#eceff1', '100': '#cfd8dc', '200': '#b0bec5', '300': '#90a4ae',
    '400': '#78909c', '500': '#607d8b', '600': '#546e7a', '700': '#455a64',
    '800': '#37474f', '900': '#263238',
  },
};

// =============================================================================
// OPEN COLOR PALETTE
// =============================================================================

export const openColors: Record<string, Record<string, string>> = {
  gray: {
    '0': '#f8f9fa', '1': '#f1f3f5', '2': '#e9ecef', '3': '#dee2e6',
    '4': '#ced4da', '5': '#adb5bd', '6': '#868e96', '7': '#495057',
    '8': '#343a40', '9': '#212529',
  },
  red: {
    '0': '#fff5f5', '1': '#ffe3e3', '2': '#ffc9c9', '3': '#ffa8a8',
    '4': '#ff8787', '5': '#ff6b6b', '6': '#fa5252', '7': '#f03e3e',
    '8': '#e03131', '9': '#c92a2a',
  },
  pink: {
    '0': '#fff0f6', '1': '#ffdeeb', '2': '#fcc2d7', '3': '#faa2c1',
    '4': '#f783ac', '5': '#f06595', '6': '#e64980', '7': '#d6336c',
    '8': '#c2255c', '9': '#a61e4d',
  },
  grape: {
    '0': '#f8f0fc', '1': '#f3d9fa', '2': '#eebefa', '3': '#e599f7',
    '4': '#da77f2', '5': '#cc5de8', '6': '#be4bdb', '7': '#ae3ec9',
    '8': '#9c36b5', '9': '#862e9c',
  },
  violet: {
    '0': '#f3f0ff', '1': '#e5dbff', '2': '#d0bfff', '3': '#b197fc',
    '4': '#9775fa', '5': '#845ef7', '6': '#7950f2', '7': '#7048e8',
    '8': '#6741d9', '9': '#5f3dc4',
  },
  indigo: {
    '0': '#edf2ff', '1': '#dbe4ff', '2': '#bac8ff', '3': '#91a7ff',
    '4': '#748ffc', '5': '#5c7cfa', '6': '#4c6ef5', '7': '#4263eb',
    '8': '#3b5bdb', '9': '#364fc7',
  },
  blue: {
    '0': '#e7f5ff', '1': '#d0ebff', '2': '#a5d8ff', '3': '#74c0fc',
    '4': '#4dabf7', '5': '#339af0', '6': '#228be6', '7': '#1c7ed6',
    '8': '#1971c2', '9': '#1864ab',
  },
  cyan: {
    '0': '#e3fafc', '1': '#c5f6fa', '2': '#99e9f2', '3': '#66d9e8',
    '4': '#3bc9db', '5': '#22b8cf', '6': '#15aabf', '7': '#1098ad',
    '8': '#0c8599', '9': '#0b7285',
  },
  teal: {
    '0': '#e6fcf5', '1': '#c3fae8', '2': '#96f2d7', '3': '#63e6be',
    '4': '#38d9a9', '5': '#20c997', '6': '#12b886', '7': '#0ca678',
    '8': '#099268', '9': '#087f5b',
  },
  green: {
    '0': '#ebfbee', '1': '#d3f9d8', '2': '#b2f2bb', '3': '#8ce99a',
    '4': '#69db7c', '5': '#51cf66', '6': '#40c057', '7': '#37b24d',
    '8': '#2f9e44', '9': '#2b8a3e',
  },
  lime: {
    '0': '#f4fce3', '1': '#e9fac8', '2': '#d8f5a2', '3': '#c0eb75',
    '4': '#a9e34b', '5': '#94d82d', '6': '#82c91e', '7': '#74b816',
    '8': '#66a80f', '9': '#5c940d',
  },
  yellow: {
    '0': '#fff9db', '1': '#fff3bf', '2': '#ffec99', '3': '#ffe066',
    '4': '#ffd43b', '5': '#fcc419', '6': '#fab005', '7': '#f59f00',
    '8': '#f08c00', '9': '#e67700',
  },
  orange: {
    '0': '#fff4e6', '1': '#ffe8cc', '2': '#ffd8a8', '3': '#ffc078',
    '4': '#ffa94d', '5': '#ff922b', '6': '#fd7e14', '7': '#f76707',
    '8': '#e8590c', '9': '#d9480f',
  },
};

// =============================================================================
// FLAT UI COLORS
// =============================================================================

export const flatUIColors: ColorDefinition[] = [
  { name: 'Turquoise', hex: '#1abc9c', rgb: { r: 26, g: 188, b: 156 } },
  { name: 'Green Sea', hex: '#16a085', rgb: { r: 22, g: 160, b: 133 } },
  { name: 'Emerald', hex: '#2ecc71', rgb: { r: 46, g: 204, b: 113 } },
  { name: 'Nephritis', hex: '#27ae60', rgb: { r: 39, g: 174, b: 96 } },
  { name: 'Peter River', hex: '#3498db', rgb: { r: 52, g: 152, b: 219 } },
  { name: 'Belize Hole', hex: '#2980b9', rgb: { r: 41, g: 128, b: 185 } },
  { name: 'Amethyst', hex: '#9b59b6', rgb: { r: 155, g: 89, b: 182 } },
  { name: 'Wisteria', hex: '#8e44ad', rgb: { r: 142, g: 68, b: 173 } },
  { name: 'Wet Asphalt', hex: '#34495e', rgb: { r: 52, g: 73, b: 94 } },
  { name: 'Midnight Blue', hex: '#2c3e50', rgb: { r: 44, g: 62, b: 80 } },
  { name: 'Sunflower', hex: '#f1c40f', rgb: { r: 241, g: 196, b: 15 } },
  { name: 'Orange', hex: '#f39c12', rgb: { r: 243, g: 156, b: 18 } },
  { name: 'Carrot', hex: '#e67e22', rgb: { r: 230, g: 126, b: 34 } },
  { name: 'Pumpkin', hex: '#d35400', rgb: { r: 211, g: 84, b: 0 } },
  { name: 'Alizarin', hex: '#e74c3c', rgb: { r: 231, g: 76, b: 60 } },
  { name: 'Pomegranate', hex: '#c0392b', rgb: { r: 192, g: 57, b: 43 } },
  { name: 'Clouds', hex: '#ecf0f1', rgb: { r: 236, g: 240, b: 241 } },
  { name: 'Silver', hex: '#bdc3c7', rgb: { r: 189, g: 195, b: 199 } },
  { name: 'Concrete', hex: '#95a5a6', rgb: { r: 149, g: 165, b: 166 } },
  { name: 'Asbestos', hex: '#7f8c8d', rgb: { r: 127, g: 140, b: 141 } },
];

// =============================================================================
// SOCIAL MEDIA BRAND COLORS
// =============================================================================

export const socialBrandColors: BrandColor[] = [
  {
    name: 'Facebook',
    colors: [
      { name: 'Primary', hex: '#1877f2', rgb: { r: 24, g: 119, b: 242 } },
      { name: 'Secondary', hex: '#385898', rgb: { r: 56, g: 88, b: 152 } },
      { name: 'Light', hex: '#e7f3ff', rgb: { r: 231, g: 243, b: 255 } },
    ],
  },
  {
    name: 'Twitter / X',
    colors: [
      { name: 'Primary', hex: '#1da1f2', rgb: { r: 29, g: 161, b: 242 } },
      { name: 'Dark', hex: '#14171a', rgb: { r: 20, g: 23, b: 26 } },
      { name: 'Gray', hex: '#657786', rgb: { r: 101, g: 119, b: 134 } },
    ],
  },
  {
    name: 'Instagram',
    colors: [
      { name: 'Purple', hex: '#c13584', rgb: { r: 193, g: 53, b: 132 } },
      { name: 'Pink', hex: '#e1306c', rgb: { r: 225, g: 48, b: 108 } },
      { name: 'Orange', hex: '#fd1d1d', rgb: { r: 253, g: 29, b: 29 } },
      { name: 'Yellow', hex: '#f77737', rgb: { r: 247, g: 119, b: 55 } },
      { name: 'Light Purple', hex: '#833ab4', rgb: { r: 131, g: 58, b: 180 } },
    ],
  },
  {
    name: 'LinkedIn',
    colors: [
      { name: 'Primary', hex: '#0077b5', rgb: { r: 0, g: 119, b: 181 } },
      { name: 'Dark', hex: '#004182', rgb: { r: 0, g: 65, b: 130 } },
      { name: 'Light', hex: '#cfe9f7', rgb: { r: 207, g: 233, b: 247 } },
    ],
  },
  {
    name: 'YouTube',
    colors: [
      { name: 'Red', hex: '#ff0000', rgb: { r: 255, g: 0, b: 0 } },
      { name: 'Dark', hex: '#282828', rgb: { r: 40, g: 40, b: 40 } },
      { name: 'Light', hex: '#ffffff', rgb: { r: 255, g: 255, b: 255 } },
    ],
  },
  {
    name: 'TikTok',
    colors: [
      { name: 'Red', hex: '#fe2c55', rgb: { r: 254, g: 44, b: 85 } },
      { name: 'Cyan', hex: '#25f4ee', rgb: { r: 37, g: 244, b: 238 } },
      { name: 'Black', hex: '#000000', rgb: { r: 0, g: 0, b: 0 } },
    ],
  },
  {
    name: 'Snapchat',
    colors: [
      { name: 'Yellow', hex: '#fffc00', rgb: { r: 255, g: 252, b: 0 } },
      { name: 'Black', hex: '#000000', rgb: { r: 0, g: 0, b: 0 } },
      { name: 'White', hex: '#ffffff', rgb: { r: 255, g: 255, b: 255 } },
    ],
  },
  {
    name: 'Pinterest',
    colors: [
      { name: 'Red', hex: '#e60023', rgb: { r: 230, g: 0, b: 35 } },
      { name: 'Dark', hex: '#bd081c', rgb: { r: 189, g: 8, b: 28 } },
    ],
  },
  {
    name: 'Reddit',
    colors: [
      { name: 'Orange', hex: '#ff4500', rgb: { r: 255, g: 69, b: 0 } },
      { name: 'Dark', hex: '#1a1a1b', rgb: { r: 26, g: 26, b: 27 } },
      { name: 'Light', hex: '#dae0e6', rgb: { r: 218, g: 224, b: 230 } },
    ],
  },
  {
    name: 'Twitch',
    colors: [
      { name: 'Purple', hex: '#9146ff', rgb: { r: 145, g: 70, b: 255 } },
      { name: 'Dark', hex: '#772ce8', rgb: { r: 119, g: 44, b: 232 } },
      { name: 'Ice', hex: '#f0f0ff', rgb: { r: 240, g: 240, b: 255 } },
    ],
  },
  {
    name: 'Discord',
    colors: [
      { name: 'Blurple', hex: '#5865f2', rgb: { r: 88, g: 101, b: 242 } },
      { name: 'Green', hex: '#57f287', rgb: { r: 87, g: 242, b: 135 } },
      { name: 'Yellow', hex: '#fee75c', rgb: { r: 254, g: 231, b: 92 } },
      { name: 'Fuchsia', hex: '#eb459e', rgb: { r: 235, g: 69, b: 158 } },
      { name: 'Red', hex: '#ed4245', rgb: { r: 237, g: 66, b: 69 } },
    ],
  },
  {
    name: 'Spotify',
    colors: [
      { name: 'Green', hex: '#1db954', rgb: { r: 29, g: 185, b: 84 } },
      { name: 'Black', hex: '#191414', rgb: { r: 25, g: 20, b: 20 } },
      { name: 'White', hex: '#ffffff', rgb: { r: 255, g: 255, b: 255 } },
    ],
  },
  {
    name: 'Slack',
    colors: [
      { name: 'Blue', hex: '#36c5f0', rgb: { r: 54, g: 197, b: 240 } },
      { name: 'Green', hex: '#2eb67d', rgb: { r: 46, g: 182, b: 125 } },
      { name: 'Yellow', hex: '#ecb22e', rgb: { r: 236, g: 178, b: 46 } },
      { name: 'Pink', hex: '#e01e5a', rgb: { r: 224, g: 30, b: 90 } },
      { name: 'Purple', hex: '#4a154b', rgb: { r: 74, g: 21, b: 75 } },
    ],
  },
  {
    name: 'WhatsApp',
    colors: [
      { name: 'Green', hex: '#25d366', rgb: { r: 37, g: 211, b: 102 } },
      { name: 'Teal', hex: '#128c7e', rgb: { r: 18, g: 140, b: 126 } },
      { name: 'Light Green', hex: '#dcf8c6', rgb: { r: 220, g: 248, b: 198 } },
    ],
  },
  {
    name: 'GitHub',
    colors: [
      { name: 'Black', hex: '#181717', rgb: { r: 24, g: 23, b: 23 } },
      { name: 'Gray', hex: '#6e7681', rgb: { r: 110, g: 118, b: 129 } },
      { name: 'White', hex: '#ffffff', rgb: { r: 255, g: 255, b: 255 } },
    ],
  },
];

// =============================================================================
// NATURE-INSPIRED PALETTES
// =============================================================================

export const naturePalettes: PaletteCollection[] = [
  {
    name: 'Ocean Depths',
    description: 'Deep sea blues and teals',
    colors: [
      { name: 'Deep Ocean', hex: '#0a1628', rgb: { r: 10, g: 22, b: 40 } },
      { name: 'Midnight Sea', hex: '#0f2847', rgb: { r: 15, g: 40, b: 71 } },
      { name: 'Ocean Blue', hex: '#1e4d6b', rgb: { r: 30, g: 77, b: 107 } },
      { name: 'Teal Water', hex: '#2d7d9a', rgb: { r: 45, g: 125, b: 154 } },
      { name: 'Surface Light', hex: '#5bbcd6', rgb: { r: 91, g: 188, b: 214 } },
    ],
  },
  {
    name: 'Forest Canopy',
    description: 'Lush greens and earth tones',
    colors: [
      { name: 'Dark Bark', hex: '#2d1f11', rgb: { r: 45, g: 31, b: 17 } },
      { name: 'Forest Floor', hex: '#5c4033', rgb: { r: 92, g: 64, b: 51 } },
      { name: 'Moss', hex: '#4a5d23', rgb: { r: 74, g: 93, b: 35 } },
      { name: 'Leaf Green', hex: '#6b8e23', rgb: { r: 107, g: 142, b: 35 } },
      { name: 'Canopy Light', hex: '#9acd32', rgb: { r: 154, g: 205, b: 50 } },
    ],
  },
  {
    name: 'Sunset Blaze',
    description: 'Warm sunset oranges and pinks',
    colors: [
      { name: 'Night Sky', hex: '#2c1654', rgb: { r: 44, g: 22, b: 84 } },
      { name: 'Twilight', hex: '#7b2d5b', rgb: { r: 123, g: 45, b: 91 } },
      { name: 'Sunset Red', hex: '#d4415b', rgb: { r: 212, g: 65, b: 91 } },
      { name: 'Orange Glow', hex: '#f39237', rgb: { r: 243, g: 146, b: 55 } },
      { name: 'Golden Hour', hex: '#ffc107', rgb: { r: 255, g: 193, b: 7 } },
    ],
  },
  {
    name: 'Mountain Mist',
    description: 'Cool grays and slate blues',
    colors: [
      { name: 'Stone', hex: '#4a4a4a', rgb: { r: 74, g: 74, b: 74 } },
      { name: 'Slate', hex: '#6b7b8c', rgb: { r: 107, g: 123, b: 140 } },
      { name: 'Mist', hex: '#9ca8b3', rgb: { r: 156, g: 168, b: 179 } },
      { name: 'Cloud', hex: '#c4cdd4', rgb: { r: 196, g: 205, b: 212 } },
      { name: 'Peak Snow', hex: '#e8ecef', rgb: { r: 232, g: 236, b: 239 } },
    ],
  },
  {
    name: 'Desert Sands',
    description: 'Warm desert tones',
    colors: [
      { name: 'Canyon', hex: '#8b4513', rgb: { r: 139, g: 69, b: 19 } },
      { name: 'Terracotta', hex: '#cd5c5c', rgb: { r: 205, g: 92, b: 92 } },
      { name: 'Sand', hex: '#d4a574', rgb: { r: 212, g: 165, b: 116 } },
      { name: 'Dune', hex: '#e8c8a4', rgb: { r: 232, g: 200, b: 164 } },
      { name: 'Sandstorm', hex: '#f5e6d3', rgb: { r: 245, g: 230, b: 211 } },
    ],
  },
  {
    name: 'Northern Lights',
    description: 'Aurora borealis colors',
    colors: [
      { name: 'Night', hex: '#0d1b2a', rgb: { r: 13, g: 27, b: 42 } },
      { name: 'Deep Blue', hex: '#1b3a4b', rgb: { r: 27, g: 58, b: 75 } },
      { name: 'Aurora Green', hex: '#2ecc71', rgb: { r: 46, g: 204, b: 113 } },
      { name: 'Aurora Teal', hex: '#00d4aa', rgb: { r: 0, g: 212, b: 170 } },
      { name: 'Aurora Purple', hex: '#9b59b6', rgb: { r: 155, g: 89, b: 182 } },
    ],
  },
  {
    name: 'Cherry Blossom',
    description: 'Delicate pink sakura tones',
    colors: [
      { name: 'Bark', hex: '#4a3728', rgb: { r: 74, g: 55, b: 40 } },
      { name: 'Deep Pink', hex: '#c71585', rgb: { r: 199, g: 21, b: 133 } },
      { name: 'Petal Pink', hex: '#f8b4d9', rgb: { r: 248, g: 180, b: 217 } },
      { name: 'Sakura', hex: '#ffd1dc', rgb: { r: 255, g: 209, b: 220 } },
      { name: 'Blossom White', hex: '#fff5f8', rgb: { r: 255, g: 245, b: 248 } },
    ],
  },
  {
    name: 'Tropical Paradise',
    description: 'Vibrant tropical colors',
    colors: [
      { name: 'Deep Jungle', hex: '#004b49', rgb: { r: 0, g: 75, b: 73 } },
      { name: 'Palm Green', hex: '#228b22', rgb: { r: 34, g: 139, b: 34 } },
      { name: 'Hibiscus', hex: '#ff6b6b', rgb: { r: 255, g: 107, b: 107 } },
      { name: 'Mango', hex: '#ff9f43', rgb: { r: 255, g: 159, b: 67 } },
      { name: 'Lagoon', hex: '#00cec9', rgb: { r: 0, g: 206, b: 201 } },
    ],
  },
];

// =============================================================================
// SEASONAL PALETTES
// =============================================================================

export const seasonalPalettes: PaletteCollection[] = [
  {
    name: 'Spring Bloom',
    description: 'Fresh spring colors',
    colors: [
      { name: 'Fresh Grass', hex: '#7cb518', rgb: { r: 124, g: 181, b: 24 } },
      { name: 'Daffodil', hex: '#fff44f', rgb: { r: 255, g: 244, b: 79 } },
      { name: 'Robin Egg', hex: '#96deda', rgb: { r: 150, g: 222, b: 218 } },
      { name: 'Tulip Pink', hex: '#ff6b9d', rgb: { r: 255, g: 107, b: 157 } },
      { name: 'Lilac', hex: '#c8a4d4', rgb: { r: 200, g: 164, b: 212 } },
    ],
  },
  {
    name: 'Summer Heat',
    description: 'Hot summer vibes',
    colors: [
      { name: 'Ocean Wave', hex: '#0077b6', rgb: { r: 0, g: 119, b: 182 } },
      { name: 'Sunshine', hex: '#ffd60a', rgb: { r: 255, g: 214, b: 10 } },
      { name: 'Watermelon', hex: '#ff6b6b', rgb: { r: 255, g: 107, b: 107 } },
      { name: 'Beach Sand', hex: '#f4d35e', rgb: { r: 244, g: 211, b: 94 } },
      { name: 'Coral Reef', hex: '#ff7f50', rgb: { r: 255, g: 127, b: 80 } },
    ],
  },
  {
    name: 'Autumn Harvest',
    description: 'Rich fall colors',
    colors: [
      { name: 'Pumpkin', hex: '#d35400', rgb: { r: 211, g: 84, b: 0 } },
      { name: 'Maple Red', hex: '#c0392b', rgb: { r: 192, g: 57, b: 43 } },
      { name: 'Harvest Gold', hex: '#daa520', rgb: { r: 218, g: 165, b: 32 } },
      { name: 'Russet', hex: '#80461b', rgb: { r: 128, g: 70, b: 27 } },
      { name: 'Burgundy', hex: '#722f37', rgb: { r: 114, g: 47, b: 55 } },
    ],
  },
  {
    name: 'Winter Frost',
    description: 'Cold winter tones',
    colors: [
      { name: 'Midnight', hex: '#191970', rgb: { r: 25, g: 25, b: 112 } },
      { name: 'Ice Blue', hex: '#a5f3fc', rgb: { r: 165, g: 243, b: 252 } },
      { name: 'Snow', hex: '#fffafa', rgb: { r: 255, g: 250, b: 250 } },
      { name: 'Silver', hex: '#c0c0c0', rgb: { r: 192, g: 192, b: 192 } },
      { name: 'Evergreen', hex: '#2f4f4f', rgb: { r: 47, g: 79, b: 79 } },
    ],
  },
];

// =============================================================================
// GRADIENT COLLECTIONS (100+)
// =============================================================================

export const gradientCollections: Gradient[] = [
  // Warm Gradients
  { name: 'Sunset', colors: ['#ff512f', '#dd2476'], category: 'warm' },
  { name: 'Orange Coral', colors: ['#ff9a9e', '#fecfef'], category: 'warm' },
  { name: 'Warm Flame', colors: ['#ff9a9e', '#fad0c4'], category: 'warm' },
  { name: 'Juicy Peach', colors: ['#ffecd2', '#fcb69f'], category: 'warm' },
  { name: 'Young Passion', colors: ['#ff8177', '#ff867a', '#ff8c7f', '#f99185', '#cf556c', '#b12a5b'], category: 'warm' },
  { name: 'Sunny Morning', colors: ['#f6d365', '#fda085'], category: 'warm' },
  { name: 'Summer', colors: ['#22c1c3', '#fdbb2d'], category: 'warm' },
  { name: 'Burning Orange', colors: ['#ff416c', '#ff4b2b'], category: 'warm' },
  { name: 'Citrus Peel', colors: ['#fdc830', '#f37335'], category: 'warm' },
  { name: 'Sin City Red', colors: ['#ed213a', '#93291e'], category: 'warm' },
  { name: 'Sublime Light', colors: ['#fc5c7d', '#6a82fb'], category: 'warm' },
  { name: 'Red Sunset', colors: ['#355c7d', '#6c5b7b', '#c06c84'], category: 'warm' },
  { name: 'Bloody Mary', colors: ['#ff512f', '#dd2476'], category: 'warm' },
  { name: 'Aubergine', colors: ['#aa076b', '#61045f'], category: 'warm' },
  { name: 'Flare', colors: ['#f12711', '#f5af19'], category: 'warm' },

  // Cool Gradients
  { name: 'Cool Blues', colors: ['#2193b0', '#6dd5ed'], category: 'cool' },
  { name: 'Moonlit Asteroid', colors: ['#0f2027', '#203a43', '#2c5364'], category: 'cool' },
  { name: 'Endless River', colors: ['#43cea2', '#185a9d'], category: 'cool' },
  { name: 'Frozen', colors: ['#403b4a', '#e7e9bb'], category: 'cool' },
  { name: 'Blue Lagoon', colors: ['#43c6ac', '#191654'], category: 'cool' },
  { name: 'Deep Sea Space', colors: ['#2c3e50', '#4ca1af'], category: 'cool' },
  { name: 'Turquoise Flow', colors: ['#136a8a', '#267871'], category: 'cool' },
  { name: 'Royal Blue', colors: ['#536976', '#292e49'], category: 'cool' },
  { name: 'Aqua Marine', colors: ['#1a2980', '#26d0ce'], category: 'cool' },
  { name: 'Frost', colors: ['#000428', '#004e92'], category: 'cool' },
  { name: 'Cool Sky', colors: ['#2980b9', '#6dd5fa', '#ffffff'], category: 'cool' },
  { name: 'Winter Neva', colors: ['#a1c4fd', '#c2e9fb'], category: 'cool' },
  { name: 'Maldives', colors: ['#b2fefa', '#0ed2f7'], category: 'cool' },
  { name: 'Sea Blue', colors: ['#2b5876', '#4e4376'], category: 'cool' },
  { name: 'Celestial', colors: ['#c33764', '#1d2671'], category: 'cool' },

  // Vibrant Gradients
  { name: 'Radar', colors: ['#a770ef', '#cf8bf3', '#fdb99b'], category: 'vibrant' },
  { name: 'Vice City', colors: ['#3494e6', '#ec6ead'], category: 'vibrant' },
  { name: 'Bupe', colors: ['#00416a', '#e4e5e6'], category: 'vibrant' },
  { name: 'Atlas', colors: ['#feac5e', '#c779d0', '#4bc0c8'], category: 'vibrant' },
  { name: 'Retro', colors: ['#3f2b96', '#a8c0ff'], category: 'vibrant' },
  { name: 'Purpink', colors: ['#7f00ff', '#e100ff'], category: 'vibrant' },
  { name: 'Electric Violet', colors: ['#4776e6', '#8e54e9'], category: 'vibrant' },
  { name: 'Candy', colors: ['#d3959b', '#bfe6ba'], category: 'vibrant' },
  { name: 'Rainbow Blue', colors: ['#00f260', '#0575e6'], category: 'vibrant' },
  { name: 'Cosmic Fusion', colors: ['#ff00cc', '#333399'], category: 'vibrant' },
  { name: 'Instagram', colors: ['#833ab4', '#fd1d1d', '#fcb045'], category: 'vibrant' },
  { name: 'Flickr', colors: ['#ff0084', '#33001b'], category: 'vibrant' },
  { name: 'Vine', colors: ['#00bf8f', '#001510'], category: 'vibrant' },
  { name: 'Predawn', colors: ['#ffa17f', '#00223e'], category: 'vibrant' },
  { name: 'Purple Love', colors: ['#cc2b5e', '#753a88'], category: 'vibrant' },

  // Pastel Gradients
  { name: 'Soft Pink', colors: ['#f5f7fa', '#c3cfe2'], category: 'pastel' },
  { name: 'Peach', colors: ['#ffecd2', '#fcb69f'], category: 'pastel' },
  { name: 'Tender Spring', colors: ['#fa709a', '#fee140'], category: 'pastel' },
  { name: 'Morpheus Den', colors: ['#30cfd0', '#330867'], category: 'pastel' },
  { name: 'Light Purple', colors: ['#f3e7e9', '#e3eeff'], category: 'pastel' },
  { name: 'Soft Grass', colors: ['#c1dfc4', '#deecdd'], category: 'pastel' },
  { name: 'Premium White', colors: ['#d5d4d0', '#d5d4d0', '#eeeeec', '#efeeec', '#e9e9e7'], category: 'pastel' },
  { name: 'Rose Water', colors: ['#e55d87', '#5fc3e4'], category: 'pastel' },
  { name: 'Kye Meh', colors: ['#8360c3', '#2ebf91'], category: 'pastel' },
  { name: 'Sweet Morning', colors: ['#ff5f6d', '#ffc371'], category: 'pastel' },
  { name: 'Amin', colors: ['#8e2de2', '#4a00e0'], category: 'pastel' },
  { name: 'Amethyst', colors: ['#9d50bb', '#6e48aa'], category: 'pastel' },
  { name: 'Cheer Up', colors: ['#556270', '#ff6b6b'], category: 'pastel' },
  { name: 'Lush', colors: ['#56ab2f', '#a8e063'], category: 'pastel' },
  { name: 'Dawn', colors: ['#f3904f', '#3b4371'], category: 'pastel' },

  // Dark Gradients
  { name: 'Dark Ocean', colors: ['#373b44', '#4286f4'], category: 'dark' },
  { name: 'Witching Hour', colors: ['#c31432', '#240b36'], category: 'dark' },
  { name: 'Dark Knight', colors: ['#ba8b02', '#181818'], category: 'dark' },
  { name: 'Dark Purple', colors: ['#1a0530', '#3d1a5c'], category: 'dark' },
  { name: 'Shadow Night', colors: ['#000000', '#434343'], category: 'dark' },
  { name: 'Deep Space', colors: ['#000000', '#434343'], category: 'dark' },
  { name: 'Midnight City', colors: ['#232526', '#414345'], category: 'dark' },
  { name: 'Metal', colors: ['#302b63', '#24243e'], category: 'dark' },
  { name: 'Firewatch', colors: ['#cb2d3e', '#ef473a'], category: 'dark' },
  { name: 'Sunset Dark', colors: ['#0b486b', '#f56217'], category: 'dark' },
  { name: 'Netflix', colors: ['#8e0e00', '#1f1c18'], category: 'dark' },
  { name: 'Night Owl', colors: ['#3c1053', '#ad5389'], category: 'dark' },
  { name: 'Purplin', colors: ['#6a3093', '#a044ff'], category: 'dark' },
  { name: 'Dark Skies', colors: ['#4b79a1', '#283e51'], category: 'dark' },
  { name: 'Crimson Tide', colors: ['#642b73', '#c6426e'], category: 'dark' },

  // Nature Gradients
  { name: 'Forest', colors: ['#5a3f37', '#2c7744'], category: 'nature' },
  { name: 'Moss', colors: ['#134e5e', '#71b280'], category: 'nature' },
  { name: 'Shore', colors: ['#70e1f5', '#ffd194'], category: 'nature' },
  { name: 'Earth', colors: ['#649173', '#dbd5a4'], category: 'nature' },
  { name: 'Sea Blizz', colors: ['#1cd8d2', '#93edc7'], category: 'nature' },
  { name: 'Sand to Blue', colors: ['#3e5151', '#decba4'], category: 'nature' },
  { name: 'Emerald Water', colors: ['#348f50', '#56b4d3'], category: 'nature' },
  { name: 'Lemon Twist', colors: ['#3ca55c', '#b5ac49'], category: 'nature' },
  { name: 'Green Beach', colors: ['#02aab0', '#00cdac'], category: 'nature' },
  { name: 'Deep Teal', colors: ['#085078', '#85d8ce'], category: 'nature' },
  { name: 'Venice Blue', colors: ['#085078', '#85d8ce'], category: 'nature' },
  { name: 'Aqua Splash', colors: ['#13547a', '#80d0c7'], category: 'nature' },
  { name: 'Shifty', colors: ['#636363', '#a2ab58'], category: 'nature' },
  { name: 'Opa', colors: ['#3d7eaa', '#ffe47a'], category: 'nature' },
  { name: 'Virgin America', colors: ['#7b4397', '#dc2430'], category: 'nature' },

  // Neutral Gradients
  { name: 'Titanium', colors: ['#283048', '#859398'], category: 'neutral' },
  { name: 'Grey', colors: ['#bdc3c7', '#2c3e50'], category: 'neutral' },
  { name: 'Winter', colors: ['#e6dada', '#274046'], category: 'neutral' },
  { name: 'Ash', colors: ['#606c88', '#3f4c6b'], category: 'neutral' },
  { name: 'Back to Earth', colors: ['#00c9ff', '#92fe9d'], category: 'neutral' },
  { name: 'Clean Mirror', colors: ['#93a5cf', '#e4efe9'], category: 'neutral' },
  { name: 'Premium Dark', colors: ['#434343', '#000000'], category: 'neutral' },
  { name: 'Silver Lake', colors: ['#acb6e5', '#86fde8'], category: 'neutral' },
  { name: 'Slate', colors: ['#536976', '#292e49'], category: 'neutral' },
  { name: 'Army', colors: ['#414d0b', '#727a17'], category: 'neutral' },
  { name: 'Miaka', colors: ['#fc354c', '#0abfbc'], category: 'neutral' },
  { name: 'Ash Grey', colors: ['#e2e2e2', '#c9d6ff'], category: 'neutral' },
  { name: 'Steel Grey', colors: ['#1f1c2c', '#928dab'], category: 'neutral' },
  { name: 'Zinc', colors: ['#ada996', '#f2f2f2', '#dbdbdb', '#eaeaea'], category: 'neutral' },
  { name: 'Light Grey', colors: ['#a8a9ad', '#d4d4d4'], category: 'neutral' },

  // Additional Gradients
  { name: 'Vanusa', colors: ['#da4453', '#89216b'], category: 'vibrant' },
  { name: 'Orca', colors: ['#44a08d', '#093637'], category: 'nature' },
  { name: 'Stellar', colors: ['#7474bf', '#348ac7'], category: 'cool' },
  { name: 'Piglet', colors: ['#ee9ca7', '#ffdde1'], category: 'pastel' },
  { name: 'Lizard', colors: ['#304352', '#d7d2cc'], category: 'neutral' },
  { name: 'Sage', colors: ['#b8daa0', '#9dc183'], category: 'nature' },
  { name: 'Mantle', colors: ['#24c6dc', '#514a9d'], category: 'cool' },
  { name: 'Disco', colors: ['#4ecdc4', '#556270'], category: 'vibrant' },
  { name: 'Dusk', colors: ['#2c3e50', '#fd746c'], category: 'warm' },
  { name: 'Nimvelo', colors: ['#314755', '#26a0da'], category: 'cool' },
  { name: 'Hazel', colors: ['#77a1d3', '#79cbca', '#e684ae'], category: 'pastel' },
  { name: 'Noon to Dusk', colors: ['#ff6e7f', '#bfe9ff'], category: 'warm' },
  { name: 'YouTube', colors: ['#e52d27', '#b31217'], category: 'vibrant' },
  { name: 'Cool Brown', colors: ['#603813', '#b29f94'], category: 'neutral' },
  { name: 'Harmonic Energy', colors: ['#16a085', '#f4d03f'], category: 'vibrant' },
  { name: 'Playing with Reds', colors: ['#d31027', '#ea384d'], category: 'warm' },
  { name: 'Dirty Fog', colors: ['#b993d6', '#8ca6db'], category: 'pastel' },
  { name: 'Grade Grey', colors: ['#bdc3c7', '#2c3e50'], category: 'neutral' },
  { name: 'Love Couple', colors: ['#3a6186', '#89253e'], category: 'dark' },
  { name: 'Kashmir', colors: ['#614385', '#516395'], category: 'cool' },
  { name: 'Poncho', colors: ['#403a3e', '#be5869'], category: 'warm' },
  { name: 'Relaxing Red', colors: ['#fffbd5', '#b20a2c'], category: 'warm' },
  { name: 'Lawrencium', colors: ['#0f0c29', '#302b63', '#24243e'], category: 'dark' },
  { name: 'Ohhappiness', colors: ['#00b09b', '#96c93d'], category: 'nature' },
  { name: 'Delicate', colors: ['#d3cce3', '#e9e4f0'], category: 'pastel' },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all colors from a Tailwind color scale
 */
export function getTailwindScale(colorName: string): ColorDefinition[] {
  const scale = tailwindColors[colorName];
  if (!scale) return [];

  return Object.entries(scale).map(([shade, hex]) => ({
    name: `${colorName}-${shade}`,
    hex,
    rgb: hexToRgb(hex) || { r: 0, g: 0, b: 0 },
  }));
}

/**
 * Get all colors from a Material Design color scale
 */
export function getMaterialScale(colorName: string): ColorDefinition[] {
  const scale = materialColors[colorName];
  if (!scale) return [];

  return Object.entries(scale).map(([shade, hex]) => ({
    name: `${colorName}-${shade}`,
    hex,
    rgb: hexToRgb(hex) || { r: 0, g: 0, b: 0 },
  }));
}

/**
 * Search for gradients by category or name
 */
export function searchGradients(
  query: string,
  category?: Gradient['category']
): Gradient[] {
  const normalizedQuery = query.toLowerCase();

  return gradientCollections.filter(gradient => {
    const matchesQuery = gradient.name.toLowerCase().includes(normalizedQuery);
    const matchesCategory = !category || gradient.category === category;
    return matchesQuery && matchesCategory;
  });
}

/**
 * Get all colors from social brand by name
 */
export function getSocialBrandColors(brandName: string): ColorDefinition[] | null {
  const brand = socialBrandColors.find(
    b => b.name.toLowerCase() === brandName.toLowerCase()
  );
  return brand?.colors || null;
}

/**
 * Get random gradient from collection
 */
export function getRandomGradient(category?: Gradient['category']): Gradient {
  const filtered = category
    ? gradientCollections.filter(g => g.category === category)
    : gradientCollections;

  return filtered[Math.floor(Math.random() * filtered.length)];
}

/**
 * Generate CSS gradient from gradient definition
 */
export function generateGradientCSS(
  gradient: Gradient,
  direction: string = '90deg'
): string {
  const colorStops = gradient.colors.join(', ');
  return `linear-gradient(${direction}, ${colorStops})`;
}

/**
 * Get all palettes as a flat list
 */
export function getAllPalettes(): PaletteCollection[] {
  return [...naturePalettes, ...seasonalPalettes];
}

/**
 * Convert any hex color map to ColorDefinition array
 */
export function hexMapToColorDefinitions(
  hexMap: Record<string, string>,
  prefix: string = ''
): ColorDefinition[] {
  return Object.entries(hexMap).map(([name, hex]) => ({
    name: prefix ? `${prefix}-${name}` : name,
    hex,
    rgb: hexToRgb(hex) || { r: 0, g: 0, b: 0 },
  }));
}
