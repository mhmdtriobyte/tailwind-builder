import type { ComponentDefinition, ComponentCategory } from '@/types/builder';
import { defaultProps, createDefaultStyles } from '@/lib/defaultProps';

/**
 * Component Registry
 *
 * Central registry of all available components in the Visual Tailwind Builder.
 * Each component definition includes metadata for the UI, default props/styles,
 * and information about whether it can contain children.
 */

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Creates a component definition with proper defaults
 */
function createComponentDefinition(
  type: string,
  name: string,
  category: ComponentCategory,
  icon: string,
  options: {
    isContainer?: boolean;
    acceptsChildren?: boolean;
  } = {}
): ComponentDefinition {
  const { isContainer = false, acceptsChildren = false } = options;
  const defaults = defaultProps[type] || { props: {}, styles: createDefaultStyles() };

  return {
    type,
    name,
    category,
    icon,
    defaultProps: defaults.props,
    defaultStyles: defaults.styles,
    isContainer,
    acceptsChildren,
  };
}

// ============================================================================
// COMPONENT DEFINITIONS BY CATEGORY
// ============================================================================

/**
 * Button Components (8 total)
 * Interactive button elements with various styles and states
 */
const buttonComponents: ComponentDefinition[] = [
  createComponentDefinition('primary-button', 'Primary Button', 'buttons', 'MousePointer'),
  createComponentDefinition('secondary-button', 'Secondary Button', 'buttons', 'Square'),
  createComponentDefinition('outline-button', 'Outline Button', 'buttons', 'SquareDashed'),
  createComponentDefinition('ghost-button', 'Ghost Button', 'buttons', 'Ghost'),
  createComponentDefinition('icon-button', 'Icon Button', 'buttons', 'CircleDot'),
  createComponentDefinition('loading-button', 'Loading Button', 'buttons', 'Loader2'),
  createComponentDefinition('gradient-button', 'Gradient Button', 'buttons', 'Sparkles'),
  createComponentDefinition('button-group', 'Button Group', 'buttons', 'RectangleHorizontal', {
    isContainer: true,
    acceptsChildren: true,
  }),
];

/**
 * Card Components (10 total)
 * Container components for displaying grouped content
 */
