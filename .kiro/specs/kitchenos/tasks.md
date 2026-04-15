# Implementation Plan: KitchenOS

## Overview

This implementation plan breaks down the KitchenOS autonomous restaurant operations system into discrete, actionable coding tasks. The system is built with React 18, TypeScript, Tailwind CSS, and Supabase, following an event-driven architecture with a strict state machine for order pipeline management.

The implementation follows a bottom-up approach: establishing project infrastructure, defining core types and data models, implementing business logic, building reusable UI primitives, composing feature-specific components, and finally integrating real-time synchronization and backend services.

## Tasks

- [x] 1. Project initialization and configuration
  - Initialize nextjs + React + TypeScript project with `npm create nextjs@latest kitchenos -- --template react-ts`
  - Install core dependencies: `@supabase/supabase-js`, `zustand`, `react-router-dom`, `@hello-pangea/dnd`, `recharts`, `lucide-react`, `date-fns`
  - Install dev dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `nextjsst`, `@testing-library/react`, `fast-check`
  - Configure Tailwind CSS with custom design tokens (colors, fonts, spacing) from GUARDRAIL.md Section 8
  - Create `.env.local` with Supabase environment variables (nextjs_SUPABASE_URL, nextjs_SUPABASE_ANON_KEY)
  - Configure `nextjs.config.ts` with code splitting and optimization settings
  - Set up `.gitignore` to exclude `.env.local`, `node_modules`, `dist`
  - _Requirements: 17.1, 18.1, 19.1, 19.5_

- [x] 2. Create documentation structure
  - Create `docs/structure.md` documenting all source files and their purposes
  - Create `docs/handoff.md` with initial project state and next steps
  - Create `docs/roadmap.md` documenting feature roadmap and technical decisions
  - _Requirements: 20.1, 20.2, 20.3_

- [x] 3. Define core TypeScript types and interfaces
  - Create `src/types/index.ts` with all core interfaces: `Order`, `OrderItem`, `OrderStatus`, `InventoryItem`, `StaffTask`, `PipelineLog`, `DemandForecast`
  - Define discriminated union types for order status transitions
  - Export all types for use across the application
  - _Requirements: 18.1, 18.2_

- [x] 3.1 Write property test for type definitions
  - **Property 16: Order Card Rendering Includes All Required Fields**
  - **Validates: Requirements 5.2**

- [x] 4. Implement state machine core logic
  - [x] 4.1 Create `src/lib/stateMachine.ts` with state transition validation
    - Implement `ORDER_STATE_MACHINE` constant defining valid transitions
    - Implement `canTransition(from: OrderStatus, to: OrderStatus): boolean` function
    - Implement `transitionOrder(order: Order, newStatus: OrderStatus, manualOverride: boolean): Promise<void>` function
    - _Requirements: 1.1, 1.6_
  
  - [x] 4.2 Write property test for state machine transitions
    - **Property 1: State Machine Enforces Valid Sequential Transitions**
    - **Validates: Requirements 1.1**
  
  - [x] 4.3 Write property test for invalid transitions
    - **Property 6: Invalid State Transitions Rejected**
    - **Validates: Requirements 1.6**

- [x] 5. Implement calculation utilities
  - [x] 5.1 Create `src/lib/calculations.ts` with priority score and metrics calculations
    - Implement `calculatePriorityScore(order: Order): number` function
    - Implement `calculateCountdownTimer(items: OrderItem[]): number` function
    - Implement `calculateAverageWaitTime(orders: Order[]): number` function
    - Implement `calculateTotalRevenue(orders: Order[]): number` function
    - _Requirements: 2.1, 1.2, 11.1, 11.3_
  
  - [x] 5.2 Write property test for priority score calculation
    - **Property 8: Priority Score Calculation Formula**
    - **Validates: Requirements 2.1**
  
  - [x] 5.3 Write property test for countdown timer calculation
    - **Property 2: Countdown Timer Calculation Matches Formula**
    - **Validates: Requirements 1.2**
  
  - [x] 5.4 Write property test for metrics calculations
    - **Property 28: Revenue Calculation**
    - **Property 30: Average Wait Time Calculation**
    - **Validates: Requirements 11.1, 11.3**

