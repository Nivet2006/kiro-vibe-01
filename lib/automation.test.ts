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
