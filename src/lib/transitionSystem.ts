/**
 * Transition System Library
 *
 * Complete transition presets and utilities for the Tailwind Builder.
 * All transitions are pure CSS for optimal performance.
 *
 * Categories:
 * - Hover transitions (scale, lift, glow, color-shift, underline, etc.)
 * - Click/active transitions
 * - Focus transitions
 * - State transitions (loading, success, error)
 * - Page transitions
 * - Component mount/unmount transitions
 * - Custom timing function generator
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Transition category types */
export type TransitionCategory =
  | 'hover'
  | 'active'
  | 'focus'
  | 'state'
  | 'page'
  | 'mount';

/** Transition property types */
export type TransitionProperty =
  | 'all'
  | 'none'
  | 'colors'
  | 'opacity'
  | 'shadow'
  | 'transform'
  | 'background'
  | 'border'
  | 'width'
  | 'height'
  | 'spacing'
  | 'filter'
  | 'backdrop-filter'
  | 'custom';

/** Transition timing function */
export type TransitionTiming =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'cubic-bezier';

/** Transition duration preset */
export type TransitionDuration = 75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000;

/** Transition delay preset */
export type TransitionDelay = 0 | 75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000;

/** State types */
export type StateType = 'idle' | 'loading' | 'success' | 'error' | 'disabled';

/** Transition definition */
export interface TransitionDefinition {
  id: string;
  name: string;
  category: TransitionCategory;
  description: string;
  properties: string[];
  duration: number;
  timing: string;
  delay: number;
  baseStyles: Record<string, string>;
  hoverStyles?: Record<string, string>;
  activeStyles?: Record<string, string>;
  focusStyles?: Record<string, string>;
  tailwindBase: string[];
  tailwindHover?: string[];
  tailwindActive?: string[];
  tailwindFocus?: string[];
  cssTransition: string;
}

/** Transition configuration */
export interface TransitionConfig {
  transitionId: string;
  duration: number;
  delay: number;
  timing: string;
  properties: string[];
}

/** State transition definition */
export interface StateTransitionDefinition {
  id: string;
  name: string;
  description: string;
  states: Record<StateType, Record<string, string>>;
  transitionProperties: string[];
  duration: number;
  timing: string;
  tailwindStates: Record<StateType, string[]>;
}

/** Page transition definition */
export interface PageTransitionDefinition {
  id: string;
  name: string;
  description: string;
  enterStyles: {
    from: Record<string, string>;
    to: Record<string, string>;
  };
  exitStyles: {
    from: Record<string, string>;
    to: Record<string, string>;
  };
  duration: number;
  timing: string;
}

/** Mount transition definition */
export interface MountTransitionDefinition {
  id: string;
  name: string;
  description: string;
  mountStyles: {
    initial: Record<string, string>;
    animate: Record<string, string>;
  };
  unmountStyles: {
    initial: Record<string, string>;
    animate: Record<string, string>;
  };
  duration: number;
  timing: string;
}

/** Generated CSS output */
export interface GeneratedTransitionCSS {
  base: string;
  hover: string;
  active: string;
  focus: string;
  tailwindClasses: string[];
}

// ============================================================================
// TRANSITION PROPERTY MAPPINGS
// ============================================================================

export const TRANSITION_PROPERTIES: Record<TransitionProperty, string> = {
  all: 'all',
  none: 'none',
  colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
  opacity: 'opacity',
  shadow: 'box-shadow',
  transform: 'transform',
  background: 'background-color, background-position, background-size',
  border: 'border-color, border-width, border-radius',
  width: 'width, max-width, min-width',
  height: 'height, max-height, min-height',
  spacing: 'margin, padding, gap',
  filter: 'filter',
  'backdrop-filter': 'backdrop-filter',
  custom: '',
};

export const TAILWIND_TRANSITION_CLASSES: Record<TransitionProperty, string> = {
  all: 'transition-all',
  none: 'transition-none',
  colors: 'transition-colors',
  opacity: 'transition-opacity',
  shadow: 'transition-shadow',
  transform: 'transition-transform',
  background: 'transition-colors',
  border: 'transition-colors',
  width: 'transition-all',
  height: 'transition-all',
  spacing: 'transition-all',
  filter: 'transition-all',
  'backdrop-filter': 'transition-all',
  custom: 'transition',
};

// ============================================================================
// TIMING FUNCTIONS
// ============================================================================

export const TIMING_FUNCTIONS = {
  linear: 'linear',
  ease: 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  // Additional custom timing functions
  'ease-in-sine': 'cubic-bezier(0.47, 0, 0.745, 0.715)',
  'ease-out-sine': 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  'ease-in-out-sine': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
  'ease-in-quad': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  'ease-out-quad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'ease-in-out-quad': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  'ease-in-cubic': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  'ease-out-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  'ease-in-back': 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.2)',
  bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
};

export const TAILWIND_TIMING_CLASSES: Record<string, string> = {
  linear: 'ease-linear',
  ease: 'ease-out',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
};

// ============================================================================
// DURATION OPTIONS
// ============================================================================

export const DURATION_OPTIONS = [
  { label: '75ms', value: 75, tailwind: 'duration-75' },
  { label: '100ms', value: 100, tailwind: 'duration-100' },
  { label: '150ms', value: 150, tailwind: 'duration-150' },
  { label: '200ms', value: 200, tailwind: 'duration-200' },
  { label: '300ms', value: 300, tailwind: 'duration-300' },
  { label: '500ms', value: 500, tailwind: 'duration-500' },
  { label: '700ms', value: 700, tailwind: 'duration-700' },
  { label: '1000ms', value: 1000, tailwind: 'duration-1000' },
];

