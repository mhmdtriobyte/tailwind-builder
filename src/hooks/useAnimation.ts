/**
 * useAnimation Hook
 *
 * Custom React hook for managing CSS animations on elements.
 * Provides animation control, chaining, scroll-triggered animations,
 * and integration with the animation system.
 *
 * Features:
 * - Apply animations to elements
 * - Control playback (play, pause, restart)
 * - Chain animations in sequence
 * - Scroll-triggered animations
 * - Intersection Observer integration
 * - Animation state management
 */

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import {
  type AnimationConfig,
  type AnimationDefinition,
  type AnimationSequence,
  type AnimationTrigger,
  ANIMATIONS,
  createDefaultAnimationConfig,
  generateAnimationCSS,
  generateCompleteCSS,
} from '@/lib/animationSystem';
import {
  type TransitionConfig,
  HOVER_TRANSITIONS,
  ACTIVE_TRANSITIONS,
  FOCUS_TRANSITIONS,
} from '@/lib/transitionSystem';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Animation state */
export interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  isFinished: boolean;
  currentIteration: number;
  progress: number;
  currentAnimation: string | null;
}

/** Animation event handlers */
export interface AnimationEventHandlers {
  onStart?: () => void;
  onEnd?: () => void;
  onIteration?: (iteration: number) => void;
  onCancel?: () => void;
}

/** Scroll animation options */
export interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  animateOnScrollUp?: boolean;
  animateOnScrollDown?: boolean;
}

/** Animation chain item */
export interface AnimationChainItem {
  animationId: string;
  config?: Partial<AnimationConfig>;
  delay?: number;
}

/** Hook return type */
export interface UseAnimationReturn {
  // Refs
  ref: React.RefObject<HTMLElement | null>;
  styleRef: React.RefObject<HTMLStyleElement | null>;

  // State
  state: AnimationState;
  isInView: boolean;

  // Control methods
  play: (animationId?: string, config?: Partial<AnimationConfig>) => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  stop: () => void;
  reset: () => void;

  // Chain methods
  playChain: (chain: AnimationChainItem[]) => Promise<void>;
  playSequence: (sequence: AnimationSequence) => Promise<void>;

  // CSS generation
  getAnimationStyles: () => string;
  getAnimationClass: () => string;
  getTailwindClasses: () => string[];

  // Utilities
  setTrigger: (trigger: AnimationTrigger) => void;
  getCurrentConfig: () => AnimationConfig | null;
}

