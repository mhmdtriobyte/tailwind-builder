/**
 * Project Management System
 *
 * Provides comprehensive project management for multi-page website building.
 * Handles project creation, saving, loading, import/export, and auto-save.
 */

import type { BuilderElement } from '@/types/builder';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Page metadata for SEO and Open Graph
 */
export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonicalUrl?: string;
  robots?: string;
  customHead?: string;
}

/**
 * Page-specific styles and settings
 */
export interface PageStyles {
  bodyClasses: string[];
  customCss: string;
  fontFamily?: string;
  primaryColor?: string;
  backgroundColor?: string;
}

/**
 * Represents a single page in a project
 */
export interface ProjectPage {
  id: string;
  name: string;
  path: string;
  elements: BuilderElement[];
  meta: PageMeta;
  styles: PageStyles;
  isHomePage: boolean;
  template?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Project-wide theme settings
 */
export interface ProjectTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  headingFont?: string;
  borderRadius: string;
  shadows: boolean;
  darkMode: boolean;
}

/**
 * Global project settings
 */
export interface ProjectSettings {
  siteUrl: string;
  siteName: string;
  siteDescription: string;
  siteKeywords: string[];
  favicon?: string;
  logo?: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  customScripts?: {
    head?: string;
    bodyStart?: string;
    bodyEnd?: string;
  };
}

/**
 * Shared components (header, footer, etc.)
 */
export interface SharedComponents {
  header?: BuilderElement[];
  footer?: BuilderElement[];
  sidebar?: BuilderElement[];
}

/**
 * Main project interface
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  version: string;
  pages: ProjectPage[];
  theme: ProjectTheme;
  settings: ProjectSettings;
  sharedComponents: SharedComponents;
  createdAt: number;
  updatedAt: number;
  lastAutoSave?: number;
}

/**
 * Project template definition
 */
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category: 'blank' | 'landing' | 'portfolio' | 'business' | 'blog' | 'ecommerce';
  pages: Partial<ProjectPage>[];
  theme: Partial<ProjectTheme>;
  settings: Partial<ProjectSettings>;
}

/**
 * Page template definition
 */
export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category: 'blank' | 'home' | 'about' | 'contact' | 'services' | 'blog' | 'product';
  elements: BuilderElement[];
  meta?: Partial<PageMeta>;
  styles?: Partial<PageStyles>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PROJECT_STORAGE_KEY = 'tailwind-builder-projects';
const CURRENT_PROJECT_KEY = 'tailwind-builder-current-project';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const PROJECT_VERSION = '1.0.0';

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export function createDefaultPageMeta(name: string): PageMeta {
  return {
    title: name,
    description: '',
    keywords: [],
    ogTitle: name,
    ogDescription: '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    robots: 'index, follow',
  };
}

export function createDefaultPageStyles(): PageStyles {
  return {
    bodyClasses: [],
    customCss: '',
  };
}

export function createDefaultTheme(): ProjectTheme {
  return {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: '0.5rem',
    shadows: true,
    darkMode: false,
  };
}

export function createDefaultSettings(name: string): ProjectSettings {
  return {
    siteUrl: '',
    siteName: name,
    siteDescription: '',
    siteKeywords: [],
    socialLinks: {},
  };
}

// ============================================================================
// ID GENERATION
// ============================================================================

