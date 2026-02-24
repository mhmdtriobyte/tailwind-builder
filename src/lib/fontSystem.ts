// Typography System
// Google Fonts integration, system fonts, custom fonts, and font pairing suggestions

// =============================================================================
// TYPES
// =============================================================================

export type FontCategory = 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type FontStyle = 'normal' | 'italic';
export type FontDisplay = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';

export interface FontVariant {
  weight: FontWeight;
  style: FontStyle;
}

export interface GoogleFont {
  family: string;
  category: FontCategory;
  variants: FontVariant[];
  subsets: string[];
  version: string;
  lastModified: string;
  popularity?: number;
  trending?: boolean;
}

export interface FontPairing {
  id: string;
  name: string;
  description: string;
  heading: string;
  body: string;
  accent?: string;
  tags: string[];
}

export interface FontLoadOptions {
  weights: FontWeight[];
  styles: FontStyle[];
  subsets: string[];
  display: FontDisplay;
  preconnect: boolean;
}

export interface SystemFontStack {
  id: string;
  name: string;
  stack: string;
  category: FontCategory;
  description: string;
}

export interface CustomFont {
  family: string;
  src: string;
  format: 'woff2' | 'woff' | 'ttf' | 'otf' | 'eot';
  weight: FontWeight;
  style: FontStyle;
  display: FontDisplay;
  unicodeRange?: string;
}

export interface VariableFont {
  family: string;
  src: string;
  weightRange: [number, number];
  italicRange?: [number, number];
  widthRange?: [number, number];
  slantRange?: [number, number];
  display: FontDisplay;
}

// =============================================================================
// SYSTEM FONT STACKS
// =============================================================================

export const SYSTEM_FONT_STACKS: SystemFontStack[] = [
  {
    id: 'system-ui',
    name: 'System UI',
    stack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    category: 'sans-serif',
    description: 'Native system font for each platform',
  },
  {
    id: 'sans-serif',
    name: 'Sans Serif',
    stack: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    category: 'sans-serif',
    description: 'Clean, modern sans-serif stack',
  },
  {
    id: 'serif',
    name: 'Serif',
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    category: 'serif',
    description: 'Classic serif font stack',
  },
  {
    id: 'monospace',
    name: 'Monospace',
    stack: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    category: 'monospace',
    description: 'Monospace fonts for code',
  },
  {
    id: 'cursive',
    name: 'Cursive',
    stack: '"Brush Script MT", cursive',
    category: 'handwriting',
    description: 'Decorative cursive fonts',
  },
  {
    id: 'emoji',
    name: 'Emoji',
    stack: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    category: 'sans-serif',
    description: 'Emoji font stack',
  },
  {
    id: 'transitional',
    name: 'Transitional',
    stack: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif',
    category: 'serif',
    description: 'Transitional serif fonts',
  },
  {
    id: 'old-style',
    name: 'Old Style',
    stack: '"Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, serif',
    category: 'serif',
    description: 'Old-style serif fonts',
  },
  {
    id: 'humanist',
    name: 'Humanist',
    stack: 'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif',
    category: 'sans-serif',
    description: 'Humanist sans-serif fonts',
  },
  {
    id: 'geometric',
    name: 'Geometric Humanist',
    stack: 'Avenir, Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif',
    category: 'sans-serif',
    description: 'Geometric humanist sans-serif',
  },
  {
    id: 'neo-grotesque',
    name: 'Neo-Grotesque',
    stack: 'Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif',
    category: 'sans-serif',
    description: 'Neo-grotesque sans-serif fonts',
  },
  {
    id: 'industrial',
    name: 'Industrial',
    stack: 'Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Nimbus Sans Narrow", sans-serif-condensed, sans-serif',
    category: 'sans-serif',
    description: 'Industrial sans-serif fonts',
  },
  {
    id: 'rounded',
    name: 'Rounded Sans',
    stack: 'ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT", "Arial Rounded MT Bold", Calibri, source-sans-pro, sans-serif',
    category: 'sans-serif',
    description: 'Rounded sans-serif fonts',
  },
  {
    id: 'slab-serif',
    name: 'Slab Serif',
    stack: 'Rockwell, "Rockwell Nova", "Roboto Slab", "DejaVu Serif", "Sitka Small", serif',
    category: 'serif',
    description: 'Slab serif fonts',
  },
  {
    id: 'antique',
    name: 'Antique',
    stack: 'Superclarendon, "Bookman Old Style", "URW Bookman", "URW Bookman L", "Georgia Pro", Georgia, serif',
    category: 'serif',
    description: 'Antique style fonts',
  },
  {
    id: 'didone',
    name: 'Didone',
    stack: 'Didot, "Bodoni MT", "Noto Serif Display", "URW Palladio L", P052, Sylfaen, serif',
    category: 'serif',
    description: 'Didone/Modern serif fonts',
  },
  {
    id: 'handwritten',
    name: 'Handwritten',
    stack: '"Segoe Print", "Bradley Hand", Chilanka, TSCu_Comic, casual, cursive',
    category: 'handwriting',
    description: 'Handwritten style fonts',
  },
];

