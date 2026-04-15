/**
 * Example usage of the KitchenOS Zustand store
 * 
 * This file demonstrates how to use the store in React components.
 * Delete this file after reviewing the examples.
 */

import { useKitchenOSStore } from './index';

// Example 1: Using the store in a component
export function CommandCenterExample() {
  // Select specific state slices to prevent unnecessary re-renders
  const manualOverrideMode = useKitchenOSStore((state) => state.manualOverrideMode);
  const setManualOverrideMode = useKitchenOSStore((state) => state.setManualOverrideMode);
  
  const isOfflineMode = useKitchenOSStore((state) => state.isOfflineMode);
  
  return (
    <div>
      {/* Display offline mode badge */}
      {isOfflineMode && (
        <div className="bg-amber-500 text-black px-2 py-1">
          OFFLINE MODE
        </div>
      )}
      
      {/* Manual override toggle */}
      <button onClick={() => setManualOverrideMode(!manualOverrideMode)}>
        {manualOverrideMode ? 'Disable' : 'Enable'} Manual Override
      </button>
      
      {/* Display warning when manual override is active */}
      {manualOverrideMode && (
        <div className="bg-red-500 text-white px-4 py-2">
          AI AUTOMATION DISABLED
        </div>
      )}
    </div>
  );
}

// Example 2: Using multiple store values
export function NavigationExample() {
  const selectedModule = useKitchenOSStore((state) => state.selectedModule);
  const setSelectedModule = useKitchenOSStore((state) => state.setSelectedModule);
  
  const modules = ['command-center', 'kds', 'ai-hub', 'staff-dispatch'];
  
  return (
    <nav>
      {modules.map((module) => (
        <button
          key={module}
          onClick={() => setSelectedModule(module)}
          className={selectedModule === module ? 'active' : ''}
        >
          {module}
        </button>
      ))}
    </nav>
  );
}

// Example 3: Reading store state outside React components
export function checkSystemStatus() {
  const state = useKitchenOSStore.getState();
  
  console.log('Manual Override:', state.manualOverrideMode);
  console.log('Offline Mode:', state.isOfflineMode);
  console.log('Selected Module:', state.selectedModule);
  
  return {
    isManual: state.manualOverrideMode,
    isOffline: state.isOfflineMode,
    currentModule: state.selectedModule,
  };
}

// Example 4: Setting store state outside React components
export function enableOfflineMode() {
  useKitchenOSStore.getState().setOfflineMode(true);
}

export function disableManualOverride() {
  useKitchenOSStore.getState().setManualOverrideMode(false);
}
