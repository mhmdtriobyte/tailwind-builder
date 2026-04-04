'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  Circle,
  MousePointer,
  Hand,
  Focus,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Eye,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  type InteractionStateName,
  type InteractionStatesConfig,
  stateToTailwindClasses,
  transitionsToTailwindClasses,
  getAllStateNames,
} from '@/lib/interactionStates';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface InteractionEvent {
  id: string;
  type: 'hover' | 'click' | 'focus' | 'blur' | 'mousedown' | 'mouseup' | 'custom';
  timestamp: number;
  stateName: InteractionStateName;
  duration?: number;
}

interface RecordedInteraction {
  id: string;
  name: string;
  events: InteractionEvent[];
  duration: number;
  createdAt: Date;
}

interface InteractionPreviewProps {
  elementId?: string;
  config: InteractionStatesConfig;
  children?: React.ReactNode;
  onStateChange?: (state: InteractionStateName) => void;
}

interface TimelineEvent {
  event: InteractionEvent;
  startPercent: number;
  widthPercent: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STATE_COLORS: Record<InteractionStateName, string> = {
  default: '#6B7280',
  hover: '#3B82F6',
  focus: '#8B5CF6',
  active: '#F97316',
  disabled: '#9CA3AF',
  loading: '#EAB308',
  error: '#EF4444',
  success: '#22C55E',
  selected: '#6366F1',
  dragging: '#EC4899',
};

const SIMULATION_STATES = ['default', 'hover', 'focus', 'active'] as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * State Indicator Badge
 */
function StateBadge({
  state,
  active,
  onClick,
}: {
  state: InteractionStateName;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-2 py-1 rounded text-xs font-medium transition-all',
        active
          ? 'text-white scale-105'
          : 'text-gray-400 hover:text-white hover:scale-102'
      )}
      style={{
        backgroundColor: active ? STATE_COLORS[state] : 'transparent',
        border: `1px solid ${active ? STATE_COLORS[state] : '#374151'}`,
      }}
    >
      {state}
    </button>
  );
}

/**
 * Timeline Visualization
 */
