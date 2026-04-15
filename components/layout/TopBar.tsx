// Top bar with system status and controls
// Validates: Requirements 14.3, 9.5, 12.4

'use client';

import React from 'react';
import { useKitchenOSStore } from '@/store';
import { Badge } from '@/components/ui/Badge';

export function TopBar() {
  const { isOfflineMode, manualOverrideMode } = useKitchenOSStore();
  const currentTime = new Date().toLocaleTimeString();

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 font-mono">{currentTime}</span>
          
          {isOfflineMode && (
            <Badge variant="warning">OFFLINE MODE</Badge>
          )}
          
          {manualOverrideMode && (
            <Badge variant="danger">MANUAL OVERRIDE ACTIVE</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-400">System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