- [x] 6. Implement automation engine
  - [x] 6.1 Create `src/lib/automation.ts` with side effect execution logic
    - Implement `executeTransitionSideEffects(order: Order, newStatus: OrderStatus): Promise<void>` function
    - Implement `decrementInventory(items: OrderItem[]): Promise<void>` function
    - Implement `createStaffTask(task: Omit<StaffTask, 'id' | 'createdAt'>): Promise<void>` function
    - Implement `createRestockTask(inventory: InventoryItem): Promise<void>` function
    - _Requirements: 1.3, 1.4, 1.5, 3.1, 4.1, 4.2, 4.3_
  
  - [x] 6.2 Write property test for delivery task creation
    - **Property 3: Delivery Task Created on Order Ready**
    - **Validates: Requirements 1.3, 4.1**
  
  - [x] 6.3 Write property test for inventory deduction
    - **Property 4: Inventory Deduction Matches Ingredient Map**
    - **Validates: Requirements 1.4, 3.1, 3.2**
  
  - [x] 6.4 Write property test for cleaning task creation
    - **Property 5: Cleaning Task Created on Order Dispatch**
    - **Validates: Requirements 1.5, 4.2**
  
  - [x] 6.5 Write property test for restock task creation
    - **Property 10: Restock Task Created When Inventory Below Reorder Point**
    - **Validates: Requirements 3.3, 4.3**

- [x] 7. Create ingredient deduction map
  - Create `src/lib/ingredientMap.ts` with hardcoded ingredient-to-inventory mapping
  - Define `INGREDIENT_DEDUCTION_MAP` constant with menu items and their ingredient deductions
  - Export `IngredientDeduction` interface
  - _Requirements: 3.2_

- [x] 8. Implement Supabase client wrapper
  - [x] 8.1 Create `src/lib/supabase.ts` with Supabase client initialization
    - Initialize Supabase client with environment variables
    - Implement typed query helpers: `fetchOrders()`, `updateOrderStatus()`, `fetchInventory()`, `updateInventoryStockLevel()`, `fetchStaffTasks()`, `createStaffTask()`, `fetchPipelineLogs()`, `createPipelineLog()`
    - Add error handling with fallback to mock data
    - _Requirements: 17.1, 17.5, 12.1, 12.2_
  
  - [x] 8.2 Write unit tests for Supabase error handling
    - Test fallback to mock data when Supabase is unavailable
    - Test error logging to pipeline_logs table
    - _Requirements: 12.2, 12.4_

- [x] 9. Create mock data module
  - Create `src/lib/mockData.ts` with comprehensive mock data sets
  - Define `mockOrders`, `mockInventory`, `mockStaffTasks`, `mockPipelineLogs` arrays
  - Ensure mock data covers all edge cases (low inventory, high priority orders, various task types)
  - _Requirements: 12.1_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement Zustand store
  - Create `src/store/index.ts` with global state management
  - Define `KitchenOSStore` interface with `manualOverrideMode`, `isOfflineMode`, `selectedModule` state
  - Implement actions: `setManualOverrideMode()`, `setOfflineMode()`, `setSelectedModule()`
  - _Requirements: 9.1, 12.3_

- [ ] 12. Implement custom hooks for data fetching
  - [x] 12.1 Create `src/hooks/useOrders.ts` for order CRUD operations
    - Implement data fetching with Supabase or mock fallback
    - Implement `updateOrderStatus()`, `addOrder()`, `deleteOrder()` functions
    - Return loading, error, and data states
    - _Requirements: 1.1, 10.1_
  
  - [x] 12.2 Create `src/hooks/useInventory.ts` for inventory management
    - Implement data fetching with Supabase or mock fallback
    - Implement `updateStockLevel()`, `addInventoryItem()` functions
    - Return loading, error, and data states
    - _Requirements: 3.1, 7.1_
  
  - [x] 12.3 Create `src/hooks/useStaffTasks.ts` for task management
    - Implement data fetching with Supabase or mock fallback
    - Implement `createTask()`, `updateTaskStatus()`, `assignTask()` functions
    - Implement round-robin assignment logic
    - Return loading, error, and data states
    - _Requirements: 4.1, 4.4_
  
  - [ ] 12.4 Write property test for round-robin task assignment
    - **Property 14: Round-Robin Task Assignment**
    - **Validates: Requirements 4.4**
  
  - [x] 12.5 Create `src/hooks/usePipelineLogs.ts` for log management
    - Implement data fetching with Supabase or mock fallback
    - Implement `createLog()` function
    - Return loading, error, and data states
    - _Requirements: 1.7, 8.1_
  
  - [x] 12.6 Create `src/hooks/useMetrics.ts` for derived metrics calculation
    - Implement real-time calculation of revenue, active orders, average wait time, pending tasks
    - Use `useMemo` for expensive computations
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [ ] 12.7 Write property tests for metrics calculations
    - **Property 29: Active Orders Count**
    - **Property 31: Pending Tasks Count**
    - **Validates: Requirements 11.2, 11.4**

