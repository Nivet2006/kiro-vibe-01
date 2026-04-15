// Supabase client wrapper with typed query helpers
// Validates: Requirements 17.1, 17.5, 12.1, 12.2

import { createClient } from '@supabase/supabase-js';
import type {
  Order,
  InventoryItem,
  StaffTask,
  PipelineLog,
} from '@/types';
import {
  mockOrders,
  mockInventory,
  mockStaffTasks,
  mockPipelineLogs,
} from '@/lib/mockData';

// Environment variables for Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Check for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[KitchenOS][Supabase] Missing Supabase environment variables. Operating in mock data mode.');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');

// Helper to check if Supabase is properly configured
const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');
};

/**
 * Fetch all orders from the database
 * Falls back to mock data on error
 */
export async function fetchOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    console.warn('[KitchenOS][fetchOrders] Supabase not configured. Using mock data.');
    return mockOrders;
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('priority_score', { ascending: false });

    if (error) throw error;

    return data as Order[];
  } catch (err) {
    console.error('[KitchenOS][fetchOrders]', err);
    await createPipelineLog({
      level: 'ERROR',
      message: `Failed to fetch orders: ${err instanceof Error ? err.message : 'Unknown error'}. Using mock data.`,
    });
    return mockOrders;
  }
}

/**
 * Update order status in the database
 * Falls back to mock data on error
 */
export async function updateOrderStatus(
  id: string,
  status: Order['status'],
  updates?: Partial<Pick<Order, 'startedAt' | 'dispatchedAt' | 'countdownTimer'>>
): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.warn('[KitchenOS][updateOrderStatus] Supabase not configured. Using mock data.');
    return;
  }

  try {
    const updateData: Record<string, unknown> = { status };
    
    if (updates?.startedAt !== undefined) updateData.started_at = updates.startedAt;
    if (updates?.dispatchedAt !== undefined) updateData.dispatched_at = updates.dispatchedAt;
    if (updates?.countdownTimer !== undefined) updateData.countdown_timer = updates.countdownTimer;

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    console.error('[KitchenOS][updateOrderStatus]', err);
    await createPipelineLog({
      level: 'ERROR',
      message: `Failed to update order status: ${err instanceof Error ? err.message : 'Unknown error'}`,
    });
    throw err;
  }
}

/**
 * Fetch all inventory items from the database
 * Falls back to mock data on error
 */
export async function fetchInventory(): Promise<InventoryItem[]> {
  if (!isSupabaseConfigured()) {
    console.warn('[KitchenOS][fetchInventory] Supabase not configured. Using mock data.');
    return mockInventory;
  }

  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('item_name', { ascending: true });

    if (error) throw error;

    return data as InventoryItem[];
  } catch (err) {
    console.error('[KitchenOS][fetchInventory]', err);
    await createPipelineLog({
      level: 'ERROR',
      message: `Failed to fetch inventory: ${err instanceof Error ? err.message : 'Unknown error'}. Using mock data.`,
    });
    return mockInventory;
  }
}

/**
 * Update inventory stock level in the database
 * Falls back to mock data on error
 */
export async function updateInventoryStockLevel(
  id: string,
  stockLevel: number
): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.warn('[KitchenOS][updateInventoryStockLevel] Supabase not configured. Using mock data.');
    return;
  }

  try {
    // Clamp stock level to 0-100 range
    const clampedStockLevel = Math.max(0, Math.min(100, stockLevel));

    const { error } = await supabase
      .from('inventory')
      .update({ stock_level: clampedStockLevel })
      .eq('id', id);

    if (error) throw error;

    // Log warning if stock level was clamped to 0
    if (stockLevel < 0) {
      await createPipelineLog({
        level: 'WARN',
        message: `Inventory item ${id} stock level clamped to 0% (attempted: ${stockLevel}%)`,
      });
    }
  } catch (err) {
    console.error('[KitchenOS][updateInventoryStockLevel]', err);
    await createPipelineLog({
      level: 'ERROR',
      message: `Failed to update inventory stock level: ${err instanceof Error ? err.message : 'Unknown error'}`,
    });
    throw err;
  }
}

/**
 * Fetch all staff tasks from the database
 * Falls back to mock data on error
 */
export async function fetchStaffTasks(): Promise<StaffTask[]> {
  if (!isSupabaseConfigured()) {
    console.warn('[KitchenOS][fetchStaffTasks] Supabase not configured. Using mock data.');
    return mockStaffTasks;
  }

  try {
    const { data, error } = await supabase
      .from('staff_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data as StaffTask[];
  } catch (err) {
    console.error('[KitchenOS][fetchStaffTasks]', err);
    await createPipelineLog({
      level: 'ERROR',
      message: `Failed to fetch staff tasks: ${err instanceof Error ? err.message : 'Unknown error'}. Using mock data.`,
    });
    return mockStaffTasks;
  }
}

/**
 * Create a new staff task in the database
 * Falls back to mock data on error
 */
export async function createStaffTask(
  task: Omit<StaffTask, 'id' | 'createdAt'>
): Promise<StaffTask | null> {
  if (!isSupabaseConfigured()) {
    console.warn('[KitchenOS][createStaffTask] Supabase not configured. Using mock data.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('staff_tasks')
      .insert({
        task_type: task.taskType,
        description: task.description,
        assigned_to: task.assignedTo,
        status: task.status,
        priority: task.priority,
      })
      .select()
      .single();

    if (error) throw error;

    return data as StaffTask;
  } catch (err) {
    console.error('[KitchenOS][createStaffTask]', err);
    await createPipelineLog({
      level: 'ERROR',
      message: `Failed to create staff task: ${err instanceof Error ? err.message : 'Unknown error'}`,
    });
    return null;
  }
}

/**
 * Fetch pipeline logs from the database
 * Falls back to mock data on error
 */
export async function fetchPipelineLogs(limit: number = 100): Promise<PipelineLog[]> {
  if (!isSupabaseConfigured()) {
    console.warn('[KitchenOS][fetchPipelineLogs] Supabase not configured. Using mock data.');
    return mockPipelineLogs.slice(0, limit);
  }

  try {
    const { data, error } = await supabase
      .from('pipeline_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data as PipelineLog[];
  } catch (err) {
    console.error('[KitchenOS][fetchPipelineLogs]', err);
    // Don't create a pipeline log here to avoid infinite recursion
    return mockPipelineLogs.slice(0, limit);
  }
}

/**
 * Create a new pipeline log entry in the database
 * Falls back to console logging on error
 */
export async function createPipelineLog(
  log: Omit<PipelineLog, 'id' | 'timestamp'>
): Promise<PipelineLog | null> {
  if (!isSupabaseConfigured()) {
    console.warn('[KitchenOS][createPipelineLog] Supabase not configured. Logging to console only.');
    console.log(`[KitchenOS][${log.level}]`, log.message);
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('pipeline_logs')
      .insert({
        level: log.level,
        message: log.message,
      })
      .select()
      .single();

    if (error) throw error;

    return data as PipelineLog;
  } catch (err) {
    console.error('[KitchenOS][createPipelineLog]', err);
    // Don't try to create another log here to avoid infinite recursion
    console.log(`[KitchenOS][${log.level}]`, log.message);
    return null;
  }
}
