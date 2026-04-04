'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Wand2,
  Minimize2,
  PlayCircle,
  AlertCircle,
  Code2,
  Paintbrush,
  Variable,
  Sparkles,
} from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { useBuilderStore } from '@/store/builderStore';
import { cn } from '@/utils/cn';
import { copyToClipboard } from '@/utils/export';
import {
  validateCSS,
  formatCSS,
  minifyCSS,
  autoFixCSS,
  CSS_PROPERTIES,
  getPropertyValues,
  extractCustomProperties,
  type CSSError,
} from '@/lib/cssParser';
import { generateCSS } from '@/lib/cssGenerator';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES
// ============================================================================

interface AutocompleteItem {
  value: string;
  type: 'property' | 'value';
  description?: string;
}

interface EditorPosition {
  line: number;
  column: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CSS_PROPERTY_LIST = Object.keys(CSS_PROPERTIES).sort();


// ============================================================================
// COMPONENT
// ============================================================================

interface CSSEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CSSEditor({ isOpen, onClose }: CSSEditorProps) {
  const { elements, selectedId, getElementById } = useBuilderStore();

  // State
  const [cssContent, setCssContent] = useState('');
  const [errors, setErrors] = useState<CSSError[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'computed' | 'variables'>('editor');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState<AutocompleteItem[]>([]);
  const [autocompleteIndex, setAutocompleteIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState<EditorPosition>({ line: 1, column: 1 });
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Get selected element
  const selectedElement = selectedId ? getElementById(selectedId) : null;

  // Generate CSS for the current elements
  const generatedCSS = useMemo(() => {
    if (elements.length === 0) return '';
    try {
      const result = generateCSS(elements, {
        minify: false,
        includeComments: true,
      });
      return result.css;
    } catch {
      return '/* Error generating CSS */';
    }
  }, [elements]);

  // Extract computed styles for selected element
  const computedStyles = useMemo(() => {
    if (!selectedElement) return {};

    const styles = selectedElement.styles;
    const allClasses = [
      ...styles.layout,
      ...styles.spacing,
      ...styles.typography,
      ...styles.colors,
      ...styles.borders,
      ...styles.effects,
    ];

    // Convert Tailwind classes to a simplified view
    const computed: Record<string, string> = {};

    allClasses.forEach((cls) => {
      // Basic mapping for display purposes
      if (cls.startsWith('flex')) computed['display'] = 'flex';
      if (cls.startsWith('grid')) computed['display'] = 'grid';
      if (cls.startsWith('block')) computed['display'] = 'block';
      if (cls.startsWith('hidden')) computed['display'] = 'none';

      if (cls.startsWith('p-')) computed['padding'] = cls.replace('p-', '') + ' units';
      if (cls.startsWith('m-')) computed['margin'] = cls.replace('m-', '') + ' units';

      if (cls.startsWith('text-')) {
        if (cls.includes('-')) {
          const parts = cls.split('-');
          if (['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].includes(parts[1])) {
            computed['font-size'] = parts[1];
          } else {
            computed['color'] = parts.slice(1).join('-');
          }
        }
      }

      if (cls.startsWith('bg-')) computed['background'] = cls.replace('bg-', '');
      if (cls.startsWith('rounded')) computed['border-radius'] = cls;
      if (cls.startsWith('shadow')) computed['box-shadow'] = cls;
      if (cls.startsWith('w-')) computed['width'] = cls.replace('w-', '');
      if (cls.startsWith('h-')) computed['height'] = cls.replace('h-', '');
    });

    return computed;
  }, [selectedElement]);

  // Extract CSS custom properties
  const cssVariables = useMemo(() => {
    return extractCustomProperties(cssContent);
  }, [cssContent]);

  // Initialize CSS content
  useEffect(() => {
    if (isOpen && !cssContent) {
      setCssContent(generatedCSS);
    }
  }, [isOpen, generatedCSS, cssContent]);

  // Validate CSS on change
  useEffect(() => {
    const validationErrors = validateCSS(cssContent);
    setErrors(validationErrors);
  }, [cssContent]);

  // Handle textarea input
  const handleCSSChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCssContent(value);

    // Update cursor position
    const lines = value.substring(0, e.target.selectionStart).split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    });

    // Check for autocomplete trigger
    const lastLine = lines[lines.length - 1];
    const beforeCursor = lastLine.trim();

    if (beforeCursor.endsWith(':')) {
      // Show value suggestions
      const property = beforeCursor.slice(0, -1).trim().split(/\s+/).pop() || '';
      const values = getPropertyValues(property);
      if (values.length > 0) {
        setAutocompleteItems(values.map((v) => ({ value: v, type: 'value' })));
        setShowAutocomplete(true);
        setAutocompleteIndex(0);
      }
    } else if (/^[a-z-]*$/.test(beforeCursor) && beforeCursor.length >= 2) {
      // Show property suggestions
      const matches = CSS_PROPERTY_LIST.filter((p) =>
        p.toLowerCase().startsWith(beforeCursor.toLowerCase())
      ).slice(0, 10);

      if (matches.length > 0) {
        setAutocompleteItems(matches.map((p) => ({ value: p, type: 'property' })));
        setShowAutocomplete(true);
        setAutocompleteIndex(0);
      } else {
        setShowAutocomplete(false);
      }
    } else {
      setShowAutocomplete(false);
    }
  }, []);

