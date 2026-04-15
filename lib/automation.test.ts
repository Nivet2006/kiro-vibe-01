// Unit tests for automation engine
// Validates: Requirements 1.3, 1.4, 1.5, 3.1, 4.1, 4.2, 4.3

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  executeTransitionSideEffects,
  decrementInventory,
  createStaffTask,
  createRestockTask,
} from './automation';
import { Order, OrderItem, InventoryItem } from '@/types';

describe('automation', () => {
  beforeEach(() => {
    // Clear console.log mocks
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('executeTransitionSideEffects', () => {
    it('should calculate countdown timer when transitioning to cooking', async () => {
      vi.clearAllMocks();
      
      const order: Order = {
        id: 'order-1',
        tableNumber: 5,
        items: [
          { name: 'Margherita Pizza', quantity: 2, prepTime: 15 },
          { name: 'Caesar Salad', quantity: 1, prepTime: 5 },
        ],
        status: 'pending',
        priorityScore: 18.0,
        createdAt: new Date().toISOString(),
        startedAt: null,
        dispatchedAt: null,
        countdownTimer: null,
      };

      await executeTransitionSideEffects(order, 'cooking');

      // Verify console.log was called with timer calculation
      // Total prep time: (15 * 2) + (5 * 1) = 35 minutes = 2100 seconds
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('2100 seconds')
      );
    });

    it('should create delivery task when transitioning to quality_check', async () => {
      vi.clearAllMocks();
      
      const order: Order = {
        id: 'order-2',
        tableNumber: 3,
        items: [{ name: 'Grilled Chicken', quantity: 1, prepTime: 20 }],
        status: 'cooking',
        priorityScore: 15.0,
        createdAt: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        dispatchedAt: null,
        countdownTimer: 1200,
      };

      await executeTransitionSideEffects(order, 'quality_check');

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Created delivery task for order #order-2')
      );
    });

    it('should decrement inventory and create cleaning task when transitioning to dispatched', async () => {
      vi.clearAllMocks();
      
      const order: Order = {
        id: 'order-3',
        tableNumber: 7,
        items: [{ name: 'Caesar Salad', quantity: 2, prepTime: 5 }],
        status: 'ready',
        priorityScore: 10.0,
        createdAt: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        dispatchedAt: null,
        countdownTimer: 0,
      };

      await executeTransitionSideEffects(order, 'dispatched');

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Decremented inventory for order #order-3')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Created cleaning task for table 7')
      );
    });

    it('should not execute side effects for pending status', async () => {
      vi.clearAllMocks();
      
      const order: Order = {
        id: 'order-4',
        tableNumber: 1,
        items: [{ name: 'Margherita Pizza', quantity: 1, prepTime: 15 }],
        status: 'pending',
        priorityScore: 12.0,
        createdAt: new Date().toISOString(),
        startedAt: null,
        dispatchedAt: null,
        countdownTimer: null,
      };

      await executeTransitionSideEffects(order, 'pending');

      // Should only log the initial message
      expect(console.log).toHaveBeenCalledTimes(1);
    });
  });

  describe('decrementInventory', () => {
    it('should process items with ingredient mappings', async () => {
      const items: OrderItem[] = [
        { name: 'Margherita Pizza', quantity: 1, prepTime: 15 },
        { name: 'Caesar Salad', quantity: 2, prepTime: 5 },
      ];

      await decrementInventory(items);

      // Verify deductions are logged
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Decrementing inventory for 2 order items')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('flour')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('romaine-lettuce')
      );
    });

    it('should skip items without ingredient mappings', async () => {
      const items: OrderItem[] = [
        { name: 'Unknown Item', quantity: 1, prepTime: 10 },
      ];

      await decrementInventory(items);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('No ingredient mapping found for item: Unknown Item')
      );
    });

    it('should calculate correct deduction amounts', async () => {
      const items: OrderItem[] = [
        { name: 'Grilled Chicken', quantity: 3, prepTime: 20 },
      ];

      await decrementInventory(items);

      // chicken-breast: 5.0 * 3 = 15%
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Deducting 15% from ingredient: chicken-breast')
      );
      // olive-oil: 0.5 * 3 = 1.5%
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Deducting 1.5% from ingredient: olive-oil')
      );
    });
  });

  describe('createStaffTask', () => {
    it('should create a staff task with generated ID', async () => {
      await createStaffTask({
        taskType: 'delivery',
        description: 'Deliver order #123 to table 5',
        priority: 'high',
        assignedTo: null,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Creating staff task: delivery')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Staff task created with ID:')
      );
    });

    it('should handle different task types', async () => {
      await createStaffTask({
        taskType: 'cleaning',
        description: 'Clean table 3',
        priority: 'low',
        assignedTo: null,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Creating staff task: cleaning')
      );
    });
  });

  describe('createRestockTask', () => {
    it('should create a restock task with inventory details', async () => {
      const inventory: InventoryItem = {
        id: 'inv-1',
        itemName: 'Mozzarella',
        stockLevel: 15,
        reorderPoint: 20,
        unit: '%',
      };

      await createRestockTask(inventory);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Creating restock task for inventory item: Mozzarella')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Restock task created for Mozzarella')
      );
    });

    it('should include current stock level and reorder point in description', async () => {
      const inventory: InventoryItem = {
        id: 'inv-2',
        itemName: 'Flour',
        stockLevel: 10,
        reorderPoint: 25,
        unit: '%',
      };

      await createRestockTask(inventory);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Creating staff task: restock')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Flour')
      );
    });
  });
});

