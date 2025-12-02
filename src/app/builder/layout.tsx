'use client';

import * as Tooltip from '@radix-ui/react-tooltip';

interface BuilderLayoutProps {
  children: React.ReactNode;
}

export default function BuilderLayout({ children }: BuilderLayoutProps) {
  return (
    <Tooltip.Provider delayDuration={300} skipDelayDuration={0}>
      {children}
    </Tooltip.Provider>
  );
}
