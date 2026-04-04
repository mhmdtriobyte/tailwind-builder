/**
 * CSS Parser - Advanced CSS parsing, validation, and manipulation utilities
 *
 * This module provides:
 * - CSS string to AST parsing
 * - Syntax validation with error detection
 * - Selector and property extraction
 * - Auto-fix for common CSS errors
 * - Property autocomplete data
 * - Vendor prefix handling
 */

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

/** Represents a CSS property declaration */
export interface CSSDeclaration {
  property: string;
  value: string;
  important: boolean;
  line: number;
  column: number;
}

/** Represents a CSS rule with selector and declarations */
export interface CSSRule {
  type: 'rule' | 'at-rule' | 'comment';
  selectors: string[];
  declarations: CSSDeclaration[];
  atKeyword?: string;
  atValue?: string;
  rules?: CSSRule[];
  line: number;
  column: number;
  raw: string;
}

/** CSS Abstract Syntax Tree */
export interface CSSAST {
  type: 'stylesheet';
  rules: CSSRule[];
  errors: CSSError[];
}

/** CSS parsing or validation error */
export interface CSSError {
  type: 'error' | 'warning';
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  fix?: CSSAutoFix;
}

/** Auto-fix suggestion for CSS errors */
export interface CSSAutoFix {
  description: string;
  replacement: string;
  range: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
}

/** Token types for CSS lexer */
type TokenType =
  | 'IDENT'
  | 'STRING'
  | 'NUMBER'
  | 'HASH'
  | 'AT_KEYWORD'
  | 'COLON'
  | 'SEMICOLON'
  | 'LBRACE'
  | 'RBRACE'
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACKET'
  | 'RBRACKET'
  | 'COMMA'
  | 'COMMENT'
  | 'WHITESPACE'
  | 'DELIM'
  | 'EOF';

interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

// =============================================================================
// CSS PROPERTY DATABASE
// =============================================================================

