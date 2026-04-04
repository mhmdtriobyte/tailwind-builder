/**
 * Icon System - Comprehensive icon management for the Tailwind Builder
 *
 * Features:
 * - Full Lucide icon library integration (1000+ icons)
 * - Icon categorization by use case
 * - Search by name and tags
 * - Size presets and custom sizing
 * - Color customization with Tailwind classes
 * - Animation presets (spin, pulse, bounce)
 * - Custom SVG upload support
 * - Icon to component converter
 */

import * as LucideIcons from 'lucide-react';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

// Extended IconName type to allow custom icons beyond Lucide library
export type LucideIconName = keyof typeof LucideIcons;
export type IconName = LucideIconName | (string & {});

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type IconAnimation = 'none' | 'spin' | 'pulse' | 'bounce' | 'ping' | 'wiggle';

export interface IconConfig {
  name: IconName;
  size?: IconSize | number;
  color?: string;
  strokeWidth?: number;
  animation?: IconAnimation;
  className?: string;
}

export interface IconMetadata {
  name: IconName;
  displayName: string;
  category: IconCategory;
  tags: string[];
}

export type IconCategory =
  | 'arrows'
  | 'media'
  | 'files'
  | 'communication'
  | 'weather'
  | 'devices'
  | 'shapes'
  | 'navigation'
  | 'actions'
  | 'alerts'
  | 'charts'
  | 'development'
  | 'editing'
  | 'layout'
  | 'social'
  | 'commerce'
  | 'travel'
  | 'health'
  | 'nature'
  | 'misc';

export interface CustomIcon {
  id: string;
  name: string;
  svg: string;
  createdAt: number;
}

// ============================================================================
// SIZE PRESETS
// ============================================================================

/**
 * Size presets mapping to pixel values
 */
export const iconSizePresets: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

/**
 * Size presets with Tailwind classes
 */
export const iconSizeClasses: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-12 h-12',
};

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

/**
 * Animation presets with Tailwind classes
 */
export const iconAnimationClasses: Record<IconAnimation, string> = {
  none: '',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  ping: 'animate-ping',
  wiggle: 'animate-[wiggle_1s_ease-in-out_infinite]',
};

/**
 * Animation keyframes for custom animations
 */
export const customAnimationKeyframes = `
@keyframes wiggle {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}
`;

// ============================================================================
// COLOR PRESETS
// ============================================================================

/**
 * Common icon color classes
 */
export const iconColorPresets: Record<string, string> = {
  default: 'text-current',
  white: 'text-white',
  black: 'text-black',
  gray: 'text-gray-500',
  red: 'text-red-500',
  orange: 'text-orange-500',
  yellow: 'text-yellow-500',
  green: 'text-green-500',
  teal: 'text-teal-500',
  blue: 'text-blue-500',
  indigo: 'text-indigo-500',
  purple: 'text-purple-500',
  pink: 'text-pink-500',
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  muted: 'text-gray-400',
};

// ============================================================================
// ICON CATEGORIES WITH TAGS
// ============================================================================

/**
 * Comprehensive icon categorization with search tags
 * Categories are based on common use cases
 */
