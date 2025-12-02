// Core builder types

export type ViewportType = 'desktop' | 'tablet' | 'mobile';

export interface ResponsiveStyles {
  sm: string[];
  md: string[];
  lg: string[];
}

export interface ElementStyles {
  layout: string[];
  spacing: string[];
  typography: string[];
  colors: string[];
  borders: string[];
  effects: string[];
  responsive: ResponsiveStyles;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PropValue = any;

export interface BuilderElement {
  id: string;
  type: string;
  name: string;
  props: Record<string, PropValue>;
  styles: ElementStyles;
  children: BuilderElement[];
  parentId: string | null;
}

export interface ComponentDefinition {
  type: string;
  name: string;
  category: ComponentCategory;
  icon: string;
  defaultProps: Record<string, PropValue>;
  defaultStyles: ElementStyles;
  defaultChildren?: BuilderElement[];
  isContainer: boolean;
  acceptsChildren: boolean;
}

export type ComponentCategory =
  | 'buttons'
  | 'cards'
  | 'navigation'
  | 'forms'
  | 'sections'
  | 'layout'
  | 'media'
  | 'text';

export interface HistoryState {
  elements: BuilderElement[];
  timestamp: number;
}

export interface BuilderState {
  // Canvas state
  elements: BuilderElement[];
  selectedId: string | null;
  hoveredId: string | null;

  // Viewport & display
  viewport: ViewportType;
  zoom: number;
  showGrid: boolean;
  showCodePreview: boolean;

  // History
  history: HistoryState[];
  historyIndex: number;

  // Clipboard
  clipboard: BuilderElement | null;

  // Sidebar
  sidebarCollapsed: boolean;
  propertiesPanelCollapsed: boolean;

  // Actions
  addElement: (element: BuilderElement, parentId?: string | null, index?: number) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  updateElementStyles: (id: string, category: keyof ElementStyles, classes: string[]) => void;
  selectElement: (id: string | null) => void;
  setHoveredElement: (id: string | null) => void;
  moveElement: (activeId: string, overId: string, position: 'before' | 'after' | 'inside') => void;
  duplicateElement: (id: string) => void;

  // Viewport actions
  setViewport: (viewport: ViewportType) => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  toggleCodePreview: () => void;

  // History actions
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;

  // Clipboard actions
  copyElement: (id: string) => void;
  pasteElement: (parentId?: string | null) => void;

  // Canvas actions
  clearCanvas: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;

  // Sidebar actions
  toggleSidebar: () => void;
  togglePropertiesPanel: () => void;

  // Helper
  getElementById: (id: string) => BuilderElement | null;
  getParentElement: (id: string) => BuilderElement | null;
}

export interface DragItem {
  id: string;
  type: string;
  isNew: boolean;
  element?: BuilderElement;
}

export interface DropIndicator {
  id: string;
  position: 'before' | 'after' | 'inside';
}

// Property panel types
export interface PropertyTab {
  id: string;
  label: string;
  icon: string;
}

export interface PropertyField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'color' | 'toggle' | 'spacing' | 'slider';
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
}

// Code generation types
export interface GeneratedCode {
  jsx: string;
  tsx: string;
}

export interface ExportOptions {
  format: 'jsx' | 'tsx' | 'project';
  includeImports: boolean;
  componentName: string;
}
