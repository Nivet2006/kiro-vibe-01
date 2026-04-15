// Calculation utilities for KitchenOS metrics and priority scoring
// Validates: Requirements 2.1, 1.2, 11.1, 11.3

import { Order, OrderItem } from '@/types';

/**
 * Calculate priority score for an order based on prep time and wait time
 * Formula: (totalPrepTime * 0.6) + (waitTime * 0.4)
 * 
 * @param order - The order to calculate priority for
 * @returns Priority score as a number
 * 
 * Validates: Requirements 2.1
 */
export function calculatePriorityScore(order: Order): number {
  try {
    const totalPrepTime = order.items.reduce(
      (sum, item) => sum + (item.prepTime * item.quantity),
      0
    );
    const waitTime = (Date.now() - new Date(order.createdAt).getTime()) / 60000; // minutes
    return (totalPrepTime * 0.6) + (waitTime * 0.4);
  } catch (err) {
    console.error('[KitchenOS][Calculations]', err);
    return 0; // Default priority score
  }
}

/**
 * Calculate countdown timer for order items
 * Formula: sum of (item.prepTime × quantity) converted to seconds
 * 
 * @param items - Array of order items
 * @returns Total prep time in seconds
 * 
 * Validates: Requirements 1.2
 */
export function calculateCountdownTimer(items: OrderItem[]): number {
  try {
    const totalPrepTime = items.reduce(
      (sum, item) => sum + (item.prepTime * item.quantity),
      0
    );
    return totalPrepTime * 60; // convert minutes to seconds
  } catch (err) {
    console.error('[KitchenOS][Calculations]', err);
    return 0;
  }
}

/**
 * Calculate average wait time for dispatched orders
 * Formula: mean of (dispatchedAt - createdAt) for all orders
 * 
 * @param orders - Array of dispatched orders
 * @returns Average wait time in minutes
 * 
 * Validates: Requirements 11.3
 */
export function calculateAverageWaitTime(orders: Order[]): number {
  try {
    const dispatchedOrders = orders.filter(
      order => order.status === 'dispatched' && order.dispatchedAt
    );
    
    if (dispatchedOrders.length === 0) {
      return 0;
    }
    
    const totalWaitTime = dispatchedOrders.reduce((sum, order) => {
      const createdAt = new Date(order.createdAt).getTime();
      const dispatchedAt = new Date(order.dispatchedAt!).getTime();
      return sum + (dispatchedAt - createdAt);
    }, 0);
    
    // Convert milliseconds to minutes
    return totalWaitTime / dispatchedOrders.length / 60000;
  } catch (err) {
    console.error('[KitchenOS][Calculations]', err);
    return 0;
  }
}

/**
 * Calculate total revenue from dispatched orders
 * Formula: sum of all order values
 * 
 * Note: Order values are hardcoded at $15 per item as per Phase 1 decision
 * (defer pricing system to Phase 3)
 * 
 * @param orders - Array of dispatched orders
 * @returns Total revenue in dollars
 * 
 * Validates: Requirements 11.1
 */
export function calculateTotalRevenue(orders: Order[]): number {
  try {
    const dispatchedOrders = orders.filter(order => order.status === 'dispatched');
    
    // Hardcoded pricing: $15 per item (quantity counted)
    const PRICE_PER_ITEM = 15;
    
    return dispatchedOrders.reduce((sum, order) => {
      const orderValue = order.items.reduce(
        (itemSum, item) => itemSum + (item.quantity * PRICE_PER_ITEM),
        0
      );
      return sum + orderValue;
    }, 0);
  } catch (err) {
    console.error('[KitchenOS][Calculations]', err);
    return 0;
  }
}
