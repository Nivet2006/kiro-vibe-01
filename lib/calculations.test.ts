// Unit tests for calculation utilities
// Validates: Requirements 2.1, 1.2, 11.1, 11.3

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculatePriorityScore,
  calculateCountdownTimer,
  calculateAverageWaitTime,
  calculateTotalRevenue,
} from './calculations';
import { Order, OrderItem } from '@/types';

describe('calculatePriorityScore', () => {
  it('should calculate priority score using formula (totalPrepTime * 0.6) + (waitTime * 0.4)', () => {
    const order: Order = {
      id: 'order-1',
      tableNumber: 5,
      items: [
        { name: 'Burger', quantity: 2, prepTime: 10 },
        { name: 'Fries', quantity: 1, prepTime: 5 },
      ],
      status: 'pending',
      priorityScore: 0,
      createdAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
      startedAt: null,
      dispatchedAt: null,
      countdownTimer: null,
    };

    const score = calculatePriorityScore(order);
    
    // totalPrepTime = (10*2 + 5*1) = 25 minutes
    // waitTime = 10 minutes
    // score = (25 * 0.6) + (10 * 0.4) = 15 + 4 = 19
    expect(score).toBeCloseTo(19, 0);
  });

  it('should return 0 on error', () => {
    const invalidOrder = { createdAt: 'invalid-date' } as Order;
    const score = calculatePriorityScore(invalidOrder);
    expect(score).toBe(0);
  });
});

describe('calculateCountdownTimer', () => {
  it('should calculate total prep time in seconds', () => {
    const items: OrderItem[] = [
      { name: 'Burger', quantity: 2, prepTime: 10 },
      { name: 'Fries', quantity: 1, prepTime: 5 },
    ];

    const timer = calculateCountdownTimer(items);
    
    // (10*2 + 5*1) * 60 = 25 * 60 = 1500 seconds
    expect(timer).toBe(1500);
  });

  it('should return 0 for empty items array', () => {
    const timer = calculateCountdownTimer([]);
    expect(timer).toBe(0);
  });

  it('should handle single item', () => {
    const items: OrderItem[] = [
      { name: 'Salad', quantity: 1, prepTime: 8 },
    ];

    const timer = calculateCountdownTimer(items);
    expect(timer).toBe(480); // 8 * 60
  });
});

describe('calculateAverageWaitTime', () => {
  it('should calculate average wait time for dispatched orders', () => {
    const now = Date.now();
    const orders: Order[] = [
      {
        id: 'order-1',
        tableNumber: 1,
        items: [],
        status: 'dispatched',
        priorityScore: 0,
        createdAt: new Date(now - 30 * 60000).toISOString(), // 30 min ago
        startedAt: null,
        dispatchedAt: new Date(now).toISOString(),
        countdownTimer: null,
      },
      {
        id: 'order-2',
        tableNumber: 2,
        items: [],
        status: 'dispatched',
        priorityScore: 0,
        createdAt: new Date(now - 20 * 60000).toISOString(), // 20 min ago
        startedAt: null,
        dispatchedAt: new Date(now).toISOString(),
        countdownTimer: null,
      },
    ];

    const avgWaitTime = calculateAverageWaitTime(orders);
    
    // (30 + 20) / 2 = 25 minutes
    expect(avgWaitTime).toBeCloseTo(25, 0);
  });

  it('should return 0 for empty orders array', () => {
    const avgWaitTime = calculateAverageWaitTime([]);
    expect(avgWaitTime).toBe(0);
  });

  it('should ignore non-dispatched orders', () => {
    const now = Date.now();
    const orders: Order[] = [
      {
        id: 'order-1',
        tableNumber: 1,
        items: [],
        status: 'dispatched',
        priorityScore: 0,
        createdAt: new Date(now - 30 * 60000).toISOString(),
        startedAt: null,
        dispatchedAt: new Date(now).toISOString(),
        countdownTimer: null,
      },
      {
        id: 'order-2',
        tableNumber: 2,
        items: [],
        status: 'cooking',
        priorityScore: 0,
        createdAt: new Date(now - 20 * 60000).toISOString(),
        startedAt: null,
        dispatchedAt: null,
        countdownTimer: null,
      },
    ];

    const avgWaitTime = calculateAverageWaitTime(orders);
    
    // Only order-1 is dispatched, so average is 30 minutes
    expect(avgWaitTime).toBeCloseTo(30, 0);
  });

  it('should ignore orders without dispatchedAt timestamp', () => {
    const now = Date.now();
    const orders: Order[] = [
      {
        id: 'order-1',
        tableNumber: 1,
        items: [],
        status: 'dispatched',
        priorityScore: 0,
        createdAt: new Date(now - 30 * 60000).toISOString(),
        startedAt: null,
        dispatchedAt: null, // Missing timestamp
        countdownTimer: null,
      },
    ];

    const avgWaitTime = calculateAverageWaitTime(orders);
    expect(avgWaitTime).toBe(0);
  });
});

describe('calculateTotalRevenue', () => {
  it('should calculate total revenue from dispatched orders', () => {
    const orders: Order[] = [
      {
        id: 'order-1',
        tableNumber: 1,
        items: [
          { name: 'Burger', quantity: 2, prepTime: 10 },
          { name: 'Fries', quantity: 1, prepTime: 5 },
        ],
        status: 'dispatched',
        priorityScore: 0,
        createdAt: new Date().toISOString(),
        startedAt: null,
        dispatchedAt: new Date().toISOString(),
        countdownTimer: null,
      },
      {
        id: 'order-2',
        tableNumber: 2,
        items: [
          { name: 'Salad', quantity: 1, prepTime: 8 },
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
    
    // Order 1: (2 + 1) * $15 = $45
    // Order 2: 1 * $15 = $15
    // Total: $60
    expect(revenue).toBe(60);
  });

  it('should return 0 for empty orders array', () => {
    const revenue = calculateTotalRevenue([]);
    expect(revenue).toBe(0);
  });

  it('should ignore non-dispatched orders', () => {
    const orders: Order[] = [
      {
        id: 'order-1',
        tableNumber: 1,
        items: [
          { name: 'Burger', quantity: 2, prepTime: 10 },
        ],
        status: 'dispatched',
        priorityScore: 0,
        createdAt: new Date().toISOString(),
        startedAt: null,
        dispatchedAt: new Date().toISOString(),
        countdownTimer: null,
      },
      {
        id: 'order-2',
        tableNumber: 2,
        items: [
          { name: 'Salad', quantity: 3, prepTime: 8 },
        ],
        status: 'cooking',
        priorityScore: 0,
        createdAt: new Date().toISOString(),
        startedAt: null,
        dispatchedAt: null,
        countdownTimer: null,
      },
    ];

    const revenue = calculateTotalRevenue(orders);
    
    // Only order-1 is dispatched: 2 * $15 = $30
    expect(revenue).toBe(30);
  });

  it('should handle orders with multiple items', () => {
    const orders: Order[] = [
      {
        id: 'order-1',
        tableNumber: 1,
        items: [
          { name: 'Burger', quantity: 3, prepTime: 10 },
          { name: 'Fries', quantity: 2, prepTime: 5 },
          { name: 'Drink', quantity: 4, prepTime: 1 },
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
    
    // (3 + 2 + 4) * $15 = 9 * $15 = $135
    expect(revenue).toBe(135);
  });
});