function InteractionTimeline({
  events,
  totalDuration,
  currentTime,
  onSeek,
}: {
  events: InteractionEvent[];
  totalDuration: number;
  currentTime: number;
  onSeek: (time: number) => void;
}) {
  const timelineRef = useRef<HTMLDivElement>(null);

  const timelineEvents: TimelineEvent[] = useMemo(() => {
    if (events.length === 0) return [];

    return events.map((event) => ({
      event,
      startPercent: (event.timestamp / totalDuration) * 100,
      widthPercent: ((event.duration || 100) / totalDuration) * 100,
    }));
  }, [events, totalDuration]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      onSeek(percent * totalDuration);
    },
    [totalDuration, onSeek]
  );

  const progressPercent = (currentTime / totalDuration) * 100;

  return (
    <div className="space-y-2">
      {/* Time markers */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>0ms</span>
        <span>{formatDuration(totalDuration / 2)}</span>
        <span>{formatDuration(totalDuration)}</span>
      </div>

      {/* Timeline track */}
      <div
        ref={timelineRef}
        className="relative h-12 bg-gray-800 rounded-lg cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        {/* Event bars */}
        {timelineEvents.map((te) => (
          <div
            key={te.event.id}
            className="absolute h-6 top-3 rounded opacity-80 hover:opacity-100 transition-opacity"
            style={{
              left: `${te.startPercent}%`,
              width: `${Math.max(te.widthPercent, 1)}%`,
              backgroundColor: STATE_COLORS[te.event.stateName],
            }}
            title={`${te.event.stateName}: ${formatDuration(te.event.timestamp)}`}
          />
        ))}

        {/* Progress indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
          style={{ left: `${progressPercent}%` }}
        >
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white rounded-full" />
        </div>
      </div>

      {/* Current time */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">
          Current: {formatDuration(currentTime)}
        </span>
        <span className="text-xs text-gray-500">
          {events.length} event{events.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}

/**
 * Simulation Controls
 */
function SimulationControls({
  activeState,
  onStateChange,
  onReset,
}: {
  activeState: InteractionStateName;
  onStateChange: (state: InteractionStateName) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Simulate State
        </span>
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-white flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SIMULATION_STATES.map((state) => (
          <button
            key={state}
            onClick={() => onStateChange(state)}
            className={cn(
              'flex items-center justify-center gap-2 px-3 py-2 rounded-lg',
              'text-sm font-medium transition-all',
              activeState === state
                ? 'text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            )}
            style={{
              backgroundColor: activeState === state ? STATE_COLORS[state] : undefined,
            }}
          >
            {state === 'hover' && <MousePointer className="w-4 h-4" />}
            {state === 'focus' && <Focus className="w-4 h-4" />}
            {state === 'active' && <Hand className="w-4 h-4" />}
            {state === 'default' && <Eye className="w-4 h-4" />}
            <span className="capitalize">{state}</span>
          </button>
        ))}
      </div>

      {/* Extended states */}
      <div className="flex flex-wrap gap-1.5">
        {getAllStateNames()
          .filter((s) => !SIMULATION_STATES.includes(s as typeof SIMULATION_STATES[number]))
          .map((state) => (
            <StateBadge
              key={state}
              state={state}
              active={activeState === state}
              onClick={() => onStateChange(state)}
            />
          ))}
      </div>
    </div>
  );
}

/**
 * Recording Controls
 */
function RecordingControls({
  isRecording,
  isPaused,
  recordingDuration,
  onStartRecording,
  onPauseRecording,
  onStopRecording,
}: {
  isRecording: boolean;
  isPaused: boolean;
  recordingDuration: number;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onStopRecording: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {!isRecording ? (
        <button
          onClick={onStartRecording}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-red-500 hover:bg-red-600 text-white',
            'transition-colors'
          )}
        >
          <Circle className="w-4 h-4 fill-current" />
          Record
        </button>
      ) : (
        <>
          <button
            onClick={onPauseRecording}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg',
              'bg-yellow-500 hover:bg-yellow-600 text-black',
              'transition-colors'
            )}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            )}
          </button>
          <button
            onClick={onStopRecording}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg',
              'bg-gray-700 hover:bg-gray-600 text-white',
              'transition-colors'
            )}
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
          <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-red-400 font-mono">
              {formatDuration(recordingDuration)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Playback Controls
 */
function PlaybackControls({
  recording,
  isPlaying,
  currentTime,
  onPlay,
  onPause,
  onStop,
  onSeek,
}: {
  recording: RecordedInteraction | null;
  isPlaying: boolean;
  currentTime: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
}) {
  if (!recording) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm">
        No recording selected. Record an interaction or load one from the list.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-white">{recording.name}</h4>
          <p className="text-xs text-gray-500">
            {recording.events.length} events, {formatDuration(recording.duration)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={onPause}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Pause className="w-4 h-4 text-white" />
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <Play className="w-4 h-4 text-white" />
            </button>
          )}
          <button
            onClick={onStop}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Square className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <InteractionTimeline
        events={recording.events}
        totalDuration={recording.duration}
        currentTime={currentTime}
        onSeek={onSeek}
      />
    </div>
  );
}

/**
 * Recorded Interactions List
 */