export const iconCategories: Record<IconCategory, IconMetadata[]> = {
  arrows: [
    { name: 'ArrowUp', displayName: 'Arrow Up', category: 'arrows', tags: ['up', 'direction', 'top'] },
    { name: 'ArrowDown', displayName: 'Arrow Down', category: 'arrows', tags: ['down', 'direction', 'bottom'] },
    { name: 'ArrowLeft', displayName: 'Arrow Left', category: 'arrows', tags: ['left', 'direction', 'back'] },
    { name: 'ArrowRight', displayName: 'Arrow Right', category: 'arrows', tags: ['right', 'direction', 'forward', 'next'] },
    { name: 'ArrowUpRight', displayName: 'Arrow Up Right', category: 'arrows', tags: ['diagonal', 'external'] },
    { name: 'ArrowDownLeft', displayName: 'Arrow Down Left', category: 'arrows', tags: ['diagonal'] },
    { name: 'ArrowUpLeft', displayName: 'Arrow Up Left', category: 'arrows', tags: ['diagonal'] },
    { name: 'ArrowDownRight', displayName: 'Arrow Down Right', category: 'arrows', tags: ['diagonal'] },
    { name: 'ChevronUp', displayName: 'Chevron Up', category: 'arrows', tags: ['up', 'expand', 'collapse'] },
    { name: 'ChevronDown', displayName: 'Chevron Down', category: 'arrows', tags: ['down', 'dropdown', 'expand'] },
    { name: 'ChevronLeft', displayName: 'Chevron Left', category: 'arrows', tags: ['left', 'back', 'previous'] },
    { name: 'ChevronRight', displayName: 'Chevron Right', category: 'arrows', tags: ['right', 'forward', 'next'] },
    { name: 'ChevronsUp', displayName: 'Chevrons Up', category: 'arrows', tags: ['double', 'fast', 'skip'] },
    { name: 'ChevronsDown', displayName: 'Chevrons Down', category: 'arrows', tags: ['double', 'fast', 'skip'] },
    { name: 'ChevronsLeft', displayName: 'Chevrons Left', category: 'arrows', tags: ['double', 'fast', 'rewind'] },
    { name: 'ChevronsRight', displayName: 'Chevrons Right', category: 'arrows', tags: ['double', 'fast', 'forward'] },
    { name: 'MoveUp', displayName: 'Move Up', category: 'arrows', tags: ['move', 'reorder'] },
    { name: 'MoveDown', displayName: 'Move Down', category: 'arrows', tags: ['move', 'reorder'] },
    { name: 'MoveLeft', displayName: 'Move Left', category: 'arrows', tags: ['move', 'reorder'] },
    { name: 'MoveRight', displayName: 'Move Right', category: 'arrows', tags: ['move', 'reorder'] },
    { name: 'CornerDownLeft', displayName: 'Corner Down Left', category: 'arrows', tags: ['enter', 'return'] },
    { name: 'CornerDownRight', displayName: 'Corner Down Right', category: 'arrows', tags: ['enter'] },
    { name: 'CornerUpLeft', displayName: 'Corner Up Left', category: 'arrows', tags: ['return'] },
    { name: 'CornerUpRight', displayName: 'Corner Up Right', category: 'arrows', tags: ['return'] },
    { name: 'ArrowBigUp', displayName: 'Arrow Big Up', category: 'arrows', tags: ['large', 'bold'] },
    { name: 'ArrowBigDown', displayName: 'Arrow Big Down', category: 'arrows', tags: ['large', 'bold'] },
    { name: 'ArrowBigLeft', displayName: 'Arrow Big Left', category: 'arrows', tags: ['large', 'bold'] },
    { name: 'ArrowBigRight', displayName: 'Arrow Big Right', category: 'arrows', tags: ['large', 'bold'] },
    { name: 'Undo', displayName: 'Undo', category: 'arrows', tags: ['back', 'revert', 'history'] },
    { name: 'Redo', displayName: 'Redo', category: 'arrows', tags: ['forward', 'history'] },
    { name: 'RotateCcw', displayName: 'Rotate CCW', category: 'arrows', tags: ['rotate', 'counter-clockwise', 'refresh'] },
    { name: 'RotateCw', displayName: 'Rotate CW', category: 'arrows', tags: ['rotate', 'clockwise', 'refresh'] },
    { name: 'RefreshCw', displayName: 'Refresh', category: 'arrows', tags: ['refresh', 'reload', 'sync'] },
    { name: 'RefreshCcw', displayName: 'Refresh CCW', category: 'arrows', tags: ['refresh', 'reload', 'sync'] },
    { name: 'Repeat', displayName: 'Repeat', category: 'arrows', tags: ['loop', 'cycle'] },
    { name: 'Shuffle', displayName: 'Shuffle', category: 'arrows', tags: ['random', 'mix'] },
  ],

  media: [
    { name: 'Play', displayName: 'Play', category: 'media', tags: ['video', 'audio', 'start'] },
    { name: 'Pause', displayName: 'Pause', category: 'media', tags: ['video', 'audio', 'stop'] },
    { name: 'Square', displayName: 'Stop', category: 'media', tags: ['video', 'audio', 'stop'] },
    { name: 'SkipBack', displayName: 'Skip Back', category: 'media', tags: ['previous', 'rewind'] },
    { name: 'SkipForward', displayName: 'Skip Forward', category: 'media', tags: ['next', 'forward'] },
    { name: 'Rewind', displayName: 'Rewind', category: 'media', tags: ['backward', 'fast'] },
    { name: 'FastForward', displayName: 'Fast Forward', category: 'media', tags: ['forward', 'fast'] },
    { name: 'Volume', displayName: 'Volume', category: 'media', tags: ['sound', 'audio', 'speaker'] },
    { name: 'Volume1', displayName: 'Volume Low', category: 'media', tags: ['sound', 'audio', 'speaker', 'quiet'] },
    { name: 'Volume2', displayName: 'Volume High', category: 'media', tags: ['sound', 'audio', 'speaker', 'loud'] },
    { name: 'VolumeX', displayName: 'Volume Mute', category: 'media', tags: ['sound', 'audio', 'mute', 'silent'] },
    { name: 'Mic', displayName: 'Microphone', category: 'media', tags: ['audio', 'record', 'voice'] },
    { name: 'MicOff', displayName: 'Microphone Off', category: 'media', tags: ['audio', 'mute', 'voice'] },
    { name: 'Headphones', displayName: 'Headphones', category: 'media', tags: ['audio', 'music', 'listen'] },
    { name: 'Music', displayName: 'Music', category: 'media', tags: ['audio', 'song', 'note'] },
    { name: 'Music2', displayName: 'Music 2', category: 'media', tags: ['audio', 'song', 'notes'] },
    { name: 'Music3', displayName: 'Music 3', category: 'media', tags: ['audio', 'song', 'playlist'] },
    { name: 'Music4', displayName: 'Music 4', category: 'media', tags: ['audio', 'song', 'player'] },
    { name: 'Radio', displayName: 'Radio', category: 'media', tags: ['audio', 'broadcast', 'fm'] },
    { name: 'Film', displayName: 'Film', category: 'media', tags: ['video', 'movie', 'cinema'] },
    { name: 'Video', displayName: 'Video', category: 'media', tags: ['video', 'camera', 'record'] },
    { name: 'VideoOff', displayName: 'Video Off', category: 'media', tags: ['video', 'camera', 'disabled'] },
    { name: 'Camera', displayName: 'Camera', category: 'media', tags: ['photo', 'picture', 'capture'] },
    { name: 'CameraOff', displayName: 'Camera Off', category: 'media', tags: ['photo', 'disabled'] },
    { name: 'Image', displayName: 'Image', category: 'media', tags: ['photo', 'picture', 'gallery'] },
    { name: 'Images', displayName: 'Images', category: 'media', tags: ['photos', 'gallery', 'album'] },
    { name: 'ImagePlus', displayName: 'Image Plus', category: 'media', tags: ['photo', 'add', 'upload'] },
    { name: 'Youtube', displayName: 'YouTube', category: 'media', tags: ['video', 'social', 'streaming'] },
    { name: 'Tv', displayName: 'TV', category: 'media', tags: ['television', 'screen', 'display'] },
    { name: 'MonitorPlay', displayName: 'Monitor Play', category: 'media', tags: ['video', 'screen', 'stream'] },
  ],

  files: [
    { name: 'File', displayName: 'File', category: 'files', tags: ['document', 'paper'] },
    { name: 'FileText', displayName: 'File Text', category: 'files', tags: ['document', 'text', 'txt'] },
    { name: 'FileCode', displayName: 'File Code', category: 'files', tags: ['document', 'code', 'programming'] },
    { name: 'FileJson', displayName: 'File JSON', category: 'files', tags: ['document', 'json', 'data'] },
    { name: 'FileImage', displayName: 'File Image', category: 'files', tags: ['document', 'image', 'photo'] },
    { name: 'FileVideo', displayName: 'File Video', category: 'files', tags: ['document', 'video', 'movie'] },
    { name: 'FileAudio', displayName: 'File Audio', category: 'files', tags: ['document', 'audio', 'music'] },
    { name: 'FileArchive', displayName: 'File Archive', category: 'files', tags: ['document', 'zip', 'compressed'] },
    { name: 'FileSpreadsheet', displayName: 'File Spreadsheet', category: 'files', tags: ['document', 'excel', 'csv'] },
    { name: 'FilePlus', displayName: 'File Plus', category: 'files', tags: ['document', 'add', 'new'] },
    { name: 'FileMinus', displayName: 'File Minus', category: 'files', tags: ['document', 'remove'] },
    { name: 'FileX', displayName: 'File X', category: 'files', tags: ['document', 'delete', 'remove'] },
    { name: 'FileCheck', displayName: 'File Check', category: 'files', tags: ['document', 'done', 'complete'] },
    { name: 'Files', displayName: 'Files', category: 'files', tags: ['documents', 'multiple'] },
    { name: 'Folder', displayName: 'Folder', category: 'files', tags: ['directory', 'folder'] },
    { name: 'FolderOpen', displayName: 'Folder Open', category: 'files', tags: ['directory', 'open'] },
    { name: 'FolderPlus', displayName: 'Folder Plus', category: 'files', tags: ['directory', 'add', 'new'] },
    { name: 'FolderMinus', displayName: 'Folder Minus', category: 'files', tags: ['directory', 'remove'] },
    { name: 'FolderX', displayName: 'Folder X', category: 'files', tags: ['directory', 'delete'] },
    { name: 'FolderCheck', displayName: 'Folder Check', category: 'files', tags: ['directory', 'done'] },
    { name: 'Download', displayName: 'Download', category: 'files', tags: ['save', 'download', 'arrow'] },
    { name: 'Upload', displayName: 'Upload', category: 'files', tags: ['upload', 'arrow', 'send'] },
    { name: 'Paperclip', displayName: 'Paperclip', category: 'files', tags: ['attachment', 'attach'] },
    { name: 'Archive', displayName: 'Archive', category: 'files', tags: ['box', 'storage'] },
    { name: 'Save', displayName: 'Save', category: 'files', tags: ['disk', 'floppy', 'save'] },
    { name: 'HardDrive', displayName: 'Hard Drive', category: 'files', tags: ['storage', 'disk', 'drive'] },
    { name: 'Database', displayName: 'Database', category: 'files', tags: ['storage', 'data', 'server'] },
    { name: 'Cloud', displayName: 'Cloud', category: 'files', tags: ['storage', 'online', 'sync'] },
    { name: 'CloudDownload', displayName: 'Cloud Download', category: 'files', tags: ['download', 'sync'] },
    { name: 'CloudUpload', displayName: 'Cloud Upload', category: 'files', tags: ['upload', 'sync'] },
  ],

  communication: [
    { name: 'Mail', displayName: 'Mail', category: 'communication', tags: ['email', 'message', 'letter'] },
    { name: 'MailOpen', displayName: 'Mail Open', category: 'communication', tags: ['email', 'read'] },
    { name: 'MailPlus', displayName: 'Mail Plus', category: 'communication', tags: ['email', 'compose', 'new'] },
    { name: 'Inbox', displayName: 'Inbox', category: 'communication', tags: ['email', 'messages'] },
    { name: 'Send', displayName: 'Send', category: 'communication', tags: ['message', 'paper plane'] },
    { name: 'MessageSquare', displayName: 'Message Square', category: 'communication', tags: ['chat', 'comment', 'bubble'] },
    { name: 'MessageCircle', displayName: 'Message Circle', category: 'communication', tags: ['chat', 'comment', 'bubble'] },
    { name: 'MessagesSquare', displayName: 'Messages Square', category: 'communication', tags: ['chat', 'conversation'] },
    { name: 'Phone', displayName: 'Phone', category: 'communication', tags: ['call', 'telephone', 'contact'] },
    { name: 'PhoneCall', displayName: 'Phone Call', category: 'communication', tags: ['calling', 'ringing'] },
    { name: 'PhoneOff', displayName: 'Phone Off', category: 'communication', tags: ['call', 'disabled'] },
    { name: 'PhoneOutgoing', displayName: 'Phone Outgoing', category: 'communication', tags: ['call', 'dialing'] },
    { name: 'PhoneIncoming', displayName: 'Phone Incoming', category: 'communication', tags: ['call', 'receiving'] },
    { name: 'PhoneMissed', displayName: 'Phone Missed', category: 'communication', tags: ['call', 'missed'] },
    { name: 'AtSign', displayName: 'At Sign', category: 'communication', tags: ['email', 'mention', '@'] },
    { name: 'Bell', displayName: 'Bell', category: 'communication', tags: ['notification', 'alert', 'alarm'] },
    { name: 'BellOff', displayName: 'Bell Off', category: 'communication', tags: ['notification', 'mute', 'silent'] },
    { name: 'BellRing', displayName: 'Bell Ring', category: 'communication', tags: ['notification', 'alert', 'ringing'] },
    { name: 'Megaphone', displayName: 'Megaphone', category: 'communication', tags: ['announcement', 'broadcast'] },
    { name: 'Hash', displayName: 'Hash', category: 'communication', tags: ['hashtag', 'channel', 'number'] },
    { name: 'Share', displayName: 'Share', category: 'communication', tags: ['share', 'social', 'forward'] },
    { name: 'Share2', displayName: 'Share 2', category: 'communication', tags: ['share', 'network'] },
    { name: 'Forward', displayName: 'Forward', category: 'communication', tags: ['forward', 'send'] },
    { name: 'Reply', displayName: 'Reply', category: 'communication', tags: ['reply', 'respond'] },
    { name: 'ReplyAll', displayName: 'Reply All', category: 'communication', tags: ['reply', 'respond', 'all'] },
    { name: 'Rss', displayName: 'RSS', category: 'communication', tags: ['feed', 'subscribe'] },
    { name: 'Podcast', displayName: 'Podcast', category: 'communication', tags: ['audio', 'broadcast'] },
  ],

  weather: [
    { name: 'Sun', displayName: 'Sun', category: 'weather', tags: ['sunny', 'day', 'light'] },
    { name: 'Moon', displayName: 'Moon', category: 'weather', tags: ['night', 'dark'] },
    { name: 'Cloud', displayName: 'Cloud', category: 'weather', tags: ['cloudy', 'overcast'] },
    { name: 'CloudSun', displayName: 'Cloud Sun', category: 'weather', tags: ['partly cloudy', 'day'] },
    { name: 'CloudMoon', displayName: 'Cloud Moon', category: 'weather', tags: ['partly cloudy', 'night'] },
    { name: 'CloudRain', displayName: 'Cloud Rain', category: 'weather', tags: ['rain', 'rainy'] },
    { name: 'CloudDrizzle', displayName: 'Cloud Drizzle', category: 'weather', tags: ['rain', 'light rain'] },
    { name: 'CloudSnow', displayName: 'Cloud Snow', category: 'weather', tags: ['snow', 'winter', 'cold'] },
    { name: 'CloudLightning', displayName: 'Cloud Lightning', category: 'weather', tags: ['storm', 'thunder'] },
    { name: 'CloudFog', displayName: 'Cloud Fog', category: 'weather', tags: ['fog', 'mist', 'haze'] },
    { name: 'CloudHail', displayName: 'Cloud Hail', category: 'weather', tags: ['hail', 'storm'] },
    { name: 'Snowflake', displayName: 'Snowflake', category: 'weather', tags: ['snow', 'cold', 'winter', 'freeze'] },
    { name: 'Thermometer', displayName: 'Thermometer', category: 'weather', tags: ['temperature', 'hot', 'cold'] },
    { name: 'ThermometerSun', displayName: 'Thermometer Sun', category: 'weather', tags: ['temperature', 'hot', 'warm'] },
    { name: 'ThermometerSnowflake', displayName: 'Thermometer Snowflake', category: 'weather', tags: ['temperature', 'cold', 'freeze'] },
    { name: 'Wind', displayName: 'Wind', category: 'weather', tags: ['windy', 'breeze', 'air'] },
    { name: 'Umbrella', displayName: 'Umbrella', category: 'weather', tags: ['rain', 'protection'] },
    { name: 'Rainbow', displayName: 'Rainbow', category: 'weather', tags: ['colorful', 'weather'] },
    { name: 'Sunrise', displayName: 'Sunrise', category: 'weather', tags: ['morning', 'dawn'] },
    { name: 'Sunset', displayName: 'Sunset', category: 'weather', tags: ['evening', 'dusk'] },
    { name: 'Waves', displayName: 'Waves', category: 'weather', tags: ['water', 'sea', 'ocean'] },
    { name: 'Droplets', displayName: 'Droplets', category: 'weather', tags: ['water', 'rain', 'humidity'] },
    { name: 'Flame', displayName: 'Flame', category: 'weather', tags: ['fire', 'hot', 'heat'] },
    { name: 'Zap', displayName: 'Zap', category: 'weather', tags: ['lightning', 'electric', 'power'] },
  ],

  devices: [
    { name: 'Monitor', displayName: 'Monitor', category: 'devices', tags: ['screen', 'display', 'desktop'] },
    { name: 'Laptop', displayName: 'Laptop', category: 'devices', tags: ['computer', 'notebook'] },
    { name: 'Tablet', displayName: 'Tablet', category: 'devices', tags: ['ipad', 'device'] },
    { name: 'Smartphone', displayName: 'Smartphone', category: 'devices', tags: ['phone', 'mobile', 'iphone'] },
    { name: 'Watch', displayName: 'Watch', category: 'devices', tags: ['smartwatch', 'wearable', 'time'] },
    { name: 'Cpu', displayName: 'CPU', category: 'devices', tags: ['processor', 'chip', 'computer'] },
    { name: 'Keyboard', displayName: 'Keyboard', category: 'devices', tags: ['input', 'typing'] },
    { name: 'Mouse', displayName: 'Mouse', category: 'devices', tags: ['input', 'cursor', 'pointer'] },
    { name: 'Gamepad', displayName: 'Gamepad', category: 'devices', tags: ['controller', 'gaming', 'game'] },
    { name: 'Gamepad2', displayName: 'Gamepad 2', category: 'devices', tags: ['controller', 'gaming'] },
    { name: 'Printer', displayName: 'Printer', category: 'devices', tags: ['print', 'paper'] },
    { name: 'ScanLine', displayName: 'Scanner', category: 'devices', tags: ['scan', 'document'] },
    { name: 'Server', displayName: 'Server', category: 'devices', tags: ['computer', 'hosting', 'backend'] },
    { name: 'Router', displayName: 'Router', category: 'devices', tags: ['network', 'wifi', 'internet'] },
    { name: 'Wifi', displayName: 'WiFi', category: 'devices', tags: ['wireless', 'network', 'internet'] },
    { name: 'WifiOff', displayName: 'WiFi Off', category: 'devices', tags: ['wireless', 'disconnected'] },
    { name: 'Bluetooth', displayName: 'Bluetooth', category: 'devices', tags: ['wireless', 'connection'] },
    { name: 'BluetoothOff', displayName: 'Bluetooth Off', category: 'devices', tags: ['wireless', 'disconnected'] },
    { name: 'Usb', displayName: 'USB', category: 'devices', tags: ['connection', 'port', 'cable'] },
    { name: 'PlugZap', displayName: 'Plug Zap', category: 'devices', tags: ['power', 'electric', 'charging'] },
    { name: 'Battery', displayName: 'Battery', category: 'devices', tags: ['power', 'charge'] },
    { name: 'BatteryFull', displayName: 'Battery Full', category: 'devices', tags: ['power', 'charged'] },
    { name: 'BatteryLow', displayName: 'Battery Low', category: 'devices', tags: ['power', 'low'] },
    { name: 'BatteryCharging', displayName: 'Battery Charging', category: 'devices', tags: ['power', 'charging'] },
    { name: 'Power', displayName: 'Power', category: 'devices', tags: ['on', 'off', 'button'] },
    { name: 'PowerOff', displayName: 'Power Off', category: 'devices', tags: ['shutdown', 'off'] },
    { name: 'Cast', displayName: 'Cast', category: 'devices', tags: ['chromecast', 'stream', 'mirror'] },
    { name: 'Airplay', displayName: 'Airplay', category: 'devices', tags: ['apple', 'stream', 'mirror'] },
    { name: 'Nfc', displayName: 'NFC', category: 'devices', tags: ['contactless', 'wireless', 'payment'] },
    { name: 'QrCode', displayName: 'QR Code', category: 'devices', tags: ['scan', 'code', 'barcode'] },
  ],

  shapes: [
    { name: 'Circle', displayName: 'Circle', category: 'shapes', tags: ['round', 'shape'] },
    { name: 'Square', displayName: 'Square', category: 'shapes', tags: ['rectangle', 'shape', 'box'] },
    { name: 'Triangle', displayName: 'Triangle', category: 'shapes', tags: ['shape', 'polygon'] },
    { name: 'Pentagon', displayName: 'Pentagon', category: 'shapes', tags: ['shape', 'polygon', '5'] },
    { name: 'Hexagon', displayName: 'Hexagon', category: 'shapes', tags: ['shape', 'polygon', '6'] },
    { name: 'Octagon', displayName: 'Octagon', category: 'shapes', tags: ['shape', 'polygon', '8'] },
    { name: 'Diamond', displayName: 'Diamond', category: 'shapes', tags: ['shape', 'rhombus'] },
    { name: 'Star', displayName: 'Star', category: 'shapes', tags: ['favorite', 'rating'] },
    { name: 'Heart', displayName: 'Heart', category: 'shapes', tags: ['love', 'like', 'favorite'] },
    { name: 'Spade', displayName: 'Spade', category: 'shapes', tags: ['cards', 'game'] },
    { name: 'Club', displayName: 'Club', category: 'shapes', tags: ['cards', 'game'] },
    { name: 'Plus', displayName: 'Plus', category: 'shapes', tags: ['add', 'new', 'create'] },
    { name: 'Minus', displayName: 'Minus', category: 'shapes', tags: ['remove', 'subtract'] },
    { name: 'X', displayName: 'X', category: 'shapes', tags: ['close', 'remove', 'delete'] },
    { name: 'Check', displayName: 'Check', category: 'shapes', tags: ['done', 'complete', 'yes'] },
    { name: 'Slash', displayName: 'Slash', category: 'shapes', tags: ['divide', 'separator'] },
  ],

  navigation: [
    { name: 'Home', displayName: 'Home', category: 'navigation', tags: ['house', 'main', 'start'] },
    { name: 'Menu', displayName: 'Menu', category: 'navigation', tags: ['hamburger', 'navigation', 'sidebar'] },
    { name: 'MoreHorizontal', displayName: 'More Horizontal', category: 'navigation', tags: ['dots', 'menu', 'options'] },
    { name: 'MoreVertical', displayName: 'More Vertical', category: 'navigation', tags: ['dots', 'menu', 'options'] },
    { name: 'Grid', displayName: 'Grid', category: 'navigation', tags: ['apps', 'menu', 'dashboard'] },
    { name: 'List', displayName: 'List', category: 'navigation', tags: ['menu', 'items', 'bullet'] },
    { name: 'LayoutGrid', displayName: 'Layout Grid', category: 'navigation', tags: ['grid', 'layout', 'dashboard'] },
    { name: 'LayoutList', displayName: 'Layout List', category: 'navigation', tags: ['list', 'layout'] },
    { name: 'Layers', displayName: 'Layers', category: 'navigation', tags: ['stack', 'levels'] },
    { name: 'Map', displayName: 'Map', category: 'navigation', tags: ['location', 'directions'] },
    { name: 'MapPin', displayName: 'Map Pin', category: 'navigation', tags: ['location', 'marker', 'place'] },
    { name: 'Navigation', displayName: 'Navigation', category: 'navigation', tags: ['direction', 'arrow'] },
    { name: 'Navigation2', displayName: 'Navigation 2', category: 'navigation', tags: ['direction', 'arrow'] },
    { name: 'Compass', displayName: 'Compass', category: 'navigation', tags: ['direction', 'navigation'] },
    { name: 'Locate', displayName: 'Locate', category: 'navigation', tags: ['location', 'gps', 'find'] },
    { name: 'LocateFixed', displayName: 'Locate Fixed', category: 'navigation', tags: ['location', 'gps', 'current'] },
    { name: 'Route', displayName: 'Route', category: 'navigation', tags: ['path', 'directions'] },
    { name: 'Signpost', displayName: 'Signpost', category: 'navigation', tags: ['direction', 'sign'] },
    { name: 'Milestone', displayName: 'Milestone', category: 'navigation', tags: ['marker', 'waypoint'] },
    { name: 'Globe', displayName: 'Globe', category: 'navigation', tags: ['world', 'earth', 'internet', 'web'] },
    { name: 'Globe2', displayName: 'Globe 2', category: 'navigation', tags: ['world', 'earth', 'international'] },
    { name: 'ExternalLink', displayName: 'External Link', category: 'navigation', tags: ['link', 'open', 'new tab'] },
    { name: 'Link', displayName: 'Link', category: 'navigation', tags: ['url', 'chain', 'hyperlink'] },
    { name: 'Link2', displayName: 'Link 2', category: 'navigation', tags: ['url', 'chain'] },
    { name: 'Unlink', displayName: 'Unlink', category: 'navigation', tags: ['break', 'disconnect'] },
    { name: 'Bookmark', displayName: 'Bookmark', category: 'navigation', tags: ['save', 'favorite', 'flag'] },
    { name: 'BookmarkPlus', displayName: 'Bookmark Plus', category: 'navigation', tags: ['save', 'add'] },
    { name: 'Flag', displayName: 'Flag', category: 'navigation', tags: ['mark', 'report'] },
    { name: 'Anchor', displayName: 'Anchor', category: 'navigation', tags: ['link', 'marine'] },
  ],

  actions: [
    { name: 'Search', displayName: 'Search', category: 'actions', tags: ['find', 'magnify', 'look'] },
    { name: 'ZoomIn', displayName: 'Zoom In', category: 'actions', tags: ['magnify', 'enlarge'] },
    { name: 'ZoomOut', displayName: 'Zoom Out', category: 'actions', tags: ['magnify', 'shrink'] },
    { name: 'Settings', displayName: 'Settings', category: 'actions', tags: ['gear', 'cog', 'preferences'] },
    { name: 'Settings2', displayName: 'Settings 2', category: 'actions', tags: ['sliders', 'preferences'] },
    { name: 'Sliders', displayName: 'Sliders', category: 'actions', tags: ['settings', 'controls'] },
    { name: 'SlidersHorizontal', displayName: 'Sliders Horizontal', category: 'actions', tags: ['settings', 'controls'] },
    { name: 'Filter', displayName: 'Filter', category: 'actions', tags: ['funnel', 'sort'] },
    { name: 'SortAsc', displayName: 'Sort Ascending', category: 'actions', tags: ['sort', 'order', 'ascending'] },
    { name: 'SortDesc', displayName: 'Sort Descending', category: 'actions', tags: ['sort', 'order', 'descending'] },
    { name: 'ArrowUpDown', displayName: 'Arrow Up Down', category: 'actions', tags: ['sort', 'reorder'] },
    { name: 'Copy', displayName: 'Copy', category: 'actions', tags: ['duplicate', 'clipboard'] },
    { name: 'Clipboard', displayName: 'Clipboard', category: 'actions', tags: ['paste', 'copy'] },
    { name: 'ClipboardCopy', displayName: 'Clipboard Copy', category: 'actions', tags: ['copy', 'paste'] },
    { name: 'ClipboardCheck', displayName: 'Clipboard Check', category: 'actions', tags: ['done', 'copied'] },
    { name: 'Scissors', displayName: 'Scissors', category: 'actions', tags: ['cut', 'trim'] },
    { name: 'Trash', displayName: 'Trash', category: 'actions', tags: ['delete', 'remove', 'bin'] },
    { name: 'Trash2', displayName: 'Trash 2', category: 'actions', tags: ['delete', 'remove', 'bin'] },
    { name: 'Eraser', displayName: 'Eraser', category: 'actions', tags: ['delete', 'remove', 'clear'] },
    { name: 'Edit', displayName: 'Edit', category: 'actions', tags: ['pencil', 'write', 'modify'] },
    { name: 'Edit2', displayName: 'Edit 2', category: 'actions', tags: ['pencil', 'write'] },
    { name: 'Edit3', displayName: 'Edit 3', category: 'actions', tags: ['pencil', 'write'] },
    { name: 'Pen', displayName: 'Pen', category: 'actions', tags: ['write', 'draw'] },
    { name: 'PenTool', displayName: 'Pen Tool', category: 'actions', tags: ['draw', 'design'] },
    { name: 'Paintbrush', displayName: 'Paintbrush', category: 'actions', tags: ['paint', 'draw', 'design'] },
    { name: 'Palette', displayName: 'Palette', category: 'actions', tags: ['color', 'paint', 'art'] },
    { name: 'Pipette', displayName: 'Pipette', category: 'actions', tags: ['color picker', 'eyedropper'] },
    { name: 'Maximize', displayName: 'Maximize', category: 'actions', tags: ['fullscreen', 'expand'] },
    { name: 'Maximize2', displayName: 'Maximize 2', category: 'actions', tags: ['fullscreen', 'expand'] },
    { name: 'Minimize', displayName: 'Minimize', category: 'actions', tags: ['shrink', 'reduce'] },
    { name: 'Minimize2', displayName: 'Minimize 2', category: 'actions', tags: ['shrink', 'reduce'] },
    { name: 'Move', displayName: 'Move', category: 'actions', tags: ['drag', 'reposition'] },
    { name: 'Grab', displayName: 'Grab', category: 'actions', tags: ['hand', 'drag', 'move'] },
    { name: 'Hand', displayName: 'Hand', category: 'actions', tags: ['grab', 'stop'] },
    { name: 'MousePointer', displayName: 'Mouse Pointer', category: 'actions', tags: ['cursor', 'click'] },
    { name: 'MousePointer2', displayName: 'Mouse Pointer 2', category: 'actions', tags: ['cursor', 'select'] },
    { name: 'Pointer', displayName: 'Pointer', category: 'actions', tags: ['hand', 'click', 'touch'] },
    { name: 'Target', displayName: 'Target', category: 'actions', tags: ['aim', 'focus', 'goal'] },
    { name: 'Crosshair', displayName: 'Crosshair', category: 'actions', tags: ['aim', 'target', 'focus'] },
  ],

  alerts: [
    { name: 'AlertCircle', displayName: 'Alert Circle', category: 'alerts', tags: ['warning', 'error', 'info'] },
    { name: 'AlertTriangle', displayName: 'Alert Triangle', category: 'alerts', tags: ['warning', 'caution', 'danger'] },
    { name: 'AlertOctagon', displayName: 'Alert Octagon', category: 'alerts', tags: ['stop', 'error', 'danger'] },
    { name: 'Info', displayName: 'Info', category: 'alerts', tags: ['information', 'help', 'about'] },
    { name: 'HelpCircle', displayName: 'Help Circle', category: 'alerts', tags: ['question', 'support', 'faq'] },
    { name: 'CircleHelp', displayName: 'Circle Help', category: 'alerts', tags: ['question', 'support'] },
    { name: 'CheckCircle', displayName: 'Check Circle', category: 'alerts', tags: ['success', 'done', 'complete'] },
    { name: 'CheckCircle2', displayName: 'Check Circle 2', category: 'alerts', tags: ['success', 'verified'] },
    { name: 'XCircle', displayName: 'X Circle', category: 'alerts', tags: ['error', 'close', 'cancel'] },
    { name: 'XOctagon', displayName: 'X Octagon', category: 'alerts', tags: ['error', 'stop', 'cancel'] },
    { name: 'Ban', displayName: 'Ban', category: 'alerts', tags: ['block', 'forbidden', 'prohibited'] },
    { name: 'ShieldAlert', displayName: 'Shield Alert', category: 'alerts', tags: ['security', 'warning'] },
    { name: 'ShieldCheck', displayName: 'Shield Check', category: 'alerts', tags: ['security', 'verified', 'safe'] },
    { name: 'ShieldX', displayName: 'Shield X', category: 'alerts', tags: ['security', 'error', 'unsafe'] },
    { name: 'Siren', displayName: 'Siren', category: 'alerts', tags: ['alarm', 'emergency', 'alert'] },
    { name: 'OctagonAlert', displayName: 'Octagon Alert', category: 'alerts', tags: ['warning', 'stop'] },
    { name: 'CircleAlert', displayName: 'Circle Alert', category: 'alerts', tags: ['warning', 'error'] },
    { name: 'TriangleAlert', displayName: 'Triangle Alert', category: 'alerts', tags: ['warning', 'caution'] },
    { name: 'BadgeAlert', displayName: 'Badge Alert', category: 'alerts', tags: ['warning', 'notification'] },
    { name: 'BadgeCheck', displayName: 'Badge Check', category: 'alerts', tags: ['verified', 'approved'] },
    { name: 'BadgeX', displayName: 'Badge X', category: 'alerts', tags: ['rejected', 'failed'] },
    { name: 'BadgeInfo', displayName: 'Badge Info', category: 'alerts', tags: ['information', 'help'] },
  ],

  charts: [
    { name: 'BarChart', displayName: 'Bar Chart', category: 'charts', tags: ['graph', 'statistics', 'data'] },
    { name: 'BarChart2', displayName: 'Bar Chart 2', category: 'charts', tags: ['graph', 'statistics'] },
    { name: 'BarChart3', displayName: 'Bar Chart 3', category: 'charts', tags: ['graph', 'horizontal'] },
    { name: 'BarChart4', displayName: 'Bar Chart 4', category: 'charts', tags: ['graph', 'horizontal'] },
    { name: 'BarChartBig', displayName: 'Bar Chart Big', category: 'charts', tags: ['graph', 'large'] },
    { name: 'BarChartHorizontal', displayName: 'Bar Chart Horizontal', category: 'charts', tags: ['graph', 'horizontal'] },
    { name: 'BarChartHorizontalBig', displayName: 'Bar Chart Horizontal Big', category: 'charts', tags: ['graph', 'large'] },
    { name: 'LineChart', displayName: 'Line Chart', category: 'charts', tags: ['graph', 'trend', 'data'] },
    { name: 'AreaChart', displayName: 'Area Chart', category: 'charts', tags: ['graph', 'filled'] },
    { name: 'PieChart', displayName: 'Pie Chart', category: 'charts', tags: ['graph', 'circular', 'percentage'] },
    { name: 'Activity', displayName: 'Activity', category: 'charts', tags: ['pulse', 'heartbeat', 'monitoring'] },
    { name: 'TrendingUp', displayName: 'Trending Up', category: 'charts', tags: ['increase', 'growth', 'arrow'] },
    { name: 'TrendingDown', displayName: 'Trending Down', category: 'charts', tags: ['decrease', 'decline', 'arrow'] },
    { name: 'Percent', displayName: 'Percent', category: 'charts', tags: ['percentage', 'ratio'] },
    { name: 'Calculator', displayName: 'Calculator', category: 'charts', tags: ['math', 'calculate', 'compute'] },
    { name: 'Scale', displayName: 'Scale', category: 'charts', tags: ['balance', 'weight', 'measure'] },
    { name: 'Gauge', displayName: 'Gauge', category: 'charts', tags: ['meter', 'measure', 'speedometer'] },
    { name: 'Binary', displayName: 'Binary', category: 'charts', tags: ['code', 'data', '01'] },
  ],

  development: [
    { name: 'Code', displayName: 'Code', category: 'development', tags: ['programming', 'brackets', 'html'] },
    { name: 'Code2', displayName: 'Code 2', category: 'development', tags: ['programming', 'brackets'] },
    { name: 'Terminal', displayName: 'Terminal', category: 'development', tags: ['console', 'command line', 'cli'] },
    { name: 'TerminalSquare', displayName: 'Terminal Square', category: 'development', tags: ['console', 'cli'] },
    { name: 'Braces', displayName: 'Braces', category: 'development', tags: ['code', 'json', 'object'] },
    { name: 'Brackets', displayName: 'Brackets', category: 'development', tags: ['code', 'array'] },
    { name: 'Bug', displayName: 'Bug', category: 'development', tags: ['error', 'debug', 'insect'] },
    { name: 'BugOff', displayName: 'Bug Off', category: 'development', tags: ['fixed', 'resolved'] },
    { name: 'BugPlay', displayName: 'Bug Play', category: 'development', tags: ['debug', 'run'] },
    { name: 'GitBranch', displayName: 'Git Branch', category: 'development', tags: ['version control', 'branch'] },
    { name: 'GitCommit', displayName: 'Git Commit', category: 'development', tags: ['version control', 'commit'] },
    { name: 'GitMerge', displayName: 'Git Merge', category: 'development', tags: ['version control', 'merge'] },
    { name: 'GitPullRequest', displayName: 'Git Pull Request', category: 'development', tags: ['version control', 'pr'] },
    { name: 'GitFork', displayName: 'Git Fork', category: 'development', tags: ['version control', 'fork'] },
    { name: 'GitCompare', displayName: 'Git Compare', category: 'development', tags: ['version control', 'diff'] },
    { name: 'Github', displayName: 'GitHub', category: 'development', tags: ['git', 'repository', 'code'] },
    { name: 'Gitlab', displayName: 'GitLab', category: 'development', tags: ['git', 'repository'] },
    { name: 'Package', displayName: 'Package', category: 'development', tags: ['npm', 'module', 'library'] },
    { name: 'PackageOpen', displayName: 'Package Open', category: 'development', tags: ['npm', 'unpack'] },
    { name: 'PackageCheck', displayName: 'Package Check', category: 'development', tags: ['installed', 'verified'] },
    { name: 'PackagePlus', displayName: 'Package Plus', category: 'development', tags: ['add', 'install'] },
    { name: 'PackageX', displayName: 'Package X', category: 'development', tags: ['remove', 'uninstall'] },
    { name: 'Webhook', displayName: 'Webhook', category: 'development', tags: ['api', 'callback', 'hook'] },
    { name: 'Puzzle', displayName: 'Puzzle', category: 'development', tags: ['extension', 'plugin', 'addon'] },
    { name: 'Component', displayName: 'Component', category: 'development', tags: ['module', 'element', 'block'] },
    { name: 'Variable', displayName: 'Variable', category: 'development', tags: ['x', 'math', 'code'] },
    { name: 'Regex', displayName: 'Regex', category: 'development', tags: ['pattern', 'expression'] },
    { name: 'SquareCode', displayName: 'Square Code', category: 'development', tags: ['embed', 'snippet'] },
    { name: 'FileCode2', displayName: 'File Code 2', category: 'development', tags: ['source', 'script'] },
  ],

  editing: [
    { name: 'Type', displayName: 'Type', category: 'editing', tags: ['text', 'font', 'typography'] },
    { name: 'Bold', displayName: 'Bold', category: 'editing', tags: ['text', 'strong', 'format'] },
    { name: 'Italic', displayName: 'Italic', category: 'editing', tags: ['text', 'emphasis', 'format'] },
    { name: 'Underline', displayName: 'Underline', category: 'editing', tags: ['text', 'format'] },
    { name: 'Strikethrough', displayName: 'Strikethrough', category: 'editing', tags: ['text', 'deleted', 'format'] },
    { name: 'Subscript', displayName: 'Subscript', category: 'editing', tags: ['text', 'format', 'math'] },
    { name: 'Superscript', displayName: 'Superscript', category: 'editing', tags: ['text', 'format', 'math'] },
    { name: 'AlignLeft', displayName: 'Align Left', category: 'editing', tags: ['text', 'alignment'] },
    { name: 'AlignCenter', displayName: 'Align Center', category: 'editing', tags: ['text', 'alignment'] },
    { name: 'AlignRight', displayName: 'Align Right', category: 'editing', tags: ['text', 'alignment'] },
    { name: 'AlignJustify', displayName: 'Align Justify', category: 'editing', tags: ['text', 'alignment'] },
    { name: 'IndentIncrease', displayName: 'Indent Increase', category: 'editing', tags: ['text', 'paragraph'] },
    { name: 'IndentDecrease', displayName: 'Indent Decrease', category: 'editing', tags: ['text', 'paragraph'] },
    { name: 'ListOrdered', displayName: 'Ordered List', category: 'editing', tags: ['numbers', 'list'] },
    { name: 'ListTodo', displayName: 'Todo List', category: 'editing', tags: ['checklist', 'tasks'] },
    { name: 'Quote', displayName: 'Quote', category: 'editing', tags: ['blockquote', 'citation'] },
    { name: 'Heading', displayName: 'Heading', category: 'editing', tags: ['title', 'h1'] },
    { name: 'Heading1', displayName: 'Heading 1', category: 'editing', tags: ['title', 'h1'] },
    { name: 'Heading2', displayName: 'Heading 2', category: 'editing', tags: ['subtitle', 'h2'] },
    { name: 'Heading3', displayName: 'Heading 3', category: 'editing', tags: ['h3'] },
    { name: 'Heading4', displayName: 'Heading 4', category: 'editing', tags: ['h4'] },
    { name: 'Heading5', displayName: 'Heading 5', category: 'editing', tags: ['h5'] },
    { name: 'Heading6', displayName: 'Heading 6', category: 'editing', tags: ['h6'] },
    { name: 'Pilcrow', displayName: 'Pilcrow', category: 'editing', tags: ['paragraph', 'text'] },
    { name: 'TextCursor', displayName: 'Text Cursor', category: 'editing', tags: ['input', 'caret'] },
    { name: 'TextCursorInput', displayName: 'Text Cursor Input', category: 'editing', tags: ['field'] },
    { name: 'CaseSensitive', displayName: 'Case Sensitive', category: 'editing', tags: ['search', 'text'] },
    { name: 'CaseUpper', displayName: 'Case Upper', category: 'editing', tags: ['uppercase', 'caps'] },
    { name: 'CaseLower', displayName: 'Case Lower', category: 'editing', tags: ['lowercase'] },
    { name: 'RemoveFormatting', displayName: 'Remove Formatting', category: 'editing', tags: ['clear', 'plain'] },
    { name: 'Highlighter', displayName: 'Highlighter', category: 'editing', tags: ['mark', 'color'] },
    { name: 'SpellCheck', displayName: 'Spell Check', category: 'editing', tags: ['grammar', 'check'] },
    { name: 'SpellCheck2', displayName: 'Spell Check 2', category: 'editing', tags: ['grammar'] },
    { name: 'WrapText', displayName: 'Wrap Text', category: 'editing', tags: ['line break', 'wrap'] },
  ],

  layout: [
    { name: 'PanelLeft', displayName: 'Panel Left', category: 'layout', tags: ['sidebar', 'layout'] },
    { name: 'PanelRight', displayName: 'Panel Right', category: 'layout', tags: ['sidebar', 'layout'] },
    { name: 'PanelTop', displayName: 'Panel Top', category: 'layout', tags: ['header', 'layout'] },
    { name: 'PanelBottom', displayName: 'Panel Bottom', category: 'layout', tags: ['footer', 'layout'] },
    { name: 'PanelLeftClose', displayName: 'Panel Left Close', category: 'layout', tags: ['sidebar', 'collapse'] },
    { name: 'PanelRightClose', displayName: 'Panel Right Close', category: 'layout', tags: ['sidebar', 'collapse'] },
    { name: 'PanelTopClose', displayName: 'Panel Top Close', category: 'layout', tags: ['header', 'collapse'] },
    { name: 'PanelBottomClose', displayName: 'Panel Bottom Close', category: 'layout', tags: ['footer', 'collapse'] },
    { name: 'LayoutDashboard', displayName: 'Layout Dashboard', category: 'layout', tags: ['grid', 'widgets'] },
    { name: 'LayoutTemplate', displayName: 'Layout Template', category: 'layout', tags: ['page', 'structure'] },
    { name: 'Columns', displayName: 'Columns', category: 'layout', tags: ['grid', 'columns', 'layout'] },
    { name: 'Rows', displayName: 'Rows', category: 'layout', tags: ['grid', 'rows', 'layout'] },
    { name: 'Table', displayName: 'Table', category: 'layout', tags: ['grid', 'data', 'spreadsheet'] },
    { name: 'Table2', displayName: 'Table 2', category: 'layout', tags: ['grid', 'data'] },
    { name: 'Grid3X3', displayName: 'Table Cells', category: 'layout', tags: ['grid', 'cells'] },
    { name: 'TableProperties', displayName: 'Table Properties', category: 'layout', tags: ['settings'] },
    { name: 'SquareSplitVertical', displayName: 'Split Vertical', category: 'layout', tags: ['divide', 'split'] },
    { name: 'SquareSplitHorizontal', displayName: 'Split Horizontal', category: 'layout', tags: ['divide', 'split'] },
    { name: 'SeparatorHorizontal', displayName: 'Separator Horizontal', category: 'layout', tags: ['divider', 'line'] },
    { name: 'SeparatorVertical', displayName: 'Separator Vertical', category: 'layout', tags: ['divider', 'line'] },
    { name: 'Expand', displayName: 'Expand', category: 'layout', tags: ['resize', 'enlarge'] },
    { name: 'Shrink', displayName: 'Shrink', category: 'layout', tags: ['resize', 'reduce'] },
    { name: 'RectangleHorizontal', displayName: 'Rectangle Horizontal', category: 'layout', tags: ['shape', 'box'] },
    { name: 'RectangleVertical', displayName: 'Rectangle Vertical', category: 'layout', tags: ['shape', 'box'] },
    { name: 'Ratio', displayName: 'Ratio', category: 'layout', tags: ['aspect ratio', 'size'] },
    { name: 'Scaling', displayName: 'Aspect Ratio', category: 'layout', tags: ['size', 'proportion'] },
    { name: 'Crop', displayName: 'Crop', category: 'layout', tags: ['trim', 'cut', 'image'] },
    { name: 'FlipHorizontal', displayName: 'Flip Horizontal', category: 'layout', tags: ['mirror', 'transform'] },
    { name: 'FlipVertical', displayName: 'Flip Vertical', category: 'layout', tags: ['mirror', 'transform'] },
    { name: 'Rotate3d', displayName: 'Rotate 3D', category: 'layout', tags: ['transform', '3d'] },
  ],

  social: [
    { name: 'Github', displayName: 'GitHub', category: 'social', tags: ['social', 'git', 'code'] },
    { name: 'Twitter', displayName: 'Twitter', category: 'social', tags: ['social', 'x', 'tweet'] },
    { name: 'Facebook', displayName: 'Facebook', category: 'social', tags: ['social', 'fb', 'meta'] },
    { name: 'Instagram', displayName: 'Instagram', category: 'social', tags: ['social', 'ig', 'photo'] },
    { name: 'Linkedin', displayName: 'LinkedIn', category: 'social', tags: ['social', 'professional', 'job'] },
    { name: 'Youtube', displayName: 'YouTube', category: 'social', tags: ['social', 'video', 'stream'] },
    { name: 'Twitch', displayName: 'Twitch', category: 'social', tags: ['social', 'streaming', 'gaming'] },
    { name: 'Dribbble', displayName: 'Dribbble', category: 'social', tags: ['social', 'design', 'portfolio'] },
    { name: 'Figma', displayName: 'Figma', category: 'social', tags: ['design', 'tool', 'ui'] },
    { name: 'Framer', displayName: 'Framer', category: 'social', tags: ['design', 'prototype'] },
    { name: 'Slack', displayName: 'Slack', category: 'social', tags: ['chat', 'team', 'communication'] },
    { name: 'MessageCircle', displayName: 'Discord', category: 'social', tags: ['chat', 'community', 'gaming'] },
    { name: 'Globe', displayName: 'Chrome', category: 'social', tags: ['browser', 'google'] },
    { name: 'Smartphone', displayName: 'Apple', category: 'social', tags: ['brand', 'mac', 'ios'] },
    { name: 'User', displayName: 'User', category: 'social', tags: ['person', 'profile', 'account'] },
    { name: 'Users', displayName: 'Users', category: 'social', tags: ['people', 'group', 'team'] },
    { name: 'UserPlus', displayName: 'User Plus', category: 'social', tags: ['add friend', 'follow'] },
    { name: 'UserMinus', displayName: 'User Minus', category: 'social', tags: ['remove friend', 'unfollow'] },
    { name: 'UserCheck', displayName: 'User Check', category: 'social', tags: ['verified', 'approved'] },
    { name: 'UserX', displayName: 'User X', category: 'social', tags: ['remove', 'block'] },
    { name: 'UserCircle', displayName: 'User Circle', category: 'social', tags: ['avatar', 'profile'] },
    { name: 'UserCircle2', displayName: 'User Circle 2', category: 'social', tags: ['avatar', 'profile'] },
    { name: 'Contact', displayName: 'Contact', category: 'social', tags: ['address book', 'person'] },
    { name: 'Contact2', displayName: 'Contact 2', category: 'social', tags: ['address book'] },
    { name: 'UsersRound', displayName: 'Users Round', category: 'social', tags: ['group', 'team'] },
    { name: 'UserRound', displayName: 'User Round', category: 'social', tags: ['person', 'avatar'] },
    { name: 'CircleUser', displayName: 'Circle User', category: 'social', tags: ['avatar', 'account'] },
    { name: 'CircleUserRound', displayName: 'Circle User Round', category: 'social', tags: ['avatar'] },
    { name: 'PersonStanding', displayName: 'Person Standing', category: 'social', tags: ['human', 'figure'] },
    { name: 'Accessibility', displayName: 'Accessibility', category: 'social', tags: ['a11y', 'inclusive'] },
  ],

  commerce: [
    { name: 'ShoppingCart', displayName: 'Shopping Cart', category: 'commerce', tags: ['cart', 'buy', 'ecommerce'] },
    { name: 'ShoppingBag', displayName: 'Shopping Bag', category: 'commerce', tags: ['bag', 'buy', 'store'] },
    { name: 'ShoppingBasket', displayName: 'Shopping Basket', category: 'commerce', tags: ['basket', 'buy'] },
    { name: 'Store', displayName: 'Store', category: 'commerce', tags: ['shop', 'building'] },
    { name: 'Storefront', displayName: 'Storefront', category: 'commerce', tags: ['shop', 'market'] },
    { name: 'CreditCard', displayName: 'Credit Card', category: 'commerce', tags: ['payment', 'card', 'bank'] },
    { name: 'Wallet', displayName: 'Wallet', category: 'commerce', tags: ['money', 'payment'] },
    { name: 'Wallet2', displayName: 'Wallet 2', category: 'commerce', tags: ['money', 'crypto'] },
    { name: 'Banknote', displayName: 'Banknote', category: 'commerce', tags: ['money', 'cash', 'bill'] },
    { name: 'Coins', displayName: 'Coins', category: 'commerce', tags: ['money', 'currency'] },
    { name: 'DollarSign', displayName: 'Dollar Sign', category: 'commerce', tags: ['money', 'usd', 'currency'] },
    { name: 'Euro', displayName: 'Euro', category: 'commerce', tags: ['money', 'eur', 'currency'] },
    { name: 'PoundSterling', displayName: 'Pound Sterling', category: 'commerce', tags: ['money', 'gbp'] },
    { name: 'IndianRupee', displayName: 'Indian Rupee', category: 'commerce', tags: ['money', 'inr'] },
    { name: 'JapaneseYen', displayName: 'Japanese Yen', category: 'commerce', tags: ['money', 'jpy'] },
    { name: 'Bitcoin', displayName: 'Bitcoin', category: 'commerce', tags: ['crypto', 'btc', 'currency'] },
    { name: 'Receipt', displayName: 'Receipt', category: 'commerce', tags: ['bill', 'invoice', 'paper'] },
    { name: 'Ticket', displayName: 'Ticket', category: 'commerce', tags: ['coupon', 'voucher', 'pass'] },
    { name: 'Tag', displayName: 'Tag', category: 'commerce', tags: ['label', 'price', 'sale'] },
    { name: 'Tags', displayName: 'Tags', category: 'commerce', tags: ['labels', 'multiple'] },
    { name: 'BadgeDollarSign', displayName: 'Badge Dollar', category: 'commerce', tags: ['price', 'sale'] },
    { name: 'BadgePercent', displayName: 'Badge Percent', category: 'commerce', tags: ['discount', 'sale'] },
    { name: 'Percent', displayName: 'Percent', category: 'commerce', tags: ['discount', 'off'] },
    { name: 'Gift', displayName: 'Gift', category: 'commerce', tags: ['present', 'reward'] },
    { name: 'Package', displayName: 'Package', category: 'commerce', tags: ['box', 'shipping', 'delivery'] },
    { name: 'Truck', displayName: 'Truck', category: 'commerce', tags: ['delivery', 'shipping', 'transport'] },
    { name: 'PackageCheck', displayName: 'Package Check', category: 'commerce', tags: ['delivered', 'complete'] },
    { name: 'HandCoins', displayName: 'Hand Coins', category: 'commerce', tags: ['payment', 'tip'] },
    { name: 'Landmark', displayName: 'Landmark', category: 'commerce', tags: ['bank', 'building', 'finance'] },
    { name: 'PiggyBank', displayName: 'Piggy Bank', category: 'commerce', tags: ['savings', 'money'] },
  ],

  travel: [
    { name: 'Plane', displayName: 'Plane', category: 'travel', tags: ['flight', 'airplane', 'travel'] },
    { name: 'PlaneTakeoff', displayName: 'Plane Takeoff', category: 'travel', tags: ['departure', 'flight'] },
    { name: 'PlaneLanding', displayName: 'Plane Landing', category: 'travel', tags: ['arrival', 'flight'] },
    { name: 'Car', displayName: 'Car', category: 'travel', tags: ['vehicle', 'auto', 'drive'] },
    { name: 'CarFront', displayName: 'Car Front', category: 'travel', tags: ['vehicle', 'auto'] },
    { name: 'Bus', displayName: 'Bus', category: 'travel', tags: ['vehicle', 'public transport'] },
    { name: 'BusFront', displayName: 'Bus Front', category: 'travel', tags: ['vehicle', 'transit'] },
    { name: 'Train', displayName: 'Train', category: 'travel', tags: ['rail', 'subway', 'metro'] },
    { name: 'TrainFront', displayName: 'Train Front', category: 'travel', tags: ['rail', 'subway'] },
    { name: 'TramFront', displayName: 'Tram Front', category: 'travel', tags: ['streetcar', 'transit'] },
    { name: 'Ship', displayName: 'Ship', category: 'travel', tags: ['boat', 'cruise', 'sea'] },
    { name: 'Sailboat', displayName: 'Sailboat', category: 'travel', tags: ['boat', 'sailing'] },
    { name: 'Bike', displayName: 'Bike', category: 'travel', tags: ['bicycle', 'cycling'] },
    { name: 'Luggage', displayName: 'Luggage', category: 'travel', tags: ['suitcase', 'baggage', 'travel'] },
    { name: 'Briefcase', displayName: 'Briefcase', category: 'travel', tags: ['business', 'work', 'bag'] },
    { name: 'Backpack', displayName: 'Backpack', category: 'travel', tags: ['bag', 'school', 'hiking'] },
    { name: 'Tent', displayName: 'Tent', category: 'travel', tags: ['camping', 'outdoor'] },
    { name: 'Mountain', displayName: 'Mountain', category: 'travel', tags: ['hiking', 'nature', 'outdoor'] },
    { name: 'MountainSnow', displayName: 'Mountain Snow', category: 'travel', tags: ['skiing', 'winter'] },
    { name: 'TreePine', displayName: 'Tree Pine', category: 'travel', tags: ['forest', 'nature'] },
    { name: 'Trees', displayName: 'Trees', category: 'travel', tags: ['forest', 'nature', 'woods'] },
    { name: 'Palmtree', displayName: 'Palm Tree', category: 'travel', tags: ['beach', 'tropical', 'vacation'] },
    { name: 'Building', displayName: 'Building', category: 'travel', tags: ['hotel', 'city', 'office'] },
    { name: 'Building2', displayName: 'Building 2', category: 'travel', tags: ['hotel', 'city'] },
    { name: 'Hotel', displayName: 'Hotel', category: 'travel', tags: ['accommodation', 'bed', 'stay'] },
    { name: 'Bed', displayName: 'Bed', category: 'travel', tags: ['hotel', 'sleep', 'accommodation'] },
    { name: 'BedDouble', displayName: 'Bed Double', category: 'travel', tags: ['hotel', 'room'] },
    { name: 'BedSingle', displayName: 'Bed Single', category: 'travel', tags: ['hotel', 'room'] },
    { name: 'Ticket', displayName: 'Ticket', category: 'travel', tags: ['boarding pass', 'entry'] },
    { name: 'Passport', displayName: 'Passport', category: 'travel', tags: ['travel', 'id', 'document'] },
  ],

  health: [
    { name: 'Heart', displayName: 'Heart', category: 'health', tags: ['love', 'health', 'life'] },
    { name: 'HeartPulse', displayName: 'Heart Pulse', category: 'health', tags: ['heartbeat', 'health', 'vital'] },
    { name: 'Activity', displayName: 'Activity', category: 'health', tags: ['pulse', 'heartbeat', 'ecg'] },
    { name: 'Stethoscope', displayName: 'Stethoscope', category: 'health', tags: ['doctor', 'medical', 'health'] },
    { name: 'Pill', displayName: 'Pill', category: 'health', tags: ['medicine', 'drug', 'tablet'] },
    { name: 'Syringe', displayName: 'Syringe', category: 'health', tags: ['injection', 'vaccine', 'needle'] },
    { name: 'Thermometer', displayName: 'Thermometer', category: 'health', tags: ['temperature', 'fever'] },
    { name: 'Bandage', displayName: 'Bandage', category: 'health', tags: ['wound', 'plaster', 'aid'] },
    { name: 'Cross', displayName: 'Cross', category: 'health', tags: ['medical', 'hospital', 'plus'] },
    { name: 'Hospital', displayName: 'Hospital', category: 'health', tags: ['medical', 'building', 'health'] },
    { name: 'Ambulance', displayName: 'Ambulance', category: 'health', tags: ['emergency', 'medical', 'vehicle'] },
    { name: 'Baby', displayName: 'Baby', category: 'health', tags: ['child', 'infant', 'newborn'] },
    { name: 'Brain', displayName: 'Brain', category: 'health', tags: ['mind', 'intelligence', 'think'] },
    { name: 'Bone', displayName: 'Bone', category: 'health', tags: ['skeleton', 'anatomy'] },
    { name: 'Dna', displayName: 'DNA', category: 'health', tags: ['genetics', 'biology', 'helix'] },
    { name: 'Dumbbell', displayName: 'Dumbbell', category: 'health', tags: ['fitness', 'gym', 'exercise'] },
    { name: 'Footprints', displayName: 'Footprints', category: 'health', tags: ['walking', 'steps', 'fitness'] },
    { name: 'PersonStanding', displayName: 'Person Standing', category: 'health', tags: ['human', 'body'] },
    { name: 'Weight', displayName: 'Weight', category: 'health', tags: ['scale', 'fitness', 'body'] },
    { name: 'Apple', displayName: 'Apple', category: 'health', tags: ['fruit', 'healthy', 'food'] },
    { name: 'Salad', displayName: 'Salad', category: 'health', tags: ['healthy', 'food', 'vegetable'] },
    { name: 'Droplet', displayName: 'Droplet', category: 'health', tags: ['water', 'blood', 'hydration'] },
    { name: 'Eye', displayName: 'Eye', category: 'health', tags: ['vision', 'see', 'view'] },
    { name: 'EyeOff', displayName: 'Eye Off', category: 'health', tags: ['hidden', 'blind'] },
    { name: 'Ear', displayName: 'Ear', category: 'health', tags: ['hearing', 'listen', 'audio'] },
    { name: 'EarOff', displayName: 'Ear Off', category: 'health', tags: ['deaf', 'mute'] },
    { name: 'Hand', displayName: 'Hand', category: 'health', tags: ['palm', 'touch', 'gesture'] },
    { name: 'Fingerprint', displayName: 'Fingerprint', category: 'health', tags: ['identity', 'biometric'] },
    { name: 'Scan', displayName: 'Scan', category: 'health', tags: ['xray', 'medical', 'diagnosis'] },
    { name: 'HeartHandshake', displayName: 'Heart Handshake', category: 'health', tags: ['care', 'support'] },
  ],

  nature: [
    { name: 'Sun', displayName: 'Sun', category: 'nature', tags: ['light', 'day', 'bright'] },
    { name: 'Moon', displayName: 'Moon', category: 'nature', tags: ['night', 'dark', 'lunar'] },
    { name: 'Star', displayName: 'Star', category: 'nature', tags: ['night', 'sky', 'favorite'] },
    { name: 'Sparkles', displayName: 'Sparkles', category: 'nature', tags: ['magic', 'stars', 'shine'] },
    { name: 'Flower', displayName: 'Flower', category: 'nature', tags: ['plant', 'garden', 'bloom'] },
    { name: 'Flower2', displayName: 'Flower 2', category: 'nature', tags: ['plant', 'garden'] },
    { name: 'Leaf', displayName: 'Leaf', category: 'nature', tags: ['plant', 'green', 'eco'] },
    { name: 'TreeDeciduous', displayName: 'Tree Deciduous', category: 'nature', tags: ['plant', 'forest'] },
    { name: 'TreePine', displayName: 'Tree Pine', category: 'nature', tags: ['plant', 'evergreen'] },
    { name: 'Trees', displayName: 'Trees', category: 'nature', tags: ['forest', 'woods'] },
    { name: 'Sprout', displayName: 'Sprout', category: 'nature', tags: ['plant', 'grow', 'seed'] },
    { name: 'Clover', displayName: 'Clover', category: 'nature', tags: ['luck', 'plant', 'irish'] },
    { name: 'Mountain', displayName: 'Mountain', category: 'nature', tags: ['hill', 'peak', 'outdoor'] },
    { name: 'MountainSnow', displayName: 'Mountain Snow', category: 'nature', tags: ['peak', 'winter'] },
    { name: 'Waves', displayName: 'Waves', category: 'nature', tags: ['water', 'sea', 'ocean'] },
    { name: 'Droplet', displayName: 'Droplet', category: 'nature', tags: ['water', 'rain', 'liquid'] },
    { name: 'Droplets', displayName: 'Droplets', category: 'nature', tags: ['water', 'rain'] },
    { name: 'Flame', displayName: 'Flame', category: 'nature', tags: ['fire', 'hot', 'burn'] },
    { name: 'Wind', displayName: 'Wind', category: 'nature', tags: ['air', 'breeze', 'blow'] },
    { name: 'Snowflake', displayName: 'Snowflake', category: 'nature', tags: ['cold', 'winter', 'ice'] },
    { name: 'Bug', displayName: 'Bug', category: 'nature', tags: ['insect', 'beetle'] },
    { name: 'Bird', displayName: 'Bird', category: 'nature', tags: ['animal', 'fly'] },
    { name: 'Fish', displayName: 'Fish', category: 'nature', tags: ['animal', 'sea', 'aquatic'] },
    { name: 'Cat', displayName: 'Cat', category: 'nature', tags: ['animal', 'pet', 'feline'] },
    { name: 'Dog', displayName: 'Dog', category: 'nature', tags: ['animal', 'pet', 'canine'] },
    { name: 'Rabbit', displayName: 'Rabbit', category: 'nature', tags: ['animal', 'bunny', 'pet'] },
    { name: 'Turtle', displayName: 'Turtle', category: 'nature', tags: ['animal', 'slow', 'reptile'] },
    { name: 'Squirrel', displayName: 'Squirrel', category: 'nature', tags: ['animal', 'rodent'] },
    { name: 'Rat', displayName: 'Rat', category: 'nature', tags: ['animal', 'rodent', 'mouse'] },
    { name: 'Shell', displayName: 'Shell', category: 'nature', tags: ['sea', 'beach', 'ocean'] },
  ],

  misc: [
    { name: 'Sparkle', displayName: 'Sparkle', category: 'misc', tags: ['magic', 'new', 'star'] },
    { name: 'Gem', displayName: 'Gem', category: 'misc', tags: ['diamond', 'jewel', 'premium'] },
    { name: 'Crown', displayName: 'Crown', category: 'misc', tags: ['king', 'queen', 'royal', 'premium'] },
    { name: 'Award', displayName: 'Award', category: 'misc', tags: ['trophy', 'prize', 'winner'] },
    { name: 'Trophy', displayName: 'Trophy', category: 'misc', tags: ['award', 'winner', 'prize'] },
    { name: 'Medal', displayName: 'Medal', category: 'misc', tags: ['award', 'badge', 'achievement'] },
    { name: 'PartyPopper', displayName: 'Party Popper', category: 'misc', tags: ['celebration', 'confetti'] },
    { name: 'Cake', displayName: 'Cake', category: 'misc', tags: ['birthday', 'celebration', 'dessert'] },
    { name: 'Gift', displayName: 'Gift', category: 'misc', tags: ['present', 'birthday', 'reward'] },
    { name: 'Balloon', displayName: 'Balloon', category: 'misc', tags: ['party', 'celebration'] },
    { name: 'Rocket', displayName: 'Rocket', category: 'misc', tags: ['launch', 'startup', 'fast'] },
    { name: 'Satellite', displayName: 'Satellite', category: 'misc', tags: ['space', 'orbit', 'signal'] },
    { name: 'Orbit', displayName: 'Orbit', category: 'misc', tags: ['space', 'planet', 'circle'] },
    { name: 'Atom', displayName: 'Atom', category: 'misc', tags: ['science', 'physics', 'molecule'] },
    { name: 'Magnet', displayName: 'Magnet', category: 'misc', tags: ['attract', 'physics'] },
    { name: 'Lightbulb', displayName: 'Lightbulb', category: 'misc', tags: ['idea', 'light', 'innovation'] },
    { name: 'LightbulbOff', displayName: 'Lightbulb Off', category: 'misc', tags: ['dark', 'off'] },
    { name: 'Key', displayName: 'Key', category: 'misc', tags: ['lock', 'security', 'password'] },
    { name: 'KeyRound', displayName: 'Key Round', category: 'misc', tags: ['lock', 'security'] },
    { name: 'Lock', displayName: 'Lock', category: 'misc', tags: ['security', 'private', 'password'] },
    { name: 'LockOpen', displayName: 'Lock Open', category: 'misc', tags: ['unlock', 'open'] },
    { name: 'Unlock', displayName: 'Unlock', category: 'misc', tags: ['open', 'access'] },
    { name: 'Shield', displayName: 'Shield', category: 'misc', tags: ['security', 'protection', 'safe'] },
    { name: 'Timer', displayName: 'Timer', category: 'misc', tags: ['time', 'countdown', 'clock'] },
    { name: 'Clock', displayName: 'Clock', category: 'misc', tags: ['time', 'hour', 'watch'] },
    { name: 'Hourglass', displayName: 'Hourglass', category: 'misc', tags: ['time', 'waiting', 'sand'] },
    { name: 'Calendar', displayName: 'Calendar', category: 'misc', tags: ['date', 'schedule', 'event'] },
    { name: 'CalendarDays', displayName: 'Calendar Days', category: 'misc', tags: ['date', 'schedule'] },
    { name: 'Alarm', displayName: 'Alarm', category: 'misc', tags: ['clock', 'wake', 'alert'] },
    { name: 'History', displayName: 'History', category: 'misc', tags: ['time', 'past', 'clock'] },
    { name: 'Glasses', displayName: 'Glasses', category: 'misc', tags: ['vision', 'read', 'see'] },
    { name: 'Binoculars', displayName: 'Binoculars', category: 'misc', tags: ['look', 'view', 'search'] },
    { name: 'Telescope', displayName: 'Telescope', category: 'misc', tags: ['look', 'space', 'astronomy'] },
    { name: 'Microscope', displayName: 'Microscope', category: 'misc', tags: ['science', 'zoom', 'lab'] },
    { name: 'Beaker', displayName: 'Beaker', category: 'misc', tags: ['science', 'lab', 'chemistry'] },
    { name: 'FlaskConical', displayName: 'Flask Conical', category: 'misc', tags: ['science', 'lab'] },
    { name: 'TestTube', displayName: 'Test Tube', category: 'misc', tags: ['science', 'lab', 'experiment'] },
    { name: 'Cog', displayName: 'Cog', category: 'misc', tags: ['gear', 'settings', 'mechanical'] },
    { name: 'Wrench', displayName: 'Wrench', category: 'misc', tags: ['tool', 'fix', 'repair'] },
    { name: 'Hammer', displayName: 'Hammer', category: 'misc', tags: ['tool', 'build', 'construct'] },
    { name: 'Screwdriver', displayName: 'Screwdriver', category: 'misc', tags: ['tool', 'fix', 'repair'] },
    { name: 'Ruler', displayName: 'Ruler', category: 'misc', tags: ['measure', 'length', 'tool'] },
    { name: 'Pencil', displayName: 'Pencil', category: 'misc', tags: ['write', 'draw', 'edit'] },
    { name: 'PencilRuler', displayName: 'Pencil Ruler', category: 'misc', tags: ['design', 'draw'] },
    { name: 'Brush', displayName: 'Brush', category: 'misc', tags: ['paint', 'draw', 'art'] },
    { name: 'Stamp', displayName: 'Stamp', category: 'misc', tags: ['mark', 'seal', 'approve'] },
    { name: 'Printer', displayName: 'Printer', category: 'misc', tags: ['print', 'paper', 'document'] },
    { name: 'Box', displayName: 'Box', category: 'misc', tags: ['package', 'container', 'cube'] },
    { name: 'Boxes', displayName: 'Boxes', category: 'misc', tags: ['packages', 'inventory'] },
    { name: 'Container', displayName: 'Container', category: 'misc', tags: ['box', 'storage', 'docker'] },
  ],
};

