// Mock data module for KitchenOS
// Provides comprehensive test data covering all edge cases
// Validates: Requirements 12.1

import type {
  Order,
  InventoryItem,
  StaffTask,
  PipelineLog,
} from '@/types';

/**
 * Mock orders covering various statuses and edge cases
 * - High priority orders (long prep time + long wait time)
 * - Low priority orders (short prep time + short wait time)
 * - Orders in all pipeline states
 * - Orders with countdown timers at various stages
 */
export const mockOrders: Order[] = [
  // High priority pending order - long prep time, been waiting
  {
    id: 'order-001',
    tableNumber: 5,
    items: [
      { name: 'Ribeye Steak', quantity: 2, prepTime: 25 },
      { name: 'Lobster Tail', quantity: 1, prepTime: 20 },
    ],
    status: 'pending',
    priorityScore: 42.5, // High priority
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    startedAt: null,
    dispatchedAt: null,
    countdownTimer: null,
  },
  // Medium priority pending order
  {
    id: 'order-002',
    tableNumber: 3,
    items: [
      { name: 'Caesar Salad', quantity: 2, prepTime: 8 },
      { name: 'Grilled Chicken', quantity: 2, prepTime: 15 },
    ],
    status: 'pending',
    priorityScore: 18.2,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    startedAt: null,
    dispatchedAt: null,
    countdownTimer: null,
  },
  // Low priority pending order - just created
  {
    id: 'order-003',
    tableNumber: 8,
    items: [
      { name: 'French Fries', quantity: 1, prepTime: 5 },
      { name: 'Soda', quantity: 2, prepTime: 1 },
    ],
    status: 'pending',
    priorityScore: 3.6,
    createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
    startedAt: null,
    dispatchedAt: null,
    countdownTimer: null,
  },
  // Cooking order with plenty of time remaining (80%)
  {
    id: 'order-004',
    tableNumber: 12,
    items: [
      { name: 'Pasta Carbonara', quantity: 1, prepTime: 12 },
      { name: 'Garlic Bread', quantity: 1, prepTime: 5 },
    ],
    status: 'cooking',
    priorityScore: 15.4,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
    startedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // Started 3 minutes ago
    dispatchedAt: null,
    countdownTimer: 840, // 14 minutes remaining (82% of 17 minutes)
  },
  // Cooking order with warning - less than 20% time remaining
  {
    id: 'order-005',
    tableNumber: 7,
    items: [
      { name: 'Burger', quantity: 2, prepTime: 10 },
    ],
    status: 'cooking',
    priorityScore: 22.8,
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 minutes ago
    startedAt: new Date(Date.now() - 17 * 60 * 1000).toISOString(), // Started 17 minutes ago
    dispatchedAt: null,
    countdownTimer: 180, // 3 minutes remaining (15% of 20 minutes) - WARNING!
  },
  // Order in quality check
  {
    id: 'order-006',
    tableNumber: 2,
    items: [
      { name: 'Fish and Chips', quantity: 1, prepTime: 18 },
    ],
    status: 'quality_check',
    priorityScore: 28.5,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
    startedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    dispatchedAt: null,
    countdownTimer: null,
  },
  // Order ready for delivery
  {
    id: 'order-007',
    tableNumber: 15,
    items: [
      { name: 'Pizza Margherita', quantity: 1, prepTime: 15 },
      { name: 'Tiramisu', quantity: 2, prepTime: 2 },
    ],
    status: 'ready',
    priorityScore: 19.8,
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(), // 22 minutes ago
    startedAt: new Date(Date.now() - 17 * 60 * 1000).toISOString(),
    dispatchedAt: null,
    countdownTimer: null,
  },
  // Recently dispatched order
  {
    id: 'order-008',
    tableNumber: 9,
    items: [
      { name: 'Chicken Wings', quantity: 1, prepTime: 12 },
      { name: 'Coleslaw', quantity: 1, prepTime: 3 },
    ],
    status: 'dispatched',
    priorityScore: 16.2,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    startedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    dispatchedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // Dispatched 5 minutes ago
    countdownTimer: null,
  },
  // Older dispatched order for metrics calculation
  {
    id: 'order-009',
    tableNumber: 4,
    items: [
      { name: 'Soup of the Day', quantity: 2, prepTime: 8 },
    ],
    status: 'dispatched',
    priorityScore: 12.4,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    startedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    dispatchedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // Dispatched 40 minutes ago
    countdownTimer: null,
  },
];