- [ ] 13. Implement real-time synchronization hook
  - [x] 13.1 Create `src/hooks/useRealtime.ts` for Supabase Realtime subscriptions
    - Implement subscription setup with cleanup on unmount
    - Implement fallback to polling with `setInterval` when Realtime unavailable
    - Detect offline mode and update Zustand store
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ] 13.2 Write integration tests for real-time updates
    - Test Supabase Realtime subscription behavior
    - Test fallback to polling when Realtime fails
    - _Requirements: 10.1, 10.3_

- [ ] 14. Create UI primitive components
  - [x] 14.1 Create `src/components/ui/Button.tsx`
    - Implement button with variants (primary, secondary, danger)
    - Add hover states and accessibility attributes
    - _Requirements: 15.1, 15.2, 15.8_
  
  - [x] 14.2 Create `src/components/ui/Card.tsx`
    - Implement card surface with border styling from design system
    - _Requirements: 15.1, 15.6_
  
  - [x] 14.3 Create `src/components/ui/Badge.tsx`
    - Implement badge with color variants (success, warning, danger, info)
    - _Requirements: 15.7_
  
  - [x] 14.4 Create `src/components/ui/ProgressBar.tsx`
    - Implement progress bar with color coding based on percentage thresholds
    - _Requirements: 7.2_
  
  - [ ] 14.5 Write property test for progress bar color coding
    - **Property 21: Stock Level Color Coding**
    - **Validates: Requirements 7.2**
  
  - [x] 14.6 Create `src/components/ui/SkeletonLoader.tsx`
    - Implement skeleton loader for loading states
    - _Requirements: 12.5_
  
  - [x] 14.7 Create `src/components/ui/ErrorBadge.tsx`
    - Implement inline error badge for error states
    - _Requirements: 12.6_

- [ ] 15. Create layout components
  - [x] 15.1 Create `src/components/layout/Sidebar.tsx`
    - Implement navigation links to all four modules
    - Highlight active module based on current route
    - _Requirements: 14.1, 14.2_
  
  - [x] 15.2 Create `src/components/layout/TopBar.tsx`
    - Display system status, current time, offline mode badge
    - Display manual override mode warning banner
    - _Requirements: 14.3, 9.5, 12.4_
  
  - [x] 15.3 Create `src/components/layout/AppShell.tsx`
    - Compose Sidebar, TopBar, and Outlet (page content area)
    - Apply consistent layout structure
    - _Requirements: 14.5_

- [x] 16. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Implement Command Center page components
  - [x] 17.1 Create `src/components/command-center/MetricCard.tsx`
    - Display metric label, value, and optional trend indicator
    - Format currency values with appropriate symbols
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.6_
  
  - [ ] 17.2 Write property test for currency formatting
    - **Property 32: Currency Formatting**
    - **Validates: Requirements 11.6**
  
  - [x] 17.3 Create `src/components/command-center/MetricsGrid.tsx`
    - Compose four MetricCard components for revenue, active orders, avg wait time, pending tasks
    - Use `useMetrics()` hook for data
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [x] 17.4 Create `src/components/command-center/LogEntry.tsx`
    - Display timestamp, level badge, and message
    - Apply color coding based on log level (INFO/WARN/ERROR)
    - _Requirements: 8.2, 8.4_
  
  - [ ] 17.5 Write property test for log level color coding
    - **Property 25: Log Level Color Coding**
    - **Validates: Requirements 8.4**
  
  - [x] 17.6 Create `src/components/command-center/PipelineLogFeed.tsx`
    - Display scrollable list of LogEntry components
    - Auto-scroll to newest entry when new log created
    - Sort entries in reverse chronological order
    - Use `usePipelineLogs()` hook for data
    - _Requirements: 8.1, 8.3, 8.7_
  
  - [ ] 17.7 Write property test for log sorting
    - **Property 26: Log Entries Sorted Reverse Chronologically**
    - **Validates: Requirements 8.7**
  
  - [x] 17.8 Create `src/components/command-center/ManualOverrideToggle.tsx`
    - Implement toggle control for manual override mode
    - Update Zustand store when toggled
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [x] 17.9 Create `src/pages/CommandCenter.tsx`
    - Compose MetricsGrid, PipelineLogFeed, and ManualOverrideToggle
    - Apply page layout and styling
    - _Requirements: 11.1, 8.1, 9.1_