/** Hook options */
export interface UseAnimationOptions {
  initialAnimation?: string;
  initialConfig?: Partial<AnimationConfig>;
  autoPlay?: boolean;
  trigger?: AnimationTrigger;
  scrollOptions?: ScrollAnimationOptions;
  eventHandlers?: AnimationEventHandlers;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * useAnimation - Main animation hook
 */
export function useAnimation(options: UseAnimationOptions = {}): UseAnimationReturn {
  const {
    initialAnimation,
    initialConfig,
    autoPlay = false,
    trigger = 'manual',
    scrollOptions = {},
    eventHandlers = {},
  } = options;

  // Refs
  const ref = useRef<HTMLElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const chainPromiseRef = useRef<{ resolve: () => void; reject: (error: Error) => void } | null>(null);

  // State
  const [state, setState] = useState<AnimationState>({
    isPlaying: false,
    isPaused: false,
    isFinished: false,
    currentIteration: 0,
    progress: 0,
    currentAnimation: initialAnimation || null,
  });

  const [isInView, setIsInView] = useState(false);
  const [currentTrigger, setCurrentTrigger] = useState<AnimationTrigger>(trigger);
  const [currentConfig, setCurrentConfig] = useState<AnimationConfig | null>(
    initialAnimation ? { ...createDefaultAnimationConfig(initialAnimation), ...initialConfig } : null
  );

  // Memoized animation definition (reserved for future animation features)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _animationDefinition = useMemo<AnimationDefinition | null>(() => {
    if (!state.currentAnimation) return null;
    return ANIMATIONS[state.currentAnimation] || null;
  }, [state.currentAnimation]);

  // -------------------------------------------------------------------------
  // Style injection
  // -------------------------------------------------------------------------

  const injectStyles = useCallback((css: string) => {
    if (!styleRef.current) {
      const style = document.createElement('style');
      style.setAttribute('data-animation-styles', 'true');
      document.head.appendChild(style);
      styleRef.current = style;
    }
    styleRef.current.textContent = css;
  }, []);

  const removeStyles = useCallback(() => {
    if (styleRef.current) {
      styleRef.current.remove();
      styleRef.current = null;
    }
  }, []);

  // -------------------------------------------------------------------------
  // Animation event handlers
  // -------------------------------------------------------------------------

  const handleAnimationStart = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      isFinished: false,
    }));
    eventHandlers.onStart?.();
  }, [eventHandlers]);

  const handleAnimationEnd = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      isFinished: true,
    }));
    eventHandlers.onEnd?.();

    // Resolve chain promise if exists
    if (chainPromiseRef.current) {
      chainPromiseRef.current.resolve();
      chainPromiseRef.current = null;
    }
  }, [eventHandlers]);

  const handleAnimationIteration = useCallback(() => {
    setState((prev) => {
      const newIteration = prev.currentIteration + 1;
      eventHandlers.onIteration?.(newIteration);
      return { ...prev, currentIteration: newIteration };
    });
  }, [eventHandlers]);

  const handleAnimationCancel = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
    }));
    eventHandlers.onCancel?.();

    // Reject chain promise if exists
    if (chainPromiseRef.current) {
      chainPromiseRef.current.reject(new Error('Animation cancelled'));
      chainPromiseRef.current = null;
    }
  }, [eventHandlers]);

  // -------------------------------------------------------------------------
  // Control methods
  // -------------------------------------------------------------------------

  const play = useCallback(
    (animationId?: string, config?: Partial<AnimationConfig>) => {
      const targetAnimation = animationId || state.currentAnimation;
      if (!targetAnimation || !ref.current) return;

      const animation = ANIMATIONS[targetAnimation];
      if (!animation) return;

      // Create full config
      const fullConfig: AnimationConfig = {
        ...createDefaultAnimationConfig(targetAnimation),
        ...config,
      };

      setCurrentConfig(fullConfig);
      setState((prev) => ({
        ...prev,
        currentAnimation: targetAnimation,
        isPlaying: true,
        isPaused: false,
        isFinished: false,
        currentIteration: 0,
        progress: 0,
      }));

      // Generate and inject CSS
      const { keyframes, inlineStyle } = generateCompleteCSS(fullConfig);
      injectStyles(keyframes);

      // Apply animation to element
      const element = ref.current;
      element.style.animation = 'none';

      // Force reflow
      void element.offsetHeight;

      // Apply new animation
      element.style.animation = inlineStyle.replace('animation: ', '');
    },
    [state.currentAnimation, injectStyles]
  );

  const pause = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.animationPlayState = 'paused';
    setState((prev) => ({ ...prev, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.animationPlayState = 'running';
    setState((prev) => ({ ...prev, isPaused: false }));
  }, []);

  const restart = useCallback(() => {
    if (!ref.current || !state.currentAnimation) return;
    const element = ref.current;

    // Reset animation
    element.style.animation = 'none';
    void element.offsetHeight;

    // Replay with current config
    if (currentConfig) {
      const animationValue = generateAnimationCSS(currentConfig);
      element.style.animation = animationValue;
    }

    setState((prev) => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      isFinished: false,
      currentIteration: 0,
      progress: 0,
    }));
  }, [state.currentAnimation, currentConfig]);

  const stop = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.animation = 'none';
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      isFinished: true,
    }));
    handleAnimationCancel();
  }, [handleAnimationCancel]);

  const reset = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.animation = 'none';
    ref.current.style.transform = '';
    ref.current.style.opacity = '';
    removeStyles();

    setState({
      isPlaying: false,
      isPaused: false,
      isFinished: false,
      currentIteration: 0,
      progress: 0,
      currentAnimation: null,
    });
    setCurrentConfig(null);
  }, [removeStyles]);

  // -------------------------------------------------------------------------
  // Chain methods
  // -------------------------------------------------------------------------

  const playChain = useCallback(
    async (chain: AnimationChainItem[]): Promise<void> => {
      for (let i = 0; i < chain.length; i++) {
        const item = chain[i];

        // Wait for delay if specified
        if (item.delay && item.delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, item.delay));
        }

        // Play animation and wait for completion
        await new Promise<void>((resolve, reject) => {
          chainPromiseRef.current = { resolve, reject };
          play(item.animationId, item.config);
        });
      }
    },
    [play]
  );

  const playSequence = useCallback(
    async (sequence: AnimationSequence): Promise<void> => {
      const sortedItems = [...sequence.items].sort((a, b) => a.startAt - b.startAt);

      // Track active animations
      const animationPromises: Promise<void>[] = [];
      let lastStartTime = 0;

      for (const item of sortedItems) {
        const delayFromLast = item.startAt - lastStartTime;

        if (delayFromLast > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayFromLast));
        }

        // Start animation (don't await - they run in parallel based on startAt)
        const animPromise = new Promise<void>((resolve) => {
          const animation = ANIMATIONS[item.animationId];
          if (animation) {
            const duration = item.config?.duration ?? animation.defaultDuration;
            setTimeout(resolve, duration);
          } else {
            resolve();
          }
          play(item.animationId, item.config);
        });

        animationPromises.push(animPromise);
        lastStartTime = item.startAt;
      }

      // Wait for all animations to complete
      await Promise.all(animationPromises);
    },
    [play]
  );

  // -------------------------------------------------------------------------
  // CSS generation methods
  // -------------------------------------------------------------------------

  const getAnimationStyles = useCallback((): string => {
    if (!currentConfig) return '';
    const { keyframes, className } = generateCompleteCSS(currentConfig);
    return `${keyframes}\n\n${className}`;
  }, [currentConfig]);

  const getAnimationClass = useCallback((): string => {
    if (!state.currentAnimation) return '';
    return `animate-${state.currentAnimation}`;
  }, [state.currentAnimation]);

  const getTailwindClasses = useCallback((): string[] => {
    if (!currentConfig) return [];
    const { tailwindClasses } = generateCompleteCSS(currentConfig);
    return tailwindClasses;
  }, [currentConfig]);

  // -------------------------------------------------------------------------
  // Utility methods
  // -------------------------------------------------------------------------

  const setTrigger = useCallback((newTrigger: AnimationTrigger) => {
    setCurrentTrigger(newTrigger);
  }, []);

  const getCurrentConfig = useCallback((): AnimationConfig | null => {
    return currentConfig;
  }, [currentConfig]);

  // -------------------------------------------------------------------------
  // Event listeners
  // -------------------------------------------------------------------------

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('animationstart', handleAnimationStart);
    element.addEventListener('animationend', handleAnimationEnd);
    element.addEventListener('animationiteration', handleAnimationIteration);
    element.addEventListener('animationcancel', handleAnimationCancel);

    return () => {
      element.removeEventListener('animationstart', handleAnimationStart);
      element.removeEventListener('animationend', handleAnimationEnd);
      element.removeEventListener('animationiteration', handleAnimationIteration);
      element.removeEventListener('animationcancel', handleAnimationCancel);
    };
  }, [handleAnimationStart, handleAnimationEnd, handleAnimationIteration, handleAnimationCancel]);

  // -------------------------------------------------------------------------
  // Trigger-based animation
  // -------------------------------------------------------------------------

  // Hover trigger
  useEffect(() => {
    if (currentTrigger !== 'hover' || !ref.current) return;

    const element = ref.current;

    const handleMouseEnter = () => {
      if (state.currentAnimation) {
        play(state.currentAnimation);
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    return () => element.removeEventListener('mouseenter', handleMouseEnter);
  }, [currentTrigger, state.currentAnimation, play]);

  // Click trigger
  useEffect(() => {
    if (currentTrigger !== 'click' || !ref.current) return;

    const element = ref.current;

    const handleClick = () => {
      if (state.currentAnimation) {
        play(state.currentAnimation);
      }
    };

    element.addEventListener('click', handleClick);
    return () => element.removeEventListener('click', handleClick);
  }, [currentTrigger, state.currentAnimation, play]);

  // Focus trigger
  useEffect(() => {
    if (currentTrigger !== 'focus' || !ref.current) return;

    const element = ref.current;

    const handleFocus = () => {
      if (state.currentAnimation) {
        play(state.currentAnimation);
      }
    };

    element.addEventListener('focus', handleFocus);
    return () => element.removeEventListener('focus', handleFocus);
  }, [currentTrigger, state.currentAnimation, play]);

  // Scroll trigger (Intersection Observer)
  useEffect(() => {
    if (currentTrigger !== 'scroll' || !ref.current) return;

    const element = ref.current;
    const {
      threshold = 0.1,
      rootMargin = '0px',
      triggerOnce = true,
    } = scrollOptions;

    let hasTriggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);

            if (!hasTriggered || !triggerOnce) {
              if (state.currentAnimation) {
                play(state.currentAnimation);
              }
              if (triggerOnce) {
                hasTriggered = true;
              }
            }
          } else {
            setIsInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [currentTrigger, scrollOptions, state.currentAnimation, play]);

  // Load trigger (auto-play on mount)
  useEffect(() => {
    if (currentTrigger === 'load' && autoPlay && state.currentAnimation) {
      play(state.currentAnimation);
    }
  }, [currentTrigger, autoPlay, state.currentAnimation, play]);

  // -------------------------------------------------------------------------
  // Cleanup
  // -------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      removeStyles();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [removeStyles]);

  // -------------------------------------------------------------------------
  // Return
  // -------------------------------------------------------------------------

  return {
    ref,
    styleRef,
    state,
    isInView,
    play,
    pause,
    resume,
    restart,
    stop,
    reset,
    playChain,
    playSequence,
    getAnimationStyles,
    getAnimationClass,
    getTailwindClasses,
    setTrigger,
    getCurrentConfig,
  };
}

// ============================================================================
// SCROLL ANIMATION HOOK
// ============================================================================

export interface UseScrollAnimationOptions {
  animationId: string;
  config?: Partial<AnimationConfig>;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export interface UseScrollAnimationReturn {
  ref: React.RefObject<HTMLElement | null>;
  isInView: boolean;
  hasAnimated: boolean;
}

/**
 * useScrollAnimation - Trigger animation when element enters viewport
 */
export function useScrollAnimation(options: UseScrollAnimationOptions): UseScrollAnimationReturn {
  const {
    animationId,
    config,
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animation = ANIMATIONS[animationId];
    if (!animation) return;

    // Create config
    const fullConfig: AnimationConfig = {
      ...createDefaultAnimationConfig(animationId),
      ...config,
    };

    // Inject keyframes
    if (!styleRef.current) {
      const style = document.createElement('style');
      style.textContent = animation.cssKeyframes;
      document.head.appendChild(style);
      styleRef.current = style;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);

            if (!hasAnimated || !triggerOnce) {
              // Apply animation
              const animationValue = generateAnimationCSS(fullConfig);
              element.style.animation = animationValue;
              setHasAnimated(true);
            }
          } else {
            setIsInView(false);

            if (!triggerOnce && hasAnimated) {
              // Reset for re-trigger
              element.style.animation = 'none';
              setHasAnimated(false);
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  }, [animationId, config, threshold, rootMargin, triggerOnce, hasAnimated]);

  return { ref, isInView, hasAnimated };
}

// ============================================================================
// STAGGERED ANIMATION HOOK
// ============================================================================

export interface UseStaggeredAnimationOptions {
  animationId: string;
  config?: Partial<AnimationConfig>;
  staggerDelay?: number;
  direction?: 'forward' | 'reverse' | 'center';
}

export interface UseStaggeredAnimationReturn {
  containerRef: React.RefObject<HTMLElement | null>;
  getItemProps: (index: number) => {
    style: React.CSSProperties;
    className: string;
  };
  play: () => void;
  reset: () => void;
}

/**
 * useStaggeredAnimation - Animate multiple children with staggered delays
 */
export function useStaggeredAnimation(
  itemCount: number,
  options: UseStaggeredAnimationOptions
): UseStaggeredAnimationReturn {
  const {
    animationId,
    config,
    staggerDelay = 100,
    direction = 'forward',
  } = options;

  const containerRef = useRef<HTMLElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Inject keyframes
  useEffect(() => {
    const animation = ANIMATIONS[animationId];
    if (!animation) return;

    if (!styleRef.current) {
      const style = document.createElement('style');
      style.textContent = animation.cssKeyframes;
      document.head.appendChild(style);
      styleRef.current = style;
    }

    return () => {
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  }, [animationId]);

  const getItemProps = useCallback(
    (index: number) => {
      const animation = ANIMATIONS[animationId];
      if (!animation) {
        return { style: {}, className: '' };
      }

      // Calculate delay based on direction
      let delay: number;
      switch (direction) {
        case 'reverse':
          delay = (itemCount - 1 - index) * staggerDelay;
          break;
        case 'center': {
          const center = Math.floor(itemCount / 2);
          delay = Math.abs(index - center) * staggerDelay;
          break;
        }
        default:
          delay = index * staggerDelay;
      }

      const fullConfig: AnimationConfig = {
        ...createDefaultAnimationConfig(animationId),
        ...config,
        delay,
      };

      const animationValue = generateAnimationCSS(fullConfig);

      return {
        style: isPlaying
          ? { animation: animationValue }
          : { opacity: 0 },
        className: isPlaying ? `animate-${animationId}-stagger-${index}` : '',
      };
    },
    [animationId, config, direction, itemCount, staggerDelay, isPlaying]
  );

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return { containerRef, getItemProps, play, reset };
}

// ============================================================================
// TRANSITION HOOK
// ============================================================================

export interface UseTransitionOptions {
  hoverTransition?: string;
  activeTransition?: string;
  focusTransition?: string;
  customConfig?: TransitionConfig;
}

export interface UseTransitionReturn {
  ref: React.RefObject<HTMLElement | null>;
  style: React.CSSProperties;
  className: string;
}

/**
 * useTransition - Apply transitions to elements
 */
export function useTransition(options: UseTransitionOptions = {}): UseTransitionReturn {
  const { hoverTransition, activeTransition, focusTransition } = options;

  const ref = useRef<HTMLElement | null>(null);

  // Build combined styles and classes
  const style = useMemo<React.CSSProperties>(() => {
    const transitionParts: string[] = [];

    if (hoverTransition && HOVER_TRANSITIONS[hoverTransition]) {
      transitionParts.push(HOVER_TRANSITIONS[hoverTransition].cssTransition);
    }
    if (activeTransition && ACTIVE_TRANSITIONS[activeTransition]) {
      const activeT = ACTIVE_TRANSITIONS[activeTransition].cssTransition;
      if (!transitionParts.includes(activeT)) {
        transitionParts.push(activeT);
      }
    }
    if (focusTransition && FOCUS_TRANSITIONS[focusTransition]) {
      const focusT = FOCUS_TRANSITIONS[focusTransition].cssTransition;
      if (!transitionParts.includes(focusT)) {
        transitionParts.push(focusT);
      }
    }

    return {
      transition: transitionParts.join(', ') || undefined,
    };
  }, [hoverTransition, activeTransition, focusTransition]);

  const className = useMemo(() => {
    const classes: string[] = [];

    if (hoverTransition && HOVER_TRANSITIONS[hoverTransition]) {
      classes.push(...HOVER_TRANSITIONS[hoverTransition].tailwindBase);
      if (HOVER_TRANSITIONS[hoverTransition].tailwindHover) {
        classes.push(...HOVER_TRANSITIONS[hoverTransition].tailwindHover!);
      }
    }
    if (activeTransition && ACTIVE_TRANSITIONS[activeTransition]) {
      if (ACTIVE_TRANSITIONS[activeTransition].tailwindActive) {
        classes.push(...ACTIVE_TRANSITIONS[activeTransition].tailwindActive!);
      }
    }
    if (focusTransition && FOCUS_TRANSITIONS[focusTransition]) {
      if (FOCUS_TRANSITIONS[focusTransition].tailwindFocus) {
        classes.push(...FOCUS_TRANSITIONS[focusTransition].tailwindFocus!);
      }
    }

    // Remove duplicates
    return Array.from(new Set(classes)).join(' ');
  }, [hoverTransition, activeTransition, focusTransition]);

  return { ref, style, className };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default useAnimation;