// ============================================================================
// CATEGORY METADATA
// ============================================================================

export const categoryMetadata: Record<IconCategory, { label: string; icon: IconName; description: string }> = {
  arrows: { label: 'Arrows', icon: 'ArrowRight', description: 'Directional and navigation arrows' },
  media: { label: 'Media', icon: 'Play', description: 'Audio, video, and image controls' },
  files: { label: 'Files', icon: 'File', description: 'Documents, folders, and storage' },
  communication: { label: 'Communication', icon: 'Mail', description: 'Email, chat, and messaging' },
  weather: { label: 'Weather', icon: 'Sun', description: 'Weather and climate icons' },
  devices: { label: 'Devices', icon: 'Laptop', description: 'Electronics and hardware' },
  shapes: { label: 'Shapes', icon: 'Circle', description: 'Geometric shapes and symbols' },
  navigation: { label: 'Navigation', icon: 'Home', description: 'Menus, maps, and navigation' },
  actions: { label: 'Actions', icon: 'Search', description: 'Common user actions' },
  alerts: { label: 'Alerts', icon: 'AlertCircle', description: 'Notifications and status' },
  charts: { label: 'Charts', icon: 'BarChart', description: 'Data visualization' },
  development: { label: 'Development', icon: 'Code', description: 'Programming and tools' },
  editing: { label: 'Editing', icon: 'Type', description: 'Text formatting and editing' },
  layout: { label: 'Layout', icon: 'LayoutGrid', description: 'Page structure and layout' },
  social: { label: 'Social', icon: 'Users', description: 'Social media and users' },
  commerce: { label: 'Commerce', icon: 'ShoppingCart', description: 'E-commerce and payments' },
  travel: { label: 'Travel', icon: 'Plane', description: 'Transportation and travel' },
  health: { label: 'Health', icon: 'Heart', description: 'Medical and wellness' },
  nature: { label: 'Nature', icon: 'Leaf', description: 'Plants, animals, and environment' },
  misc: { label: 'Miscellaneous', icon: 'Sparkles', description: 'Other useful icons' },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets all Lucide icon names (filtering out non-icon exports)
 */
export function getAllIconNames(): IconName[] {
  return Object.keys(LucideIcons).filter(
    (key) => typeof (LucideIcons as Record<string, unknown>)[key] === 'function' &&
             key !== 'createLucideIcon' &&
             key !== 'default' &&
             !key.startsWith('Lucide')
  ) as IconName[];
}

/**
 * Checks if an icon name exists in Lucide
 */
export function isValidIconName(name: string): name is LucideIconName {
  return name in LucideIcons && typeof (LucideIcons as Record<string, unknown>)[name] === 'function';
}

/**
 * Gets the Lucide icon component by name
 */
export function getIconComponent(name: IconName): React.ComponentType<LucideIcons.LucideProps> | null {
  const icon = (LucideIcons as Record<string, unknown>)[name as string];
  if (typeof icon === 'function') {
    return icon as React.ComponentType<LucideIcons.LucideProps>;
  }
  return null;
}

/**
 * Gets icon metadata if available in categories
 */
export function getIconMetadata(name: IconName): IconMetadata | null {
  for (const category of Object.keys(iconCategories) as IconCategory[]) {
    const found = iconCategories[category].find((icon) => icon.name === name);
    if (found) return found;
  }
  return null;
}

/**
 * Searches icons by name or tags
 */
export function searchIcons(query: string, limit?: number): IconMetadata[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    // Return all categorized icons
    const allIcons = Object.values(iconCategories).flat();
    return limit ? allIcons.slice(0, limit) : allIcons;
  }

  const results: IconMetadata[] = [];
  const seenNames = new Set<string>();

  // Search in categorized icons
  for (const category of Object.keys(iconCategories) as IconCategory[]) {
    for (const icon of iconCategories[category]) {
      if (seenNames.has(icon.name)) continue;

      const nameMatch = icon.displayName.toLowerCase().includes(normalizedQuery) ||
                       icon.name.toLowerCase().includes(normalizedQuery);
      const tagMatch = icon.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      if (nameMatch || tagMatch) {
        results.push(icon);
        seenNames.add(icon.name);

        if (limit && results.length >= limit) {
          return results;
        }
      }
    }
  }

  // Also search uncategorized Lucide icons
  const allNames = getAllIconNames();
  for (const name of allNames) {
    if (seenNames.has(name)) continue;

    if (name.toLowerCase().includes(normalizedQuery)) {
      results.push({
        name,
        displayName: formatIconName(name),
        category: 'misc',
        tags: [],
      });
      seenNames.add(name);

      if (limit && results.length >= limit) {
        return results;
      }
    }
  }

  return results;
}

