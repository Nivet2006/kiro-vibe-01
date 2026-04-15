// Core TypeScript types and interfaces for KitchenOS
// Validates: Requirements 18.1, 18.2

/**
 * Discriminated union type for order status transitions
 */
export type OrderStatus = 'pending' | 'cooking' | 'quality_check' | 'ready' | 'dispatched';

/**
 * Represents a customer order with status tracking and timing information
 */
export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  priorityScore: number;
  createdAt: string;
  startedAt: string | null;
  dispatchedAt: string | null;
  countdownTimer: number | null; // seconds remaining
}

/**
 * Individual item within an order
 */
export interface OrderItem {
  name: string;
  quantity: number;
  prepTime: number; // minutes
}

/**
 * Inventory item with stock level tracking
 */
export interface InventoryItem {
  id: string;
  itemName: string;
  stockLevel: number; // percentage 0-100
  reorderPoint: number; // percentage threshold
  unit: string;
}

/**
 * Staff task assignment and tracking
 */
export interface StaffTask {
  id: string;
  taskType: 'delivery' | 'cleaning' | 'restock' | 'custom';
  description: string;
  assignedTo: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

/**
 * System log entry for pipeline monitoring
 */
export interface PipelineLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

/**
 * Demand forecasting data point
 */
export interface DemandForecast {
  hour: number; // 0-23
  projected: number; // predicted order count
  actual: number; // actual order count
}
