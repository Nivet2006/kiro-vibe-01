// Custom hook for Supabase Realtime subscriptions
// Validates: Requirements 10.1, 10.2, 10.3

'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useKitchenOSStore } from '@/store';

export interface UseRealtimeOptions {
  table: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

export function useRealtime({ table, onInsert, onUpdate, onDelete }: UseRealtimeOptions) {
  const { setOfflineMode } = useKitchenOSStore();

  useEffect(() => {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn('[useRealtime] Supabase not configured, falling back to polling');
      setOfflineMode(true);
      return;
    }

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table },
        (payload) => {
          console.log(`[useRealtime] INSERT on ${table}:`, payload);
          onInsert?.(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table },
        (payload) => {
          console.log(`[useRealtime] UPDATE on ${table}:`, payload);
          onUpdate?.(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table },
        (payload) => {
          console.log(`[useRealtime] DELETE on ${table}:`, payload);
          onDelete?.(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[useRealtime] Subscribed to ${table}`);
          setOfflineMode(false);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error(`[useRealtime] Subscription failed for ${table}:`, status);
          setOfflineMode(true);
        }
      });

    // Cleanup on unmount
    return () => {
      console.log(`[useRealtime] Unsubscribing from ${table}`);
      supabase.removeChannel(channel);
    };
  }, [table, onInsert, onUpdate, onDelete, setOfflineMode]);
}