- [ ] 18. Implement Kitchen Display System (KDS) page components
  - [x] 18.1 Create `src/components/kds/OrderCard.tsx`
    - Display order number, table number, items list, priority score, elapsed time
    - Display countdown timer with warning indicator when < 20% remaining
    - Apply visual styling from design system
    - _Requirements: 5.2, 5.6_
  
  - [ ] 18.2 Write property test for timer warning logic
    - **Property 17: Timer Warning Logic**
    - **Validates: Requirements 5.6**
  
  - [x] 18.3 Create `src/components/kds/ColumnContainer.tsx`
    - Implement droppable column for kanban board using `@hello-pangea/dnd`
    - Display column title and order count
    - _Requirements: 5.1_
  
  - [x] 18.4 Create `src/components/kds/KanbanBoard.tsx`
    - Implement drag-and-drop context with four columns (Pending, Cooking, Quality Check, Ready)
    - Handle `onDragEnd` callback to trigger state transitions
    - Validate transitions based on manual override mode
    - Sort pending orders by priority score
    - Use `useOrders()` hook for data
    - _Requirements: 5.1, 5.3, 5.4, 5.5, 2.3_
  
  - [ ] 18.5 Write property test for order sorting
    - **Property 9: Orders Sorted by Priority Score Descending**
    - **Validates: Requirements 2.3**
  
  - [x] 18.6 Create `src/pages/KitchenDisplay.tsx`
    - Compose KanbanBoard component
    - Apply page layout and styling
    - _Requirements: 5.1_

- [ ] 19. Implement AI Hub page components
  - [x] 19.1 Create `src/components/ai-hub/InventoryProgressBar.tsx`
    - Display stock level as progress bar with color coding
    - _Requirements: 7.2_
  
  - [x] 19.2 Create `src/components/ai-hub/InventoryItem.tsx`
    - Display item name, stock level, unit, and warning badge if below reorder point
    - Use InventoryProgressBar component
    - _Requirements: 7.1, 7.3_
  
  - [ ] 19.3 Write property test for warning badge logic
    - **Property 22: Warning Badge When Below Reorder Point**
    - **Validates: Requirements 7.3**
  
  - [x] 19.4 Create `src/components/ai-hub/InventoryList.tsx`
    - Display list of InventoryItem components
    - Use `useInventory()` hook for data
    - _Requirements: 7.1_
  
  - [x] 19.5 Create `src/components/ai-hub/StockAlerts.tsx`
    - Display "At Risk Items" list filtered by items below reorder point
    - _Requirements: 7.4_
  
  - [ ] 19.6 Write property test for at-risk items filtering
    - **Property 23: At-Risk Items Filtering**
    - **Validates: Requirements 7.4**
  
  - [x] 19.7 Create `src/components/ai-hub/DemandChart.tsx`
    - Implement line chart using Recharts showing projected vs actual demand by hour
    - Highlight hours where actual > projected × 1.2
    - Calculate projected demand from historical data
    - Calculate actual demand from current day orders
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ] 19.8 Write property tests for demand calculations
    - **Property 18: Demand Projection Calculation**
    - **Property 19: Actual Demand Counting**
    - **Property 20: Demand Highlighting Logic**
    - **Validates: Requirements 6.2, 6.3, 6.4**
  
  - [x] 19.9 Create `src/pages/AIHub.tsx`
    - Compose DemandChart, InventoryList, and StockAlerts components
    - Apply page layout and styling
    - _Requirements: 6.1, 7.1_