/**
 * Gets icons by category
 */
export function getIconsByCategory(category: IconCategory): IconMetadata[] {
  return iconCategories[category] || [];
}

/**
 * Formats icon name for display (e.g., "ArrowUpRight" -> "Arrow Up Right")
 */
export function formatIconName(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Gets the size value from preset or number
 */
export function getIconSize(size: IconSize | number): number {
  return typeof size === 'number' ? size : iconSizePresets[size];
}

/**
 * Builds icon class names from config
 */
export function buildIconClasses(config: Partial<IconConfig>): string {
  const classes: string[] = [];

  // Size
  if (config.size && typeof config.size !== 'number') {
    classes.push(iconSizeClasses[config.size]);
  }

  // Color
  if (config.color && iconColorPresets[config.color]) {
    classes.push(iconColorPresets[config.color]);
  } else if (config.color) {
    classes.push(config.color);
  }

  // Animation
  if (config.animation && config.animation !== 'none') {
    classes.push(iconAnimationClasses[config.animation]);
  }

  // Additional classes
  if (config.className) {
    classes.push(config.className);
  }

  return classes.filter(Boolean).join(' ');
}

// ============================================================================
// CUSTOM SVG HANDLING
// ============================================================================

const CUSTOM_ICONS_STORAGE_KEY = 'tailwind-builder-custom-icons';

/**
 * Saves a custom SVG icon
 */
export function saveCustomIcon(name: string, svg: string): CustomIcon {
  const customIcons = getCustomIcons();

  const newIcon: CustomIcon = {
    id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    svg: sanitizeSvg(svg),
    createdAt: Date.now(),
  };

  customIcons.push(newIcon);

  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_ICONS_STORAGE_KEY, JSON.stringify(customIcons));
  }

  return newIcon;
}