/**
 * Mock inventory items covering various stock level scenarios
 * - Items with healthy stock levels (>50%) - green
 * - Items with medium stock levels (20-50%) - amber
 * - Items with low stock levels (<20%) - red
 * - Items below reorder point - trigger restock tasks
 * - Items at 0% stock level - critical alert
 */
export const mockInventory: InventoryItem[] = [
  // Healthy stock levels (>50%)
  {
    id: 'inv-001',
    itemName: 'Chicken Breast',
    stockLevel: 85,
    reorderPoint: 30,
    unit: 'kg',
  },
  {
    id: 'inv-002',
    itemName: 'Pasta',
    stockLevel: 72,
    reorderPoint: 25,
    unit: 'kg',
  },
  {
    id: 'inv-003',
    itemName: 'Olive Oil',
    stockLevel: 65,
    reorderPoint: 20,
    unit: 'L',
  },
  // Medium stock levels (20-50%) - amber warning
  {
    id: 'inv-004',
    itemName: 'Ground Beef',
    stockLevel: 45,
    reorderPoint: 30,
    unit: 'kg',
  },
  {
    id: 'inv-005',
    itemName: 'Tomatoes',
    stockLevel: 38,
    reorderPoint: 25,
    unit: 'kg',
  },
  {
    id: 'inv-006',
    itemName: 'Lettuce',
    stockLevel: 22,
    reorderPoint: 15,
    unit: 'heads',
  },
  // Low stock levels (<20%) - red alert
  {
    id: 'inv-007',
    itemName: 'Salmon Fillet',
    stockLevel: 18,
    reorderPoint: 25,
    unit: 'kg',
  },
  {
    id: 'inv-008',
    itemName: 'Butter',
    stockLevel: 12,
    reorderPoint: 20,
    unit: 'kg',
  },
  // Below reorder point - should trigger restock task
  {
    id: 'inv-009',
    itemName: 'Eggs',
    stockLevel: 15,
    reorderPoint: 30,
    unit: 'dozen',
  },
  {
    id: 'inv-010',
    itemName: 'Milk',
    stockLevel: 8,
    reorderPoint: 25,
    unit: 'L',
  },
  {
    id: 'inv-011',
    itemName: 'Flour',
    stockLevel: 5,
    reorderPoint: 20,
    unit: 'kg',
  },
  // Critical - at 0% stock level
  {
    id: 'inv-012',
    itemName: 'Heavy Cream',
    stockLevel: 0,
    reorderPoint: 15,
    unit: 'L',
  },
];

/**
 * Mock staff tasks covering all task types and priorities
 * - Delivery tasks (high priority)
 * - Restock tasks (medium priority)
 * - Cleaning tasks (low priority)
 * - Custom tasks
 * - Tasks in various statuses (pending, in_progress, completed)
 * - Tasks assigned to different staff members
 */
