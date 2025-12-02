// Tailwind class helpers and presets

export const widthOptions = [
  { label: 'Auto', value: 'w-auto' },
  { label: 'Full', value: 'w-full' },
  { label: '1/2', value: 'w-1/2' },
  { label: '1/3', value: 'w-1/3' },
  { label: '2/3', value: 'w-2/3' },
  { label: '1/4', value: 'w-1/4' },
  { label: '3/4', value: 'w-3/4' },
  { label: 'Screen', value: 'w-screen' },
  { label: 'Max Content', value: 'w-max' },
  { label: 'Min Content', value: 'w-min' },
  { label: 'Fit Content', value: 'w-fit' },
];

export const heightOptions = [
  { label: 'Auto', value: 'h-auto' },
  { label: 'Full', value: 'h-full' },
  { label: 'Screen', value: 'h-screen' },
  { label: '1/2', value: 'h-1/2' },
  { label: '1/3', value: 'h-1/3' },
  { label: '2/3', value: 'h-2/3' },
  { label: 'Max Content', value: 'h-max' },
  { label: 'Min Content', value: 'h-min' },
  { label: 'Fit Content', value: 'h-fit' },
];

export const paddingOptions = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '8', value: '8' },
  { label: '10', value: '10' },
  { label: '12', value: '12' },
  { label: '16', value: '16' },
  { label: '20', value: '20' },
];

export const marginOptions = paddingOptions;

export const gapOptions = [
  { label: '0', value: 'gap-0' },
  { label: '1', value: 'gap-1' },
  { label: '2', value: 'gap-2' },
  { label: '3', value: 'gap-3' },
  { label: '4', value: 'gap-4' },
  { label: '5', value: 'gap-5' },
  { label: '6', value: 'gap-6' },
  { label: '8', value: 'gap-8' },
  { label: '10', value: 'gap-10' },
  { label: '12', value: 'gap-12' },
];

export const displayOptions = [
  { label: 'Block', value: 'block' },
  { label: 'Inline Block', value: 'inline-block' },
  { label: 'Inline', value: 'inline' },
  { label: 'Flex', value: 'flex' },
  { label: 'Inline Flex', value: 'inline-flex' },
  { label: 'Grid', value: 'grid' },
  { label: 'Hidden', value: 'hidden' },
];

export const flexDirectionOptions = [
  { label: 'Row', value: 'flex-row' },
  { label: 'Row Reverse', value: 'flex-row-reverse' },
  { label: 'Column', value: 'flex-col' },
  { label: 'Column Reverse', value: 'flex-col-reverse' },
];

export const justifyOptions = [
  { label: 'Start', value: 'justify-start' },
  { label: 'Center', value: 'justify-center' },
  { label: 'End', value: 'justify-end' },
  { label: 'Between', value: 'justify-between' },
  { label: 'Around', value: 'justify-around' },
  { label: 'Evenly', value: 'justify-evenly' },
];

export const alignOptions = [
  { label: 'Start', value: 'items-start' },
  { label: 'Center', value: 'items-center' },
  { label: 'End', value: 'items-end' },
  { label: 'Baseline', value: 'items-baseline' },
  { label: 'Stretch', value: 'items-stretch' },
];

export const fontSizeOptions = [
  { label: 'XS', value: 'text-xs' },
  { label: 'SM', value: 'text-sm' },
  { label: 'Base', value: 'text-base' },
  { label: 'LG', value: 'text-lg' },
  { label: 'XL', value: 'text-xl' },
  { label: '2XL', value: 'text-2xl' },
  { label: '3XL', value: 'text-3xl' },
  { label: '4XL', value: 'text-4xl' },
  { label: '5XL', value: 'text-5xl' },
  { label: '6XL', value: 'text-6xl' },
];