/** Comprehensive CSS property database with values */
export const CSS_PROPERTIES: Record<string, {
  values: string[];
  inherited: boolean;
  animatable: boolean;
  syntax?: string;
}> = {
  // Layout
  'display': {
    values: ['none', 'block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'table', 'table-row', 'table-cell', 'contents', 'flow-root'],
    inherited: false,
    animatable: false,
  },
  'position': {
    values: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    inherited: false,
    animatable: false,
  },
  'top': {
    values: ['auto', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'right': {
    values: ['auto', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'bottom': {
    values: ['auto', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'left': {
    values: ['auto', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'z-index': {
    values: ['auto', '<integer>'],
    inherited: false,
    animatable: true,
  },
  'float': {
    values: ['none', 'left', 'right', 'inline-start', 'inline-end'],
    inherited: false,
    animatable: false,
  },
  'clear': {
    values: ['none', 'left', 'right', 'both', 'inline-start', 'inline-end'],
    inherited: false,
    animatable: false,
  },

  // Flexbox
  'flex': {
    values: ['none', 'auto', '<flex-grow> <flex-shrink> <flex-basis>'],
    inherited: false,
    animatable: true,
  },
  'flex-direction': {
    values: ['row', 'row-reverse', 'column', 'column-reverse'],
    inherited: false,
    animatable: false,
  },
  'flex-wrap': {
    values: ['nowrap', 'wrap', 'wrap-reverse'],
    inherited: false,
    animatable: false,
  },
  'flex-flow': {
    values: ['<flex-direction> <flex-wrap>'],
    inherited: false,
    animatable: false,
  },
  'flex-grow': {
    values: ['<number>'],
    inherited: false,
    animatable: true,
  },
  'flex-shrink': {
    values: ['<number>'],
    inherited: false,
    animatable: true,
  },
  'flex-basis': {
    values: ['auto', 'content', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'justify-content': {
    values: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'start', 'end'],
    inherited: false,
    animatable: false,
  },
  'align-items': {
    values: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch', 'start', 'end'],
    inherited: false,
    animatable: false,
  },
  'align-content': {
    values: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch', 'start', 'end'],
    inherited: false,
    animatable: false,
  },
  'align-self': {
    values: ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
    inherited: false,
    animatable: false,
  },
  'order': {
    values: ['<integer>'],
    inherited: false,
    animatable: true,
  },
  'gap': {
    values: ['<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'row-gap': {
    values: ['normal', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'column-gap': {
    values: ['normal', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },

  // Grid
  'grid': {
    values: ['none', '<grid-template>', '<grid-template-rows> / <grid-template-columns>'],
    inherited: false,
    animatable: false,
  },
  'grid-template': {
    values: ['none', '<grid-template-rows> / <grid-template-columns>'],
    inherited: false,
    animatable: false,
  },
  'grid-template-columns': {
    values: ['none', 'auto', '<track-list>', 'subgrid'],
    inherited: false,
    animatable: false,
  },
  'grid-template-rows': {
    values: ['none', 'auto', '<track-list>', 'subgrid'],
    inherited: false,
    animatable: false,
  },
  'grid-template-areas': {
    values: ['none', '<string>'],
    inherited: false,
    animatable: false,
  },
  'grid-column': {
    values: ['auto', '<grid-line>', '<grid-line> / <grid-line>'],
    inherited: false,
    animatable: false,
  },
  'grid-row': {
    values: ['auto', '<grid-line>', '<grid-line> / <grid-line>'],
    inherited: false,
    animatable: false,
  },
  'grid-area': {
    values: ['auto', '<grid-line>', '<grid-area-name>'],
    inherited: false,
    animatable: false,
  },
  'grid-auto-columns': {
    values: ['auto', 'min-content', 'max-content', '<length>', '<percentage>'],
    inherited: false,
    animatable: false,
  },
  'grid-auto-rows': {
    values: ['auto', 'min-content', 'max-content', '<length>', '<percentage>'],
    inherited: false,
    animatable: false,
  },
  'grid-auto-flow': {
    values: ['row', 'column', 'row dense', 'column dense', 'dense'],
    inherited: false,
    animatable: false,
  },

  // Box Model
  'width': {
    values: ['auto', '<length>', '<percentage>', 'max-content', 'min-content', 'fit-content'],
    inherited: false,
    animatable: true,
  },
  'height': {
    values: ['auto', '<length>', '<percentage>', 'max-content', 'min-content', 'fit-content'],
    inherited: false,
    animatable: true,
  },
  'min-width': {
    values: ['auto', '<length>', '<percentage>', 'max-content', 'min-content', 'fit-content'],
    inherited: false,
    animatable: true,
  },
  'min-height': {
    values: ['auto', '<length>', '<percentage>', 'max-content', 'min-content', 'fit-content'],
    inherited: false,
    animatable: true,
  },
  'max-width': {
    values: ['none', '<length>', '<percentage>', 'max-content', 'min-content', 'fit-content'],
    inherited: false,
    animatable: true,
  },
  'max-height': {
    values: ['none', '<length>', '<percentage>', 'max-content', 'min-content', 'fit-content'],
    inherited: false,
    animatable: true,
  },
  'margin': {
    values: ['auto', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'margin-top': {
    values: ['auto', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'margin-right': {
    values: ['auto', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'margin-bottom': {
    values: ['auto', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'margin-left': {
    values: ['auto', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'padding': {
    values: ['<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'padding-top': {
    values: ['<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'padding-right': {
    values: ['<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'padding-bottom': {
    values: ['<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'padding-left': {
    values: ['<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'box-sizing': {
    values: ['content-box', 'border-box'],
    inherited: false,
    animatable: false,
  },
  'overflow': {
    values: ['visible', 'hidden', 'scroll', 'auto', 'clip'],
    inherited: false,
    animatable: false,
  },
  'overflow-x': {
    values: ['visible', 'hidden', 'scroll', 'auto', 'clip'],
    inherited: false,
    animatable: false,
  },
  'overflow-y': {
    values: ['visible', 'hidden', 'scroll', 'auto', 'clip'],
    inherited: false,
    animatable: false,
  },

  // Typography
  'font': {
    values: ['<font-style> <font-variant> <font-weight> <font-size>/<line-height> <font-family>'],
    inherited: true,
    animatable: true,
  },
  'font-family': {
    values: ['<family-name>', 'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui'],
    inherited: true,
    animatable: false,
  },
  'font-size': {
    values: ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', 'larger', 'smaller', '<length>', '<percentage>'],
    inherited: true,
    animatable: true,
  },
  'font-weight': {
    values: ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    inherited: true,
    animatable: true,
  },
  'font-style': {
    values: ['normal', 'italic', 'oblique'],
    inherited: true,
    animatable: false,
  },
  'font-variant': {
    values: ['normal', 'small-caps'],
    inherited: true,
    animatable: false,
  },
  'line-height': {
    values: ['normal', '<number>', '<length>', '<percentage>'],
    inherited: true,
    animatable: true,
  },
  'letter-spacing': {
    values: ['normal', '<length>'],
    inherited: true,
    animatable: true,
  },
  'word-spacing': {
    values: ['normal', '<length>'],
    inherited: true,
    animatable: true,
  },
  'text-align': {
    values: ['left', 'right', 'center', 'justify', 'start', 'end'],
    inherited: true,
    animatable: false,
  },
  'text-decoration': {
    values: ['none', 'underline', 'overline', 'line-through', 'blink'],
    inherited: false,
    animatable: false,
  },
  'text-decoration-line': {
    values: ['none', 'underline', 'overline', 'line-through', 'blink'],
    inherited: false,
    animatable: false,
  },
  'text-decoration-style': {
    values: ['solid', 'double', 'dotted', 'dashed', 'wavy'],
    inherited: false,
    animatable: false,
  },
  'text-decoration-color': {
    values: ['<color>', 'currentColor'],
    inherited: false,
    animatable: true,
  },
  'text-transform': {
    values: ['none', 'capitalize', 'uppercase', 'lowercase', 'full-width'],
    inherited: true,
    animatable: false,
  },
  'text-indent': {
    values: ['<length>', '<percentage>'],
    inherited: true,
    animatable: true,
  },
  'text-shadow': {
    values: ['none', '<offset-x> <offset-y> <blur-radius> <color>'],
    inherited: true,
    animatable: true,
  },
  'text-overflow': {
    values: ['clip', 'ellipsis', '<string>'],
    inherited: false,
    animatable: false,
  },
  'white-space': {
    values: ['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line', 'break-spaces'],
    inherited: true,
    animatable: false,
  },
  'word-break': {
    values: ['normal', 'break-all', 'keep-all', 'break-word'],
    inherited: true,
    animatable: false,
  },
  'word-wrap': {
    values: ['normal', 'break-word', 'anywhere'],
    inherited: true,
    animatable: false,
  },
  'overflow-wrap': {
    values: ['normal', 'break-word', 'anywhere'],
    inherited: true,
    animatable: false,
  },

  // Colors & Backgrounds
  'color': {
    values: ['<color>', 'currentColor', 'inherit'],
    inherited: true,
    animatable: true,
  },
  'background': {
    values: ['<background-color>', '<background-image>', '<background-repeat>', '<background-position>', '<background-size>'],
    inherited: false,
    animatable: true,
  },
  'background-color': {
    values: ['<color>', 'transparent', 'currentColor'],
    inherited: false,
    animatable: true,
  },
  'background-image': {
    values: ['none', '<url>', '<gradient>'],
    inherited: false,
    animatable: false,
  },
  'background-position': {
    values: ['left', 'center', 'right', 'top', 'bottom', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'background-repeat': {
    values: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'space', 'round'],
    inherited: false,
    animatable: false,
  },
  'background-size': {
    values: ['auto', 'cover', 'contain', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'background-attachment': {
    values: ['scroll', 'fixed', 'local'],
    inherited: false,
    animatable: false,
  },
  'background-clip': {
    values: ['border-box', 'padding-box', 'content-box', 'text'],
    inherited: false,
    animatable: false,
  },
  'background-origin': {
    values: ['border-box', 'padding-box', 'content-box'],
    inherited: false,
    animatable: false,
  },
  'opacity': {
    values: ['<number>'],
    inherited: false,
    animatable: true,
  },

  // Borders
  'border': {
    values: ['<border-width> <border-style> <border-color>'],
    inherited: false,
    animatable: true,
  },
  'border-width': {
    values: ['thin', 'medium', 'thick', '<length>'],
    inherited: false,
    animatable: true,
  },
  'border-style': {
    values: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'],
    inherited: false,
    animatable: false,
  },
  'border-color': {
    values: ['<color>', 'transparent', 'currentColor'],
    inherited: false,
    animatable: true,
  },
  'border-top': {
    values: ['<border-width> <border-style> <border-color>'],
    inherited: false,
    animatable: true,
  },
  'border-right': {
    values: ['<border-width> <border-style> <border-color>'],
    inherited: false,
    animatable: true,
  },
  'border-bottom': {
    values: ['<border-width> <border-style> <border-color>'],
    inherited: false,
    animatable: true,
  },
  'border-left': {
    values: ['<border-width> <border-style> <border-color>'],
    inherited: false,
    animatable: true,
  },
  'border-radius': {
    values: ['<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'border-top-left-radius': {
    values: ['<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'border-top-right-radius': {
    values: ['<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'border-bottom-right-radius': {
    values: ['<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'border-bottom-left-radius': {
    values: ['<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'border-collapse': {
    values: ['collapse', 'separate'],
    inherited: true,
    animatable: false,
  },
  'outline': {
    values: ['<outline-width> <outline-style> <outline-color>'],
    inherited: false,
    animatable: true,
  },
  'outline-width': {
    values: ['thin', 'medium', 'thick', '<length>'],
    inherited: false,
    animatable: true,
  },
  'outline-style': {
    values: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'auto'],
    inherited: false,
    animatable: false,
  },
  'outline-color': {
    values: ['<color>', 'invert'],
    inherited: false,
    animatable: true,
  },
  'outline-offset': {
    values: ['<length>'],
    inherited: false,
    animatable: true,
  },

  // Effects
  'box-shadow': {
    values: ['none', '<offset-x> <offset-y> <blur-radius> <spread-radius> <color>'],
    inherited: false,
    animatable: true,
  },
  'filter': {
    values: ['none', 'blur()', 'brightness()', 'contrast()', 'drop-shadow()', 'grayscale()', 'hue-rotate()', 'invert()', 'opacity()', 'saturate()', 'sepia()'],
    inherited: false,
    animatable: true,
  },
  'backdrop-filter': {
    values: ['none', 'blur()', 'brightness()', 'contrast()', 'grayscale()', 'hue-rotate()', 'invert()', 'opacity()', 'saturate()', 'sepia()'],
    inherited: false,
    animatable: true,
  },
  'mix-blend-mode': {
    values: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'],
    inherited: false,
    animatable: false,
  },

  // Transforms
  'transform': {
    values: ['none', 'matrix()', 'translate()', 'translateX()', 'translateY()', 'translateZ()', 'translate3d()', 'scale()', 'scaleX()', 'scaleY()', 'scaleZ()', 'scale3d()', 'rotate()', 'rotateX()', 'rotateY()', 'rotateZ()', 'rotate3d()', 'skew()', 'skewX()', 'skewY()', 'perspective()'],
    inherited: false,
    animatable: true,
  },
  'transform-origin': {
    values: ['left', 'center', 'right', 'top', 'bottom', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'transform-style': {
    values: ['flat', 'preserve-3d'],
    inherited: false,
    animatable: false,
  },
  'perspective': {
    values: ['none', '<length>'],
    inherited: false,
    animatable: true,
  },
  'perspective-origin': {
    values: ['left', 'center', 'right', 'top', 'bottom', '<length>', '<percentage>'],
    inherited: false,
    animatable: true,
  },
  'backface-visibility': {
    values: ['visible', 'hidden'],
    inherited: false,
    animatable: false,
  },

  // Transitions & Animations
  'transition': {
    values: ['<transition-property> <transition-duration> <transition-timing-function> <transition-delay>'],
    inherited: false,
    animatable: false,
  },
  'transition-property': {
    values: ['none', 'all', '<property-name>'],
    inherited: false,
    animatable: false,
  },
  'transition-duration': {
    values: ['<time>'],
    inherited: false,
    animatable: false,
  },
  'transition-timing-function': {
    values: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end', 'steps()', 'cubic-bezier()'],
    inherited: false,
    animatable: false,
  },
  'transition-delay': {
    values: ['<time>'],
    inherited: false,
    animatable: false,
  },
  'animation': {
    values: ['<animation-name> <animation-duration> <animation-timing-function> <animation-delay> <animation-iteration-count> <animation-direction> <animation-fill-mode> <animation-play-state>'],
    inherited: false,
    animatable: false,
  },
  'animation-name': {
    values: ['none', '<keyframes-name>'],
    inherited: false,
    animatable: false,
  },
  'animation-duration': {
    values: ['<time>'],
    inherited: false,
    animatable: false,
  },
  'animation-timing-function': {
    values: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end', 'steps()', 'cubic-bezier()'],
    inherited: false,
    animatable: false,
  },
  'animation-delay': {
    values: ['<time>'],
    inherited: false,
    animatable: false,
  },
  'animation-iteration-count': {
    values: ['infinite', '<number>'],
    inherited: false,
    animatable: false,
  },
  'animation-direction': {
    values: ['normal', 'reverse', 'alternate', 'alternate-reverse'],
    inherited: false,
    animatable: false,
  },
  'animation-fill-mode': {
    values: ['none', 'forwards', 'backwards', 'both'],
    inherited: false,
    animatable: false,
  },
  'animation-play-state': {
    values: ['running', 'paused'],
    inherited: false,
    animatable: false,
  },

  // Other
  'cursor': {
    values: ['auto', 'default', 'none', 'context-menu', 'help', 'pointer', 'progress', 'wait', 'cell', 'crosshair', 'text', 'vertical-text', 'alias', 'copy', 'move', 'no-drop', 'not-allowed', 'e-resize', 'n-resize', 'ne-resize', 'nw-resize', 's-resize', 'se-resize', 'sw-resize', 'w-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'col-resize', 'row-resize', 'all-scroll', 'zoom-in', 'zoom-out', 'grab', 'grabbing'],
    inherited: true,
    animatable: false,
  },
  'pointer-events': {
    values: ['auto', 'none', 'visiblePainted', 'visibleFill', 'visibleStroke', 'visible', 'painted', 'fill', 'stroke', 'all'],
    inherited: true,
    animatable: false,
  },
  'user-select': {
    values: ['none', 'auto', 'text', 'contain', 'all'],
    inherited: false,
    animatable: false,
  },
  'visibility': {
    values: ['visible', 'hidden', 'collapse'],
    inherited: true,
    animatable: false,
  },
  'content': {
    values: ['normal', 'none', '<string>', '<url>', 'attr()', 'counter()', 'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote'],
    inherited: false,
    animatable: false,
  },
  'resize': {
    values: ['none', 'both', 'horizontal', 'vertical', 'block', 'inline'],
    inherited: false,
    animatable: false,
  },
  'appearance': {
    values: ['none', 'auto', 'menulist-button', 'textfield'],
    inherited: false,
    animatable: false,
  },
  'object-fit': {
    values: ['fill', 'contain', 'cover', 'none', 'scale-down'],
    inherited: false,
    animatable: false,
  },
  'object-position': {
    values: ['<position>'],
    inherited: false,
    animatable: true,
  },
  'aspect-ratio': {
    values: ['auto', '<ratio>'],
    inherited: false,
    animatable: true,
  },
  'scroll-behavior': {
    values: ['auto', 'smooth'],
    inherited: false,
    animatable: false,
  },
  'scroll-snap-type': {
    values: ['none', 'x', 'y', 'block', 'inline', 'both', 'mandatory', 'proximity'],
    inherited: false,
    animatable: false,
  },
  'scroll-snap-align': {
    values: ['none', 'start', 'end', 'center'],
    inherited: false,
    animatable: false,
  },
  'will-change': {
    values: ['auto', 'scroll-position', 'contents', '<custom-ident>'],
    inherited: false,
    animatable: false,
  },
  'isolation': {
    values: ['auto', 'isolate'],
    inherited: false,
    animatable: false,
  },
  'contain': {
    values: ['none', 'strict', 'content', 'size', 'layout', 'style', 'paint'],
    inherited: false,
    animatable: false,
  },
  'container-type': {
    values: ['normal', 'size', 'inline-size'],
    inherited: false,
    animatable: false,
  },
  'container-name': {
    values: ['none', '<custom-ident>'],
    inherited: false,
    animatable: false,
  },
};

/** Vendor prefixes for cross-browser compatibility */
export const VENDOR_PREFIXES = ['-webkit-', '-moz-', '-ms-', '-o-'] as const;

/** Properties that commonly need vendor prefixes */
export const PREFIXED_PROPERTIES: Record<string, string[]> = {
  'appearance': ['-webkit-appearance', '-moz-appearance'],
  'backdrop-filter': ['-webkit-backdrop-filter'],
  'background-clip': ['-webkit-background-clip'],
  'box-decoration-break': ['-webkit-box-decoration-break'],
  'clip-path': ['-webkit-clip-path'],
  'hyphens': ['-webkit-hyphens', '-ms-hyphens'],
  'mask': ['-webkit-mask'],
  'mask-image': ['-webkit-mask-image'],
  'text-decoration-skip-ink': ['-webkit-text-decoration-skip-ink'],
  'text-size-adjust': ['-webkit-text-size-adjust', '-ms-text-size-adjust'],
  'user-select': ['-webkit-user-select', '-moz-user-select', '-ms-user-select'],
};

// =============================================================================
// CSS LEXER
// =============================================================================

/**
 * Tokenizes CSS string into tokens for parsing
 */
function tokenize(css: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;
  let column = 1;

  const peek = (offset = 0): string => css[pos + offset] || '';
  const advance = (): string => {
    const char = css[pos++] || '';
    if (char === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
    return char;
  };

  while (pos < css.length) {
    const startLine = line;
    const startColumn = column;
    const char = peek();

    // Whitespace
    if (/\s/.test(char)) {
      let value = '';
      while (/\s/.test(peek())) {
        value += advance();
      }
      tokens.push({ type: 'WHITESPACE', value, line: startLine, column: startColumn });
      continue;
    }

    // Comments
    if (char === '/' && peek(1) === '*') {
      let value = advance() + advance();
      while (pos < css.length && !(peek() === '*' && peek(1) === '/')) {
        value += advance();
      }
      value += advance() + advance();
      tokens.push({ type: 'COMMENT', value, line: startLine, column: startColumn });
      continue;
    }

    // Strings
    if (char === '"' || char === "'") {
      const quote = char;
      let value = advance();
      while (pos < css.length && peek() !== quote) {
        if (peek() === '\\') {
          value += advance();
        }
        value += advance();
      }
      value += advance();
      tokens.push({ type: 'STRING', value, line: startLine, column: startColumn });
      continue;
    }

    // Hash/ID selector
    if (char === '#') {
      let value = advance();
      while (/[a-zA-Z0-9_-]/.test(peek())) {
        value += advance();
      }
      tokens.push({ type: 'HASH', value, line: startLine, column: startColumn });
      continue;
    }

    // At-keyword
    if (char === '@') {
      let value = advance();
      while (/[a-zA-Z0-9_-]/.test(peek())) {
        value += advance();
      }
      tokens.push({ type: 'AT_KEYWORD', value, line: startLine, column: startColumn });
      continue;
    }

    // Numbers
    if (/[0-9]/.test(char) || (char === '.' && /[0-9]/.test(peek(1))) || (char === '-' && /[0-9.]/.test(peek(1)))) {
      let value = '';
      if (char === '-') value += advance();
      while (/[0-9.]/.test(peek())) {
        value += advance();
      }
      // Unit
      while (/[a-zA-Z%]/.test(peek())) {
        value += advance();
      }
      tokens.push({ type: 'NUMBER', value, line: startLine, column: startColumn });
      continue;
    }

    // Identifiers
    if (/[a-zA-Z_-]/.test(char) || (char === '-' && /[a-zA-Z_-]/.test(peek(1)))) {
      let value = '';
      while (/[a-zA-Z0-9_-]/.test(peek())) {
        value += advance();
      }
      tokens.push({ type: 'IDENT', value, line: startLine, column: startColumn });
      continue;
    }

    // Single character tokens
    const singleCharTokens: Record<string, TokenType> = {
      ':': 'COLON',
      ';': 'SEMICOLON',
      '{': 'LBRACE',
      '}': 'RBRACE',
      '(': 'LPAREN',
      ')': 'RPAREN',
      '[': 'LBRACKET',
      ']': 'RBRACKET',
      ',': 'COMMA',
    };

    if (singleCharTokens[char]) {
      tokens.push({ type: singleCharTokens[char], value: advance(), line: startLine, column: startColumn });
      continue;
    }

    // Delimiter
    tokens.push({ type: 'DELIM', value: advance(), line: startLine, column: startColumn });
  }

  tokens.push({ type: 'EOF', value: '', line, column });
  return tokens;
}

// =============================================================================
// CSS PARSER
// =============================================================================

/**
 * Parses CSS string into an Abstract Syntax Tree
 */
export function parseCSS(css: string): CSSAST {
  const tokens = tokenize(css);
  const errors: CSSError[] = [];
  const rules: CSSRule[] = [];
  let pos = 0;

  const current = (): Token => tokens[pos] || { type: 'EOF', value: '', line: 0, column: 0 };
  const peek = (offset = 0): Token => tokens[pos + offset] || { type: 'EOF', value: '', line: 0, column: 0 };
  const advance = (): Token => tokens[pos++] || { type: 'EOF', value: '', line: 0, column: 0 };

  const skipWhitespace = (): void => {
    while (current().type === 'WHITESPACE' || current().type === 'COMMENT') {
      advance();
    }
  };

  const parseSelector = (): string => {
    let selector = '';
    let braceDepth = 0;

    while (pos < tokens.length) {
      const token = current();

      if (token.type === 'LBRACE' && braceDepth === 0) {
        break;
      }
      if (token.type === 'EOF') {
        break;
      }

      if (token.type === 'LBRACE') braceDepth++;
      if (token.type === 'RBRACE') braceDepth--;

      selector += token.value;
      advance();
    }

    return selector.trim();
  };

  const parseDeclaration = (): CSSDeclaration | null => {
    skipWhitespace();

    const propertyToken = current();
    if (propertyToken.type !== 'IDENT' && propertyToken.type !== 'DELIM') {
      return null;
    }

    let property = '';
    while (current().type !== 'COLON' && current().type !== 'EOF' && current().type !== 'RBRACE') {
      property += current().value;
      advance();
    }
    property = property.trim();

    if (current().type !== 'COLON') {
      errors.push({
        type: 'error',
        message: `Expected ':' after property '${property}'`,
        line: current().line,
        column: current().column,
        fix: {
          description: 'Add colon after property',
          replacement: `${property}: `,
          range: {
            startLine: propertyToken.line,
            startColumn: propertyToken.column,
            endLine: current().line,
            endColumn: current().column,
          },
        },
      });
      return null;
    }
    advance(); // skip ':'

    skipWhitespace();

    let value = '';
    let parenDepth = 0;
    let important = false;

    while (pos < tokens.length) {
      const token = current();

      if (token.type === 'SEMICOLON' && parenDepth === 0) {
        advance();
        break;
      }
      if (token.type === 'RBRACE' && parenDepth === 0) {
        break;
      }
      if (token.type === 'EOF') {
        break;
      }

      if (token.type === 'LPAREN') parenDepth++;
      if (token.type === 'RPAREN') parenDepth--;

      if (token.type === 'DELIM' && token.value === '!' && peek(1).value.toLowerCase() === 'important') {
        important = true;
        advance();
        advance();
        skipWhitespace();
        continue;
      }

      value += token.value;
      advance();
    }

    value = value.trim();

    if (!value) {
      errors.push({
        type: 'warning',
        message: `Empty value for property '${property}'`,
        line: propertyToken.line,
        column: propertyToken.column,
      });
    }

    return {
      property,
      value,
      important,
      line: propertyToken.line,
      column: propertyToken.column,
    };
  };

  const parseDeclarations = (): CSSDeclaration[] => {
    const declarations: CSSDeclaration[] = [];

    skipWhitespace();

    if (current().type !== 'LBRACE') {
      errors.push({
        type: 'error',
        message: "Expected '{'",
        line: current().line,
        column: current().column,
      });
      return declarations;
    }
    advance(); // skip '{'

    while (pos < tokens.length) {
      skipWhitespace();

      if (current().type === 'RBRACE') {
        advance();
        break;
      }
      if (current().type === 'EOF') {
        errors.push({
          type: 'error',
          message: "Missing closing '}'",
          line: current().line,
          column: current().column,
        });
        break;
      }

      const declaration = parseDeclaration();
      if (declaration) {
        declarations.push(declaration);
      }
    }

    return declarations;
  };

  const parseAtRule = (): CSSRule | null => {
    const startToken = current();
    const atKeyword = startToken.value.substring(1);
    advance();

    skipWhitespace();

    let atValue = '';
    let braceDepth = 0;

    // Parse at-rule prelude
    while (pos < tokens.length) {
      const token = current();

      if (token.type === 'LBRACE' && braceDepth === 0) {
        break;
      }
      if (token.type === 'SEMICOLON' && braceDepth === 0) {
        advance();
        return {
          type: 'at-rule',
          selectors: [],
          declarations: [],
          atKeyword,
          atValue: atValue.trim(),
          line: startToken.line,
          column: startToken.column,
          raw: `${startToken.value} ${atValue.trim()}`,
        };
      }
      if (token.type === 'EOF') {
        break;
      }

      if (token.type === 'LBRACE') braceDepth++;
      if (token.type === 'RBRACE') braceDepth--;

      atValue += token.value;
      advance();
    }

    // Parse at-rule block
    if (current().type === 'LBRACE') {
      advance();

      const nestedRules: CSSRule[] = [];

      // Check if this is @keyframes or similar with nested rules
      if (['keyframes', '-webkit-keyframes', 'media', 'supports', 'container', 'layer'].includes(atKeyword)) {
        while (pos < tokens.length) {
          skipWhitespace();

          if (current().type === 'RBRACE') {
            advance();
            break;
          }
          if (current().type === 'EOF') {
            errors.push({
              type: 'error',
              message: `Missing closing '}' for @${atKeyword}`,
              line: startToken.line,
              column: startToken.column,
            });
            break;
          }

          const rule = parseRule();
          if (rule) {
            nestedRules.push(rule);
          }
        }

        return {
          type: 'at-rule',
          selectors: [],
          declarations: [],
          atKeyword,
          atValue: atValue.trim(),
          rules: nestedRules,
          line: startToken.line,
          column: startToken.column,
          raw: `${startToken.value} ${atValue.trim()} { ... }`,
        };
      } else {
        // Parse declarations for at-rules like @font-face
        const declarations: CSSDeclaration[] = [];

        while (pos < tokens.length) {
          skipWhitespace();

          if (current().type === 'RBRACE') {
            advance();
            break;
          }
          if (current().type === 'EOF') {
            errors.push({
              type: 'error',
              message: `Missing closing '}' for @${atKeyword}`,
              line: startToken.line,
              column: startToken.column,
            });
            break;
          }

          const declaration = parseDeclaration();
          if (declaration) {
            declarations.push(declaration);
          }
        }

        return {
          type: 'at-rule',
          selectors: [],
          declarations,
          atKeyword,
          atValue: atValue.trim(),
          line: startToken.line,
          column: startToken.column,
          raw: `${startToken.value} ${atValue.trim()} { ... }`,
        };
      }
    }

    return null;
  };

  const parseRule = (): CSSRule | null => {
    skipWhitespace();

    // Check for comments
    if (current().type === 'COMMENT') {
      const commentToken = advance();
      return {
        type: 'comment',
        selectors: [],
        declarations: [],
        line: commentToken.line,
        column: commentToken.column,
        raw: commentToken.value,
      };
    }

    // Check for at-rule
    if (current().type === 'AT_KEYWORD') {
      return parseAtRule();
    }

    // Parse regular rule
    const startToken = current();
    const selectorString = parseSelector();

    if (!selectorString) {
      return null;
    }

    const selectors = selectorString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const declarations = parseDeclarations();

    return {
      type: 'rule',
      selectors,
      declarations,
      line: startToken.line,
      column: startToken.column,
      raw: `${selectorString} { ... }`,
    };
  };

  // Main parsing loop
  while (pos < tokens.length && current().type !== 'EOF') {
    const rule = parseRule();
    if (rule) {
      rules.push(rule);
    }
  }

  return { type: 'stylesheet', rules, errors };
}

// =============================================================================
// CSS VALIDATION
// =============================================================================

/**
 * Validates CSS and returns errors and warnings
 */
export function validateCSS(css: string): CSSError[] {
  const ast = parseCSS(css);
  const errors: CSSError[] = [...ast.errors];

  const validateDeclaration = (decl: CSSDeclaration): void => {
    const propertyLower = decl.property.toLowerCase();
    const propertyWithoutPrefix = propertyLower.replace(/^-webkit-|-moz-|-ms-|-o-/, '');

    // Check if property exists
    if (!CSS_PROPERTIES[propertyWithoutPrefix] && !CSS_PROPERTIES[propertyLower]) {
      // Check for typos
      const suggestions = findSimilarProperties(propertyWithoutPrefix);
      const message = suggestions.length > 0
        ? `Unknown property '${decl.property}'. Did you mean: ${suggestions.slice(0, 3).join(', ')}?`
        : `Unknown property '${decl.property}'`;

      errors.push({
        type: 'warning',
        message,
        line: decl.line,
        column: decl.column,
        fix: suggestions.length > 0
          ? {
              description: `Replace with '${suggestions[0]}'`,
              replacement: suggestions[0],
              range: {
                startLine: decl.line,
                startColumn: decl.column,
                endLine: decl.line,
                endColumn: decl.column + decl.property.length,
              },
            }
          : undefined,
      });
    }

    // Validate value
    if (decl.value) {
      const valueErrors = validatePropertyValue(propertyWithoutPrefix, decl.value);
      valueErrors.forEach((err) => {
        errors.push({
          ...err,
          line: decl.line,
          column: decl.column,
        });
      });
    }
  };

  const validateRule = (rule: CSSRule): void => {
    if (rule.type === 'rule') {
      // Validate selectors
      rule.selectors.forEach((selector) => {
        const selectorErrors = validateSelector(selector);
        selectorErrors.forEach((err) => {
          errors.push({
            ...err,
            line: rule.line,
            column: rule.column,
          });
        });
      });

      // Validate declarations
      rule.declarations.forEach(validateDeclaration);
    }

    if (rule.rules) {
      rule.rules.forEach(validateRule);
    }
  };

  ast.rules.forEach(validateRule);

  return errors;
}

/**
 * Finds similar property names for typo suggestions
 */
function findSimilarProperties(input: string): string[] {
  const properties = Object.keys(CSS_PROPERTIES);
  const similarities: { property: string; distance: number }[] = [];

  for (const prop of properties) {
    const distance = levenshteinDistance(input.toLowerCase(), prop.toLowerCase());
    if (distance <= 3) {
      similarities.push({ property: prop, distance });
    }
  }

  return similarities
    .sort((a, b) => a.distance - b.distance)
    .map((s) => s.property);
}

/**
 * Levenshtein distance for string similarity
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Validates a CSS selector
 */
function validateSelector(selector: string): CSSError[] {
  const errors: CSSError[] = [];

  // Check for common selector issues
  if (selector.includes('  ')) {
    errors.push({
      type: 'warning',
      message: 'Multiple spaces in selector',
      line: 0,
      column: 0,
    });
  }

  // Check for invalid characters
  if (/[^a-zA-Z0-9_\-#.:\[\]()=>~+*^$|"'\s]/.test(selector)) {
    errors.push({
      type: 'warning',
      message: 'Selector may contain invalid characters',
      line: 0,
      column: 0,
    });
  }

  return errors;
}

/**
 * Validates a CSS property value
 */
function validatePropertyValue(property: string, value: string): CSSError[] {
  const errors: CSSError[] = [];
  const propDef = CSS_PROPERTIES[property];

  if (!propDef) {
    return errors;
  }

  // Check for unclosed parentheses
  const openParens = (value.match(/\(/g) || []).length;
  const closeParens = (value.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push({
      type: 'error',
      message: 'Unclosed parenthesis in value',
      line: 0,
      column: 0,
    });
  }

  // Check for unclosed quotes
  const singleQuotes = (value.match(/'/g) || []).length;
  const doubleQuotes = (value.match(/"/g) || []).length;
  if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
    errors.push({
      type: 'error',
      message: 'Unclosed quote in value',
      line: 0,
      column: 0,
    });
  }

  return errors;
}

// =============================================================================
// EXTRACTION UTILITIES
// =============================================================================

/**
 * Extracts all selectors from CSS
 */
export function extractSelectors(css: string): string[] {
  const ast = parseCSS(css);
  const selectors: string[] = [];

  const collectSelectors = (rule: CSSRule): void => {
    if (rule.type === 'rule') {
      selectors.push(...rule.selectors);
    }
    if (rule.rules) {
      rule.rules.forEach(collectSelectors);
    }
  };

  ast.rules.forEach(collectSelectors);
  return Array.from(new Set(selectors));
}

/**
 * Extracts all property-value pairs from CSS
 */
export function extractProperties(css: string): Record<string, string[]> {
  const ast = parseCSS(css);
  const properties: Record<string, string[]> = {};

  const collectDeclarations = (rule: CSSRule): void => {
    rule.declarations.forEach((decl) => {
      if (!properties[decl.property]) {
        properties[decl.property] = [];
      }
      if (!properties[decl.property].includes(decl.value)) {
        properties[decl.property].push(decl.value);
      }
    });
    if (rule.rules) {
      rule.rules.forEach(collectDeclarations);
    }
  };

  ast.rules.forEach(collectDeclarations);
  return properties;
}

/**
 * Extracts all CSS custom properties (variables)
 */
export function extractCustomProperties(css: string): Record<string, string> {
  const ast = parseCSS(css);
  const customProps: Record<string, string> = {};

  const collectCustomProps = (rule: CSSRule): void => {
    rule.declarations.forEach((decl) => {
      if (decl.property.startsWith('--')) {
        customProps[decl.property] = decl.value;
      }
    });
    if (rule.rules) {
      rule.rules.forEach(collectCustomProps);
    }
  };

  ast.rules.forEach(collectCustomProps);
  return customProps;
}

// =============================================================================
// AUTO-FIX UTILITIES
// =============================================================================

/**
 * Common CSS errors and their auto-fixes
 */
const COMMON_FIXES: { pattern: RegExp; fix: (match: string) => string; description: string }[] = [
  // Missing semicolons
  {
    pattern: /([a-z-]+\s*:\s*[^;{}]+)(\s*[a-z-]+\s*:)/gi,
    fix: (match) => match.replace(/\)?\s*([a-z-]+\s*:)/i, ');$1'),
    description: 'Add missing semicolon',
  },
  // Double semicolons
  {
    pattern: /;;+/g,
    fix: () => ';',
    description: 'Remove duplicate semicolons',
  },
  // Missing colon
  {
    pattern: /([a-z-]+)\s+([a-z0-9#%()]+)\s*;/gi,
    fix: (match) => match.replace(/([a-z-]+)\s+/i, '$1: '),
    description: 'Add missing colon',
  },
  // Fix common typos
  {
    pattern: /backgorund/gi,
    fix: () => 'background',
    description: 'Fix typo: backgorund -> background',
  },
  {
    pattern: /diplay/gi,
    fix: () => 'display',
    description: 'Fix typo: diplay -> display',
  },
  {
    pattern: /widht/gi,
    fix: () => 'width',
    description: 'Fix typo: widht -> width',
  },
  {
    pattern: /heigth/gi,
    fix: () => 'height',
    description: 'Fix typo: heigth -> height',
  },
  {
    pattern: /marign/gi,
    fix: () => 'margin',
    description: 'Fix typo: marign -> margin',
  },
  {
    pattern: /pading/gi,
    fix: () => 'padding',
    description: 'Fix typo: pading -> padding',
  },
  {
    pattern: /trasition/gi,
    fix: () => 'transition',
    description: 'Fix typo: trasition -> transition',
  },
  {
    pattern: /trasform/gi,
    fix: () => 'transform',
    description: 'Fix typo: trasform -> transform',
  },
];

/**
 * Attempts to auto-fix common CSS errors
 */
export function autoFixCSS(css: string): { fixed: string; changes: string[] } {
  let fixed = css;
  const changes: string[] = [];

  for (const { pattern, fix, description } of COMMON_FIXES) {
    const matches = fixed.match(pattern);
    if (matches) {
      fixed = fixed.replace(pattern, fix);
      changes.push(description);
    }
  }

  return { fixed, changes };
}

// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

/**
 * Formats/beautifies CSS code
 */
export function formatCSS(css: string, options: { indentSize?: number; useTabs?: boolean } = {}): string {
  const { indentSize = 2, useTabs = false } = options;
  const indent = useTabs ? '\t' : ' '.repeat(indentSize);
  const ast = parseCSS(css);
  const lines: string[] = [];

  const formatDeclaration = (decl: CSSDeclaration, level: number): string => {
    const indentation = indent.repeat(level);
    const important = decl.important ? ' !important' : '';
    return `${indentation}${decl.property}: ${decl.value}${important};`;
  };

  const formatRule = (rule: CSSRule, level: number = 0): void => {
    const indentation = indent.repeat(level);

    if (rule.type === 'comment') {
      lines.push(`${indentation}${rule.raw}`);
      lines.push('');
      return;
    }

    if (rule.type === 'at-rule') {
      if (rule.rules && rule.rules.length > 0) {
        lines.push(`${indentation}@${rule.atKeyword} ${rule.atValue} {`);
        rule.rules.forEach((r) => formatRule(r, level + 1));
        lines.push(`${indentation}}`);
        lines.push('');
      } else if (rule.declarations.length > 0) {
        lines.push(`${indentation}@${rule.atKeyword} ${rule.atValue} {`);
        rule.declarations.forEach((decl) => {
          lines.push(formatDeclaration(decl, level + 1));
        });
        lines.push(`${indentation}}`);
        lines.push('');
      } else {
        lines.push(`${indentation}@${rule.atKeyword} ${rule.atValue};`);
        lines.push('');
      }
      return;
    }

    if (rule.type === 'rule') {
      lines.push(`${indentation}${rule.selectors.join(',\n' + indentation)} {`);
      rule.declarations.forEach((decl) => {
        lines.push(formatDeclaration(decl, level + 1));
      });
      lines.push(`${indentation}}`);
      lines.push('');
    }
  };

  ast.rules.forEach((rule) => formatRule(rule));

  return lines.join('\n').trim();
}

/**
 * Minifies CSS code
 */
export function minifyCSS(css: string): string {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace around special characters
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remove leading/trailing whitespace
    .replace(/^\s+|\s+$/gm, '')
    // Collapse multiple whitespace
    .replace(/\s+/g, ' ')
    // Remove last semicolon before closing brace
    .replace(/;}/g, '}')
    // Remove empty rules
    .replace(/[^{}]+{\s*}/g, '')
    .trim();
}

// =============================================================================
// VENDOR PREFIX UTILITIES
// =============================================================================

/**
 * Adds vendor prefixes to CSS
 */
export function addVendorPrefixes(css: string): string {
  let result = css;

  for (const [property, prefixes] of Object.entries(PREFIXED_PROPERTIES)) {
    const regex = new RegExp(`(^|[{;\\s])${property}\\s*:`, 'gm');
    const matches = result.match(regex);

    if (matches) {
      for (const match of matches) {
        const prefixedDeclarations = prefixes.map((prefix) => match.replace(property, prefix)).join('');
        result = result.replace(match, prefixedDeclarations + match);
      }
    }
  }

  return result;
}

/**
 * Removes vendor prefixes from CSS
 */
export function removeVendorPrefixes(css: string): string {
  let result = css;

  for (const prefix of VENDOR_PREFIXES) {
    const regex = new RegExp(`${prefix}[a-z-]+\\s*:[^;]+;?`, 'gi');
    result = result.replace(regex, '');
  }

  // Clean up empty rules
  result = result.replace(/[^{}]+{\s*}/g, '');

  return result.trim();
}

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

/**
 * Gets all CSS property names
 */
export function getPropertyNames(): string[] {
  return Object.keys(CSS_PROPERTIES);
}

/**
 * Gets values for a specific CSS property
 */
export function getPropertyValues(property: string): string[] {
  return CSS_PROPERTIES[property]?.values || [];
}

/**
 * Checks if a property is inherited
 */
export function isInheritedProperty(property: string): boolean {
  return CSS_PROPERTIES[property]?.inherited ?? false;
}

/**
 * Checks if a property is animatable
 */
export function isAnimatableProperty(property: string): boolean {
  return CSS_PROPERTIES[property]?.animatable ?? false;
}