- [x] 20. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 21. Implement Staff Dispatch page components
  - [x] 21.1 Create `src/components/staff-dispatch/TaskStatusBadge.tsx`
    - Display task status with color coding (pending, in_progress, completed)
    - _Requirements: 4.1_
  
  - [x] 21.2 Create `src/components/staff-dispatch/TaskCard.tsx`
    - Display task type, description, assigned staff, status badge, priority
    - Apply visual styling from design system
    - _Requirements: 4.1_
  
  - [ ] 21.3 Write property test for task priority based on type
    - **Property 15: Task Priority Based on Type**
    - **Validates: Requirements 4.5**
  
  - [x] 21.4 Create `src/components/staff-dispatch/TaskFilters.tsx`
    - Implement filter controls for task status and priority
    - _Requirements: 4.1_
  
  - [x] 21.5 Create `src/components/staff-dispatch/TaskList.tsx`
    - Display list of TaskCard components sorted by priority
    - Apply filters from TaskFilters component
    - Use `useStaffTasks()` hook for data
    - _Requirements: 4.1_
  
  - [x] 21.6 Create `src/pages/StaffDispatch.tsx`
    - Compose TaskFilters and TaskList components
    - Apply page layout and styling
    - _Requirements: 4.1_

- [x] 22. Implement routing and navigation
  - Create `src/App.tsx` with React Router configuration
  - Define routes: `/` (redirect to `/command-center`), `/command-center`, `/kitchen`, `/ai-hub`, `/staff`, `*` (redirect to `/command-center`)
  - Wrap all routes in AppShell layout
  - _Requirements: 14.4, 14.7_

- [ ] 23. Implement logging for all state transitions and automation
  - [x] 23.1 Add pipeline log creation to all state transition functions
    - Log order status changes with INFO level
    - Log manual override actions with WARN level
    - Log errors with ERROR level
    - _Requirements: 1.7, 9.7_
  
  - [ ] 23.2 Write property test for logging completeness
    - **Property 7: All State Transitions and Automation Events Logged**
    - **Validates: Requirements 1.7, 3.5, 4.6**
  
  - [ ] 23.3 Write property test for manual move logging format
    - **Property 27: Manual Move Logging Format**
    - **Validates: Requirements 9.7**

- [ ] 24. Implement idempotency for automation actions
  - [x] 24.1 Add duplicate prevention logic to task creation functions
    - Check for existing tasks before creating new ones
    - Use unique identifiers (order ID, inventory item ID) to prevent duplicates
    - _Requirements: 3.4, 4.7_
  
  - [ ] 24.2 Write property test for task creation idempotency
    - **Property 11: Task Creation Idempotency**
    - **Validates: Requirements 3.4, 4.7**
  
  - [x] 24.3 Add duplicate prevention logic to inventory deduction
    - Track dispatched orders to prevent double deduction
    - _Requirements: 3.7_
  
  - [ ] 24.4 Write property test for inventory deduction idempotency
    - **Property 13: Inventory Deduction Idempotency**
    - **Validates: Requirements 3.7**

- [-] 25. Implement stock level bounds checking
  - Add validation to prevent negative stock levels
  - Clamp stock level to 0% when deduction would result in negative value
  - Log warning when stock level reaches 0%
  - _Requirements: 3.6_

- [ ] 25.1 Write property test for stock level clamping
  - **Property 12: Stock Level Clamped to Zero**
  - **Validates: Requirements 3.6**

- [x] 26. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 27. Set up Supabase database schema
  - [x] 27.1 Create SQL migration file for orders table
    - Define schema with all columns: id, table_number, items (JSONB), status, priority_score, countdown_timer, created_at, started_at, dispatched_at
    - Add indexes for status, priority_score, created_at
    - _Requirements: 17.1_
  
  - [x] 27.2 Create SQL migration file for inventory table
    - Define schema with all columns: id, item_name, stock_level, reorder_point, unit
    - Add index for stock_level
    - _Requirements: 17.2_
  
  - [x] 27.3 Create SQL migration file for staff_tasks table
    - Define schema with all columns: id, task_type, description, assigned_to, status, priority, created_at
    - Add indexes for status, priority
    - _Requirements: 17.3_
  
  - [x] 27.4 Create SQL migration file for pipeline_logs table
    - Define schema with all columns: id, timestamp, level, message
    - Add indexes for timestamp, level
    - _Requirements: 17.4_
  
  - [x] 27.5 Create SQL migration file for Row Level Security policies
    - Enable RLS on all tables
    - Create policies allowing all operations for authenticated users
    - _Requirements: 17.5_
  
  - [x] 27.6 Create SQL migration file for Realtime publication
    - Add all tables to supabase_realtime publication
    - _Requirements: 17.6_

