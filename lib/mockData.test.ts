// Unit tests for mock data module
// Validates: Requirements 12.1

import { describe, it, expect } from 'vitest';
import {
  mockOrders,
  mockInventory,
  mockStaffTasks,
  mockPipelineLogs,
} from './mockData';
import type { OrderStatus } from '@/types';

describe('Mock Data Module', () => {
  describe('mockOrders', () => {
    it('should contain orders in all pipeline states', () => {
      const statuses = new Set(mockOrders.map((order) => order.status));
      const expectedStatuses: OrderStatus[] = [
        'pending',
        'cooking',
        'quality_check',
        'ready',
        'dispatched',
      ];

      expectedStatuses.forEach((status) => {
        expect(statuses.has(status)).toBe(true);
      });
    });

    it('should contain high priority orders', () => {
      const highPriorityOrders = mockOrders.filter(
        (order) => order.priorityScore > 30
      );
      expect(highPriorityOrders.length).toBeGreaterThan(0);
    });

    it('should contain orders with countdown timers', () => {
      const ordersWithTimers = mockOrders.filter(
        (order) => order.countdownTimer !== null
      );
      expect(ordersWithTimers.length).toBeGreaterThan(0);
    });

    it('should contain orders with warning-level countdown timers (<20%)', () => {
      const warningOrders = mockOrders.filter(
        (order) =>
          order.countdownTimer !== null && order.countdownTimer < 300 // Less than 5 minutes
      );
      expect(warningOrders.length).toBeGreaterThan(0);
    });

    it('should have valid order structure', () => {
      mockOrders.forEach((order) => {
        expect(order.id).toBeDefined();
        expect(order.tableNumber).toBeGreaterThan(0);
        expect(order.items).toBeInstanceOf(Array);
        expect(order.items.length).toBeGreaterThan(0);
        expect(order.status).toBeDefined();
        expect(order.priorityScore).toBeGreaterThanOrEqual(0);
        expect(order.createdAt).toBeDefined();
      });
    });
  });

  describe('mockInventory', () => {
    it('should contain items with healthy stock levels (>50%)', () => {
      const healthyItems = mockInventory.filter(
        (item) => item.stockLevel > 50
      );
      expect(healthyItems.length).toBeGreaterThan(0);
    });

    it('should contain items with medium stock levels (20-50%)', () => {
      const mediumItems = mockInventory.filter(
        (item) => item.stockLevel >= 20 && item.stockLevel <= 50
      );
      expect(mediumItems.length).toBeGreaterThan(0);
    });

    it('should contain items with low stock levels (<20%)', () => {
      const lowItems = mockInventory.filter((item) => item.stockLevel < 20);
      expect(lowItems.length).toBeGreaterThan(0);
    });

    it('should contain items below reorder point', () => {
      const belowReorderPoint = mockInventory.filter(
        (item) => item.stockLevel < item.reorderPoint
      );
      expect(belowReorderPoint.length).toBeGreaterThan(0);
    });

    it('should contain items at 0% stock level', () => {
      const emptyItems = mockInventory.filter(
        (item) => item.stockLevel === 0
      );
      expect(emptyItems.length).toBeGreaterThan(0);
    });

    it('should have valid inventory structure', () => {
      mockInventory.forEach((item) => {
        expect(item.id).toBeDefined();
        expect(item.itemName).toBeDefined();
        expect(item.stockLevel).toBeGreaterThanOrEqual(0);
        expect(item.stockLevel).toBeLessThanOrEqual(100);
        expect(item.reorderPoint).toBeGreaterThan(0);
        expect(item.reorderPoint).toBeLessThanOrEqual(100);
        expect(item.unit).toBeDefined();
      });
    });
  });

  describe('mockStaffTasks', () => {
    it('should contain all task types', () => {
      const taskTypes = new Set(mockStaffTasks.map((task) => task.taskType));
      expect(taskTypes.has('delivery')).toBe(true);
      expect(taskTypes.has('cleaning')).toBe(true);
      expect(taskTypes.has('restock')).toBe(true);
      expect(taskTypes.has('custom')).toBe(true);
    });

    it('should contain tasks with all priority levels', () => {
      const priorities = new Set(mockStaffTasks.map((task) => task.priority));
      expect(priorities.has('high')).toBe(true);
      expect(priorities.has('medium')).toBe(true);
      expect(priorities.has('low')).toBe(true);
    });

    it('should contain tasks in all statuses', () => {
      const statuses = new Set(mockStaffTasks.map((task) => task.status));
      expect(statuses.has('pending')).toBe(true);
      expect(statuses.has('in_progress')).toBe(true);
      expect(statuses.has('completed')).toBe(true);
    });

    it('should contain delivery tasks with high priority', () => {
      const deliveryTasks = mockStaffTasks.filter(
        (task) => task.taskType === 'delivery'
      );
      deliveryTasks.forEach((task) => {
        expect(task.priority).toBe('high');
      });
    });

    it('should contain restock tasks with medium priority', () => {
      const restockTasks = mockStaffTasks.filter(
        (task) => task.taskType === 'restock'
      );
      restockTasks.forEach((task) => {
        expect(task.priority).toBe('medium');
      });
    });

    it('should contain cleaning tasks with low priority', () => {
      const cleaningTasks = mockStaffTasks.filter(
        (task) => task.taskType === 'cleaning'
      );
      cleaningTasks.forEach((task) => {
        expect(task.priority).toBe('low');
      });
    });

    it('should have valid task structure', () => {
      mockStaffTasks.forEach((task) => {
        expect(task.id).toBeDefined();
        expect(task.taskType).toBeDefined();
        expect(task.description).toBeDefined();
        expect(task.status).toBeDefined();
        expect(task.priority).toBeDefined();
        expect(task.createdAt).toBeDefined();
      });
    });
  });

  describe('mockPipelineLogs', () => {
    it('should contain all log levels', () => {
      const levels = new Set(mockPipelineLogs.map((log) => log.level));
      expect(levels.has('INFO')).toBe(true);
      expect(levels.has('WARN')).toBe(true);
      expect(levels.has('ERROR')).toBe(true);
    });

    it('should contain INFO logs', () => {
      const infoLogs = mockPipelineLogs.filter((log) => log.level === 'INFO');
      expect(infoLogs.length).toBeGreaterThan(0);
    });

    it('should contain WARN logs', () => {
      const warnLogs = mockPipelineLogs.filter((log) => log.level === 'WARN');
      expect(warnLogs.length).toBeGreaterThan(0);
    });

    it('should contain ERROR logs', () => {
      const errorLogs = mockPipelineLogs.filter(
        (log) => log.level === 'ERROR'
      );
      expect(errorLogs.length).toBeGreaterThan(0);
    });

    it('should contain manual override logs', () => {
      const manualLogs = mockPipelineLogs.filter((log) =>
        log.message.includes('MANUAL:')
      );
      expect(manualLogs.length).toBeGreaterThan(0);
    });

    it('should have valid log structure', () => {
      mockPipelineLogs.forEach((log) => {
        expect(log.id).toBeDefined();
        expect(log.timestamp).toBeDefined();
        expect(log.level).toBeDefined();
        expect(log.message).toBeDefined();
      });
    });

    it('should be sorted in reverse chronological order', () => {
      for (let i = 0; i < mockPipelineLogs.length - 1; i++) {
        const currentTimestamp = new Date(
          mockPipelineLogs[i].timestamp
        ).getTime();
        const nextTimestamp = new Date(
          mockPipelineLogs[i + 1].timestamp
        ).getTime();
        expect(currentTimestamp).toBeGreaterThanOrEqual(nextTimestamp);
      }
    });
  });
});
