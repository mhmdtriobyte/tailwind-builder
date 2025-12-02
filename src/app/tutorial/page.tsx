import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  Layers,
  MousePointerClick,
  LayoutGrid,
  Settings2,
  Move,
  Monitor,
  Tablet,
  Smartphone,
  Code2,
  Copy,
  Trash2,
  Undo2,
  Grid3X3,
  ZoomIn,
  Download,
  Keyboard,
  Lightbulb,
  Sparkles,
  Box,
  Type,
  Palette,
  Square,
  SlidersHorizontal,
  Columns3,
  LayoutDashboard,
  Image,
  FormInput,
  Navigation,
  CreditCard,
  Github,
  Play,
  GripVertical,
  Plus,
  MousePointer2,
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  items?: string[];
  gradient?: string;
}

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
  tips?: string[];
}

interface ShortcutProps {
  keys: string[];
  action: string;
  mac?: string[];
}

interface CategoryCardProps {
  icon: React.ElementType;
  name: string;
  count: number;
  color: string;
}

// ============================================================================
// DATA
// ============================================================================

const componentCategories: CategoryCardProps[] = [
  { icon: MousePointerClick, name: 'Buttons', count: 8, color: 'from-blue-500 to-blue-600' },
  { icon: CreditCard, name: 'Cards', count: 10, color: 'from-purple-500 to-purple-600' },
  { icon: Navigation, name: 'Navigation', count: 6, color: 'from-green-500 to-green-600' },
  { icon: FormInput, name: 'Forms', count: 12, color: 'from-orange-500 to-orange-600' },
  { icon: LayoutDashboard, name: 'Sections', count: 10, color: 'from-pink-500 to-pink-600' },
  { icon: Columns3, name: 'Layout', count: 8, color: 'from-cyan-500 to-cyan-600' },
  { icon: Image, name: 'Media', count: 4, color: 'from-yellow-500 to-yellow-600' },
  { icon: Type, name: 'Text', count: 5, color: 'from-red-500 to-red-600' },
];

const propertyTabs = [
  { icon: LayoutGrid, name: 'Layout', description: 'Width, height, display, position, flexbox' },
  { icon: Box, name: 'Spacing', description: 'Margin, padding on all sides' },
  { icon: Type, name: 'Typography', description: 'Font size, weight, alignment, line height' },
  { icon: Palette, name: 'Colors', description: 'Background, text, and border colors' },
  { icon: Square, name: 'Borders', description: 'Border width, radius, and style' },
  { icon: Sparkles, name: 'Effects', description: 'Shadows, opacity, transforms' },
];

const keyboardShortcuts: ShortcutProps[] = [
  { keys: ['Ctrl', 'Z'], mac: ['Cmd', 'Z'], action: 'Undo last action' },
  { keys: ['Ctrl', 'Shift', 'Z'], mac: ['Cmd', 'Shift', 'Z'], action: 'Redo last action' },
  { keys: ['Ctrl', 'C'], mac: ['Cmd', 'C'], action: 'Copy selected element' },
  { keys: ['Ctrl', 'V'], mac: ['Cmd', 'V'], action: 'Paste copied element' },
  { keys: ['Ctrl', 'D'], mac: ['Cmd', 'D'], action: 'Duplicate selected element' },
  { keys: ['Delete'], mac: ['Backspace'], action: 'Delete selected element' },
  { keys: ['Ctrl', 'G'], mac: ['Cmd', 'G'], action: 'Toggle grid overlay' },
  { keys: ['Ctrl', 'Shift', 'C'], mac: ['Cmd', 'Shift', 'C'], action: 'Toggle code preview' },
  { keys: ['Ctrl', 'S'], mac: ['Cmd', 'S'], action: 'Save canvas' },
  { keys: ['Escape'], mac: ['Escape'], action: 'Deselect current element' },
];

