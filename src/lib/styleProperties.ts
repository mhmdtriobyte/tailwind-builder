// Comprehensive CSS Property Definitions for Visual Builder
// Complete type-safe definitions for every CSS property

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type CSSUnit = 'px' | 'em' | 'rem' | '%' | 'vw' | 'vh' | 'vmin' | 'vmax' | 'ch' | 'ex' | 'auto' | 'none';

export interface CSSValueWithUnit {
  value: number;
  unit: CSSUnit;
}

export interface PropertyOption {
  label: string;
  value: string;
  description?: string;
  preview?: string;
}

export interface PropertyDefinition {
  name: string;
  cssProperty: string;
  category: StyleCategory;
  type: 'select' | 'slider' | 'color' | 'text' | 'number' | 'unit' | 'multi' | 'composite';
  options?: PropertyOption[];
  min?: number;
  max?: number;
  step?: number;
  units?: CSSUnit[];
  defaultValue: string;
  tailwindPrefix?: string;
  description?: string;
}

export type StyleCategory =
  | 'layout'
  | 'flexbox'
  | 'grid'
  | 'boxModel'
  | 'typography'
  | 'background'
  | 'borders'
  | 'effects'
  | 'transforms'
  | 'transitions'
  | 'masks'
  | 'columns'
  | 'filters';

// ============================================================================
// LAYOUT PROPERTIES
// ============================================================================

export const displayOptions: PropertyOption[] = [
  { label: 'Block', value: 'block', description: 'Block-level element' },
  { label: 'Inline', value: 'inline', description: 'Inline element' },
  { label: 'Inline Block', value: 'inline-block', description: 'Inline-level block container' },
  { label: 'Flex', value: 'flex', description: 'Block-level flex container' },
  { label: 'Inline Flex', value: 'inline-flex', description: 'Inline-level flex container' },
  { label: 'Grid', value: 'grid', description: 'Block-level grid container' },
  { label: 'Inline Grid', value: 'inline-grid', description: 'Inline-level grid container' },
  { label: 'Contents', value: 'contents', description: 'No box, children are box-level' },
  { label: 'Flow Root', value: 'flow-root', description: 'Block box establishing new BFC' },
  { label: 'List Item', value: 'list-item', description: 'Block box with list marker' },
  { label: 'Hidden', value: 'hidden', description: 'Element is not rendered' },
  { label: 'Table', value: 'table', description: 'Table element' },
  { label: 'Table Row', value: 'table-row', description: 'Table row element' },
  { label: 'Table Cell', value: 'table-cell', description: 'Table cell element' },
];

export const positionOptions: PropertyOption[] = [
  { label: 'Static', value: 'static', description: 'Normal flow positioning' },
  { label: 'Relative', value: 'relative', description: 'Relative to normal position' },
  { label: 'Absolute', value: 'absolute', description: 'Relative to positioned ancestor' },
  { label: 'Fixed', value: 'fixed', description: 'Relative to viewport' },
  { label: 'Sticky', value: 'sticky', description: 'Relative then fixed on scroll' },
];

export const zIndexOptions: PropertyOption[] = [
  { label: 'Auto', value: 'z-auto' },
  { label: '0', value: 'z-0' },
  { label: '10', value: 'z-10' },
  { label: '20', value: 'z-20' },
  { label: '30', value: 'z-30' },
  { label: '40', value: 'z-40' },
  { label: '50', value: 'z-50' },
];

export const overflowOptions: PropertyOption[] = [
  { label: 'Visible', value: 'overflow-visible', description: 'Content not clipped' },
  { label: 'Hidden', value: 'overflow-hidden', description: 'Content clipped, no scrollbars' },
  { label: 'Scroll', value: 'overflow-scroll', description: 'Always show scrollbars' },
  { label: 'Auto', value: 'overflow-auto', description: 'Scrollbars when needed' },
  { label: 'Clip', value: 'overflow-clip', description: 'Clip at padding box' },
];

export const overflowXOptions: PropertyOption[] = [
  { label: 'Visible', value: 'overflow-x-visible' },
  { label: 'Hidden', value: 'overflow-x-hidden' },
  { label: 'Scroll', value: 'overflow-x-scroll' },
  { label: 'Auto', value: 'overflow-x-auto' },
  { label: 'Clip', value: 'overflow-x-clip' },
];

export const overflowYOptions: PropertyOption[] = [
  { label: 'Visible', value: 'overflow-y-visible' },
  { label: 'Hidden', value: 'overflow-y-hidden' },
  { label: 'Scroll', value: 'overflow-y-scroll' },
  { label: 'Auto', value: 'overflow-y-auto' },
  { label: 'Clip', value: 'overflow-y-clip' },
];

export const floatOptions: PropertyOption[] = [
  { label: 'None', value: 'float-none' },
  { label: 'Left', value: 'float-left' },
  { label: 'Right', value: 'float-right' },
  { label: 'Start', value: 'float-start' },
  { label: 'End', value: 'float-end' },
];

export const clearOptions: PropertyOption[] = [
  { label: 'None', value: 'clear-none' },
  { label: 'Left', value: 'clear-left' },
  { label: 'Right', value: 'clear-right' },
  { label: 'Both', value: 'clear-both' },
  { label: 'Start', value: 'clear-start' },
  { label: 'End', value: 'clear-end' },
];

export const objectFitOptions: PropertyOption[] = [
  { label: 'Contain', value: 'object-contain' },
  { label: 'Cover', value: 'object-cover' },
  { label: 'Fill', value: 'object-fill' },
  { label: 'None', value: 'object-none' },
  { label: 'Scale Down', value: 'object-scale-down' },
];

export const objectPositionOptions: PropertyOption[] = [
  { label: 'Center', value: 'object-center' },
  { label: 'Top', value: 'object-top' },
  { label: 'Bottom', value: 'object-bottom' },
  { label: 'Left', value: 'object-left' },
  { label: 'Right', value: 'object-right' },
  { label: 'Left Top', value: 'object-left-top' },
  { label: 'Left Bottom', value: 'object-left-bottom' },
  { label: 'Right Top', value: 'object-right-top' },
  { label: 'Right Bottom', value: 'object-right-bottom' },
];

export const visibilityOptions: PropertyOption[] = [
  { label: 'Visible', value: 'visible' },
  { label: 'Invisible', value: 'invisible' },
  { label: 'Collapse', value: 'collapse' },
];

// ============================================================================
// FLEXBOX PROPERTIES
// ============================================================================

export const flexDirectionOptions: PropertyOption[] = [
  { label: 'Row', value: 'flex-row', description: 'Left to right' },
  { label: 'Row Reverse', value: 'flex-row-reverse', description: 'Right to left' },
  { label: 'Column', value: 'flex-col', description: 'Top to bottom' },
  { label: 'Column Reverse', value: 'flex-col-reverse', description: 'Bottom to top' },
];

export const flexWrapOptions: PropertyOption[] = [
  { label: 'No Wrap', value: 'flex-nowrap', description: 'Single line' },
  { label: 'Wrap', value: 'flex-wrap', description: 'Multiple lines' },
  { label: 'Wrap Reverse', value: 'flex-wrap-reverse', description: 'Multiple lines, reversed' },
];

export const justifyContentOptions: PropertyOption[] = [
  { label: 'Start', value: 'justify-start', description: 'Pack items at start' },
  { label: 'End', value: 'justify-end', description: 'Pack items at end' },
  { label: 'Center', value: 'justify-center', description: 'Pack items at center' },
  { label: 'Between', value: 'justify-between', description: 'Distribute with space between' },
  { label: 'Around', value: 'justify-around', description: 'Distribute with space around' },
  { label: 'Evenly', value: 'justify-evenly', description: 'Distribute with equal space' },
  { label: 'Stretch', value: 'justify-stretch', description: 'Stretch to fill' },
  { label: 'Normal', value: 'justify-normal', description: 'Default alignment' },
];

export const alignItemsOptions: PropertyOption[] = [
  { label: 'Start', value: 'items-start', description: 'Align at start' },
  { label: 'End', value: 'items-end', description: 'Align at end' },
  { label: 'Center', value: 'items-center', description: 'Align at center' },
  { label: 'Baseline', value: 'items-baseline', description: 'Align at baseline' },
  { label: 'Stretch', value: 'items-stretch', description: 'Stretch to fill' },
];

export const alignContentOptions: PropertyOption[] = [
  { label: 'Start', value: 'content-start' },
  { label: 'End', value: 'content-end' },
  { label: 'Center', value: 'content-center' },
  { label: 'Between', value: 'content-between' },
  { label: 'Around', value: 'content-around' },
  { label: 'Evenly', value: 'content-evenly' },
  { label: 'Stretch', value: 'content-stretch' },
  { label: 'Baseline', value: 'content-baseline' },
  { label: 'Normal', value: 'content-normal' },
];

export const alignSelfOptions: PropertyOption[] = [
  { label: 'Auto', value: 'self-auto' },
  { label: 'Start', value: 'self-start' },
  { label: 'End', value: 'self-end' },
  { label: 'Center', value: 'self-center' },
  { label: 'Stretch', value: 'self-stretch' },
  { label: 'Baseline', value: 'self-baseline' },
];

export const justifySelfOptions: PropertyOption[] = [
  { label: 'Auto', value: 'justify-self-auto' },
  { label: 'Start', value: 'justify-self-start' },
  { label: 'End', value: 'justify-self-end' },
  { label: 'Center', value: 'justify-self-center' },
  { label: 'Stretch', value: 'justify-self-stretch' },
];

export const justifyItemsOptions: PropertyOption[] = [
  { label: 'Start', value: 'justify-items-start' },
  { label: 'End', value: 'justify-items-end' },
  { label: 'Center', value: 'justify-items-center' },
  { label: 'Stretch', value: 'justify-items-stretch' },
];