// Feature: kitchenos, Property 3: Delivery Task Created on Order Ready
// Feature: kitchenos, Property 4: Inventory Deduction Matches Ingredient Map
// Feature: kitchenos, Property 5: Cleaning Task Created on Order Dispatch
// Feature: kitchenos, Property 10: Restock Task Created When Inventory Below Reorder Point

import fc from 'fast-check';

describe('Automation Engine - Property Tests', () => {
  describe('Property 3: Delivery Task Created on Order Ready', () => {
    it('should create delivery task when order transitions to quality_check', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            tableNumber: fc.integer({ min: 1, max: 50 }),
            items: fc.array(
              fc.record({
                name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
                quantity: fc.integer({ min: 1, max: 10 }),
                prepTime: fc.integer({ min: 1, max: 60 }),
              }),
              { minLength: 1, maxLength: 10 }
            ),
            status: fc.constant('cooking' as const),
            priorityScore: fc.float({ min: 0, max: 100 }),
            createdAt: fc.date().map(d => d.toISOString()),
            startedAt: fc.date().map(d => d.toISOString()),
            dispatchedAt: fc.constant(null),
            countdownTimer: fc.integer({ min: 0, max: 3600 }),
          }),
          async (order) => {
            vi.clearAllMocks();
            await executeTransitionSideEffects(order, 'quality_check');
            
            // Check that delivery task creation was logged
            const calls = (console.log as any).mock.calls;
            const logOutput = calls.map((call: any[]) => (call[0] || '').toString()).join(' ');
            const hasDeliveryTask = logOutput.toLowerCase().includes('delivery') &&
                                   logOutput.includes(order.id);
            
            return hasDeliveryTask;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 5: Cleaning Task Created on Order Dispatch', () => {
    it('should create cleaning task when order transitions to dispatched', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            tableNumber: fc.integer({ min: 1, max: 50 }),
            items: fc.array(
              fc.record({
                name: fc.constantFrom('Margherita Pizza', 'Caesar Salad', 'Grilled Chicken'),
                quantity: fc.integer({ min: 1, max: 5 }),
                prepTime: fc.integer({ min: 1, max: 60 }),
              }),
              { minLength: 1, maxLength: 5 }
            ),
            status: fc.constant('ready' as const),
            priorityScore: fc.float({ min: 0, max: 100 }),
            createdAt: fc.date().map(d => d.toISOString()),
            startedAt: fc.date().map(d => d.toISOString()),
            dispatchedAt: fc.constant(null),
            countdownTimer: fc.constant(0),
          }),
          async (order) => {
            vi.clearAllMocks();
            await executeTransitionSideEffects(order, 'dispatched');
            
            // Check that cleaning task creation was logged
            const calls = (console.log as any).mock.calls;
            const logOutput = calls.map((call: any[]) => (call[0] || '').toString()).join(' ');
            const hasCleaningTask = logOutput.toLowerCase().includes('cleaning') &&
                                   logOutput.includes(order.tableNumber.toString());
            
            return hasCleaningTask;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 4: Inventory Deduction Matches Ingredient Map', () => {
    it('should decrement inventory according to ingredient map', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              name: fc.constantFrom('Margherita Pizza', 'Caesar Salad', 'Grilled Chicken'),
              quantity: fc.integer({ min: 1, max: 5 }),
              prepTime: fc.integer({ min: 1, max: 60 }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          async (items) => {
            vi.clearAllMocks();
            await decrementInventory(items);
            
            // Check that inventory deduction was logged for each item
            const calls = (console.log as any).mock.calls;
            const logOutput = calls.map((call: any[]) => (call[0] || '').toString()).join(' ');
            
            // For each item, verify that its ingredients were decremented
            for (const item of items) {
              if (item.name === 'Margherita Pizza') {
                if (!logOutput.includes('flour') || !logOutput.includes('tomato-sauce') || !logOutput.includes('mozzarella')) {
                  return false;
                }
              } else if (item.name === 'Caesar Salad') {
                if (!logOutput.includes('romaine-lettuce') || !logOutput.includes('parmesan') || !logOutput.includes('caesar-dressing')) {
                  return false;
                }
              } else if (item.name === 'Grilled Chicken') {
                if (!logOutput.includes('chicken-breast') || !logOutput.includes('olive-oil')) {
                  return false;
                }
              }
            }
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 10: Restock Task Created When Inventory Below Reorder Point', () => {
    it('should create restock task when stock level falls below reorder point', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            itemName: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 1),
            stockLevel: fc.integer({ min: 0, max: 100 }),
            reorderPoint: fc.integer({ min: 1, max: 100 }),
            unit: fc.constantFrom('kg', 'L', '%', 'units'),
          }),
          async (inventory) => {
            // Only test when stock is below reorder point
            if (inventory.stockLevel >= inventory.reorderPoint) {
              return true; // Skip this case
            }

            vi.clearAllMocks();
            await createRestockTask(inventory);
            
            // Check that restock task creation was logged
            const calls = (console.log as any).mock.calls;
            const logOutput = calls.map((call: any[]) => (call[0] || '').toString()).join(' ');
            const hasRestockTask = logOutput.toLowerCase().includes('restock') &&
                                   logOutput.includes(inventory.itemName);
            
            return hasRestockTask;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