  // Handle autocomplete selection
  const handleAutocompleteSelect = useCallback(
    (item: AutocompleteItem) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const value = textarea.value;
      const cursorPos = textarea.selectionStart;

      // Find the start of the current word
      let wordStart = cursorPos;
      while (wordStart > 0 && /[a-z-:]/.test(value[wordStart - 1])) {
        wordStart--;
      }

      // Replace the word with the selected item
      const before = value.substring(0, wordStart);
      const after = value.substring(cursorPos);
      const insertion = item.type === 'property' ? `${item.value}: ` : item.value;
      const newValue = before + insertion + after;

      setCssContent(newValue);
      setShowAutocomplete(false);

      // Set cursor position after insertion
      setTimeout(() => {
        const newPos = wordStart + insertion.length;
        textarea.setSelectionRange(newPos, newPos);
        textarea.focus();
      }, 0);
    },
    []
  );

  // Handle keyboard navigation in autocomplete
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (showAutocomplete) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setAutocompleteIndex((prev) =>
            prev < autocompleteItems.length - 1 ? prev + 1 : 0
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setAutocompleteIndex((prev) =>
            prev > 0 ? prev - 1 : autocompleteItems.length - 1
          );
        } else if (e.key === 'Enter' || e.key === 'Tab') {
          e.preventDefault();
          if (autocompleteItems[autocompleteIndex]) {
            handleAutocompleteSelect(autocompleteItems[autocompleteIndex]);
          }
        } else if (e.key === 'Escape') {
          setShowAutocomplete(false);
        }
      }
    },
    [showAutocomplete, autocompleteItems, autocompleteIndex, handleAutocompleteSelect]
  );

  // Format CSS
  const handleFormat = useCallback(() => {
    try {
      const formatted = formatCSS(cssContent, { indentSize: 2 });
      setCssContent(formatted);
      toast.success('CSS formatted');
    } catch {
      toast.error('Failed to format CSS');
    }
  }, [cssContent]);

  // Minify CSS
  const handleMinify = useCallback(() => {
    try {
      const minified = minifyCSS(cssContent);
      setCssContent(minified);
      toast.success('CSS minified');
    } catch {
      toast.error('Failed to minify CSS');
    }
  }, [cssContent]);

  // Auto-fix CSS
  const handleAutoFix = useCallback(() => {
    try {
      const { fixed, changes } = autoFixCSS(cssContent);
      setCssContent(fixed);
      if (changes.length > 0) {
        toast.success(`Fixed ${changes.length} issue(s)`);
      } else {
        toast.success('No issues to fix');
      }
    } catch {
      toast.error('Failed to auto-fix CSS');
    }
  }, [cssContent]);

  // Copy CSS
  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(cssContent);
      setCopied(true);
      toast.success('CSS copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy CSS');
    }
  }, [cssContent]);

  // Apply CSS to selected element (basic implementation)
  const handleApply = useCallback(() => {
    if (!selectedElement) {
      toast.error('Select an element first');
      return;
    }

    // For now, show a message that the feature would apply styles
    toast.success('CSS would be applied to selected element');
  }, [selectedElement]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (showAutocomplete) {
          setShowAutocomplete(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showAutocomplete, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-14 bottom-0 w-[500px] bg-gray-900 border-l border-gray-800 flex flex-col z-50 shadow-2xl"
        role="dialog"
        aria-label="CSS Editor"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-white">CSS Editor</h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className={cn(
                'p-2 rounded transition-colors',
                copied
                  ? 'text-green-500 bg-green-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
              title="Copy CSS"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs.Root
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="flex-1 flex flex-col min-h-0"
        >
          <Tabs.List className="flex border-b border-gray-800 shrink-0">
            <Tabs.Trigger
              value="editor"
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
                'border-b-2 border-transparent',
                'data-[state=active]:text-white data-[state=active]:border-blue-500',
                'data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200'
              )}
            >
              <Code2 className="w-4 h-4" />
              Editor
            </Tabs.Trigger>
            <Tabs.Trigger
              value="computed"
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
                'border-b-2 border-transparent',
                'data-[state=active]:text-white data-[state=active]:border-blue-500',
                'data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200'
              )}
            >
              <Paintbrush className="w-4 h-4" />
              Computed
            </Tabs.Trigger>
            <Tabs.Trigger
              value="variables"
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
                'border-b-2 border-transparent',
                'data-[state=active]:text-white data-[state=active]:border-blue-500',
                'data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200'
              )}
            >
              <Variable className="w-4 h-4" />
              Variables
            </Tabs.Trigger>
          </Tabs.List>

          {/* Editor Tab */}
          <Tabs.Content value="editor" className="flex-1 flex flex-col min-h-0">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 shrink-0">
              <button
                onClick={handleFormat}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
                title="Format CSS"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Format
              </button>
              <button
                onClick={handleMinify}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
                title="Minify CSS"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                Minify
              </button>
              <button
                onClick={handleAutoFix}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
                title="Auto-fix issues"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-fix
              </button>

              <div className="flex-1" />

              <button
                onClick={handleApply}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                title="Apply to selected element"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                Apply
              </button>
            </div>

            {/* Editor area */}
            <div className="flex-1 relative overflow-hidden">
              {/* Line numbers */}
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-900 border-r border-gray-800 overflow-hidden pointer-events-none z-10">
                <div className="pt-4 px-2 text-right text-xs text-gray-600 font-mono select-none">
                  {cssContent.split('\n').map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'leading-6',
                        errors.some((e) => e.line === i + 1) && 'text-red-500'
                      )}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={cssContent}
                onChange={handleCSSChange}
                onKeyDown={handleKeyDown}
                className="w-full h-full pl-12 pr-4 py-4 bg-transparent text-sm font-mono text-gray-100 resize-none focus:outline-none leading-6"
                placeholder="/* Enter your CSS here */"
                spellCheck={false}
              />

              {/* Autocomplete popup */}
              {showAutocomplete && autocompleteItems.length > 0 && (
                <div
                  ref={autocompleteRef}
                  className="absolute bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-20"
                  style={{
                    top: `${cursorPosition.line * 24 + 48}px`,
                    left: `${cursorPosition.column * 8 + 48}px`,
                    maxWidth: '300px',
                  }}
                >
                  <div className="max-h-48 overflow-y-auto">
                    {autocompleteItems.map((item, index) => (
                      <button
                        key={item.value}
                        onClick={() => handleAutocompleteSelect(item)}
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                          index === autocompleteIndex
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700'
                        )}
                      >
                        <span
                          className={cn(
                            'w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold',
                            item.type === 'property'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-green-500/20 text-green-400'
                          )}
                        >
                          {item.type === 'property' ? 'P' : 'V'}
                        </span>
                        <span className="font-mono">{item.value}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error panel */}
            {errors.length > 0 && (
              <div className="shrink-0 max-h-32 overflow-y-auto border-t border-gray-800">
                <div className="px-4 py-2 bg-red-500/10">
                  <h4 className="flex items-center gap-2 text-xs font-medium text-red-400 mb-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.length} issue{errors.length > 1 ? 's' : ''} found
                  </h4>
                  <div className="space-y-1">
                    {errors.slice(0, 5).map((error, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-gray-500">
                          Line {error.line}:{error.column}
                        </span>
                        <span
                          className={cn(
                            error.type === 'error' ? 'text-red-400' : 'text-yellow-400'
                          )}
                        >
                          {error.message}
                        </span>
                      </div>
                    ))}
                    {errors.length > 5 && (
                      <div className="text-xs text-gray-500">
                        ... and {errors.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-800 text-xs text-gray-500 shrink-0">
              <span>
                Ln {cursorPosition.line}, Col {cursorPosition.column}
              </span>
              <span>{cssContent.split('\n').length} lines</span>
            </div>
          </Tabs.Content>

          {/* Computed Tab */}
          <Tabs.Content value="computed" className="flex-1 overflow-y-auto p-4">
            {selectedElement ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-white mb-1">
                    {selectedElement.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    ID: {selectedElement.id}
                  </p>
                </div>

                <div className="space-y-2">
                  {Object.entries(computedStyles).length > 0 ? (
                    Object.entries(computedStyles).map(([property, value]) => (
                      <div
                        key={property}
                        className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-lg"
                      >
                        <span className="text-sm text-gray-300 font-mono">
                          {property}
                        </span>
                        <span className="text-sm text-blue-400 font-mono">
                          {value}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No styles applied to this element
                    </p>
                  )}
                </div>

                {/* Tailwind classes */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">
                    Tailwind Classes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ...selectedElement.styles.layout,
                      ...selectedElement.styles.spacing,
                      ...selectedElement.styles.typography,
                      ...selectedElement.styles.colors,
                      ...selectedElement.styles.borders,
                      ...selectedElement.styles.effects,
                    ].map((cls, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs font-mono"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Paintbrush className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  Select an element to view computed styles
                </p>
              </div>
            )}
          </Tabs.Content>

          {/* Variables Tab */}
          <Tabs.Content value="variables" className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-white mb-1">
                CSS Custom Properties
              </h3>
              <p className="text-xs text-gray-500">
                Variables defined in your CSS
              </p>
            </div>

            <div className="space-y-2">
              {Object.entries(cssVariables).length > 0 ? (
                Object.entries(cssVariables).map(([name, value]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-lg"
                  >
                    <span className="text-sm text-purple-400 font-mono">
                      {name}
                    </span>
                    <span className="text-sm text-gray-300 font-mono truncate max-w-[200px]">
                      {value}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No CSS variables found. Add variables like --color-primary: #3b82f6;
                </p>
              )}
            </div>

            {/* Add variable button */}
            <div className="mt-4">
              <button
                onClick={() => {
                  const newContent = `:root {\n  --new-variable: value;\n}\n\n${cssContent}`;
                  setCssContent(newContent);
                  setActiveTab('editor');
                  toast.success('Variable template added');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
              >
                <Variable className="w-4 h-4" />
                Add Variable
              </button>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </>
  );
}

// ============================================================================
// CSS EDITOR TOGGLE BUTTON
// ============================================================================

export function CSSEditorButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-colors"
      >
        <Code2 className="w-4 h-4" />
        CSS
      </button>
      <CSSEditor isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
