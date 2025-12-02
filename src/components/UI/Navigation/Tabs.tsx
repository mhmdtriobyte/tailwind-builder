import { cn } from '@/utils/cn';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'boxed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  size = 'md',
  fullWidth = false,
  className,
}: TabsProps) {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };

  const getVariantClasses = (isActive: boolean, isDisabled: boolean) => {
    if (isDisabled) {
      return 'text-gray-400 cursor-not-allowed';
    }

    switch (variant) {
      case 'underline':
        return cn(
          'border-b-2 -mb-px transition-colors',
          isActive
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        );
      case 'pills':
        return cn(
          'rounded-full transition-colors',
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        );
      case 'boxed':
        return cn(
          'rounded-lg transition-colors',
          isActive
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        );
      default:
        return '';
    }
  };

  const containerClasses = {
    underline: 'border-b border-gray-200',
    pills: 'bg-gray-100 p-1 rounded-full',
    boxed: 'bg-gray-100 p-1 rounded-xl',
  };

  return (
    <div
      className={cn(containerClasses[variant], className)}
      role="tablist"
      aria-label="Tab navigation"
    >
      <div
        className={cn(
          'flex',
          fullWidth ? 'w-full' : 'inline-flex',
          variant === 'underline' && 'gap-0',
          variant !== 'underline' && 'gap-1'
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const isDisabled = tab.disabled || false;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              aria-disabled={isDisabled}
              tabIndex={isActive ? 0 : -1}
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(tab.id)}
              className={cn(
                'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                sizeClasses[size],
                getVariantClasses(isActive, isDisabled),
                fullWidth && 'flex-1'
              )}
            >
              {tab.icon && (
                <span className="flex-shrink-0" aria-hidden="true">
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-medium rounded-full',
                    isActive
                      ? variant === 'pills'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-600'
                      : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({
  id,
  activeTab,
  children,
  className,
}: TabPanelProps) {
  const isActive = id === activeTab;

  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      hidden={!isActive}
      tabIndex={0}
      className={cn(
        'focus:outline-none',
        isActive ? 'block' : 'hidden',
        className
      )}
    >
      {children}
    </div>
  );
}
