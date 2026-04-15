import { describe, it, expect, beforeEach } from 'vitest';
import { useKitchenOSStore } from './index';

/**
 * Unit tests for Zustand global store
 * 
 * **Validates: Requirements 9.1, 12.3**
 */
describe('KitchenOS Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useKitchenOSStore.setState({
      manualOverrideMode: false,
      isOfflineMode: false,
      selectedModule: 'command-center',
    });
  });

  describe('Manual Override Mode (Requirement 9.1)', () => {
    it('should initialize with manual override mode disabled', () => {
      const { manualOverrideMode } = useKitchenOSStore.getState();
      expect(manualOverrideMode).toBe(false);
    });

    it('should enable manual override mode', () => {
      const { setManualOverrideMode } = useKitchenOSStore.getState();
      
      setManualOverrideMode(true);
      
      const { manualOverrideMode } = useKitchenOSStore.getState();
      expect(manualOverrideMode).toBe(true);
    });

    it('should disable manual override mode', () => {
      const { setManualOverrideMode } = useKitchenOSStore.getState();
      
      setManualOverrideMode(true);
      setManualOverrideMode(false);
      
      const { manualOverrideMode } = useKitchenOSStore.getState();
      expect(manualOverrideMode).toBe(false);
    });

    it('should toggle manual override mode multiple times', () => {
      const { setManualOverrideMode } = useKitchenOSStore.getState();
      
      setManualOverrideMode(true);
      expect(useKitchenOSStore.getState().manualOverrideMode).toBe(true);
      
      setManualOverrideMode(false);
      expect(useKitchenOSStore.getState().manualOverrideMode).toBe(false);
      
      setManualOverrideMode(true);
      expect(useKitchenOSStore.getState().manualOverrideMode).toBe(true);
    });
  });

  describe('Offline Mode (Requirement 12.3)', () => {
    it('should initialize with offline mode disabled', () => {
      const { isOfflineMode } = useKitchenOSStore.getState();
      expect(isOfflineMode).toBe(false);
    });

    it('should enable offline mode', () => {
      const { setOfflineMode } = useKitchenOSStore.getState();
      
      setOfflineMode(true);
      
      const { isOfflineMode } = useKitchenOSStore.getState();
      expect(isOfflineMode).toBe(true);
    });

    it('should disable offline mode', () => {
      const { setOfflineMode } = useKitchenOSStore.getState();
      
      setOfflineMode(true);
      setOfflineMode(false);
      
      const { isOfflineMode } = useKitchenOSStore.getState();
      expect(isOfflineMode).toBe(false);
    });

    it('should toggle offline mode multiple times', () => {
      const { setOfflineMode } = useKitchenOSStore.getState();
      
      setOfflineMode(true);
      expect(useKitchenOSStore.getState().isOfflineMode).toBe(true);
      
      setOfflineMode(false);
      expect(useKitchenOSStore.getState().isOfflineMode).toBe(false);
      
      setOfflineMode(true);
      expect(useKitchenOSStore.getState().isOfflineMode).toBe(true);
    });
  });

  describe('Selected Module', () => {
    it('should initialize with command-center as default module', () => {
      const { selectedModule } = useKitchenOSStore.getState();
      expect(selectedModule).toBe('command-center');
    });

    it('should update selected module', () => {
      const { setSelectedModule } = useKitchenOSStore.getState();
      
      setSelectedModule('kds');
      
      const { selectedModule } = useKitchenOSStore.getState();
      expect(selectedModule).toBe('kds');
    });

    it('should switch between different modules', () => {
      const { setSelectedModule } = useKitchenOSStore.getState();
      
      setSelectedModule('kds');
      expect(useKitchenOSStore.getState().selectedModule).toBe('kds');
      
      setSelectedModule('ai-hub');
      expect(useKitchenOSStore.getState().selectedModule).toBe('ai-hub');
      
      setSelectedModule('staff-dispatch');
      expect(useKitchenOSStore.getState().selectedModule).toBe('staff-dispatch');
      
      setSelectedModule('command-center');
      expect(useKitchenOSStore.getState().selectedModule).toBe('command-center');
    });
  });

  describe('State Independence', () => {
    it('should update manual override mode without affecting other state', () => {
      const { setManualOverrideMode, setOfflineMode, setSelectedModule } = useKitchenOSStore.getState();
      
      setOfflineMode(true);
      setSelectedModule('kds');
      
      setManualOverrideMode(true);
      
      const state = useKitchenOSStore.getState();
      expect(state.manualOverrideMode).toBe(true);
      expect(state.isOfflineMode).toBe(true);
      expect(state.selectedModule).toBe('kds');
    });

    it('should update offline mode without affecting other state', () => {
      const { setManualOverrideMode, setOfflineMode, setSelectedModule } = useKitchenOSStore.getState();
      
      setManualOverrideMode(true);
      setSelectedModule('ai-hub');
      
      setOfflineMode(true);
      
      const state = useKitchenOSStore.getState();
      expect(state.manualOverrideMode).toBe(true);
      expect(state.isOfflineMode).toBe(true);
      expect(state.selectedModule).toBe('ai-hub');
    });

    it('should update selected module without affecting other state', () => {
      const { setManualOverrideMode, setOfflineMode, setSelectedModule } = useKitchenOSStore.getState();
      
      setManualOverrideMode(true);
      setOfflineMode(true);
      
      setSelectedModule('staff-dispatch');
      
      const state = useKitchenOSStore.getState();
      expect(state.manualOverrideMode).toBe(true);
      expect(state.isOfflineMode).toBe(true);
      expect(state.selectedModule).toBe('staff-dispatch');
    });
  });
});
