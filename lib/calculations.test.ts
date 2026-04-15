import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  calculatePriorityScore,
  calculateCountdownTimer,
  calculateAverageWaitTime,
  calculateTotalRevenue,
} from './calculations';
import type { Order, OrderItem } from '@/types';

describe('Calculations - Unit Tests', () => {
  describe('calculatePriorityScore', () => {
    it('should calculate priority score correctly', () => {
      const order: Order = {
        id: '1',
        tableNumber: 5,
        items: [
          { name: 'Pizza', quantity: 2, prepTime: 15 },
          { name: 'Salad', quantity: 1, prepTime: 5 },
        ],
        status: 'pending',
        priorityScore: 0,
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        startedAt: null,
        dispatchedAt: null,
        countdownTimer: null,
      };

      const score = calculatePriorityScore(order);
      const totalPrepTime = (15 * 2) + (5 * 1); // 35 minutes
      const waitTime = 10; // minutes
      const expected = (totalPrepTime * 0.6) + (waitTime * 0.4);

      expect(score).toBeCloseTo(expected, 2);
    });
  });

  describe('calculateCountdownTimer', () => {
    it('should calculate countdown timer in seconds', () => {
      const items: OrderItem[] = [
        { name: 'Pizza', quantity: 2, prepTime: 15 },
        { name: 'Salad', quantity: 1, prepTime: 5 },
      ];

      const timer = calculateCountdownTimer(items);
      const expected = ((15 * 2) + (5 * 1)) * 60; // 35 minutes * 60 seconds

      expect(timer).toBe(expected);
    });
  });

  describe('calculateAverageWaitTime', () => {
    it('should calculate average wait time correctly', () => {
      const now = Date.now();
      const orders: Order[] = [
        {
          id: '1',
          tableNumber: 1,
          items: [],
          status: 'dispatched',
          priorityScore: 0,
          createdAt: new Date(now - 20 * 60 * 1000).toISOString(),
          startedAt: null,
          dispatchedAt: new Date(now).toISOString(),
          countdownTimer: null,
        },
        {
          id: '2',
          tableNumber: 2,
          items: [],
          status: 'dispatched',
          priorityScore: 0,
          createdAt: new Date(now - 30 * 60 * 1000).toISOString(),
          startedAt: null,
          dispatchedAt: new Date(now).toISOString(),
          countdownTimer: null,
        },
      ];

      const avgWaitTime = calculateAverageWaitTime(orders);
      const expected = (20 + 30) / 2; // 25 minutes

      expect(avgWaitTime).toBeCloseTo(expected, 1);
    });

    it('should return 0 for empty array', () => {
      expect(calculateAverageWaitTime([])).toBe(0);
    });
  });

  describe('calculateTotalRevenue', () => {
    it('should calculate total revenue correctly', () => {
      const orders: Order[] = [
        {
          id: '1',
          tableNumber: 1,
          items: [
            { name: 'Pizza', quantity: 2, prepTime: 15 },
            { name: 'Salad', quantity: 1, prepTime: 5 },
          ],
          status: 'dispatched',
          priorityScore: 0,
          createdAt: new Date().toISOString(),
          startedAt: null,
          dispatchedAt: new Date().toISOString(),
          countdownTimer: null,
        },
      ];

      const revenue = calculateTotalRevenue(orders);
      const expected = (2 + 1) * 15; // 3 items * $15

      expect(revenue).toBe(expected);
    });
  });
});

