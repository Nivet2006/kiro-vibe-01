import { create } from 'zustand';

/**
 * Global state management for KitchenOS
 * 
 * Design Decision: Keep store minimal. Most data lives in component state 
 * managed by custom hooks. Zustand only stores truly global UI state 
 * (manual override, offline mode, navigation).
 * 
 * Validates: Requirements 9.1, 12.3
 */
export interface KitchenOSStore {
  // Manual override mode (Requirement 9.1)
  manualOverrideMode: boolean;
  setManualOverrideMode: (enabled: boolean) => void;
  
  // System status (Requirement 12.3)
  isOfflineMode: boolean;
  setOfflineMode: (offline: boolean) => void;
  
  // UI state
  selectedModule: string;
  setSelectedModule: (module: string) => void;
}

export const useKitchenOSStore = create<KitchenOSStore>((set) => ({
  // Initial state
  manualOverrideMode: false,
  isOfflineMode: false,
  selectedModule: 'command-center',
  
  // Actions
  setManualOverrideMode: (enabled: boolean) => 
    set({ manualOverrideMode: enabled }),
  
  setOfflineMode: (offline: boolean) => 
    set({ isOfflineMode: offline }),
  
  setSelectedModule: (module: string) => 
    set({ selectedModule: module }),
}));