const cardComponents: ComponentDefinition[] = [
  createComponentDefinition('simple-card', 'Simple Card', 'cards', 'Square', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('product-card', 'Product Card', 'cards', 'ShoppingBag'),
  createComponentDefinition('pricing-card', 'Pricing Card', 'cards', 'DollarSign'),
  createComponentDefinition('testimonial-card', 'Testimonial Card', 'cards', 'Quote'),
  createComponentDefinition('profile-card', 'Profile Card', 'cards', 'User'),
  createComponentDefinition('blog-card', 'Blog Card', 'cards', 'FileText'),
  createComponentDefinition('stats-card', 'Stats Card', 'cards', 'TrendingUp'),
  createComponentDefinition('feature-card', 'Feature Card', 'cards', 'Zap'),
  createComponentDefinition('image-card', 'Image Card', 'cards', 'ImageIcon'),
  createComponentDefinition('horizontal-card', 'Horizontal Card', 'cards', 'RectangleHorizontal'),
];

/**
 * Navigation Components (6 total)
 * Components for site navigation and wayfinding
 */
const navigationComponents: ComponentDefinition[] = [
  createComponentDefinition('navbar', 'Navbar', 'navigation', 'Menu', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('mobile-menu', 'Mobile Menu', 'navigation', 'MenuSquare', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('footer', 'Footer', 'navigation', 'PanelBottom', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('breadcrumb', 'Breadcrumb', 'navigation', 'ChevronRight'),
  createComponentDefinition('tabs', 'Tabs', 'navigation', 'Layers', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('pagination', 'Pagination', 'navigation', 'MoreHorizontal'),
];

/**
 * Form Components (12 total)
 * Input and form-related components
 */
const formComponents: ComponentDefinition[] = [
  createComponentDefinition('input-field', 'Input Field', 'forms', 'TextCursor'),
  createComponentDefinition('textarea', 'Textarea', 'forms', 'AlignLeft'),
  createComponentDefinition('select-dropdown', 'Select Dropdown', 'forms', 'ChevronDown'),
  createComponentDefinition('checkbox', 'Checkbox', 'forms', 'CheckSquare'),
  createComponentDefinition('radio-group', 'Radio Group', 'forms', 'Circle'),
  createComponentDefinition('toggle-switch', 'Toggle Switch', 'forms', 'ToggleLeft'),
  createComponentDefinition('login-form', 'Login Form', 'forms', 'LogIn', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('signup-form', 'Signup Form', 'forms', 'UserPlus', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('contact-form', 'Contact Form', 'forms', 'Mail', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('search-bar', 'Search Bar', 'forms', 'Search'),
  createComponentDefinition('newsletter-form', 'Newsletter Form', 'forms', 'Newspaper'),
  createComponentDefinition('file-upload', 'File Upload', 'forms', 'Upload'),
];

/**
 * Section Components (10 total)
 * Full-width page sections for landing pages
 */
const sectionComponents: ComponentDefinition[] = [
  createComponentDefinition('hero-section', 'Hero Section', 'sections', 'Sparkles', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('hero-with-image', 'Hero with Image', 'sections', 'ImageIcon', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('feature-section', 'Feature Section', 'sections', 'Grid3x3', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('cta-section', 'CTA Section', 'sections', 'Megaphone', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('stats-section', 'Stats Section', 'sections', 'BarChart3', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('testimonials-section', 'Testimonials Section', 'sections', 'MessageSquareQuote', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('team-section', 'Team Section', 'sections', 'Users', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('faq-section', 'FAQ Section', 'sections', 'HelpCircle', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('pricing-section', 'Pricing Section', 'sections', 'CreditCard', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('contact-section', 'Contact Section', 'sections', 'Phone', {
    isContainer: true,
    acceptsChildren: true,
  }),
];

/**
 * Layout Components (8 total)
 * Structural components for organizing content
 */
const layoutComponents: ComponentDefinition[] = [
  createComponentDefinition('container', 'Container', 'layout', 'Box', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('grid-2-col', '2 Column Grid', 'layout', 'LayoutGrid', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('grid-3-col', '3 Column Grid', 'layout', 'Grid3x3', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('grid-4-col', '4 Column Grid', 'layout', 'LayoutGrid', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('flex-row', 'Flex Row', 'layout', 'ArrowRightLeft', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('flex-column', 'Flex Column', 'layout', 'ArrowUpDown', {
    isContainer: true,
    acceptsChildren: true,
  }),
  createComponentDefinition('divider', 'Divider', 'layout', 'Minus'),
  createComponentDefinition('spacer', 'Spacer', 'layout', 'MoveVertical'),
];

/**
 * Media Components (4 total)
 * Components for displaying media content
 */
const mediaComponents: ComponentDefinition[] = [
  createComponentDefinition('image', 'Image', 'media', 'Image'),
  createComponentDefinition('avatar', 'Avatar', 'media', 'CircleUser'),
  createComponentDefinition('icon', 'Icon', 'media', 'Star'),
  createComponentDefinition('video', 'Video', 'media', 'Play'),
];

/**
 * Text Components (5 total)
 * Typography and text-related components
 */
const textComponents: ComponentDefinition[] = [
  createComponentDefinition('heading', 'Heading', 'text', 'Heading'),
  createComponentDefinition('paragraph', 'Paragraph', 'text', 'AlignLeft'),
  createComponentDefinition('badge', 'Badge', 'text', 'Tag'),
  createComponentDefinition('link', 'Link', 'text', 'Link2'),
  createComponentDefinition('list', 'List', 'text', 'List'),
];

// ============================================================================
// COMPONENT REGISTRY
// ============================================================================

/**
 * All component definitions indexed by type
 */
export const componentRegistry: Record<string, ComponentDefinition> = {};

// Populate the registry from all category arrays
const allComponents: ComponentDefinition[] = [
  ...buttonComponents,
  ...cardComponents,
  ...navigationComponents,
  ...formComponents,
  ...sectionComponents,
  ...layoutComponents,
  ...mediaComponents,
  ...textComponents,
];

for (const component of allComponents) {
  componentRegistry[component.type] = component;
}

/**
 * Components grouped by category for the sidebar component panel
 */
export const componentsByCategory: Record<ComponentCategory, ComponentDefinition[]> = {
  buttons: buttonComponents,
  cards: cardComponents,
  navigation: navigationComponents,
  forms: formComponents,
  sections: sectionComponents,
  layout: layoutComponents,
  media: mediaComponents,
  text: textComponents,
};

/**
 * Category metadata for UI display
 */
export const categoryMetadata: Record<
  ComponentCategory,
  { label: string; icon: string; description: string }
> = {
  buttons: {
    label: 'Buttons',
    icon: 'MousePointer',
    description: 'Interactive button elements',
  },
  cards: {
    label: 'Cards',
    icon: 'LayoutGrid',
    description: 'Content card containers',
  },
  navigation: {
    label: 'Navigation',
    icon: 'Menu',
    description: 'Navigation and menu components',
  },
  forms: {
    label: 'Forms',
    icon: 'FormInput',
    description: 'Form inputs and controls',
  },
  sections: {
    label: 'Sections',
    icon: 'LayoutTemplate',
    description: 'Full-width page sections',
  },
  layout: {
    label: 'Layout',
    icon: 'LayoutGrid',
    description: 'Structural layout components',
  },
  media: {
    label: 'Media',
    icon: 'Image',
    description: 'Images, videos, and icons',
  },
  text: {
    label: 'Text',
    icon: 'Type',
    description: 'Typography components',
  },
};

// ============================================================================
// REGISTRY ACCESS FUNCTIONS
// ============================================================================

/**
 * Gets a component definition by type
 * @param type - The component type identifier
 * @returns The component definition or undefined if not found
 */
export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return componentRegistry[type];
}

/**
 * Gets all components in a specific category
 * @param category - The category to filter by
 * @returns Array of component definitions in that category
 */
export function getComponentsByCategory(category: ComponentCategory): ComponentDefinition[] {
  return componentsByCategory[category] || [];
}

/**
 * Gets all available component types
 * @returns Array of all component type identifiers
 */
export function getAllComponentTypes(): string[] {
  return Object.keys(componentRegistry);
}

/**
 * Checks if a component type exists in the registry
 * @param type - The component type to check
 * @returns True if the component exists
 */
export function isValidComponentType(type: string): boolean {
  return type in componentRegistry;
}

/**
 * Gets all container components (components that can have children)
 * @returns Array of component definitions that accept children
 */
export function getContainerComponents(): ComponentDefinition[] {
  return allComponents.filter((c) => c.acceptsChildren);
}

/**
 * Gets all leaf components (components that cannot have children)
 * @returns Array of component definitions that don't accept children
 */
export function getLeafComponents(): ComponentDefinition[] {
  return allComponents.filter((c) => !c.acceptsChildren);
}

/**
 * Searches components by name or type
 * @param query - The search query string
 * @returns Array of matching component definitions
 */
export function searchComponents(query: string): ComponentDefinition[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return allComponents;
  }

  return allComponents.filter(
    (component) =>
      component.name.toLowerCase().includes(normalizedQuery) ||
      component.type.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Gets the total count of registered components
 * @returns The number of components in the registry
 */
export function getComponentCount(): number {
  return allComponents.length;
}

/**
 * Gets category counts for statistics
 * @returns Record of category to component count
 */
export function getCategoryCounts(): Record<ComponentCategory, number> {
  return {
    buttons: buttonComponents.length,
    cards: cardComponents.length,
    navigation: navigationComponents.length,
    forms: formComponents.length,
    sections: sectionComponents.length,
    layout: layoutComponents.length,
    media: mediaComponents.length,
    text: textComponents.length,
  };
}

// Export the raw arrays for direct access if needed
export {
  buttonComponents,
  cardComponents,
  navigationComponents,
  formComponents,
  sectionComponents,
  layoutComponents,
  mediaComponents,
  textComponents,
  allComponents,
};