export function generateProjectId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generatePageId(): string {
  return `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// PROJECT FACTORY
// ============================================================================

/**
 * Creates a new project with default settings
 */
export function createProject(
  name: string,
  description: string = ''
): Project {
  const projectId = generateProjectId();
  const now = Date.now();

  const homePage: ProjectPage = {
    id: generatePageId(),
    name: 'Home',
    path: '/',
    elements: [],
    meta: createDefaultPageMeta('Home'),
    styles: createDefaultPageStyles(),
    isHomePage: true,
    createdAt: now,
    updatedAt: now,
  };

  return {
    id: projectId,
    name,
    description,
    version: PROJECT_VERSION,
    pages: [homePage],
    theme: createDefaultTheme(),
    settings: createDefaultSettings(name),
    sharedComponents: {},
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Creates a new page with default settings
 */
export function createPage(
  name: string,
  path?: string,
  template?: PageTemplate
): ProjectPage {
  const now = Date.now();
  const pagePath = path || `/${name.toLowerCase().replace(/\s+/g, '-')}`;

  return {
    id: generatePageId(),
    name,
    path: pagePath,
    elements: template?.elements || [],
    meta: {
      ...createDefaultPageMeta(name),
      ...template?.meta,
    },
    styles: {
      ...createDefaultPageStyles(),
      ...template?.styles,
    },
    isHomePage: false,
    template: template?.id,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Creates a project from a template
 */
export function createProjectFromTemplate(
  template: ProjectTemplate,
  name: string
): Project {
  const project = createProject(name, template.description);

  // Apply template theme
  project.theme = {
    ...project.theme,
    ...template.theme,
  };

  // Apply template settings
  project.settings = {
    ...project.settings,
    ...template.settings,
  };

  // Create pages from template
  if (template.pages.length > 0) {
    project.pages = template.pages.map((pageTemplate, index) => {
      const pageName = pageTemplate.name || `Page ${index + 1}`;
      return {
        id: generatePageId(),
        name: pageName,
        path: pageTemplate.path || `/${pageName.toLowerCase().replace(/\s+/g, '-')}`,
        elements: pageTemplate.elements || [],
        meta: {
          ...createDefaultPageMeta(pageName),
          ...pageTemplate.meta,
        },
        styles: {
          ...createDefaultPageStyles(),
          ...pageTemplate.styles,
        },
        isHomePage: index === 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    });
  }

  return project;
}

// ============================================================================
// PROJECT STORAGE
// ============================================================================

/**
 * Saves all projects to local storage
 */
export function saveProjectsToStorage(projects: Project[]): void {
  try {
    const data = JSON.stringify(projects);
    localStorage.setItem(PROJECT_STORAGE_KEY, data);
  } catch (error) {
    console.error('Failed to save projects to storage:', error);
    throw new Error('Failed to save projects. Storage may be full.');
  }
}

/**
 * Loads all projects from local storage
 */
export function loadProjectsFromStorage(): Project[] {
  try {
    const data = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Project[];
  } catch (error) {
    console.error('Failed to load projects from storage:', error);
    return [];
  }
}

/**
 * Saves a single project (updates or adds)
 */
export function saveProject(project: Project): void {
  const projects = loadProjectsFromStorage();
  const index = projects.findIndex((p) => p.id === project.id);

  const updatedProject = {
    ...project,
    updatedAt: Date.now(),
  };

  if (index >= 0) {
    projects[index] = updatedProject;
  } else {
    projects.push(updatedProject);
  }

  saveProjectsToStorage(projects);
}

/**
 * Deletes a project from storage
 */
export function deleteProject(projectId: string): void {
  const projects = loadProjectsFromStorage();
  const filtered = projects.filter((p) => p.id !== projectId);
  saveProjectsToStorage(filtered);
}

/**
 * Gets a project by ID
 */
export function getProject(projectId: string): Project | null {
  const projects = loadProjectsFromStorage();
  return projects.find((p) => p.id === projectId) || null;
}

/**
 * Sets the current active project
 */
export function setCurrentProject(projectId: string): void {
  localStorage.setItem(CURRENT_PROJECT_KEY, projectId);
}

/**
 * Gets the current active project ID
 */
export function getCurrentProjectId(): string | null {
  return localStorage.getItem(CURRENT_PROJECT_KEY);
}

/**
 * Gets the current active project
 */
export function getCurrentProject(): Project | null {
  const projectId = getCurrentProjectId();
  if (!projectId) return null;
  return getProject(projectId);
}

// ============================================================================
// AUTO-SAVE
// ============================================================================

let autoSaveTimer: NodeJS.Timeout | null = null;
let autoSaveCallback: ((project: Project) => void) | null = null;

/**
 * Starts auto-save for a project
 */
export function startAutoSave(
  getProject: () => Project | null,
  onSave?: (project: Project) => void
): void {
  stopAutoSave();

  autoSaveCallback = onSave || null;

  autoSaveTimer = setInterval(() => {
    const project = getProject();
    if (project) {
      const updatedProject = {
        ...project,
        lastAutoSave: Date.now(),
      };
      saveProject(updatedProject);
      autoSaveCallback?.(updatedProject);
    }
  }, AUTO_SAVE_INTERVAL);
}

/**
 * Stops auto-save
 */
export function stopAutoSave(): void {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
    autoSaveTimer = null;
  }
  autoSaveCallback = null;
}

// ============================================================================
// PAGE OPERATIONS
// ============================================================================

/**
 * Adds a page to a project
 */
export function addPageToProject(
  project: Project,
  page: ProjectPage
): Project {
  return {
    ...project,
    pages: [...project.pages, page],
    updatedAt: Date.now(),
  };
}

/**
 * Removes a page from a project
 */
export function removePageFromProject(
  project: Project,
  pageId: string
): Project {
  // Don't allow removing the last page
  if (project.pages.length <= 1) {
    throw new Error('Cannot remove the last page from a project.');
  }

  const pages = project.pages.filter((p) => p.id !== pageId);

  // If home page was removed, set the first page as home
  if (!pages.some((p) => p.isHomePage)) {
    pages[0].isHomePage = true;
  }

  return {
    ...project,
    pages,
    updatedAt: Date.now(),
  };
}

/**
 * Updates a page in a project
 */
export function updatePageInProject(
  project: Project,
  pageId: string,
  updates: Partial<ProjectPage>
): Project {
  return {
    ...project,
    pages: project.pages.map((page) =>
      page.id === pageId
        ? { ...page, ...updates, updatedAt: Date.now() }
        : page
    ),
    updatedAt: Date.now(),
  };
}

/**
 * Duplicates a page in a project
 */
export function duplicatePageInProject(
  project: Project,
  pageId: string
): Project {
  const page = project.pages.find((p) => p.id === pageId);
  if (!page) {
    throw new Error('Page not found.');
  }

  const newPage: ProjectPage = {
    ...page,
    id: generatePageId(),
    name: `${page.name} (Copy)`,
    path: `${page.path}-copy`,
    isHomePage: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return addPageToProject(project, newPage);
}

/**
 * Reorders pages in a project
 */
export function reorderPagesInProject(
  project: Project,
  fromIndex: number,
  toIndex: number
): Project {
  const pages = [...project.pages];
  const [removed] = pages.splice(fromIndex, 1);
  pages.splice(toIndex, 0, removed);

  return {
    ...project,
    pages,
    updatedAt: Date.now(),
  };
}

/**
 * Sets a page as the home page
 */
export function setHomePageInProject(
  project: Project,
  pageId: string
): Project {
  return {
    ...project,
    pages: project.pages.map((page) => ({
      ...page,
      isHomePage: page.id === pageId,
      path: page.id === pageId ? '/' : (page.path === '/' ? `/${page.name.toLowerCase().replace(/\s+/g, '-')}` : page.path),
    })),
    updatedAt: Date.now(),
  };
}

// ============================================================================
// IMPORT / EXPORT
// ============================================================================

/**
 * Exports a project as JSON string
 */
export function exportProjectAsJson(project: Project): string {
  return JSON.stringify(project, null, 2);
}

/**
 * Imports a project from JSON string
 */
export function importProjectFromJson(jsonString: string): Project {
  try {
    const project = JSON.parse(jsonString) as Project;

    // Validate required fields
    if (!project.id || !project.name || !project.pages) {
      throw new Error('Invalid project format');
    }

    // Generate new IDs to avoid conflicts
    const newProject: Project = {
      ...project,
      id: generateProjectId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pages: project.pages.map((page) => ({
        ...page,
        id: generatePageId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })),
    };

    return newProject;
  } catch (error) {
    console.error('Failed to import project:', error);
    throw new Error('Failed to import project. Invalid format.');
  }
}

/**
 * Exports a project as a downloadable JSON file
 */
export function downloadProjectJson(project: Project): void {
  const json = exportProjectAsJson(project);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Imports a project from a file input
 */
export function importProjectFromFile(file: File): Promise<Project> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const project = importProjectFromJson(jsonString);
        resolve(project);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsText(file);
  });
}

// ============================================================================
// PROJECT TEMPLATES
// ============================================================================

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Project',
    description: 'Start from scratch with an empty canvas',
    category: 'blank',
    pages: [
      {
        name: 'Home',
        path: '/',
        elements: [],
      },
    ],
    theme: {},
    settings: {},
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'A single-page landing page template',
    category: 'landing',
    pages: [
      {
        name: 'Home',
        path: '/',
        elements: [],
        meta: {
          description: 'Welcome to our landing page',
        },
      },
    ],
    theme: {
      primaryColor: '#3b82f6',
      accentColor: '#8b5cf6',
    },
    settings: {},
  },
  {
    id: 'business-website',
    name: 'Business Website',
    description: 'A multi-page business website template',
    category: 'business',
    pages: [
      {
        name: 'Home',
        path: '/',
        elements: [],
      },
      {
        name: 'About',
        path: '/about',
        elements: [],
      },
      {
        name: 'Services',
        path: '/services',
        elements: [],
      },
      {
        name: 'Contact',
        path: '/contact',
        elements: [],
      },
    ],
    theme: {
      primaryColor: '#1e40af',
      secondaryColor: '#475569',
    },
    settings: {},
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'A portfolio template for showcasing work',
    category: 'portfolio',
    pages: [
      {
        name: 'Home',
        path: '/',
        elements: [],
      },
      {
        name: 'Portfolio',
        path: '/portfolio',
        elements: [],
      },
      {
        name: 'About',
        path: '/about',
        elements: [],
      },
      {
        name: 'Contact',
        path: '/contact',
        elements: [],
      },
    ],
    theme: {
      primaryColor: '#18181b',
      accentColor: '#f59e0b',
    },
    settings: {},
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'A blog template with posts and categories',
    category: 'blog',
    pages: [
      {
        name: 'Home',
        path: '/',
        elements: [],
      },
      {
        name: 'Blog',
        path: '/blog',
        elements: [],
      },
      {
        name: 'About',
        path: '/about',
        elements: [],
      },
    ],
    theme: {
      primaryColor: '#059669',
      secondaryColor: '#6b7280',
    },
    settings: {},
  },
];

// ============================================================================
// PAGE TEMPLATES
// ============================================================================

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Page',
    description: 'An empty page',
    category: 'blank',
    elements: [],
  },
  {
    id: 'home',
    name: 'Home Page',
    description: 'A typical home page layout',
    category: 'home',
    elements: [],
    meta: {
      description: 'Welcome to our website',
    },
  },
  {
    id: 'about',
    name: 'About Page',
    description: 'An about us page layout',
    category: 'about',
    elements: [],
    meta: {
      description: 'Learn more about us',
    },
  },
  {
    id: 'contact',
    name: 'Contact Page',
    description: 'A contact page with form',
    category: 'contact',
    elements: [],
    meta: {
      description: 'Get in touch with us',
    },
  },
  {
    id: 'services',
    name: 'Services Page',
    description: 'A services showcase page',
    category: 'services',
    elements: [],
    meta: {
      description: 'Our services and offerings',
    },
  },
];

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validates a project structure
 */
export function validateProject(project: Partial<Project>): string[] {
  const errors: string[] = [];

  if (!project.name || project.name.trim() === '') {
    errors.push('Project name is required.');
  }

  if (!project.pages || project.pages.length === 0) {
    errors.push('Project must have at least one page.');
  }

  if (project.pages) {
    const paths = project.pages.map((p) => p.path);
    const duplicatePaths = paths.filter((p, i) => paths.indexOf(p) !== i);
    if (duplicatePaths.length > 0) {
      errors.push(`Duplicate page paths found: ${duplicatePaths.join(', ')}`);
    }

    const homePages = project.pages.filter((p) => p.isHomePage);
    if (homePages.length !== 1) {
      errors.push('Project must have exactly one home page.');
    }
  }

  return errors;
}

/**
 * Validates a page path
 */
export function validatePagePath(path: string, existingPaths: string[]): string | null {
  if (!path) {
    return 'Page path is required.';
  }

  if (!path.startsWith('/')) {
    return 'Page path must start with /.';
  }

  if (!/^\/[a-z0-9-/]*$/.test(path)) {
    return 'Page path can only contain lowercase letters, numbers, hyphens, and forward slashes.';
  }

  if (existingPaths.includes(path)) {
    return 'A page with this path already exists.';
  }

  return null;
}