export const DELAY_OPTIONS = [
  { label: 'None', value: 0, tailwind: '' },
  { label: '75ms', value: 75, tailwind: 'delay-75' },
  { label: '100ms', value: 100, tailwind: 'delay-100' },
  { label: '150ms', value: 150, tailwind: 'delay-150' },
  { label: '200ms', value: 200, tailwind: 'delay-200' },
  { label: '300ms', value: 300, tailwind: 'delay-300' },
  { label: '500ms', value: 500, tailwind: 'delay-500' },
  { label: '700ms', value: 700, tailwind: 'delay-700' },
  { label: '1000ms', value: 1000, tailwind: 'delay-1000' },
];

// ============================================================================
// HOVER TRANSITIONS
// ============================================================================

export const HOVER_TRANSITIONS: Record<string, TransitionDefinition> = {
  scale: {
    id: 'scale',
    name: 'Scale',
    category: 'hover',
    description: 'Scales up on hover',
    properties: ['transform'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { transform: 'scale(1)' },
    hoverStyles: { transform: 'scale(1.05)' },
    tailwindBase: ['transition-transform', 'duration-200', 'ease-out', 'scale-100'],
    tailwindHover: ['hover:scale-105'],
    cssTransition: 'transform 200ms ease-out',
  },

  scaleUp: {
    id: 'scaleUp',
    name: 'Scale Up',
    category: 'hover',
    description: 'Larger scale on hover',
    properties: ['transform'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { transform: 'scale(1)' },
    hoverStyles: { transform: 'scale(1.1)' },
    tailwindBase: ['transition-transform', 'duration-200', 'ease-out', 'scale-100'],
    tailwindHover: ['hover:scale-110'],
    cssTransition: 'transform 200ms ease-out',
  },

  scaleDown: {
    id: 'scaleDown',
    name: 'Scale Down',
    category: 'hover',
    description: 'Scales down on hover',
    properties: ['transform'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { transform: 'scale(1)' },
    hoverStyles: { transform: 'scale(0.95)' },
    tailwindBase: ['transition-transform', 'duration-200', 'ease-out', 'scale-100'],
    tailwindHover: ['hover:scale-95'],
    cssTransition: 'transform 200ms ease-out',
  },

  lift: {
    id: 'lift',
    name: 'Lift',
    category: 'hover',
    description: 'Lifts up with shadow on hover',
    properties: ['transform', 'box-shadow'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: {
      transform: 'translateY(0)',
      'box-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    },
    hoverStyles: {
      transform: 'translateY(-4px)',
      'box-shadow': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
    tailwindBase: ['transition-all', 'duration-200', 'ease-out', 'shadow-sm'],
    tailwindHover: ['hover:-translate-y-1', 'hover:shadow-lg'],
    cssTransition: 'transform 200ms ease-out, box-shadow 200ms ease-out',
  },

  liftHigh: {
    id: 'liftHigh',
    name: 'Lift High',
    category: 'hover',
    description: 'Higher lift with larger shadow',
    properties: ['transform', 'box-shadow'],
    duration: 300,
    timing: 'ease-out',
    delay: 0,
    baseStyles: {
      transform: 'translateY(0)',
      'box-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    },
    hoverStyles: {
      transform: 'translateY(-8px)',
      'box-shadow': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
    tailwindBase: ['transition-all', 'duration-300', 'ease-out', 'shadow-sm'],
    tailwindHover: ['hover:-translate-y-2', 'hover:shadow-2xl'],
    cssTransition: 'transform 300ms ease-out, box-shadow 300ms ease-out',
  },

  glow: {
    id: 'glow',
    name: 'Glow',
    category: 'hover',
    description: 'Adds glow effect on hover',
    properties: ['box-shadow'],
    duration: 300,
    timing: 'ease-out',
    delay: 0,
    baseStyles: {
      'box-shadow': '0 0 0 0 rgba(59, 130, 246, 0)',
    },
    hoverStyles: {
      'box-shadow': '0 0 20px 5px rgba(59, 130, 246, 0.4)',
    },
    tailwindBase: ['transition-shadow', 'duration-300', 'ease-out'],
    tailwindHover: ['hover:shadow-[0_0_20px_5px_rgba(59,130,246,0.4)]'],
    cssTransition: 'box-shadow 300ms ease-out',
  },

  glowPurple: {
    id: 'glowPurple',
    name: 'Glow Purple',
    category: 'hover',
    description: 'Purple glow effect',
    properties: ['box-shadow'],
    duration: 300,
    timing: 'ease-out',
    delay: 0,
    baseStyles: {
      'box-shadow': '0 0 0 0 rgba(139, 92, 246, 0)',
    },
    hoverStyles: {
      'box-shadow': '0 0 20px 5px rgba(139, 92, 246, 0.4)',
    },
    tailwindBase: ['transition-shadow', 'duration-300', 'ease-out'],
    tailwindHover: ['hover:shadow-[0_0_20px_5px_rgba(139,92,246,0.4)]'],
    cssTransition: 'box-shadow 300ms ease-out',
  },

  colorShift: {
    id: 'colorShift',
    name: 'Color Shift',
    category: 'hover',
    description: 'Changes background color on hover',
    properties: ['background-color'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { 'background-color': '#3b82f6' },
    hoverStyles: { 'background-color': '#2563eb' },
    tailwindBase: ['transition-colors', 'duration-200', 'ease-out', 'bg-blue-500'],
    tailwindHover: ['hover:bg-blue-600'],
    cssTransition: 'background-color 200ms ease-out',
  },

  darken: {
    id: 'darken',
    name: 'Darken',
    category: 'hover',
    description: 'Darkens background on hover',
    properties: ['filter'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { filter: 'brightness(1)' },
    hoverStyles: { filter: 'brightness(0.9)' },
    tailwindBase: ['transition-all', 'duration-200', 'ease-out', 'brightness-100'],
    tailwindHover: ['hover:brightness-90'],
    cssTransition: 'filter 200ms ease-out',
  },

  lighten: {
    id: 'lighten',
    name: 'Lighten',
    category: 'hover',
    description: 'Lightens background on hover',
    properties: ['filter'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { filter: 'brightness(1)' },
    hoverStyles: { filter: 'brightness(1.1)' },
    tailwindBase: ['transition-all', 'duration-200', 'ease-out', 'brightness-100'],
    tailwindHover: ['hover:brightness-110'],
    cssTransition: 'filter 200ms ease-out',
  },

  underline: {
    id: 'underline',
    name: 'Underline',
    category: 'hover',
    description: 'Animated underline on hover',
    properties: ['background-size'],
    duration: 300,
    timing: 'ease-out',
    delay: 0,
    baseStyles: {
      'background-image': 'linear-gradient(currentColor, currentColor)',
      'background-size': '0% 2px',
      'background-repeat': 'no-repeat',
      'background-position': 'bottom left',
    },
    hoverStyles: {
      'background-size': '100% 2px',
    },
    tailwindBase: ['transition-all', 'duration-300', 'ease-out'],
    tailwindHover: ['hover:underline'],
    cssTransition: 'background-size 300ms ease-out',
  },

  underlineCenter: {
    id: 'underlineCenter',
    name: 'Underline Center',
    category: 'hover',
    description: 'Underline expands from center',
    properties: ['background-size'],
    duration: 300,
    timing: 'ease-out',
    delay: 0,
    baseStyles: {
      'background-image': 'linear-gradient(currentColor, currentColor)',
      'background-size': '0% 2px',
      'background-repeat': 'no-repeat',
      'background-position': 'bottom center',
    },
    hoverStyles: {
      'background-size': '100% 2px',
    },
    tailwindBase: ['transition-all', 'duration-300', 'ease-out'],
    tailwindHover: ['hover:underline'],
    cssTransition: 'background-size 300ms ease-out',
  },

  borderGrow: {
    id: 'borderGrow',
    name: 'Border Grow',
    category: 'hover',
    description: 'Border width increases on hover',
    properties: ['border-width'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { 'border-width': '2px' },
    hoverStyles: { 'border-width': '4px' },
    tailwindBase: ['transition-all', 'duration-200', 'ease-out', 'border-2'],
    tailwindHover: ['hover:border-4'],
    cssTransition: 'border-width 200ms ease-out',
  },

  rotate: {
    id: 'rotate',
    name: 'Rotate',
    category: 'hover',
    description: 'Rotates slightly on hover',
    properties: ['transform'],
    duration: 300,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { transform: 'rotate(0deg)' },
    hoverStyles: { transform: 'rotate(3deg)' },
    tailwindBase: ['transition-transform', 'duration-300', 'ease-out', 'rotate-0'],
    tailwindHover: ['hover:rotate-3'],
    cssTransition: 'transform 300ms ease-out',
  },

  rotateFull: {
    id: 'rotateFull',
    name: 'Rotate Full',
    category: 'hover',
    description: 'Full 360 rotation on hover',
    properties: ['transform'],
    duration: 500,
    timing: 'ease-in-out',
    delay: 0,
    baseStyles: { transform: 'rotate(0deg)' },
    hoverStyles: { transform: 'rotate(360deg)' },
    tailwindBase: ['transition-transform', 'duration-500', 'ease-in-out', 'rotate-0'],
    tailwindHover: ['hover:rotate-180'],
    cssTransition: 'transform 500ms ease-in-out',
  },

  skew: {
    id: 'skew',
    name: 'Skew',
    category: 'hover',
    description: 'Skews element on hover',
    properties: ['transform'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { transform: 'skewX(0deg)' },
    hoverStyles: { transform: 'skewX(-3deg)' },
    tailwindBase: ['transition-transform', 'duration-200', 'ease-out', 'skew-x-0'],
    tailwindHover: ['hover:-skew-x-3'],
    cssTransition: 'transform 200ms ease-out',
  },

  blur: {
    id: 'blur',
    name: 'Blur',
    category: 'hover',
    description: 'Blurs content on hover',
    properties: ['filter'],
    duration: 300,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { filter: 'blur(0)' },
    hoverStyles: { filter: 'blur(4px)' },
    tailwindBase: ['transition-all', 'duration-300', 'ease-out', 'blur-none'],
    tailwindHover: ['hover:blur-sm'],
    cssTransition: 'filter 300ms ease-out',
  },

  grayscale: {
    id: 'grayscale',
    name: 'Grayscale',
    category: 'hover',
    description: 'Removes grayscale on hover',
    properties: ['filter'],
    duration: 300,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { filter: 'grayscale(100%)' },
    hoverStyles: { filter: 'grayscale(0)' },
    tailwindBase: ['transition-all', 'duration-300', 'ease-out', 'grayscale'],
    tailwindHover: ['hover:grayscale-0'],
    cssTransition: 'filter 300ms ease-out',
  },

  saturate: {
    id: 'saturate',
    name: 'Saturate',
    category: 'hover',
    description: 'Increases saturation on hover',
    properties: ['filter'],
    duration: 300,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { filter: 'saturate(100%)' },
    hoverStyles: { filter: 'saturate(150%)' },
    tailwindBase: ['transition-all', 'duration-300', 'ease-out', 'saturate-100'],
    tailwindHover: ['hover:saturate-150'],
    cssTransition: 'filter 300ms ease-out',
  },

  opacity: {
    id: 'opacity',
    name: 'Opacity',
    category: 'hover',
    description: 'Changes opacity on hover',
    properties: ['opacity'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { opacity: '1' },
    hoverStyles: { opacity: '0.8' },
    tailwindBase: ['transition-opacity', 'duration-200', 'ease-out', 'opacity-100'],
    tailwindHover: ['hover:opacity-80'],
    cssTransition: 'opacity 200ms ease-out',
  },

  slideRight: {
    id: 'slideRight',
    name: 'Slide Right',
    category: 'hover',
    description: 'Slides right on hover',
    properties: ['transform'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { transform: 'translateX(0)' },
    hoverStyles: { transform: 'translateX(4px)' },
    tailwindBase: ['transition-transform', 'duration-200', 'ease-out', 'translate-x-0'],
    tailwindHover: ['hover:translate-x-1'],
    cssTransition: 'transform 200ms ease-out',
  },

  slideLeft: {
    id: 'slideLeft',
    name: 'Slide Left',
    category: 'hover',
    description: 'Slides left on hover',
    properties: ['transform'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { transform: 'translateX(0)' },
    hoverStyles: { transform: 'translateX(-4px)' },
    tailwindBase: ['transition-transform', 'duration-200', 'ease-out', 'translate-x-0'],
    tailwindHover: ['hover:-translate-x-1'],
    cssTransition: 'transform 200ms ease-out',
  },

  perspective: {
    id: 'perspective',
    name: 'Perspective',
    category: 'hover',
    description: '3D tilt effect on hover',
    properties: ['transform'],
    duration: 300,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { transform: 'perspective(1000px) rotateX(0) rotateY(0)' },
    hoverStyles: { transform: 'perspective(1000px) rotateX(5deg) rotateY(5deg)' },
    tailwindBase: ['transition-transform', 'duration-300', 'ease-out'],
    tailwindHover: [],
    cssTransition: 'transform 300ms ease-out',
  },
};

// ============================================================================
// ACTIVE/CLICK TRANSITIONS
// ============================================================================

export const ACTIVE_TRANSITIONS: Record<string, TransitionDefinition> = {
  press: {
    id: 'press',
    name: 'Press',
    category: 'active',
    description: 'Scales down when pressed',
    properties: ['transform'],
    duration: 100,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { transform: 'scale(1)' },
    activeStyles: { transform: 'scale(0.95)' },
    tailwindBase: ['transition-transform', 'duration-100', 'ease-out', 'scale-100'],
    tailwindActive: ['active:scale-95'],
    cssTransition: 'transform 100ms ease-out',
  },

  pressDeep: {
    id: 'pressDeep',
    name: 'Press Deep',
    category: 'active',
    description: 'Deeper press effect',
    properties: ['transform'],
    duration: 100,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { transform: 'scale(1)' },
    activeStyles: { transform: 'scale(0.9)' },
    tailwindBase: ['transition-transform', 'duration-100', 'ease-out', 'scale-100'],
    tailwindActive: ['active:scale-90'],
    cssTransition: 'transform 100ms ease-out',
  },

  sink: {
    id: 'sink',
    name: 'Sink',
    category: 'active',
    description: 'Sinks down when pressed',
    properties: ['transform', 'box-shadow'],
    duration: 100,
    timing: 'ease-out',
    delay: 0,
    baseStyles: {
      transform: 'translateY(0)',
      'box-shadow': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
    activeStyles: {
      transform: 'translateY(2px)',
      'box-shadow': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    },
    tailwindBase: ['transition-all', 'duration-100', 'ease-out', 'shadow-md'],
    tailwindActive: ['active:translate-y-0.5', 'active:shadow-sm'],
    cssTransition: 'transform 100ms ease-out, box-shadow 100ms ease-out',
  },

  ripple: {
    id: 'ripple',
    name: 'Ripple',
    category: 'active',
    description: 'Material design ripple effect',
    properties: ['background'],
    duration: 400,
    timing: 'ease-out',
    delay: 0,
    baseStyles: {
      position: 'relative',
      overflow: 'hidden',
    },
    activeStyles: {},
    tailwindBase: ['relative', 'overflow-hidden'],
    tailwindActive: [],
    cssTransition: 'background 400ms ease-out',
  },

  invert: {
    id: 'invert',
    name: 'Invert',
    category: 'active',
    description: 'Inverts colors when pressed',
    properties: ['filter'],
    duration: 100,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { filter: 'invert(0)' },
    activeStyles: { filter: 'invert(1)' },
    tailwindBase: ['transition-all', 'duration-100', 'ease-out', 'invert-0'],
    tailwindActive: ['active:invert'],
    cssTransition: 'filter 100ms ease-out',
  },
};

// ============================================================================
// FOCUS TRANSITIONS
// ============================================================================

export const FOCUS_TRANSITIONS: Record<string, TransitionDefinition> = {
  ring: {
    id: 'ring',
    name: 'Focus Ring',
    category: 'focus',
    description: 'Adds focus ring',
    properties: ['box-shadow'],
    duration: 150,
    timing: 'ease-out',
    delay: 0,
    baseStyles: {
      'box-shadow': '0 0 0 0 rgba(59, 130, 246, 0)',
    },
    focusStyles: {
      'box-shadow': '0 0 0 3px rgba(59, 130, 246, 0.5)',
    },
    tailwindBase: ['transition-shadow', 'duration-150', 'ease-out'],
    tailwindFocus: ['focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2'],
    cssTransition: 'box-shadow 150ms ease-out',
  },

  ringOffset: {
    id: 'ringOffset',
    name: 'Focus Ring Offset',
    category: 'focus',
    description: 'Focus ring with offset',
    properties: ['box-shadow'],
    duration: 150,
    timing: 'ease-out',
    delay: 0,
    baseStyles: {
      'box-shadow': '0 0 0 0 rgba(59, 130, 246, 0)',
    },
    focusStyles: {
      'box-shadow': '0 0 0 2px white, 0 0 0 4px rgba(59, 130, 246, 1)',
    },
    tailwindBase: ['transition-shadow', 'duration-150', 'ease-out'],
    tailwindFocus: ['focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2'],
    cssTransition: 'box-shadow 150ms ease-out',
  },

  outline: {
    id: 'outline',
    name: 'Focus Outline',
    category: 'focus',
    description: 'Visible outline on focus',
    properties: ['outline'],
    duration: 100,
    timing: 'ease-out',
    delay: 0,
    baseStyles: {
      outline: '2px solid transparent',
      'outline-offset': '2px',
    },
    focusStyles: {
      outline: '2px solid #3b82f6',
      'outline-offset': '2px',
    },
    tailwindBase: ['transition-all', 'duration-100', 'ease-out', 'outline-none'],
    tailwindFocus: ['focus:outline-2', 'focus:outline-blue-500', 'focus:outline-offset-2'],
    cssTransition: 'outline 100ms ease-out',
  },

  glow: {
    id: 'glow',
    name: 'Focus Glow',
    category: 'focus',
    description: 'Glow effect on focus',
    properties: ['box-shadow'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: {
      'box-shadow': '0 0 0 0 rgba(59, 130, 246, 0)',
    },
    focusStyles: {
      'box-shadow': '0 0 15px 3px rgba(59, 130, 246, 0.4)',
    },
    tailwindBase: ['transition-shadow', 'duration-200', 'ease-out'],
    tailwindFocus: ['focus:shadow-[0_0_15px_3px_rgba(59,130,246,0.4)]'],
    cssTransition: 'box-shadow 200ms ease-out',
  },

  expand: {
    id: 'expand',
    name: 'Focus Expand',
    category: 'focus',
    description: 'Slightly expands on focus',
    properties: ['transform'],
    duration: 200,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { transform: 'scale(1)' },
    focusStyles: { transform: 'scale(1.02)' },
    tailwindBase: ['transition-transform', 'duration-200', 'ease-out', 'scale-100'],
    tailwindFocus: ['focus:scale-[1.02]'],
    cssTransition: 'transform 200ms ease-out',
  },

  borderHighlight: {
    id: 'borderHighlight',
    name: 'Border Highlight',
    category: 'focus',
    description: 'Highlights border on focus',
    properties: ['border-color'],
    duration: 150,
    timing: 'ease-out',
    delay: 0,
    baseStyles: { 'border-color': '#d1d5db' },
    focusStyles: { 'border-color': '#3b82f6' },
    tailwindBase: ['transition-colors', 'duration-150', 'ease-out', 'border-gray-300'],
    tailwindFocus: ['focus:border-blue-500'],
    cssTransition: 'border-color 150ms ease-out',
  },
};

// ============================================================================
// STATE TRANSITIONS
// ============================================================================

export const STATE_TRANSITIONS: Record<string, StateTransitionDefinition> = {
  button: {
    id: 'button',
    name: 'Button States',
    description: 'Standard button state transitions',
    states: {
      idle: {
        'background-color': '#3b82f6',
        opacity: '1',
        cursor: 'pointer',
      },
      loading: {
        'background-color': '#3b82f6',
        opacity: '0.7',
        cursor: 'wait',
      },
      success: {
        'background-color': '#10b981',
        opacity: '1',
        cursor: 'default',
      },
      error: {
        'background-color': '#ef4444',
        opacity: '1',
        cursor: 'pointer',
      },
      disabled: {
        'background-color': '#9ca3af',
        opacity: '0.5',
        cursor: 'not-allowed',
      },
    },
    transitionProperties: ['background-color', 'opacity'],
    duration: 200,
    timing: 'ease-out',
    tailwindStates: {
      idle: ['bg-blue-500', 'opacity-100', 'cursor-pointer'],
      loading: ['bg-blue-500', 'opacity-70', 'cursor-wait'],
      success: ['bg-green-500', 'opacity-100', 'cursor-default'],
      error: ['bg-red-500', 'opacity-100', 'cursor-pointer'],
      disabled: ['bg-gray-400', 'opacity-50', 'cursor-not-allowed'],
    },
  },

  input: {
    id: 'input',
    name: 'Input States',
    description: 'Form input state transitions',
    states: {
      idle: {
        'border-color': '#d1d5db',
        'background-color': '#ffffff',
      },
      loading: {
        'border-color': '#3b82f6',
        'background-color': '#f3f4f6',
      },
      success: {
        'border-color': '#10b981',
        'background-color': '#ecfdf5',
      },
      error: {
        'border-color': '#ef4444',
        'background-color': '#fef2f2',
      },
      disabled: {
        'border-color': '#e5e7eb',
        'background-color': '#f9fafb',
      },
    },
    transitionProperties: ['border-color', 'background-color'],
    duration: 200,
    timing: 'ease-out',
    tailwindStates: {
      idle: ['border-gray-300', 'bg-white'],
      loading: ['border-blue-500', 'bg-gray-100'],
      success: ['border-green-500', 'bg-green-50'],
      error: ['border-red-500', 'bg-red-50'],
      disabled: ['border-gray-200', 'bg-gray-50'],
    },
  },

  alert: {
    id: 'alert',
    name: 'Alert States',
    description: 'Alert/notification state transitions',
    states: {
      idle: {
        'background-color': '#f3f4f6',
        'border-color': '#d1d5db',
      },
      loading: {
        'background-color': '#dbeafe',
        'border-color': '#3b82f6',
      },
      success: {
        'background-color': '#d1fae5',
        'border-color': '#10b981',
      },
      error: {
        'background-color': '#fee2e2',
        'border-color': '#ef4444',
      },
      disabled: {
        'background-color': '#f9fafb',
        'border-color': '#e5e7eb',
      },
    },
    transitionProperties: ['background-color', 'border-color'],
    duration: 300,
    timing: 'ease-out',
    tailwindStates: {
      idle: ['bg-gray-100', 'border-gray-300'],
      loading: ['bg-blue-100', 'border-blue-500'],
      success: ['bg-green-100', 'border-green-500'],
      error: ['bg-red-100', 'border-red-500'],
      disabled: ['bg-gray-50', 'border-gray-200'],
    },
  },
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const PAGE_TRANSITIONS: Record<string, PageTransitionDefinition> = {
  fade: {
    id: 'fade',
    name: 'Fade',
    description: 'Simple fade in/out',
    enterStyles: {
      from: { opacity: '0' },
      to: { opacity: '1' },
    },
    exitStyles: {
      from: { opacity: '1' },
      to: { opacity: '0' },
    },
    duration: 300,
    timing: 'ease-out',
  },

  slideUp: {
    id: 'slideUp',
    name: 'Slide Up',
    description: 'Slides up into view',
    enterStyles: {
      from: { opacity: '0', transform: 'translateY(20px)' },
      to: { opacity: '1', transform: 'translateY(0)' },
    },
    exitStyles: {
      from: { opacity: '1', transform: 'translateY(0)' },
      to: { opacity: '0', transform: 'translateY(-20px)' },
    },
    duration: 400,
    timing: 'ease-out',
  },

  slideRight: {
    id: 'slideRight',
    name: 'Slide Right',
    description: 'Slides in from left',
    enterStyles: {
      from: { opacity: '0', transform: 'translateX(-100%)' },
      to: { opacity: '1', transform: 'translateX(0)' },
    },
    exitStyles: {
      from: { opacity: '1', transform: 'translateX(0)' },
      to: { opacity: '0', transform: 'translateX(100%)' },
    },
    duration: 400,
    timing: 'ease-out',
  },

  slideLeft: {
    id: 'slideLeft',
    name: 'Slide Left',
    description: 'Slides in from right',
    enterStyles: {
      from: { opacity: '0', transform: 'translateX(100%)' },
      to: { opacity: '1', transform: 'translateX(0)' },
    },
    exitStyles: {
      from: { opacity: '1', transform: 'translateX(0)' },
      to: { opacity: '0', transform: 'translateX(-100%)' },
    },
    duration: 400,
    timing: 'ease-out',
  },

  scale: {
    id: 'scale',
    name: 'Scale',
    description: 'Scales up into view',
    enterStyles: {
      from: { opacity: '0', transform: 'scale(0.9)' },
      to: { opacity: '1', transform: 'scale(1)' },
    },
    exitStyles: {
      from: { opacity: '1', transform: 'scale(1)' },
      to: { opacity: '0', transform: 'scale(1.1)' },
    },
    duration: 300,
    timing: 'ease-out',
  },

  flip: {
    id: 'flip',
    name: 'Flip',
    description: '3D flip transition',
    enterStyles: {
      from: { opacity: '0', transform: 'perspective(1000px) rotateY(-90deg)' },
      to: { opacity: '1', transform: 'perspective(1000px) rotateY(0)' },
    },
    exitStyles: {
      from: { opacity: '1', transform: 'perspective(1000px) rotateY(0)' },
      to: { opacity: '0', transform: 'perspective(1000px) rotateY(90deg)' },
    },
    duration: 500,
    timing: 'ease-in-out',
  },
};

// ============================================================================
// MOUNT/UNMOUNT TRANSITIONS
// ============================================================================

export const MOUNT_TRANSITIONS: Record<string, MountTransitionDefinition> = {
  fade: {
    id: 'fade',
    name: 'Fade',
    description: 'Fades in/out on mount/unmount',
    mountStyles: {
      initial: { opacity: '0' },
      animate: { opacity: '1' },
    },
    unmountStyles: {
      initial: { opacity: '1' },
      animate: { opacity: '0' },
    },
    duration: 200,
    timing: 'ease-out',
  },

  slideDown: {
    id: 'slideDown',
    name: 'Slide Down',
    description: 'Slides down on mount',
    mountStyles: {
      initial: { opacity: '0', transform: 'translateY(-10px)' },
      animate: { opacity: '1', transform: 'translateY(0)' },
    },
    unmountStyles: {
      initial: { opacity: '1', transform: 'translateY(0)' },
      animate: { opacity: '0', transform: 'translateY(-10px)' },
    },
    duration: 200,
    timing: 'ease-out',
  },

  slideUp: {
    id: 'slideUp',
    name: 'Slide Up',
    description: 'Slides up on mount',
    mountStyles: {
      initial: { opacity: '0', transform: 'translateY(10px)' },
      animate: { opacity: '1', transform: 'translateY(0)' },
    },
    unmountStyles: {
      initial: { opacity: '1', transform: 'translateY(0)' },
      animate: { opacity: '0', transform: 'translateY(10px)' },
    },
    duration: 200,
    timing: 'ease-out',
  },

  scale: {
    id: 'scale',
    name: 'Scale',
    description: 'Scales up on mount',
    mountStyles: {
      initial: { opacity: '0', transform: 'scale(0.95)' },
      animate: { opacity: '1', transform: 'scale(1)' },
    },
    unmountStyles: {
      initial: { opacity: '1', transform: 'scale(1)' },
      animate: { opacity: '0', transform: 'scale(0.95)' },
    },
    duration: 200,
    timing: 'ease-out',
  },

  scaleUp: {
    id: 'scaleUp',
    name: 'Scale Up',
    description: 'Scales from small on mount',
    mountStyles: {
      initial: { opacity: '0', transform: 'scale(0.5)' },
      animate: { opacity: '1', transform: 'scale(1)' },
    },
    unmountStyles: {
      initial: { opacity: '1', transform: 'scale(1)' },
      animate: { opacity: '0', transform: 'scale(0.5)' },
    },
    duration: 300,
    timing: 'ease-out-back',
  },

  expand: {
    id: 'expand',
    name: 'Expand',
    description: 'Expands height on mount',
    mountStyles: {
      initial: { height: '0', opacity: '0', overflow: 'hidden' },
      animate: { height: 'auto', opacity: '1', overflow: 'visible' },
    },
    unmountStyles: {
      initial: { height: 'auto', opacity: '1', overflow: 'hidden' },
      animate: { height: '0', opacity: '0', overflow: 'hidden' },
    },
    duration: 300,
    timing: 'ease-out',
  },

  reveal: {
    id: 'reveal',
    name: 'Reveal',
    description: 'Reveals with clip-path',
    mountStyles: {
      initial: { 'clip-path': 'inset(0 100% 0 0)', opacity: '0' },
      animate: { 'clip-path': 'inset(0 0 0 0)', opacity: '1' },
    },
    unmountStyles: {
      initial: { 'clip-path': 'inset(0 0 0 0)', opacity: '1' },
      animate: { 'clip-path': 'inset(0 0 0 100%)', opacity: '0' },
    },
    duration: 400,
    timing: 'ease-out',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all transitions by category
 */
export function getTransitionsByCategory(category: TransitionCategory): TransitionDefinition[] {
  switch (category) {
    case 'hover':
      return Object.values(HOVER_TRANSITIONS);
    case 'active':
      return Object.values(ACTIVE_TRANSITIONS);
    case 'focus':
      return Object.values(FOCUS_TRANSITIONS);
    default:
      return [];
  }
}

/**
 * Get all transition categories with their transitions
 */
export function getTransitionCategories(): Array<{
  category: TransitionCategory;
  label: string;
  transitions: TransitionDefinition[];
}> {
  return [
    { category: 'hover', label: 'Hover Effects', transitions: Object.values(HOVER_TRANSITIONS) },
    { category: 'active', label: 'Click/Active Effects', transitions: Object.values(ACTIVE_TRANSITIONS) },
    { category: 'focus', label: 'Focus Effects', transitions: Object.values(FOCUS_TRANSITIONS) },
  ];
}

/**
 * Generate CSS transition property value
 */
export function generateTransitionCSS(config: TransitionConfig): string {
  const properties = config.properties.length > 0 ? config.properties.join(', ') : 'all';
  return `${properties} ${config.duration}ms ${config.timing}${config.delay > 0 ? ` ${config.delay}ms` : ''}`;
}

/**
 * Generate complete CSS for a transition
 */
export function generateCompleteTransitionCSS(
  transitionId: string,
  category: TransitionCategory,
  className?: string
): GeneratedTransitionCSS {
  let transition: TransitionDefinition | undefined;

  switch (category) {
    case 'hover':
      transition = HOVER_TRANSITIONS[transitionId];
      break;
    case 'active':
      transition = ACTIVE_TRANSITIONS[transitionId];
      break;
    case 'focus':
      transition = FOCUS_TRANSITIONS[transitionId];
      break;
  }

  if (!transition) {
    return { base: '', hover: '', active: '', focus: '', tailwindClasses: [] };
  }

  const finalClassName = className || `transition-${transition.id}`;
  const baseStylesStr = Object.entries(transition.baseStyles)
    .map(([prop, value]) => `  ${prop}: ${value};`)
    .join('\n');

  let base = `.${finalClassName} {\n${baseStylesStr}\n  transition: ${transition.cssTransition};\n}`;
  let hover = '';
  let active = '';
  let focus = '';

  if (transition.hoverStyles) {
    const hoverStylesStr = Object.entries(transition.hoverStyles)
      .map(([prop, value]) => `  ${prop}: ${value};`)
      .join('\n');
    hover = `.${finalClassName}:hover {\n${hoverStylesStr}\n}`;
  }

  if (transition.activeStyles) {
    const activeStylesStr = Object.entries(transition.activeStyles)
      .map(([prop, value]) => `  ${prop}: ${value};`)
      .join('\n');
    active = `.${finalClassName}:active {\n${activeStylesStr}\n}`;
  }

  if (transition.focusStyles) {
    const focusStylesStr = Object.entries(transition.focusStyles)
      .map(([prop, value]) => `  ${prop}: ${value};`)
      .join('\n');
    focus = `.${finalClassName}:focus {\n${focusStylesStr}\n}`;
  }

  // Combine Tailwind classes
  const tailwindClasses = [
    ...transition.tailwindBase,
    ...(transition.tailwindHover || []),
    ...(transition.tailwindActive || []),
    ...(transition.tailwindFocus || []),
  ];

  return { base, hover, active, focus, tailwindClasses };
}

/**
 * Get Tailwind classes for duration
 */
export function getTailwindDuration(duration: number): string {
  const option = DURATION_OPTIONS.find((opt) => opt.value === duration);
  return option?.tailwind || `duration-[${duration}ms]`;
}

/**
 * Get Tailwind classes for delay
 */
export function getTailwindDelay(delay: number): string {
  if (delay === 0) return '';
  const option = DELAY_OPTIONS.find((opt) => opt.value === delay);
  return option?.tailwind || `delay-[${delay}ms]`;
}

/**
 * Get Tailwind classes for timing function
 */
export function getTailwindTiming(timing: string): string {
  return TAILWIND_TIMING_CLASSES[timing] || 'ease-out';
}

/**
 * Custom cubic bezier timing function generator
 */
export function createCustomTiming(x1: number, y1: number, x2: number, y2: number): string {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

/**
 * Create spring timing function
 */
export function createSpringTiming(stiffness: number = 100, damping: number = 10): string {
  // Approximate spring physics with cubic-bezier
  const dampingRatio = damping / (2 * Math.sqrt(stiffness));
  const overshoot = Math.max(0, 1 - dampingRatio);

  if (dampingRatio >= 1) {
    // Overdamped - no overshoot
    return `cubic-bezier(0.25, 0.1, 0.25, 1)`;
  } else {
    // Underdamped - has overshoot
    return `cubic-bezier(0.175, 0.885, 0.32, ${1 + overshoot * 0.5})`;
  }
}

/**
 * Generate state transition CSS
 */
export function generateStateTransitionCSS(
  transitionId: string,
  currentState: StateType,
  className?: string
): string {
  const transition = STATE_TRANSITIONS[transitionId];
  if (!transition) return '';

  const finalClassName = className || `state-${transitionId}`;
  const stateStyles = transition.states[currentState];

  const stylesStr = Object.entries(stateStyles)
    .map(([prop, value]) => `  ${prop}: ${value};`)
    .join('\n');

  const transitionStr = transition.transitionProperties
    .map((prop) => `${prop} ${transition.duration}ms ${transition.timing}`)
    .join(', ');

  return `.${finalClassName} {\n${stylesStr}\n  transition: ${transitionStr};\n}`;
}

/**
 * Generate page transition CSS
 */
export function generatePageTransitionCSS(transitionId: string): {
  enterFrom: string;
  enterTo: string;
  exitFrom: string;
  exitTo: string;
  transition: string;
} {
  const pageTransition = PAGE_TRANSITIONS[transitionId];
  if (!pageTransition) {
    return { enterFrom: '', enterTo: '', exitFrom: '', exitTo: '', transition: '' };
  }

  const enterFromStr = Object.entries(pageTransition.enterStyles.from)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ');

  const enterToStr = Object.entries(pageTransition.enterStyles.to)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ');

  const exitFromStr = Object.entries(pageTransition.exitStyles.from)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ');

  const exitToStr = Object.entries(pageTransition.exitStyles.to)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ');

  return {
    enterFrom: enterFromStr,
    enterTo: enterToStr,
    exitFrom: exitFromStr,
    exitTo: exitToStr,
    transition: `all ${pageTransition.duration}ms ${pageTransition.timing}`,
  };
}

/**
 * Generate mount transition CSS
 */
export function generateMountTransitionCSS(transitionId: string): {
  initial: string;
  animate: string;
  exit: string;
  transition: string;
} {
  const mountTransition = MOUNT_TRANSITIONS[transitionId];
  if (!mountTransition) {
    return { initial: '', animate: '', exit: '', transition: '' };
  }

  const initialStr = Object.entries(mountTransition.mountStyles.initial)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ');

  const animateStr = Object.entries(mountTransition.mountStyles.animate)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ');

  const exitStr = Object.entries(mountTransition.unmountStyles.animate)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ');

  return {
    initial: initialStr,
    animate: animateStr,
    exit: exitStr,
    transition: `all ${mountTransition.duration}ms ${mountTransition.timing}`,
  };
}

/**
 * Combine multiple transitions
 */
export function combineTransitions(
  transitions: Array<{ properties: string[]; duration: number; timing: string; delay?: number }>
): string {
  return transitions
    .map((t) => {
      const properties = t.properties.length > 0 ? t.properties.join(', ') : 'all';
      return `${properties} ${t.duration}ms ${t.timing}${t.delay ? ` ${t.delay}ms` : ''}`;
    })
    .join(', ');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Constants
  TRANSITION_PROPERTIES,
  TAILWIND_TRANSITION_CLASSES,
  TIMING_FUNCTIONS,
  TAILWIND_TIMING_CLASSES,
  DURATION_OPTIONS,
  DELAY_OPTIONS,

  // Transition collections
  HOVER_TRANSITIONS,
  ACTIVE_TRANSITIONS,
  FOCUS_TRANSITIONS,
  STATE_TRANSITIONS,
  PAGE_TRANSITIONS,
  MOUNT_TRANSITIONS,

  // Functions
  getTransitionsByCategory,
  getTransitionCategories,
  generateTransitionCSS,
  generateCompleteTransitionCSS,
  getTailwindDuration,
  getTailwindDelay,
  getTailwindTiming,
  createCustomTiming,
  createSpringTiming,
  generateStateTransitionCSS,
  generatePageTransitionCSS,
  generateMountTransitionCSS,
  combineTransitions,
};
