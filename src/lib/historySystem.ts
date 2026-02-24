/**
 * historySystem.ts - Enhanced History and Versioning System
 *
 * A comprehensive history management system supporting:
 * - Unlimited undo/redo with configurable limits
 * - Named snapshots and checkpoints
 * - Auto-save on major changes
 * - History branching (git-like)
 * - Diff between versions
 * - History compression
 * - Action grouping (batch changes)
 * - Persistence to localStorage/IndexedDB
 */

import type { BuilderElement } from '@/types/builder';
import { DiffEngine, DiffResult, ChangeType } from './diffEngine';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

/**
 * Types of actions that can be recorded in history
 */
export type ActionType =
  | 'add_element'
  | 'remove_element'
  | 'update_element'
  | 'move_element'
  | 'duplicate_element'
  | 'update_styles'
  | 'batch_update'
  | 'clear_canvas'
  | 'import'
  | 'paste'
  | 'checkpoint'
  | 'branch_create'
  | 'branch_merge';

/**
 * Metadata about an action for display and categorization
 */
export interface ActionMetadata {
  type: ActionType;
  description: string;
  elementId?: string;
  elementType?: string;
  elementName?: string;
  affectedElements?: string[];
  propertyChanged?: string;
  oldValue?: unknown;
  newValue?: unknown;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

/**
 * A single history entry representing a state snapshot
 */
export interface HistoryEntry {
  id: string;
  elements: BuilderElement[];
  metadata: ActionMetadata;
  checkpointName?: string;
  isCheckpoint: boolean;
  isAutoSave: boolean;
  branchId: string;
  parentId: string | null;
  compressed: boolean;
  compressedFrom?: string[];
  tags?: string[];
}

/**
 * Represents a branch in the history tree
 */
export interface HistoryBranch {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  createdFromEntryId: string;
  headEntryId: string;
  isMain: boolean;
  color?: string;
}

/**
 * Configuration for the history system
 */
export interface HistoryConfig {
  maxHistorySize: number;
  autoSaveInterval: number;
  autoSaveEnabled: boolean;
  compressionEnabled: boolean;
  compressionThreshold: number;
  persistenceEnabled: boolean;
  persistenceKey: string;
  useIndexedDB: boolean;
}

/**
 * State of the entire history system
 */
export interface HistorySystemState {
  entries: HistoryEntry[];
  branches: HistoryBranch[];
  currentEntryIndex: number;
  currentBranchId: string;
  config: HistoryConfig;
}

/**
 * Result of a history operation
 */
export interface HistoryOperationResult {
  success: boolean;
  error?: string;
  entry?: HistoryEntry;
  diff?: DiffResult;
}

/**
 * Action group for batching multiple changes
 */
export interface ActionGroup {
  id: string;
  name: string;
  actions: ActionMetadata[];
  startTime: number;
  endTime?: number;
  isActive: boolean;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique identifier
 */
function generateId(): string {
  return `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone elements array
 */
function cloneElements(elements: BuilderElement[]): BuilderElement[] {
  return JSON.parse(JSON.stringify(elements));
}

/**
 * Get human-readable description for an action
 */
function getActionDescription(metadata: ActionMetadata): string {
  const elementDesc = metadata.elementName || metadata.elementType || 'element';

  switch (metadata.type) {
    case 'add_element':
      return `Added ${elementDesc}`;
    case 'remove_element':
      return `Removed ${elementDesc}`;
    case 'update_element':
      return metadata.propertyChanged
        ? `Updated ${metadata.propertyChanged} of ${elementDesc}`
        : `Updated ${elementDesc}`;
    case 'move_element':
      return `Moved ${elementDesc}`;
    case 'duplicate_element':
      return `Duplicated ${elementDesc}`;
    case 'update_styles':
      return `Changed styles of ${elementDesc}`;
    case 'batch_update':
      return `Batch update (${metadata.affectedElements?.length || 0} elements)`;
    case 'clear_canvas':
      return 'Cleared canvas';
    case 'import':
      return 'Imported elements';
    case 'paste':
      return `Pasted ${elementDesc}`;
    case 'checkpoint':
      return `Checkpoint: ${metadata.description}`;
    case 'branch_create':
      return `Created branch: ${metadata.description}`;
    case 'branch_merge':
      return `Merged branch: ${metadata.description}`;
    default:
      return metadata.description || 'Unknown action';
  }
}

/**
 * Get icon name for an action type
 */
export function getActionIcon(type: ActionType): string {
  const icons: Record<ActionType, string> = {
    add_element: 'Plus',
    remove_element: 'Trash2',
    update_element: 'Edit3',
    move_element: 'Move',
    duplicate_element: 'Copy',
    update_styles: 'Palette',
    batch_update: 'Layers',
    clear_canvas: 'XCircle',
    import: 'Download',
    paste: 'Clipboard',
    checkpoint: 'Flag',
    branch_create: 'GitBranch',
    branch_merge: 'GitMerge',
  };
  return icons[type] || 'Circle';
}

/**
 * Determine if two actions are similar enough to be compressed
 */
function areActionsSimilar(a: ActionMetadata, b: ActionMetadata): boolean {
  if (a.type !== b.type) return false;
  if (a.elementId !== b.elementId) return false;

  // Same property being updated within short time
  if (a.type === 'update_element' || a.type === 'update_styles') {
    if (a.propertyChanged === b.propertyChanged) {
      const timeDiff = Math.abs(a.timestamp - b.timestamp);
      return timeDiff < 1000; // Within 1 second
    }
  }

  return false;
}

// ============================================================================
// INDEXEDDB PERSISTENCE
// ============================================================================

const DB_NAME = 'tailwind-builder-history';
const DB_VERSION = 1;
const STORE_NAME = 'history';

/**
 * Open IndexedDB connection
 */
async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
}

/**
 * Save data to IndexedDB
 */
async function saveToIndexedDB(key: string, data: unknown): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ key, data, timestamp: Date.now() });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Load data from IndexedDB
 */
async function loadFromIndexedDB<T>(key: string): Promise<T | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.data : null);
    };
  });
}

/**
 * Clear IndexedDB data
 */
async function clearIndexedDB(key: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// ============================================================================
// HISTORY SYSTEM CLASS
// ============================================================================

/**
 * HistorySystem - Manages complete history with branching, compression, and persistence
 */
export class HistorySystem {
  private entries: HistoryEntry[] = [];
  private branches: HistoryBranch[] = [];
  private currentEntryIndex: number = -1;
  private currentBranchId: string = 'main';
  private config: HistoryConfig;
  private diffEngine: DiffEngine;
  private activeGroup: ActionGroup | null = null;
  private groupedActions: ActionMetadata[] = [];
  private autoSaveTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners: Set<(state: HistorySystemState) => void> = new Set();
  private sessionId: string;

  constructor(config?: Partial<HistoryConfig>) {
    this.config = {
      maxHistorySize: 100,
      autoSaveInterval: 30000, // 30 seconds
      autoSaveEnabled: true,
      compressionEnabled: true,
      compressionThreshold: 5,
      persistenceEnabled: true,
      persistenceKey: 'tailwind-builder-history',
      useIndexedDB: true,
      ...config,
    };

    this.diffEngine = new DiffEngine();
    this.sessionId = generateId();

    // Initialize main branch
    this.branches.push({
      id: 'main',
      name: 'Main',
      description: 'Main branch',
      createdAt: Date.now(),
      createdFromEntryId: '',
      headEntryId: '',
      isMain: true,
      color: '#3B82F6',
    });

    // Start auto-save timer if enabled
    if (this.config.autoSaveEnabled) {
      this.startAutoSave();
    }
  }

  // ============================================================================
  // SUBSCRIPTION MANAGEMENT
  // ============================================================================

  /**
   * Subscribe to history changes
   */
  subscribe(listener: (state: HistorySystemState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Get current state
   */
  getState(): HistorySystemState {
    return {
      entries: [...this.entries],
      branches: [...this.branches],
      currentEntryIndex: this.currentEntryIndex,
      currentBranchId: this.currentBranchId,
      config: { ...this.config },
    };
  }

  /**
   * Get current entry
   */
  getCurrentEntry(): HistoryEntry | null {
    if (this.currentEntryIndex < 0 || this.currentEntryIndex >= this.entries.length) {
      return null;
    }
    return this.entries[this.currentEntryIndex];
  }

  /**
   * Get current elements
   */
  getCurrentElements(): BuilderElement[] {
    const entry = this.getCurrentEntry();
    return entry ? cloneElements(entry.elements) : [];
  }

  /**
   * Get entry by index
   */
  getEntry(index: number): HistoryEntry | null {
    if (index < 0 || index >= this.entries.length) {
      return null;
    }
    return this.entries[index];
  }

  /**
   * Get entry by ID
   */
  getEntryById(id: string): HistoryEntry | null {
    return this.entries.find((e) => e.id === id) || null;
  }

  /**
   * Get entries for current branch
   */
  getBranchEntries(branchId?: string): HistoryEntry[] {
    const targetBranchId = branchId || this.currentBranchId;
    return this.entries.filter((e) => e.branchId === targetBranchId);
  }

  // ============================================================================
  // CORE HISTORY OPERATIONS
  // ============================================================================

  /**
   * Record a new state in history
   */
  record(
    elements: BuilderElement[],
    action: ActionType,
    metadata?: Partial<ActionMetadata>
  ): HistoryOperationResult {
    try {
      const fullMetadata: ActionMetadata = {
        type: action,
        description: '',
        timestamp: Date.now(),
        sessionId: this.sessionId,
        ...metadata,
      };
      fullMetadata.description = fullMetadata.description || getActionDescription(fullMetadata);

      // If action grouping is active, collect actions
      if (this.activeGroup) {
        this.groupedActions.push(fullMetadata);
      }

      // Truncate any redo history
      if (this.currentEntryIndex < this.entries.length - 1) {
        this.entries = this.entries.slice(0, this.currentEntryIndex + 1);
      }

      // Compress similar actions if enabled
      if (this.config.compressionEnabled && this.entries.length > 0) {
        const lastEntry = this.entries[this.entries.length - 1];
        if (areActionsSimilar(lastEntry.metadata, fullMetadata)) {
          // Update the last entry instead of creating new one
          lastEntry.elements = cloneElements(elements);
          lastEntry.metadata = fullMetadata;
          this.persist();
          this.notifyListeners();
          return { success: true, entry: lastEntry };
        }
      }

      // Create new entry
      const entry: HistoryEntry = {
        id: generateId(),
        elements: cloneElements(elements),
        metadata: fullMetadata,
        isCheckpoint: false,
        isAutoSave: false,
        branchId: this.currentBranchId,
        parentId: this.getCurrentEntry()?.id || null,
        compressed: false,
      };

      this.entries.push(entry);
      this.currentEntryIndex = this.entries.length - 1;

      // Update branch head
      this.updateBranchHead(this.currentBranchId, entry.id);

      // Enforce max history size
      this.enforceHistoryLimit();

      // Apply compression periodically
      if (this.config.compressionEnabled && this.entries.length % this.config.compressionThreshold === 0) {
        this.compressHistory();
      }

      // Persist
      this.persist();
      this.notifyListeners();

      return { success: true, entry };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Undo - go back one state
   */
  undo(): HistoryOperationResult {
    if (!this.canUndo()) {
      return { success: false, error: 'Nothing to undo' };
    }

    const fromEntry = this.getCurrentEntry();
    this.currentEntryIndex--;
    const toEntry = this.getCurrentEntry();

    this.persist();
    this.notifyListeners();

    return {
      success: true,
      entry: toEntry || undefined,
      diff: fromEntry && toEntry
        ? this.diffEngine.compare(fromEntry.elements, toEntry.elements)
        : undefined,
    };
  }

  /**
   * Redo - go forward one state
   */
  redo(): HistoryOperationResult {
    if (!this.canRedo()) {
      return { success: false, error: 'Nothing to redo' };
    }

    const fromEntry = this.getCurrentEntry();
    this.currentEntryIndex++;
    const toEntry = this.getCurrentEntry();

    this.persist();
    this.notifyListeners();

    return {
      success: true,
      entry: toEntry || undefined,
      diff: fromEntry && toEntry
        ? this.diffEngine.compare(fromEntry.elements, toEntry.elements)
        : undefined,
    };
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean {
    return this.currentEntryIndex > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean {
    return this.currentEntryIndex < this.entries.length - 1;
  }

  /**
   * Jump to a specific state by index
   */
  jumpToState(index: number): HistoryOperationResult {
    if (index < 0 || index >= this.entries.length) {
      return { success: false, error: 'Invalid index' };
    }

    const fromEntry = this.getCurrentEntry();
    this.currentEntryIndex = index;
    const toEntry = this.getCurrentEntry();

    this.persist();
    this.notifyListeners();

    return {
      success: true,
      entry: toEntry || undefined,
      diff: fromEntry && toEntry
        ? this.diffEngine.compare(fromEntry.elements, toEntry.elements)
        : undefined,
    };
  }

  /**
   * Jump to a specific entry by ID
   */
  jumpToEntry(entryId: string): HistoryOperationResult {
    const index = this.entries.findIndex((e) => e.id === entryId);
    if (index === -1) {
      return { success: false, error: 'Entry not found' };
    }
    return this.jumpToState(index);
  }

  // ============================================================================
  // CHECKPOINTS AND SNAPSHOTS
  // ============================================================================

  /**
   * Create a named checkpoint at current state
   */
  createCheckpoint(name: string, description?: string): HistoryOperationResult {
    const currentEntry = this.getCurrentEntry();
    if (!currentEntry) {
      return { success: false, error: 'No current state to checkpoint' };
    }

    // Create checkpoint entry
    const entry: HistoryEntry = {
      id: generateId(),
      elements: cloneElements(currentEntry.elements),
      metadata: {
        type: 'checkpoint',
        description: description || `Checkpoint: ${name}`,
        timestamp: Date.now(),
        sessionId: this.sessionId,
      },
      checkpointName: name,
      isCheckpoint: true,
      isAutoSave: false,
      branchId: this.currentBranchId,
      parentId: currentEntry.id,
      compressed: false,
      tags: ['checkpoint'],
    };

    this.entries.push(entry);
    this.currentEntryIndex = this.entries.length - 1;
    this.updateBranchHead(this.currentBranchId, entry.id);

    this.persist();
    this.notifyListeners();

    return { success: true, entry };
  }

  /**
   * Get all checkpoints
   */
  getCheckpoints(): HistoryEntry[] {
    return this.entries.filter((e) => e.isCheckpoint);
  }

  /**
   * Get checkpoints for specific branch
   */
  getBranchCheckpoints(branchId?: string): HistoryEntry[] {
    const targetBranchId = branchId || this.currentBranchId;
    return this.entries.filter((e) => e.isCheckpoint && e.branchId === targetBranchId);
  }

  /**
   * Restore to a checkpoint by name
   */
  restoreCheckpoint(name: string): HistoryOperationResult {
    const checkpoint = this.entries.find((e) => e.isCheckpoint && e.checkpointName === name);
    if (!checkpoint) {
      return { success: false, error: `Checkpoint "${name}" not found` };
    }

    const index = this.entries.indexOf(checkpoint);
    return this.jumpToState(index);
  }

  /**
   * Delete a checkpoint
   */
  deleteCheckpoint(name: string): HistoryOperationResult {
    const index = this.entries.findIndex((e) => e.isCheckpoint && e.checkpointName === name);
    if (index === -1) {
      return { success: false, error: `Checkpoint "${name}" not found` };
    }

    // Don't delete if it's the current entry
    if (index === this.currentEntryIndex) {
      return { success: false, error: 'Cannot delete current checkpoint' };
    }

    this.entries.splice(index, 1);
    if (index <= this.currentEntryIndex) {
      this.currentEntryIndex--;
    }

    this.persist();
    this.notifyListeners();

    return { success: true };
  }

  // ============================================================================
  // AUTO-SAVE
  // ============================================================================

  /**
   * Start auto-save timer
   */
  private startAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(() => {
      this.createAutoSave();
    }, this.config.autoSaveInterval);
  }

  /**
   * Stop auto-save timer
   */
  private stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * Create an auto-save checkpoint
   */
  private createAutoSave(): void {
    const currentEntry = this.getCurrentEntry();
    if (!currentEntry) return;

    // Don't auto-save if already at an auto-save or nothing changed
    if (currentEntry.isAutoSave) return;

    const entry: HistoryEntry = {
      id: generateId(),
      elements: cloneElements(currentEntry.elements),
      metadata: {
        type: 'checkpoint',
        description: 'Auto-save',
        timestamp: Date.now(),
        sessionId: this.sessionId,
      },
      checkpointName: `Auto-save ${new Date().toLocaleTimeString()}`,
      isCheckpoint: false,
      isAutoSave: true,
      branchId: this.currentBranchId,
      parentId: currentEntry.id,
      compressed: false,
      tags: ['auto-save'],
    };

    this.entries.push(entry);
    // Don't update currentEntryIndex for auto-saves

    this.persist();
  }

  /**
   * Toggle auto-save
   */
  setAutoSave(enabled: boolean): void {
    this.config.autoSaveEnabled = enabled;
    if (enabled) {
      this.startAutoSave();
    } else {
      this.stopAutoSave();
    }
  }

  // ============================================================================
  // BRANCHING
  // ============================================================================

  /**
   * Create a new branch from current state
   */
  createBranch(name: string, description?: string): HistoryOperationResult {
    const currentEntry = this.getCurrentEntry();
    if (!currentEntry) {
      return { success: false, error: 'No current state to branch from' };
    }

    // Check for duplicate branch name
    if (this.branches.some((b) => b.name === name)) {
      return { success: false, error: `Branch "${name}" already exists` };
    }

    const branchId = generateId();
    const branch: HistoryBranch = {
      id: branchId,
      name,
      description,
      createdAt: Date.now(),
      createdFromEntryId: currentEntry.id,
      headEntryId: currentEntry.id,
      isMain: false,
      color: this.generateBranchColor(),
    };

    this.branches.push(branch);

    // Create branch point entry
    const entry: HistoryEntry = {
      id: generateId(),
      elements: cloneElements(currentEntry.elements),
      metadata: {
        type: 'branch_create',
        description: `Created branch: ${name}`,
        timestamp: Date.now(),
        sessionId: this.sessionId,
      },
      isCheckpoint: false,
      isAutoSave: false,
      branchId: branchId,
      parentId: currentEntry.id,
      compressed: false,
      tags: ['branch-point'],
    };

    this.entries.push(entry);
    this.currentBranchId = branchId;
    this.currentEntryIndex = this.entries.length - 1;
    this.updateBranchHead(branchId, entry.id);

    this.persist();
    this.notifyListeners();

    return { success: true, entry };
  }

  /**
   * Switch to a different branch
   */
  switchBranch(branchId: string): HistoryOperationResult {
    const branch = this.branches.find((b) => b.id === branchId);
    if (!branch) {
      return { success: false, error: 'Branch not found' };
    }

    // Find the head entry of the branch
    const headEntry = this.entries.find((e) => e.id === branch.headEntryId);
    if (!headEntry) {
      return { success: false, error: 'Branch head not found' };
    }

    const headIndex = this.entries.indexOf(headEntry);
    this.currentBranchId = branchId;
    this.currentEntryIndex = headIndex;

    this.persist();
    this.notifyListeners();

    return { success: true, entry: headEntry };
  }

  /**
   * Delete a branch (not main)
   */
  deleteBranch(branchId: string): HistoryOperationResult {
    const branch = this.branches.find((b) => b.id === branchId);
    if (!branch) {
      return { success: false, error: 'Branch not found' };
    }

    if (branch.isMain) {
      return { success: false, error: 'Cannot delete main branch' };
    }

    if (this.currentBranchId === branchId) {
      return { success: false, error: 'Cannot delete current branch' };
    }

    // Remove branch entries (optional - could keep for history)
    this.entries = this.entries.filter((e) => e.branchId !== branchId);
    this.branches = this.branches.filter((b) => b.id !== branchId);

    // Adjust current index if needed
    if (this.currentEntryIndex >= this.entries.length) {
      this.currentEntryIndex = this.entries.length - 1;
    }

    this.persist();
    this.notifyListeners();

    return { success: true };
  }

  /**
   * Merge a branch into main
   */
  mergeBranch(sourceBranchId: string, targetBranchId: string = 'main'): HistoryOperationResult {
    const sourceBranch = this.branches.find((b) => b.id === sourceBranchId);
    const targetBranch = this.branches.find((b) => b.id === targetBranchId);

    if (!sourceBranch || !targetBranch) {
      return { success: false, error: 'Branch not found' };
    }

    const sourceHead = this.entries.find((e) => e.id === sourceBranch.headEntryId);
    const targetHead = this.entries.find((e) => e.id === targetBranch.headEntryId);

    if (!sourceHead || !targetHead) {
      return { success: false, error: 'Branch heads not found' };
    }

    // Create merge entry in target branch
    const entry: HistoryEntry = {
      id: generateId(),
      elements: cloneElements(sourceHead.elements),
      metadata: {
        type: 'branch_merge',
        description: `Merged ${sourceBranch.name} into ${targetBranch.name}`,
        timestamp: Date.now(),
        sessionId: this.sessionId,
      },
      isCheckpoint: false,
      isAutoSave: false,
      branchId: targetBranchId,
      parentId: targetHead.id,
      compressed: false,
      tags: ['merge'],
    };

    this.entries.push(entry);
    this.updateBranchHead(targetBranchId, entry.id);
    this.currentBranchId = targetBranchId;
    this.currentEntryIndex = this.entries.length - 1;

    this.persist();
    this.notifyListeners();

    return { success: true, entry };
  }

  /**
   * Get all branches
   */
  getBranches(): HistoryBranch[] {
    return [...this.branches];
  }

  /**
   * Get current branch
   */
  getCurrentBranch(): HistoryBranch | null {
    return this.branches.find((b) => b.id === this.currentBranchId) || null;
  }

  /**
   * Update branch head pointer
   */
  private updateBranchHead(branchId: string, entryId: string): void {
    const branch = this.branches.find((b) => b.id === branchId);
    if (branch) {
      branch.headEntryId = entryId;
    }
  }

  /**
   * Generate a color for new branch
   */
  private generateBranchColor(): string {
    const colors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
    return colors[this.branches.length % colors.length];
  }

  // ============================================================================
  // ACTION GROUPING (BATCH CHANGES)
  // ============================================================================

  /**
   * Begin grouping actions
   */
  beginGroup(name: string): void {
    if (this.activeGroup) {
      this.endGroup(); // End any existing group
    }

    this.activeGroup = {
      id: generateId(),
      name,
      actions: [],
      startTime: Date.now(),
      isActive: true,
    };
    this.groupedActions = [];
  }

  /**
   * End grouping and commit as single action
   */
  endGroup(): HistoryOperationResult {
    if (!this.activeGroup) {
      return { success: false, error: 'No active group' };
    }

    this.activeGroup.endTime = Date.now();
    this.activeGroup.isActive = false;
    this.activeGroup.actions = [...this.groupedActions];

    const currentEntry = this.getCurrentEntry();
    if (currentEntry && this.groupedActions.length > 0) {
      // Mark the current entry as a batch
      currentEntry.metadata.type = 'batch_update';
      currentEntry.metadata.description = `${this.activeGroup.name} (${this.groupedActions.length} changes)`;
      currentEntry.metadata.affectedElements = [
        ...new Set(this.groupedActions.map((a) => a.elementId).filter(Boolean) as string[]),
      ];
    }

    this.activeGroup = null;
    this.groupedActions = [];

    this.persist();
    this.notifyListeners();

    return { success: true, entry: currentEntry || undefined };
  }

  /**
   * Cancel current group
   */
  cancelGroup(): void {
    this.activeGroup = null;
    this.groupedActions = [];
  }

  /**
   * Check if grouping is active
   */
  isGrouping(): boolean {
    return this.activeGroup !== null;
  }

  // ============================================================================
  // DIFF AND COMPARISON
  // ============================================================================

  /**
   * Get diff between two states
   */
  getDiff(fromIndex: number, toIndex: number): DiffResult | null {
    const fromEntry = this.getEntry(fromIndex);
    const toEntry = this.getEntry(toIndex);

    if (!fromEntry || !toEntry) {
      return null;
    }

    return this.diffEngine.compare(fromEntry.elements, toEntry.elements);
  }

  /**
   * Get diff between two entries by ID
   */
  getDiffByIds(fromId: string, toId: string): DiffResult | null {
    const fromEntry = this.getEntryById(fromId);
    const toEntry = this.getEntryById(toId);

    if (!fromEntry || !toEntry) {
      return null;
    }

    return this.diffEngine.compare(fromEntry.elements, toEntry.elements);
  }

  /**
   * Get changes since a specific state
   */
  getChangesSince(index: number): DiffResult | null {
    const currentEntry = this.getCurrentEntry();
    const sinceEntry = this.getEntry(index);

    if (!currentEntry || !sinceEntry) {
      return null;
    }

    return this.diffEngine.compare(sinceEntry.elements, currentEntry.elements);
  }

  // ============================================================================
  // HISTORY COMPRESSION
  // ============================================================================

  /**
   * Compress history by merging similar consecutive actions
   */
  private compressHistory(): void {
    if (!this.config.compressionEnabled || this.entries.length < 3) {
      return;
    }

    const compressed: HistoryEntry[] = [];
    let i = 0;

    while (i < this.entries.length) {
      const entry = this.entries[i];

      // Never compress checkpoints or the current entry
      if (entry.isCheckpoint || i === this.currentEntryIndex) {
        compressed.push(entry);
        i++;
        continue;
      }

      // Look ahead for similar actions
      let j = i + 1;
      const similarEntries: HistoryEntry[] = [entry];

      while (
        j < this.entries.length &&
        j !== this.currentEntryIndex &&
        !this.entries[j].isCheckpoint &&
        areActionsSimilar(entry.metadata, this.entries[j].metadata)
      ) {
        similarEntries.push(this.entries[j]);
        j++;
      }

      if (similarEntries.length > 1) {
        // Compress into single entry using the last state
        const compressedEntry: HistoryEntry = {
          ...similarEntries[similarEntries.length - 1],
          id: generateId(),
          compressed: true,
          compressedFrom: similarEntries.map((e) => e.id),
          metadata: {
            ...similarEntries[similarEntries.length - 1].metadata,
            description: `${entry.metadata.description} (${similarEntries.length} changes)`,
          },
        };
        compressed.push(compressedEntry);
      } else {
        compressed.push(entry);
      }

      i = j;
    }

    // Update entries and fix current index
    const currentEntry = this.getCurrentEntry();
    this.entries = compressed;

    if (currentEntry) {
      const newIndex = this.entries.findIndex(
        (e) => e.id === currentEntry.id || e.compressedFrom?.includes(currentEntry.id)
      );
      this.currentEntryIndex = newIndex >= 0 ? newIndex : this.entries.length - 1;
    }
  }

  /**
   * Enforce maximum history size
   */
  private enforceHistoryLimit(): void {
    if (this.entries.length <= this.config.maxHistorySize) {
      return;
    }

    // Calculate how many to remove
    const toRemove = this.entries.length - this.config.maxHistorySize;

    // Remove oldest non-checkpoint entries
    let removed = 0;
    this.entries = this.entries.filter((entry, index) => {
      // Keep checkpoints, current entry, and branch points
      if (
        entry.isCheckpoint ||
        index === this.currentEntryIndex ||
        entry.metadata.type === 'branch_create'
      ) {
        return true;
      }

      if (removed < toRemove) {
        removed++;
        // Adjust current index
        if (index < this.currentEntryIndex) {
          this.currentEntryIndex--;
        }
        return false;
      }

      return true;
    });
  }

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  /**
   * Persist state to storage
   */
  private async persist(): Promise<void> {
    if (!this.config.persistenceEnabled) {
      return;
    }

    const state: HistorySystemState = this.getState();

    try {
      if (this.config.useIndexedDB && typeof indexedDB !== 'undefined') {
        await saveToIndexedDB(this.config.persistenceKey, state);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.config.persistenceKey, JSON.stringify(state));
      }
    } catch (error) {
      console.error('Failed to persist history:', error);
    }
  }

  /**
   * Load state from storage
   */
  async load(): Promise<HistoryOperationResult> {
    if (!this.config.persistenceEnabled) {
      return { success: false, error: 'Persistence disabled' };
    }

    try {
      let state: HistorySystemState | null = null;

      if (this.config.useIndexedDB && typeof indexedDB !== 'undefined') {
        state = await loadFromIndexedDB<HistorySystemState>(this.config.persistenceKey);
      } else if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(this.config.persistenceKey);
        if (stored) {
          state = JSON.parse(stored);
        }
      }

      if (state) {
        this.entries = state.entries;
        this.branches = state.branches.length > 0 ? state.branches : this.branches;
        this.currentEntryIndex = state.currentEntryIndex;
        this.currentBranchId = state.currentBranchId;
        this.config = { ...this.config, ...state.config };

        this.notifyListeners();
        return { success: true, entry: this.getCurrentEntry() || undefined };
      }

      return { success: false, error: 'No stored history found' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load history',
      };
    }
  }

  /**
   * Clear persisted state
   */
  async clearPersisted(): Promise<void> {
    try {
      if (this.config.useIndexedDB && typeof indexedDB !== 'undefined') {
        await clearIndexedDB(this.config.persistenceKey);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.config.persistenceKey);
      }
    } catch (error) {
      console.error('Failed to clear persisted history:', error);
    }
  }

  // ============================================================================
  // EXPORT AND IMPORT
  // ============================================================================

  /**
   * Export history to JSON
   */
  exportHistory(): string {
    const state = this.getState();
    return JSON.stringify(state, null, 2);
  }

  /**
   * Import history from JSON
   */
  importHistory(json: string): HistoryOperationResult {
    try {
      const state: HistorySystemState = JSON.parse(json);

      // Validate structure
      if (!Array.isArray(state.entries) || !Array.isArray(state.branches)) {
        return { success: false, error: 'Invalid history format' };
      }

      this.entries = state.entries;
      this.branches = state.branches;
      this.currentEntryIndex = state.currentEntryIndex;
      this.currentBranchId = state.currentBranchId;

      this.persist();
      this.notifyListeners();

      return { success: true, entry: this.getCurrentEntry() || undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to import history',
      };
    }
  }

  // ============================================================================
  // SEARCH
  // ============================================================================

  /**
   * Search history entries
   */
  search(query: string): HistoryEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.entries.filter((entry) => {
      return (
        entry.metadata.description.toLowerCase().includes(lowerQuery) ||
        entry.checkpointName?.toLowerCase().includes(lowerQuery) ||
        entry.metadata.elementName?.toLowerCase().includes(lowerQuery) ||
        entry.metadata.elementType?.toLowerCase().includes(lowerQuery) ||
        entry.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  }

  /**
   * Filter entries by type
   */
  filterByType(type: ActionType): HistoryEntry[] {
    return this.entries.filter((entry) => entry.metadata.type === type);
  }

  /**
   * Filter entries by date range
   */
  filterByDateRange(startDate: Date, endDate: Date): HistoryEntry[] {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    return this.entries.filter((entry) => {
      const timestamp = entry.metadata.timestamp;
      return timestamp >= startTime && timestamp <= endTime;
    });
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  /**
   * Clear all history
   */
  clearHistory(): void {
    this.entries = [];
    this.branches = [
      {
        id: 'main',
        name: 'Main',
        description: 'Main branch',
        createdAt: Date.now(),
        createdFromEntryId: '',
        headEntryId: '',
        isMain: true,
        color: '#3B82F6',
      },
    ];
    this.currentEntryIndex = -1;
    this.currentBranchId = 'main';

    this.persist();
    this.notifyListeners();
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopAutoSave();
    this.listeners.clear();
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================

  /**
   * Get history statistics
   */
  getStatistics(): {
    totalEntries: number;
    checkpoints: number;
    branches: number;
    compressedEntries: number;
    autoSaves: number;
    oldestEntry: Date | null;
    newestEntry: Date | null;
    actionBreakdown: Record<ActionType, number>;
  } {
    const actionBreakdown = {} as Record<ActionType, number>;
    let compressedCount = 0;
    let autoSaveCount = 0;
    let checkpointCount = 0;

    this.entries.forEach((entry) => {
      const type = entry.metadata.type;
      actionBreakdown[type] = (actionBreakdown[type] || 0) + 1;

      if (entry.compressed) compressedCount++;
      if (entry.isAutoSave) autoSaveCount++;
      if (entry.isCheckpoint) checkpointCount++;
    });

    const timestamps = this.entries.map((e) => e.metadata.timestamp);
    const oldestTimestamp = timestamps.length > 0 ? Math.min(...timestamps) : null;
    const newestTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : null;

    return {
      totalEntries: this.entries.length,
      checkpoints: checkpointCount,
      branches: this.branches.length,
      compressedEntries: compressedCount,
      autoSaves: autoSaveCount,
      oldestEntry: oldestTimestamp ? new Date(oldestTimestamp) : null,
      newestEntry: newestTimestamp ? new Date(newestTimestamp) : null,
      actionBreakdown,
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let historySystemInstance: HistorySystem | null = null;

/**
 * Get or create the singleton HistorySystem instance
 */
export function getHistorySystem(config?: Partial<HistoryConfig>): HistorySystem {
  if (!historySystemInstance) {
    historySystemInstance = new HistorySystem(config);
  }
  return historySystemInstance;
}

/**
 * Reset the history system instance (useful for testing)
 */
export function resetHistorySystem(): void {
  if (historySystemInstance) {
    historySystemInstance.destroy();
    historySystemInstance = null;
  }
}

export default HistorySystem;
