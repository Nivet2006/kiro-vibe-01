// Progress bar with color coding
// Validates: Requirements 7.2

import React from 'react';

export interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export function ProgressBar({ value, className = '' }: ProgressBarProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));
  
  // Color coding based on percentage thresholds
  const getColor = () => {
    if (clampedValue > 50) return 'bg-green-500';
    if (clampedValue >= 20) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className={`w-full bg-gray-700 rounded-full h-2 ${className}`}>
      <div
        className={`h-2 rounded-full transition-all ${getColor()}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