- [x] 28. Implement priority score recalculation
  - Create background task to recalculate priority scores every 30 seconds for pending orders
  - Use `setInterval` in `useOrders()` hook
  - Clear interval on component unmount
  - _Requirements: 2.2, 2.6_

- [ ] 29. Implement current day data filtering
  - Add utility function to filter orders by current operational day
  - Apply filter to metrics calculations
  - _Requirements: 11.7_

- [ ] 29.1 Write property test for current day filtering
  - **Property 33: Current Day Data Filtering**
  - **Validates: Requirements 11.7**

- [ ] 30. Implement error handling and logging
  - [x] 30.1 Wrap all async operations in try-catch blocks
    - Add error handling to all Supabase queries
    - Add error handling to all state transitions
    - Add error handling to all automation functions
    - _Requirements: 12.7_
  
  - [x] 30.2 Implement error logging to console and pipeline_logs
    - Use consistent error format: `[KitchenOS][ModuleName]`
    - Log all errors to pipeline_logs table with ERROR level
    - _Requirements: 12.4_
  
  - [ ] 30.3 Write property test for error log formatting
    - **Property 34: Error Log Formatting**
    - **Validates: Requirements 12.4**

- [ ] 31. Implement performance optimizations
  - [x] 31.1 Add React.memo to all list item components
    - Wrap OrderCard, InventoryItem, TaskCard, LogEntry in React.memo
    - _Requirements: 16.2_
  
  - [x] 31.2 Add useCallback to all callback props
    - Wrap event handlers passed as props in useCallback
    - _Requirements: 16.3_
  
  - [x] 31.3 Add useMemo to expensive computations
    - Wrap priority sorting, demand calculations, metrics calculations in useMemo
    - _Requirements: 16.4_

- [x] 32. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 33. Write comprehensive test suite
  - [ ] 33.1 Create property tests for all business logic
    - Create `tests/properties/stateMachine.property.test.ts`
    - Create `tests/properties/calculations.property.test.ts`
    - Create `tests/properties/automation.property.test.ts`
    - Create `tests/properties/sorting.property.test.ts`
    - Create `tests/properties/formatting.property.test.ts`
    - Ensure all 34 correctness properties are tested
    - _Requirements: All requirements_
  
  - [ ] 33.2 Create unit tests for components
    - Test component rendering with various props
    - Test error states and loading states
    - Test user interactions (clicks, drags, form submissions)
    - _Requirements: All requirements_
  
  - [ ] 33.3 Create integration tests
    - Test end-to-end order pipeline flow
    - Test Supabase CRUD operations
    - Test real-time synchronization
    - _Requirements: 1.1, 10.1_

- [ ] 34. Build and deployment preparation
  - [x] 34.1 Configure production build settings
    - Verify `nextjs.config.ts` has code splitting and minification enabled
    - Verify source maps are disabled in production
    - _Requirements: 19.1, 19.6_
  
  - [x] 34.2 Create `vercel.json` configuration file
    - Configure build command, output directory, framework
    - Configure environment variable references
    - _Requirements: 19.2, 19.3_
  
  - [x] 34.3 Test production build locally
    - Run `npm run build` and verify zero errors
    - Run `npm run preview` and test all pages
    - Verify bundle size is < 500KB gzipped
    - _Requirements: 19.1, 16.6_
  
  - [ ] 34.4 Deploy to Vercel
    - Connect GitHub repository to Vercel
    - Configure environment variables in Vercel dashboard
    - Enable automatic deployments
    - _Requirements: 19.2, 19.3, 19.4_

- [x] 35. Final checkpoint and documentation update
  - Ensure all tests pass, verify all features working end-to-end
  - Update `docs/handoff.md` with final project state, deployment URL, and next steps
  - Update `docs/structure.md` with complete file listing
  - Update `docs/task.md` marking all tasks as complete
  - _Requirements: 20.5, 20.6, 20.7_

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end workflows
- All code must comply with GUARDRAIL.md constraints (no forbidden technologies, design system compliance, TypeScript type safety)
- Supabase setup (database schema creation) should be done via Supabase dashboard or CLI before implementing data hooks
- Mock data fallback ensures the application works offline for demo purposes
