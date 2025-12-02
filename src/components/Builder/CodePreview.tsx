'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { X, Copy, Download, Check, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { useBuilderStore } from '@/store/builderStore';
import { useCodeGenerator } from '@/hooks/useCodeGenerator';
import { copyToClipboard, exportToFile } from '@/utils/export';
import { cn } from '@/utils/cn';

const MIN_WIDTH = 320;
const MAX_WIDTH = 800;
const DEFAULT_WIDTH = 500;

export function CodePreview() {
  const { showCodePreview, toggleCodePreview, elements } = useBuilderStore();
  const { jsx, tsx } = useCodeGenerator(elements);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'jsx' | 'tsx'>('jsx');
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(activeTab === 'jsx' ? jsx : tsx);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [activeTab, jsx, tsx]);

  // Handle download
  const handleDownload = useCallback(() => {
    const code = activeTab === 'jsx' ? jsx : tsx;
    const filename = `GeneratedComponent.${activeTab}`;
    exportToFile(code, filename);
  }, [activeTab, jsx, tsx]);

  // Handle resize
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  // Resize effect
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      setWidth(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Toggle maximize
  const handleToggleMaximize = useCallback(() => {
    setIsMaximized((prev) => !prev);
    if (!isMaximized) {
      setWidth(MAX_WIDTH);
    } else {
      setWidth(DEFAULT_WIDTH);
    }
  }, [isMaximized]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showCodePreview) return;

      // Cmd/Ctrl + C to copy when panel is focused
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && document.activeElement === panelRef.current) {
        e.preventDefault();
        handleCopy();
      }

      // Escape to close
      if (e.key === 'Escape') {
        toggleCodePreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCodePreview, handleCopy, toggleCodePreview]);

  if (!showCodePreview) return null;

  const currentCode = activeTab === 'jsx' ? jsx : tsx;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={toggleCodePreview}
        aria-hidden="true"
      />

      {/* Main panel */}
      <div
        ref={panelRef}
        className={cn(
          'fixed right-0 top-14 bottom-0 bg-gray-900 border-l border-gray-800 flex flex-col z-50',
          'transition-transform duration-300 ease-in-out',
          isMaximized ? 'w-[800px]' : '',
        )}
        style={{ width: isMaximized ? MAX_WIDTH : width }}
        tabIndex={-1}
        role="region"
        aria-label="Code Preview Panel"
      >
        {/* Resize handle */}
        <div
          ref={resizeRef}
          className={cn(
            'absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize',
            'hover:bg-blue-500/50 transition-colors',
            isResizing && 'bg-blue-500',
          )}
          onMouseDown={handleResizeStart}
          aria-hidden="true"
        />

        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleCodePreview}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
              aria-label="Collapse panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-white font-medium text-sm">Generated Code</span>
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
              aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
              title={copied ? 'Copied!' : 'Copy to clipboard'}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
              aria-label="Download file"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleMaximize}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
              aria-label={isMaximized ? 'Minimize panel' : 'Maximize panel'}
              title={isMaximized ? 'Minimize' : 'Maximize'}
            >
              {isMaximized ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={toggleCodePreview}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
              aria-label="Close panel"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs.Root
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'jsx' | 'tsx')}
          className="flex-1 flex flex-col min-h-0"
        >
          <Tabs.List className="flex border-b border-gray-800 shrink-0">
            <Tabs.Trigger
              value="jsx"
              className={cn(
                'px-4 py-2.5 text-sm font-medium transition-colors',
                'border-b-2 border-transparent',
                'data-[state=active]:text-white data-[state=active]:border-blue-500',
                'data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200'
              )}
            >
              JSX
            </Tabs.Trigger>
            <Tabs.Trigger
              value="tsx"
              className={cn(
                'px-4 py-2.5 text-sm font-medium transition-colors',
                'border-b-2 border-transparent',
                'data-[state=active]:text-white data-[state=active]:border-blue-500',
                'data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200'
              )}
            >
              TSX
            </Tabs.Trigger>
          </Tabs.List>

          {/* Code content */}
          <div className="flex-1 overflow-hidden">
            <Tabs.Content value="jsx" className="h-full focus:outline-none">
              <CodeBlock code={jsx} language="jsx" />
            </Tabs.Content>
            <Tabs.Content value="tsx" className="h-full focus:outline-none">
              <CodeBlock code={tsx} language="tsx" />
            </Tabs.Content>
          </div>
        </Tabs.Root>

        {/* Footer with stats */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-800 text-xs text-gray-500 shrink-0">
          <span>{currentCode.split('\n').length} lines</span>
          <span>{new Blob([currentCode]).size} bytes</span>
        </div>
      </div>
    </>
  );
}

/**
 * Syntax highlighted code block component
 */
interface CodeBlockProps {
  code: string;
  language: string;
}

function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <Highlight theme={themes.vsDark} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            className,
            'p-4 text-sm overflow-auto h-full',
            'scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent'
          )}
          style={{
            ...style,
            backgroundColor: 'transparent',
            margin: 0,
          }}
        >
          <code className="block">
            {tokens.map((line, lineIndex) => {
              const lineProps = getLineProps({ line });
              return (
                <div
                  key={lineIndex}
                  {...lineProps}
                  className={cn(lineProps.className, 'table-row')}
                >
                  <span className="table-cell pr-4 text-gray-600 select-none text-right w-8">
                    {lineIndex + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token, tokenIndex) => {
                      const tokenProps = getTokenProps({ token });
                      return <span key={tokenIndex} {...tokenProps} />;
                    })}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      )}
    </Highlight>
  );
}

/**
 * Button to toggle code preview from elsewhere in the app
 */
export function CodePreviewToggle() {
  const { showCodePreview, toggleCodePreview } = useBuilderStore();

  return (
    <button
      onClick={toggleCodePreview}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors',
        showCodePreview
          ? 'bg-blue-600 text-white'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
      )}
      aria-pressed={showCodePreview}
    >
      {showCodePreview ? (
        <>
          <ChevronRight className="w-4 h-4" />
          <span>Hide Code</span>
        </>
      ) : (
        <>
          <ChevronLeft className="w-4 h-4" />
          <span>View Code</span>
        </>
      )}
    </button>
  );
}