export const placeContentOptions: PropertyOption[] = [
  { label: 'Start', value: 'place-content-start' },
  { label: 'End', value: 'place-content-end' },
  { label: 'Center', value: 'place-content-center' },
  { label: 'Between', value: 'place-content-between' },
  { label: 'Around', value: 'place-content-around' },
  { label: 'Evenly', value: 'place-content-evenly' },
  { label: 'Stretch', value: 'place-content-stretch' },
  { label: 'Baseline', value: 'place-content-baseline' },
];

export const placeItemsOptions: PropertyOption[] = [
  { label: 'Start', value: 'place-items-start' },
  { label: 'End', value: 'place-items-end' },
  { label: 'Center', value: 'place-items-center' },
  { label: 'Stretch', value: 'place-items-stretch' },
  { label: 'Baseline', value: 'place-items-baseline' },
];

export const placeSelfOptions: PropertyOption[] = [
  { label: 'Auto', value: 'place-self-auto' },
  { label: 'Start', value: 'place-self-start' },
  { label: 'End', value: 'place-self-end' },
  { label: 'Center', value: 'place-self-center' },
  { label: 'Stretch', value: 'place-self-stretch' },
];

export const flexGrowOptions: PropertyOption[] = [
  { label: '0', value: 'grow-0' },
  { label: '1', value: 'grow' },
];

export const flexShrinkOptions: PropertyOption[] = [
  { label: '0', value: 'shrink-0' },
  { label: '1', value: 'shrink' },
];

export const flexBasisOptions: PropertyOption[] = [
  { label: 'Auto', value: 'basis-auto' },
  { label: '0', value: 'basis-0' },
  { label: '1/2', value: 'basis-1/2' },
  { label: '1/3', value: 'basis-1/3' },
  { label: '2/3', value: 'basis-2/3' },
  { label: '1/4', value: 'basis-1/4' },
  { label: '3/4', value: 'basis-3/4' },
  { label: 'Full', value: 'basis-full' },
];

export const orderOptions: PropertyOption[] = [
  { label: 'First', value: 'order-first' },
  { label: 'Last', value: 'order-last' },
  { label: 'None', value: 'order-none' },
  { label: '1', value: 'order-1' },
  { label: '2', value: 'order-2' },
  { label: '3', value: 'order-3' },
  { label: '4', value: 'order-4' },
  { label: '5', value: 'order-5' },
  { label: '6', value: 'order-6' },
  { label: '7', value: 'order-7' },
  { label: '8', value: 'order-8' },
  { label: '9', value: 'order-9' },
  { label: '10', value: 'order-10' },
  { label: '11', value: 'order-11' },
  { label: '12', value: 'order-12' },
];

// Flexbox visual presets
export const flexboxPresets: PropertyOption[] = [
  { label: 'Center All', value: 'flex items-center justify-center', description: 'Center both axes' },
  { label: 'Row Space Between', value: 'flex flex-row justify-between items-center', description: 'Horizontal with space' },
  { label: 'Column Center', value: 'flex flex-col items-center', description: 'Vertical centered' },
  { label: 'Stack', value: 'flex flex-col gap-4', description: 'Vertical stack with gap' },
  { label: 'Row Wrap', value: 'flex flex-wrap gap-4', description: 'Wrapping row' },
  { label: 'Sidebar Layout', value: 'flex', description: 'Sidebar and content' },
  { label: 'Sticky Footer', value: 'flex flex-col min-h-screen', description: 'Content with sticky footer' },
  { label: 'Equal Width', value: 'flex', description: 'Equal width children' },
];

// ============================================================================
// GRID PROPERTIES
// ============================================================================

export const gridTemplateColumnsOptions: PropertyOption[] = [
  { label: 'None', value: 'grid-cols-none' },
  { label: '1', value: 'grid-cols-1' },
  { label: '2', value: 'grid-cols-2' },
  { label: '3', value: 'grid-cols-3' },
  { label: '4', value: 'grid-cols-4' },
  { label: '5', value: 'grid-cols-5' },
  { label: '6', value: 'grid-cols-6' },
  { label: '7', value: 'grid-cols-7' },
  { label: '8', value: 'grid-cols-8' },
  { label: '9', value: 'grid-cols-9' },
  { label: '10', value: 'grid-cols-10' },
  { label: '11', value: 'grid-cols-11' },
  { label: '12', value: 'grid-cols-12' },
  { label: 'Subgrid', value: 'grid-cols-subgrid' },
];

export const gridTemplateRowsOptions: PropertyOption[] = [
  { label: 'None', value: 'grid-rows-none' },
  { label: '1', value: 'grid-rows-1' },
  { label: '2', value: 'grid-rows-2' },
  { label: '3', value: 'grid-rows-3' },
  { label: '4', value: 'grid-rows-4' },
  { label: '5', value: 'grid-rows-5' },
  { label: '6', value: 'grid-rows-6' },
  { label: 'Subgrid', value: 'grid-rows-subgrid' },
];

export const gridColumnSpanOptions: PropertyOption[] = [
  { label: 'Auto', value: 'col-auto' },
  { label: 'Span 1', value: 'col-span-1' },
  { label: 'Span 2', value: 'col-span-2' },
  { label: 'Span 3', value: 'col-span-3' },
  { label: 'Span 4', value: 'col-span-4' },
  { label: 'Span 5', value: 'col-span-5' },
  { label: 'Span 6', value: 'col-span-6' },
  { label: 'Span 7', value: 'col-span-7' },
  { label: 'Span 8', value: 'col-span-8' },
  { label: 'Span 9', value: 'col-span-9' },
  { label: 'Span 10', value: 'col-span-10' },
  { label: 'Span 11', value: 'col-span-11' },
  { label: 'Span 12', value: 'col-span-12' },
  { label: 'Span Full', value: 'col-span-full' },
];

export const gridColumnStartOptions: PropertyOption[] = [
  { label: 'Auto', value: 'col-start-auto' },
  { label: '1', value: 'col-start-1' },
  { label: '2', value: 'col-start-2' },
  { label: '3', value: 'col-start-3' },
  { label: '4', value: 'col-start-4' },
  { label: '5', value: 'col-start-5' },
  { label: '6', value: 'col-start-6' },
  { label: '7', value: 'col-start-7' },
  { label: '8', value: 'col-start-8' },
  { label: '9', value: 'col-start-9' },
  { label: '10', value: 'col-start-10' },
  { label: '11', value: 'col-start-11' },
  { label: '12', value: 'col-start-12' },
  { label: '13', value: 'col-start-13' },
];

export const gridColumnEndOptions: PropertyOption[] = [
  { label: 'Auto', value: 'col-end-auto' },
  { label: '1', value: 'col-end-1' },
  { label: '2', value: 'col-end-2' },
  { label: '3', value: 'col-end-3' },
  { label: '4', value: 'col-end-4' },
  { label: '5', value: 'col-end-5' },
  { label: '6', value: 'col-end-6' },
  { label: '7', value: 'col-end-7' },
  { label: '8', value: 'col-end-8' },
  { label: '9', value: 'col-end-9' },
  { label: '10', value: 'col-end-10' },
  { label: '11', value: 'col-end-11' },
  { label: '12', value: 'col-end-12' },
  { label: '13', value: 'col-end-13' },
];

export const gridRowSpanOptions: PropertyOption[] = [
  { label: 'Auto', value: 'row-auto' },
  { label: 'Span 1', value: 'row-span-1' },
  { label: 'Span 2', value: 'row-span-2' },
  { label: 'Span 3', value: 'row-span-3' },
  { label: 'Span 4', value: 'row-span-4' },
  { label: 'Span 5', value: 'row-span-5' },
  { label: 'Span 6', value: 'row-span-6' },
  { label: 'Span Full', value: 'row-span-full' },
];

export const gridRowStartOptions: PropertyOption[] = [
  { label: 'Auto', value: 'row-start-auto' },
  { label: '1', value: 'row-start-1' },
  { label: '2', value: 'row-start-2' },
  { label: '3', value: 'row-start-3' },
  { label: '4', value: 'row-start-4' },
  { label: '5', value: 'row-start-5' },
  { label: '6', value: 'row-start-6' },
  { label: '7', value: 'row-start-7' },
];

export const gridRowEndOptions: PropertyOption[] = [
  { label: 'Auto', value: 'row-end-auto' },
  { label: '1', value: 'row-end-1' },
  { label: '2', value: 'row-end-2' },
  { label: '3', value: 'row-end-3' },
  { label: '4', value: 'row-end-4' },
  { label: '5', value: 'row-end-5' },
  { label: '6', value: 'row-end-6' },
  { label: '7', value: 'row-end-7' },
];

export const gridAutoFlowOptions: PropertyOption[] = [
  { label: 'Row', value: 'grid-flow-row' },
  { label: 'Column', value: 'grid-flow-col' },
  { label: 'Dense', value: 'grid-flow-dense' },
  { label: 'Row Dense', value: 'grid-flow-row-dense' },
  { label: 'Column Dense', value: 'grid-flow-col-dense' },
];

export const gridAutoColumnsOptions: PropertyOption[] = [
  { label: 'Auto', value: 'auto-cols-auto' },
  { label: 'Min', value: 'auto-cols-min' },
  { label: 'Max', value: 'auto-cols-max' },
  { label: 'Fr', value: 'auto-cols-fr' },
];

export const gridAutoRowsOptions: PropertyOption[] = [
  { label: 'Auto', value: 'auto-rows-auto' },
  { label: 'Min', value: 'auto-rows-min' },
  { label: 'Max', value: 'auto-rows-max' },
  { label: 'Fr', value: 'auto-rows-fr' },
];