/**
 * Gets all custom icons from storage
 */
export function getCustomIcons(): CustomIcon[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(CUSTOM_ICONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Deletes a custom icon by ID
 */
export function deleteCustomIcon(id: string): void {
  const customIcons = getCustomIcons().filter((icon) => icon.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_ICONS_STORAGE_KEY, JSON.stringify(customIcons));
  }
}

/**
 * Sanitizes SVG content for safe storage
 */
export function sanitizeSvg(svg: string): string {
  // Remove any script tags or event handlers
  let sanitized = svg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');

  // Ensure it has xmlns
  if (!sanitized.includes('xmlns=')) {
    sanitized = sanitized.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  return sanitized;
}

/**
 * Parses SVG to extract viewBox and path data
 */
export function parseSvg(svg: string): { viewBox: string; paths: string[] } | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) return null;

    const viewBox = svgElement.getAttribute('viewBox') || '0 0 24 24';
    const paths: string[] = [];

    svgElement.querySelectorAll('path').forEach((path) => {
      const d = path.getAttribute('d');
      if (d) paths.push(d);
    });

    return { viewBox, paths };
  } catch {
    return null;
  }
}

// ============================================================================
// ICON TO COMPONENT CONVERTER
// ============================================================================

/**
 * Converts an icon configuration to a React component string
 */