export const fontWeightOptions = [
  { label: 'Thin', value: 'font-thin' },
  { label: 'Light', value: 'font-light' },
  { label: 'Normal', value: 'font-normal' },
  { label: 'Medium', value: 'font-medium' },
  { label: 'Semibold', value: 'font-semibold' },
  { label: 'Bold', value: 'font-bold' },
  { label: 'Extrabold', value: 'font-extrabold' },
];

export const textAlignOptions = [
  { label: 'Left', value: 'text-left' },
  { label: 'Center', value: 'text-center' },
  { label: 'Right', value: 'text-right' },
  { label: 'Justify', value: 'text-justify' },
];

export const borderRadiusOptions = [
  { label: 'None', value: 'rounded-none' },
  { label: 'SM', value: 'rounded-sm' },
  { label: 'Default', value: 'rounded' },
  { label: 'MD', value: 'rounded-md' },
  { label: 'LG', value: 'rounded-lg' },
  { label: 'XL', value: 'rounded-xl' },
  { label: '2XL', value: 'rounded-2xl' },
  { label: '3XL', value: 'rounded-3xl' },
  { label: 'Full', value: 'rounded-full' },
];

export const shadowOptions = [
  { label: 'None', value: 'shadow-none' },
  { label: 'SM', value: 'shadow-sm' },
  { label: 'Default', value: 'shadow' },
  { label: 'MD', value: 'shadow-md' },
  { label: 'LG', value: 'shadow-lg' },
  { label: 'XL', value: 'shadow-xl' },
  { label: '2XL', value: 'shadow-2xl' },
];

export const borderWidthOptions = [
  { label: '0', value: 'border-0' },
  { label: '1', value: 'border' },
  { label: '2', value: 'border-2' },
  { label: '4', value: 'border-4' },
  { label: '8', value: 'border-8' },
];

export const opacityOptions = [
  { label: '0%', value: 'opacity-0' },
  { label: '25%', value: 'opacity-25' },
  { label: '50%', value: 'opacity-50' },
  { label: '75%', value: 'opacity-75' },
  { label: '100%', value: 'opacity-100' },
];

// Color palette for the builder
export const colorPalette = {
  gray: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  red: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  orange: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  amber: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  yellow: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  lime: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  green: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  emerald: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  teal: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  cyan: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  sky: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  blue: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  indigo: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  violet: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  purple: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  fuchsia: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  pink: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  rose: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  slate: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  zinc: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  neutral: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  stone: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
};

export const specialColors = ['white', 'black', 'transparent'];

// Grid column options
export const gridColsOptions = [
  { label: '1', value: 'grid-cols-1' },
  { label: '2', value: 'grid-cols-2' },
  { label: '3', value: 'grid-cols-3' },
  { label: '4', value: 'grid-cols-4' },
  { label: '5', value: 'grid-cols-5' },
  { label: '6', value: 'grid-cols-6' },
  { label: '12', value: 'grid-cols-12' },
];

// Helper function to build class string
export function buildClassString(styles: Record<string, string[]>): string {
  return Object.values(styles).flat().filter(Boolean).join(' ');
}

// Helper to parse Tailwind class to category
export function classifyTailwindClass(className: string): string {
  if (className.startsWith('w-') || className.startsWith('h-') || className.startsWith('max-') || className.startsWith('min-')) {
    return 'layout';
  }
  if (className.startsWith('p-') || className.startsWith('m-') || className.startsWith('gap-') || className.startsWith('space-')) {
    return 'spacing';
  }
  if (className.startsWith('text-') || className.startsWith('font-') || className.startsWith('leading-') || className.startsWith('tracking-')) {
    return 'typography';
  }
  if (className.startsWith('bg-') || className.includes('text-') && (className.includes('gray') || className.includes('blue'))) {
    return 'colors';
  }
  if (className.startsWith('border') || className.startsWith('rounded')) {
    return 'borders';
  }
  if (className.startsWith('shadow') || className.startsWith('opacity')) {
    return 'effects';
  }
  return 'layout';
}
