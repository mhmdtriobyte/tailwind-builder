/**
 * Layout Templates Library
 *
 * Pre-built page and section templates for rapid page building.
 * Templates are organized by category and include complete HTML/Tailwind structures.
 */

import type { BuilderElement, ElementStyles } from '@/types/builder';

// ============================================================================
// TYPES
// ============================================================================

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  subcategory?: string;
  tags: string[];
  thumbnail?: string;
  isPremium?: boolean;
  popularity?: number;
}

export interface PageTemplate extends TemplateMetadata {
  type: 'page';
  sections: SectionTemplate[];
}

export interface SectionTemplate extends TemplateMetadata {
  type: 'section';
  element: BuilderElement;
}

export type Template = PageTemplate | SectionTemplate;

export type TemplateCategory =
  | 'landing'
  | 'business'
  | 'ecommerce'
  | 'blog'
  | 'dashboard'
  | 'auth'
  | 'error'
  | 'headers'
  | 'footers'
  | 'heroes'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'cta'
  | 'faq'
  | 'team'
  | 'contact';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

let idCounter = 0;

function generateId(): string {
  return `tpl_${Date.now()}_${++idCounter}`;
}

function createDefaultStyles(overrides?: Partial<ElementStyles>): ElementStyles {
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

function createElement(
  type: string,
  name: string,
  props: Record<string, unknown> = {},
  styles: Partial<ElementStyles> = {},
  children: BuilderElement[] = []
): BuilderElement {
  return {
    id: generateId(),
    type,
    name,
    props,
    styles: createDefaultStyles(styles),
    children,
    parentId: null,
  };
}

// ============================================================================
// SECTION TEMPLATES - HEADERS (10 variants)
// ============================================================================

export const headerTemplates: SectionTemplate[] = [
  {
    id: 'header-simple',
    name: 'Simple Header',
    description: 'Clean header with logo and navigation',
    category: 'headers',
    tags: ['minimal', 'clean', 'navigation'],
    type: 'section',
    element: createElement('navbar', 'Simple Header', {
      logo: 'Brand',
      links: [
        { text: 'Home', href: '#' },
        { text: 'Features', href: '#features' },
        { text: 'Pricing', href: '#pricing' },
        { text: 'Contact', href: '#contact' },
      ],
      ctaText: 'Get Started',
    }, {
      layout: ['w-full', 'flex', 'items-center', 'justify-between'],
      spacing: ['px-6', 'py-4'],
      colors: ['bg-white'],
      borders: ['border-b', 'border-gray-200'],
    }),
  },
  {
    id: 'header-dark',
    name: 'Dark Header',
    description: 'Dark themed header with contrast',
    category: 'headers',
    tags: ['dark', 'modern', 'contrast'],
    type: 'section',
    element: createElement('navbar', 'Dark Header', {
      logo: 'Brand',
      links: [
        { text: 'Products', href: '#' },
        { text: 'Solutions', href: '#' },
        { text: 'Resources', href: '#' },
        { text: 'Pricing', href: '#' },
      ],
      ctaText: 'Sign Up',
    }, {
      layout: ['w-full', 'flex', 'items-center', 'justify-between'],
      spacing: ['px-8', 'py-5'],
      colors: ['bg-gray-900', 'text-white'],
    }),
  },
  {
    id: 'header-transparent',
    name: 'Transparent Header',
    description: 'Transparent header for hero overlays',
    category: 'headers',
    tags: ['transparent', 'overlay', 'hero'],
    type: 'section',
    element: createElement('navbar', 'Transparent Header', {
      logo: 'Brand',
      links: [
        { text: 'About', href: '#' },
        { text: 'Services', href: '#' },
        { text: 'Work', href: '#' },
        { text: 'Blog', href: '#' },
      ],
      ctaText: 'Contact',
    }, {
      layout: ['w-full', 'flex', 'items-center', 'justify-between', 'absolute', 'top-0', 'left-0', 'right-0', 'z-50'],
      spacing: ['px-8', 'py-6'],
      colors: ['bg-transparent', 'text-white'],
    }),
  },
  {
    id: 'header-centered',
    name: 'Centered Header',
    description: 'Centered logo with balanced navigation',
    category: 'headers',
    tags: ['centered', 'balanced', 'elegant'],
    type: 'section',
    element: createElement('container', 'Centered Header', {}, {
      layout: ['w-full'],
      spacing: ['py-4'],
      colors: ['bg-white'],
      borders: ['border-b', 'border-gray-100'],
    }, [
      createElement('flex-row', 'Header Content', {}, {
        layout: ['flex', 'items-center', 'justify-center'],
        spacing: ['gap-12'],
      }),
    ]),
  },
  {
    id: 'header-mega-menu',
    name: 'Mega Menu Header',
    description: 'Header with dropdown mega menus',
    category: 'headers',
    tags: ['mega-menu', 'dropdown', 'enterprise'],
    type: 'section',
    element: createElement('navbar', 'Mega Menu Header', {
      logo: 'Enterprise',
      links: [
        { text: 'Products', href: '#', hasDropdown: true },
        { text: 'Solutions', href: '#', hasDropdown: true },
        { text: 'Developers', href: '#' },
        { text: 'Resources', href: '#', hasDropdown: true },
        { text: 'Pricing', href: '#' },
      ],
      ctaText: 'Start Free',
      secondaryCta: 'Login',
    }, {
      layout: ['w-full', 'flex', 'items-center', 'justify-between'],
      spacing: ['px-8', 'py-4'],
      colors: ['bg-white'],
      borders: ['border-b', 'border-gray-200'],
      effects: ['shadow-sm'],
    }),
  },
  {
    id: 'header-sticky',
    name: 'Sticky Header',
    description: 'Fixed header that stays on scroll',
    category: 'headers',
    tags: ['sticky', 'fixed', 'scroll'],
    type: 'section',
    element: createElement('navbar', 'Sticky Header', {
      logo: 'Brand',
      links: [
        { text: 'Features', href: '#' },
        { text: 'Pricing', href: '#' },
        { text: 'About', href: '#' },
      ],
      ctaText: 'Get Started',
    }, {
      layout: ['w-full', 'flex', 'items-center', 'justify-between', 'fixed', 'top-0', 'z-50'],
      spacing: ['px-6', 'py-3'],
      colors: ['bg-white/95', 'backdrop-blur-sm'],
      borders: ['border-b', 'border-gray-200/50'],
      effects: ['shadow-sm'],
    }),
  },
  {
    id: 'header-minimal',
    name: 'Minimal Header',
    description: 'Ultra-minimal header design',
    category: 'headers',
    tags: ['minimal', 'simple', 'clean'],
    type: 'section',
    element: createElement('navbar', 'Minimal Header', {
      logo: 'Logo',
      links: [
        { text: 'Work', href: '#' },
        { text: 'About', href: '#' },
        { text: 'Contact', href: '#' },
      ],
    }, {
      layout: ['w-full', 'flex', 'items-center', 'justify-between'],
      spacing: ['px-8', 'py-8'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'header-split',
    name: 'Split Header',
    description: 'Logo left, nav center, CTA right',
    category: 'headers',
    tags: ['split', 'three-column', 'balanced'],
    type: 'section',
    element: createElement('navbar', 'Split Header', {
      logo: 'Brand',
      links: [
        { text: 'Home', href: '#' },
        { text: 'Products', href: '#' },
        { text: 'Services', href: '#' },
        { text: 'About', href: '#' },
      ],
      ctaText: 'Book Demo',
    }, {
      layout: ['w-full', 'grid', 'grid-cols-3', 'items-center'],
      spacing: ['px-8', 'py-4'],
      colors: ['bg-white'],
      borders: ['border-b', 'border-gray-200'],
    }),
  },
  {
    id: 'header-gradient',
    name: 'Gradient Header',
    description: 'Header with gradient background',
    category: 'headers',
    tags: ['gradient', 'colorful', 'modern'],
    type: 'section',
    element: createElement('navbar', 'Gradient Header', {
      logo: 'Brand',
      links: [
        { text: 'Features', href: '#' },
        { text: 'Pricing', href: '#' },
        { text: 'Blog', href: '#' },
      ],
      ctaText: 'Try Free',
    }, {
      layout: ['w-full', 'flex', 'items-center', 'justify-between'],
      spacing: ['px-8', 'py-5'],
      colors: ['bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white'],
    }),
  },
  {
    id: 'header-announcement',
    name: 'Header with Announcement',
    description: 'Header with top announcement bar',
    category: 'headers',
    tags: ['announcement', 'banner', 'promo'],
    type: 'section',
    element: createElement('flex-column', 'Header with Announcement', {}, {
      layout: ['w-full'],
    }, [
      createElement('container', 'Announcement Bar', {}, {
        layout: ['w-full', 'text-center'],
        spacing: ['py-2', 'px-4'],
        colors: ['bg-blue-600', 'text-white'],
        typography: ['text-sm'],
      }),
      createElement('navbar', 'Main Nav', {
        logo: 'Brand',
        links: [{ text: 'Features', href: '#' }, { text: 'Pricing', href: '#' }],
        ctaText: 'Sign Up',
      }, {
        layout: ['w-full', 'flex', 'items-center', 'justify-between'],
        spacing: ['px-6', 'py-4'],
        colors: ['bg-white'],
      }),
    ]),
  },
];

// ============================================================================
// SECTION TEMPLATES - FOOTERS (10 variants)
// ============================================================================

export const footerTemplates: SectionTemplate[] = [
  {
    id: 'footer-simple',
    name: 'Simple Footer',
    description: 'Minimal footer with essential links',
    category: 'footers',
    tags: ['simple', 'minimal', 'clean'],
    type: 'section',
    element: createElement('footer', 'Simple Footer', {
      columns: [
        { title: 'Product', links: ['Features', 'Pricing', 'FAQ'] },
        { title: 'Company', links: ['About', 'Blog', 'Careers'] },
        { title: 'Legal', links: ['Privacy', 'Terms'] },
      ],
      copyright: '2024 Company. All rights reserved.',
    }, {
      layout: ['w-full'],
      spacing: ['px-8', 'py-12'],
      colors: ['bg-gray-900', 'text-white'],
    }),
  },
  {
    id: 'footer-extended',
    name: 'Extended Footer',
    description: 'Comprehensive footer with many sections',
    category: 'footers',
    tags: ['extended', 'comprehensive', 'detailed'],
    type: 'section',
    element: createElement('footer', 'Extended Footer', {
      columns: [
        { title: 'Products', links: ['Analytics', 'Commerce', 'Insights', 'Automation', 'Integrations'] },
        { title: 'Resources', links: ['Documentation', 'Guides', 'API Reference', 'Community', 'Templates'] },
        { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Partners', 'Contact'] },
        { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'] },
      ],
      copyright: '2024 Company Inc. All rights reserved.',
      socialLinks: ['twitter', 'linkedin', 'github', 'youtube'],
    }, {
      layout: ['w-full'],
      spacing: ['px-8', 'py-16'],
      colors: ['bg-gray-950', 'text-gray-300'],
    }),
  },
  {
    id: 'footer-newsletter',
    name: 'Footer with Newsletter',
    description: 'Footer featuring newsletter signup',
    category: 'footers',
    tags: ['newsletter', 'subscription', 'email'],
    type: 'section',
    element: createElement('footer', 'Newsletter Footer', {
      columns: [
        { title: 'Company', links: ['About', 'Careers', 'Press'] },
        { title: 'Resources', links: ['Blog', 'Help Center', 'Contact'] },
      ],
      newsletter: { title: 'Subscribe to our newsletter', placeholder: 'Enter your email' },
      copyright: '2024 Company. All rights reserved.',
    }, {
      layout: ['w-full'],
      spacing: ['px-8', 'py-16'],
      colors: ['bg-gray-900', 'text-white'],
    }),
  },
  {
    id: 'footer-centered',
    name: 'Centered Footer',
    description: 'Centered layout footer design',
    category: 'footers',
    tags: ['centered', 'balanced', 'symmetric'],
    type: 'section',
    element: createElement('footer', 'Centered Footer', {
      logo: 'Brand',
      links: ['Home', 'About', 'Services', 'Blog', 'Contact'],
      copyright: '2024 Brand. All rights reserved.',
      socialLinks: ['twitter', 'linkedin', 'instagram'],
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['px-8', 'py-12'],
      colors: ['bg-white'],
      borders: ['border-t', 'border-gray-200'],
    }),
  },
  {
    id: 'footer-dark-gradient',
    name: 'Dark Gradient Footer',
    description: 'Footer with dark gradient background',
    category: 'footers',
    tags: ['dark', 'gradient', 'modern'],
    type: 'section',
    element: createElement('footer', 'Dark Gradient Footer', {
      columns: [
        { title: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog'] },
        { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press Kit'] },
        { title: 'Support', links: ['Help Center', 'Contact', 'Status', 'API Docs'] },
      ],
      copyright: '2024 Company. Built with love.',
    }, {
      layout: ['w-full'],
      spacing: ['px-8', 'py-16'],
      colors: ['bg-gradient-to-b', 'from-gray-900', 'to-black', 'text-gray-300'],
    }),
  },
  {
    id: 'footer-minimal',
    name: 'Minimal Footer',
    description: 'Ultra-minimal footer design',
    category: 'footers',
    tags: ['minimal', 'simple', 'clean'],
    type: 'section',
    element: createElement('footer', 'Minimal Footer', {
      copyright: '2024 Company',
      links: ['Privacy', 'Terms'],
    }, {
      layout: ['w-full', 'flex', 'items-center', 'justify-between'],
      spacing: ['px-8', 'py-6'],
      colors: ['bg-white', 'text-gray-600'],
      borders: ['border-t', 'border-gray-200'],
    }),
  },
  {
    id: 'footer-cta',
    name: 'Footer with CTA',
    description: 'Footer with prominent call-to-action',
    category: 'footers',
    tags: ['cta', 'conversion', 'action'],
    type: 'section',
    element: createElement('flex-column', 'CTA Footer', {}, {
      layout: ['w-full'],
    }, [
      createElement('cta-section', 'Footer CTA', {
        headline: 'Ready to get started?',
        description: 'Join thousands of satisfied customers today.',
        ctaText: 'Start Free Trial',
      }, {
        layout: ['w-full', 'text-center'],
        spacing: ['py-16', 'px-8'],
        colors: ['bg-blue-600', 'text-white'],
      }),
      createElement('footer', 'Footer Links', {
        columns: [
          { title: 'Product', links: ['Features', 'Pricing'] },
          { title: 'Company', links: ['About', 'Contact'] },
        ],
        copyright: '2024 Company. All rights reserved.',
      }, {
        layout: ['w-full'],
        spacing: ['px-8', 'py-12'],
        colors: ['bg-gray-900', 'text-white'],
      }),
    ]),
  },
  {
    id: 'footer-split',
    name: 'Split Footer',
    description: 'Two-column split footer layout',
    category: 'footers',
    tags: ['split', 'two-column', 'asymmetric'],
    type: 'section',
    element: createElement('footer', 'Split Footer', {
      leftContent: {
        logo: 'Brand',
        description: 'Building the future of web development.',
        socialLinks: ['twitter', 'github', 'linkedin'],
      },
      columns: [
        { title: 'Links', links: ['Home', 'About', 'Services', 'Contact'] },
      ],
      copyright: '2024 Brand. All rights reserved.',
    }, {
      layout: ['w-full', 'grid', 'grid-cols-2', 'gap-12'],
      spacing: ['px-8', 'py-16'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'footer-app',
    name: 'App Download Footer',
    description: 'Footer with app download badges',
    category: 'footers',
    tags: ['app', 'download', 'mobile'],
    type: 'section',
    element: createElement('footer', 'App Footer', {
      columns: [
        { title: 'Company', links: ['About', 'Careers', 'Press'] },
        { title: 'Support', links: ['Help', 'Contact', 'FAQ'] },
      ],
      appBadges: ['ios', 'android'],
      copyright: '2024 App Company. All rights reserved.',
    }, {
      layout: ['w-full'],
      spacing: ['px-8', 'py-16'],
      colors: ['bg-gray-900', 'text-white'],
    }),
  },
  {
    id: 'footer-social',
    name: 'Social-Focused Footer',
    description: 'Footer emphasizing social media',
    category: 'footers',
    tags: ['social', 'community', 'engagement'],
    type: 'section',
    element: createElement('footer', 'Social Footer', {
      logo: 'Brand',
      tagline: 'Connect with us',
      socialLinks: ['twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'tiktok'],
      links: ['Privacy', 'Terms', 'Contact'],
      copyright: '2024 Brand. All rights reserved.',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['px-8', 'py-12'],
      colors: ['bg-white'],
      borders: ['border-t', 'border-gray-200'],
    }),
  },
];

// ============================================================================
// SECTION TEMPLATES - HEROES (15 variants)
// ============================================================================

export const heroTemplates: SectionTemplate[] = [
  {
    id: 'hero-centered',
    name: 'Centered Hero',
    description: 'Classic centered hero with headline and CTA',
    category: 'heroes',
    tags: ['centered', 'classic', 'simple'],
    type: 'section',
    element: createElement('hero-section', 'Centered Hero', {
      headline: 'Build Something Amazing',
      subtext: 'Create beautiful websites with our intuitive drag-and-drop builder.',
      ctaText: 'Get Started Free',
      secondaryCtaText: 'Watch Demo',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'hero-split',
    name: 'Split Hero',
    description: 'Two-column hero with image',
    category: 'heroes',
    tags: ['split', 'image', 'two-column'],
    type: 'section',
    element: createElement('hero-with-image', 'Split Hero', {
      headline: 'The Modern Way to Build',
      subtext: 'Experience the future of web development with our cutting-edge platform.',
      ctaText: 'Start Building',
      image: 'https://via.placeholder.com/600x400',
      imagePosition: 'right',
    }, {
      layout: ['w-full'],
      spacing: ['py-20', 'px-8'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'hero-gradient',
    name: 'Gradient Hero',
    description: 'Hero with vibrant gradient background',
    category: 'heroes',
    tags: ['gradient', 'colorful', 'modern'],
    type: 'section',
    element: createElement('hero-section', 'Gradient Hero', {
      headline: 'Supercharge Your Workflow',
      subtext: 'Join thousands of teams using our platform to build faster.',
      ctaText: 'Try for Free',
      secondaryCtaText: 'Learn More',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-32', 'px-6'],
      colors: ['bg-gradient-to-br', 'from-purple-600', 'via-blue-600', 'to-cyan-500', 'text-white'],
    }),
  },
  {
    id: 'hero-video',
    name: 'Video Background Hero',
    description: 'Hero with video background',
    category: 'heroes',
    tags: ['video', 'dynamic', 'immersive'],
    type: 'section',
    element: createElement('hero-section', 'Video Hero', {
      headline: 'Immersive Experiences',
      subtext: 'Create stunning websites that captivate your audience.',
      ctaText: 'Get Started',
      videoUrl: 'https://example.com/video.mp4',
    }, {
      layout: ['w-full', 'text-center', 'relative'],
      spacing: ['py-40', 'px-6'],
      colors: ['bg-black', 'text-white'],
    }),
  },
  {
    id: 'hero-minimal',
    name: 'Minimal Hero',
    description: 'Clean minimal hero design',
    category: 'heroes',
    tags: ['minimal', 'clean', 'simple'],
    type: 'section',
    element: createElement('hero-section', 'Minimal Hero', {
      headline: 'Less is More',
      subtext: 'Simple, elegant, effective.',
      ctaText: 'Explore',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-32', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'hero-dark',
    name: 'Dark Hero',
    description: 'Dark themed hero section',
    category: 'heroes',
    tags: ['dark', 'contrast', 'bold'],
    type: 'section',
    element: createElement('hero-section', 'Dark Hero', {
      headline: 'Power Your Business',
      subtext: 'Enterprise-grade solutions for modern challenges.',
      ctaText: 'Request Demo',
      secondaryCtaText: 'Contact Sales',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-28', 'px-6'],
      colors: ['bg-gray-950', 'text-white'],
    }),
  },
  {
    id: 'hero-image-bg',
    name: 'Image Background Hero',
    description: 'Hero with full-width background image',
    category: 'heroes',
    tags: ['image', 'background', 'overlay'],
    type: 'section',
    element: createElement('hero-section', 'Image BG Hero', {
      headline: 'Adventure Awaits',
      subtext: 'Discover amazing experiences around the world.',
      ctaText: 'Start Exploring',
      backgroundImage: 'https://via.placeholder.com/1920x1080',
    }, {
      layout: ['w-full', 'text-center', 'relative'],
      spacing: ['py-40', 'px-6'],
      colors: ['bg-cover', 'bg-center', 'text-white'],
    }),
  },
  {
    id: 'hero-app',
    name: 'App Hero',
    description: 'Hero designed for app promotion',
    category: 'heroes',
    tags: ['app', 'mobile', 'download'],
    type: 'section',
    element: createElement('hero-with-image', 'App Hero', {
      headline: 'Your Life, Simplified',
      subtext: 'Download our app and take control of your daily routine.',
      ctaText: 'Download iOS',
      secondaryCtaText: 'Download Android',
      image: 'https://via.placeholder.com/300x600',
      imagePosition: 'right',
    }, {
      layout: ['w-full'],
      spacing: ['py-20', 'px-8'],
      colors: ['bg-gradient-to-r', 'from-blue-50', 'to-indigo-50'],
    }),
  },
  {
    id: 'hero-saas',
    name: 'SaaS Hero',
    description: 'Hero optimized for SaaS products',
    category: 'heroes',
    tags: ['saas', 'product', 'software'],
    type: 'section',
    element: createElement('hero-section', 'SaaS Hero', {
      headline: 'Ship Faster, Scale Better',
      subtext: 'The all-in-one platform for modern development teams.',
      ctaText: 'Start Free Trial',
      secondaryCtaText: 'View Pricing',
      badge: 'New: v2.0 is here!',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'hero-startup',
    name: 'Startup Hero',
    description: 'Bold hero for startup landing pages',
    category: 'heroes',
    tags: ['startup', 'bold', 'impactful'],
    type: 'section',
    element: createElement('hero-section', 'Startup Hero', {
      headline: 'The Future is Now',
      subtext: 'We are building technology that changes everything.',
      ctaText: 'Join Waitlist',
      badge: 'Backed by Y Combinator',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-32', 'px-6'],
      colors: ['bg-black', 'text-white'],
    }),
  },
  {
    id: 'hero-agency',
    name: 'Agency Hero',
    description: 'Creative hero for agencies',
    category: 'heroes',
    tags: ['agency', 'creative', 'portfolio'],
    type: 'section',
    element: createElement('hero-section', 'Agency Hero', {
      headline: 'We Create Digital Experiences',
      subtext: 'Award-winning design and development studio.',
      ctaText: 'View Our Work',
      secondaryCtaText: 'Get in Touch',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-28', 'px-6'],
      colors: ['bg-gray-100'],
    }),
  },
  {
    id: 'hero-ecommerce',
    name: 'E-commerce Hero',
    description: 'Hero for online stores',
    category: 'heroes',
    tags: ['ecommerce', 'shop', 'retail'],
    type: 'section',
    element: createElement('hero-with-image', 'E-commerce Hero', {
      headline: 'New Collection',
      subtext: 'Discover the latest trends in fashion.',
      ctaText: 'Shop Now',
      secondaryCtaText: 'View Lookbook',
      image: 'https://via.placeholder.com/600x600',
    }, {
      layout: ['w-full'],
      spacing: ['py-16', 'px-8'],
      colors: ['bg-stone-50'],
    }),
  },
  {
    id: 'hero-newsletter',
    name: 'Newsletter Hero',
    description: 'Hero with email signup focus',
    category: 'heroes',
    tags: ['newsletter', 'signup', 'email'],
    type: 'section',
    element: createElement('hero-section', 'Newsletter Hero', {
      headline: 'Stay in the Loop',
      subtext: 'Get weekly insights delivered to your inbox.',
      showNewsletter: true,
      newsletterPlaceholder: 'Enter your email',
      ctaText: 'Subscribe',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-blue-600', 'text-white'],
    }),
  },
  {
    id: 'hero-animated',
    name: 'Animated Hero',
    description: 'Hero with animated elements',
    category: 'heroes',
    tags: ['animated', 'dynamic', 'interactive'],
    type: 'section',
    element: createElement('hero-section', 'Animated Hero', {
      headline: 'Motion Brings Ideas to Life',
      subtext: 'Create engaging experiences with seamless animations.',
      ctaText: 'See Examples',
      animated: true,
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-32', 'px-6'],
      colors: ['bg-gradient-to-r', 'from-indigo-600', 'to-pink-500', 'text-white'],
    }),
  },
  {
    id: 'hero-fullscreen',
    name: 'Fullscreen Hero',
    description: 'Full viewport height hero',
    category: 'heroes',
    tags: ['fullscreen', 'viewport', 'immersive'],
    type: 'section',
    element: createElement('hero-section', 'Fullscreen Hero', {
      headline: 'Welcome to the Future',
      subtext: 'Scroll down to explore.',
      ctaText: 'Begin Journey',
      scrollIndicator: true,
    }, {
      layout: ['w-full', 'min-h-screen', 'flex', 'flex-col', 'items-center', 'justify-center', 'text-center'],
      spacing: ['px-6'],
      colors: ['bg-gray-900', 'text-white'],
    }),
  },
];

// ============================================================================
// SECTION TEMPLATES - FEATURES (15 variants)
// ============================================================================

export const featureTemplates: SectionTemplate[] = [
  {
    id: 'features-grid',
    name: 'Feature Grid',
    description: '3-column feature grid layout',
    category: 'features',
    tags: ['grid', 'icons', 'cards'],
    type: 'section',
    element: createElement('feature-section', 'Feature Grid', {
      title: 'Everything You Need',
      subtitle: 'Powerful features to help you succeed',
      features: [
        { icon: 'Zap', title: 'Lightning Fast', description: 'Optimized for speed and performance.' },
        { icon: 'Shield', title: 'Secure by Default', description: 'Enterprise-grade security built in.' },
        { icon: 'Puzzle', title: 'Easy Integration', description: 'Connect with your favorite tools.' },
        { icon: 'Globe', title: 'Global Scale', description: 'Deploy worldwide in seconds.' },
        { icon: 'Users', title: 'Team Collaboration', description: 'Work together seamlessly.' },
        { icon: 'BarChart', title: 'Analytics', description: 'Insights to drive growth.' },
      ],
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'features-alternating',
    name: 'Alternating Features',
    description: 'Features with alternating image layout',
    category: 'features',
    tags: ['alternating', 'images', 'detailed'],
    type: 'section',
    element: createElement('feature-section', 'Alternating Features', {
      title: 'How It Works',
      features: [
        { title: 'Step 1: Design', description: 'Create beautiful layouts with our visual builder.', image: 'https://via.placeholder.com/500x300', imagePosition: 'right' },
        { title: 'Step 2: Customize', description: 'Fine-tune every detail to match your brand.', image: 'https://via.placeholder.com/500x300', imagePosition: 'left' },
        { title: 'Step 3: Deploy', description: 'Go live with one click.', image: 'https://via.placeholder.com/500x300', imagePosition: 'right' },
      ],
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'features-centered',
    name: 'Centered Features',
    description: 'Centered feature list with icons',
    category: 'features',
    tags: ['centered', 'vertical', 'icons'],
    type: 'section',
    element: createElement('feature-section', 'Centered Features', {
      title: 'Why Choose Us',
      subtitle: 'Built for developers, by developers',
      features: [
        { icon: 'Code', title: 'Developer First', description: 'APIs and SDKs for every language.' },
        { icon: 'Clock', title: '99.99% Uptime', description: 'Reliable infrastructure you can count on.' },
        { icon: 'HeartHandshake', title: '24/7 Support', description: 'Expert help whenever you need it.' },
      ],
      layout: 'centered',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'features-bento',
    name: 'Bento Features',
    description: 'Bento box style feature grid',
    category: 'features',
    tags: ['bento', 'modern', 'asymmetric'],
    type: 'section',
    element: createElement('feature-section', 'Bento Features', {
      title: 'Powerful Capabilities',
      features: [
        { icon: 'Sparkles', title: 'AI Powered', description: 'Smart suggestions and automation.', size: 'large' },
        { icon: 'Lock', title: 'Secure', description: 'Bank-level encryption.', size: 'small' },
        { icon: 'Palette', title: 'Customizable', description: 'Make it yours.', size: 'small' },
        { icon: 'Rocket', title: 'Fast', description: 'Optimized performance.', size: 'medium' },
        { icon: 'Layers', title: 'Organized', description: 'Keep everything in order.', size: 'medium' },
      ],
      layout: 'bento',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-950', 'text-white'],
    }),
  },
  {
    id: 'features-cards',
    name: 'Feature Cards',
    description: 'Features displayed as cards',
    category: 'features',
    tags: ['cards', 'hover', 'shadow'],
    type: 'section',
    element: createElement('feature-section', 'Feature Cards', {
      title: 'Our Services',
      subtitle: 'What we offer',
      features: [
        { icon: 'Laptop', title: 'Web Development', description: 'Custom websites and web apps.' },
        { icon: 'Smartphone', title: 'Mobile Apps', description: 'iOS and Android applications.' },
        { icon: 'Cloud', title: 'Cloud Services', description: 'Scalable infrastructure solutions.' },
        { icon: 'Megaphone', title: 'Marketing', description: 'Digital marketing strategies.' },
      ],
      layout: 'cards',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'features-list',
    name: 'Feature List',
    description: 'Simple feature list with checkmarks',
    category: 'features',
    tags: ['list', 'checkmarks', 'simple'],
    type: 'section',
    element: createElement('feature-section', 'Feature List', {
      title: 'Everything Included',
      features: [
        'Unlimited projects',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'Team collaboration',
        'API access',
      ],
      layout: 'list',
    }, {
      layout: ['w-full'],
      spacing: ['py-20', 'px-6'],
      colors: ['bg-blue-50'],
    }),
  },
  {
    id: 'features-numbered',
    name: 'Numbered Features',
    description: 'Features with step numbers',
    category: 'features',
    tags: ['numbered', 'steps', 'process'],
    type: 'section',
    element: createElement('feature-section', 'Numbered Features', {
      title: 'How to Get Started',
      features: [
        { number: 1, title: 'Create Account', description: 'Sign up in seconds.' },
        { number: 2, title: 'Set Up Project', description: 'Configure your workspace.' },
        { number: 3, title: 'Invite Team', description: 'Collaborate with others.' },
        { number: 4, title: 'Start Building', description: 'Create amazing things.' },
      ],
      layout: 'numbered',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'features-comparison',
    name: 'Feature Comparison',
    description: 'Before/after or comparison features',
    category: 'features',
    tags: ['comparison', 'before-after', 'versus'],
    type: 'section',
    element: createElement('feature-section', 'Feature Comparison', {
      title: 'See the Difference',
      before: { title: 'Before', items: ['Manual processes', 'Scattered data', 'Slow deployment'] },
      after: { title: 'After', items: ['Automated workflows', 'Unified dashboard', 'Instant deployment'] },
      layout: 'comparison',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'features-tabs',
    name: 'Tabbed Features',
    description: 'Features organized in tabs',
    category: 'features',
    tags: ['tabs', 'organized', 'interactive'],
    type: 'section',
    element: createElement('feature-section', 'Tabbed Features', {
      title: 'Explore Features',
      tabs: [
        { label: 'Analytics', features: [{ title: 'Real-time Data', description: 'Live metrics.' }] },
        { label: 'Automation', features: [{ title: 'Workflows', description: 'Automate tasks.' }] },
        { label: 'Integration', features: [{ title: '100+ Apps', description: 'Connect everything.' }] },
      ],
      layout: 'tabs',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'features-icon-boxes',
    name: 'Icon Box Features',
    description: 'Features with prominent icon boxes',
    category: 'features',
    tags: ['icons', 'boxes', 'prominent'],
    type: 'section',
    element: createElement('feature-section', 'Icon Box Features', {
      title: 'Key Benefits',
      features: [
        { icon: 'TrendingUp', title: 'Growth', description: 'Scale your business effortlessly.' },
        { icon: 'Target', title: 'Precision', description: 'Hit your goals every time.' },
        { icon: 'Heart', title: 'Care', description: 'We put customers first.' },
      ],
      layout: 'icon-boxes',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gradient-to-b', 'from-gray-50', 'to-white'],
    }),
  },
  {
    id: 'features-split',
    name: 'Split Features',
    description: 'Two-column feature layout',
    category: 'features',
    tags: ['split', 'two-column', 'balanced'],
    type: 'section',
    element: createElement('feature-section', 'Split Features', {
      leftTitle: 'For Individuals',
      leftFeatures: ['Personal dashboard', 'Goal tracking', 'Progress reports'],
      rightTitle: 'For Teams',
      rightFeatures: ['Team workspace', 'Collaboration tools', 'Admin controls'],
      layout: 'split',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'features-timeline',
    name: 'Timeline Features',
    description: 'Features displayed as timeline',
    category: 'features',
    tags: ['timeline', 'chronological', 'process'],
    type: 'section',
    element: createElement('feature-section', 'Timeline Features', {
      title: 'Our Journey',
      features: [
        { year: '2020', title: 'Founded', description: 'Started with a vision.' },
        { year: '2021', title: 'Launch', description: 'Released v1.0.' },
        { year: '2022', title: 'Growth', description: '10,000 users.' },
        { year: '2023', title: 'Scale', description: 'Global expansion.' },
      ],
      layout: 'timeline',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'features-stats',
    name: 'Features with Stats',
    description: 'Features combined with statistics',
    category: 'features',
    tags: ['stats', 'numbers', 'data'],
    type: 'section',
    element: createElement('feature-section', 'Features with Stats', {
      title: 'Trusted by Thousands',
      stats: [
        { value: '10M+', label: 'Users' },
        { value: '99.9%', label: 'Uptime' },
        { value: '150+', label: 'Countries' },
      ],
      features: [
        { icon: 'Award', title: 'Award Winning', description: 'Recognized for excellence.' },
        { icon: 'Zap', title: 'Blazing Fast', description: 'Performance optimized.' },
      ],
      layout: 'with-stats',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-blue-600', 'text-white'],
    }),
  },
  {
    id: 'features-hover',
    name: 'Hover Effect Features',
    description: 'Features with interactive hover effects',
    category: 'features',
    tags: ['hover', 'interactive', 'animated'],
    type: 'section',
    element: createElement('feature-section', 'Hover Features', {
      title: 'Discover More',
      features: [
        { icon: 'Search', title: 'Smart Search', description: 'Find anything instantly.' },
        { icon: 'Filter', title: 'Advanced Filters', description: 'Narrow down results.' },
        { icon: 'Bookmark', title: 'Save & Organize', description: 'Keep track of favorites.' },
        { icon: 'Share', title: 'Easy Sharing', description: 'Share with anyone.' },
      ],
      layout: 'hover-cards',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-950', 'text-white'],
    }),
  },
  {
    id: 'features-minimal',
    name: 'Minimal Features',
    description: 'Clean minimal feature display',
    category: 'features',
    tags: ['minimal', 'clean', 'simple'],
    type: 'section',
    element: createElement('feature-section', 'Minimal Features', {
      features: [
        { title: 'Simple', description: 'Easy to use.' },
        { title: 'Powerful', description: 'Full of features.' },
        { title: 'Reliable', description: 'Always works.' },
      ],
      layout: 'minimal',
    }, {
      layout: ['w-full'],
      spacing: ['py-20', 'px-6'],
      colors: ['bg-white'],
    }),
  },
];

// ============================================================================
// SECTION TEMPLATES - TESTIMONIALS (10 variants)
// ============================================================================

export const testimonialTemplates: SectionTemplate[] = [
  {
    id: 'testimonials-carousel',
    name: 'Testimonial Carousel',
    description: 'Sliding testimonial carousel',
    category: 'testimonials',
    tags: ['carousel', 'slider', 'animated'],
    type: 'section',
    element: createElement('testimonials-section', 'Testimonial Carousel', {
      title: 'What Our Customers Say',
      testimonials: [
        { quote: 'This product has transformed our workflow. Highly recommended!', author: 'Sarah Johnson', role: 'CEO, TechCorp', avatar: 'https://via.placeholder.com/64' },
        { quote: 'The best investment we made this year. Outstanding support!', author: 'Michael Chen', role: 'CTO, StartupXYZ', avatar: 'https://via.placeholder.com/64' },
        { quote: 'Incredible features and intuitive design. Love it!', author: 'Emily Davis', role: 'Designer, CreativeStudio', avatar: 'https://via.placeholder.com/64' },
      ],
      layout: 'carousel',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'testimonials-grid',
    name: 'Testimonial Grid',
    description: 'Grid layout for multiple testimonials',
    category: 'testimonials',
    tags: ['grid', 'cards', 'multiple'],
    type: 'section',
    element: createElement('testimonials-section', 'Testimonial Grid', {
      title: 'Loved by Teams Worldwide',
      testimonials: [
        { quote: 'Amazing product!', author: 'John Doe', role: 'Manager', avatar: 'https://via.placeholder.com/64' },
        { quote: 'Game changer for us.', author: 'Jane Smith', role: 'Director', avatar: 'https://via.placeholder.com/64' },
        { quote: 'Highly recommend!', author: 'Bob Wilson', role: 'Founder', avatar: 'https://via.placeholder.com/64' },
        { quote: 'Best tool ever.', author: 'Alice Brown', role: 'Developer', avatar: 'https://via.placeholder.com/64' },
      ],
      layout: 'grid',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'testimonials-featured',
    name: 'Featured Testimonial',
    description: 'Single large featured testimonial',
    category: 'testimonials',
    tags: ['featured', 'large', 'prominent'],
    type: 'section',
    element: createElement('testimonials-section', 'Featured Testimonial', {
      testimonial: {
        quote: 'This platform has completely revolutionized how we approach our work. The results have been extraordinary.',
        author: 'Alexandra Wright',
        role: 'VP of Engineering, Enterprise Co',
        avatar: 'https://via.placeholder.com/96',
        company: 'Enterprise Co',
        logo: 'https://via.placeholder.com/120x40',
      },
      layout: 'featured',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-32', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'testimonials-logo-cloud',
    name: 'Testimonials with Logos',
    description: 'Testimonials with company logo cloud',
    category: 'testimonials',
    tags: ['logos', 'brands', 'trust'],
    type: 'section',
    element: createElement('testimonials-section', 'Logo Testimonials', {
      title: 'Trusted by Leading Companies',
      logos: ['company1', 'company2', 'company3', 'company4', 'company5'],
      testimonials: [
        { quote: 'Excellent service!', author: 'Tom Harris', role: 'CEO' },
      ],
      layout: 'with-logos',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'testimonials-video',
    name: 'Video Testimonials',
    description: 'Testimonials with video content',
    category: 'testimonials',
    tags: ['video', 'media', 'engaging'],
    type: 'section',
    element: createElement('testimonials-section', 'Video Testimonials', {
      title: 'Hear from Our Customers',
      testimonials: [
        { videoUrl: 'https://example.com/video1', author: 'Customer 1', thumbnail: 'https://via.placeholder.com/400x225' },
        { videoUrl: 'https://example.com/video2', author: 'Customer 2', thumbnail: 'https://via.placeholder.com/400x225' },
      ],
      layout: 'video',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'testimonials-cards',
    name: 'Testimonial Cards',
    description: 'Card-style testimonials',
    category: 'testimonials',
    tags: ['cards', 'shadow', 'modern'],
    type: 'section',
    element: createElement('testimonials-section', 'Testimonial Cards', {
      title: 'Customer Stories',
      testimonials: [
        { quote: 'Incredible platform!', author: 'Mark Lee', role: 'Founder', rating: 5 },
        { quote: 'Saved us so much time.', author: 'Lisa Wang', role: 'Manager', rating: 5 },
        { quote: 'Perfect for our needs.', author: 'Chris Taylor', role: 'Director', rating: 5 },
      ],
      layout: 'cards',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-100'],
    }),
  },
  {
    id: 'testimonials-masonry',
    name: 'Masonry Testimonials',
    description: 'Pinterest-style masonry layout',
    category: 'testimonials',
    tags: ['masonry', 'pinterest', 'dynamic'],
    type: 'section',
    element: createElement('testimonials-section', 'Masonry Testimonials', {
      testimonials: [
        { quote: 'Short review.', author: 'User 1' },
        { quote: 'This is a longer testimonial that goes into more detail about the experience.', author: 'User 2' },
        { quote: 'Medium length review here.', author: 'User 3' },
        { quote: 'Great!', author: 'User 4' },
        { quote: 'Another detailed review with lots of positive feedback about the product.', author: 'User 5' },
      ],
      layout: 'masonry',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'testimonials-quote',
    name: 'Quote Style Testimonial',
    description: 'Large quote with decorative elements',
    category: 'testimonials',
    tags: ['quote', 'decorative', 'elegant'],
    type: 'section',
    element: createElement('testimonials-section', 'Quote Testimonial', {
      testimonial: {
        quote: 'The attention to detail and quality of service exceeded all our expectations.',
        author: 'Catherine Moore',
        role: 'Head of Operations',
      },
      layout: 'quote',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-32', 'px-8'],
      colors: ['bg-gradient-to-br', 'from-blue-600', 'to-purple-600', 'text-white'],
    }),
  },
  {
    id: 'testimonials-stats',
    name: 'Testimonials with Stats',
    description: 'Combined testimonials and statistics',
    category: 'testimonials',
    tags: ['stats', 'numbers', 'social-proof'],
    type: 'section',
    element: createElement('testimonials-section', 'Stats Testimonials', {
      stats: [
        { value: '4.9/5', label: 'Average Rating' },
        { value: '10,000+', label: 'Happy Customers' },
        { value: '50+', label: 'Countries' },
      ],
      testimonials: [
        { quote: 'Best decision we ever made!', author: 'David Kim', role: 'CEO' },
      ],
      layout: 'with-stats',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'testimonials-minimal',
    name: 'Minimal Testimonials',
    description: 'Clean minimal testimonial display',
    category: 'testimonials',
    tags: ['minimal', 'clean', 'simple'],
    type: 'section',
    element: createElement('testimonials-section', 'Minimal Testimonials', {
      testimonials: [
        { quote: 'Simple and effective.', author: 'User' },
        { quote: 'Love the simplicity.', author: 'Customer' },
      ],
      layout: 'minimal',
    }, {
      layout: ['w-full'],
      spacing: ['py-20', 'px-6'],
      colors: ['bg-white'],
    }),
  },
];

// ============================================================================
// SECTION TEMPLATES - PRICING (10 variants)
// ============================================================================

export const pricingTemplates: SectionTemplate[] = [
  {
    id: 'pricing-three-tier',
    name: 'Three-Tier Pricing',
    description: 'Classic three-tier pricing table',
    category: 'pricing',
    tags: ['three-tier', 'classic', 'popular'],
    type: 'section',
    element: createElement('pricing-section', 'Three-Tier Pricing', {
      title: 'Simple, Transparent Pricing',
      subtitle: 'Choose the plan that fits your needs',
      plans: [
        { tier: 'Starter', price: '$9', period: '/month', features: ['5 Projects', '10GB Storage', 'Email Support'], ctaText: 'Get Started' },
        { tier: 'Professional', price: '$29', period: '/month', features: ['Unlimited Projects', '100GB Storage', 'Priority Support', 'Advanced Analytics'], ctaText: 'Start Free Trial', highlighted: true },
        { tier: 'Enterprise', price: '$99', period: '/month', features: ['Everything in Pro', 'Dedicated Support', 'Custom Integrations', 'SLA'], ctaText: 'Contact Sales' },
      ],
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'pricing-two-tier',
    name: 'Two-Tier Pricing',
    description: 'Simple two-tier pricing',
    category: 'pricing',
    tags: ['two-tier', 'simple', 'binary'],
    type: 'section',
    element: createElement('pricing-section', 'Two-Tier Pricing', {
      title: 'Choose Your Plan',
      plans: [
        { tier: 'Monthly', price: '$19', period: '/month', features: ['All Features', 'Unlimited Usage', 'Support'], ctaText: 'Subscribe Monthly' },
        { tier: 'Annual', price: '$190', period: '/year', features: ['All Features', 'Unlimited Usage', 'Priority Support', '2 Months Free'], ctaText: 'Save with Annual', highlighted: true, badge: 'Best Value' },
      ],
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'pricing-comparison',
    name: 'Pricing Comparison',
    description: 'Detailed feature comparison table',
    category: 'pricing',
    tags: ['comparison', 'table', 'detailed'],
    type: 'section',
    element: createElement('pricing-section', 'Pricing Comparison', {
      title: 'Compare Plans',
      plans: [
        { tier: 'Free', price: '$0', features: { 'Projects': '3', 'Storage': '1GB', 'Support': 'Community', 'API Access': false } },
        { tier: 'Pro', price: '$29', features: { 'Projects': 'Unlimited', 'Storage': '100GB', 'Support': 'Email', 'API Access': true }, highlighted: true },
        { tier: 'Enterprise', price: 'Custom', features: { 'Projects': 'Unlimited', 'Storage': 'Unlimited', 'Support': '24/7', 'API Access': true } },
      ],
      layout: 'comparison',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'pricing-toggle',
    name: 'Pricing with Toggle',
    description: 'Monthly/annual toggle pricing',
    category: 'pricing',
    tags: ['toggle', 'monthly', 'annual'],
    type: 'section',
    element: createElement('pricing-section', 'Toggle Pricing', {
      title: 'Flexible Pricing',
      showToggle: true,
      plans: [
        { tier: 'Basic', monthlyPrice: '$9', annualPrice: '$90', features: ['Core Features'] },
        { tier: 'Pro', monthlyPrice: '$29', annualPrice: '$290', features: ['All Features'], highlighted: true },
        { tier: 'Team', monthlyPrice: '$79', annualPrice: '$790', features: ['Team Features'] },
      ],
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'pricing-gradient',
    name: 'Gradient Pricing',
    description: 'Pricing with gradient backgrounds',
    category: 'pricing',
    tags: ['gradient', 'colorful', 'modern'],
    type: 'section',
    element: createElement('pricing-section', 'Gradient Pricing', {
      title: 'Start Building Today',
      plans: [
        { tier: 'Hobby', price: 'Free', features: ['Basic Features'], gradient: 'from-gray-100 to-gray-200' },
        { tier: 'Pro', price: '$49', features: ['Pro Features'], gradient: 'from-blue-500 to-purple-500', highlighted: true },
        { tier: 'Business', price: '$149', features: ['Business Features'], gradient: 'from-gray-800 to-gray-900' },
      ],
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'pricing-horizontal',
    name: 'Horizontal Pricing',
    description: 'Horizontal layout pricing cards',
    category: 'pricing',
    tags: ['horizontal', 'wide', 'detailed'],
    type: 'section',
    element: createElement('pricing-section', 'Horizontal Pricing', {
      title: 'Our Plans',
      plans: [
        { tier: 'Starter', price: '$19', description: 'Perfect for individuals', features: ['5 Projects', 'Basic Support'] },
        { tier: 'Growth', price: '$49', description: 'For growing teams', features: ['25 Projects', 'Priority Support'], highlighted: true },
        { tier: 'Scale', price: '$99', description: 'For large organizations', features: ['Unlimited', '24/7 Support'] },
      ],
      layout: 'horizontal',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'pricing-minimal',
    name: 'Minimal Pricing',
    description: 'Clean minimal pricing design',
    category: 'pricing',
    tags: ['minimal', 'clean', 'simple'],
    type: 'section',
    element: createElement('pricing-section', 'Minimal Pricing', {
      plans: [
        { tier: 'Basic', price: '$9', ctaText: 'Choose' },
        { tier: 'Pro', price: '$29', ctaText: 'Choose', highlighted: true },
        { tier: 'Enterprise', price: '$99', ctaText: 'Choose' },
      ],
      layout: 'minimal',
    }, {
      layout: ['w-full'],
      spacing: ['py-20', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'pricing-featured',
    name: 'Featured Plan Pricing',
    description: 'Pricing with emphasized featured plan',
    category: 'pricing',
    tags: ['featured', 'emphasis', 'popular'],
    type: 'section',
    element: createElement('pricing-section', 'Featured Pricing', {
      title: 'Most Popular Choice',
      featuredPlan: { tier: 'Professional', price: '$49', features: ['Everything you need'], badge: 'Most Popular' },
      otherPlans: [
        { tier: 'Basic', price: '$19' },
        { tier: 'Enterprise', price: '$149' },
      ],
      layout: 'featured',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gradient-to-b', 'from-gray-900', 'to-gray-800'],
    }),
  },
  {
    id: 'pricing-usage',
    name: 'Usage-Based Pricing',
    description: 'Pay-as-you-go pricing model',
    category: 'pricing',
    tags: ['usage', 'pay-as-you-go', 'flexible'],
    type: 'section',
    element: createElement('pricing-section', 'Usage Pricing', {
      title: 'Pay Only for What You Use',
      calculator: true,
      basePrice: '$0.01',
      unit: 'per request',
      tiers: [
        { range: '0-10K', price: '$0.01' },
        { range: '10K-100K', price: '$0.008' },
        { range: '100K+', price: '$0.005' },
      ],
      layout: 'usage',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'pricing-enterprise',
    name: 'Enterprise Pricing',
    description: 'Enterprise-focused pricing page',
    category: 'pricing',
    tags: ['enterprise', 'custom', 'sales'],
    type: 'section',
    element: createElement('pricing-section', 'Enterprise Pricing', {
      title: 'Enterprise Solutions',
      subtitle: 'Custom pricing for large organizations',
      features: [
        'Dedicated infrastructure',
        'Custom SLA',
        '24/7 premium support',
        'Advanced security',
        'Custom integrations',
      ],
      ctaText: 'Contact Sales',
      layout: 'enterprise',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-950', 'text-white'],
    }),
  },
];

// ============================================================================
// SECTION TEMPLATES - CTA (10 variants)
// ============================================================================

export const ctaTemplates: SectionTemplate[] = [
  {
    id: 'cta-simple',
    name: 'Simple CTA',
    description: 'Clean call-to-action section',
    category: 'cta',
    tags: ['simple', 'clean', 'centered'],
    type: 'section',
    element: createElement('cta-section', 'Simple CTA', {
      headline: 'Ready to Get Started?',
      description: 'Join thousands of satisfied customers today.',
      ctaText: 'Start Free Trial',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-20', 'px-6'],
      colors: ['bg-blue-600', 'text-white'],
    }),
  },
  {
    id: 'cta-split',
    name: 'Split CTA',
    description: 'Two-column CTA layout',
    category: 'cta',
    tags: ['split', 'two-column', 'balanced'],
    type: 'section',
    element: createElement('cta-section', 'Split CTA', {
      headline: 'Take Your Business to the Next Level',
      description: 'Our platform helps you grow faster with less effort.',
      ctaText: 'Get Started',
      secondaryCtaText: 'Learn More',
      image: 'https://via.placeholder.com/400x300',
    }, {
      layout: ['w-full'],
      spacing: ['py-16', 'px-8'],
      colors: ['bg-gray-900', 'text-white'],
    }),
  },
  {
    id: 'cta-gradient',
    name: 'Gradient CTA',
    description: 'CTA with vibrant gradient',
    category: 'cta',
    tags: ['gradient', 'colorful', 'bold'],
    type: 'section',
    element: createElement('cta-section', 'Gradient CTA', {
      headline: 'Start Building Today',
      description: 'No credit card required. Free forever for small teams.',
      ctaText: 'Create Free Account',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'text-white'],
    }),
  },
  {
    id: 'cta-newsletter',
    name: 'Newsletter CTA',
    description: 'CTA with email signup',
    category: 'cta',
    tags: ['newsletter', 'email', 'signup'],
    type: 'section',
    element: createElement('cta-section', 'Newsletter CTA', {
      headline: 'Stay Updated',
      description: 'Get the latest news and updates delivered to your inbox.',
      showNewsletter: true,
      placeholder: 'Enter your email',
      ctaText: 'Subscribe',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-20', 'px-6'],
      colors: ['bg-gray-100'],
    }),
  },
  {
    id: 'cta-dark',
    name: 'Dark CTA',
    description: 'Dark themed CTA section',
    category: 'cta',
    tags: ['dark', 'contrast', 'bold'],
    type: 'section',
    element: createElement('cta-section', 'Dark CTA', {
      headline: 'Ready to Transform Your Workflow?',
      description: 'See why leading teams choose our platform.',
      ctaText: 'Request Demo',
      secondaryCtaText: 'Contact Sales',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-950', 'text-white'],
    }),
  },
  {
    id: 'cta-banner',
    name: 'Banner CTA',
    description: 'Slim banner-style CTA',
    category: 'cta',
    tags: ['banner', 'slim', 'compact'],
    type: 'section',
    element: createElement('cta-section', 'Banner CTA', {
      headline: 'Limited Time Offer: 50% Off',
      ctaText: 'Claim Offer',
      layout: 'banner',
    }, {
      layout: ['w-full', 'flex', 'items-center', 'justify-between'],
      spacing: ['py-4', 'px-6'],
      colors: ['bg-yellow-400', 'text-gray-900'],
    }),
  },
  {
    id: 'cta-card',
    name: 'Card CTA',
    description: 'CTA in card container',
    category: 'cta',
    tags: ['card', 'contained', 'floating'],
    type: 'section',
    element: createElement('cta-section', 'Card CTA', {
      headline: 'Join Our Community',
      description: 'Connect with other users and share your experiences.',
      ctaText: 'Join Now',
    }, {
      layout: ['w-full', 'max-w-2xl', 'mx-auto', 'text-center'],
      spacing: ['py-12', 'px-8'],
      colors: ['bg-white'],
      borders: ['rounded-2xl'],
      effects: ['shadow-xl'],
    }),
  },
  {
    id: 'cta-image-bg',
    name: 'Image Background CTA',
    description: 'CTA with background image',
    category: 'cta',
    tags: ['image', 'background', 'overlay'],
    type: 'section',
    element: createElement('cta-section', 'Image BG CTA', {
      headline: 'Start Your Journey',
      description: 'Adventure awaits.',
      ctaText: 'Explore Now',
      backgroundImage: 'https://via.placeholder.com/1920x600',
    }, {
      layout: ['w-full', 'text-center', 'relative'],
      spacing: ['py-32', 'px-6'],
      colors: ['bg-cover', 'bg-center', 'text-white'],
    }),
  },
  {
    id: 'cta-dual',
    name: 'Dual CTA',
    description: 'Two equal CTAs side by side',
    category: 'cta',
    tags: ['dual', 'two-options', 'choice'],
    type: 'section',
    element: createElement('cta-section', 'Dual CTA', {
      options: [
        { headline: 'For Individuals', description: 'Personal use', ctaText: 'Start Free' },
        { headline: 'For Teams', description: 'Collaborate together', ctaText: 'View Plans' },
      ],
      layout: 'dual',
    }, {
      layout: ['w-full', 'grid', 'grid-cols-2', 'gap-8'],
      spacing: ['py-16', 'px-8'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'cta-minimal',
    name: 'Minimal CTA',
    description: 'Ultra-minimal CTA design',
    category: 'cta',
    tags: ['minimal', 'simple', 'clean'],
    type: 'section',
    element: createElement('cta-section', 'Minimal CTA', {
      headline: 'Get Started',
      ctaText: 'Sign Up',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-16', 'px-6'],
      colors: ['bg-white'],
      borders: ['border-t', 'border-gray-200'],
    }),
  },
];

// ============================================================================
// SECTION TEMPLATES - FAQ (5 variants)
// ============================================================================

export const faqTemplates: SectionTemplate[] = [
  {
    id: 'faq-accordion',
    name: 'Accordion FAQ',
    description: 'Classic accordion-style FAQ',
    category: 'faq',
    tags: ['accordion', 'expandable', 'classic'],
    type: 'section',
    element: createElement('faq-section', 'Accordion FAQ', {
      title: 'Frequently Asked Questions',
      faqs: [
        { question: 'How do I get started?', answer: 'Simply sign up for a free account and follow our getting started guide.' },
        { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and bank transfers.' },
        { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time with no penalties.' },
        { question: 'Do you offer refunds?', answer: 'We offer a 30-day money-back guarantee on all plans.' },
        { question: 'Is there a free trial?', answer: 'Yes, we offer a 14-day free trial with full access to all features.' },
      ],
      layout: 'accordion',
    }, {
      layout: ['w-full', 'max-w-3xl', 'mx-auto'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'faq-two-column',
    name: 'Two-Column FAQ',
    description: 'FAQ in two-column layout',
    category: 'faq',
    tags: ['two-column', 'grid', 'balanced'],
    type: 'section',
    element: createElement('faq-section', 'Two-Column FAQ', {
      title: 'Common Questions',
      faqs: [
        { question: 'What is included?', answer: 'All core features are included.' },
        { question: 'How does billing work?', answer: 'Monthly or annual billing options.' },
        { question: 'Can I upgrade later?', answer: 'Yes, upgrade anytime.' },
        { question: 'Is support included?', answer: 'Email support on all plans.' },
      ],
      layout: 'two-column',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'faq-categorized',
    name: 'Categorized FAQ',
    description: 'FAQ organized by categories',
    category: 'faq',
    tags: ['categorized', 'organized', 'detailed'],
    type: 'section',
    element: createElement('faq-section', 'Categorized FAQ', {
      title: 'Help Center',
      categories: [
        { name: 'Getting Started', faqs: [{ question: 'How to begin?', answer: 'Start here.' }] },
        { name: 'Billing', faqs: [{ question: 'Payment options?', answer: 'Multiple options.' }] },
        { name: 'Technical', faqs: [{ question: 'API access?', answer: 'Full API available.' }] },
      ],
      layout: 'categorized',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'faq-search',
    name: 'Searchable FAQ',
    description: 'FAQ with search functionality',
    category: 'faq',
    tags: ['search', 'filter', 'interactive'],
    type: 'section',
    element: createElement('faq-section', 'Searchable FAQ', {
      title: 'How Can We Help?',
      showSearch: true,
      searchPlaceholder: 'Search for answers...',
      faqs: [
        { question: 'Account setup', answer: 'Instructions for setting up.' },
        { question: 'Password reset', answer: 'How to reset your password.' },
        { question: 'Billing questions', answer: 'Billing information.' },
      ],
      layout: 'searchable',
    }, {
      layout: ['w-full', 'max-w-3xl', 'mx-auto'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'faq-minimal',
    name: 'Minimal FAQ',
    description: 'Simple minimal FAQ layout',
    category: 'faq',
    tags: ['minimal', 'simple', 'clean'],
    type: 'section',
    element: createElement('faq-section', 'Minimal FAQ', {
      faqs: [
        { question: 'Question one?', answer: 'Answer one.' },
        { question: 'Question two?', answer: 'Answer two.' },
        { question: 'Question three?', answer: 'Answer three.' },
      ],
      layout: 'minimal',
    }, {
      layout: ['w-full', 'max-w-2xl', 'mx-auto'],
      spacing: ['py-20', 'px-6'],
      colors: ['bg-white'],
    }),
  },
];

// ============================================================================
// SECTION TEMPLATES - TEAM (5 variants)
// ============================================================================

export const teamTemplates: SectionTemplate[] = [
  {
    id: 'team-grid',
    name: 'Team Grid',
    description: 'Team members in grid layout',
    category: 'team',
    tags: ['grid', 'cards', 'photos'],
    type: 'section',
    element: createElement('team-section', 'Team Grid', {
      title: 'Meet Our Team',
      subtitle: 'The people behind the product',
      members: [
        { name: 'John Smith', role: 'CEO & Founder', avatar: 'https://via.placeholder.com/200', social: { twitter: '#', linkedin: '#' } },
        { name: 'Sarah Johnson', role: 'CTO', avatar: 'https://via.placeholder.com/200', social: { twitter: '#', linkedin: '#' } },
        { name: 'Mike Williams', role: 'Head of Design', avatar: 'https://via.placeholder.com/200', social: { twitter: '#', linkedin: '#' } },
        { name: 'Emily Brown', role: 'Head of Marketing', avatar: 'https://via.placeholder.com/200', social: { twitter: '#', linkedin: '#' } },
      ],
      layout: 'grid',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'team-carousel',
    name: 'Team Carousel',
    description: 'Sliding team member carousel',
    category: 'team',
    tags: ['carousel', 'slider', 'animated'],
    type: 'section',
    element: createElement('team-section', 'Team Carousel', {
      title: 'Our Leadership',
      members: [
        { name: 'Alex Chen', role: 'Founder', avatar: 'https://via.placeholder.com/200', bio: 'Visionary leader.' },
        { name: 'Lisa Park', role: 'COO', avatar: 'https://via.placeholder.com/200', bio: 'Operations expert.' },
        { name: 'David Kim', role: 'CFO', avatar: 'https://via.placeholder.com/200', bio: 'Financial strategist.' },
      ],
      layout: 'carousel',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'team-featured',
    name: 'Featured Team',
    description: 'Featured team member highlight',
    category: 'team',
    tags: ['featured', 'highlight', 'leadership'],
    type: 'section',
    element: createElement('team-section', 'Featured Team', {
      title: 'Leadership',
      featured: { name: 'Jane Doe', role: 'CEO', avatar: 'https://via.placeholder.com/300', bio: 'Leading our mission to transform the industry.' },
      members: [
        { name: 'Tom', role: 'CTO', avatar: 'https://via.placeholder.com/150' },
        { name: 'Amy', role: 'COO', avatar: 'https://via.placeholder.com/150' },
      ],
      layout: 'featured',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'team-compact',
    name: 'Compact Team',
    description: 'Compact team member display',
    category: 'team',
    tags: ['compact', 'small', 'efficient'],
    type: 'section',
    element: createElement('team-section', 'Compact Team', {
      title: 'The Team',
      members: [
        { name: 'Person 1', role: 'Role 1', avatar: 'https://via.placeholder.com/80' },
        { name: 'Person 2', role: 'Role 2', avatar: 'https://via.placeholder.com/80' },
        { name: 'Person 3', role: 'Role 3', avatar: 'https://via.placeholder.com/80' },
        { name: 'Person 4', role: 'Role 4', avatar: 'https://via.placeholder.com/80' },
        { name: 'Person 5', role: 'Role 5', avatar: 'https://via.placeholder.com/80' },
        { name: 'Person 6', role: 'Role 6', avatar: 'https://via.placeholder.com/80' },
      ],
      layout: 'compact',
    }, {
      layout: ['w-full'],
      spacing: ['py-16', 'px-6'],
      colors: ['bg-gray-100'],
    }),
  },
  {
    id: 'team-minimal',
    name: 'Minimal Team',
    description: 'Simple team display',
    category: 'team',
    tags: ['minimal', 'simple', 'clean'],
    type: 'section',
    element: createElement('team-section', 'Minimal Team', {
      members: [
        { name: 'Founder', avatar: 'https://via.placeholder.com/120' },
        { name: 'Engineer', avatar: 'https://via.placeholder.com/120' },
        { name: 'Designer', avatar: 'https://via.placeholder.com/120' },
      ],
      layout: 'minimal',
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-20', 'px-6'],
      colors: ['bg-white'],
    }),
  },
];

// ============================================================================
// SECTION TEMPLATES - CONTACT (10 variants)
// ============================================================================

export const contactTemplates: SectionTemplate[] = [
  {
    id: 'contact-split',
    name: 'Split Contact',
    description: 'Form with contact info side by side',
    category: 'contact',
    tags: ['split', 'form', 'info'],
    type: 'section',
    element: createElement('contact-section', 'Split Contact', {
      title: 'Get in Touch',
      subtitle: 'We would love to hear from you',
      email: 'hello@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City, Country',
      showForm: true,
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'contact-centered',
    name: 'Centered Contact',
    description: 'Centered contact form',
    category: 'contact',
    tags: ['centered', 'form', 'simple'],
    type: 'section',
    element: createElement('contact-section', 'Centered Contact', {
      title: 'Contact Us',
      showForm: true,
      formFields: ['name', 'email', 'message'],
    }, {
      layout: ['w-full', 'max-w-xl', 'mx-auto', 'text-center'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'contact-map',
    name: 'Contact with Map',
    description: 'Contact section with embedded map',
    category: 'contact',
    tags: ['map', 'location', 'visual'],
    type: 'section',
    element: createElement('contact-section', 'Map Contact', {
      title: 'Visit Us',
      address: '123 Main St, City, Country',
      showMap: true,
      mapEmbed: 'https://maps.google.com/embed',
      showForm: true,
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'contact-cards',
    name: 'Contact Cards',
    description: 'Multiple contact method cards',
    category: 'contact',
    tags: ['cards', 'multiple', 'options'],
    type: 'section',
    element: createElement('contact-section', 'Contact Cards', {
      title: 'How to Reach Us',
      methods: [
        { icon: 'Mail', title: 'Email', value: 'support@example.com', action: 'Send Email' },
        { icon: 'Phone', title: 'Phone', value: '+1 555-123-4567', action: 'Call Now' },
        { icon: 'MessageCircle', title: 'Chat', value: 'Live chat available', action: 'Start Chat' },
      ],
      layout: 'cards',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
  {
    id: 'contact-minimal',
    name: 'Minimal Contact',
    description: 'Simple contact information',
    category: 'contact',
    tags: ['minimal', 'simple', 'clean'],
    type: 'section',
    element: createElement('contact-section', 'Minimal Contact', {
      email: 'hello@example.com',
      social: ['twitter', 'linkedin'],
    }, {
      layout: ['w-full', 'text-center'],
      spacing: ['py-16', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'contact-dark',
    name: 'Dark Contact',
    description: 'Dark themed contact section',
    category: 'contact',
    tags: ['dark', 'contrast', 'modern'],
    type: 'section',
    element: createElement('contact-section', 'Dark Contact', {
      title: 'Let\'s Talk',
      subtitle: 'Ready to start your project?',
      email: 'projects@example.com',
      showForm: true,
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-950', 'text-white'],
    }),
  },
  {
    id: 'contact-booking',
    name: 'Booking Contact',
    description: 'Contact with calendar booking',
    category: 'contact',
    tags: ['booking', 'calendar', 'schedule'],
    type: 'section',
    element: createElement('contact-section', 'Booking Contact', {
      title: 'Schedule a Call',
      subtitle: 'Book a time that works for you',
      showCalendar: true,
      calendarEmbed: 'https://calendly.com/embed',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'contact-support',
    name: 'Support Contact',
    description: 'Support-focused contact section',
    category: 'contact',
    tags: ['support', 'help', 'tickets'],
    type: 'section',
    element: createElement('contact-section', 'Support Contact', {
      title: 'Need Help?',
      options: [
        { icon: 'Book', title: 'Documentation', description: 'Browse our guides', link: '/docs' },
        { icon: 'MessageSquare', title: 'Support Ticket', description: 'Submit a request', link: '/support' },
        { icon: 'Users', title: 'Community', description: 'Join discussions', link: '/community' },
      ],
      layout: 'support',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-blue-50'],
    }),
  },
  {
    id: 'contact-sales',
    name: 'Sales Contact',
    description: 'Sales-focused contact form',
    category: 'contact',
    tags: ['sales', 'enterprise', 'lead'],
    type: 'section',
    element: createElement('contact-section', 'Sales Contact', {
      title: 'Talk to Sales',
      subtitle: 'Learn how we can help your business',
      showForm: true,
      formFields: ['name', 'email', 'company', 'employees', 'message'],
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-white'],
    }),
  },
  {
    id: 'contact-offices',
    name: 'Office Locations',
    description: 'Multiple office locations display',
    category: 'contact',
    tags: ['offices', 'locations', 'global'],
    type: 'section',
    element: createElement('contact-section', 'Office Locations', {
      title: 'Our Offices',
      offices: [
        { city: 'San Francisco', address: '123 Market St', phone: '+1 415-555-0100' },
        { city: 'New York', address: '456 Broadway', phone: '+1 212-555-0100' },
        { city: 'London', address: '789 Oxford St', phone: '+44 20-5555-0100' },
      ],
      layout: 'offices',
    }, {
      layout: ['w-full'],
      spacing: ['py-24', 'px-6'],
      colors: ['bg-gray-50'],
    }),
  },
];

// ============================================================================
// PAGE TEMPLATES
// ============================================================================

export const landingPageTemplates: PageTemplate[] = [
  {
    id: 'landing-saas',
    name: 'SaaS Landing Page',
    description: 'Complete landing page for SaaS products',
    category: 'landing',
    subcategory: 'SaaS',
    tags: ['saas', 'software', 'product'],
    type: 'page',
    sections: [
      headerTemplates[0],
      heroTemplates[8], // SaaS Hero
      featureTemplates[0], // Feature Grid
      testimonialTemplates[1], // Testimonial Grid
      pricingTemplates[0], // Three-Tier Pricing
      faqTemplates[0], // Accordion FAQ
      ctaTemplates[0], // Simple CTA
      footerTemplates[1], // Extended Footer
    ],
  },
  {
    id: 'landing-agency',
    name: 'Agency Landing Page',
    description: 'Creative agency portfolio landing page',
    category: 'landing',
    subcategory: 'Agency',
    tags: ['agency', 'creative', 'portfolio'],
    type: 'page',
    sections: [
      headerTemplates[6], // Minimal Header
      heroTemplates[10], // Agency Hero
      featureTemplates[4], // Feature Cards
      testimonialTemplates[2], // Featured Testimonial
      teamTemplates[0], // Team Grid
      contactTemplates[0], // Split Contact
      footerTemplates[3], // Centered Footer
    ],
  },
  {
    id: 'landing-portfolio',
    name: 'Portfolio Landing Page',
    description: 'Personal portfolio landing page',
    category: 'landing',
    subcategory: 'Portfolio',
    tags: ['portfolio', 'personal', 'creative'],
    type: 'page',
    sections: [
      headerTemplates[6], // Minimal Header
      heroTemplates[4], // Minimal Hero
      featureTemplates[14], // Minimal Features
      testimonialTemplates[9], // Minimal Testimonials
      contactTemplates[4], // Minimal Contact
      footerTemplates[5], // Minimal Footer
    ],
  },
  {
    id: 'landing-product',
    name: 'Product Landing Page',
    description: 'Single product promotion page',
    category: 'landing',
    subcategory: 'Product',
    tags: ['product', 'promotion', 'marketing'],
    type: 'page',
    sections: [
      headerTemplates[0], // Simple Header
      heroTemplates[1], // Split Hero
      featureTemplates[1], // Alternating Features
      testimonialTemplates[0], // Testimonial Carousel
      pricingTemplates[1], // Two-Tier Pricing
      ctaTemplates[2], // Gradient CTA
      footerTemplates[0], // Simple Footer
    ],
  },
  {
    id: 'landing-app',
    name: 'App Landing Page',
    description: 'Mobile app promotion page',
    category: 'landing',
    subcategory: 'App',
    tags: ['app', 'mobile', 'download'],
    type: 'page',
    sections: [
      headerTemplates[0], // Simple Header
      heroTemplates[7], // App Hero
      featureTemplates[0], // Feature Grid
      testimonialTemplates[1], // Testimonial Grid
      ctaTemplates[0], // Simple CTA
      footerTemplates[8], // App Footer
    ],
  },
  {
    id: 'landing-startup',
    name: 'Startup Landing Page',
    description: 'Early-stage startup landing page',
    category: 'landing',
    subcategory: 'Startup',
    tags: ['startup', 'early-stage', 'waitlist'],
    type: 'page',
    sections: [
      headerTemplates[2], // Transparent Header
      heroTemplates[9], // Startup Hero
      featureTemplates[3], // Bento Features
      testimonialTemplates[3], // Logo Testimonials
      ctaTemplates[3], // Newsletter CTA
      footerTemplates[5], // Minimal Footer
    ],
  },
];

export const businessPageTemplates: PageTemplate[] = [
  {
    id: 'business-corporate',
    name: 'Corporate Website',
    description: 'Professional corporate business website',
    category: 'business',
    subcategory: 'Corporate',
    tags: ['corporate', 'professional', 'business'],
    type: 'page',
    sections: [
      headerTemplates[4], // Mega Menu Header
      heroTemplates[5], // Dark Hero
      featureTemplates[2], // Centered Features
      testimonialTemplates[3], // Logo Testimonials
      teamTemplates[2], // Featured Team
      contactTemplates[0], // Split Contact
      footerTemplates[1], // Extended Footer
    ],
  },
  {
    id: 'business-consulting',
    name: 'Consulting Website',
    description: 'Business consulting services website',
    category: 'business',
    subcategory: 'Consulting',
    tags: ['consulting', 'services', 'professional'],
    type: 'page',
    sections: [
      headerTemplates[0], // Simple Header
      heroTemplates[0], // Centered Hero
      featureTemplates[4], // Feature Cards
      testimonialTemplates[2], // Featured Testimonial
      ctaTemplates[1], // Split CTA
      contactTemplates[8], // Sales Contact
      footerTemplates[0], // Simple Footer
    ],
  },
  {
    id: 'business-law',
    name: 'Law Firm Website',
    description: 'Professional law firm website',
    category: 'business',
    subcategory: 'Law Firm',
    tags: ['law', 'legal', 'professional'],
    type: 'page',
    sections: [
      headerTemplates[1], // Dark Header
      heroTemplates[5], // Dark Hero
      featureTemplates[2], // Centered Features
      teamTemplates[0], // Team Grid
      testimonialTemplates[5], // Testimonial Cards
      contactTemplates[0], // Split Contact
      footerTemplates[4], // Dark Gradient Footer
    ],
  },
  {
    id: 'business-realestate',
    name: 'Real Estate Website',
    description: 'Real estate agency website',
    category: 'business',
    subcategory: 'Real Estate',
    tags: ['real-estate', 'property', 'agency'],
    type: 'page',
    sections: [
      headerTemplates[0], // Simple Header
      heroTemplates[6], // Image BG Hero
      featureTemplates[0], // Feature Grid
      testimonialTemplates[1], // Testimonial Grid
      contactTemplates[2], // Map Contact
      footerTemplates[1], // Extended Footer
    ],
  },
];

export const ecommercePageTemplates: PageTemplate[] = [
  {
    id: 'ecommerce-product',
    name: 'Product Page',
    description: 'Single product detail page',
    category: 'ecommerce',
    subcategory: 'Product',
    tags: ['product', 'detail', 'shop'],
    type: 'page',
    sections: [
      headerTemplates[0], // Simple Header
      footerTemplates[0], // Simple Footer
    ],
  },
  {
    id: 'ecommerce-category',
    name: 'Category Page',
    description: 'Product category listing page',
    category: 'ecommerce',
    subcategory: 'Category',
    tags: ['category', 'listing', 'shop'],
    type: 'page',
    sections: [
      headerTemplates[0], // Simple Header
      footerTemplates[0], // Simple Footer
    ],
  },
  {
    id: 'ecommerce-cart',
    name: 'Shopping Cart',
    description: 'Shopping cart page',
    category: 'ecommerce',
    subcategory: 'Cart',
    tags: ['cart', 'checkout', 'shop'],
    type: 'page',
    sections: [
      headerTemplates[0], // Simple Header
      footerTemplates[5], // Minimal Footer
    ],
  },
  {
    id: 'ecommerce-checkout',
    name: 'Checkout Page',
    description: 'Checkout flow page',
    category: 'ecommerce',
    subcategory: 'Checkout',
    tags: ['checkout', 'payment', 'shop'],
    type: 'page',
    sections: [
      headerTemplates[6], // Minimal Header
      footerTemplates[5], // Minimal Footer
    ],
  },
];

export const blogPageTemplates: PageTemplate[] = [
  {
    id: 'blog-home',
    name: 'Blog Home',
    description: 'Blog homepage with recent posts',
    category: 'blog',
    subcategory: 'Home',
    tags: ['blog', 'posts', 'articles'],
    type: 'page',
    sections: [
      headerTemplates[0], // Simple Header
      heroTemplates[12], // Newsletter Hero
      footerTemplates[2], // Newsletter Footer
    ],
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Individual blog post page',
    category: 'blog',
    subcategory: 'Post',
    tags: ['post', 'article', 'content'],
    type: 'page',
    sections: [
      headerTemplates[6], // Minimal Header
      footerTemplates[0], // Simple Footer
    ],
  },
  {
    id: 'blog-archive',
    name: 'Blog Archive',
    description: 'Blog post archive page',
    category: 'blog',
    subcategory: 'Archive',
    tags: ['archive', 'posts', 'history'],
    type: 'page',
    sections: [
      headerTemplates[0], // Simple Header
      footerTemplates[0], // Simple Footer
    ],
  },
  {
    id: 'blog-author',
    name: 'Author Page',
    description: 'Blog author profile page',
    category: 'blog',
    subcategory: 'Author',
    tags: ['author', 'profile', 'posts'],
    type: 'page',
    sections: [
      headerTemplates[0], // Simple Header
      footerTemplates[0], // Simple Footer
    ],
  },
];

export const dashboardPageTemplates: PageTemplate[] = [
  {
    id: 'dashboard-analytics',
    name: 'Analytics Dashboard',
    description: 'Data analytics dashboard',
    category: 'dashboard',
    subcategory: 'Analytics',
    tags: ['analytics', 'data', 'charts'],
    type: 'page',
    sections: [],
  },
  {
    id: 'dashboard-admin',
    name: 'Admin Dashboard',
    description: 'Administration dashboard',
    category: 'dashboard',
    subcategory: 'Admin',
    tags: ['admin', 'management', 'control'],
    type: 'page',
    sections: [],
  },
  {
    id: 'dashboard-settings',
    name: 'Settings Page',
    description: 'User settings page',
    category: 'dashboard',
    subcategory: 'Settings',
    tags: ['settings', 'preferences', 'config'],
    type: 'page',
    sections: [],
  },
  {
    id: 'dashboard-profile',
    name: 'Profile Page',
    description: 'User profile page',
    category: 'dashboard',
    subcategory: 'Profile',
    tags: ['profile', 'user', 'account'],
    type: 'page',
    sections: [],
  },
];

export const authPageTemplates: PageTemplate[] = [
  {
    id: 'auth-login',
    name: 'Login Page',
    description: 'User login page',
    category: 'auth',
    subcategory: 'Login',
    tags: ['login', 'signin', 'auth'],
    type: 'page',
    sections: [],
  },
  {
    id: 'auth-register',
    name: 'Register Page',
    description: 'User registration page',
    category: 'auth',
    subcategory: 'Register',
    tags: ['register', 'signup', 'auth'],
    type: 'page',
    sections: [],
  },
  {
    id: 'auth-forgot',
    name: 'Forgot Password',
    description: 'Password recovery page',
    category: 'auth',
    subcategory: 'Forgot Password',
    tags: ['forgot', 'password', 'recovery'],
    type: 'page',
    sections: [],
  },
  {
    id: 'auth-verify',
    name: 'Verify Email',
    description: 'Email verification page',
    category: 'auth',
    subcategory: 'Verify',
    tags: ['verify', 'email', 'confirm'],
    type: 'page',
    sections: [],
  },
];

export const errorPageTemplates: PageTemplate[] = [
  {
    id: 'error-404',
    name: '404 Page',
    description: 'Page not found error',
    category: 'error',
    subcategory: '404',
    tags: ['404', 'not-found', 'error'],
    type: 'page',
    sections: [],
  },
  {
    id: 'error-500',
    name: '500 Page',
    description: 'Server error page',
    category: 'error',
    subcategory: '500',
    tags: ['500', 'server', 'error'],
    type: 'page',
    sections: [],
  },
  {
    id: 'error-maintenance',
    name: 'Maintenance Page',
    description: 'Site maintenance page',
    category: 'error',
    subcategory: 'Maintenance',
    tags: ['maintenance', 'downtime', 'update'],
    type: 'page',
    sections: [],
  },
  {
    id: 'error-coming-soon',
    name: 'Coming Soon',
    description: 'Coming soon landing page',
    category: 'error',
    subcategory: 'Coming Soon',
    tags: ['coming-soon', 'launch', 'preview'],
    type: 'page',
    sections: [],
  },
];

// ============================================================================
// COMBINED EXPORTS
// ============================================================================

export const allSectionTemplates: SectionTemplate[] = [
  ...headerTemplates,
  ...footerTemplates,
  ...heroTemplates,
  ...featureTemplates,
  ...testimonialTemplates,
  ...pricingTemplates,
  ...ctaTemplates,
  ...faqTemplates,
  ...teamTemplates,
  ...contactTemplates,
];

export const allPageTemplates: PageTemplate[] = [
  ...landingPageTemplates,
  ...businessPageTemplates,
  ...ecommercePageTemplates,
  ...blogPageTemplates,
  ...dashboardPageTemplates,
  ...authPageTemplates,
  ...errorPageTemplates,
];

export const sectionTemplatesByCategory: Record<TemplateCategory, SectionTemplate[]> = {
  landing: [],
  business: [],
  ecommerce: [],
  blog: [],
  dashboard: [],
  auth: [],
  error: [],
  headers: headerTemplates,
  footers: footerTemplates,
  heroes: heroTemplates,
  features: featureTemplates,
  testimonials: testimonialTemplates,
  pricing: pricingTemplates,
  cta: ctaTemplates,
  faq: faqTemplates,
  team: teamTemplates,
  contact: contactTemplates,
};

export const pageTemplatesByCategory: Record<string, PageTemplate[]> = {
  landing: landingPageTemplates,
  business: businessPageTemplates,
  ecommerce: ecommercePageTemplates,
  blog: blogPageTemplates,
  dashboard: dashboardPageTemplates,
  auth: authPageTemplates,
  error: errorPageTemplates,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getTemplateById(id: string): Template | undefined {
  return [...allSectionTemplates, ...allPageTemplates].find(t => t.id === id);
}

export function searchTemplates(query: string): Template[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [...allSectionTemplates, ...allPageTemplates];

  return [...allSectionTemplates, ...allPageTemplates].filter(template =>
    template.name.toLowerCase().includes(normalizedQuery) ||
    template.description.toLowerCase().includes(normalizedQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
  );
}

export function getTemplatesByCategory(category: TemplateCategory): Template[] {
  const sections = sectionTemplatesByCategory[category] || [];
  const pages = pageTemplatesByCategory[category] || [];
  return [...sections, ...pages];
}

export function getTemplateTags(): string[] {
  const tags = new Set<string>();
  [...allSectionTemplates, ...allPageTemplates].forEach(template => {
    template.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function cloneTemplateElement(template: SectionTemplate): BuilderElement {
  idCounter = 0;
  const clone = JSON.parse(JSON.stringify(template.element));

  function regenerateIds(element: BuilderElement): BuilderElement {
    element.id = generateId();
    element.children = element.children.map(child => regenerateIds(child));
    return element;
  }

  return regenerateIds(clone);
}
