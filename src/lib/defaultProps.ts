import type { ElementStyles, PropValue } from '@/types/builder';

// Default styles factory
export function createDefaultStyles(overrides?: Partial<ElementStyles>): ElementStyles {
  return {
    layout: [],
    spacing: [],
    typography: [],
    colors: [],
    borders: [],
    effects: [],
    responsive: { sm: [], md: [], lg: [] },
    ...overrides,
  };
}

// Default props for each component type
export const defaultProps: Record<string, { props: Record<string, PropValue>; styles: ElementStyles }> = {
  // Buttons
  'primary-button': {
    props: { text: 'Button', href: '' },
    styles: createDefaultStyles({
      layout: ['inline-flex', 'items-center', 'justify-center'],
      spacing: ['px-4', 'py-2'],
      typography: ['text-sm', 'font-medium'],
      colors: ['bg-blue-600', 'text-white', 'hover:bg-blue-700'],
      borders: ['rounded-md'],
      effects: ['transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2'],
    }),
  },
  'secondary-button': {
    props: { text: 'Button', href: '' },
    styles: createDefaultStyles({
      layout: ['inline-flex', 'items-center', 'justify-center'],
      spacing: ['px-4', 'py-2'],
      typography: ['text-sm', 'font-medium'],
      colors: ['bg-gray-200', 'text-gray-900', 'hover:bg-gray-300'],
      borders: ['rounded-md'],
      effects: ['transition-colors'],
    }),
  },
  'outline-button': {
    props: { text: 'Button', href: '' },
    styles: createDefaultStyles({
      layout: ['inline-flex', 'items-center', 'justify-center'],
      spacing: ['px-4', 'py-2'],
      typography: ['text-sm', 'font-medium'],
      colors: ['bg-transparent', 'text-blue-600', 'hover:bg-blue-50'],
      borders: ['border', 'border-blue-600', 'rounded-md'],
      effects: ['transition-colors'],
    }),
  },
  'ghost-button': {
    props: { text: 'Button', href: '' },
    styles: createDefaultStyles({
      layout: ['inline-flex', 'items-center', 'justify-center'],
      spacing: ['px-4', 'py-2'],
      typography: ['text-sm', 'font-medium'],
      colors: ['bg-transparent', 'text-gray-700', 'hover:bg-gray-100'],
      borders: ['rounded-md'],
      effects: ['transition-colors'],
    }),
  },
  'icon-button': {
    props: { icon: 'Plus', ariaLabel: 'Icon button' },
    styles: createDefaultStyles({
      layout: ['inline-flex', 'items-center', 'justify-center'],
      spacing: ['p-2'],
      colors: ['bg-gray-100', 'text-gray-700', 'hover:bg-gray-200'],
      borders: ['rounded-md'],
      effects: ['transition-colors'],
    }),
  },
  'loading-button': {
    props: { text: 'Loading...', isLoading: true },
    styles: createDefaultStyles({
      layout: ['inline-flex', 'items-center', 'justify-center'],
      spacing: ['px-4', 'py-2', 'gap-2'],
      typography: ['text-sm', 'font-medium'],
      colors: ['bg-blue-600', 'text-white'],
      borders: ['rounded-md'],
      effects: ['opacity-75', 'cursor-not-allowed'],
    }),
  },
  'gradient-button': {
    props: { text: 'Button', href: '' },
    styles: createDefaultStyles({
      layout: ['inline-flex', 'items-center', 'justify-center'],
      spacing: ['px-6', 'py-3'],
      typography: ['text-sm', 'font-semibold'],
      colors: ['bg-gradient-to-r', 'from-purple-600', 'to-blue-600', 'text-white', 'hover:from-purple-700', 'hover:to-blue-700'],
      borders: ['rounded-lg'],
      effects: ['transition-all', 'shadow-lg', 'hover:shadow-xl'],
    }),
  },
  'button-group': {
    props: {},
    styles: createDefaultStyles({
      layout: ['inline-flex'],
      borders: ['rounded-md', 'overflow-hidden'],
      effects: ['shadow-sm'],
    }),
  },

  // Cards
  'simple-card': {
    props: { title: 'Card Title', description: 'Card description goes here.' },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['p-6'],
      colors: ['bg-white'],
      borders: ['rounded-lg', 'border', 'border-gray-200'],
      effects: ['shadow-sm'],
    }),
  },
  'product-card': {
    props: {
      image: 'https://via.placeholder.com/300x200',
      title: 'Product Name',
      price: '$99.00',
      description: 'Product description',
    },
    styles: createDefaultStyles({
      layout: ['w-full', 'max-w-sm', 'overflow-hidden'],
      colors: ['bg-white'],
      borders: ['rounded-lg', 'border', 'border-gray-200'],
      effects: ['shadow-sm', 'hover:shadow-md', 'transition-shadow'],
    }),
  },
  'pricing-card': {
    props: {
      tier: 'Pro',
      price: '$29',
      period: '/month',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      ctaText: 'Get Started',
      highlighted: false,
    },
    styles: createDefaultStyles({
      layout: ['w-full', 'max-w-sm'],
      spacing: ['p-8'],
      colors: ['bg-white'],
      borders: ['rounded-xl', 'border', 'border-gray-200'],
      effects: ['shadow-lg'],
    }),
  },
  'testimonial-card': {
    props: {
      quote: 'This is an amazing product that has changed my life.',
      author: 'John Doe',
      role: 'CEO, Company',
      avatar: 'https://via.placeholder.com/48',
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['p-6'],
      colors: ['bg-white'],
      borders: ['rounded-lg', 'border', 'border-gray-200'],
      effects: ['shadow-sm'],
    }),
  },
  'profile-card': {
    props: {
      name: 'Jane Smith',
      role: 'Designer',
      bio: 'Creative designer with 5+ years of experience.',
      avatar: 'https://via.placeholder.com/96',
      social: { twitter: '#', linkedin: '#' },
    },
    styles: createDefaultStyles({
      layout: ['w-full', 'max-w-sm'],
      spacing: ['p-6'],
      colors: ['bg-white'],
      borders: ['rounded-xl', 'border', 'border-gray-200'],
      effects: ['shadow-md'],
    }),
  },
  'blog-card': {
    props: {
      image: 'https://via.placeholder.com/400x200',
      date: 'Dec 1, 2024',
      title: 'Blog Post Title',
      excerpt: 'A short excerpt from the blog post...',
    },
    styles: createDefaultStyles({
      layout: ['w-full', 'max-w-md', 'overflow-hidden'],
      colors: ['bg-white'],
      borders: ['rounded-lg', 'border', 'border-gray-200'],
      effects: ['shadow-sm', 'hover:shadow-md', 'transition-shadow'],
    }),
  },
  'stats-card': {
    props: { value: '100+', label: 'Happy Customers', icon: 'Users' },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['p-6'],
      colors: ['bg-white'],
      borders: ['rounded-lg', 'border', 'border-gray-200'],
      effects: ['shadow-sm'],
    }),
  },
  'feature-card': {
    props: {
      icon: 'Zap',
      title: 'Feature Title',
      description: 'Feature description goes here.',
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['p-6'],
      colors: ['bg-white'],
      borders: ['rounded-lg', 'border', 'border-gray-200'],
      effects: ['shadow-sm'],
    }),
  },
  'image-card': {
    props: {
      image: 'https://via.placeholder.com/400x300',
      title: 'Card Title',
      subtitle: 'Card subtitle',
    },
    styles: createDefaultStyles({
      layout: ['w-full', 'max-w-sm', 'relative', 'overflow-hidden'],
      borders: ['rounded-xl'],
      effects: ['shadow-lg'],
    }),
  },
  'horizontal-card': {
    props: {
      image: 'https://via.placeholder.com/200x150',
      title: 'Card Title',
      description: 'Card description text goes here.',
    },
    styles: createDefaultStyles({
      layout: ['w-full', 'flex', 'flex-col', 'md:flex-row', 'overflow-hidden'],
      colors: ['bg-white'],
      borders: ['rounded-lg', 'border', 'border-gray-200'],
      effects: ['shadow-sm'],
    }),
  },

  // Navigation
  'navbar': {
    props: {
      logo: 'Logo',
      links: [
        { text: 'Home', href: '#' },
        { text: 'About', href: '#' },
        { text: 'Services', href: '#' },
        { text: 'Contact', href: '#' },
      ],
      ctaText: 'Get Started',
    },
    styles: createDefaultStyles({
      layout: ['w-full', 'flex', 'items-center', 'justify-between'],
      spacing: ['px-6', 'py-4'],
      colors: ['bg-white'],
      borders: ['border-b', 'border-gray-200'],
    }),
  },
  'mobile-menu': {
    props: { isOpen: false },
    styles: createDefaultStyles({
      layout: ['fixed', 'inset-0', 'z-50'],
      colors: ['bg-white'],
    }),
  },
  'footer': {
    props: {
      columns: [
        { title: 'Company', links: ['About', 'Careers', 'Press'] },
        { title: 'Product', links: ['Features', 'Pricing', 'FAQ'] },
        { title: 'Resources', links: ['Blog', 'Docs', 'Support'] },
      ],
      copyright: '© 2024 Company. All rights reserved.',
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['px-6', 'py-12'],
      colors: ['bg-gray-900', 'text-white'],
    }),
  },
  'breadcrumb': {
    props: {
      items: [
        { text: 'Home', href: '#' },
        { text: 'Products', href: '#' },
        { text: 'Current Page' },
      ],
    },
    styles: createDefaultStyles({
      layout: ['flex', 'items-center'],
      spacing: ['gap-2'],
      typography: ['text-sm'],
      colors: ['text-gray-600'],
    }),
  },
  'tabs': {
    props: {
      tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
      activeTab: 0,
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      borders: ['border-b', 'border-gray-200'],
    }),
  },
  'pagination': {
    props: { currentPage: 1, totalPages: 10 },
    styles: createDefaultStyles({
      layout: ['flex', 'items-center', 'justify-center'],
      spacing: ['gap-2'],
    }),
  },

  // Forms
  'input-field': {
    props: { label: 'Label', placeholder: 'Enter text...', helperText: '' },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['space-y-1'],
    }),
  },
  'textarea': {
    props: { label: 'Message', placeholder: 'Enter your message...', rows: 4 },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['space-y-1'],
    }),
  },
  'select-dropdown': {
    props: {
      label: 'Select an option',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['space-y-1'],
    }),
  },
  'checkbox': {
    props: { label: 'Check this box', checked: false },
    styles: createDefaultStyles({
      layout: ['flex', 'items-center'],
      spacing: ['gap-2'],
    }),
  },
  'radio-group': {
    props: {
      label: 'Choose an option',
      options: ['Option A', 'Option B', 'Option C'],
      selected: 'Option A',
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['space-y-2'],
    }),
  },
  'toggle-switch': {
    props: { label: 'Enable feature', enabled: false },
    styles: createDefaultStyles({
      layout: ['flex', 'items-center', 'justify-between'],
    }),
  },
  'login-form': {
    props: {
      title: 'Sign In',
      forgotPasswordLink: '#',
      signupLink: '#',
    },
    styles: createDefaultStyles({
      layout: ['w-full', 'max-w-md'],
      spacing: ['p-8', 'space-y-6'],
      colors: ['bg-white'],
      borders: ['rounded-xl', 'border', 'border-gray-200'],
      effects: ['shadow-lg'],
    }),
  },
  'signup-form': {
    props: {
      title: 'Create Account',
      loginLink: '#',
    },
    styles: createDefaultStyles({
      layout: ['w-full', 'max-w-md'],
      spacing: ['p-8', 'space-y-6'],
      colors: ['bg-white'],
      borders: ['rounded-xl', 'border', 'border-gray-200'],
      effects: ['shadow-lg'],
    }),
  },
  'contact-form': {
    props: {
      title: 'Contact Us',
      submitText: 'Send Message',
    },
    styles: createDefaultStyles({
      layout: ['w-full', 'max-w-lg'],
      spacing: ['p-8', 'space-y-6'],
      colors: ['bg-white'],
      borders: ['rounded-xl', 'border', 'border-gray-200'],
      effects: ['shadow-lg'],
    }),
  },
  'search-bar': {
    props: { placeholder: 'Search...', buttonText: 'Search' },
    styles: createDefaultStyles({
      layout: ['w-full', 'max-w-xl', 'flex'],
      borders: ['rounded-lg', 'overflow-hidden', 'border', 'border-gray-300'],
    }),
  },
  'newsletter-form': {
    props: { placeholder: 'Enter your email', buttonText: 'Subscribe' },
    styles: createDefaultStyles({
      layout: ['w-full', 'max-w-md', 'flex'],
      spacing: ['gap-2'],
    }),
  },
  'file-upload': {
    props: { label: 'Upload a file', accept: '*' },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['p-6'],
      colors: ['bg-gray-50'],
      borders: ['border-2', 'border-dashed', 'border-gray-300', 'rounded-lg'],
    }),
  },

  // Sections
  'hero-section': {
    props: {
      headline: 'Build Something Amazing',
      subtext: 'Create beautiful websites with our easy-to-use drag and drop builder.',
      ctaText: 'Get Started',
      ctaLink: '#',
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  'hero-with-image': {
    props: {
      headline: 'Build Something Amazing',
      subtext: 'Create beautiful websites with our easy-to-use drag and drop builder.',
      ctaText: 'Get Started',
      image: 'https://via.placeholder.com/600x400',
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gradient-to-br', 'from-blue-50', 'to-indigo-100'],
    }),
  },
  'feature-section': {
    props: {
      title: 'Our Features',
      subtitle: 'Everything you need to succeed',
      features: [
        { icon: 'Zap', title: 'Fast', description: 'Lightning fast performance' },
        { icon: 'Shield', title: 'Secure', description: 'Enterprise-grade security' },
        { icon: 'Smile', title: 'Easy', description: 'Simple to use interface' },
      ],
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  'cta-section': {
    props: {
      headline: 'Ready to get started?',
      description: 'Join thousands of satisfied customers.',
      ctaText: 'Start Free Trial',
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['py-16', 'px-6'],
      colors: ['bg-blue-600', 'text-white'],
    }),
  },
  'stats-section': {
    props: {
      stats: [
        { value: '10K+', label: 'Customers' },
        { value: '99%', label: 'Satisfaction' },
        { value: '24/7', label: 'Support' },
        { value: '100+', label: 'Countries' },
      ],
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['py-16', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  'testimonials-section': {
    props: {
      title: 'What Our Customers Say',
      testimonials: [
        { quote: 'Amazing product!', author: 'John Doe', role: 'CEO' },
        { quote: 'Highly recommended!', author: 'Jane Smith', role: 'Designer' },
      ],
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  'team-section': {
    props: {
      title: 'Meet Our Team',
      members: [
        { name: 'John Doe', role: 'CEO', avatar: 'https://via.placeholder.com/150' },
        { name: 'Jane Smith', role: 'CTO', avatar: 'https://via.placeholder.com/150' },
      ],
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  'faq-section': {
    props: {
      title: 'Frequently Asked Questions',
      faqs: [
        { question: 'What is this?', answer: 'This is an amazing product.' },
        { question: 'How does it work?', answer: 'It works magically.' },
      ],
    },
    styles: createDefaultStyles({
      layout: ['w-full', 'max-w-3xl', 'mx-auto'],
      spacing: ['py-24', 'px-6'],
    }),
  },
  'pricing-section': {
    props: {
      title: 'Choose Your Plan',
      plans: [
        { tier: 'Basic', price: '$9', features: ['Feature 1', 'Feature 2'] },
        { tier: 'Pro', price: '$29', features: ['All Basic', 'Feature 3', 'Feature 4'], highlighted: true },
        { tier: 'Enterprise', price: '$99', features: ['All Pro', 'Feature 5', 'Feature 6'] },
      ],
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  'contact-section': {
    props: {
      title: 'Get in Touch',
      email: 'contact@example.com',
      phone: '+1 234 567 890',
      address: '123 Main St, City, Country',
    },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },

  // Layout
  'container': {
    props: {},
    styles: createDefaultStyles({
      layout: ['max-w-7xl', 'mx-auto', 'w-full'],
      spacing: ['px-4', 'sm:px-6', 'lg:px-8'],
    }),
  },
  'grid-2-col': {
    props: {},
    styles: createDefaultStyles({
      layout: ['grid', 'grid-cols-1', 'md:grid-cols-2'],
      spacing: ['gap-6'],
    }),
  },
  'grid-3-col': {
    props: {},
    styles: createDefaultStyles({
      layout: ['grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3'],
      spacing: ['gap-6'],
    }),
  },
  'grid-4-col': {
    props: {},
    styles: createDefaultStyles({
      layout: ['grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4'],
      spacing: ['gap-6'],
    }),
  },
  'flex-row': {
    props: {},
    styles: createDefaultStyles({
      layout: ['flex', 'flex-row', 'flex-wrap', 'items-center'],
      spacing: ['gap-4'],
    }),
  },
  'flex-column': {
    props: {},
    styles: createDefaultStyles({
      layout: ['flex', 'flex-col'],
      spacing: ['gap-4'],
    }),
  },
  'divider': {
    props: {},
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['my-8'],
      borders: ['border-t', 'border-gray-200'],
    }),
  },
  'spacer': {
    props: { size: 'md' },
    styles: createDefaultStyles({
      layout: ['w-full'],
      spacing: ['h-16'],
    }),
  },

  // Media
  'image': {
    props: {
      src: 'https://via.placeholder.com/400x300',
      alt: 'Image',
    },
    styles: createDefaultStyles({
      layout: ['w-full', 'h-auto'],
      borders: ['rounded-lg'],
    }),
  },
  'avatar': {
    props: {
      src: 'https://via.placeholder.com/48',
      alt: 'Avatar',
      size: 'md',
    },
    styles: createDefaultStyles({
      layout: ['w-12', 'h-12'],
      borders: ['rounded-full'],
    }),
  },
  'icon': {
    props: { name: 'Star', size: 24 },
    styles: createDefaultStyles({
      colors: ['text-gray-600'],
    }),
  },
  'video': {
    props: {
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      aspectRatio: '16/9',
    },
    styles: createDefaultStyles({
      layout: ['w-full', 'aspect-video'],
      borders: ['rounded-lg', 'overflow-hidden'],
    }),
  },

  // Text
  'heading': {
    props: { text: 'Heading Text', level: 'h2' },
    styles: createDefaultStyles({
      typography: ['text-3xl', 'font-bold'],
      colors: ['text-gray-900'],
    }),
  },
  'paragraph': {
    props: { text: 'This is a paragraph of text. Add your content here.' },
    styles: createDefaultStyles({
      typography: ['text-base'],
      colors: ['text-gray-600'],
      spacing: ['leading-relaxed'],
    }),
  },
  'badge': {
    props: { text: 'Badge', variant: 'primary' },
    styles: createDefaultStyles({
      layout: ['inline-flex', 'items-center'],
      spacing: ['px-2.5', 'py-0.5'],
      typography: ['text-xs', 'font-medium'],
      colors: ['bg-blue-100', 'text-blue-800'],
      borders: ['rounded-full'],
    }),
  },
  'link': {
    props: { text: 'Click here', href: '#' },
    styles: createDefaultStyles({
      typography: ['text-base'],
      colors: ['text-blue-600', 'hover:text-blue-800'],
      effects: ['underline', 'cursor-pointer'],
    }),
  },
  'list': {
    props: {
      items: ['Item 1', 'Item 2', 'Item 3'],
      ordered: false,
    },
    styles: createDefaultStyles({
      layout: ['list-disc', 'list-inside'],
      spacing: ['space-y-2'],
      colors: ['text-gray-600'],
    }),
  },
};

export function getDefaultProps(type: string) {
  return defaultProps[type] || { props: {}, styles: createDefaultStyles() };
}
