/**
 * Animation System Library
 *
 * Complete animation library with 50+ pre-built animations organized by category.
 * All animations are pure CSS with no JavaScript runtime for optimal performance.
 *
 * Categories:
 * - Entrances: fadeIn, slideIn, zoomIn, bounceIn, flipIn, rotateIn
 * - Exits: fadeOut, slideOut, zoomOut, bounceOut, flipOut, rotateOut
 * - Attention: pulse, shake, wobble, swing, tada, jello, heartbeat, flash, rubberBand
 * - Background: gradient-shift, color-cycle, shimmer, wave
 * - Looping: spin, bounce, float, sway, breathe, glow-pulse
 * - Text: typewriter, blur-in, letter-spacing, color-wave
 * - 3D: flip3d, rotate3d, perspective-shift
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Animation category types */
export type AnimationCategory =
  | 'entrances'
  | 'exits'
  | 'attention'
  | 'background'
  | 'looping'
  | 'text'
  | '3d';

/** Timing function types */
export type TimingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'ease-in-quad'
  | 'ease-out-quad'
  | 'ease-in-out-quad'
  | 'ease-in-cubic'
  | 'ease-out-cubic'
  | 'ease-in-out-cubic'
  | 'ease-in-quart'
  | 'ease-out-quart'
  | 'ease-in-out-quart'
  | 'ease-in-quint'
  | 'ease-out-quint'
  | 'ease-in-out-quint'
  | 'ease-in-sine'
  | 'ease-out-sine'
  | 'ease-in-out-sine'
  | 'ease-in-expo'
  | 'ease-out-expo'
  | 'ease-in-out-expo'
  | 'ease-in-circ'
  | 'ease-out-circ'
  | 'ease-in-out-circ'
  | 'ease-in-back'
  | 'ease-out-back'
  | 'ease-in-out-back'
  | 'bounce-in'
  | 'bounce-out'
  | 'elastic-in'
  | 'elastic-out'
  | 'elastic-in-out'
  | 'spring'
  | 'custom';

/** Duration preset types */
export type DurationPreset = 'instant' | 'fast' | 'normal' | 'slow' | 'very-slow';

/** Fill mode types */
export type FillMode = 'none' | 'forwards' | 'backwards' | 'both';

/** Direction types */
export type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';

/** Play state types */
export type PlayState = 'running' | 'paused';

/** Trigger types */
export type AnimationTrigger = 'load' | 'hover' | 'click' | 'scroll' | 'focus' | 'manual';

/** Keyframe definition */
export interface Keyframe {
  offset: number; // 0 to 100
  properties: Record<string, string>;
}

/** Animation definition */
export interface AnimationDefinition {
  id: string;
  name: string;
  category: AnimationCategory;
  description: string;
  keyframes: Keyframe[];
  defaultDuration: number; // in ms
  defaultTiming: TimingFunction;
  defaultIterations: number | 'infinite';
  defaultDelay: number;
  defaultFillMode: FillMode;
  defaultDirection: AnimationDirection;
  cssKeyframes: string;
  tailwindClass?: string;
}

/** Animation configuration */
export interface AnimationConfig {
  animationId: string;
  duration: number;
  delay: number;
  timing: TimingFunction;
  iterations: number | 'infinite';
  fillMode: FillMode;
  direction: AnimationDirection;
  playState: PlayState;
  trigger: AnimationTrigger;
}

/** Animation sequence item */
export interface AnimationSequenceItem {
  animationId: string;
  config: Partial<AnimationConfig>;
  startAt: number; // delay from sequence start in ms
}

/** Animation sequence */
export interface AnimationSequence {
  id: string;
  name: string;
  items: AnimationSequenceItem[];
  totalDuration: number;
}

/** Generated CSS output */
export interface GeneratedAnimationCSS {
  keyframes: string;
  className: string;
  inlineStyle: string;
  tailwindClasses: string[];
}

// ============================================================================
// EASING FUNCTIONS (30+)
// ============================================================================

export const EASING_FUNCTIONS: Record<TimingFunction, string> = {
  // Basic
  linear: 'linear',
  ease: 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',

  // Quadratic
  'ease-in-quad': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  'ease-out-quad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'ease-in-out-quad': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',

  // Cubic
  'ease-in-cubic': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  'ease-out-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1)',

  // Quart
  'ease-in-quart': 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  'ease-out-quart': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  'ease-in-out-quart': 'cubic-bezier(0.77, 0, 0.175, 1)',

  // Quint
  'ease-in-quint': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  'ease-out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
  'ease-in-out-quint': 'cubic-bezier(0.86, 0, 0.07, 1)',

  // Sine
  'ease-in-sine': 'cubic-bezier(0.47, 0, 0.745, 0.715)',
  'ease-out-sine': 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  'ease-in-out-sine': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',

  // Expo
  'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
  'ease-in-out-expo': 'cubic-bezier(1, 0, 0, 1)',

  // Circ
  'ease-in-circ': 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  'ease-out-circ': 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',

  // Back
  'ease-in-back': 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

  // Bounce
  'bounce-in': 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

  // Elastic
  'elastic-in': 'cubic-bezier(0.5, -0.5, 0.5, 1.5)',
  'elastic-out': 'cubic-bezier(0.5, 1.5, 0.5, 1)',
  'elastic-in-out': 'cubic-bezier(0.5, -0.5, 0.5, 1.5)',

  // Spring
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.2)',

  // Custom placeholder
  custom: 'ease',
};

// ============================================================================
// DURATION PRESETS
// ============================================================================

export const DURATION_PRESETS: Record<DurationPreset, number> = {
  instant: 75,
  fast: 150,
  normal: 300,
  slow: 500,
  'very-slow': 1000,
};

export const DURATION_OPTIONS = [
  { label: 'Instant (75ms)', value: 75 },
  { label: 'Fast (150ms)', value: 150 },
  { label: 'Normal (300ms)', value: 300 },
  { label: 'Slow (500ms)', value: 500 },
  { label: 'Very Slow (1s)', value: 1000 },
  { label: '1.5s', value: 1500 },
  { label: '2s', value: 2000 },
  { label: '3s', value: 3000 },
  { label: '5s', value: 5000 },
];

// ============================================================================
// DELAY OPTIONS
// ============================================================================

export const DELAY_OPTIONS = [
  { label: 'None', value: 0 },
  { label: '100ms', value: 100 },
  { label: '200ms', value: 200 },
  { label: '300ms', value: 300 },
  { label: '500ms', value: 500 },
  { label: '750ms', value: 750 },
  { label: '1s', value: 1000 },
  { label: '1.5s', value: 1500 },
  { label: '2s', value: 2000 },
];

// ============================================================================
// ITERATION OPTIONS
// ============================================================================