function RecordingsList({
  recordings,
  activeRecording,
  onSelect,
  onDelete,
  onExport,
}: {
  recordings: RecordedInteraction[];
  activeRecording: RecordedInteraction | null;
  onSelect: (recording: RecordedInteraction) => void;
  onDelete: (id: string) => void;
  onExport: (recording: RecordedInteraction) => void;
}) {
  if (recordings.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm">
        No recordings yet. Start by recording an interaction.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {recordings.map((recording) => (
        <div
          key={recording.id}
          className={cn(
            'flex items-center justify-between p-2 rounded-lg cursor-pointer',
            'transition-colors',
            activeRecording?.id === recording.id
              ? 'bg-blue-500/20 border border-blue-500/30'
              : 'bg-gray-800 hover:bg-gray-700'
          )}
          onClick={() => onSelect(recording)}
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {recording.name}
            </div>
            <div className="text-xs text-gray-500">
              {recording.events.length} events | {formatDuration(recording.duration)}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExport(recording);
              }}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
              title="Export"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(recording.id);
              }}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Preview Element Wrapper
 */
function PreviewElement({
  config,
  activeState,
  children,
}: {
  config: InteractionStatesConfig;
  activeState: InteractionStateName;
  children?: React.ReactNode;
}) {
  const classes = useMemo(() => {
    const transitionClasses = transitionsToTailwindClasses(config.globalTransitions);
    const stateClasses = stateToTailwindClasses(config[activeState]);
    return [...transitionClasses, ...stateClasses];
  }, [config, activeState]);

  return (
    <div
      className={cn(
        'p-6 border-2 border-dashed border-gray-700 rounded-xl',
        'flex items-center justify-center',
        'min-h-[120px]',
        classes.join(' ')
      )}
      style={{
        borderColor: STATE_COLORS[activeState],
      }}
    >
      {children || (
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-lg mb-3 mx-auto transition-all duration-300"
            style={{
              backgroundColor: STATE_COLORS[activeState],
              transform: activeState === 'hover' ? 'scale(1.05)' :
                        activeState === 'active' ? 'scale(0.95)' : 'scale(1)',
              boxShadow: activeState === 'focus' ? `0 0 0 4px ${STATE_COLORS.focus}40` : 'none',
            }}
          />
          <div className="text-sm text-gray-400 capitalize">
            {activeState} State
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function InteractionPreview({
  config,
  children,
  onStateChange,
}: InteractionPreviewProps) {
  // State
  const [activeState, setActiveState] = useState<InteractionStateName>('default');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentEvents, setCurrentEvents] = useState<InteractionEvent[]>([]);
  const [recordings, setRecordings] = useState<RecordedInteraction[]>([]);
  const [activeRecording, setActiveRecording] = useState<RecordedInteraction | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [expandedSection, setExpandedSection] = useState<'simulate' | 'record' | 'playback'>('simulate');

  // Refs
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Recording timer
  useEffect(() => {
    if (isRecording && !isPaused && recordingStartTime) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(Date.now() - recordingStartTime);
      }, 100);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording, isPaused, recordingStartTime]);

  // Playback timer
  useEffect(() => {
    if (isPlaying && activeRecording) {
      playbackTimerRef.current = setInterval(() => {
        setPlaybackTime((prev) => {
          const next = prev + 50;
          if (next >= activeRecording.duration) {
            setIsPlaying(false);
            return 0;
          }

          // Find current state based on events
          const currentEvent = activeRecording.events
            .filter((e) => e.timestamp <= next)
            .pop();
          if (currentEvent) {
            setActiveState(currentEvent.stateName);
          }

          return next;
        });
      }, 50);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, [isPlaying, activeRecording]);

  // Handlers
  const handleStateChange = useCallback(
    (state: InteractionStateName) => {
      setActiveState(state);
      onStateChange?.(state);

      // Record event if recording
      if (isRecording && !isPaused && recordingStartTime) {
        const event: InteractionEvent = {
          id: generateId(),
          type: 'custom',
          timestamp: Date.now() - recordingStartTime,
          stateName: state,
          duration: 100,
        };
        setCurrentEvents((prev) => [...prev, event]);
      }
    },
    [isRecording, isPaused, recordingStartTime, onStateChange]
  );

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingStartTime(Date.now());
    setRecordingDuration(0);
    setCurrentEvents([]);
    setActiveState('default');
  }, []);

  const handlePauseRecording = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  const handleStopRecording = useCallback(() => {
    if (currentEvents.length > 0) {
      const recording: RecordedInteraction = {
        id: generateId(),
        name: `Recording ${recordings.length + 1}`,
        events: currentEvents,
        duration: recordingDuration,
        createdAt: new Date(),
      };
      setRecordings((prev) => [...prev, recording]);
      setActiveRecording(recording);
    }

    setIsRecording(false);
    setIsPaused(false);
    setRecordingStartTime(null);
    setRecordingDuration(0);
    setCurrentEvents([]);
  }, [currentEvents, recordingDuration, recordings.length]);

  const handlePlay = useCallback(() => {
    if (activeRecording) {
      setIsPlaying(true);
      setPlaybackTime(0);
    }
  }, [activeRecording]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setPlaybackTime(0);
    setActiveState('default');
  }, []);

  const handleSeek = useCallback(
    (time: number) => {
      setPlaybackTime(time);
      if (activeRecording) {
        const currentEvent = activeRecording.events
          .filter((e) => e.timestamp <= time)
          .pop();
        if (currentEvent) {
          setActiveState(currentEvent.stateName);
        }
      }
    },
    [activeRecording]
  );

  const handleDeleteRecording = useCallback(
    (id: string) => {
      setRecordings((prev) => prev.filter((r) => r.id !== id));
      if (activeRecording?.id === id) {
        setActiveRecording(null);
      }
    },
    [activeRecording]
  );

  const handleExportRecording = useCallback((recording: RecordedInteraction) => {
    const data = JSON.stringify(recording, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImportRecording = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const recording = JSON.parse(e.target?.result as string) as RecordedInteraction;
            recording.id = generateId(); // Generate new ID to avoid conflicts
            setRecordings((prev) => [...prev, recording]);
          } catch (err) {
            console.error('Failed to import recording:', err);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  // Section toggle helper
  const toggleSection = (section: 'simulate' | 'record' | 'playback') => {
    setExpandedSection(expandedSection === section ? 'simulate' : section);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Preview Area */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-400">Live Preview</span>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: STATE_COLORS[activeState] }}
            />
            <span className="text-xs text-gray-500 capitalize">{activeState}</span>
          </div>
        </div>
        <PreviewElement config={config} activeState={activeState}>
          {children}
        </PreviewElement>
      </div>

      {/* Collapsible Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Simulate Section */}
        <div className="border-b border-gray-800">
          <button
            onClick={() => toggleSection('simulate')}
            className={cn(
              'w-full flex items-center justify-between p-4',
              'text-sm font-medium text-white',
              'hover:bg-gray-800/50 transition-colors'
            )}
          >
            <div className="flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-gray-400" />
              <span>Simulate Interactions</span>
            </div>
            {expandedSection === 'simulate' ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {expandedSection === 'simulate' && (
            <div className="p-4 pt-0">
              <SimulationControls
                activeState={activeState}
                onStateChange={handleStateChange}
                onReset={() => handleStateChange('default')}
              />
            </div>
          )}
        </div>

        {/* Record Section */}
        <div className="border-b border-gray-800">
          <button
            onClick={() => toggleSection('record')}
            className={cn(
              'w-full flex items-center justify-between p-4',
              'text-sm font-medium text-white',
              'hover:bg-gray-800/50 transition-colors'
            )}
          >
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-red-400" />
              <span>Record Interactions</span>
              {isRecording && (
                <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                  Recording
                </span>
              )}
            </div>
            {expandedSection === 'record' ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {expandedSection === 'record' && (
            <div className="p-4 pt-0 space-y-4">
              <RecordingControls
                isRecording={isRecording}
                isPaused={isPaused}
                recordingDuration={recordingDuration}
                onStartRecording={handleStartRecording}
                onPauseRecording={handlePauseRecording}
                onStopRecording={handleStopRecording}
              />
              {isRecording && (
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-400">
                    Click on the state buttons above to record state transitions.
                    The timeline will capture when each state change occurs.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Playback Section */}
        <div className="border-b border-gray-800">
          <button
            onClick={() => toggleSection('playback')}
            className={cn(
              'w-full flex items-center justify-between p-4',
              'text-sm font-medium text-white',
              'hover:bg-gray-800/50 transition-colors'
            )}
          >
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-blue-400" />
              <span>Playback Recordings</span>
              <span className="text-xs text-gray-500">({recordings.length})</span>
            </div>
            {expandedSection === 'playback' ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {expandedSection === 'playback' && (
            <div className="p-4 pt-0 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Saved Recordings
                </span>
                <button
                  onClick={handleImportRecording}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Import
                </button>
              </div>
              <RecordingsList
                recordings={recordings}
                activeRecording={activeRecording}
                onSelect={setActiveRecording}
                onDelete={handleDeleteRecording}
                onExport={handleExportRecording}
              />
              {activeRecording && (
                <>
                  <hr className="border-gray-800" />
                  <PlaybackControls
                    recording={activeRecording}
                    isPlaying={isPlaying}
                    currentTime={playbackTime}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onStop={handleStop}
                    onSeek={handleSeek}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer with generated classes */}
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">Active State Classes</span>
        </div>
        <code className="block p-2 bg-gray-800 rounded text-xs text-blue-400 break-all max-h-16 overflow-y-auto">
          {stateToTailwindClasses(config[activeState], activeState === 'default' ? undefined : activeState).join(' ') ||
            'No state classes'}
        </code>
      </div>
    </div>
  );
}

export default InteractionPreview;
