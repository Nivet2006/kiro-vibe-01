// Custom hook for inventory management
// Validates: Requirements 3.1, 7.1

'use client';

import { useState, useEffect } from 'react';
import { InventoryItem } from '@/types';
import { fetchInventory, updateInventoryStockLevel as updateInventoryStockLevelAPI } from '@/lib/supabase';
import { mockInventory } from '@/lib/mockData';

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInventory();
      setInventory(data);
    } catch (err) {
      console.error('[useInventory] Failed to fetch inventory:', err);
      setError('Failed to load inventory');
      // Fallback to mock data
      setInventory(mockInventory);
    } finally {
      setLoading(false);
    }
  };

  const updateStockLevel = async (id: string, stockLevel: number) => {
    try {
      await updateInventoryStockLevelAPI(id, stockLevel);
      // Update local state
      setInventory(prev =>
        prev.map(item =>
          item.id === id ? { ...item, stockLevel } : item
        )
      );
    } catch (err) {
      console.error('[useInventory] Failed to update stock level:', err);
      throw err;
    }
  };

  const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
    try {
      // TODO: Implement addInventoryItem API call
      const newItem: InventoryItem = {
        ...item,
        id: `inv-${Date.now()}`,
      };
      setInventory(prev => [...prev, newItem]);
    } catch (err) {
      console.error('[useInventory] Failed to add inventory item:', err);
      throw err;
    }
  };

  return {
    inventory,
    loading,
    error,
    updateStockLevel,
    addInventoryItem,
    refetch: loadInventory,
  };
}
