// Custom hook for order CRUD operations
// Validates: Requirements 1.1, 10.1

'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types';
import { fetchOrders, updateOrderStatus as updateOrderStatusAPI } from '@/lib/supabase';
import { mockOrders } from '@/lib/mockData';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error('[useOrders] Failed to fetch orders:', err);
      setError('Failed to load orders');
      // Fallback to mock data
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatusAPI(id, status);
      // Update local state
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.error('[useOrders] Failed to update order status:', err);
      throw err;
    }
  };

  const addOrder = async (order: Omit<Order, 'id'>) => {
    try {
      // TODO: Implement addOrder API call
      const newOrder: Order = {
        ...order,
        id: `order-${Date.now()}`,
      };
      setOrders(prev => [...prev, newOrder]);
    } catch (err) {
      console.error('[useOrders] Failed to add order:', err);
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      // TODO: Implement deleteOrder API call
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (err) {
      console.error('[useOrders] Failed to delete order:', err);
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    addOrder,
    deleteOrder,
    refetch: loadOrders,
  };
}
