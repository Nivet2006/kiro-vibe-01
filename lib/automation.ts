// Automation engine for order pipeline side effects
// Validates: Requirements 1.3, 1.4, 1.5, 3.1, 4.1, 4.2, 4.3

import { Order, OrderStatus, OrderItem, InventoryItem, StaffTask } from '@/types';
import { INGREDIENT_DEDUCTION_MAP } from '@/lib/ingredientMap';

/**
 * Executes side effects when an order transitions to a new status
 * Validates: Requirements 1.3, 1.4, 1.5
 */
export async function executeTransitionSideEffects(
  order: Order,
  newStatus: OrderStatus
): Promise<void> {
  console.log(`[Automation] Executing side effects for order #${order.id} transitioning to ${newStatus}`);

  switch (newStatus) {
    case 'cooking':
      // Calculate countdown timer based on total prep time
      const totalPrepTime = order.items.reduce(
        (sum, item) => sum + (item.prepTime * item.quantity),
        0
      );
      const timerSeconds = totalPrepTime * 60; // convert minutes to seconds
      console.log(`[Automation] Setting countdown timer for order #${order.id}: ${timerSeconds} seconds`);
      // TODO: Call updateOrderTimer(order.id, timerSeconds) when implemented
      break;

    case 'quality_check':
      // Auto-create delivery task
      await createStaffTask({
        taskType: 'delivery',
        description: `Deliver order #${order.id} to table ${order.tableNumber}`,
        priority: 'high',
        assignedTo: null,
        status: 'pending',
      });
      console.log(`[Automation] Created delivery task for order #${order.id}`);
      break;

    case 'dispatched':
      // Decrement inventory
      await decrementInventory(order.items);
      console.log(`[Automation] Decremented inventory for order #${order.id}`);

      // Auto-create cleaning task
      await createStaffTask({
        taskType: 'cleaning',
        description: `Clean and reset table ${order.tableNumber}`,
        priority: 'low',
        assignedTo: null,
        status: 'pending',
      });
      console.log(`[Automation] Created cleaning task for table ${order.tableNumber}`);
      break;

    default:
      // No side effects for other transitions
      break;
  }
}

/**
 * Decrements inventory based on order items and creates restock tasks if needed
 * Validates: Requirements 3.1, 4.1
 */
export async function decrementInventory(items: OrderItem[]): Promise<void> {
  console.log(`[Automation] Decrementing inventory for ${items.length} order items`);

  for (const item of items) {
    const deductions = INGREDIENT_DEDUCTION_MAP[item.name];
    if (!deductions) {
      console.log(`[Automation] No ingredient mapping found for item: ${item.name}`);
      continue;
    }

    for (const { ingredientId, quantityPerItem } of deductions) {
      const totalDeduction = quantityPerItem * item.quantity;
      console.log(`[Automation] Deducting ${totalDeduction}% from ingredient: ${ingredientId}`);
      
      // TODO: Call getInventoryItem(ingredientId) when implemented
      // TODO: Calculate newStockLevel = Math.max(0, inventory.stockLevel - totalDeduction)
      // TODO: Call updateInventoryStockLevel(ingredientId, newStockLevel) when implemented
      
      // Placeholder for restock check
      // if (newStockLevel < inventory.reorderPoint) {
      //   await createRestockTask(inventory);
      // }
    }
  }
}

/**
 * Creates a new staff task
 * Validates: Requirements 4.2, 4.3
 */
export async function createStaffTask(
  task: Omit<StaffTask, 'id' | 'createdAt'>
): Promise<void> {
  console.log(`[Automation] Creating staff task: ${task.taskType} - ${task.description}`);
  
  // TODO: Generate UUID for task.id
  // TODO: Insert into staff_tasks table via Supabase
  // Placeholder implementation
  const newTask: StaffTask = {
    id: `task-${Date.now()}`, // Temporary ID generation
    ...task,
    createdAt: new Date().toISOString(),
  };
  
  console.log(`[Automation] Staff task created with ID: ${newTask.id}`);
}

/**
 * Creates a restock task when inventory falls below reorder point
 * Validates: Requirements 4.1, 4.2
 */
export async function createRestockTask(inventory: InventoryItem): Promise<void> {
  console.log(`[Automation] Creating restock task for inventory item: ${inventory.itemName}`);
  
  await createStaffTask({
    taskType: 'restock',
    description: `Restock ${inventory.itemName} (current: ${inventory.stockLevel}${inventory.unit}, reorder point: ${inventory.reorderPoint}${inventory.unit})`,
    priority: 'medium',
    assignedTo: null,
    status: 'pending',
  });
  
  console.log(`[Automation] Restock task created for ${inventory.itemName}`);
}