export function iconToComponentString(
  iconName: IconName,
  config: Partial<IconConfig> = {},
  componentName?: string
): string {
  const name = componentName || `${iconName}Icon`;
  const size = config.size ? getIconSize(config.size) : 24;
  const strokeWidth = config.strokeWidth ?? 2;

  const classNames = buildIconClasses(config);
  const classNameAttr = classNames ? ` className="${classNames}"` : '';

  return `import { ${iconName} } from 'lucide-react';

function ${name}() {
  return (
    <${iconName}
      size={${size}}
      strokeWidth={${strokeWidth}}${classNameAttr}
    />
  );
}

export default ${name};`;
}

/**
 * Converts a custom SVG to a React component string
 */
export function customSvgToComponentString(
  svg: string,
  componentName: string,
  config: Partial<IconConfig> = {}
): string {
  const parsed = parseSvg(svg);
  if (!parsed) return '';

  const size = config.size ? getIconSize(config.size) : 24;
  const classNames = buildIconClasses(config);
  const classNameAttr = classNames ? ` className="${classNames}"` : '';

  const pathElements = parsed.paths
    .map((d) => `      <path d="${d}" />`)
    .join('\n');

  return `function ${componentName}({ size = ${size}, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="${parsed.viewBox}"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"${classNameAttr}
      {...props}
    >
${pathElements}
    </svg>
  );
}

export default ${componentName};`;
}