// Feature: kitchenos, Property 8: Priority Score Calculation Formula
describe('Calculations - Property Tests', () => {
  describe('Property 8: Priority Score Calculation Formula', () => {
    it('should calculate priority score as (totalPrepTime * 0.6) + (waitTime * 0.4)', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              name: fc.string(),
              quantity: fc.integer({ min: 1, max: 10 }),
              prepTime: fc.integer({ min: 1, max: 60 }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          fc.integer({ min: 0, max: 10000 }), // minutes ago
          (items, minutesAgo) => {
            const order: Order = {
              id: 'test-order-1',
              tableNumber: 1,
              items,
              status: 'pending',
              priorityScore: 0,
              createdAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
              startedAt: null,
              dispatchedAt: null,
              countdownTimer: null,
            };

            const score = calculatePriorityScore(order);
            const totalPrepTime = items.reduce(
              (sum, item) => sum + item.prepTime * item.quantity,
              0
            );
            const waitTime = minutesAgo;
            const expected = totalPrepTime * 0.6 + waitTime * 0.4;

            // Allow small floating point differences
            return Math.abs(score - expected) < 0.01;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: kitchenos, Property 2: Countdown Timer Calculation Matches Formula
  describe('Property 2: Countdown Timer Calculation Matches Formula', () => {
    it('should calculate countdown timer as sum of (prepTime * quantity) in seconds', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              name: fc.string(),
              quantity: fc.integer({ min: 1, max: 10 }),
              prepTime: fc.integer({ min: 1, max: 60 }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (items) => {
            const timer = calculateCountdownTimer(items);
            const expectedMinutes = items.reduce(
              (sum, item) => sum + item.prepTime * item.quantity,
              0
            );
            const expectedSeconds = expectedMinutes * 60;

            return timer === expectedSeconds;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: kitchenos, Property 28: Revenue Calculation
  // Feature: kitchenos, Property 30: Average Wait Time Calculation
  describe('Property 28 & 30: Revenue and Average Wait Time Calculation', () => {
    it('should calculate total revenue as sum of all item quantities * $15', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              tableNumber: fc.integer({ min: 1, max: 50 }),
              items: fc.array(
                fc.record({
                  name: fc.string(),
                  quantity: fc.integer({ min: 1, max: 10 }),
                  prepTime: fc.integer({ min: 1, max: 60 }),
                }),
                { minLength: 1, maxLength: 10 }
              ),
              status: fc.constant('dispatched' as const),
              priorityScore: fc.float({ min: 0, max: 100 }),
              createdAt: fc.date({ min: new Date('2024-01-01'), max: new Date() }).map(d => d.toISOString()),
              startedAt: fc.constant(null),
              dispatchedAt: fc.date({ min: new Date('2024-01-01'), max: new Date() }).map(d => d.toISOString()),
              countdownTimer: fc.constant(null),
            }),
            { minLength: 0, maxLength: 20 }
          ),
          (orders) => {
            const revenue = calculateTotalRevenue(orders);
            const expectedRevenue = orders.reduce(
              (sum, order) =>
                sum +
                order.items.reduce((itemSum, item) => itemSum + item.quantity, 0) * 15,
              0
            );

            return revenue === expectedRevenue;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should calculate average wait time as mean of (dispatchedAt - createdAt)', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              tableNumber: fc.integer({ min: 1, max: 50 }),
              items: fc.array(
                fc.record({
                  name: fc.string(),
                  quantity: fc.integer({ min: 1, max: 10 }),
                  prepTime: fc.integer({ min: 1, max: 60 }),
                }),
                { minLength: 1, maxLength: 5 }
              ),
              status: fc.constant('dispatched' as const),
              priorityScore: fc.float({ min: 0, max: 100 }),
              createdAt: fc.integer({ min: 0, max: 10000 }).map(mins => new Date(Date.now() - mins * 60 * 1000).toISOString()),
              startedAt: fc.constant(null),
              dispatchedAt: fc.constant(new Date().toISOString()),
              countdownTimer: fc.constant(null),
            }),
            { minLength: 1, maxLength: 20 }
          ),
          (orders) => {
            const avgWaitTime = calculateAverageWaitTime(orders);
            
            if (orders.length === 0) {
              return avgWaitTime === 0;
            }

            const totalWaitTime = orders.reduce((sum, order) => {
              const created = new Date(order.createdAt).getTime();
              const dispatched = new Date(order.dispatchedAt!).getTime();
              return sum + (dispatched - created) / 60000; // convert to minutes
            }, 0);
            const expected = totalWaitTime / orders.length;

            // Allow small floating point differences
            return Math.abs(avgWaitTime - expected) < 0.1;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
