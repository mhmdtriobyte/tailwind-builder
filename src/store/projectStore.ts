/**
 * Project Store
 *
 * Zustand store for managing project state including current project,
 * project list, active page, and project history.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BuilderElement } from '@/types/builder';
import type {
  Project,
  ProjectPage,
  ProjectTheme,
  ProjectSettings,
  SharedComponents,
  PageMeta,
  PageStyles,
  PageTemplate,
  ProjectTemplate,
} from '@/lib/projectSystem';
import {
  createProject,
  createPage,
  createProjectFromTemplate,
  saveProject,
  deleteProject as deleteProjectFromStorage,
  loadProjectsFromStorage,
  getProject,
  setCurrentProject as setCurrentProjectInStorage,
  getCurrentProjectId,
  addPageToProject,
  removePageFromProject,
  updatePageInProject,
  duplicatePageInProject,
  reorderPagesInProject,
  setHomePageInProject,
  startAutoSave,
  stopAutoSave,
  generatePageId,
  createDefaultPageMeta,
  createDefaultPageStyles,
} from '@/lib/projectSystem';

// ============================================================================
// TYPES
// ============================================================================

export interface ProjectHistoryEntry {
  project: Project;
  timestamp: number;
  description: string;
}

export interface ProjectState {
  // Current project
  currentProject: Project | null;
  activePageId: string | null;

  // Project list
  projects: Project[];

  // History for undo/redo
  projectHistory: ProjectHistoryEntry[];
  historyIndex: number;

  // UI state
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  autoSaveEnabled: boolean;
  lastSaved: number | null;

  // Error state
  error: string | null;

  // Project operations
  createNewProject: (name: string, description?: string) => Project;
  createProjectFromTemplate: (template: ProjectTemplate, name: string) => Project;
  openProject: (projectId: string) => void;
  saveCurrentProject: () => void;
  closeProject: () => void;
  deleteProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => Project;
  loadProjects: () => void;

  // Page operations
  addPage: (name: string, path?: string, template?: PageTemplate) => ProjectPage | null;
  removePage: (pageId: string) => void;
  renamePage: (pageId: string, name: string) => void;
  duplicatePage: (pageId: string) => ProjectPage | null;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  setActivePage: (pageId: string) => void;
  setHomePage: (pageId: string) => void;

  // Page content operations
  updatePageElements: (pageId: string, elements: BuilderElement[]) => void;
  updatePageMeta: (pageId: string, meta: Partial<PageMeta>) => void;
  updatePageStyles: (pageId: string, styles: Partial<PageStyles>) => void;
  updatePagePath: (pageId: string, path: string) => void;

  // Project settings
  updateProjectName: (name: string) => void;
  updateProjectDescription: (description: string) => void;
  updateProjectTheme: (theme: Partial<ProjectTheme>) => void;
  updateProjectSettings: (settings: Partial<ProjectSettings>) => void;
  updateSharedComponents: (components: Partial<SharedComponents>) => void;

  // History operations
  saveToHistory: (description: string) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;

  // Auto-save
  enableAutoSave: () => void;
  disableAutoSave: () => void;

  // Helpers
  getActivePage: () => ProjectPage | null;
  getPageById: (pageId: string) => ProjectPage | null;
  getPageByPath: (path: string) => ProjectPage | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_HISTORY = 30;
const STORAGE_KEY = 'tailwind-builder-project-store';

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentProject: null,
      activePageId: null,
      projects: [],
      projectHistory: [],
      historyIndex: -1,
      isLoading: false,
      isSaving: false,
      hasUnsavedChanges: false,
      autoSaveEnabled: true,
      lastSaved: null,
      error: null,

      // ========================================================================
      // PROJECT OPERATIONS
      // ========================================================================

      createNewProject: (name, description = '') => {
        const project = createProject(name, description);

        set((state) => ({
          currentProject: project,
          activePageId: project.pages[0]?.id || null,
          projects: [...state.projects, project],
          hasUnsavedChanges: false,
          projectHistory: [],
          historyIndex: -1,
        }));

        saveProject(project);
        setCurrentProjectInStorage(project.id);

        // Start auto-save if enabled
        if (get().autoSaveEnabled) {
          get().enableAutoSave();
        }

        return project;
      },

      createProjectFromTemplate: (template, name) => {
        const project = createProjectFromTemplate(template, name);

        set((state) => ({
          currentProject: project,
          activePageId: project.pages[0]?.id || null,
          projects: [...state.projects, project],
          hasUnsavedChanges: false,
          projectHistory: [],
          historyIndex: -1,
        }));

        saveProject(project);
        setCurrentProjectInStorage(project.id);

        if (get().autoSaveEnabled) {
          get().enableAutoSave();
        }

        return project;
      },

      openProject: (projectId) => {
        set({ isLoading: true, error: null });

        try {
          const project = getProject(projectId);

          if (!project) {
            set({ error: 'Project not found', isLoading: false });
            return;
          }

          set({
            currentProject: project,
            activePageId: project.pages.find((p) => p.isHomePage)?.id || project.pages[0]?.id || null,
            hasUnsavedChanges: false,
            projectHistory: [],
            historyIndex: -1,
            isLoading: false,
          });

          setCurrentProjectInStorage(projectId);

          if (get().autoSaveEnabled) {
            get().enableAutoSave();
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to open project',
            isLoading: false,
          });
        }
      },

      saveCurrentProject: () => {
        const { currentProject } = get();
        if (!currentProject) return;

        set({ isSaving: true });

        try {
          const updatedProject = {
            ...currentProject,
            updatedAt: Date.now(),
          };

          saveProject(updatedProject);

          set((state) => ({
            currentProject: updatedProject,
            projects: state.projects.map((p) =>
              p.id === updatedProject.id ? updatedProject : p
            ),
            hasUnsavedChanges: false,
            lastSaved: Date.now(),
            isSaving: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to save project',
            isSaving: false,
          });
        }
      },

      closeProject: () => {
        stopAutoSave();

        set({
          currentProject: null,
          activePageId: null,
          hasUnsavedChanges: false,
          projectHistory: [],
          historyIndex: -1,
        });
      },

      deleteProject: (projectId) => {
        const { currentProject } = get();

        try {
          deleteProjectFromStorage(projectId);

          set((state) => ({
            projects: state.projects.filter((p) => p.id !== projectId),
            currentProject: currentProject?.id === projectId ? null : currentProject,
            activePageId: currentProject?.id === projectId ? null : state.activePageId,
          }));

          if (currentProject?.id === projectId) {
            stopAutoSave();
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete project',
          });
        }
      },

      duplicateProject: (projectId) => {
        const project = get().projects.find((p) => p.id === projectId);

        if (!project) {
          set({ error: 'Project not found' });
          throw new Error('Project not found');
        }

        const duplicated = createProject(`${project.name} (Copy)`, project.description);
        duplicated.pages = project.pages.map((page) => ({
          ...page,
          id: generatePageId(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }));
        duplicated.theme = { ...project.theme };
        duplicated.settings = { ...project.settings };
        duplicated.sharedComponents = { ...project.sharedComponents };

        set((state) => ({
          projects: [...state.projects, duplicated],
        }));

        saveProject(duplicated);

        return duplicated;
      },

      loadProjects: () => {
        set({ isLoading: true });

        try {
          const projects = loadProjectsFromStorage();
          const currentProjectId = getCurrentProjectId();

          set({
            projects,
            isLoading: false,
          });

          // Restore current project if exists
          if (currentProjectId) {
            const currentProject = projects.find((p) => p.id === currentProjectId);
            if (currentProject) {
              set({
                currentProject,
                activePageId:
                  currentProject.pages.find((p) => p.isHomePage)?.id ||
                  currentProject.pages[0]?.id ||
                  null,
              });

              if (get().autoSaveEnabled) {
                get().enableAutoSave();
              }
            }
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load projects',
            isLoading: false,
          });
        }
      },

      // ========================================================================
      // PAGE OPERATIONS
      // ========================================================================

      addPage: (name, path, template) => {
        const { currentProject } = get();
        if (!currentProject) return null;

        const page = createPage(name, path, template);
        const updatedProject = addPageToProject(currentProject, page);

        set({
          currentProject: updatedProject,
          activePageId: page.id,
          hasUnsavedChanges: true,
        });

        get().saveToHistory(`Added page: ${name}`);

        return page;
      },

      removePage: (pageId) => {
        const { currentProject, activePageId } = get();
        if (!currentProject) return;

        try {
          const updatedProject = removePageFromProject(currentProject, pageId);

          set({
            currentProject: updatedProject,
            activePageId:
              activePageId === pageId
                ? updatedProject.pages[0]?.id || null
                : activePageId,
            hasUnsavedChanges: true,
          });

          get().saveToHistory('Removed page');
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to remove page',
          });
        }
      },

      renamePage: (pageId, name) => {
        const { currentProject } = get();
        if (!currentProject) return;

        const updatedProject = updatePageInProject(currentProject, pageId, { name });

        set({
          currentProject: updatedProject,
          hasUnsavedChanges: true,
        });

        get().saveToHistory(`Renamed page to: ${name}`);
      },

      duplicatePage: (pageId) => {
        const { currentProject } = get();
        if (!currentProject) return null;

        try {
          const updatedProject = duplicatePageInProject(currentProject, pageId);
          const newPage = updatedProject.pages[updatedProject.pages.length - 1];

          set({
            currentProject: updatedProject,
            activePageId: newPage.id,
            hasUnsavedChanges: true,
          });

          get().saveToHistory('Duplicated page');

          return newPage;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to duplicate page',
          });
          return null;
        }
      },

      reorderPages: (fromIndex, toIndex) => {
        const { currentProject } = get();
        if (!currentProject) return;

        const updatedProject = reorderPagesInProject(currentProject, fromIndex, toIndex);

        set({
          currentProject: updatedProject,
          hasUnsavedChanges: true,
        });

        get().saveToHistory('Reordered pages');
      },

      setActivePage: (pageId) => {
        set({ activePageId: pageId });
      },

      setHomePage: (pageId) => {
        const { currentProject } = get();
        if (!currentProject) return;

        const updatedProject = setHomePageInProject(currentProject, pageId);

        set({
          currentProject: updatedProject,
          hasUnsavedChanges: true,
        });

        get().saveToHistory('Changed home page');
      },

      // ========================================================================
      // PAGE CONTENT OPERATIONS
      // ========================================================================

      updatePageElements: (pageId, elements) => {
        const { currentProject } = get();
        if (!currentProject) return;

        const updatedProject = updatePageInProject(currentProject, pageId, { elements });

        set({
          currentProject: updatedProject,
          hasUnsavedChanges: true,
        });
      },

      updatePageMeta: (pageId, meta) => {
        const { currentProject } = get();
        if (!currentProject) return;

        const page = currentProject.pages.find((p) => p.id === pageId);
        if (!page) return;

        const updatedMeta = { ...page.meta, ...meta };
        const updatedProject = updatePageInProject(currentProject, pageId, {
          meta: updatedMeta,
        });

        set({
          currentProject: updatedProject,
          hasUnsavedChanges: true,
        });

        get().saveToHistory('Updated page metadata');
      },

      updatePageStyles: (pageId, styles) => {
        const { currentProject } = get();
        if (!currentProject) return;

        const page = currentProject.pages.find((p) => p.id === pageId);
        if (!page) return;

        const updatedStyles = { ...page.styles, ...styles };
        const updatedProject = updatePageInProject(currentProject, pageId, {
          styles: updatedStyles,
        });

        set({
          currentProject: updatedProject,
          hasUnsavedChanges: true,
        });

        get().saveToHistory('Updated page styles');
      },

      updatePagePath: (pageId, path) => {
        const { currentProject } = get();
        if (!currentProject) return;

        const updatedProject = updatePageInProject(currentProject, pageId, { path });

        set({
          currentProject: updatedProject,
          hasUnsavedChanges: true,
        });

        get().saveToHistory('Updated page path');
      },

      // ========================================================================
      // PROJECT SETTINGS
      // ========================================================================

      updateProjectName: (name) => {
        const { currentProject } = get();
        if (!currentProject) return;

        set({
          currentProject: {
            ...currentProject,
            name,
            updatedAt: Date.now(),
          },
          hasUnsavedChanges: true,
        });

        get().saveToHistory(`Renamed project to: ${name}`);
      },

      updateProjectDescription: (description) => {
        const { currentProject } = get();
        if (!currentProject) return;

        set({
          currentProject: {
            ...currentProject,
            description,
            updatedAt: Date.now(),
          },
          hasUnsavedChanges: true,
        });
      },

      updateProjectTheme: (theme) => {
        const { currentProject } = get();
        if (!currentProject) return;

        set({
          currentProject: {
            ...currentProject,
            theme: { ...currentProject.theme, ...theme },
            updatedAt: Date.now(),
          },
          hasUnsavedChanges: true,
        });

        get().saveToHistory('Updated theme');
      },

      updateProjectSettings: (settings) => {
        const { currentProject } = get();
        if (!currentProject) return;

        set({
          currentProject: {
            ...currentProject,
            settings: { ...currentProject.settings, ...settings },
            updatedAt: Date.now(),
          },
          hasUnsavedChanges: true,
        });

        get().saveToHistory('Updated settings');
      },

      updateSharedComponents: (components) => {
        const { currentProject } = get();
        if (!currentProject) return;

        set({
          currentProject: {
            ...currentProject,
            sharedComponents: { ...currentProject.sharedComponents, ...components },
            updatedAt: Date.now(),
          },
          hasUnsavedChanges: true,
        });

        get().saveToHistory('Updated shared components');
      },

      // ========================================================================
      // HISTORY OPERATIONS
      // ========================================================================

      saveToHistory: (description) => {
        const { currentProject, projectHistory, historyIndex } = get();
        if (!currentProject) return;

        // Remove any redo history
        const newHistory = projectHistory.slice(0, historyIndex + 1);

        // Add current state to history
        newHistory.push({
          project: JSON.parse(JSON.stringify(currentProject)),
          timestamp: Date.now(),
          description,
        });

        // Limit history size
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }

        set({
          projectHistory: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      undo: () => {
        const { projectHistory, historyIndex, currentProject } = get();

        if (historyIndex <= 0 || !currentProject) return;

        const newIndex = historyIndex - 1;
        const entry = projectHistory[newIndex];

        set({
          currentProject: JSON.parse(JSON.stringify(entry.project)),
          historyIndex: newIndex,
          hasUnsavedChanges: true,
        });
      },

      redo: () => {
        const { projectHistory, historyIndex, currentProject } = get();

        if (historyIndex >= projectHistory.length - 1 || !currentProject) return;

        const newIndex = historyIndex + 1;
        const entry = projectHistory[newIndex];

        set({
          currentProject: JSON.parse(JSON.stringify(entry.project)),
          historyIndex: newIndex,
          hasUnsavedChanges: true,
        });
      },

      clearHistory: () => {
        set({
          projectHistory: [],
          historyIndex: -1,
        });
      },

      // ========================================================================
      // AUTO-SAVE
      // ========================================================================

      enableAutoSave: () => {
        set({ autoSaveEnabled: true });

        startAutoSave(
          () => get().currentProject,
          (project) => {
            set((state) => ({
              currentProject: project,
              projects: state.projects.map((p) =>
                p.id === project.id ? project : p
              ),
              lastSaved: Date.now(),
              hasUnsavedChanges: false,
            }));
          }
        );
      },

      disableAutoSave: () => {
        set({ autoSaveEnabled: false });
        stopAutoSave();
      },

      // ========================================================================
      // HELPERS
      // ========================================================================

      getActivePage: () => {
        const { currentProject, activePageId } = get();
        if (!currentProject || !activePageId) return null;
        return currentProject.pages.find((p) => p.id === activePageId) || null;
      },

      getPageById: (pageId) => {
        const { currentProject } = get();
        if (!currentProject) return null;
        return currentProject.pages.find((p) => p.id === pageId) || null;
      },

      getPageByPath: (path) => {
        const { currentProject } = get();
        if (!currentProject) return null;
        return currentProject.pages.find((p) => p.path === path) || null;
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        autoSaveEnabled: state.autoSaveEnabled,
      }),
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const selectCurrentProject = (state: ProjectState) => state.currentProject;
export const selectActivePage = (state: ProjectState) => state.getActivePage();
export const selectProjects = (state: ProjectState) => state.projects;
export const selectHasUnsavedChanges = (state: ProjectState) => state.hasUnsavedChanges;
export const selectIsLoading = (state: ProjectState) => state.isLoading;
export const selectIsSaving = (state: ProjectState) => state.isSaving;
export const selectError = (state: ProjectState) => state.error;
export const selectCanUndo = (state: ProjectState) => state.historyIndex > 0;
export const selectCanRedo = (state: ProjectState) =>
  state.historyIndex < state.projectHistory.length - 1;