export const mockStaffTasks: StaffTask[] = [
  // High priority delivery tasks - pending
  {
    id: 'task-001',
    taskType: 'delivery',
    description: 'Deliver order #order-007 to table 15',
    assignedTo: 'Sarah Johnson',
    status: 'pending',
    priority: 'high',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
  },
  {
    id: 'task-002',
    taskType: 'delivery',
    description: 'Deliver order #order-006 to table 2',
    assignedTo: 'Mike Chen',
    status: 'in_progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
  // Medium priority restock tasks
  {
    id: 'task-003',
    taskType: 'restock',
    description: 'Restock Eggs - current level 15%',
    assignedTo: 'Alex Rodriguez',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
  },
  {
    id: 'task-004',
    taskType: 'restock',
    description: 'Restock Milk - current level 8%',
    assignedTo: 'Sarah Johnson',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 minutes ago
  },
  {
    id: 'task-005',
    taskType: 'restock',
    description: 'Restock Flour - current level 5%',
    assignedTo: 'Mike Chen',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
  },
  {
    id: 'task-006',
    taskType: 'restock',
    description: 'Restock Heavy Cream - current level 0%',
    assignedTo: 'Alex Rodriguez',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
  },
  // Low priority cleaning tasks
  {
    id: 'task-007',
    taskType: 'cleaning',
    description: 'Clean and reset table 9',
    assignedTo: 'Sarah Johnson',
    status: 'pending',
    priority: 'low',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
  {
    id: 'task-008',
    taskType: 'cleaning',
    description: 'Clean and reset table 4',
    assignedTo: 'Mike Chen',
    status: 'completed',
    priority: 'low',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // 40 minutes ago
  },
  {
    id: 'task-009',
    taskType: 'cleaning',
    description: 'Clean and reset table 11',
    assignedTo: 'Alex Rodriguez',
    status: 'in_progress',
    priority: 'low',
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
  },
  // Custom tasks
  {
    id: 'task-010',
    taskType: 'custom',
    description: 'Refill condiment station',
    assignedTo: 'Sarah Johnson',
    status: 'pending',
    priority: 'low',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: 'task-011',
    taskType: 'custom',
    description: 'Check walk-in freezer temperature',
    assignedTo: null, // Unassigned task
    status: 'pending',
    priority: 'medium',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
  },
  // Completed tasks for historical data
  {
    id: 'task-012',
    taskType: 'delivery',
    description: 'Deliver order #order-008 to table 9',
    assignedTo: 'Mike Chen',
    status: 'completed',
    priority: 'high',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // 35 minutes ago
  },
];

/**
 * Mock pipeline logs covering all log levels and event types
 * - INFO: Normal operations (state transitions, task creation)
 * - WARN: Warnings (manual override actions, low inventory)
 * - ERROR: Errors (failed operations, invalid transitions)
 */
export const mockPipelineLogs: PipelineLog[] = [
  // Recent INFO logs
  {
    id: 'log-001',
    timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
    level: 'INFO',
    message: 'Order #order-007 transitioned to ready status',
  },
  {
    id: 'log-002',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    level: 'INFO',
    message: 'Staff task created: Deliver order #order-007 to table 15',
  },
  {
    id: 'log-003',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 minutes ago
    level: 'INFO',
    message: 'Order #order-004 transitioned to cooking status. Countdown timer set to 1020 seconds',
  },
  // WARN logs
  {
    id: 'log-004',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    level: 'WARN',
    message: 'MANUAL: Order #order-006 moved to quality_check',
  },
  {
    id: 'log-005',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
    level: 'WARN',
    message: 'Inventory item Heavy Cream reached 0% stock level',
  },
  {
    id: 'log-006',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    level: 'WARN',
    message: 'Inventory item Eggs below reorder point (15% < 30%). Restock task created.',
  },
  {
    id: 'log-007',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 minutes ago
    level: 'WARN',
    message: 'Inventory item Milk below reorder point (8% < 25%). Restock task created.',
  },
  // ERROR logs
  {
    id: 'log-008',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    level: 'ERROR',
    message: 'Failed to fetch orders from Supabase: Connection timeout. Using mock data.',
  },
  {
    id: 'log-009',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 minutes ago
    level: 'ERROR',
    message: 'Invalid transition attempted: Order #order-003 cannot move from pending to dispatched',
  },
  {
    id: 'log-010',
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
    level: 'ERROR',
    message: '[KitchenOS][useInventory] Failed to update stock level: Database write error',
  },
  // Older INFO logs for feed history
  {
    id: 'log-011',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
    level: 'INFO',
    message: 'Order #order-008 transitioned to dispatched status',
  },
  {
    id: 'log-012',
    timestamp: new Date(Date.now() - 26 * 60 * 1000).toISOString(), // 26 minutes ago
    level: 'INFO',
    message: 'Inventory deduction completed for order #order-008: Chicken Wings (-2 units), Coleslaw (-1 unit)',
  },
  {
    id: 'log-013',
    timestamp: new Date(Date.now() - 27 * 60 * 1000).toISOString(), // 27 minutes ago
    level: 'INFO',
    message: 'Staff task created: Clean and reset table 9',
  },
  {
    id: 'log-014',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    level: 'INFO',
    message: 'Order #order-005 transitioned to cooking status. Countdown timer set to 1200 seconds',
  },
  {
    id: 'log-015',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // 35 minutes ago
    level: 'INFO',
    message: 'Priority scores recalculated for 3 pending orders',
  },
  {
    id: 'log-016',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // 40 minutes ago
    level: 'INFO',
    message: 'Order #order-009 transitioned to dispatched status',
  },
  {
    id: 'log-017',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    level: 'WARN',
    message: 'Manual Override Mode enabled by user',
  },
  {
    id: 'log-018',
    timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(), // 50 minutes ago
    level: 'INFO',
    message: 'System initialized. Connected to Supabase.',
  },
];
