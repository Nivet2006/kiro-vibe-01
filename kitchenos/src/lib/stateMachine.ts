// State machine for order status transitions
// Validates: Requirements 1.1, 1.6

import type { Order, OrderStatus } from '../types';

/**
 * Defines valid state transitions in the order pipeline.
 * Each status maps to its next valid status, or null for terminal states.
 */
export const ORDER_STATE_MACHINE: Record<OrderStatus, OrderStatus | null> = {
  pending: 'cooking',
  cooking: 'quality_check',
  quality_check: 'ready',
  ready: 'dispatched',
  dispatched: null, // terminal state
};

/**
 * Checks if a transition from one status to another is valid.
 * @param from - Current order status
 * @param to - Target order status
 * @returns true if the transition is valid, false otherwise
 */
export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_STATE_MACHINE[from] === to;
}

/**
 * Transitions an order to a new status with validation and side effects.
 * @param order - The order to transition
 * @param newStatus - The target status
 * @param manualOverride - If true, bypasses state machine validation
 * @throws Error if transition is invalid and manualOverride is false
 */
export async function transitionOrder(
  order: Order,
  newStatus: OrderStatus,
  manualOverride: boolean
): Promise<void> {
  // Validate transition
  if (!manualOverride && !canTransition(order.status, newStatus)) {
    throw new Error(`Invalid transition: ${order.status} -> ${newStatus}`);
  }
  
  // Execute side effects based on transition
  await executeTransitionSideEffects(order, newStatus);
  
  // Update order status
  await updateOrderStatus(order.id, newStatus);
  
  // Log transition
  await createPipelineLog({
    level: manualOverride ? 'WARN' : 'INFO',
    message: manualOverride 
      ? `MANUAL: Order #${order.id} moved to ${newStatus}`
      : `Order #${order.id} transitioned to ${newStatus}`,
  });
}

/**
 * Executes side effects when transitioning to a new status.
 * @param order - The order being transitioned
 * @param newStatus - The target status
 */
async function executeTransitionSideEffects(
  order: Order,
  newStatus: OrderStatus
): Promise<void> {
  switch (newStatus) {
    case 'cooking':
      // Calculate countdown timer
      const totalPrepTime = order.items.reduce(
        (sum, item) => sum + (item.prepTime * item.quantity),
        0
      );
      await updateOrderTimer(order.id, totalPrepTime * 60); // convert to seconds
      break;
      
    case 'quality_check':
      // Auto-create delivery task
      await createStaffTask({
        taskType: 'delivery',
        description: `Deliver order #${order.id} to table ${order.tableNumber}`,
        priority: 'high',
      });
      break;
      
    case 'dispatched':
      // Decrement inventory
      await decrementInventory(order.items);
      
      // Auto-create cleaning task
      await createStaffTask({
        taskType: 'cleaning',
        description: `Clean and reset table ${order.tableNumber}`,
        priority: 'low',
      });
      break;
  }
}

// Placeholder functions for external dependencies
// These will be implemented in subsequent tasks

async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  // TODO: Implement in Task 4.2 (Supabase integration)
  console.log(`[Placeholder] Update order ${id} to status ${status}`);
}

async function updateOrderTimer(id: string, seconds: number): Promise<void> {
  // TODO: Implement in Task 4.2 (Supabase integration)
  console.log(`[Placeholder] Update order ${id} timer to ${seconds} seconds`);
}

async function createPipelineLog(log: { level: 'INFO' | 'WARN' | 'ERROR'; message: string }): Promise<void> {
  // TODO: Implement in Task 4.2 (Supabase integration)
  console.log(`[Placeholder] Create log: [${log.level}] ${log.message}`);
}

async function createStaffTask(task: {
  taskType: 'delivery' | 'cleaning' | 'restock' | 'custom';
  description: string;
  priority: 'high' | 'medium' | 'low';
}): Promise<void> {
  // TODO: Implement in Task 4.2 (Supabase integration)
  console.log(`[Placeholder] Create staff task: ${task.description}`);
}

async function decrementInventory(items: Order['items']): Promise<void> {
  // TODO: Implement in Task 5 (Automation engine)
  console.log(`[Placeholder] Decrement inventory for ${items.length} items`);
}