// Grid visual presets
export const gridPresets: PropertyOption[] = [
  { label: '2 Column Equal', value: 'grid grid-cols-2 gap-4', description: 'Two equal columns' },
  { label: '3 Column Equal', value: 'grid grid-cols-3 gap-4', description: 'Three equal columns' },
  { label: '4 Column Equal', value: 'grid grid-cols-4 gap-4', description: 'Four equal columns' },
  { label: '12 Column', value: 'grid grid-cols-12 gap-4', description: 'Twelve column grid' },
  { label: 'Sidebar Left', value: 'grid grid-cols-[250px_1fr] gap-4', description: '250px sidebar' },
  { label: 'Sidebar Right', value: 'grid grid-cols-[1fr_250px] gap-4', description: 'Content with sidebar' },
  { label: 'Holy Grail', value: 'grid grid-cols-[200px_1fr_200px] gap-4', description: 'Classic 3-column' },
  { label: 'Card Grid', value: 'grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6', description: 'Responsive cards' },
  { label: 'Masonry', value: 'columns-3 gap-4', description: 'Pinterest-style' },
  { label: 'Feature Grid', value: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6', description: 'Responsive features' },
];

// ============================================================================
// BOX MODEL PROPERTIES
// ============================================================================

export const widthOptions: PropertyOption[] = [
  { label: 'Auto', value: 'w-auto' },
  { label: '0', value: 'w-0' },
  { label: 'px', value: 'w-px' },
  { label: '0.5', value: 'w-0.5' },
  { label: '1', value: 'w-1' },
  { label: '1.5', value: 'w-1.5' },
  { label: '2', value: 'w-2' },
  { label: '2.5', value: 'w-2.5' },
  { label: '3', value: 'w-3' },
  { label: '3.5', value: 'w-3.5' },
  { label: '4', value: 'w-4' },
  { label: '5', value: 'w-5' },
  { label: '6', value: 'w-6' },
  { label: '7', value: 'w-7' },
  { label: '8', value: 'w-8' },
  { label: '9', value: 'w-9' },
  { label: '10', value: 'w-10' },
  { label: '11', value: 'w-11' },
  { label: '12', value: 'w-12' },
  { label: '14', value: 'w-14' },
  { label: '16', value: 'w-16' },
  { label: '20', value: 'w-20' },
  { label: '24', value: 'w-24' },
  { label: '28', value: 'w-28' },
  { label: '32', value: 'w-32' },
  { label: '36', value: 'w-36' },
  { label: '40', value: 'w-40' },
  { label: '44', value: 'w-44' },
  { label: '48', value: 'w-48' },
  { label: '52', value: 'w-52' },
  { label: '56', value: 'w-56' },
  { label: '60', value: 'w-60' },
  { label: '64', value: 'w-64' },
  { label: '72', value: 'w-72' },
  { label: '80', value: 'w-80' },
  { label: '96', value: 'w-96' },
  { label: '1/2', value: 'w-1/2' },
  { label: '1/3', value: 'w-1/3' },
  { label: '2/3', value: 'w-2/3' },
  { label: '1/4', value: 'w-1/4' },
  { label: '2/4', value: 'w-2/4' },
  { label: '3/4', value: 'w-3/4' },
  { label: '1/5', value: 'w-1/5' },
  { label: '2/5', value: 'w-2/5' },
  { label: '3/5', value: 'w-3/5' },
  { label: '4/5', value: 'w-4/5' },
  { label: '1/6', value: 'w-1/6' },
  { label: '5/6', value: 'w-5/6' },
  { label: '1/12', value: 'w-1/12' },
  { label: '5/12', value: 'w-5/12' },
  { label: '7/12', value: 'w-7/12' },
  { label: '11/12', value: 'w-11/12' },
  { label: 'Full', value: 'w-full' },
  { label: 'Screen', value: 'w-screen' },
  { label: 'Min', value: 'w-min' },
  { label: 'Max', value: 'w-max' },
  { label: 'Fit', value: 'w-fit' },
];

export const heightOptions: PropertyOption[] = [
  { label: 'Auto', value: 'h-auto' },
  { label: '0', value: 'h-0' },
  { label: 'px', value: 'h-px' },
  { label: '0.5', value: 'h-0.5' },
  { label: '1', value: 'h-1' },
  { label: '1.5', value: 'h-1.5' },
  { label: '2', value: 'h-2' },
  { label: '2.5', value: 'h-2.5' },
  { label: '3', value: 'h-3' },
  { label: '3.5', value: 'h-3.5' },
  { label: '4', value: 'h-4' },
  { label: '5', value: 'h-5' },
  { label: '6', value: 'h-6' },
  { label: '7', value: 'h-7' },
  { label: '8', value: 'h-8' },
  { label: '9', value: 'h-9' },
  { label: '10', value: 'h-10' },
  { label: '11', value: 'h-11' },
  { label: '12', value: 'h-12' },
  { label: '14', value: 'h-14' },
  { label: '16', value: 'h-16' },
  { label: '20', value: 'h-20' },
  { label: '24', value: 'h-24' },
  { label: '28', value: 'h-28' },
  { label: '32', value: 'h-32' },
  { label: '36', value: 'h-36' },
  { label: '40', value: 'h-40' },
  { label: '44', value: 'h-44' },
  { label: '48', value: 'h-48' },
  { label: '52', value: 'h-52' },
  { label: '56', value: 'h-56' },
  { label: '60', value: 'h-60' },
  { label: '64', value: 'h-64' },
  { label: '72', value: 'h-72' },
  { label: '80', value: 'h-80' },
  { label: '96', value: 'h-96' },
  { label: '1/2', value: 'h-1/2' },
  { label: '1/3', value: 'h-1/3' },
  { label: '2/3', value: 'h-2/3' },
  { label: '1/4', value: 'h-1/4' },
  { label: '2/4', value: 'h-2/4' },
  { label: '3/4', value: 'h-3/4' },
  { label: '1/5', value: 'h-1/5' },
  { label: '2/5', value: 'h-2/5' },
  { label: '3/5', value: 'h-3/5' },
  { label: '4/5', value: 'h-4/5' },
  { label: '1/6', value: 'h-1/6' },
  { label: '5/6', value: 'h-5/6' },
  { label: 'Full', value: 'h-full' },
  { label: 'Screen', value: 'h-screen' },
  { label: 'Svh', value: 'h-svh' },
  { label: 'Lvh', value: 'h-lvh' },
  { label: 'Dvh', value: 'h-dvh' },
  { label: 'Min', value: 'h-min' },
  { label: 'Max', value: 'h-max' },
  { label: 'Fit', value: 'h-fit' },
];

export const minWidthOptions: PropertyOption[] = [
  { label: '0', value: 'min-w-0' },
  { label: 'Full', value: 'min-w-full' },
  { label: 'Min', value: 'min-w-min' },
  { label: 'Max', value: 'min-w-max' },
  { label: 'Fit', value: 'min-w-fit' },
];

export const maxWidthOptions: PropertyOption[] = [
  { label: 'None', value: 'max-w-none' },
  { label: '0', value: 'max-w-0' },
  { label: 'XS', value: 'max-w-xs' },
  { label: 'SM', value: 'max-w-sm' },
  { label: 'MD', value: 'max-w-md' },
  { label: 'LG', value: 'max-w-lg' },
  { label: 'XL', value: 'max-w-xl' },
  { label: '2XL', value: 'max-w-2xl' },
  { label: '3XL', value: 'max-w-3xl' },
  { label: '4XL', value: 'max-w-4xl' },
  { label: '5XL', value: 'max-w-5xl' },
  { label: '6XL', value: 'max-w-6xl' },
  { label: '7XL', value: 'max-w-7xl' },
  { label: 'Full', value: 'max-w-full' },
  { label: 'Min', value: 'max-w-min' },
  { label: 'Max', value: 'max-w-max' },
  { label: 'Fit', value: 'max-w-fit' },
  { label: 'Prose', value: 'max-w-prose' },
  { label: 'Screen SM', value: 'max-w-screen-sm' },
  { label: 'Screen MD', value: 'max-w-screen-md' },
  { label: 'Screen LG', value: 'max-w-screen-lg' },
  { label: 'Screen XL', value: 'max-w-screen-xl' },
  { label: 'Screen 2XL', value: 'max-w-screen-2xl' },
];

export const minHeightOptions: PropertyOption[] = [
  { label: '0', value: 'min-h-0' },
  { label: 'Full', value: 'min-h-full' },
  { label: 'Screen', value: 'min-h-screen' },
  { label: 'Svh', value: 'min-h-svh' },
  { label: 'Lvh', value: 'min-h-lvh' },
  { label: 'Dvh', value: 'min-h-dvh' },
  { label: 'Min', value: 'min-h-min' },
  { label: 'Max', value: 'min-h-max' },
  { label: 'Fit', value: 'min-h-fit' },
];

export const maxHeightOptions: PropertyOption[] = [
  { label: 'None', value: 'max-h-none' },
  { label: '0', value: 'max-h-0' },
  { label: 'Full', value: 'max-h-full' },
  { label: 'Screen', value: 'max-h-screen' },
  { label: 'Svh', value: 'max-h-svh' },
  { label: 'Lvh', value: 'max-h-lvh' },
  { label: 'Dvh', value: 'max-h-dvh' },
  { label: 'Min', value: 'max-h-min' },
  { label: 'Max', value: 'max-h-max' },
  { label: 'Fit', value: 'max-h-fit' },
];

export const boxSizingOptions: PropertyOption[] = [
  { label: 'Border Box', value: 'box-border' },
  { label: 'Content Box', value: 'box-content' },
];

export const spacingOptions: PropertyOption[] = [
  { label: '0', value: '0' },
  { label: 'px', value: 'px' },
  { label: '0.5', value: '0.5' },
  { label: '1', value: '1' },
  { label: '1.5', value: '1.5' },
  { label: '2', value: '2' },
  { label: '2.5', value: '2.5' },
  { label: '3', value: '3' },
  { label: '3.5', value: '3.5' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '14', value: '14' },
  { label: '16', value: '16' },
  { label: '20', value: '20' },
  { label: '24', value: '24' },
  { label: '28', value: '28' },
  { label: '32', value: '32' },
  { label: '36', value: '36' },
  { label: '40', value: '40' },
  { label: '44', value: '44' },
  { label: '48', value: '48' },
  { label: '52', value: '52' },
  { label: '56', value: '56' },
  { label: '60', value: '60' },
  { label: '64', value: '64' },
  { label: '72', value: '72' },
  { label: '80', value: '80' },
  { label: '96', value: '96' },
  { label: 'auto', value: 'auto' },
];

export const gapOptions: PropertyOption[] = [
  { label: '0', value: 'gap-0' },
  { label: 'px', value: 'gap-px' },
  { label: '0.5', value: 'gap-0.5' },
  { label: '1', value: 'gap-1' },
  { label: '1.5', value: 'gap-1.5' },
  { label: '2', value: 'gap-2' },
  { label: '2.5', value: 'gap-2.5' },
  { label: '3', value: 'gap-3' },
  { label: '3.5', value: 'gap-3.5' },
  { label: '4', value: 'gap-4' },
  { label: '5', value: 'gap-5' },
  { label: '6', value: 'gap-6' },
  { label: '7', value: 'gap-7' },
  { label: '8', value: 'gap-8' },
  { label: '9', value: 'gap-9' },
  { label: '10', value: 'gap-10' },
  { label: '11', value: 'gap-11' },
  { label: '12', value: 'gap-12' },
  { label: '14', value: 'gap-14' },
  { label: '16', value: 'gap-16' },
  { label: '20', value: 'gap-20' },
  { label: '24', value: 'gap-24' },
];

// ============================================================================
// TYPOGRAPHY PROPERTIES
// ============================================================================

export const fontFamilyOptions: PropertyOption[] = [
  { label: 'Sans', value: 'font-sans' },
  { label: 'Serif', value: 'font-serif' },
  { label: 'Mono', value: 'font-mono' },
];

export const fontSizeOptions: PropertyOption[] = [
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
  { label: '7XL', value: 'text-7xl' },
  { label: '8XL', value: 'text-8xl' },
  { label: '9XL', value: 'text-9xl' },
];

export const fontWeightOptions: PropertyOption[] = [
  { label: 'Thin', value: 'font-thin' },
  { label: 'Extralight', value: 'font-extralight' },
  { label: 'Light', value: 'font-light' },
  { label: 'Normal', value: 'font-normal' },
  { label: 'Medium', value: 'font-medium' },
  { label: 'Semibold', value: 'font-semibold' },
  { label: 'Bold', value: 'font-bold' },
  { label: 'Extrabold', value: 'font-extrabold' },
  { label: 'Black', value: 'font-black' },
];

export const fontStyleOptions: PropertyOption[] = [
  { label: 'Normal', value: 'not-italic' },
  { label: 'Italic', value: 'italic' },
];

export const textAlignOptions: PropertyOption[] = [
  { label: 'Left', value: 'text-left' },
  { label: 'Center', value: 'text-center' },
  { label: 'Right', value: 'text-right' },
  { label: 'Justify', value: 'text-justify' },
  { label: 'Start', value: 'text-start' },
  { label: 'End', value: 'text-end' },
];

export const textDecorationOptions: PropertyOption[] = [
  { label: 'None', value: 'no-underline' },
  { label: 'Underline', value: 'underline' },
  { label: 'Overline', value: 'overline' },
  { label: 'Line Through', value: 'line-through' },
];

export const textDecorationStyleOptions: PropertyOption[] = [
  { label: 'Solid', value: 'decoration-solid' },
  { label: 'Double', value: 'decoration-double' },
  { label: 'Dotted', value: 'decoration-dotted' },
  { label: 'Dashed', value: 'decoration-dashed' },
  { label: 'Wavy', value: 'decoration-wavy' },
];

export const textDecorationThicknessOptions: PropertyOption[] = [
  { label: 'Auto', value: 'decoration-auto' },
  { label: 'From Font', value: 'decoration-from-font' },
  { label: '0', value: 'decoration-0' },
  { label: '1', value: 'decoration-1' },
  { label: '2', value: 'decoration-2' },
  { label: '4', value: 'decoration-4' },
  { label: '8', value: 'decoration-8' },
];

export const underlineOffsetOptions: PropertyOption[] = [
  { label: 'Auto', value: 'underline-offset-auto' },
  { label: '0', value: 'underline-offset-0' },
  { label: '1', value: 'underline-offset-1' },
  { label: '2', value: 'underline-offset-2' },
  { label: '4', value: 'underline-offset-4' },
  { label: '8', value: 'underline-offset-8' },
];

export const textTransformOptions: PropertyOption[] = [
  { label: 'Normal', value: 'normal-case' },
  { label: 'Uppercase', value: 'uppercase' },
  { label: 'Lowercase', value: 'lowercase' },
  { label: 'Capitalize', value: 'capitalize' },
];

export const textOverflowOptions: PropertyOption[] = [
  { label: 'Truncate', value: 'truncate' },
  { label: 'Ellipsis', value: 'text-ellipsis' },
  { label: 'Clip', value: 'text-clip' },
];

export const textWrapOptions: PropertyOption[] = [
  { label: 'Wrap', value: 'text-wrap' },
  { label: 'No Wrap', value: 'text-nowrap' },
  { label: 'Balance', value: 'text-balance' },
  { label: 'Pretty', value: 'text-pretty' },
];

export const lineHeightOptions: PropertyOption[] = [
  { label: 'None', value: 'leading-none' },
  { label: 'Tight', value: 'leading-tight' },
  { label: 'Snug', value: 'leading-snug' },
  { label: 'Normal', value: 'leading-normal' },
  { label: 'Relaxed', value: 'leading-relaxed' },
  { label: 'Loose', value: 'leading-loose' },
  { label: '3', value: 'leading-3' },
  { label: '4', value: 'leading-4' },
  { label: '5', value: 'leading-5' },
  { label: '6', value: 'leading-6' },
  { label: '7', value: 'leading-7' },
  { label: '8', value: 'leading-8' },
  { label: '9', value: 'leading-9' },
  { label: '10', value: 'leading-10' },
];

export const letterSpacingOptions: PropertyOption[] = [
  { label: 'Tighter', value: 'tracking-tighter' },
  { label: 'Tight', value: 'tracking-tight' },
  { label: 'Normal', value: 'tracking-normal' },
  { label: 'Wide', value: 'tracking-wide' },
  { label: 'Wider', value: 'tracking-wider' },
  { label: 'Widest', value: 'tracking-widest' },
];

export const wordSpacingOptions: PropertyOption[] = [
  { label: 'Normal', value: 'word-spacing-normal' },
  { label: 'Wide', value: 'word-spacing-wide' },
];

export const textIndentOptions: PropertyOption[] = [
  { label: '0', value: 'indent-0' },
  { label: '1', value: 'indent-1' },
  { label: '2', value: 'indent-2' },
  { label: '4', value: 'indent-4' },
  { label: '6', value: 'indent-6' },
  { label: '8', value: 'indent-8' },
  { label: '10', value: 'indent-10' },
];

export const verticalAlignOptions: PropertyOption[] = [
  { label: 'Baseline', value: 'align-baseline' },
  { label: 'Top', value: 'align-top' },
  { label: 'Middle', value: 'align-middle' },
  { label: 'Bottom', value: 'align-bottom' },
  { label: 'Text Top', value: 'align-text-top' },
  { label: 'Text Bottom', value: 'align-text-bottom' },
  { label: 'Sub', value: 'align-sub' },
  { label: 'Super', value: 'align-super' },
];

export const whiteSpaceOptions: PropertyOption[] = [
  { label: 'Normal', value: 'whitespace-normal' },
  { label: 'No Wrap', value: 'whitespace-nowrap' },
  { label: 'Pre', value: 'whitespace-pre' },
  { label: 'Pre Line', value: 'whitespace-pre-line' },
  { label: 'Pre Wrap', value: 'whitespace-pre-wrap' },
  { label: 'Break Spaces', value: 'whitespace-break-spaces' },
];

export const wordBreakOptions: PropertyOption[] = [
  { label: 'Normal', value: 'break-normal' },
  { label: 'Words', value: 'break-words' },
  { label: 'All', value: 'break-all' },
  { label: 'Keep', value: 'break-keep' },
];

export const hyphensOptions: PropertyOption[] = [
  { label: 'None', value: 'hyphens-none' },
  { label: 'Manual', value: 'hyphens-manual' },
  { label: 'Auto', value: 'hyphens-auto' },
];

export const listStyleTypeOptions: PropertyOption[] = [
  { label: 'None', value: 'list-none' },
  { label: 'Disc', value: 'list-disc' },
  { label: 'Decimal', value: 'list-decimal' },
];

export const listStylePositionOptions: PropertyOption[] = [
  { label: 'Inside', value: 'list-inside' },
  { label: 'Outside', value: 'list-outside' },
];

// ============================================================================
// BACKGROUND PROPERTIES
// ============================================================================

export const backgroundAttachmentOptions: PropertyOption[] = [
  { label: 'Fixed', value: 'bg-fixed' },
  { label: 'Local', value: 'bg-local' },
  { label: 'Scroll', value: 'bg-scroll' },
];

export const backgroundClipOptions: PropertyOption[] = [
  { label: 'Border Box', value: 'bg-clip-border' },
  { label: 'Padding Box', value: 'bg-clip-padding' },
  { label: 'Content Box', value: 'bg-clip-content' },
  { label: 'Text', value: 'bg-clip-text' },
];

export const backgroundOriginOptions: PropertyOption[] = [
  { label: 'Border Box', value: 'bg-origin-border' },
  { label: 'Padding Box', value: 'bg-origin-padding' },
  { label: 'Content Box', value: 'bg-origin-content' },
];

export const backgroundPositionOptions: PropertyOption[] = [
  { label: 'Center', value: 'bg-center' },
  { label: 'Top', value: 'bg-top' },
  { label: 'Bottom', value: 'bg-bottom' },
  { label: 'Left', value: 'bg-left' },
  { label: 'Right', value: 'bg-right' },
  { label: 'Left Top', value: 'bg-left-top' },
  { label: 'Left Bottom', value: 'bg-left-bottom' },
  { label: 'Right Top', value: 'bg-right-top' },
  { label: 'Right Bottom', value: 'bg-right-bottom' },
];

export const backgroundRepeatOptions: PropertyOption[] = [
  { label: 'Repeat', value: 'bg-repeat' },
  { label: 'No Repeat', value: 'bg-no-repeat' },
  { label: 'Repeat X', value: 'bg-repeat-x' },
  { label: 'Repeat Y', value: 'bg-repeat-y' },
  { label: 'Round', value: 'bg-repeat-round' },
  { label: 'Space', value: 'bg-repeat-space' },
];

export const backgroundSizeOptions: PropertyOption[] = [
  { label: 'Auto', value: 'bg-auto' },
  { label: 'Cover', value: 'bg-cover' },
  { label: 'Contain', value: 'bg-contain' },
];

export const backgroundBlendModeOptions: PropertyOption[] = [
  { label: 'Normal', value: 'bg-blend-normal' },
  { label: 'Multiply', value: 'bg-blend-multiply' },
  { label: 'Screen', value: 'bg-blend-screen' },
  { label: 'Overlay', value: 'bg-blend-overlay' },
  { label: 'Darken', value: 'bg-blend-darken' },
  { label: 'Lighten', value: 'bg-blend-lighten' },
  { label: 'Color Dodge', value: 'bg-blend-color-dodge' },
  { label: 'Color Burn', value: 'bg-blend-color-burn' },
  { label: 'Hard Light', value: 'bg-blend-hard-light' },
  { label: 'Soft Light', value: 'bg-blend-soft-light' },
  { label: 'Difference', value: 'bg-blend-difference' },
  { label: 'Exclusion', value: 'bg-blend-exclusion' },
  { label: 'Hue', value: 'bg-blend-hue' },
  { label: 'Saturation', value: 'bg-blend-saturation' },
  { label: 'Color', value: 'bg-blend-color' },
  { label: 'Luminosity', value: 'bg-blend-luminosity' },
];

// ============================================================================
// BORDER PROPERTIES
// ============================================================================

export const borderWidthOptions: PropertyOption[] = [
  { label: '0', value: 'border-0' },
  { label: '1', value: 'border' },
  { label: '2', value: 'border-2' },
  { label: '4', value: 'border-4' },
  { label: '8', value: 'border-8' },
];

export const borderStyleOptions: PropertyOption[] = [
  { label: 'Solid', value: 'border-solid' },
  { label: 'Dashed', value: 'border-dashed' },
  { label: 'Dotted', value: 'border-dotted' },
  { label: 'Double', value: 'border-double' },
  { label: 'Hidden', value: 'border-hidden' },
  { label: 'None', value: 'border-none' },
];

export const borderRadiusOptions: PropertyOption[] = [
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

export const borderRadiusTopLeftOptions: PropertyOption[] = [
  { label: 'None', value: 'rounded-tl-none' },
  { label: 'SM', value: 'rounded-tl-sm' },
  { label: 'Default', value: 'rounded-tl' },
  { label: 'MD', value: 'rounded-tl-md' },
  { label: 'LG', value: 'rounded-tl-lg' },
  { label: 'XL', value: 'rounded-tl-xl' },
  { label: '2XL', value: 'rounded-tl-2xl' },
  { label: '3XL', value: 'rounded-tl-3xl' },
  { label: 'Full', value: 'rounded-tl-full' },
];

export const borderRadiusTopRightOptions: PropertyOption[] = [
  { label: 'None', value: 'rounded-tr-none' },
  { label: 'SM', value: 'rounded-tr-sm' },
  { label: 'Default', value: 'rounded-tr' },
  { label: 'MD', value: 'rounded-tr-md' },
  { label: 'LG', value: 'rounded-tr-lg' },
  { label: 'XL', value: 'rounded-tr-xl' },
  { label: '2XL', value: 'rounded-tr-2xl' },
  { label: '3XL', value: 'rounded-tr-3xl' },
  { label: 'Full', value: 'rounded-tr-full' },
];

export const borderRadiusBottomLeftOptions: PropertyOption[] = [
  { label: 'None', value: 'rounded-bl-none' },
  { label: 'SM', value: 'rounded-bl-sm' },
  { label: 'Default', value: 'rounded-bl' },
  { label: 'MD', value: 'rounded-bl-md' },
  { label: 'LG', value: 'rounded-bl-lg' },
  { label: 'XL', value: 'rounded-bl-xl' },
  { label: '2XL', value: 'rounded-bl-2xl' },
  { label: '3XL', value: 'rounded-bl-3xl' },
  { label: 'Full', value: 'rounded-bl-full' },
];

export const borderRadiusBottomRightOptions: PropertyOption[] = [
  { label: 'None', value: 'rounded-br-none' },
  { label: 'SM', value: 'rounded-br-sm' },
  { label: 'Default', value: 'rounded-br' },
  { label: 'MD', value: 'rounded-br-md' },
  { label: 'LG', value: 'rounded-br-lg' },
  { label: 'XL', value: 'rounded-br-xl' },
  { label: '2XL', value: 'rounded-br-2xl' },
  { label: '3XL', value: 'rounded-br-3xl' },
  { label: 'Full', value: 'rounded-br-full' },
];

export const outlineWidthOptions: PropertyOption[] = [
  { label: '0', value: 'outline-0' },
  { label: '1', value: 'outline-1' },
  { label: '2', value: 'outline-2' },
  { label: '4', value: 'outline-4' },
  { label: '8', value: 'outline-8' },
];

export const outlineStyleOptions: PropertyOption[] = [
  { label: 'None', value: 'outline-none' },
  { label: 'Default', value: 'outline' },
  { label: 'Dashed', value: 'outline-dashed' },
  { label: 'Dotted', value: 'outline-dotted' },
  { label: 'Double', value: 'outline-double' },
];

export const outlineOffsetOptions: PropertyOption[] = [
  { label: '0', value: 'outline-offset-0' },
  { label: '1', value: 'outline-offset-1' },
  { label: '2', value: 'outline-offset-2' },
  { label: '4', value: 'outline-offset-4' },
  { label: '8', value: 'outline-offset-8' },
];

export const divideWidthOptions: PropertyOption[] = [
  { label: '0', value: 'divide-x-0' },
  { label: '1', value: 'divide-x' },
  { label: '2', value: 'divide-x-2' },
  { label: '4', value: 'divide-x-4' },
  { label: '8', value: 'divide-x-8' },
  { label: 'Reverse', value: 'divide-x-reverse' },
];

export const divideStyleOptions: PropertyOption[] = [
  { label: 'Solid', value: 'divide-solid' },
  { label: 'Dashed', value: 'divide-dashed' },
  { label: 'Dotted', value: 'divide-dotted' },
  { label: 'Double', value: 'divide-double' },
  { label: 'None', value: 'divide-none' },
];

export const ringWidthOptions: PropertyOption[] = [
  { label: '0', value: 'ring-0' },
  { label: '1', value: 'ring-1' },
  { label: '2', value: 'ring-2' },
  { label: 'Default', value: 'ring' },
  { label: '4', value: 'ring-4' },
  { label: '8', value: 'ring-8' },
  { label: 'Inset', value: 'ring-inset' },
];

export const ringOffsetWidthOptions: PropertyOption[] = [
  { label: '0', value: 'ring-offset-0' },
  { label: '1', value: 'ring-offset-1' },
  { label: '2', value: 'ring-offset-2' },
  { label: '4', value: 'ring-offset-4' },
  { label: '8', value: 'ring-offset-8' },
];

// ============================================================================
// EFFECTS PROPERTIES
// ============================================================================

export const boxShadowOptions: PropertyOption[] = [
  { label: 'None', value: 'shadow-none' },
  { label: 'SM', value: 'shadow-sm' },
  { label: 'Default', value: 'shadow' },
  { label: 'MD', value: 'shadow-md' },
  { label: 'LG', value: 'shadow-lg' },
  { label: 'XL', value: 'shadow-xl' },
  { label: '2XL', value: 'shadow-2xl' },
  { label: 'Inner', value: 'shadow-inner' },
];

export const opacityOptions: PropertyOption[] = [
  { label: '0', value: 'opacity-0' },
  { label: '5', value: 'opacity-5' },
  { label: '10', value: 'opacity-10' },
  { label: '15', value: 'opacity-15' },
  { label: '20', value: 'opacity-20' },
  { label: '25', value: 'opacity-25' },
  { label: '30', value: 'opacity-30' },
  { label: '35', value: 'opacity-35' },
  { label: '40', value: 'opacity-40' },
  { label: '45', value: 'opacity-45' },
  { label: '50', value: 'opacity-50' },
  { label: '55', value: 'opacity-55' },
  { label: '60', value: 'opacity-60' },
  { label: '65', value: 'opacity-65' },
  { label: '70', value: 'opacity-70' },
  { label: '75', value: 'opacity-75' },
  { label: '80', value: 'opacity-80' },
  { label: '85', value: 'opacity-85' },
  { label: '90', value: 'opacity-90' },
  { label: '95', value: 'opacity-95' },
  { label: '100', value: 'opacity-100' },
];

export const mixBlendModeOptions: PropertyOption[] = [
  { label: 'Normal', value: 'mix-blend-normal' },
  { label: 'Multiply', value: 'mix-blend-multiply' },
  { label: 'Screen', value: 'mix-blend-screen' },
  { label: 'Overlay', value: 'mix-blend-overlay' },
  { label: 'Darken', value: 'mix-blend-darken' },
  { label: 'Lighten', value: 'mix-blend-lighten' },
  { label: 'Color Dodge', value: 'mix-blend-color-dodge' },
  { label: 'Color Burn', value: 'mix-blend-color-burn' },
  { label: 'Hard Light', value: 'mix-blend-hard-light' },
  { label: 'Soft Light', value: 'mix-blend-soft-light' },
  { label: 'Difference', value: 'mix-blend-difference' },
  { label: 'Exclusion', value: 'mix-blend-exclusion' },
  { label: 'Hue', value: 'mix-blend-hue' },
  { label: 'Saturation', value: 'mix-blend-saturation' },
  { label: 'Color', value: 'mix-blend-color' },
  { label: 'Luminosity', value: 'mix-blend-luminosity' },
  { label: 'Plus Lighter', value: 'mix-blend-plus-lighter' },
];

// ============================================================================
// TRANSFORM PROPERTIES
// ============================================================================

export const scaleOptions: PropertyOption[] = [
  { label: '0', value: 'scale-0' },
  { label: '50', value: 'scale-50' },
  { label: '75', value: 'scale-75' },
  { label: '90', value: 'scale-90' },
  { label: '95', value: 'scale-95' },
  { label: '100', value: 'scale-100' },
  { label: '105', value: 'scale-105' },
  { label: '110', value: 'scale-110' },
  { label: '125', value: 'scale-125' },
  { label: '150', value: 'scale-150' },
];

export const rotateOptions: PropertyOption[] = [
  { label: '0', value: 'rotate-0' },
  { label: '1', value: 'rotate-1' },
  { label: '2', value: 'rotate-2' },
  { label: '3', value: 'rotate-3' },
  { label: '6', value: 'rotate-6' },
  { label: '12', value: 'rotate-12' },
  { label: '45', value: 'rotate-45' },
  { label: '90', value: 'rotate-90' },
  { label: '180', value: 'rotate-180' },
];

export const translateXOptions: PropertyOption[] = [
  { label: '0', value: 'translate-x-0' },
  { label: '1', value: 'translate-x-1' },
  { label: '2', value: 'translate-x-2' },
  { label: '3', value: 'translate-x-3' },
  { label: '4', value: 'translate-x-4' },
  { label: '5', value: 'translate-x-5' },
  { label: '6', value: 'translate-x-6' },
  { label: '8', value: 'translate-x-8' },
  { label: '10', value: 'translate-x-10' },
  { label: '12', value: 'translate-x-12' },
  { label: '16', value: 'translate-x-16' },
  { label: '20', value: 'translate-x-20' },
  { label: '24', value: 'translate-x-24' },
  { label: '1/2', value: 'translate-x-1/2' },
  { label: '1/3', value: 'translate-x-1/3' },
  { label: '2/3', value: 'translate-x-2/3' },
  { label: '1/4', value: 'translate-x-1/4' },
  { label: '3/4', value: 'translate-x-3/4' },
  { label: 'Full', value: 'translate-x-full' },
];

export const translateYOptions: PropertyOption[] = [
  { label: '0', value: 'translate-y-0' },
  { label: '1', value: 'translate-y-1' },
  { label: '2', value: 'translate-y-2' },
  { label: '3', value: 'translate-y-3' },
  { label: '4', value: 'translate-y-4' },
  { label: '5', value: 'translate-y-5' },
  { label: '6', value: 'translate-y-6' },
  { label: '8', value: 'translate-y-8' },
  { label: '10', value: 'translate-y-10' },
  { label: '12', value: 'translate-y-12' },
  { label: '16', value: 'translate-y-16' },
  { label: '20', value: 'translate-y-20' },
  { label: '24', value: 'translate-y-24' },
  { label: '1/2', value: 'translate-y-1/2' },
  { label: '1/3', value: 'translate-y-1/3' },
  { label: '2/3', value: 'translate-y-2/3' },
  { label: '1/4', value: 'translate-y-1/4' },
  { label: '3/4', value: 'translate-y-3/4' },
  { label: 'Full', value: 'translate-y-full' },
];

export const skewXOptions: PropertyOption[] = [
  { label: '0', value: 'skew-x-0' },
  { label: '1', value: 'skew-x-1' },
  { label: '2', value: 'skew-x-2' },
  { label: '3', value: 'skew-x-3' },
  { label: '6', value: 'skew-x-6' },
  { label: '12', value: 'skew-x-12' },
];

export const skewYOptions: PropertyOption[] = [
  { label: '0', value: 'skew-y-0' },
  { label: '1', value: 'skew-y-1' },
  { label: '2', value: 'skew-y-2' },
  { label: '3', value: 'skew-y-3' },
  { label: '6', value: 'skew-y-6' },
  { label: '12', value: 'skew-y-12' },
];

export const transformOriginOptions: PropertyOption[] = [
  { label: 'Center', value: 'origin-center' },
  { label: 'Top', value: 'origin-top' },
  { label: 'Top Right', value: 'origin-top-right' },
  { label: 'Right', value: 'origin-right' },
  { label: 'Bottom Right', value: 'origin-bottom-right' },
  { label: 'Bottom', value: 'origin-bottom' },
  { label: 'Bottom Left', value: 'origin-bottom-left' },
  { label: 'Left', value: 'origin-left' },
  { label: 'Top Left', value: 'origin-top-left' },
];

// ============================================================================
// TRANSITION PROPERTIES
// ============================================================================

export const transitionPropertyOptions: PropertyOption[] = [
  { label: 'None', value: 'transition-none' },
  { label: 'All', value: 'transition-all' },
  { label: 'Default', value: 'transition' },
  { label: 'Colors', value: 'transition-colors' },
  { label: 'Opacity', value: 'transition-opacity' },
  { label: 'Shadow', value: 'transition-shadow' },
  { label: 'Transform', value: 'transition-transform' },
];

export const transitionDurationOptions: PropertyOption[] = [
  { label: '0ms', value: 'duration-0' },
  { label: '75ms', value: 'duration-75' },
  { label: '100ms', value: 'duration-100' },
  { label: '150ms', value: 'duration-150' },
  { label: '200ms', value: 'duration-200' },
  { label: '300ms', value: 'duration-300' },
  { label: '500ms', value: 'duration-500' },
  { label: '700ms', value: 'duration-700' },
  { label: '1000ms', value: 'duration-1000' },
];

export const transitionTimingFunctionOptions: PropertyOption[] = [
  { label: 'Linear', value: 'ease-linear' },
  { label: 'In', value: 'ease-in' },
  { label: 'Out', value: 'ease-out' },
  { label: 'In Out', value: 'ease-in-out' },
];

export const transitionDelayOptions: PropertyOption[] = [
  { label: '0ms', value: 'delay-0' },
  { label: '75ms', value: 'delay-75' },
  { label: '100ms', value: 'delay-100' },
  { label: '150ms', value: 'delay-150' },
  { label: '200ms', value: 'delay-200' },
  { label: '300ms', value: 'delay-300' },
  { label: '500ms', value: 'delay-500' },
  { label: '700ms', value: 'delay-700' },
  { label: '1000ms', value: 'delay-1000' },
];

export const animationOptions: PropertyOption[] = [
  { label: 'None', value: 'animate-none' },
  { label: 'Spin', value: 'animate-spin' },
  { label: 'Ping', value: 'animate-ping' },
  { label: 'Pulse', value: 'animate-pulse' },
  { label: 'Bounce', value: 'animate-bounce' },
];

// ============================================================================
// MASK & CLIP PROPERTIES
// ============================================================================

export const clipPathPresets: PropertyOption[] = [
  { label: 'None', value: 'none' },
  { label: 'Circle', value: 'circle(50%)' },
  { label: 'Ellipse', value: 'ellipse(50% 40%)' },
  { label: 'Triangle', value: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
  { label: 'Pentagon', value: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
  { label: 'Hexagon', value: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
  { label: 'Star', value: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
  { label: 'Arrow Right', value: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)' },
  { label: 'Message', value: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)' },
  { label: 'Inset', value: 'inset(10% 10% 10% 10%)' },
  { label: 'Rounded Inset', value: 'inset(10% round 20px)' },
];

// ============================================================================
// COLUMN PROPERTIES
// ============================================================================

export const columnCountOptions: PropertyOption[] = [
  { label: '1', value: 'columns-1' },
  { label: '2', value: 'columns-2' },
  { label: '3', value: 'columns-3' },
  { label: '4', value: 'columns-4' },
  { label: '5', value: 'columns-5' },
  { label: '6', value: 'columns-6' },
  { label: '7', value: 'columns-7' },
  { label: '8', value: 'columns-8' },
  { label: '9', value: 'columns-9' },
  { label: '10', value: 'columns-10' },
  { label: '11', value: 'columns-11' },
  { label: '12', value: 'columns-12' },
  { label: 'Auto', value: 'columns-auto' },
  { label: '3XS', value: 'columns-3xs' },
  { label: '2XS', value: 'columns-2xs' },
  { label: 'XS', value: 'columns-xs' },
  { label: 'SM', value: 'columns-sm' },
  { label: 'MD', value: 'columns-md' },
  { label: 'LG', value: 'columns-lg' },
  { label: 'XL', value: 'columns-xl' },
  { label: '2XL', value: 'columns-2xl' },
  { label: '3XL', value: 'columns-3xl' },
  { label: '4XL', value: 'columns-4xl' },
  { label: '5XL', value: 'columns-5xl' },
  { label: '6XL', value: 'columns-6xl' },
  { label: '7XL', value: 'columns-7xl' },
];

export const breakAfterOptions: PropertyOption[] = [
  { label: 'Auto', value: 'break-after-auto' },
  { label: 'Avoid', value: 'break-after-avoid' },
  { label: 'All', value: 'break-after-all' },
  { label: 'Avoid Page', value: 'break-after-avoid-page' },
  { label: 'Page', value: 'break-after-page' },
  { label: 'Left', value: 'break-after-left' },
  { label: 'Right', value: 'break-after-right' },
  { label: 'Column', value: 'break-after-column' },
];

export const breakBeforeOptions: PropertyOption[] = [
  { label: 'Auto', value: 'break-before-auto' },
  { label: 'Avoid', value: 'break-before-avoid' },
  { label: 'All', value: 'break-before-all' },
  { label: 'Avoid Page', value: 'break-before-avoid-page' },
  { label: 'Page', value: 'break-before-page' },
  { label: 'Left', value: 'break-before-left' },
  { label: 'Right', value: 'break-before-right' },
  { label: 'Column', value: 'break-before-column' },
];

export const breakInsideOptions: PropertyOption[] = [
  { label: 'Auto', value: 'break-inside-auto' },
  { label: 'Avoid', value: 'break-inside-avoid' },
  { label: 'Avoid Page', value: 'break-inside-avoid-page' },
  { label: 'Avoid Column', value: 'break-inside-avoid-column' },
];

// ============================================================================
// CURSOR & INTERACTION
// ============================================================================

export const cursorOptions: PropertyOption[] = [
  { label: 'Auto', value: 'cursor-auto' },
  { label: 'Default', value: 'cursor-default' },
  { label: 'Pointer', value: 'cursor-pointer' },
  { label: 'Wait', value: 'cursor-wait' },
  { label: 'Text', value: 'cursor-text' },
  { label: 'Move', value: 'cursor-move' },
  { label: 'Help', value: 'cursor-help' },
  { label: 'Not Allowed', value: 'cursor-not-allowed' },
  { label: 'None', value: 'cursor-none' },
  { label: 'Context Menu', value: 'cursor-context-menu' },
  { label: 'Progress', value: 'cursor-progress' },
  { label: 'Cell', value: 'cursor-cell' },
  { label: 'Crosshair', value: 'cursor-crosshair' },
  { label: 'Vertical Text', value: 'cursor-vertical-text' },
  { label: 'Alias', value: 'cursor-alias' },
  { label: 'Copy', value: 'cursor-copy' },
  { label: 'No Drop', value: 'cursor-no-drop' },
  { label: 'Grab', value: 'cursor-grab' },
  { label: 'Grabbing', value: 'cursor-grabbing' },
  { label: 'All Scroll', value: 'cursor-all-scroll' },
  { label: 'Col Resize', value: 'cursor-col-resize' },
  { label: 'Row Resize', value: 'cursor-row-resize' },
  { label: 'N Resize', value: 'cursor-n-resize' },
  { label: 'E Resize', value: 'cursor-e-resize' },
  { label: 'S Resize', value: 'cursor-s-resize' },
  { label: 'W Resize', value: 'cursor-w-resize' },
  { label: 'NE Resize', value: 'cursor-ne-resize' },
  { label: 'NW Resize', value: 'cursor-nw-resize' },
  { label: 'SE Resize', value: 'cursor-se-resize' },
  { label: 'SW Resize', value: 'cursor-sw-resize' },
  { label: 'EW Resize', value: 'cursor-ew-resize' },
  { label: 'NS Resize', value: 'cursor-ns-resize' },
  { label: 'NESW Resize', value: 'cursor-nesw-resize' },
  { label: 'NWSE Resize', value: 'cursor-nwse-resize' },
  { label: 'Zoom In', value: 'cursor-zoom-in' },
  { label: 'Zoom Out', value: 'cursor-zoom-out' },
];

export const pointerEventsOptions: PropertyOption[] = [
  { label: 'None', value: 'pointer-events-none' },
  { label: 'Auto', value: 'pointer-events-auto' },
];

export const resizeOptions: PropertyOption[] = [
  { label: 'None', value: 'resize-none' },
  { label: 'Both', value: 'resize' },
  { label: 'Vertical', value: 'resize-y' },
  { label: 'Horizontal', value: 'resize-x' },
];

export const scrollBehaviorOptions: PropertyOption[] = [
  { label: 'Auto', value: 'scroll-auto' },
  { label: 'Smooth', value: 'scroll-smooth' },
];

export const scrollSnapAlignOptions: PropertyOption[] = [
  { label: 'Start', value: 'snap-start' },
  { label: 'End', value: 'snap-end' },
  { label: 'Center', value: 'snap-center' },
  { label: 'Align None', value: 'snap-align-none' },
];

export const scrollSnapStopOptions: PropertyOption[] = [
  { label: 'Normal', value: 'snap-normal' },
  { label: 'Always', value: 'snap-always' },
];

export const scrollSnapTypeOptions: PropertyOption[] = [
  { label: 'None', value: 'snap-none' },
  { label: 'X', value: 'snap-x' },
  { label: 'Y', value: 'snap-y' },
  { label: 'Both', value: 'snap-both' },
  { label: 'Mandatory', value: 'snap-mandatory' },
  { label: 'Proximity', value: 'snap-proximity' },
];

export const touchActionOptions: PropertyOption[] = [
  { label: 'Auto', value: 'touch-auto' },
  { label: 'None', value: 'touch-none' },
  { label: 'Pan X', value: 'touch-pan-x' },
  { label: 'Pan Left', value: 'touch-pan-left' },
  { label: 'Pan Right', value: 'touch-pan-right' },
  { label: 'Pan Y', value: 'touch-pan-y' },
  { label: 'Pan Up', value: 'touch-pan-up' },
  { label: 'Pan Down', value: 'touch-pan-down' },
  { label: 'Pinch Zoom', value: 'touch-pinch-zoom' },
  { label: 'Manipulation', value: 'touch-manipulation' },
];

export const userSelectOptions: PropertyOption[] = [
  { label: 'None', value: 'select-none' },
  { label: 'Text', value: 'select-text' },
  { label: 'All', value: 'select-all' },
  { label: 'Auto', value: 'select-auto' },
];

export const willChangeOptions: PropertyOption[] = [
  { label: 'Auto', value: 'will-change-auto' },
  { label: 'Scroll', value: 'will-change-scroll' },
  { label: 'Contents', value: 'will-change-contents' },
  { label: 'Transform', value: 'will-change-transform' },
];

// ============================================================================
// ASPECT RATIO OPTIONS
// ============================================================================

export const aspectRatioOptions: PropertyOption[] = [
  { label: 'Auto', value: 'aspect-auto' },
  { label: 'Square', value: 'aspect-square' },
  { label: 'Video', value: 'aspect-video' },
];

// ============================================================================
// INSET / POSITION OFFSET OPTIONS
// ============================================================================

export const insetOptions: PropertyOption[] = [
  { label: '0', value: 'inset-0' },
  { label: 'px', value: 'inset-px' },
  { label: '0.5', value: 'inset-0.5' },
  { label: '1', value: 'inset-1' },
  { label: '1.5', value: 'inset-1.5' },
  { label: '2', value: 'inset-2' },
  { label: '2.5', value: 'inset-2.5' },
  { label: '3', value: 'inset-3' },
  { label: '3.5', value: 'inset-3.5' },
  { label: '4', value: 'inset-4' },
  { label: '5', value: 'inset-5' },
  { label: '6', value: 'inset-6' },
  { label: '8', value: 'inset-8' },
  { label: '10', value: 'inset-10' },
  { label: '12', value: 'inset-12' },
  { label: '16', value: 'inset-16' },
  { label: '20', value: 'inset-20' },
  { label: '24', value: 'inset-24' },
  { label: '1/2', value: 'inset-1/2' },
  { label: '1/3', value: 'inset-1/3' },
  { label: '2/3', value: 'inset-2/3' },
  { label: '1/4', value: 'inset-1/4' },
  { label: '3/4', value: 'inset-3/4' },
  { label: 'Full', value: 'inset-full' },
  { label: 'Auto', value: 'inset-auto' },
];

// ============================================================================
// STYLE CATEGORIES DEFINITION
// ============================================================================

export interface StyleCategoryDefinition {
  id: StyleCategory;
  name: string;
  icon: string;
  description: string;
  properties: string[];
}

export const styleCategories: StyleCategoryDefinition[] = [
  {
    id: 'layout',
    name: 'Layout',
    icon: 'Layout',
    description: 'Display, position, visibility, overflow',
    properties: ['display', 'position', 'zIndex', 'overflow', 'float', 'clear', 'visibility', 'objectFit', 'objectPosition'],
  },
  {
    id: 'flexbox',
    name: 'Flexbox',
    icon: 'Columns',
    description: 'Flex container and item properties',
    properties: ['flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignContent', 'alignSelf', 'flexGrow', 'flexShrink', 'flexBasis', 'order', 'gap'],
  },
  {
    id: 'grid',
    name: 'Grid',
    icon: 'Grid',
    description: 'CSS Grid layout properties',
    properties: ['gridTemplateColumns', 'gridTemplateRows', 'gridColumn', 'gridRow', 'gridAutoFlow', 'gridAutoColumns', 'gridAutoRows', 'gap'],
  },
  {
    id: 'boxModel',
    name: 'Box Model',
    icon: 'Square',
    description: 'Width, height, padding, margin',
    properties: ['width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'padding', 'margin', 'boxSizing'],
  },
  {
    id: 'typography',
    name: 'Typography',
    icon: 'Type',
    description: 'Font, text, and spacing properties',
    properties: ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'textAlign', 'textDecoration', 'textTransform', 'lineHeight', 'letterSpacing', 'wordSpacing', 'textIndent', 'verticalAlign', 'whiteSpace', 'wordBreak'],
  },
  {
    id: 'background',
    name: 'Background',
    icon: 'Image',
    description: 'Background colors, images, and gradients',
    properties: ['backgroundColor', 'backgroundImage', 'backgroundPosition', 'backgroundSize', 'backgroundRepeat', 'backgroundAttachment', 'backgroundClip', 'backgroundOrigin', 'backgroundBlendMode'],
  },
  {
    id: 'borders',
    name: 'Borders',
    icon: 'Square',
    description: 'Border width, style, color, and radius',
    properties: ['borderWidth', 'borderStyle', 'borderColor', 'borderRadius', 'outline', 'ring', 'divide'],
  },
  {
    id: 'effects',
    name: 'Effects',
    icon: 'Sparkles',
    description: 'Shadows, opacity, and blend modes',
    properties: ['boxShadow', 'opacity', 'mixBlendMode'],
  },
  {
    id: 'transforms',
    name: 'Transforms',
    icon: 'RotateCw',
    description: 'Scale, rotate, translate, skew',
    properties: ['scale', 'rotate', 'translateX', 'translateY', 'skewX', 'skewY', 'transformOrigin'],
  },
  {
    id: 'transitions',
    name: 'Transitions',
    icon: 'Zap',
    description: 'Transition and animation properties',
    properties: ['transitionProperty', 'transitionDuration', 'transitionTimingFunction', 'transitionDelay', 'animation'],
  },
  {
    id: 'filters',
    name: 'Filters',
    icon: 'Sliders',
    description: 'CSS filter effects',
    properties: ['blur', 'brightness', 'contrast', 'grayscale', 'hueRotate', 'invert', 'saturate', 'sepia', 'dropShadow', 'backdropFilter'],
  },
  {
    id: 'masks',
    name: 'Masks & Clips',
    icon: 'Scissors',
    description: 'Clip paths and mask images',
    properties: ['clipPath', 'maskImage'],
  },
  {
    id: 'columns',
    name: 'Columns',
    icon: 'Columns',
    description: 'Multi-column layout',
    properties: ['columnCount', 'columnGap', 'columnRule', 'breakAfter', 'breakBefore', 'breakInside'],
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all options for a specific property
 */
export function getPropertyOptions(propertyName: string): PropertyOption[] {
  const optionsMap: Record<string, PropertyOption[]> = {
    // Layout
    display: displayOptions,
    position: positionOptions,
    zIndex: zIndexOptions,
    overflow: overflowOptions,
    overflowX: overflowXOptions,
    overflowY: overflowYOptions,
    float: floatOptions,
    clear: clearOptions,
    objectFit: objectFitOptions,
    objectPosition: objectPositionOptions,
    visibility: visibilityOptions,

    // Flexbox
    flexDirection: flexDirectionOptions,
    flexWrap: flexWrapOptions,
    justifyContent: justifyContentOptions,
    alignItems: alignItemsOptions,
    alignContent: alignContentOptions,
    alignSelf: alignSelfOptions,
    justifySelf: justifySelfOptions,
    justifyItems: justifyItemsOptions,
    placeContent: placeContentOptions,
    placeItems: placeItemsOptions,
    placeSelf: placeSelfOptions,
    flexGrow: flexGrowOptions,
    flexShrink: flexShrinkOptions,
    flexBasis: flexBasisOptions,
    order: orderOptions,

    // Grid
    gridTemplateColumns: gridTemplateColumnsOptions,
    gridTemplateRows: gridTemplateRowsOptions,
    gridColumnSpan: gridColumnSpanOptions,
    gridColumnStart: gridColumnStartOptions,
    gridColumnEnd: gridColumnEndOptions,
    gridRowSpan: gridRowSpanOptions,
    gridRowStart: gridRowStartOptions,
    gridRowEnd: gridRowEndOptions,
    gridAutoFlow: gridAutoFlowOptions,
    gridAutoColumns: gridAutoColumnsOptions,
    gridAutoRows: gridAutoRowsOptions,

    // Box Model
    width: widthOptions,
    height: heightOptions,
    minWidth: minWidthOptions,
    maxWidth: maxWidthOptions,
    minHeight: minHeightOptions,
    maxHeight: maxHeightOptions,
    boxSizing: boxSizingOptions,
    gap: gapOptions,

    // Typography
    fontFamily: fontFamilyOptions,
    fontSize: fontSizeOptions,
    fontWeight: fontWeightOptions,
    fontStyle: fontStyleOptions,
    textAlign: textAlignOptions,
    textDecoration: textDecorationOptions,
    textDecorationStyle: textDecorationStyleOptions,
    textDecorationThickness: textDecorationThicknessOptions,
    underlineOffset: underlineOffsetOptions,
    textTransform: textTransformOptions,
    textOverflow: textOverflowOptions,
    textWrap: textWrapOptions,
    lineHeight: lineHeightOptions,
    letterSpacing: letterSpacingOptions,
    textIndent: textIndentOptions,
    verticalAlign: verticalAlignOptions,
    whiteSpace: whiteSpaceOptions,
    wordBreak: wordBreakOptions,
    hyphens: hyphensOptions,
    listStyleType: listStyleTypeOptions,
    listStylePosition: listStylePositionOptions,

    // Background
    backgroundAttachment: backgroundAttachmentOptions,
    backgroundClip: backgroundClipOptions,
    backgroundOrigin: backgroundOriginOptions,
    backgroundPosition: backgroundPositionOptions,
    backgroundRepeat: backgroundRepeatOptions,
    backgroundSize: backgroundSizeOptions,
    backgroundBlendMode: backgroundBlendModeOptions,

    // Borders
    borderWidth: borderWidthOptions,
    borderStyle: borderStyleOptions,
    borderRadius: borderRadiusOptions,
    borderRadiusTopLeft: borderRadiusTopLeftOptions,
    borderRadiusTopRight: borderRadiusTopRightOptions,
    borderRadiusBottomLeft: borderRadiusBottomLeftOptions,
    borderRadiusBottomRight: borderRadiusBottomRightOptions,
    outlineWidth: outlineWidthOptions,
    outlineStyle: outlineStyleOptions,
    outlineOffset: outlineOffsetOptions,
    divideWidth: divideWidthOptions,
    divideStyle: divideStyleOptions,
    ringWidth: ringWidthOptions,
    ringOffsetWidth: ringOffsetWidthOptions,

    // Effects
    boxShadow: boxShadowOptions,
    opacity: opacityOptions,
    mixBlendMode: mixBlendModeOptions,

    // Transforms
    scale: scaleOptions,
    rotate: rotateOptions,
    translateX: translateXOptions,
    translateY: translateYOptions,
    skewX: skewXOptions,
    skewY: skewYOptions,
    transformOrigin: transformOriginOptions,

    // Transitions
    transitionProperty: transitionPropertyOptions,
    transitionDuration: transitionDurationOptions,
    transitionTimingFunction: transitionTimingFunctionOptions,
    transitionDelay: transitionDelayOptions,
    animation: animationOptions,

    // Masks & Clips
    clipPath: clipPathPresets,

    // Columns
    columnCount: columnCountOptions,
    breakAfter: breakAfterOptions,
    breakBefore: breakBeforeOptions,
    breakInside: breakInsideOptions,

    // Cursor & Interaction
    cursor: cursorOptions,
    pointerEvents: pointerEventsOptions,
    resize: resizeOptions,
    scrollBehavior: scrollBehaviorOptions,
    scrollSnapAlign: scrollSnapAlignOptions,
    scrollSnapStop: scrollSnapStopOptions,
    scrollSnapType: scrollSnapTypeOptions,
    touchAction: touchActionOptions,
    userSelect: userSelectOptions,
    willChange: willChangeOptions,

    // Aspect Ratio
    aspectRatio: aspectRatioOptions,

    // Inset
    inset: insetOptions,
  };

  return optionsMap[propertyName] || [];
}

/**
 * Convert spacing value to pixels for display
 */
export function spacingToPx(value: string): number {
  const spacingScale: Record<string, number> = {
    '0': 0, 'px': 1, '0.5': 2, '1': 4, '1.5': 6, '2': 8, '2.5': 10,
    '3': 12, '3.5': 14, '4': 16, '5': 20, '6': 24, '7': 28, '8': 32,
    '9': 36, '10': 40, '11': 44, '12': 48, '14': 56, '16': 64,
    '20': 80, '24': 96, '28': 112, '32': 128, '36': 144, '40': 160,
    '44': 176, '48': 192, '52': 208, '56': 224, '60': 240, '64': 256,
    '72': 288, '80': 320, '96': 384,
  };

  return spacingScale[value] || 0;
}

/**
 * Get the default value for a property
 */
export function getDefaultValue(propertyName: string): string {
  const defaults: Record<string, string> = {
    display: 'block',
    position: 'static',
    zIndex: 'z-auto',
    overflow: 'overflow-visible',
    visibility: 'visible',
    flexDirection: 'flex-row',
    flexWrap: 'flex-nowrap',
    justifyContent: 'justify-start',
    alignItems: 'items-stretch',
    width: 'w-auto',
    height: 'h-auto',
    fontFamily: 'font-sans',
    fontSize: 'text-base',
    fontWeight: 'font-normal',
    textAlign: 'text-left',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-normal',
    opacity: 'opacity-100',
    borderRadius: 'rounded-none',
    boxShadow: 'shadow-none',
  };

  return defaults[propertyName] || '';
}

/**
 * Check if a value is a valid Tailwind class
 */
export function isValidTailwindClass(value: string): boolean {
  // Basic validation - check if it matches common Tailwind patterns
  const patterns = [
    /^[a-z]+-\d+$/,  // e.g., p-4, m-2
    /^[a-z]+-[a-z]+$/,  // e.g., flex-row, text-center
    /^[a-z]+-[a-z]+-\d+$/,  // e.g., text-gray-500
    /^[a-z]+$/,  // e.g., flex, grid, hidden
  ];

  return patterns.some(pattern => pattern.test(value));
}

/**
 * Parse a CSS value with unit
 */
export function parseCSSValue(value: string): CSSValueWithUnit | null {
  const match = value.match(/^(-?\d*\.?\d+)(px|em|rem|%|vw|vh|vmin|vmax|ch|ex)?$/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: (match[2] as CSSUnit) || 'px',
    };
  }
  return null;
}

/**
 * Format a CSS value with unit
 */
export function formatCSSValue(value: number, unit: CSSUnit): string {
  if (unit === 'none' || unit === 'auto') {
    return unit;
  }
  return `${value}${unit}`;
}