export const ITERATION_OPTIONS: Array<{ label: string; value: number | 'infinite' }> = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: 'Infinite', value: 'infinite' },
];

// ============================================================================
// ANIMATION DEFINITIONS (50+ animations)
// ============================================================================

export const ANIMATIONS: Record<string, AnimationDefinition> = {
  // -------------------------------------------------------------------------
  // ENTRANCES
  // -------------------------------------------------------------------------

  fadeIn: {
    id: 'fadeIn',
    name: 'Fade In',
    category: 'entrances',
    description: 'Fades element in from transparent',
    keyframes: [
      { offset: 0, properties: { opacity: '0' } },
      { offset: 100, properties: { opacity: '1' } },
    ],
    defaultDuration: 300,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
    tailwindClass: 'animate-fadeIn',
  },

  fadeInUp: {
    id: 'fadeInUp',
    name: 'Fade In Up',
    category: 'entrances',
    description: 'Fades in while moving up',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'translateY(20px)' } },
      { offset: 100, properties: { opacity: '1', transform: 'translateY(0)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
  },

  fadeInDown: {
    id: 'fadeInDown',
    name: 'Fade In Down',
    category: 'entrances',
    description: 'Fades in while moving down',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'translateY(-20px)' } },
      { offset: 100, properties: { opacity: '1', transform: 'translateY(0)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
  },

  fadeInLeft: {
    id: 'fadeInLeft',
    name: 'Fade In Left',
    category: 'entrances',
    description: 'Fades in while moving from left',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'translateX(-20px)' } },
      { offset: 100, properties: { opacity: '1', transform: 'translateX(0)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}`,
  },

  fadeInRight: {
    id: 'fadeInRight',
    name: 'Fade In Right',
    category: 'entrances',
    description: 'Fades in while moving from right',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'translateX(20px)' } },
      { offset: 100, properties: { opacity: '1', transform: 'translateX(0)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}`,
  },

  slideInUp: {
    id: 'slideInUp',
    name: 'Slide In Up',
    category: 'entrances',
    description: 'Slides in from bottom',
    keyframes: [
      { offset: 0, properties: { transform: 'translateY(100%)' } },
      { offset: 100, properties: { transform: 'translateY(0)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes slideInUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}`,
  },

  slideInDown: {
    id: 'slideInDown',
    name: 'Slide In Down',
    category: 'entrances',
    description: 'Slides in from top',
    keyframes: [
      { offset: 0, properties: { transform: 'translateY(-100%)' } },
      { offset: 100, properties: { transform: 'translateY(0)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes slideInDown {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}`,
  },

  slideInLeft: {
    id: 'slideInLeft',
    name: 'Slide In Left',
    category: 'entrances',
    description: 'Slides in from left',
    keyframes: [
      { offset: 0, properties: { transform: 'translateX(-100%)' } },
      { offset: 100, properties: { transform: 'translateX(0)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}`,
  },

  slideInRight: {
    id: 'slideInRight',
    name: 'Slide In Right',
    category: 'entrances',
    description: 'Slides in from right',
    keyframes: [
      { offset: 0, properties: { transform: 'translateX(100%)' } },
      { offset: 100, properties: { transform: 'translateX(0)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}`,
  },

  zoomIn: {
    id: 'zoomIn',
    name: 'Zoom In',
    category: 'entrances',
    description: 'Zooms element in from small',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'scale(0.5)' } },
      { offset: 100, properties: { opacity: '1', transform: 'scale(1)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}`,
  },

  zoomInUp: {
    id: 'zoomInUp',
    name: 'Zoom In Up',
    category: 'entrances',
    description: 'Zooms in while moving up',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'scale(0.5) translateY(100px)' } },
      { offset: 100, properties: { opacity: '1', transform: 'scale(1) translateY(0)' } },
    ],
    defaultDuration: 500,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes zoomInUp {
  from {
    opacity: 0;
    transform: scale(0.5) translateY(100px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}`,
  },

  bounceIn: {
    id: 'bounceIn',
    name: 'Bounce In',
    category: 'entrances',
    description: 'Bounces element in',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'scale(0.3)' } },
      { offset: 50, properties: { opacity: '1', transform: 'scale(1.05)' } },
      { offset: 70, properties: { transform: 'scale(0.9)' } },
      { offset: 100, properties: { transform: 'scale(1)' } },
    ],
    defaultDuration: 600,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}`,
  },

  bounceInDown: {
    id: 'bounceInDown',
    name: 'Bounce In Down',
    category: 'entrances',
    description: 'Bounces in from top',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'translateY(-100px)' } },
      { offset: 60, properties: { opacity: '1', transform: 'translateY(25px)' } },
      { offset: 75, properties: { transform: 'translateY(-10px)' } },
      { offset: 90, properties: { transform: 'translateY(5px)' } },
      { offset: 100, properties: { transform: 'translateY(0)' } },
    ],
    defaultDuration: 700,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes bounceInDown {
  0% {
    opacity: 0;
    transform: translateY(-100px);
  }
  60% {
    opacity: 1;
    transform: translateY(25px);
  }
  75% {
    transform: translateY(-10px);
  }
  90% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
}`,
  },

  flipIn: {
    id: 'flipIn',
    name: 'Flip In',
    category: 'entrances',
    description: 'Flips element in on Y axis',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'perspective(400px) rotateY(90deg)' } },
      { offset: 40, properties: { transform: 'perspective(400px) rotateY(-10deg)' } },
      { offset: 70, properties: { transform: 'perspective(400px) rotateY(10deg)' } },
      { offset: 100, properties: { opacity: '1', transform: 'perspective(400px) rotateY(0)' } },
    ],
    defaultDuration: 600,
    defaultTiming: 'ease-in-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes flipIn {
  0% {
    opacity: 0;
    transform: perspective(400px) rotateY(90deg);
  }
  40% {
    transform: perspective(400px) rotateY(-10deg);
  }
  70% {
    transform: perspective(400px) rotateY(10deg);
  }
  100% {
    opacity: 1;
    transform: perspective(400px) rotateY(0);
  }
}`,
  },

  flipInX: {
    id: 'flipInX',
    name: 'Flip In X',
    category: 'entrances',
    description: 'Flips element in on X axis',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'perspective(400px) rotateX(90deg)' } },
      { offset: 40, properties: { transform: 'perspective(400px) rotateX(-10deg)' } },
      { offset: 70, properties: { transform: 'perspective(400px) rotateX(10deg)' } },
      { offset: 100, properties: { opacity: '1', transform: 'perspective(400px) rotateX(0)' } },
    ],
    defaultDuration: 600,
    defaultTiming: 'ease-in-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes flipInX {
  0% {
    opacity: 0;
    transform: perspective(400px) rotateX(90deg);
  }
  40% {
    transform: perspective(400px) rotateX(-10deg);
  }
  70% {
    transform: perspective(400px) rotateX(10deg);
  }
  100% {
    opacity: 1;
    transform: perspective(400px) rotateX(0);
  }
}`,
  },

  rotateIn: {
    id: 'rotateIn',
    name: 'Rotate In',
    category: 'entrances',
    description: 'Rotates element in',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'rotate(-200deg)' } },
      { offset: 100, properties: { opacity: '1', transform: 'rotate(0)' } },
    ],
    defaultDuration: 500,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes rotateIn {
  from {
    opacity: 0;
    transform: rotate(-200deg);
  }
  to {
    opacity: 1;
    transform: rotate(0);
  }
}`,
  },

  rotateInDownLeft: {
    id: 'rotateInDownLeft',
    name: 'Rotate In Down Left',
    category: 'entrances',
    description: 'Rotates in from bottom left corner',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'rotate(-45deg)', 'transform-origin': 'left bottom' } },
      { offset: 100, properties: { opacity: '1', transform: 'rotate(0)', 'transform-origin': 'left bottom' } },
    ],
    defaultDuration: 500,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes rotateInDownLeft {
  from {
    opacity: 0;
    transform: rotate(-45deg);
    transform-origin: left bottom;
  }
  to {
    opacity: 1;
    transform: rotate(0);
    transform-origin: left bottom;
  }
}`,
  },

  expandIn: {
    id: 'expandIn',
    name: 'Expand In',
    category: 'entrances',
    description: 'Expands from center point',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'scale(0)', 'transform-origin': 'center' } },
      { offset: 70, properties: { transform: 'scale(1.1)' } },
      { offset: 100, properties: { opacity: '1', transform: 'scale(1)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-out-back',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes expandIn {
  0% {
    opacity: 0;
    transform: scale(0);
    transform-origin: center;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}`,
  },

  // -------------------------------------------------------------------------
  // EXITS
  // -------------------------------------------------------------------------

  fadeOut: {
    id: 'fadeOut',
    name: 'Fade Out',
    category: 'exits',
    description: 'Fades element out to transparent',
    keyframes: [
      { offset: 0, properties: { opacity: '1' } },
      { offset: 100, properties: { opacity: '0' } },
    ],
    defaultDuration: 300,
    defaultTiming: 'ease-in',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}`,
  },

  fadeOutUp: {
    id: 'fadeOutUp',
    name: 'Fade Out Up',
    category: 'exits',
    description: 'Fades out while moving up',
    keyframes: [
      { offset: 0, properties: { opacity: '1', transform: 'translateY(0)' } },
      { offset: 100, properties: { opacity: '0', transform: 'translateY(-20px)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-in',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes fadeOutUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}`,
  },

  fadeOutDown: {
    id: 'fadeOutDown',
    name: 'Fade Out Down',
    category: 'exits',
    description: 'Fades out while moving down',
    keyframes: [
      { offset: 0, properties: { opacity: '1', transform: 'translateY(0)' } },
      { offset: 100, properties: { opacity: '0', transform: 'translateY(20px)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-in',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}`,
  },

  slideOutUp: {
    id: 'slideOutUp',
    name: 'Slide Out Up',
    category: 'exits',
    description: 'Slides out to top',
    keyframes: [
      { offset: 0, properties: { transform: 'translateY(0)' } },
      { offset: 100, properties: { transform: 'translateY(-100%)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-in',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes slideOutUp {
  from { transform: translateY(0); }
  to { transform: translateY(-100%); }
}`,
  },

  slideOutDown: {
    id: 'slideOutDown',
    name: 'Slide Out Down',
    category: 'exits',
    description: 'Slides out to bottom',
    keyframes: [
      { offset: 0, properties: { transform: 'translateY(0)' } },
      { offset: 100, properties: { transform: 'translateY(100%)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-in',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes slideOutDown {
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
}`,
  },

  slideOutLeft: {
    id: 'slideOutLeft',
    name: 'Slide Out Left',
    category: 'exits',
    description: 'Slides out to left',
    keyframes: [
      { offset: 0, properties: { transform: 'translateX(0)' } },
      { offset: 100, properties: { transform: 'translateX(-100%)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-in',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes slideOutLeft {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}`,
  },

  slideOutRight: {
    id: 'slideOutRight',
    name: 'Slide Out Right',
    category: 'exits',
    description: 'Slides out to right',
    keyframes: [
      { offset: 0, properties: { transform: 'translateX(0)' } },
      { offset: 100, properties: { transform: 'translateX(100%)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-in',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes slideOutRight {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}`,
  },

  zoomOut: {
    id: 'zoomOut',
    name: 'Zoom Out',
    category: 'exits',
    description: 'Zooms element out to small',
    keyframes: [
      { offset: 0, properties: { opacity: '1', transform: 'scale(1)' } },
      { offset: 100, properties: { opacity: '0', transform: 'scale(0.5)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-in',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes zoomOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.5);
  }
}`,
  },

  bounceOut: {
    id: 'bounceOut',
    name: 'Bounce Out',
    category: 'exits',
    description: 'Bounces element out',
    keyframes: [
      { offset: 0, properties: { transform: 'scale(1)' } },
      { offset: 20, properties: { transform: 'scale(0.9)' } },
      { offset: 50, properties: { opacity: '1', transform: 'scale(1.1)' } },
      { offset: 100, properties: { opacity: '0', transform: 'scale(0.3)' } },
    ],
    defaultDuration: 600,
    defaultTiming: 'ease-in',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes bounceOut {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0;
    transform: scale(0.3);
  }
}`,
  },

  flipOut: {
    id: 'flipOut',
    name: 'Flip Out',
    category: 'exits',
    description: 'Flips element out on Y axis',
    keyframes: [
      { offset: 0, properties: { opacity: '1', transform: 'perspective(400px) rotateY(0)' } },
      { offset: 30, properties: { transform: 'perspective(400px) rotateY(-20deg)', opacity: '1' } },
      { offset: 100, properties: { opacity: '0', transform: 'perspective(400px) rotateY(90deg)' } },
    ],
    defaultDuration: 600,
    defaultTiming: 'ease-in',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes flipOut {
  0% {
    opacity: 1;
    transform: perspective(400px) rotateY(0);
  }
  30% {
    transform: perspective(400px) rotateY(-20deg);
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: perspective(400px) rotateY(90deg);
  }
}`,
  },

  rotateOut: {
    id: 'rotateOut',
    name: 'Rotate Out',
    category: 'exits',
    description: 'Rotates element out',
    keyframes: [
      { offset: 0, properties: { opacity: '1', transform: 'rotate(0)' } },
      { offset: 100, properties: { opacity: '0', transform: 'rotate(200deg)' } },
    ],
    defaultDuration: 500,
    defaultTiming: 'ease-in',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes rotateOut {
  from {
    opacity: 1;
    transform: rotate(0);
  }
  to {
    opacity: 0;
    transform: rotate(200deg);
  }
}`,
  },

  shrinkOut: {
    id: 'shrinkOut',
    name: 'Shrink Out',
    category: 'exits',
    description: 'Shrinks to nothing',
    keyframes: [
      { offset: 0, properties: { opacity: '1', transform: 'scale(1)' } },
      { offset: 100, properties: { opacity: '0', transform: 'scale(0)' } },
    ],
    defaultDuration: 400,
    defaultTiming: 'ease-in-back',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes shrinkOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0);
  }
}`,
  },

  // -------------------------------------------------------------------------
  // ATTENTION SEEKERS
  // -------------------------------------------------------------------------

  pulse: {
    id: 'pulse',
    name: 'Pulse',
    category: 'attention',
    description: 'Gentle pulsing scale effect',
    keyframes: [
      { offset: 0, properties: { transform: 'scale(1)' } },
      { offset: 50, properties: { transform: 'scale(1.05)' } },
      { offset: 100, properties: { transform: 'scale(1)' } },
    ],
    defaultDuration: 1000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}`,
    tailwindClass: 'animate-pulse',
  },

  shake: {
    id: 'shake',
    name: 'Shake',
    category: 'attention',
    description: 'Shakes element horizontally',
    keyframes: [
      { offset: 0, properties: { transform: 'translateX(0)' } },
      { offset: 10, properties: { transform: 'translateX(-10px)' } },
      { offset: 20, properties: { transform: 'translateX(10px)' } },
      { offset: 30, properties: { transform: 'translateX(-10px)' } },
      { offset: 40, properties: { transform: 'translateX(10px)' } },
      { offset: 50, properties: { transform: 'translateX(-10px)' } },
      { offset: 60, properties: { transform: 'translateX(10px)' } },
      { offset: 70, properties: { transform: 'translateX(-10px)' } },
      { offset: 80, properties: { transform: 'translateX(10px)' } },
      { offset: 90, properties: { transform: 'translateX(-10px)' } },
      { offset: 100, properties: { transform: 'translateX(0)' } },
    ],
    defaultDuration: 800,
    defaultTiming: 'ease-in-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}`,
  },

  wobble: {
    id: 'wobble',
    name: 'Wobble',
    category: 'attention',
    description: 'Wobbly rotation effect',
    keyframes: [
      { offset: 0, properties: { transform: 'translateX(0) rotate(0)' } },
      { offset: 15, properties: { transform: 'translateX(-25%) rotate(-5deg)' } },
      { offset: 30, properties: { transform: 'translateX(20%) rotate(3deg)' } },
      { offset: 45, properties: { transform: 'translateX(-15%) rotate(-3deg)' } },
      { offset: 60, properties: { transform: 'translateX(10%) rotate(2deg)' } },
      { offset: 75, properties: { transform: 'translateX(-5%) rotate(-1deg)' } },
      { offset: 100, properties: { transform: 'translateX(0) rotate(0)' } },
    ],
    defaultDuration: 1000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes wobble {
  0%, 100% { transform: translateX(0) rotate(0); }
  15% { transform: translateX(-25%) rotate(-5deg); }
  30% { transform: translateX(20%) rotate(3deg); }
  45% { transform: translateX(-15%) rotate(-3deg); }
  60% { transform: translateX(10%) rotate(2deg); }
  75% { transform: translateX(-5%) rotate(-1deg); }
}`,
  },

  swing: {
    id: 'swing',
    name: 'Swing',
    category: 'attention',
    description: 'Swinging pendulum effect',
    keyframes: [
      { offset: 0, properties: { transform: 'rotate(0)', 'transform-origin': 'top center' } },
      { offset: 20, properties: { transform: 'rotate(15deg)' } },
      { offset: 40, properties: { transform: 'rotate(-10deg)' } },
      { offset: 60, properties: { transform: 'rotate(5deg)' } },
      { offset: 80, properties: { transform: 'rotate(-5deg)' } },
      { offset: 100, properties: { transform: 'rotate(0)' } },
    ],
    defaultDuration: 1000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes swing {
  0%, 100% { transform: rotate(0); transform-origin: top center; }
  20% { transform: rotate(15deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(5deg); }
  80% { transform: rotate(-5deg); }
}`,
  },

  tada: {
    id: 'tada',
    name: 'Tada',
    category: 'attention',
    description: 'Celebratory scale and rotation',
    keyframes: [
      { offset: 0, properties: { transform: 'scale(1) rotate(0)' } },
      { offset: 10, properties: { transform: 'scale(0.9) rotate(-3deg)' } },
      { offset: 20, properties: { transform: 'scale(0.9) rotate(-3deg)' } },
      { offset: 30, properties: { transform: 'scale(1.1) rotate(3deg)' } },
      { offset: 40, properties: { transform: 'scale(1.1) rotate(-3deg)' } },
      { offset: 50, properties: { transform: 'scale(1.1) rotate(3deg)' } },
      { offset: 60, properties: { transform: 'scale(1.1) rotate(-3deg)' } },
      { offset: 70, properties: { transform: 'scale(1.1) rotate(3deg)' } },
      { offset: 80, properties: { transform: 'scale(1.1) rotate(-3deg)' } },
      { offset: 90, properties: { transform: 'scale(1.1) rotate(3deg)' } },
      { offset: 100, properties: { transform: 'scale(1) rotate(0)' } },
    ],
    defaultDuration: 1000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes tada {
  0%, 100% { transform: scale(1) rotate(0); }
  10%, 20% { transform: scale(0.9) rotate(-3deg); }
  30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
  40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
}`,
  },

  jello: {
    id: 'jello',
    name: 'Jello',
    category: 'attention',
    description: 'Jelly-like skew effect',
    keyframes: [
      { offset: 0, properties: { transform: 'skewX(0) skewY(0)' } },
      { offset: 11.1, properties: { transform: 'skewX(-12.5deg) skewY(-12.5deg)' } },
      { offset: 22.2, properties: { transform: 'skewX(6.25deg) skewY(6.25deg)' } },
      { offset: 33.3, properties: { transform: 'skewX(-3.125deg) skewY(-3.125deg)' } },
      { offset: 44.4, properties: { transform: 'skewX(1.5625deg) skewY(1.5625deg)' } },
      { offset: 55.5, properties: { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' } },
      { offset: 66.6, properties: { transform: 'skewX(0.390625deg) skewY(0.390625deg)' } },
      { offset: 77.7, properties: { transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' } },
      { offset: 100, properties: { transform: 'skewX(0) skewY(0)' } },
    ],
    defaultDuration: 900,
    defaultTiming: 'ease-in-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes jello {
  0%, 100% { transform: skewX(0) skewY(0); }
  11.1% { transform: skewX(-12.5deg) skewY(-12.5deg); }
  22.2% { transform: skewX(6.25deg) skewY(6.25deg); }
  33.3% { transform: skewX(-3.125deg) skewY(-3.125deg); }
  44.4% { transform: skewX(1.5625deg) skewY(1.5625deg); }
  55.5% { transform: skewX(-0.78125deg) skewY(-0.78125deg); }
  66.6% { transform: skewX(0.390625deg) skewY(0.390625deg); }
  77.7% { transform: skewX(-0.1953125deg) skewY(-0.1953125deg); }
}`,
  },

  heartbeat: {
    id: 'heartbeat',
    name: 'Heartbeat',
    category: 'attention',
    description: 'Heartbeat pulsing effect',
    keyframes: [
      { offset: 0, properties: { transform: 'scale(1)' } },
      { offset: 14, properties: { transform: 'scale(1.3)' } },
      { offset: 28, properties: { transform: 'scale(1)' } },
      { offset: 42, properties: { transform: 'scale(1.3)' } },
      { offset: 70, properties: { transform: 'scale(1)' } },
      { offset: 100, properties: { transform: 'scale(1)' } },
    ],
    defaultDuration: 1300,
    defaultTiming: 'ease-in-out',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes heartbeat {
  0%, 28%, 70%, 100% { transform: scale(1); }
  14%, 42% { transform: scale(1.3); }
}`,
  },

  flash: {
    id: 'flash',
    name: 'Flash',
    category: 'attention',
    description: 'Flashing opacity effect',
    keyframes: [
      { offset: 0, properties: { opacity: '1' } },
      { offset: 25, properties: { opacity: '0' } },
      { offset: 50, properties: { opacity: '1' } },
      { offset: 75, properties: { opacity: '0' } },
      { offset: 100, properties: { opacity: '1' } },
    ],
    defaultDuration: 1000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes flash {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}`,
  },

  rubberBand: {
    id: 'rubberBand',
    name: 'Rubber Band',
    category: 'attention',
    description: 'Elastic stretching effect',
    keyframes: [
      { offset: 0, properties: { transform: 'scaleX(1) scaleY(1)' } },
      { offset: 30, properties: { transform: 'scaleX(1.25) scaleY(0.75)' } },
      { offset: 40, properties: { transform: 'scaleX(0.75) scaleY(1.25)' } },
      { offset: 50, properties: { transform: 'scaleX(1.15) scaleY(0.85)' } },
      { offset: 65, properties: { transform: 'scaleX(0.95) scaleY(1.05)' } },
      { offset: 75, properties: { transform: 'scaleX(1.05) scaleY(0.95)' } },
      { offset: 100, properties: { transform: 'scaleX(1) scaleY(1)' } },
    ],
    defaultDuration: 1000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes rubberBand {
  0%, 100% { transform: scaleX(1) scaleY(1); }
  30% { transform: scaleX(1.25) scaleY(0.75); }
  40% { transform: scaleX(0.75) scaleY(1.25); }
  50% { transform: scaleX(1.15) scaleY(0.85); }
  65% { transform: scaleX(0.95) scaleY(1.05); }
  75% { transform: scaleX(1.05) scaleY(0.95); }
}`,
  },

  headShake: {
    id: 'headShake',
    name: 'Head Shake',
    category: 'attention',
    description: 'Subtle head shake no gesture',
    keyframes: [
      { offset: 0, properties: { transform: 'translateX(0)' } },
      { offset: 6.5, properties: { transform: 'translateX(-6px) rotateY(-9deg)' } },
      { offset: 18.5, properties: { transform: 'translateX(5px) rotateY(7deg)' } },
      { offset: 31.5, properties: { transform: 'translateX(-3px) rotateY(-5deg)' } },
      { offset: 43.5, properties: { transform: 'translateX(2px) rotateY(3deg)' } },
      { offset: 50, properties: { transform: 'translateX(0)' } },
      { offset: 100, properties: { transform: 'translateX(0)' } },
    ],
    defaultDuration: 1000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes headShake {
  0%, 50%, 100% { transform: translateX(0); }
  6.5% { transform: translateX(-6px) rotateY(-9deg); }
  18.5% { transform: translateX(5px) rotateY(7deg); }
  31.5% { transform: translateX(-3px) rotateY(-5deg); }
  43.5% { transform: translateX(2px) rotateY(3deg); }
}`,
  },

  // -------------------------------------------------------------------------
  // BACKGROUND ANIMATIONS
  // -------------------------------------------------------------------------

  gradientShift: {
    id: 'gradientShift',
    name: 'Gradient Shift',
    category: 'background',
    description: 'Animated gradient background position',
    keyframes: [
      { offset: 0, properties: { 'background-position': '0% 50%' } },
      { offset: 50, properties: { 'background-position': '100% 50%' } },
      { offset: 100, properties: { 'background-position': '0% 50%' } },
    ],
    defaultDuration: 3000,
    defaultTiming: 'ease',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}`,
  },

  colorCycle: {
    id: 'colorCycle',
    name: 'Color Cycle',
    category: 'background',
    description: 'Cycles through background colors',
    keyframes: [
      { offset: 0, properties: { 'background-color': '#3b82f6' } },
      { offset: 25, properties: { 'background-color': '#8b5cf6' } },
      { offset: 50, properties: { 'background-color': '#ec4899' } },
      { offset: 75, properties: { 'background-color': '#f97316' } },
      { offset: 100, properties: { 'background-color': '#3b82f6' } },
    ],
    defaultDuration: 4000,
    defaultTiming: 'linear',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes colorCycle {
  0%, 100% { background-color: #3b82f6; }
  25% { background-color: #8b5cf6; }
  50% { background-color: #ec4899; }
  75% { background-color: #f97316; }
}`,
  },

  shimmer: {
    id: 'shimmer',
    name: 'Shimmer',
    category: 'background',
    description: 'Shimmering light effect',
    keyframes: [
      { offset: 0, properties: { 'background-position': '-200% 0' } },
      { offset: 100, properties: { 'background-position': '200% 0' } },
    ],
    defaultDuration: 2000,
    defaultTiming: 'linear',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes shimmer {
  from { background-position: -200% 0; }
  to { background-position: 200% 0; }
}`,
  },

  wave: {
    id: 'wave',
    name: 'Wave',
    category: 'background',
    description: 'Wave-like background motion',
    keyframes: [
      { offset: 0, properties: { 'background-position': '0% 0%' } },
      { offset: 25, properties: { 'background-position': '50% 100%' } },
      { offset: 50, properties: { 'background-position': '100% 0%' } },
      { offset: 75, properties: { 'background-position': '50% 100%' } },
      { offset: 100, properties: { 'background-position': '0% 0%' } },
    ],
    defaultDuration: 5000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes wave {
  0%, 100% { background-position: 0% 0%; }
  25% { background-position: 50% 100%; }
  50% { background-position: 100% 0%; }
  75% { background-position: 50% 100%; }
}`,
  },

  // -------------------------------------------------------------------------
  // LOOPING ANIMATIONS
  // -------------------------------------------------------------------------

  spin: {
    id: 'spin',
    name: 'Spin',
    category: 'looping',
    description: 'Continuous 360 degree rotation',
    keyframes: [
      { offset: 0, properties: { transform: 'rotate(0deg)' } },
      { offset: 100, properties: { transform: 'rotate(360deg)' } },
    ],
    defaultDuration: 1000,
    defaultTiming: 'linear',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
    tailwindClass: 'animate-spin',
  },

  bounce: {
    id: 'bounce',
    name: 'Bounce',
    category: 'looping',
    description: 'Continuous bouncing effect',
    keyframes: [
      { offset: 0, properties: { transform: 'translateY(-25%)', 'animation-timing-function': 'cubic-bezier(0.8,0,1,1)' } },
      { offset: 50, properties: { transform: 'translateY(0)', 'animation-timing-function': 'cubic-bezier(0,0,0.2,1)' } },
      { offset: 100, properties: { transform: 'translateY(-25%)', 'animation-timing-function': 'cubic-bezier(0.8,0,1,1)' } },
    ],
    defaultDuration: 1000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8,0,1,1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0,0,0.2,1);
  }
}`,
    tailwindClass: 'animate-bounce',
  },

  float: {
    id: 'float',
    name: 'Float',
    category: 'looping',
    description: 'Gentle floating up and down',
    keyframes: [
      { offset: 0, properties: { transform: 'translateY(0)' } },
      { offset: 50, properties: { transform: 'translateY(-10px)' } },
      { offset: 100, properties: { transform: 'translateY(0)' } },
    ],
    defaultDuration: 3000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}`,
  },

  sway: {
    id: 'sway',
    name: 'Sway',
    category: 'looping',
    description: 'Gentle swaying side to side',
    keyframes: [
      { offset: 0, properties: { transform: 'translateX(0) rotate(0)' } },
      { offset: 25, properties: { transform: 'translateX(-5px) rotate(-2deg)' } },
      { offset: 50, properties: { transform: 'translateX(0) rotate(0)' } },
      { offset: 75, properties: { transform: 'translateX(5px) rotate(2deg)' } },
      { offset: 100, properties: { transform: 'translateX(0) rotate(0)' } },
    ],
    defaultDuration: 4000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes sway {
  0%, 50%, 100% { transform: translateX(0) rotate(0); }
  25% { transform: translateX(-5px) rotate(-2deg); }
  75% { transform: translateX(5px) rotate(2deg); }
}`,
  },

  breathe: {
    id: 'breathe',
    name: 'Breathe',
    category: 'looping',
    description: 'Breathing scale animation',
    keyframes: [
      { offset: 0, properties: { transform: 'scale(1)' } },
      { offset: 50, properties: { transform: 'scale(1.08)' } },
      { offset: 100, properties: { transform: 'scale(1)' } },
    ],
    defaultDuration: 4000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}`,
  },

  glowPulse: {
    id: 'glowPulse',
    name: 'Glow Pulse',
    category: 'looping',
    description: 'Pulsing glow effect',
    keyframes: [
      { offset: 0, properties: { 'box-shadow': '0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3)' } },
      { offset: 50, properties: { 'box-shadow': '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.5)' } },
      { offset: 100, properties: { 'box-shadow': '0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3)' } },
    ],
    defaultDuration: 2000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.5); }
}`,
  },

  ping: {
    id: 'ping',
    name: 'Ping',
    category: 'looping',
    description: 'Radar ping effect',
    keyframes: [
      { offset: 0, properties: { transform: 'scale(1)', opacity: '1' } },
      { offset: 75, properties: { transform: 'scale(2)', opacity: '0' } },
      { offset: 100, properties: { transform: 'scale(2)', opacity: '0' } },
    ],
    defaultDuration: 1000,
    defaultTiming: 'cubic-bezier(0, 0, 0.2, 1)',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes ping {
  0% { transform: scale(1); opacity: 1; }
  75%, 100% { transform: scale(2); opacity: 0; }
}`,
    tailwindClass: 'animate-ping',
  },

  // -------------------------------------------------------------------------
  // TEXT ANIMATIONS
  // -------------------------------------------------------------------------

  typewriter: {
    id: 'typewriter',
    name: 'Typewriter',
    category: 'text',
    description: 'Typewriter text reveal effect',
    keyframes: [
      { offset: 0, properties: { width: '0', 'border-right': '2px solid' } },
      { offset: 100, properties: { width: '100%', 'border-right': '2px solid' } },
    ],
    defaultDuration: 2000,
    defaultTiming: 'steps(40)',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes typewriter {
  from { width: 0; border-right: 2px solid; }
  to { width: 100%; border-right: 2px solid; }
}`,
  },

  blurIn: {
    id: 'blurIn',
    name: 'Blur In',
    category: 'text',
    description: 'Text blurs in from fuzzy to clear',
    keyframes: [
      { offset: 0, properties: { filter: 'blur(10px)', opacity: '0' } },
      { offset: 100, properties: { filter: 'blur(0)', opacity: '1' } },
    ],
    defaultDuration: 600,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes blurIn {
  from {
    filter: blur(10px);
    opacity: 0;
  }
  to {
    filter: blur(0);
    opacity: 1;
  }
}`,
  },

  letterSpacing: {
    id: 'letterSpacing',
    name: 'Letter Spacing',
    category: 'text',
    description: 'Animates letter spacing',
    keyframes: [
      { offset: 0, properties: { 'letter-spacing': '-0.5em', opacity: '0' } },
      { offset: 50, properties: { opacity: '1' } },
      { offset: 100, properties: { 'letter-spacing': 'normal', opacity: '1' } },
    ],
    defaultDuration: 800,
    defaultTiming: 'ease-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes letterSpacing {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    letter-spacing: normal;
    opacity: 1;
  }
}`,
  },

  colorWave: {
    id: 'colorWave',
    name: 'Color Wave',
    category: 'text',
    description: 'Wave of color through text',
    keyframes: [
      { offset: 0, properties: { color: '#3b82f6' } },
      { offset: 25, properties: { color: '#8b5cf6' } },
      { offset: 50, properties: { color: '#ec4899' } },
      { offset: 75, properties: { color: '#f97316' } },
      { offset: 100, properties: { color: '#3b82f6' } },
    ],
    defaultDuration: 3000,
    defaultTiming: 'linear',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes colorWave {
  0%, 100% { color: #3b82f6; }
  25% { color: #8b5cf6; }
  50% { color: #ec4899; }
  75% { color: #f97316; }
}`,
  },

  textShadowPulse: {
    id: 'textShadowPulse',
    name: 'Text Shadow Pulse',
    category: 'text',
    description: 'Pulsing text shadow glow',
    keyframes: [
      { offset: 0, properties: { 'text-shadow': '0 0 0 transparent' } },
      { offset: 50, properties: { 'text-shadow': '0 0 20px rgba(59, 130, 246, 0.8)' } },
      { offset: 100, properties: { 'text-shadow': '0 0 0 transparent' } },
    ],
    defaultDuration: 2000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes textShadowPulse {
  0%, 100% { text-shadow: 0 0 0 transparent; }
  50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
}`,
  },

  // -------------------------------------------------------------------------
  // 3D ANIMATIONS
  // -------------------------------------------------------------------------

  flip3d: {
    id: 'flip3d',
    name: 'Flip 3D',
    category: '3d',
    description: 'Full 3D flip on Y axis',
    keyframes: [
      { offset: 0, properties: { transform: 'perspective(600px) rotateY(0)' } },
      { offset: 100, properties: { transform: 'perspective(600px) rotateY(360deg)' } },
    ],
    defaultDuration: 1000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes flip3d {
  from { transform: perspective(600px) rotateY(0); }
  to { transform: perspective(600px) rotateY(360deg); }
}`,
  },

  flip3dX: {
    id: 'flip3dX',
    name: 'Flip 3D X',
    category: '3d',
    description: 'Full 3D flip on X axis',
    keyframes: [
      { offset: 0, properties: { transform: 'perspective(600px) rotateX(0)' } },
      { offset: 100, properties: { transform: 'perspective(600px) rotateX(360deg)' } },
    ],
    defaultDuration: 1000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes flip3dX {
  from { transform: perspective(600px) rotateX(0); }
  to { transform: perspective(600px) rotateX(360deg); }
}`,
  },

  rotate3d: {
    id: 'rotate3d',
    name: 'Rotate 3D',
    category: '3d',
    description: '3D rotation on all axes',
    keyframes: [
      { offset: 0, properties: { transform: 'perspective(600px) rotateX(0) rotateY(0) rotateZ(0)' } },
      { offset: 50, properties: { transform: 'perspective(600px) rotateX(180deg) rotateY(180deg) rotateZ(0)' } },
      { offset: 100, properties: { transform: 'perspective(600px) rotateX(360deg) rotateY(360deg) rotateZ(360deg)' } },
    ],
    defaultDuration: 2000,
    defaultTiming: 'linear',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes rotate3d {
  0% { transform: perspective(600px) rotateX(0) rotateY(0) rotateZ(0); }
  50% { transform: perspective(600px) rotateX(180deg) rotateY(180deg) rotateZ(0); }
  100% { transform: perspective(600px) rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
}`,
  },

  perspectiveShift: {
    id: 'perspectiveShift',
    name: 'Perspective Shift',
    category: '3d',
    description: 'Shifts perspective view point',
    keyframes: [
      { offset: 0, properties: { transform: 'perspective(600px) rotateX(0) rotateY(-15deg)' } },
      { offset: 50, properties: { transform: 'perspective(600px) rotateX(10deg) rotateY(15deg)' } },
      { offset: 100, properties: { transform: 'perspective(600px) rotateX(0) rotateY(-15deg)' } },
    ],
    defaultDuration: 3000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes perspectiveShift {
  0%, 100% { transform: perspective(600px) rotateX(0) rotateY(-15deg); }
  50% { transform: perspective(600px) rotateX(10deg) rotateY(15deg); }
}`,
  },

  cardFlip: {
    id: 'cardFlip',
    name: 'Card Flip',
    category: '3d',
    description: 'Card flip reveal effect',
    keyframes: [
      { offset: 0, properties: { transform: 'perspective(1000px) rotateY(0)', 'backface-visibility': 'hidden' } },
      { offset: 100, properties: { transform: 'perspective(1000px) rotateY(180deg)', 'backface-visibility': 'hidden' } },
    ],
    defaultDuration: 600,
    defaultTiming: 'ease-in-out',
    defaultIterations: 1,
    defaultDelay: 0,
    defaultFillMode: 'forwards',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes cardFlip {
  from {
    transform: perspective(1000px) rotateY(0);
    backface-visibility: hidden;
  }
  to {
    transform: perspective(1000px) rotateY(180deg);
    backface-visibility: hidden;
  }
}`,
  },

  cubeRotate: {
    id: 'cubeRotate',
    name: 'Cube Rotate',
    category: '3d',
    description: 'Cube-like rotation',
    keyframes: [
      { offset: 0, properties: { transform: 'perspective(800px) rotateX(0) rotateY(0)' } },
      { offset: 25, properties: { transform: 'perspective(800px) rotateX(90deg) rotateY(0)' } },
      { offset: 50, properties: { transform: 'perspective(800px) rotateX(90deg) rotateY(90deg)' } },
      { offset: 75, properties: { transform: 'perspective(800px) rotateX(0) rotateY(90deg)' } },
      { offset: 100, properties: { transform: 'perspective(800px) rotateX(0) rotateY(0)' } },
    ],
    defaultDuration: 4000,
    defaultTiming: 'ease-in-out',
    defaultIterations: 'infinite',
    defaultDelay: 0,
    defaultFillMode: 'none',
    defaultDirection: 'normal',
    cssKeyframes: `@keyframes cubeRotate {
  0%, 100% { transform: perspective(800px) rotateX(0) rotateY(0); }
  25% { transform: perspective(800px) rotateX(90deg) rotateY(0); }
  50% { transform: perspective(800px) rotateX(90deg) rotateY(90deg); }
  75% { transform: perspective(800px) rotateX(0) rotateY(90deg); }
}`,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get animations by category
 */
export function getAnimationsByCategory(category: AnimationCategory): AnimationDefinition[] {
  return Object.values(ANIMATIONS).filter((anim) => anim.category === category);
}

/**
 * Get all animation categories with their animations
 */
export function getAnimationCategories(): Array<{ category: AnimationCategory; label: string; animations: AnimationDefinition[] }> {
  const categories: Array<{ category: AnimationCategory; label: string }> = [
    { category: 'entrances', label: 'Entrances' },
    { category: 'exits', label: 'Exits' },
    { category: 'attention', label: 'Attention Seekers' },
    { category: 'background', label: 'Background' },
    { category: 'looping', label: 'Looping' },
    { category: 'text', label: 'Text' },
    { category: '3d', label: '3D Effects' },
  ];

  return categories.map((cat) => ({
    ...cat,
    animations: getAnimationsByCategory(cat.category),
  }));
}

/**
 * Get timing function CSS value
 */
export function getTimingFunctionCSS(timing: TimingFunction): string {
  return EASING_FUNCTIONS[timing] || 'ease';
}

/**
 * Get duration preset value in ms
 */
export function getDurationValue(preset: DurationPreset): number {
  return DURATION_PRESETS[preset];
}

/**
 * Generate CSS animation property value
 */
export function generateAnimationCSS(config: AnimationConfig): string {
  const animation = ANIMATIONS[config.animationId];
  if (!animation) return '';

  const duration = `${config.duration}ms`;
  const timing = getTimingFunctionCSS(config.timing);
  const delay = config.delay > 0 ? `${config.delay}ms` : '0ms';
  const iterations = config.iterations === 'infinite' ? 'infinite' : config.iterations.toString();
  const direction = config.direction;
  const fillMode = config.fillMode;

  return `${animation.id} ${duration} ${timing} ${delay} ${iterations} ${direction} ${fillMode}`;
}

/**
 * Generate complete CSS (keyframes + class)
 */
export function generateCompleteCSS(config: AnimationConfig, className?: string): GeneratedAnimationCSS {
  const animation = ANIMATIONS[config.animationId];
  if (!animation) {
    return { keyframes: '', className: '', inlineStyle: '', tailwindClasses: [] };
  }

  const animationValue = generateAnimationCSS(config);
  const finalClassName = className || `animate-${animation.id}`;

  // Generate Tailwind classes where applicable
  const tailwindClasses: string[] = [];

  // Duration
  if (config.duration === 75) tailwindClasses.push('duration-75');
  else if (config.duration === 100) tailwindClasses.push('duration-100');
  else if (config.duration === 150) tailwindClasses.push('duration-150');
  else if (config.duration === 200) tailwindClasses.push('duration-200');
  else if (config.duration === 300) tailwindClasses.push('duration-300');
  else if (config.duration === 500) tailwindClasses.push('duration-500');
  else if (config.duration === 700) tailwindClasses.push('duration-700');
  else if (config.duration === 1000) tailwindClasses.push('duration-1000');

  // Delay
  if (config.delay === 75) tailwindClasses.push('delay-75');
  else if (config.delay === 100) tailwindClasses.push('delay-100');
  else if (config.delay === 150) tailwindClasses.push('delay-150');
  else if (config.delay === 200) tailwindClasses.push('delay-200');
  else if (config.delay === 300) tailwindClasses.push('delay-300');
  else if (config.delay === 500) tailwindClasses.push('delay-500');
  else if (config.delay === 700) tailwindClasses.push('delay-700');
  else if (config.delay === 1000) tailwindClasses.push('delay-1000');

  // Easing
  if (config.timing === 'linear') tailwindClasses.push('ease-linear');
  else if (config.timing === 'ease-in') tailwindClasses.push('ease-in');
  else if (config.timing === 'ease-out') tailwindClasses.push('ease-out');
  else if (config.timing === 'ease-in-out') tailwindClasses.push('ease-in-out');

  // Use built-in Tailwind animation if available
  if (animation.tailwindClass) {
    tailwindClasses.unshift(animation.tailwindClass);
  }

  return {
    keyframes: animation.cssKeyframes,
    className: `.${finalClassName} {\n  animation: ${animationValue};\n}`,
    inlineStyle: `animation: ${animationValue}`,
    tailwindClasses,
  };
}

/**
 * Create default animation config
 */
export function createDefaultAnimationConfig(animationId: string): AnimationConfig {
  const animation = ANIMATIONS[animationId];

  if (!animation) {
    return {
      animationId: 'fadeIn',
      duration: 300,
      delay: 0,
      timing: 'ease-out',
      iterations: 1,
      fillMode: 'forwards',
      direction: 'normal',
      playState: 'running',
      trigger: 'load',
    };
  }

  return {
    animationId,
    duration: animation.defaultDuration,
    delay: animation.defaultDelay,
    timing: animation.defaultTiming,
    iterations: animation.defaultIterations,
    fillMode: animation.defaultFillMode,
    direction: animation.defaultDirection,
    playState: 'running',
    trigger: 'load',
  };
}

/**
 * Generate all keyframes CSS for embedding in stylesheet
 */
export function generateAllKeyframesCSS(): string {
  return Object.values(ANIMATIONS)
    .map((anim) => anim.cssKeyframes)
    .join('\n\n');
}

/**
 * Create animation sequence
 */
export function createAnimationSequence(
  name: string,
  items: AnimationSequenceItem[]
): AnimationSequence {
  // Calculate total duration
  let totalDuration = 0;
  for (const item of items) {
    const animation = ANIMATIONS[item.animationId];
    if (animation) {
      const itemDuration = item.config.duration ?? animation.defaultDuration;
      const endTime = item.startAt + itemDuration;
      if (endTime > totalDuration) {
        totalDuration = endTime;
      }
    }
  }

  return {
    id: `seq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    items,
    totalDuration,
  };
}

/**
 * Generate CSS for animation sequence
 */
export function generateSequenceCSS(sequence: AnimationSequence): string {
  const keyframesCss: string[] = [];
  const classesCss: string[] = [];

  sequence.items.forEach((item, index) => {
    const animation = ANIMATIONS[item.animationId];
    if (!animation) return;

    keyframesCss.push(animation.cssKeyframes);

    const config = {
      ...createDefaultAnimationConfig(item.animationId),
      ...item.config,
      delay: item.startAt,
    };

    const animationValue = generateAnimationCSS(config);
    classesCss.push(`.${sequence.id}-item-${index} {\n  animation: ${animationValue};\n}`);
  });

  return `/* Keyframes */\n${keyframesCss.join('\n\n')}\n\n/* Sequence Classes */\n${classesCss.join('\n\n')}`;
}

/**
 * Custom cubic bezier timing function generator
 */
export function createCustomTiming(x1: number, y1: number, x2: number, y2: number): string {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  ANIMATIONS,
  EASING_FUNCTIONS,
  DURATION_PRESETS,
  DURATION_OPTIONS,
  DELAY_OPTIONS,
  ITERATION_OPTIONS,
  getAnimationsByCategory,
  getAnimationCategories,
  getTimingFunctionCSS,
  getDurationValue,
  generateAnimationCSS,
  generateCompleteCSS,
  createDefaultAnimationConfig,
  generateAllKeyframesCSS,
  createAnimationSequence,
  generateSequenceCSS,
  createCustomTiming,
};
