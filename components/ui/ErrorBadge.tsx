// Inline error badge for error states
// Validates: Requirements 12.6

import React from 'react';

export interface ErrorBadgeProps {
  message: string;
  className?: string;
}

export function ErrorBadge({ message, className = '' }: ErrorBadgeProps) {
  return (
    <div className={`bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded ${className}`}>
      <span className="font-medium">Error:</span> {message}
    </div>
  );
}