const gettingStartedSteps: StepProps[] = [
  {
    number: 1,
    title: 'Browse Components',
    description: 'Open the component sidebar on the left and browse through 8 categories with 63+ pre-built components. Use the search bar to quickly find what you need.',
    icon: Layers,
    tips: ['Click category headers to expand/collapse', 'Components show a preview on hover'],
  },
  {
    number: 2,
    title: 'Drag to Canvas',
    description: 'Click and drag any component from the sidebar onto the canvas in the center. A drop indicator will show you where the element will be placed.',
    icon: MousePointerClick,
    tips: ['Drop between existing elements to insert', 'The canvas auto-scrolls when dragging near edges'],
  },
  {
    number: 3,
    title: 'Use Layout Containers',
    description: 'To arrange elements side by side, first drag a Flex Row, Flex Column, or Grid container, then drop elements inside them.',
    icon: LayoutGrid,
    tips: ['Flex Row arranges items horizontally', 'Grids offer 2, 3, or 4 column layouts'],
  },
  {
    number: 4,
    title: 'Customize Properties',
    description: 'Click any element to select it, then use the Properties Panel on the right to adjust spacing, colors, typography, and more.',
    icon: Settings2,
    tips: ['Changes apply instantly', 'Use color picker for precise colors'],
  },
  {
    number: 5,
    title: 'Preview Responsively',
    description: 'Use the viewport switcher in the toolbar to preview your design on Desktop, Tablet, and Mobile sizes.',
    icon: Monitor,
    tips: ['Desktop: 100% width', 'Tablet: 768px', 'Mobile: 375px'],
  },
  {
    number: 6,
    title: 'Export Your Code',
    description: 'Click the Export button to copy JSX/TSX code to your clipboard or download the complete component file.',
    icon: Download,
    tips: ['Code is production-ready', 'Includes all Tailwind classes'],
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function FeatureCard({ icon: Icon, title, description, items, gradient = 'from-blue-500/20 to-purple-500/20' }: FeatureCardProps) {
  return (
    <div className="group p-6 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all hover:bg-gray-900/80">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} border border-gray-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed mb-4">{description}</p>
      {items && items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StepCard({ number, title, description, icon: Icon, tips }: StepProps) {
  return (
    <div className="relative flex gap-6 pb-12 last:pb-0">
      {/* Connecting line */}
      <div className="absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-blue-500/50 to-transparent last:hidden" />

      {/* Step number circle */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25">
          {number}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-400 leading-relaxed mb-4">{description}</p>
        {tips && tips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tips.map((tip, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-400"
              >
                <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
                {tip}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ShortcutRow({ keys, action, mac }: ShortcutProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
      <div className="flex items-center gap-2">
        {keys.map((key, index) => (
          <span key={index} className="flex items-center gap-1">
            <kbd className="px-2.5 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 min-w-[2rem] text-center">
              {key}
            </kbd>
            {index < keys.length - 1 && <span className="text-gray-600">+</span>}
          </span>
        ))}
        {mac && (
          <span className="ml-2 text-xs text-gray-600">
            (Mac: {mac.join(' + ')})
          </span>
        )}
      </div>
      <span className="text-gray-400 text-sm">{action}</span>
    </div>
  );
}

function CategoryCard({ icon: Icon, name, count, color }: CategoryCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800/30 border border-gray-800 rounded-xl hover:bg-gray-800/50 transition-colors">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white text-sm">{name}</h4>
        <p className="text-xs text-gray-500">{count} components</p>
      </div>
    </div>
  );
}

function PropertyTabPreview({ icon: Icon, name, description }: { icon: React.ElementType; name: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-800/30 border border-gray-800 rounded-xl">
      <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white text-sm">{name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-shadow">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Tailwind Builder</span>
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-400">Tutorial</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/mhmdtriobyte/tailwind-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              Open Builder
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300">
            <Play className="w-4 h-4 text-green-400" />
            <span>Complete Guide to the Visual Builder</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Learn to Build{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Beautiful UIs
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Master the Tailwind Builder with this comprehensive tutorial. Learn every feature from drag and drop to code export.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#getting-started"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-base font-semibold transition-all hover:scale-105"
            >
              Start Learning
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-base font-medium transition-colors border border-gray-700"
            >
              Try the Builder
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Overview - Interface Sections */}
      <section className="py-16 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Interface Overview</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The builder is divided into four main areas designed for an intuitive workflow.
            </p>
          </div>

          {/* Visual Layout Diagram */}
          <div className="mb-12 rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 mx-4">
                <div className="max-w-md mx-auto px-4 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-400 text-center">
                  Builder Interface Layout
                </div>
              </div>
            </div>

            <div className="p-4">
              {/* Toolbar */}
              <div className="h-12 bg-gray-800 rounded-lg mb-4 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
                  <span className="text-sm text-gray-400">Toolbar</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-8 h-6 bg-gray-700 rounded flex items-center justify-center">
                      <Monitor className="w-3 h-3 text-gray-500" />
                    </div>
                    <div className="w-8 h-6 bg-gray-700 rounded flex items-center justify-center">
                      <Tablet className="w-3 h-3 text-gray-500" />
                    </div>
                    <div className="w-8 h-6 bg-gray-700 rounded flex items-center justify-center">
                      <Smartphone className="w-3 h-3 text-gray-500" />
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-gray-700 rounded text-xs text-gray-500 flex items-center justify-center">100%</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-6 bg-gray-700 rounded" />
                  <div className="w-16 h-6 bg-blue-600 rounded text-xs text-white flex items-center justify-center">Export</div>
                </div>
              </div>

              {/* Main area */}
              <div className="flex gap-4 h-64">
                {/* Sidebar */}
                <div className="w-48 bg-gray-800/50 rounded-lg p-3 border border-gray-700 flex flex-col">
                  <div className="text-xs text-blue-400 font-medium mb-2 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    Component Sidebar
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-6 bg-gray-700 rounded text-xs flex items-center px-2 text-gray-500">
                      Search...
                    </div>
                    <div className="h-6 bg-gray-700/50 rounded text-xs flex items-center px-2 text-gray-400">
                      Buttons (8)
                    </div>
                    <div className="h-6 bg-gray-700/50 rounded text-xs flex items-center px-2 text-gray-400">
                      Cards (10)
                    </div>
                    <div className="h-6 bg-gray-700/50 rounded text-xs flex items-center px-2 text-gray-400">
                      Forms (12)
                    </div>
                  </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-gray-950 rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mx-auto mb-3">
                      <Move className="w-6 h-6 text-gray-500" />
                    </div>
                    <span className="text-sm text-purple-400 font-medium">Canvas Area</span>
                    <p className="text-xs text-gray-500 mt-1">Drop components here</p>
                  </div>
                </div>

                {/* Properties Panel */}
                <div className="w-56 bg-gray-800/50 rounded-lg p-3 border border-gray-700 flex flex-col">
                  <div className="text-xs text-green-400 font-medium mb-2 flex items-center gap-1">
                    <Settings2 className="w-3 h-3" />
                    Properties Panel
                  </div>
                  <div className="flex gap-1 mb-2">
                    <div className="flex-1 h-6 bg-blue-600/30 rounded text-xs flex items-center justify-center text-blue-400">Layout</div>
                    <div className="flex-1 h-6 bg-gray-700 rounded text-xs flex items-center justify-center text-gray-500">Style</div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-6 bg-gray-700/50 rounded" />
                    <div className="h-6 bg-gray-700/50 rounded" />
                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-6 bg-gray-700/50 rounded" />
                      <div className="h-6 bg-gray-700/50 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Layers}
              title="Component Sidebar"
              description="Browse and search through 63 pre-built components organized in 8 categories."
              gradient="from-blue-500/20 to-blue-600/20"
            />
            <FeatureCard
              icon={Move}
              title="Canvas"
              description="The central workspace where you drag, drop, and arrange your UI components."
              gradient="from-purple-500/20 to-purple-600/20"
            />
            <FeatureCard
              icon={Settings2}
              title="Properties Panel"
              description="Fine-tune every aspect of your selected element with intuitive controls."
              gradient="from-green-500/20 to-green-600/20"
            />
            <FeatureCard
              icon={SlidersHorizontal}
              title="Toolbar"
              description="Access viewport switching, zoom, undo/redo, and export options."
              gradient="from-orange-500/20 to-orange-600/20"
            />
          </div>
        </div>
      </section>

      {/* Getting Started Steps */}
      <section id="getting-started" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Getting Started</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Follow these steps to create your first component in minutes.
            </p>
          </div>

          <div className="space-y-2">
            {gettingStartedSteps.map((step) => (
              <StepCard key={step.number} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* Component Categories */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Component Library</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              63 pre-built components across 8 categories, ready to drag and drop.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {componentCategories.map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>

          <div className="p-6 bg-gray-800/30 border border-gray-800 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Columns3 className="w-5 h-5 text-cyan-400" />
              Layout Containers
            </h3>
            <p className="text-gray-400 mb-4">
              Use these special containers to arrange elements in complex layouts:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    <div className="w-6 h-8 bg-blue-500/30 rounded" />
                    <div className="w-6 h-8 bg-blue-500/30 rounded" />
                    <div className="w-6 h-8 bg-blue-500/30 rounded" />
                  </div>
                </div>
                <h4 className="font-medium text-white">Flex Row</h4>
                <p className="text-sm text-gray-500">Arrange items horizontally</p>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                <div className="flex flex-col gap-1 mb-2">
                  <div className="w-full h-4 bg-purple-500/30 rounded" />
                  <div className="w-full h-4 bg-purple-500/30 rounded" />
                  <div className="w-full h-4 bg-purple-500/30 rounded" />
                </div>
                <h4 className="font-medium text-white">Flex Column</h4>
                <p className="text-sm text-gray-500">Stack items vertically</p>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                <div className="grid grid-cols-3 gap-1 mb-2">
                  <div className="h-4 bg-green-500/30 rounded" />
                  <div className="h-4 bg-green-500/30 rounded" />
                  <div className="h-4 bg-green-500/30 rounded" />
                  <div className="h-4 bg-green-500/30 rounded" />
                  <div className="h-4 bg-green-500/30 rounded" />
                  <div className="h-4 bg-green-500/30 rounded" />
                </div>
                <h4 className="font-medium text-white">Grid (2/3/4 cols)</h4>
                <p className="text-sm text-gray-500">Create responsive grids</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Panel Details */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Properties Panel</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Fine-tune every aspect of your elements with these property tabs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {propertyTabs.map((tab) => (
              <PropertyTabPreview key={tab.name} {...tab} />
            ))}
          </div>
        </div>
      </section>

      {/* Toolbar Features */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Toolbar Features</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Essential tools at your fingertips for a seamless building experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Monitor}
              title="Viewport Switching"
              description="Preview your design on different screen sizes."
              items={['Desktop (100% width)', 'Tablet (768px)', 'Mobile (375px)']}
              gradient="from-blue-500/20 to-cyan-500/20"
            />
            <FeatureCard
              icon={ZoomIn}
              title="Zoom Controls"
              description="Zoom in and out of the canvas for precision work."
              items={['Zoom levels: 50% to 150%', 'Quick zoom dropdown', 'Fit to screen']}
              gradient="from-purple-500/20 to-pink-500/20"
            />
            <FeatureCard
              icon={Grid3X3}
              title="Grid Toggle"
              description="Show or hide a grid overlay to help with alignment."
              items={['Visual alignment guides', 'Toggle with Ctrl+G']}
              gradient="from-green-500/20 to-emerald-500/20"
            />
            <FeatureCard
              icon={Undo2}
              title="Undo / Redo"
              description="Easily revert or reapply changes to your canvas."
              items={['Full history support', 'Keyboard shortcuts']}
              gradient="from-orange-500/20 to-yellow-500/20"
            />
            <FeatureCard
              icon={Trash2}
              title="Clear Canvas"
              description="Start fresh by clearing all elements from the canvas."
              items={['Confirmation dialog', 'Cannot be undone']}
              gradient="from-red-500/20 to-pink-500/20"
            />
            <FeatureCard
              icon={Download}
              title="Export Options"
              description="Get your code ready for production."
              items={['Copy JSX/TSX to clipboard', 'Download component file', 'Download full project (.zip)']}
              gradient="from-indigo-500/20 to-violet-500/20"
            />
          </div>
        </div>
      </section>

      {/* Element Actions */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Working with Elements</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Interact with elements on the canvas using these actions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MousePointer2 className="w-5 h-5 text-blue-400" />
                Selection & Hover
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MousePointerClick className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Click to select</span>
                    <p className="text-sm text-gray-500">Click any element to select it and view its properties</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Box className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Hover for toolbar</span>
                    <p className="text-sm text-gray-500">Hover over elements to reveal the action toolbar</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GripVertical className="w-5 h-5 text-green-400" />
                Drag & Reorder
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Move className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Drag to reorder</span>
                    <p className="text-sm text-gray-500">Drag elements to change their position in the layout</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Nest inside containers</span>
                    <p className="text-sm text-gray-500">Drop elements inside Flex or Grid containers</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Copy className="w-5 h-5 text-orange-400" />
                Duplicate & Delete
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Copy className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Duplicate element</span>
                    <p className="text-sm text-gray-500">Create a copy of any element with Ctrl+D</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Delete element</span>
                    <p className="text-sm text-gray-500">Remove elements with Delete or Backspace key</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-pink-400" />
                Code Preview
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Code2 className="w-3.5 h-3.5 text-pink-400" />
                  </div>
                  <div>
                    <span className="font-medium text-white">View generated code</span>
                    <p className="text-sm text-gray-500">Toggle code preview with Ctrl+Shift+C</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Copy className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Copy to clipboard</span>
                    <p className="text-sm text-gray-500">One-click copy for JSX or TSX code</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300">
              <Keyboard className="w-4 h-4 text-purple-400" />
              <span>Productivity Boost</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Keyboard Shortcuts</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Speed up your workflow with these keyboard shortcuts.
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
            {keyboardShortcuts.map((shortcut, index) => (
              <ShortcutRow key={index} {...shortcut} />
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pro Tips</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get the most out of the builder with these helpful tips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20">
              <Lightbulb className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Start with Layout</h3>
              <p className="text-gray-400 text-sm">
                Always add layout containers (Flex Row, Grid) first, then add content inside them for better organization.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-2xl border border-green-500/20">
              <Lightbulb className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Use the Grid</h3>
              <p className="text-gray-400 text-sm">
                Toggle the grid overlay (Ctrl+G) to help align elements precisely and maintain consistent spacing.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-2xl border border-orange-500/20">
              <Lightbulb className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Test Responsively</h3>
              <p className="text-gray-400 text-sm">
                Switch between viewport sizes frequently to ensure your design looks great on all devices.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
              <Lightbulb className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Duplicate Often</h3>
              <p className="text-gray-400 text-sm">
                Use Ctrl+D to duplicate elements when you need similar components - then just adjust the properties.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20">
              <Lightbulb className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Auto-Save Works</h3>
              <p className="text-gray-400 text-sm">
                Your canvas is automatically saved every 5 seconds and when you leave the page. Relax and design!
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl border border-red-500/20">
              <Lightbulb className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Undo is Your Friend</h3>
              <p className="text-gray-400 text-sm">
                Do not be afraid to experiment! You can always undo changes with Ctrl+Z if something does not look right.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Building?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Now that you know the basics, jump in and start creating beautiful UIs!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-xl text-lg font-semibold transition-all hover:scale-105"
              >
                Launch Builder
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-lg font-medium transition-colors border border-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">Tailwind Builder</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/builder" className="hover:text-white transition-colors">
                Builder
              </Link>
              <Link href="/tutorial" className="hover:text-white transition-colors text-white">
                Tutorial
              </Link>
              <a
                href="https://github.com/mhmdtriobyte/tailwind-builder"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            Built with Next.js, Tailwind CSS, and crafted with care.
          </div>
        </div>
      </footer>
    </div>
  );
}
