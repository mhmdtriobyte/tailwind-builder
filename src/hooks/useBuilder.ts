'use client';

import { useCallback, useMemo } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import type { BuilderElement, ElementStyles } from '@/types/builder';

interface SpacingValues {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

// Helper to extract spacing values from class array
function parseSpacingClasses(
  classes: string[],
  prefix: 'p' | 'm'
): SpacingValues {
  const result: SpacingValues = { top: '0', right: '0', bottom: '0', left: '0' };

  for (const cls of classes) {
    // Check for uniform spacing (p-4, m-4)
    const uniformMatch = cls.match(new RegExp(`^${prefix}-(\\d+|auto|px)$`));
    if (uniformMatch) {
      const value = uniformMatch[1];
      result.top = value;
      result.right = value;
      result.bottom = value;
      result.left = value;
      continue;
    }

    // Check for axis spacing (px-4, py-4, mx-4, my-4)
    const xMatch = cls.match(new RegExp(`^${prefix}x-(\\d+|auto|px)$`));
    if (xMatch) {
      result.left = xMatch[1];
      result.right = xMatch[1];
      continue;
    }

    const yMatch = cls.match(new RegExp(`^${prefix}y-(\\d+|auto|px)$`));
    if (yMatch) {
      result.top = yMatch[1];
      result.bottom = yMatch[1];
      continue;
    }

    // Check for individual sides (pt-4, pr-4, pb-4, pl-4)
    const topMatch = cls.match(new RegExp(`^${prefix}t-(\\d+|auto|px)$`));
    if (topMatch) result.top = topMatch[1];

    const rightMatch = cls.match(new RegExp(`^${prefix}r-(\\d+|auto|px)$`));
    if (rightMatch) result.right = rightMatch[1];

    const bottomMatch = cls.match(new RegExp(`^${prefix}b-(\\d+|auto|px)$`));
    if (bottomMatch) result.bottom = bottomMatch[1];

    const leftMatch = cls.match(new RegExp(`^${prefix}l-(\\d+|auto|px)$`));
    if (leftMatch) result.left = leftMatch[1];
  }

  return result;
}

// Convert spacing values to optimal class array
function spacingToClasses(values: SpacingValues, prefix: 'p' | 'm'): string[] {
  const { top, right, bottom, left } = values;

  // All same - use uniform
  if (top === right && right === bottom && bottom === left) {
    return top !== '0' ? [`${prefix}-${top}`] : [];
  }

  // X and Y same
  if (left === right && top === bottom) {
    const classes: string[] = [];
    if (left !== '0') classes.push(`${prefix}x-${left}`);
    if (top !== '0') classes.push(`${prefix}y-${top}`);
    return classes;
  }

  // Individual sides
  const classes: string[] = [];
  if (top !== '0') classes.push(`${prefix}t-${top}`);
  if (right !== '0') classes.push(`${prefix}r-${right}`);
  if (bottom !== '0') classes.push(`${prefix}b-${bottom}`);
  if (left !== '0') classes.push(`${prefix}l-${left}`);

  return classes;
}

// Extract a specific class value by pattern
function extractClassValue(classes: string[], pattern: RegExp): string {
  for (const cls of classes) {
    const match = cls.match(pattern);
    if (match) return cls;
  }
  return '';
}

// Replace or add a class matching a pattern
function replaceClass(
  classes: string[],
  pattern: RegExp,
  newClass: string
): string[] {
  const filtered = classes.filter((cls) => !pattern.test(cls));
  if (newClass) {
    return [...filtered, newClass];
  }
  return filtered;
}

// Main useBuilder hook
export function useBuilder() {
  const store = useBuilderStore();

  const selectedElement = useMemo(() => {
    if (!store.selectedId) return null;
    return store.getElementById(store.selectedId);
  }, [store.selectedId, store.getElementById]);

  // Get all classes as a combined string
  const getClassString = useCallback((element: BuilderElement): string => {
    const { styles } = element;
    return [
      ...styles.layout,
      ...styles.spacing,
      ...styles.typography,
      ...styles.colors,
      ...styles.borders,
      ...styles.effects,
    ].join(' ');
  }, []);

  // Update a specific style category
  const updateStyleCategory = useCallback(
    (category: keyof ElementStyles, classes: string[]) => {
      if (!store.selectedId) return;
      store.updateElementStyles(store.selectedId, category, classes);
    },
    [store.selectedId, store.updateElementStyles]
  );

  // Update element props
  const updateProp = useCallback(
    (key: string, value: string | number | boolean | object) => {
      const currentElement = store.selectedId ? store.getElementById(store.selectedId) : null;
      if (!currentElement) return;
      store.updateElement(currentElement.id, {
        props: { ...currentElement.props, [key]: value },
      });
    },
    [store]
  );

  // Layout helpers
  const getLayoutValue = useCallback(
    (pattern: RegExp): string => {
      if (!selectedElement) return '';
      return extractClassValue(selectedElement.styles.layout, pattern);
    },
    [selectedElement]
  );

  const setLayoutValue = useCallback(
    (pattern: RegExp, newClass: string) => {
      if (!selectedElement) return;
      const newClasses = replaceClass(
        selectedElement.styles.layout,
        pattern,
        newClass
      );
      updateStyleCategory('layout', newClasses);
    },
    [selectedElement, updateStyleCategory]
  );

  // Spacing helpers
  const getPadding = useCallback((): SpacingValues => {
    if (!selectedElement) return { top: '0', right: '0', bottom: '0', left: '0' };
    return parseSpacingClasses(selectedElement.styles.spacing, 'p');
  }, [selectedElement]);

  const setPadding = useCallback(
    (values: SpacingValues) => {
      if (!selectedElement) return;
      // Remove all padding classes first
      const filtered = selectedElement.styles.spacing.filter(
        (cls) => !cls.match(/^p[trblxy]?-/)
      );
      const newClasses = [...filtered, ...spacingToClasses(values, 'p')];
      updateStyleCategory('spacing', newClasses);
    },
    [selectedElement, updateStyleCategory]
  );

  const getMargin = useCallback((): SpacingValues => {
    if (!selectedElement) return { top: '0', right: '0', bottom: '0', left: '0' };
    return parseSpacingClasses(selectedElement.styles.spacing, 'm');
  }, [selectedElement]);

  const setMargin = useCallback(
    (values: SpacingValues) => {
      if (!selectedElement) return;
      // Remove all margin classes first
      const filtered = selectedElement.styles.spacing.filter(
        (cls) => !cls.match(/^m[trblxy]?-/)
      );
      const newClasses = [...filtered, ...spacingToClasses(values, 'm')];
      updateStyleCategory('spacing', newClasses);
    },
    [selectedElement, updateStyleCategory]
  );

  // Typography helpers
  const getTypographyValue = useCallback(
    (pattern: RegExp): string => {
      if (!selectedElement) return '';
      return extractClassValue(selectedElement.styles.typography, pattern);
    },
    [selectedElement]
  );

  const setTypographyValue = useCallback(
    (pattern: RegExp, newClass: string) => {
      if (!selectedElement) return;
      const newClasses = replaceClass(
        selectedElement.styles.typography,
        pattern,
        newClass
      );
      updateStyleCategory('typography', newClasses);
    },
    [selectedElement, updateStyleCategory]
  );

  // Color helpers
  const getColorValue = useCallback(
    (pattern: RegExp): string => {
      if (!selectedElement) return '';
      return extractClassValue(selectedElement.styles.colors, pattern);
    },
    [selectedElement]
  );

  const setColorValue = useCallback(
    (pattern: RegExp, newClass: string) => {
      if (!selectedElement) return;
      const newClasses = replaceClass(
        selectedElement.styles.colors,
        pattern,
        newClass
      );
      updateStyleCategory('colors', newClasses);
    },
    [selectedElement, updateStyleCategory]
  );

  // Border helpers
  const getBorderValue = useCallback(
    (pattern: RegExp): string => {
      if (!selectedElement) return '';
      return extractClassValue(selectedElement.styles.borders, pattern);
    },
    [selectedElement]
  );

  const setBorderValue = useCallback(
    (pattern: RegExp, newClass: string) => {
      if (!selectedElement) return;
      const newClasses = replaceClass(
        selectedElement.styles.borders,
        pattern,
        newClass
      );
      updateStyleCategory('borders', newClasses);
    },
    [selectedElement, updateStyleCategory]
  );

  // Effect helpers
  const getEffectValue = useCallback(
    (pattern: RegExp): string => {
      if (!selectedElement) return '';
      return extractClassValue(selectedElement.styles.effects, pattern);
    },
    [selectedElement]
  );

  const setEffectValue = useCallback(
    (pattern: RegExp, newClass: string) => {
      if (!selectedElement) return;
      const newClasses = replaceClass(
        selectedElement.styles.effects,
        pattern,
        newClass
      );
      updateStyleCategory('effects', newClasses);
    },
    [selectedElement, updateStyleCategory]
  );

  // Responsive helpers
  const getResponsiveValue = useCallback(
    (breakpoint: 'sm' | 'md' | 'lg', pattern: RegExp): string => {
      if (!selectedElement) return '';
      const classes = selectedElement.styles.responsive[breakpoint] || [];
      return extractClassValue(classes, pattern);
    },
    [selectedElement]
  );

  const setResponsiveValue = useCallback(
    (breakpoint: 'sm' | 'md' | 'lg', pattern: RegExp, newClass: string) => {
      if (!selectedElement) return;
      const currentClasses = selectedElement.styles.responsive[breakpoint] || [];
      const newClasses = replaceClass(currentClasses, pattern, newClass);
      store.updateElement(selectedElement.id, {
        styles: {
          ...selectedElement.styles,
          responsive: {
            ...selectedElement.styles.responsive,
            [breakpoint]: newClasses,
          },
        },
      });
    },
    [selectedElement, store.updateElement]
  );

  // Get gap value
  const getGap = useCallback((): string => {
    if (!selectedElement) return '';
    return extractClassValue(selectedElement.styles.spacing, /^gap-/);
  }, [selectedElement]);

  const setGap = useCallback(
    (value: string) => {
      if (!selectedElement) return;
      const newClasses = replaceClass(
        selectedElement.styles.spacing,
        /^gap-/,
        value
      );
      updateStyleCategory('spacing', newClasses);
    },
    [selectedElement, updateStyleCategory]
  );

  return {
    // State
    selectedElement,
    selectedId: store.selectedId,
    elements: store.elements,
    viewport: store.viewport,
    zoom: store.zoom,
    showGrid: store.showGrid,
    showCodePreview: store.showCodePreview,

    // Actions
    selectElement: store.selectElement,
    removeElement: store.removeElement,
    duplicateElement: store.duplicateElement,
    updateElement: store.updateElement,
    addElement: store.addElement,
    moveElement: store.moveElement,
    clearCanvas: store.clearCanvas,
    undo: store.undo,
    redo: store.redo,
    copyElement: store.copyElement,
    pasteElement: store.pasteElement,

    // Viewport
    setViewport: store.setViewport,
    setZoom: store.setZoom,
    toggleGrid: store.toggleGrid,
    toggleCodePreview: store.toggleCodePreview,

    // Helper functions
    getClassString,
    updateStyleCategory,
    updateProp,
    getElementById: store.getElementById,
    getParentElement: store.getParentElement,

    // Layout
    getLayoutValue,
    setLayoutValue,

    // Spacing
    getPadding,
    setPadding,
    getMargin,
    setMargin,
    getGap,
    setGap,

    // Typography
    getTypographyValue,
    setTypographyValue,

    // Colors
    getColorValue,
    setColorValue,

    // Borders
    getBorderValue,
    setBorderValue,

    // Effects
    getEffectValue,
    setEffectValue,

    // Responsive
    getResponsiveValue,
    setResponsiveValue,
  };
}

// Custom hook for specific property sections
export function useLayoutProperties() {
  const {
    selectedElement,
    getLayoutValue,
    setLayoutValue,
    getGap,
    setGap,
  } = useBuilder();

  return {
    // Width
    width: getLayoutValue(/^w-/),
    setWidth: (value: string) => setLayoutValue(/^w-/, value),

    // Height
    height: getLayoutValue(/^h-/),
    setHeight: (value: string) => setLayoutValue(/^h-/, value),

    // Display
    display: getLayoutValue(/^(block|inline|flex|grid|hidden|inline-block|inline-flex)$/),
    setDisplay: (value: string) => setLayoutValue(/^(block|inline|flex|grid|hidden|inline-block|inline-flex)$/, value),

    // Flex Direction
    flexDirection: getLayoutValue(/^flex-(row|col)/),
    setFlexDirection: (value: string) => setLayoutValue(/^flex-(row|col)/, value),

    // Justify Content
    justifyContent: getLayoutValue(/^justify-/),
    setJustifyContent: (value: string) => setLayoutValue(/^justify-/, value),

    // Align Items
    alignItems: getLayoutValue(/^items-/),
    setAlignItems: (value: string) => setLayoutValue(/^items-/, value),

    // Flex Wrap
    flexWrap: getLayoutValue(/^flex-(wrap|nowrap|wrap-reverse)$/),
    setFlexWrap: (value: string) => setLayoutValue(/^flex-(wrap|nowrap|wrap-reverse)$/, value),

    // Gap
    gap: getGap(),
    setGap,

    // Position
    position: getLayoutValue(/^(static|fixed|absolute|relative|sticky)$/),
    setPosition: (value: string) => setLayoutValue(/^(static|fixed|absolute|relative|sticky)$/, value),

    // Grid cols
    gridCols: getLayoutValue(/^grid-cols-/),
    setGridCols: (value: string) => setLayoutValue(/^grid-cols-/, value),

    selectedElement,
  };
}

export function useTypographyProperties() {
  const {
    selectedElement,
    getTypographyValue,
    setTypographyValue,
    getColorValue,
    setColorValue,
  } = useBuilder();

  return {
    // Font Size
    fontSize: getTypographyValue(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/),
    setFontSize: (value: string) => setTypographyValue(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/, value),

    // Font Weight
    fontWeight: getTypographyValue(/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/),
    setFontWeight: (value: string) => setTypographyValue(/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/, value),

    // Text Align
    textAlign: getTypographyValue(/^text-(left|center|right|justify)$/),
    setTextAlign: (value: string) => setTypographyValue(/^text-(left|center|right|justify)$/, value),

    // Line Height
    lineHeight: getTypographyValue(/^leading-/),
    setLineHeight: (value: string) => setTypographyValue(/^leading-/, value),

    // Letter Spacing
    letterSpacing: getTypographyValue(/^tracking-/),
    setLetterSpacing: (value: string) => setTypographyValue(/^tracking-/, value),

    // Text Color
    textColor: getColorValue(/^text-(?!left|center|right|justify)/),
    setTextColor: (value: string) => setColorValue(/^text-(?!left|center|right|justify)/, value),

    selectedElement,
  };
}

export function useStyleProperties() {
  const {
    selectedElement,
    getColorValue,
    setColorValue,
    getBorderValue,
    setBorderValue,
    getEffectValue,
    setEffectValue,
  } = useBuilder();

  return {
    // Background
    backgroundColor: getColorValue(/^bg-/),
    setBackgroundColor: (value: string) => setColorValue(/^bg-/, value),

    // Border Width
    borderWidth: getBorderValue(/^border(-[0248])?$/),
    setBorderWidth: (value: string) => setBorderValue(/^border(-[0248])?$/, value),

    // Border Color
    borderColor: getBorderValue(/^border-(?!0|2|4|8)/),
    setBorderColor: (value: string) => setBorderValue(/^border-(?!0|2|4|8)/, value),

    // Border Radius
    borderRadius: getBorderValue(/^rounded/),
    setBorderRadius: (value: string) => setBorderValue(/^rounded/, value),

    // Shadow
    shadow: getEffectValue(/^shadow/),
    setShadow: (value: string) => setEffectValue(/^shadow/, value),

    // Opacity
    opacity: getEffectValue(/^opacity-/),
    setOpacity: (value: string) => setEffectValue(/^opacity-/, value),

    selectedElement,
  };
}
