// Unit tests for state machine
// Validates: Requirements 1.1, 1.6

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { ORDER_STATE_MACHINE, canTransition, transitionOrder } from './stateMachine';
import type { Order, OrderStatus } from '../types';

describe('ORDER_STATE_MACHINE', () => {
  it('should define valid transitions for all states', () => {
    expect(ORDER_STATE_MACHINE.pending).toBe('cooking');
    expect(ORDER_STATE_MACHINE.cooking).toBe('quality_check');
    expect(ORDER_STATE_MACHINE.quality_check).toBe('ready');
    expect(ORDER_STATE_MACHINE.ready).toBe('dispatched');
    expect(ORDER_STATE_MACHINE.dispatched).toBe(null);
  });
});

describe('canTransition', () => {
  it('should return true for valid transitions', () => {
    expect(canTransition('pending', 'cooking')).toBe(true);
    expect(canTransition('cooking', 'quality_check')).toBe(true);
    expect(canTransition('quality_check', 'ready')).toBe(true);
    expect(canTransition('ready', 'dispatched')).toBe(true);
  });

  it('should return false for invalid transitions', () => {
    expect(canTransition('pending', 'ready')).toBe(false);
    expect(canTransition('cooking', 'dispatched')).toBe(false);
    expect(canTransition('dispatched', 'pending')).toBe(false);
    expect(canTransition('ready', 'cooking')).toBe(false);
  });

  it('should return false for transitions from terminal state', () => {
    expect(canTransition('dispatched', 'pending')).toBe(false);
    expect(canTransition('dispatched', 'cooking')).toBe(false);
    expect(canTransition('dispatched', 'quality_check')).toBe(false);
    expect(canTransition('dispatched', 'ready')).toBe(false);
  });
});

describe('transitionOrder', () => {
  let mockOrder: Order;

  beforeEach(() => {
    mockOrder = {
      id: 'order-123',
      tableNumber: 5,
      items: [
        { name: 'Burger', quantity: 2, prepTime: 10 },
        { name: 'Fries', quantity: 1, prepTime: 5 },
      ],
      status: 'pending',
      priorityScore: 75,
      createdAt: '2024-01-01T12:00:00Z',
      startedAt: null,
      dispatchedAt: null,
      countdownTimer: null,
    };

    // Mock console.log to avoid cluttering test output
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should allow valid transitions without manual override', async () => {
    await expect(transitionOrder(mockOrder, 'cooking', false)).resolves.not.toThrow();
  });

  it('should reject invalid transitions without manual override', async () => {
    await expect(transitionOrder(mockOrder, 'ready', false)).rejects.toThrow(
      'Invalid transition: pending -> ready'
    );
  });

  it('should allow invalid transitions with manual override', async () => {
    await expect(transitionOrder(mockOrder, 'ready', true)).resolves.not.toThrow();
  });

  it('should allow transitions from any state with manual override', async () => {
    mockOrder.status = 'dispatched';
    await expect(transitionOrder(mockOrder, 'pending', true)).resolves.not.toThrow();
  });

  it('should handle transition to cooking state', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    await transitionOrder(mockOrder, 'cooking', false);
    
    // Verify timer calculation: (10*2 + 5*1) * 60 = 1500 seconds
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Update order order-123 timer to 1500 seconds')
    );
  });

  it('should handle transition to quality_check state', async () => {
    mockOrder.status = 'cooking';
    const consoleSpy = vi.spyOn(console, 'log');
    await transitionOrder(mockOrder, 'quality_check', false);
    
    // Verify delivery task creation
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Deliver order #order-123 to table 5')
    );
  });

  it('should handle transition to dispatched state', async () => {
    mockOrder.status = 'ready';
    const consoleSpy = vi.spyOn(console, 'log');
    await transitionOrder(mockOrder, 'dispatched', false);
    
    // Verify inventory decrement
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Decrement inventory for 2 items')
    );
    
    // Verify cleaning task creation
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Clean and reset table 5')
    );
  });

  it('should log INFO for normal transitions', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    await transitionOrder(mockOrder, 'cooking', false);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[INFO] Order #order-123 transitioned to cooking')
    );
  });

  it('should log WARN for manual override transitions', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    await transitionOrder(mockOrder, 'ready', true);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[WARN] MANUAL: Order #order-123 moved to ready')
    );
  });
});

// Property-based tests for state machine

describe('Property Tests: State Machine Transitions', () => {
  /**
   * Property 1: State Machine Enforces Valid Sequential Transitions
   * **Validates: Requirements 1.1**
   * 
   * For any order in any valid state, attempting to transition to a non-sequential state
   * SHALL be rejected, and only transitions to the immediate next state in the sequence
   * (pending → cooking → quality_check → ready → dispatched) SHALL succeed.
   */
  it('should enforce valid sequential transitions for any order and target status', async () => {
    // Define all possible order statuses
    const allStatuses: OrderStatus[] = ['pending', 'cooking', 'quality_check', 'ready', 'dispatched'];
    
    // Arbitrary generator for order status
    const orderStatusArb = fc.constantFrom<OrderStatus>(...allStatuses);
    
    // Arbitrary generator for target status
    const targetStatusArb = fc.constantFrom<OrderStatus>(...allStatuses);
    
    // Arbitrary generator for order items
    const orderItemArb = fc.record({
      name: fc.string({ minLength: 1, maxLength: 20 }),
      quantity: fc.integer({ min: 1, max: 10 }),
      prepTime: fc.integer({ min: 1, max: 60 }),
    });
    
    // Arbitrary generator for orders
    const orderArb = fc.record({
      id: fc.uuid(),
      tableNumber: fc.integer({ min: 1, max: 50 }),
      items: fc.array(orderItemArb, { minLength: 1, maxLength: 5 }),
      status: orderStatusArb,
      priorityScore: fc.integer({ min: 0, max: 100 }),
      createdAt: fc.date().map(d => d.toISOString()),
      startedAt: fc.option(fc.date().map(d => d.toISOString()), { nil: null }),
      dispatchedAt: fc.option(fc.date().map(d => d.toISOString()), { nil: null }),
      countdownTimer: fc.option(fc.integer({ min: 0, max: 3600 }), { nil: null }),
    });
    
    await fc.assert(
      fc.asyncProperty(
        orderArb,
        targetStatusArb,
        async (order, targetStatus) => {
          // Mock console.log to avoid cluttering test output
          const originalLog = console.log;
          console.log = vi.fn();
          
          try {
            // Determine if this transition should be valid
            const expectedNextStatus = ORDER_STATE_MACHINE[order.status];
            const shouldSucceed = expectedNextStatus === targetStatus;
            
            if (shouldSucceed) {
              // Valid transition: should not throw
              await expect(
                transitionOrder(order, targetStatus, false)
              ).resolves.not.toThrow();
            } else {
              // Invalid transition: should throw error
              await expect(
                transitionOrder(order, targetStatus, false)
              ).rejects.toThrow(/Invalid transition/);
            }
          } finally {
            console.log = originalLog;
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