// ============================================================================
// RECENTLY USED AND FAVORITES
// ============================================================================

const RECENT_ICONS_KEY = 'tailwind-builder-recent-icons';
const FAVORITE_ICONS_KEY = 'tailwind-builder-favorite-icons';
const MAX_RECENT_ICONS = 20;

/**
 * Adds an icon to recently used
 */
export function addToRecentIcons(iconName: IconName): void {
  if (typeof window === 'undefined') return;

  try {
    const recent = getRecentIcons().filter((name) => name !== iconName);
    recent.unshift(iconName);

    if (recent.length > MAX_RECENT_ICONS) {
      recent.pop();
    }

    localStorage.setItem(RECENT_ICONS_KEY, JSON.stringify(recent));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Gets recently used icons
 */
export function getRecentIcons(): IconName[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(RECENT_ICONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Toggles an icon in favorites
 */
export function toggleFavoriteIcon(iconName: IconName): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const favorites = getFavoriteIcons();
    const index = favorites.indexOf(iconName);

    if (index > -1) {
      favorites.splice(index, 1);
      localStorage.setItem(FAVORITE_ICONS_KEY, JSON.stringify(favorites));
      return false;
    } else {
      favorites.push(iconName);
      localStorage.setItem(FAVORITE_ICONS_KEY, JSON.stringify(favorites));
      return true;
    }
  } catch {
    return false;
  }
}

/**
 * Checks if an icon is a favorite
 */
export function isFavoriteIcon(iconName: IconName): boolean {
  return getFavoriteIcons().includes(iconName);
}

/**
 * Gets favorite icons
 */
export function getFavoriteIcons(): IconName[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(FAVORITE_ICONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export { LucideIcons };
