// Badge component with color variants
// Validates: Requirements 15.7

import React from 'react';

export interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  const variantStyles = {
    success: 'bg-green-500/20 text-green-400 border-green-500',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500',
    danger: 'bg-red-500/20 text-red-400 border-red-500',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