// =============================================================================
// POPULAR GOOGLE FONTS (Top 100+)
// =============================================================================

export const POPULAR_GOOGLE_FONTS: GoogleFont[] = [
  { family: 'Roboto', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 100, style: 'italic' }, { weight: 300, style: 'normal' }, { weight: 300, style: 'italic' }, { weight: 400, style: 'normal' }, { weight: 400, style: 'italic' }, { weight: 500, style: 'normal' }, { weight: 500, style: 'italic' }, { weight: 700, style: 'normal' }, { weight: 700, style: 'italic' }, { weight: 900, style: 'normal' }, { weight: 900, style: 'italic' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'], version: 'v30', lastModified: '2024-01-01', popularity: 1 },
  { family: 'Open Sans', category: 'sans-serif', variants: [{ weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'], version: 'v40', lastModified: '2024-01-01', popularity: 2 },
  { family: 'Lato', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext'], version: 'v24', lastModified: '2024-01-01', popularity: 3 },
  { family: 'Montserrat', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'], version: 'v26', lastModified: '2024-01-01', popularity: 4 },
  { family: 'Poppins', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'devanagari'], version: 'v20', lastModified: '2024-01-01', popularity: 5 },
  { family: 'Inter', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'], version: 'v13', lastModified: '2024-01-01', popularity: 6, trending: true },
  { family: 'Roboto Condensed', category: 'sans-serif', variants: [{ weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'], version: 'v27', lastModified: '2024-01-01', popularity: 7 },
  { family: 'Oswald', category: 'sans-serif', variants: [{ weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'], version: 'v53', lastModified: '2024-01-01', popularity: 8 },
  { family: 'Raleway', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'], version: 'v29', lastModified: '2024-01-01', popularity: 9 },
  { family: 'Nunito', category: 'sans-serif', variants: [{ weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'], version: 'v26', lastModified: '2024-01-01', popularity: 10 },
  { family: 'Playfair Display', category: 'serif', variants: [{ weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'], version: 'v36', lastModified: '2024-01-01', popularity: 11 },
  { family: 'Merriweather', category: 'serif', variants: [{ weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'], version: 'v30', lastModified: '2024-01-01', popularity: 12 },
  { family: 'Source Sans Pro', category: 'sans-serif', variants: [{ weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'], version: 'v22', lastModified: '2024-01-01', popularity: 13 },
  { family: 'Ubuntu', category: 'sans-serif', variants: [{ weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek'], version: 'v20', lastModified: '2024-01-01', popularity: 14 },
  { family: 'Roboto Mono', category: 'monospace', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'], version: 'v23', lastModified: '2024-01-01', popularity: 15 },
  { family: 'Nunito Sans', category: 'sans-serif', variants: [{ weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'], version: 'v15', lastModified: '2024-01-01', popularity: 16 },
  { family: 'Work Sans', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'vietnamese'], version: 'v19', lastModified: '2024-01-01', popularity: 17 },
  { family: 'Roboto Slab', category: 'serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'], version: 'v28', lastModified: '2024-01-01', popularity: 18 },
  { family: 'Fira Sans', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'], version: 'v17', lastModified: '2024-01-01', popularity: 19 },
  { family: 'Quicksand', category: 'sans-serif', variants: [{ weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'vietnamese'], version: 'v31', lastModified: '2024-01-01', popularity: 20 },
  { family: 'Barlow', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'vietnamese'], version: 'v12', lastModified: '2024-01-01', popularity: 21 },
  { family: 'Libre Franklin', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'vietnamese'], version: 'v14', lastModified: '2024-01-01', popularity: 22 },
  { family: 'DM Sans', category: 'sans-serif', variants: [{ weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext'], version: 'v14', lastModified: '2024-01-01', popularity: 23, trending: true },
  { family: 'Space Grotesk', category: 'sans-serif', variants: [{ weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'vietnamese'], version: 'v16', lastModified: '2024-01-01', popularity: 24, trending: true },
  { family: 'JetBrains Mono', category: 'monospace', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'], version: 'v18', lastModified: '2024-01-01', popularity: 25, trending: true },
  { family: 'Manrope', category: 'sans-serif', variants: [{ weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'], version: 'v15', lastModified: '2024-01-01', popularity: 26, trending: true },
  { family: 'Lexend', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'vietnamese'], version: 'v19', lastModified: '2024-01-01', popularity: 27, trending: true },
  { family: 'Source Code Pro', category: 'monospace', variants: [{ weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'], version: 'v23', lastModified: '2024-01-01', popularity: 28 },
  { family: 'Lora', category: 'serif', variants: [{ weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'], version: 'v32', lastModified: '2024-01-01', popularity: 29 },
  { family: 'PT Sans', category: 'sans-serif', variants: [{ weight: 400, style: 'normal' }, { weight: 400, style: 'italic' }, { weight: 700, style: 'normal' }, { weight: 700, style: 'italic' }], subsets: ['latin', 'latin-ext', 'cyrillic'], version: 'v17', lastModified: '2024-01-01', popularity: 30 },
  { family: 'Libre Baskerville', category: 'serif', variants: [{ weight: 400, style: 'normal' }, { weight: 400, style: 'italic' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext'], version: 'v14', lastModified: '2024-01-01', popularity: 31 },
  { family: 'Crimson Text', category: 'serif', variants: [{ weight: 400, style: 'normal' }, { weight: 400, style: 'italic' }, { weight: 600, style: 'normal' }, { weight: 600, style: 'italic' }, { weight: 700, style: 'normal' }, { weight: 700, style: 'italic' }], subsets: ['latin', 'latin-ext', 'vietnamese'], version: 'v19', lastModified: '2024-01-01', popularity: 32 },
  { family: 'Source Serif Pro', category: 'serif', variants: [{ weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'], version: 'v15', lastModified: '2024-01-01', popularity: 33 },
  { family: 'Dancing Script', category: 'handwriting', variants: [{ weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'vietnamese'], version: 'v25', lastModified: '2024-01-01', popularity: 34 },
  { family: 'Pacifico', category: 'handwriting', variants: [{ weight: 400, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'], version: 'v22', lastModified: '2024-01-01', popularity: 35 },
  { family: 'Abril Fatface', category: 'display', variants: [{ weight: 400, style: 'normal' }], subsets: ['latin', 'latin-ext'], version: 'v23', lastModified: '2024-01-01', popularity: 36 },
  { family: 'Bebas Neue', category: 'display', variants: [{ weight: 400, style: 'normal' }], subsets: ['latin', 'latin-ext'], version: 'v14', lastModified: '2024-01-01', popularity: 37 },
  { family: 'Anton', category: 'sans-serif', variants: [{ weight: 400, style: 'normal' }], subsets: ['latin', 'latin-ext', 'vietnamese'], version: 'v25', lastModified: '2024-01-01', popularity: 38 },
  { family: 'Archivo', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'vietnamese'], version: 'v19', lastModified: '2024-01-01', popularity: 39 },
  { family: 'Karla', category: 'sans-serif', variants: [{ weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }], subsets: ['latin', 'latin-ext'], version: 'v31', lastModified: '2024-01-01', popularity: 40 },
  { family: 'Cabin', category: 'sans-serif', variants: [{ weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'vietnamese'], version: 'v27', lastModified: '2024-01-01', popularity: 41 },
  { family: 'Heebo', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'hebrew'], version: 'v22', lastModified: '2024-01-01', popularity: 42 },
  { family: 'Mulish', category: 'sans-serif', variants: [{ weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'], version: 'v13', lastModified: '2024-01-01', popularity: 43 },
  { family: 'Josefin Sans', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'vietnamese'], version: 'v26', lastModified: '2024-01-01', popularity: 44 },
  { family: 'Cormorant Garamond', category: 'serif', variants: [{ weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'], version: 'v16', lastModified: '2024-01-01', popularity: 45 },
  { family: 'Bitter', category: 'serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'], version: 'v33', lastModified: '2024-01-01', popularity: 46 },
  { family: 'Fira Code', category: 'monospace', variants: [{ weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek'], version: 'v22', lastModified: '2024-01-01', popularity: 47, trending: true },
  { family: 'IBM Plex Sans', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'], version: 'v19', lastModified: '2024-01-01', popularity: 48 },
  { family: 'IBM Plex Mono', category: 'monospace', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }], subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'], version: 'v19', lastModified: '2024-01-01', popularity: 49 },
  { family: 'Outfit', category: 'sans-serif', variants: [{ weight: 100, style: 'normal' }, { weight: 200, style: 'normal' }, { weight: 300, style: 'normal' }, { weight: 400, style: 'normal' }, { weight: 500, style: 'normal' }, { weight: 600, style: 'normal' }, { weight: 700, style: 'normal' }, { weight: 800, style: 'normal' }, { weight: 900, style: 'normal' }], subsets: ['latin', 'latin-ext'], version: 'v11', lastModified: '2024-01-01', popularity: 50, trending: true },
];

// =============================================================================
// FONT PAIRINGS
// =============================================================================

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: 'modern-clean',
    name: 'Modern & Clean',
    description: 'Perfect for tech and SaaS websites',
    heading: 'Inter',
    body: 'Inter',
    tags: ['minimal', 'tech', 'saas', 'modern'],
  },
  {
    id: 'professional-corporate',
    name: 'Professional Corporate',
    description: 'Ideal for business and corporate sites',
    heading: 'Montserrat',
    body: 'Open Sans',
    tags: ['corporate', 'business', 'professional'],
  },
  {
    id: 'elegant-editorial',
    name: 'Elegant Editorial',
    description: 'Great for blogs and magazines',
    heading: 'Playfair Display',
    body: 'Lora',
    accent: 'Dancing Script',
    tags: ['editorial', 'blog', 'elegant', 'magazine'],
  },
  {
    id: 'startup-fresh',
    name: 'Startup Fresh',
    description: 'Modern look for startups',
    heading: 'Poppins',
    body: 'Nunito',
    tags: ['startup', 'fresh', 'friendly', 'modern'],
  },
  {
    id: 'developer-focused',
    name: 'Developer Focused',
    description: 'Perfect for developer tools and docs',
    heading: 'Space Grotesk',
    body: 'Inter',
    accent: 'JetBrains Mono',
    tags: ['developer', 'tech', 'documentation'],
  },
  {
    id: 'luxury-premium',
    name: 'Luxury Premium',
    description: 'For high-end brands and products',
    heading: 'Cormorant Garamond',
    body: 'Raleway',
    tags: ['luxury', 'premium', 'fashion', 'elegant'],
  },
  {
    id: 'creative-agency',
    name: 'Creative Agency',
    description: 'Bold and creative aesthetic',
    heading: 'Bebas Neue',
    body: 'DM Sans',
    tags: ['creative', 'agency', 'bold', 'design'],
  },
  {
    id: 'friendly-approachable',
    name: 'Friendly & Approachable',
    description: 'Warm and inviting for community sites',
    heading: 'Quicksand',
    body: 'Nunito Sans',
    tags: ['friendly', 'community', 'approachable'],
  },
  {
    id: 'classic-timeless',
    name: 'Classic Timeless',
    description: 'Traditional and trustworthy feel',
    heading: 'Merriweather',
    body: 'Source Sans Pro',
    tags: ['classic', 'traditional', 'trustworthy'],
  },
  {
    id: 'geometric-modern',
    name: 'Geometric Modern',
    description: 'Clean geometric design',
    heading: 'Manrope',
    body: 'Lexend',
    tags: ['geometric', 'modern', 'clean'],
  },
  {
    id: 'news-publication',
    name: 'News Publication',
    description: 'For news sites and publications',
    heading: 'Libre Baskerville',
    body: 'Source Serif Pro',
    accent: 'Roboto Mono',
    tags: ['news', 'publication', 'journalism'],
  },
  {
    id: 'app-interface',
    name: 'App Interface',
    description: 'Clean UI for applications',
    heading: 'Roboto',
    body: 'Roboto',
    accent: 'Roboto Mono',
    tags: ['app', 'interface', 'ui', 'clean'],
  },
];

// =============================================================================
// FONT LOADING UTILITIES
// =============================================================================

const DEFAULT_LOAD_OPTIONS: FontLoadOptions = {
  weights: [400, 500, 600, 700],
  styles: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  preconnect: true,
};

/**
 * Generate Google Fonts URL for a single font
 */
export function generateGoogleFontURL(
  family: string,
  options: Partial<FontLoadOptions> = {}
): string {
  const opts = { ...DEFAULT_LOAD_OPTIONS, ...options };
  const encodedFamily = encodeURIComponent(family);

  const weightParams = opts.weights
    .flatMap(w => opts.styles.map(s => (s === 'italic' ? `1,${w}` : `0,${w}`)))
    .sort()
    .join(';');

  const subsetParam = opts.subsets.length > 0
    ? `&subset=${opts.subsets.join(',')}`
    : '';

  return `https://fonts.googleapis.com/css2?family=${encodedFamily}:ital,wght@${weightParams}&display=${opts.display}${subsetParam}`;
}

/**
 * Generate Google Fonts URL for multiple fonts
 */
export function generateGoogleFontsURL(
  fonts: Array<{ family: string; options?: Partial<FontLoadOptions> }>,
  globalOptions: Partial<FontLoadOptions> = {}
): string {
  const baseURL = 'https://fonts.googleapis.com/css2';
  const params: string[] = [];

  for (const { family, options } of fonts) {
    const opts = { ...DEFAULT_LOAD_OPTIONS, ...globalOptions, ...options };
    const encodedFamily = encodeURIComponent(family);

    const weightParams = opts.weights
      .flatMap(w => opts.styles.map(s => (s === 'italic' ? `1,${w}` : `0,${w}`)))
      .sort()
      .join(';');

    params.push(`family=${encodedFamily}:ital,wght@${weightParams}`);
  }

  const display = globalOptions.display || 'swap';
  return `${baseURL}?${params.join('&')}&display=${display}`;
}

/**
 * Generate preconnect links for Google Fonts
 */
export function generatePreconnectLinks(): string {
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;
}

/**
 * Generate complete HTML for loading Google Fonts
 */
export function generateGoogleFontsHTML(
  fonts: Array<{ family: string; options?: Partial<FontLoadOptions> }>,
  options: Partial<FontLoadOptions> = {}
): string {
  const preconnect = options.preconnect !== false ? generatePreconnectLinks() + '\n' : '';
  const fontURL = generateGoogleFontsURL(fonts, options);
  return `${preconnect}<link href="${fontURL}" rel="stylesheet">`;
}

/**
 * Generate @font-face CSS for a custom font
 */
export function generateFontFaceCSS(font: CustomFont): string {
  const formatMap = {
    woff2: 'woff2',
    woff: 'woff',
    ttf: 'truetype',
    otf: 'opentype',
    eot: 'embedded-opentype',
  };

  const unicodeRange = font.unicodeRange
    ? `\n  unicode-range: ${font.unicodeRange};`
    : '';

  return `@font-face {
  font-family: '${font.family}';
  src: url('${font.src}') format('${formatMap[font.format]}');
  font-weight: ${font.weight};
  font-style: ${font.style};
  font-display: ${font.display};${unicodeRange}
}`;
}

/**
 * Generate @font-face CSS for a variable font
 */
export function generateVariableFontFaceCSS(font: VariableFont): string {
  const weightRange = `${font.weightRange[0]} ${font.weightRange[1]}`;

  const fontVariationSettings: string[] = [];
  if (font.widthRange) {
    fontVariationSettings.push(`'wdth' ${font.widthRange[0]}`);
  }

  return `@font-face {
  font-family: '${font.family}';
  src: url('${font.src}') format('woff2-variations');
  font-weight: ${weightRange};
  font-style: ${font.italicRange ? 'oblique' : 'normal'};
  font-display: ${font.display};
}`;
}

// =============================================================================
// FONT SUBSET OPTIMIZATION
// =============================================================================

export const COMMON_SUBSETS = [
  'latin',
  'latin-ext',
  'cyrillic',
  'cyrillic-ext',
  'greek',
  'greek-ext',
  'vietnamese',
  'arabic',
  'hebrew',
  'thai',
  'korean',
  'japanese',
  'chinese-simplified',
  'chinese-traditional',
] as const;

export type FontSubset = typeof COMMON_SUBSETS[number];

/**
 * Get recommended subsets based on language codes
 */
export function getSubsetsForLanguages(languages: string[]): FontSubset[] {
  const languageToSubset: Record<string, FontSubset[]> = {
    en: ['latin'],
    es: ['latin', 'latin-ext'],
    fr: ['latin', 'latin-ext'],
    de: ['latin', 'latin-ext'],
    it: ['latin', 'latin-ext'],
    pt: ['latin', 'latin-ext'],
    ru: ['cyrillic'],
    uk: ['cyrillic', 'cyrillic-ext'],
    el: ['greek'],
    vi: ['vietnamese'],
    ar: ['arabic'],
    he: ['hebrew'],
    th: ['thai'],
    ko: ['korean'],
    ja: ['japanese'],
    'zh-cn': ['chinese-simplified'],
    'zh-tw': ['chinese-traditional'],
  };

  const subsets = new Set<FontSubset>();
  subsets.add('latin'); // Always include latin

  for (const lang of languages) {
    const langSubsets = languageToSubset[lang.toLowerCase()];
    if (langSubsets) {
      langSubsets.forEach(s => subsets.add(s));
    }
  }

  return Array.from(subsets);
}

// =============================================================================
// FONT DISPLAY STRATEGIES
// =============================================================================

export const FONT_DISPLAY_STRATEGIES: Record<FontDisplay, { description: string; useCase: string }> = {
  auto: {
    description: 'Browser default behavior',
    useCase: 'When you want the browser to decide',
  },
  block: {
    description: 'Short block period, infinite swap period',
    useCase: 'When text must be in the correct font',
  },
  swap: {
    description: 'Very short block period, infinite swap period',
    useCase: 'Most common choice - shows text immediately with fallback',
  },
  fallback: {
    description: 'Very short block period, short swap period',
    useCase: 'Balance between text visibility and font loading',
  },
  optional: {
    description: 'Very short block period, no swap period',
    useCase: 'For decorative fonts or slow connections',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Search fonts by query
 */
export function searchFonts(query: string, category?: FontCategory): GoogleFont[] {
  const normalizedQuery = query.toLowerCase().trim();

  return POPULAR_GOOGLE_FONTS.filter(font => {
    const matchesQuery = font.family.toLowerCase().includes(normalizedQuery);
    const matchesCategory = !category || font.category === category;
    return matchesQuery && matchesCategory;
  });
}

/**
 * Get fonts by category
 */
export function getFontsByCategory(category: FontCategory): GoogleFont[] {
  return POPULAR_GOOGLE_FONTS.filter(font => font.category === category);
}

/**
 * Get trending fonts
 */
export function getTrendingFonts(): GoogleFont[] {
  return POPULAR_GOOGLE_FONTS.filter(font => font.trending);
}

/**
 * Get font pairings by tag
 */
export function getPairingsByTag(tag: string): FontPairing[] {
  return FONT_PAIRINGS.filter(pairing =>
    pairing.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

/**
 * Get a font by family name
 */
export function getFont(family: string): GoogleFont | undefined {
  return POPULAR_GOOGLE_FONTS.find(
    font => font.family.toLowerCase() === family.toLowerCase()
  );
}

/**
 * Get system font stack by ID
 */
export function getSystemFontStack(id: string): SystemFontStack | undefined {
  return SYSTEM_FONT_STACKS.find(stack => stack.id === id);
}

/**
 * Generate CSS variable for a font family
 */
export function generateFontCSSVariable(name: string, fontFamily: string, fallback?: string): string {
  const fallbackStack = fallback || SYSTEM_FONT_STACKS.find(s => s.id === 'system-ui')?.stack || 'sans-serif';
  return `--font-${name}: '${fontFamily}', ${fallbackStack};`;
}
