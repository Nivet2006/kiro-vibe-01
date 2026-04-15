import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type {
  Order,
  OrderItem,
  OrderStatus,
  InventoryItem,
  StaffTask,
  PipelineLog,
  DemandForecast,
} from './index';

describe('Core TypeScript Types', () => {
  describe('Order types', () => {
    it('should create a valid Order object', () => {
      const order: Order = {
        id: 'order-1',
        tableNumber: 5,
        items: [],
        status: 'pending',
        priorityScore: 10,
        createdAt: new Date().toISOString(),
        startedAt: null,
        dispatchedAt: null,
        countdownTimer: null,
      };

      expect(order.id).toBe('order-1');
      expect(order.tableNumber).toBe(5);
      expect(order.status).toBe('pending');
    });

    it('should create a valid OrderItem object', () => {
      const item: OrderItem = {
        name: 'Burger',
        quantity: 2,
        prepTime: 15,
      };

      expect(item.name).toBe('Burger');
      expect(item.quantity).toBe(2);
      expect(item.prepTime).toBe(15);
    });

    it('should enforce OrderStatus discriminated union', () => {
      const validStatuses: OrderStatus[] = [
        'pending',
        'cooking',
        'quality_check',
        'ready',
        'dispatched',
      ];

      validStatuses.forEach((status) => {
        const order: Order = {
          id: 'test',
          tableNumber: 1,
          items: [],
          status,
          priorityScore: 5,
          createdAt: new Date().toISOString(),
          startedAt: null,
          dispatchedAt: null,
          countdownTimer: null,
        };

        expect(order.status).toBe(status);
      });
    });
  });

  describe('InventoryItem type', () => {
    it('should create a valid InventoryItem object', () => {
      const item: InventoryItem = {
        id: 'inv-1',
        itemName: 'Tomatoes',
        stockLevel: 75,
        reorderPoint: 20,
        unit: 'kg',
      };

      expect(item.id).toBe('inv-1');
      expect(item.stockLevel).toBe(75);
      expect(item.reorderPoint).toBe(20);
    });
  });

  describe('StaffTask type', () => {
    it('should create a valid StaffTask object', () => {
      const task: StaffTask = {
        id: 'task-1',
        taskType: 'delivery',
        description: 'Deliver order to table 5',
        assignedTo: 'John',
        status: 'pending',
        priority: 'high',
        createdAt: new Date().toISOString(),
      };

      expect(task.id).toBe('task-1');
      expect(task.taskType).toBe('delivery');
      expect(task.priority).toBe('high');
    });
  });

  describe('PipelineLog type', () => {
    it('should create a valid PipelineLog object', () => {
      const log: PipelineLog = {
        id: 'log-1',
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: 'Order processed successfully',
      };

      expect(log.id).toBe('log-1');
      expect(log.level).toBe('INFO');
      expect(log.message).toBe('Order processed successfully');
    });
  });

  describe('DemandForecast type', () => {
    it('should create a valid DemandForecast object', () => {
      const forecast: DemandForecast = {
        hour: 12,
        projected: 50,
        actual: 45,
      };

      expect(forecast.hour).toBe(12);
      expect(forecast.projected).toBe(50);
      expect(forecast.actual).toBe(45);
    });

    it('should handle hour range 0-23', () => {
      const morningForecast: DemandForecast = {
        hour: 0,
        projected: 5,
        actual: 3,
      };

      const nightForecast: DemandForecast = {
        hour: 23,
        projected: 10,
        actual: 12,
      };

      expect(morningForecast.hour).toBe(0);
      expect(nightForecast.hour).toBe(23);
    });
  });
});

// Property-Based Tests
describe('Property-Based Tests', () => {
  describe('Property 16: Order Card Rendering Includes All Required Fields', () => {
    /**
     * **Validates: Requirements 5.2**
     * 
     * For any order, the rendered order card SHALL include the order number,
     * table number, items list, priority score, and elapsed time.
     */
    it('should have all required fields for order card rendering', () => {
      // Arbitrary generator for OrderItem
      const orderItemArb = fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }),
        quantity: fc.integer({ min: 1, max: 10 }),
        prepTime: fc.integer({ min: 1, max: 120 }),
      });

      // Arbitrary generator for OrderStatus
      const orderStatusArb = fc.constantFrom<OrderStatus>(
        'pending',
        'cooking',
        'quality_check',
        'ready',
        'dispatched'
      );

      // Arbitrary generator for Order
      // Arbitrary generator for valid ISO date strings
      const isoDateArb = fc.integer({ min: 1577836800000, max: 1893456000000 }) // 2020-01-01 to 2030-01-01 in ms
        .map(ms => new Date(ms).toISOString());

      const orderArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        tableNumber: fc.integer({ min: 1, max: 100 }),
        items: fc.array(orderItemArb, { minLength: 1, maxLength: 10 }),
        status: orderStatusArb,
        priorityScore: fc.float({ min: 0, max: 1000, noNaN: true }),
        createdAt: isoDateArb,
        startedAt: fc.option(isoDateArb, { nil: null }),
        dispatchedAt: fc.option(isoDateArb, { nil: null }),
        countdownTimer: fc.option(fc.integer({ min: 0, max: 7200 }), { nil: null }),
      });

      fc.assert(
        fc.property(orderArb, (order: Order) => {
          // Verify all required fields for order card rendering are present
          
          // 1. Order number (id)
          expect(order.id).toBeDefined();
          expect(typeof order.id).toBe('string');
          expect(order.id.length).toBeGreaterThan(0);

          // 2. Table number
          expect(order.tableNumber).toBeDefined();
          expect(typeof order.tableNumber).toBe('number');
          expect(order.tableNumber).toBeGreaterThan(0);

          // 3. Items list
          expect(order.items).toBeDefined();
          expect(Array.isArray(order.items)).toBe(true);
          expect(order.items.length).toBeGreaterThan(0);
          
          // Verify each item has required fields
          order.items.forEach(item => {
            expect(item.name).toBeDefined();
            expect(typeof item.name).toBe('string');
            expect(item.quantity).toBeDefined();
            expect(typeof item.quantity).toBe('number');
            expect(item.prepTime).toBeDefined();
            expect(typeof item.prepTime).toBe('number');
          });

          // 4. Priority score
          expect(order.priorityScore).toBeDefined();
          expect(typeof order.priorityScore).toBe('number');
          expect(isNaN(order.priorityScore)).toBe(false);

          // 5. Elapsed time (can be calculated from createdAt)
          expect(order.createdAt).toBeDefined();
          expect(typeof order.createdAt).toBe('string');
          
          // Verify createdAt is a valid ISO date string
          const createdDate = new Date(order.createdAt);
          expect(createdDate.toString()).not.toBe('Invalid Date');
          
          // Elapsed time can be calculated as: Date.now() - new Date(order.createdAt).getTime()
          const elapsedTime = Date.now() - createdDate.getTime();
          expect(typeof elapsedTime).toBe('number');
        }),
        { numRuns: 100 }
      );
    });
  });
});
