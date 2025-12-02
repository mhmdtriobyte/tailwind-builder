'use client';

import { ReactNode, forwardRef } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/utils/cn';

/**
 * Tooltip Provider - wrap your app with this to enable tooltips
 * Should be placed near the root of your application
 */
export function TooltipProvider({
  children,
  delayDuration = 300,
  skipDelayDuration = 100,
}: {
  children: ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
}) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
    >
      {children}
    </TooltipPrimitive.Provider>
  );
}

/**
 * Tooltip component props
 */
interface TooltipProps {
  /** Content to display in the tooltip */
  content: ReactNode;
  /** Element that triggers the tooltip */
  children: ReactNode;
  /** Side of the trigger to show tooltip */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Alignment of tooltip relative to trigger */
  align?: 'start' | 'center' | 'end';
  /** Offset from the trigger in pixels */
  sideOffset?: number;
  /** Delay before showing tooltip in ms */
  delayDuration?: number;
  /** Skip delay when moving between tooltips */
  skipDelayDuration?: number;
  /** Whether tooltip is disabled */
  disabled?: boolean;
  /** Additional className for tooltip content */
  className?: string;
  /** Whether tooltip should be open by default */
  defaultOpen?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Arrow size in pixels */
  arrowSize?: number;
  /** Whether to show arrow */
  showArrow?: boolean;
}

/**
 * Reusable Tooltip component using Radix Tooltip
 *
 * Features:
 * - Simple API: <Tooltip content="text"><button/></Tooltip>
 * - Dark theme styling
 * - Customizable position and alignment
 * - Accessible with keyboard support
 * - Smooth animations
 *
 * @example
 * ```tsx
 * <Tooltip content="Click to save">
 *   <button>Save</button>
 * </Tooltip>
 *
 * <Tooltip content="Settings" side="right">
 *   <IconButton icon={Settings} />
 * </Tooltip>
 * ```
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  sideOffset = 6,
  delayDuration,
  disabled = false,
  className,
  defaultOpen,
  open,
  onOpenChange,
  arrowSize = 8,
  showArrow = true,
}: TooltipProps) {
  // Don't render tooltip if disabled or no content
  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <TooltipPrimitive.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>

      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            'z-50 px-3 py-1.5 text-sm font-medium',
            'bg-gray-800 text-gray-100 rounded-md shadow-lg',
            'border border-gray-700',
            'select-none',
            // Animations
            'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',
            'data-[side=top]:slide-in-from-bottom-2',
            className
          )}
        >
          {content}
          {showArrow && (
            <TooltipPrimitive.Arrow
              className="fill-gray-800"
              width={arrowSize}
              height={arrowSize / 2}
            />
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

/**
 * Simple tooltip trigger for custom implementations
 */
export const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Tooltip content for custom implementations
 */
export const TooltipContent = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 px-3 py-1.5 text-sm font-medium',
      'bg-gray-800 text-gray-100 rounded-md shadow-lg',
      'border border-gray-700',
      'select-none',
      'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));

TooltipContent.displayName = 'TooltipContent';

/**
 * Shorthand tooltip for icon buttons - wraps children and shows tooltip on hover
 */
interface IconTooltipProps {
  /** Tooltip label text */
  label: string;
  /** Icon button or element */
  children: ReactNode;
  /** Keyboard shortcut to display (optional) */
  shortcut?: string;
  /** Side to display tooltip */
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function IconTooltip({
  label,
  children,
  shortcut,
  side = 'bottom',
}: IconTooltipProps) {
  const content = shortcut ? (
    <span className="flex items-center gap-2">
      <span>{label}</span>
      <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
        {shortcut}
      </kbd>
    </span>
  ) : (
    label
  );

  return (
    <Tooltip content={content} side={side} sideOffset={8}>
      {children}
    </Tooltip>
  );
}
