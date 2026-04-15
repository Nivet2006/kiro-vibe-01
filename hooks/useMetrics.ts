// Custom hook for derived metrics calculation
// Validates: Requirements 11.1, 11.2, 11.3, 11.4

'use client';

import { useMemo } from 'react';
import { Order, StaffTask } from '@/types';
import { calculateTotalRevenue, calculateAverageWaitTime } from '@/lib/calculations';

export interface Metrics {
  totalRevenue: number;
  activeOrders: number;
  averageWaitTime: number;
  pendingTasks: number;
}

export function useMetrics(orders: Order[], tasks: StaffTask[]): Metrics {
  const metrics = useMemo(() => {
    // Filter dispatched orders for revenue calculation
    const dispatchedOrders = orders.filter(order => order.status === 'dispatched');
    
    // Calculate total revenue
    const totalRevenue = calculateTotalRevenue(dispatchedOrders);
    
    // Count active orders (not dispatched)
    const activeOrders = orders.filter(order => order.status !== 'dispatched').length;
    
    // Calculate average wait time for dispatched orders
    const averageWaitTime = calculateAverageWaitTime(dispatchedOrders);
    
    // Count pending tasks
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    
    return {
      totalRevenue,
      activeOrders,
      averageWaitTime,
      pendingTasks,
    };
  }, [orders, tasks]);

  return metrics;
}
