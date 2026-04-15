# Requirements Document: KitchenOS

## Introduction

KitchenOS is an autonomous restaurant operations system designed to eliminate back-end operational chaos by integrating Order Entry, Kitchen Display, Inventory Management, and Staff Tasking into a single event-driven pipeline. The system is a B2B SaaS prototype targeting internal restaurant operations staff (managers, kitchen staff, floor staff) with zero budget constraints and a focus on automation through deterministic business logic.

The system operates as a desktop-first web application with four core modules: Command Center (manager dashboard), Kitchen Display System (KDS), AI Hub (inventory and demand forecasting), and Staff Dispatch (automated task routing). All automation is driven by a strict state machine that ensures order pipeline integrity and triggers downstream actions (inventory deduction, staff task creation, pipeline logging) at specific state transitions.

## Glossary

- **KitchenOS**: The complete autonomous restaurant operations system
- **Command_Center**: Manager's master dashboard displaying live pipeline feed, metrics, and system controls
- **KDS**: Kitchen Display System - Kanban-style interface for kitchen staff to manage order pipeline
- **AI_Hub**: Module containing inventory tracking and demand forecasting functionality
- **Staff_Dispatch**: Module for automated task generation and assignment to restaurant staff
- **Order**: A customer order containing items, table number, status, and priority score
- **Order_Pipeline**: The state machine governing order progression from pending to dispatched
- **Pipeline_State**: One of five valid states: pending, cooking, quality_check, ready, dispatched
- **Priority_Score**: Calculated value determining order urgency: (prepTime × 0.6) + (waitTime × 0.4)
- **Inventory_Item**: A tracked ingredient or supply with stock level, reorder point, and unit
- **Stock_Level**: Percentage value (0-100%) representing current inventory quantity
- **Reorder_Point**: Threshold percentage below which a restock task is auto-generated
- **Staff_Task**: An automated or manual task assigned to restaurant staff
- **Task_Type**: Category of task: delivery, cleaning, restock, or custom
- **Pipeline_Log**: System event record with timestamp, level (INFO/WARN/ERROR), and message
- **Manual_Override_Mode**: System state where AI automation is disabled and manual control is enabled
- **Ingredient_Deduction_Map**: Hardcoded mapping of order items to inventory items and quantities
- **Demand_Forecast**: Predicted hourly order volume based on historical patterns
- **Supabase**: PostgreSQL database and real-time backend service (free tier)
- **Mock_Data_Mode**: Fallback operational mode when Supabase is unavailable

## Requirements

### Requirement 1: Order Pipeline State Management

**User Story:** As a kitchen staff member, I want orders to progress through a strict state machine, so that order status is always accurate and triggers correct downstream automation.

#### Acceptance Criteria

1. THE Order_Pipeline SHALL enforce exactly five states in sequence: pending → cooking → quality_check → ready → dispatched
2. WHEN an Order transitions from pending to cooking, THE Order_Pipeline SHALL calculate and store a countdown timer equal to sum of (item.prepTime × quantity)
3. WHEN an Order transitions from cooking to quality_check, THE Order_Pipeline SHALL auto-create a Staff_Task of type 'delivery'
4. WHEN an Order transitions from quality_check to dispatched, THE Order_Pipeline SHALL decrement Inventory_Items according to the Ingredient_Deduction_Map
5. WHEN an Order transitions to dispatched, THE Order_Pipeline SHALL auto-create a Staff_Task of type 'cleaning' for the associated table number
6. IF an Order attempts to skip a Pipeline_State, THEN THE Order_Pipeline SHALL reject the transition and log an error
7. WHEN any Order state transition occurs, THE Order_Pipeline SHALL write a Pipeline_Log entry with timestamp and transition details
8. FOR ALL Order state transitions, the system SHALL maintain referential integrity: every transition SHALL update the database, create a log entry, and trigger downstream automation atomically

### Requirement 2: Priority Score Calculation and Sorting

**User Story:** As a kitchen manager, I want orders automatically prioritized by urgency, so that high-priority orders are cooked first.

#### Acceptance Criteria

1. WHEN a new Order is created, THE KitchenOS SHALL calculate Priority_Score as (prepTime × 0.6) + (waitTime × 0.4)
2. WHILE an Order has status 'pending', THE KitchenOS SHALL recalculate Priority_Score every 30 seconds
3. THE KDS SHALL display pending Orders sorted by Priority_Score in descending order
4. WHEN Manual_Override_Mode is enabled, THE KitchenOS SHALL disable automatic Priority_Score sorting
5. WHEN Manual_Override_Mode is disabled, THE KitchenOS SHALL re-enable automatic Priority_Score sorting and re-sort all pending Orders
6. FOR ALL pending Orders, recalculating priority scores and re-sorting SHALL complete within 100ms to maintain UI responsiveness

### Requirement 3: Inventory Deduction on Order Dispatch

**User Story:** As a restaurant manager, I want inventory automatically decremented when orders are dispatched, so that stock levels remain accurate without manual tracking.

#### Acceptance Criteria

1. WHEN an Order transitions to 'dispatched' status, THE KitchenOS SHALL decrement Stock_Level for each Inventory_Item in the Ingredient_Deduction_Map
2. THE KitchenOS SHALL use the Ingredient_Deduction_Map to determine which Inventory_Items and quantities to deduct for each order item
3. IF an Inventory_Item Stock_Level falls below Reorder_Point after deduction, THEN THE KitchenOS SHALL auto-create a Staff_Task of type 'restock' for that item
4. THE KitchenOS SHALL create at most one 'restock' task per Inventory_Item per deduction cycle (no duplicate restock tasks)
5. WHEN inventory deduction occurs, THE KitchenOS SHALL write a Pipeline_Log entry listing all decremented items and new stock levels
6. IF an Inventory_Item Stock_Level would become negative after deduction, THEN THE KitchenOS SHALL set Stock_Level to 0% and log a warning
7. FOR ALL dispatched Orders, inventory deduction SHALL occur exactly once per order (idempotent operation)

### Requirement 4: Automated Staff Task Generation

**User Story:** As a floor manager, I want tasks automatically created and assigned when specific events occur, so that staff know what to do without manual coordination.

#### Acceptance Criteria

1. WHEN an Order transitions to 'ready' status, THE Staff_Dispatch SHALL auto-create a Staff_Task of type 'delivery' with description "Deliver order #[orderNumber] to table [tableNumber]"
2. WHEN an Order transitions to 'dispatched' status, THE Staff_Dispatch SHALL auto-create a Staff_Task of type 'cleaning' with description "Clean and reset table [tableNumber]"
3. WHEN an Inventory_Item Stock_Level falls below Reorder_Point, THE Staff_Dispatch SHALL auto-create a Staff_Task of type 'restock' with description "Restock [itemName] - current level [stockLevel]%"
4. THE Staff_Dispatch SHALL assign tasks using round-robin distribution across available staff members
5. WHEN a Staff_Task is auto-created, THE Staff_Dispatch SHALL set priority based on task type: delivery (high), restock (medium), cleaning (low)
6. THE Staff_Dispatch SHALL write a Pipeline_Log entry for each auto-created task
7. FOR ALL auto-created Staff_Tasks, the system SHALL prevent duplicate task creation for the same triggering event

### Requirement 5: Kitchen Display System (KDS) Interface

**User Story:** As a kitchen staff member, I want a visual kanban board showing all orders by status, so that I can see what needs to be cooked and move orders through the pipeline.

#### Acceptance Criteria

1. THE KDS SHALL display four columns representing states: Pending, Cooking, Quality Check, Ready
2. THE KDS SHALL render each Order as a card showing order number, table number, items, priority score, and elapsed time
3. WHEN a kitchen staff member drags an Order card to the next column, THE KDS SHALL transition the Order to the corresponding Pipeline_State
4. WHILE Manual_Override_Mode is disabled, THE KDS SHALL disable drag-and-drop between non-sequential columns
5. WHILE Manual_Override_Mode is enabled, THE KDS SHALL enable drag-and-drop between any columns
6. WHEN an Order in 'cooking' status has less than 20% of countdown timer remaining, THE KDS SHALL display a visual warning indicator on that Order card
7. THE KDS SHALL update in real-time when Orders are modified by other users or system automation
8. FOR ALL Order cards in the KDS, dragging and dropping SHALL trigger the same state transition logic and downstream automation as manual status updates

### Requirement 6: Demand Forecasting and Visualization

**User Story:** As a restaurant manager, I want to see predicted hourly order volume compared to actual volume, so that I can anticipate busy periods and adjust staffing.

#### Acceptance Criteria

1. THE AI_Hub SHALL display a line chart showing projected demand and actual demand for the current day by hour
2. THE AI_Hub SHALL calculate projected demand using historical order patterns from Mock_Data_Mode
3. THE AI_Hub SHALL calculate actual demand by counting Orders created in each hour of the current day
4. THE AI_Hub SHALL highlight hours where actual demand exceeds projected demand by more than 20%
5. THE AI_Hub SHALL update the demand chart every 5 minutes with new actual demand data
6. WHEN no historical data exists, THE AI_Hub SHALL display a placeholder message "Insufficient data for forecast"
7. FOR ALL demand forecast calculations, the system SHALL use deterministic algorithms (no external ML API calls)

### Requirement 7: Inventory Tracking and Alerts

**User Story:** As a restaurant manager, I want to see current stock levels with visual indicators, so that I know which items need restocking before they run out.

#### Acceptance Criteria

1. THE AI_Hub SHALL display all Inventory_Items with current Stock_Level as a percentage
2. THE AI_Hub SHALL render Stock_Level as a progress bar with color coding: green (>50%), amber (20-50%), red (<20%)
3. WHEN an Inventory_Item Stock_Level falls below Reorder_Point, THE AI_Hub SHALL display a warning badge next to that item
4. THE AI_Hub SHALL display a list of "At Risk Items" showing all Inventory_Items below Reorder_Point
5. THE AI_Hub SHALL update inventory displays in real-time when Stock_Levels change
6. WHEN an Inventory_Item reaches 0% Stock_Level, THE AI_Hub SHALL display a critical alert badge
7. FOR ALL Inventory_Items, stock level changes SHALL be reflected in the UI within 2 seconds of database update

### Requirement 8: Pipeline Log Feed

**User Story:** As a system administrator, I want to see a live feed of all system events, so that I can monitor automation and troubleshoot issues.

#### Acceptance Criteria

1. THE Command_Center SHALL display a scrollable Pipeline_Log feed showing the most recent 100 log entries
2. THE Command_Center SHALL render each Pipeline_Log entry with timestamp, level badge (INFO/WARN/ERROR), and message
3. THE Command_Center SHALL auto-scroll to the newest entry when a new Pipeline_Log is created
4. THE Command_Center SHALL color-code log levels: INFO (lime), WARN (amber), ERROR (red)
5. WHEN a new Pipeline_Log entry is created, THE Command_Center SHALL animate the entry appearance
6. THE Command_Center SHALL update the log feed in real-time using Supabase Realtime or setInterval polling
7. FOR ALL Pipeline_Log entries, the feed SHALL display entries in reverse chronological order (newest first)

### Requirement 9: Manual Override Mode

**User Story:** As a kitchen manager, I want to disable AI automation and manually control the pipeline, so that I can handle special situations that require human judgment.

#### Acceptance Criteria

1. THE Command_Center SHALL provide a toggle control labeled "Manual Override Mode"
2. WHEN Manual_Override_Mode is enabled, THE KitchenOS SHALL disable automatic Priority_Score sorting
3. WHEN Manual_Override_Mode is enabled, THE KitchenOS SHALL disable automated Staff_Task generation
4. WHEN Manual_Override_Mode is enabled, THE KitchenOS SHALL enable unrestricted drag-and-drop in the KDS
5. WHEN Manual_Override_Mode is enabled, THE KitchenOS SHALL display a warning banner "AI AUTOMATION DISABLED"
6. WHEN Manual_Override_Mode is disabled, THE KitchenOS SHALL re-enable all automation features
7. WHEN an Order is manually moved in Manual_Override_Mode, THE KitchenOS SHALL log the action as "MANUAL: Order #[orderNumber] moved to [status]"
8. FOR ALL manual actions in Manual_Override_Mode, the system SHALL still enforce pipeline state machine rules and log all transitions

### Requirement 10: Real-Time Data Synchronization

**User Story:** As a restaurant staff member, I want to see live updates when other users or automation changes data, so that I always see the current system state.

#### Acceptance Criteria

1. WHEN Supabase is available, THE KitchenOS SHALL subscribe to real-time updates for orders, inventory, staff_tasks, and pipeline_logs tables
2. WHEN a subscribed table row is inserted, updated, or deleted, THE KitchenOS SHALL update the UI within 1 second
3. WHEN Supabase is unavailable, THE KitchenOS SHALL fall back to polling every 5 seconds using setInterval
4. THE KitchenOS SHALL display an "OFFLINE MODE" badge in the top bar when operating in Mock_Data_Mode
5. WHEN the component unmounts, THE KitchenOS SHALL unsubscribe from all Supabase Realtime channels
6. WHEN the component unmounts, THE KitchenOS SHALL clear all setInterval timers
7. FOR ALL real-time updates, the system SHALL handle concurrent modifications gracefully without data loss or UI corruption

### Requirement 11: Metrics Dashboard

**User Story:** As a restaurant manager, I want to see key performance metrics at a glance, so that I can assess operational efficiency.

#### Acceptance Criteria

1. THE Command_Center SHALL display total revenue calculated as sum of all dispatched Order values
2. THE Command_Center SHALL display active orders count (all Orders not in 'dispatched' status)
3. THE Command_Center SHALL display average wait time calculated as mean time from Order creation to 'dispatched' status
4. THE Command_Center SHALL display pending tasks count (all Staff_Tasks with status 'pending')
5. THE Command_Center SHALL update all metrics in real-time when underlying data changes
6. THE Command_Center SHALL format currency values with appropriate symbols and decimal places
7. FOR ALL metrics, calculations SHALL use only data from the current operational day (reset at midnight)

### Requirement 12: Error Handling and Fallback

**User Story:** As a system user, I want the application to continue functioning when the database is unavailable, so that I can still view and interact with data during outages.

#### Acceptance Criteria

1. WHEN Supabase environment variables are missing or invalid, THE KitchenOS SHALL fall back to Mock_Data_Mode
2. WHEN a Supabase query fails, THE KitchenOS SHALL log the error and return mock data instead
3. WHEN operating in Mock_Data_Mode, THE KitchenOS SHALL display an "OFFLINE MODE" badge in amber color
4. THE KitchenOS SHALL log all Supabase errors to the browser console with prefix "[KitchenOS][ModuleName]"
5. WHEN a component is loading data, THE KitchenOS SHALL display a skeleton loader (not a spinner)
6. WHEN a component encounters an error, THE KitchenOS SHALL display an inline error badge (not a full-page error)
7. FOR ALL async operations, the system SHALL wrap calls in try-catch blocks and handle errors gracefully without crashing

### Requirement 13: Authentication and Access Control

**User Story:** As a restaurant owner, I want basic authentication to prevent unauthorized access, so that only staff can use the system.

#### Acceptance Criteria

1. THE KitchenOS SHALL use Supabase Auth with email/password authentication only
2. WHEN a user is not authenticated, THE KitchenOS SHALL redirect to a login page
3. WHEN a user successfully authenticates, THE KitchenOS SHALL redirect to the Command_Center
4. THE KitchenOS SHALL store authentication tokens using Supabase client session management
5. WHEN a user logs out, THE KitchenOS SHALL clear the session and redirect to the login page
6. THE KitchenOS SHALL NOT implement role-based access control (all authenticated users have full access)
7. FOR ALL authenticated sessions, the system SHALL use Supabase Row Level Security policies to enforce data access rules

### Requirement 14: Responsive Layout and Navigation

**User Story:** As a restaurant staff member, I want to navigate between modules easily, so that I can access different parts of the system quickly.

#### Acceptance Criteria

1. THE KitchenOS SHALL display a persistent sidebar with navigation links to all four modules
2. THE KitchenOS SHALL highlight the active module in the sidebar
3. THE KitchenOS SHALL display a top bar with system status, current time, and user controls
4. WHEN a user clicks a navigation link, THE KitchenOS SHALL navigate to the corresponding module without page reload
5. THE KitchenOS SHALL render all pages in a consistent layout with sidebar, top bar, and content area
6. THE KitchenOS SHALL use desktop-first design with minimum viewport width of 1280px
7. FOR ALL navigation actions, the system SHALL update the browser URL to reflect the current module

### Requirement 15: Visual Design System Compliance

**User Story:** As a product designer, I want all UI components to follow the cyber-industrial design language, so that the application has a consistent visual identity.

#### Acceptance Criteria

1. THE KitchenOS SHALL use pure black (#000000) as the base background color for all pages
2. THE KitchenOS SHALL use electric lime (#E2FF43) as the primary accent color
3. THE KitchenOS SHALL use Inter font family for all UI text
4. THE KitchenOS SHALL use JetBrains Mono font family for all data, logs, and monospace content
5. THE KitchenOS SHALL use border radius values between 0px and 4px only (no rounded-xl or rounded-full)
6. THE KitchenOS SHALL use 1px solid borders with color #1E1E1E on all card surfaces
7. THE KitchenOS SHALL use status colors: success (#00FF41), warning (#FFBF00), danger (#FF3131)
8. FOR ALL interactive elements, the system SHALL provide hover states with increased border brightness or background opacity

### Requirement 16: Performance and Optimization

**User Story:** As a system user, I want the application to load quickly and respond instantly, so that I can work efficiently during busy service periods.

#### Acceptance Criteria

1. THE KitchenOS SHALL render the initial page within 3 seconds on a standard broadband connection
2. WHEN rendering lists with more than 5 items, THE KitchenOS SHALL use React.memo on list item components
3. WHEN passing callbacks as props, THE KitchenOS SHALL wrap them in useCallback to prevent unnecessary re-renders
4. WHEN performing expensive computations, THE KitchenOS SHALL wrap them in useMemo
5. THE KitchenOS SHALL limit animation durations to 400ms or less
6. THE KitchenOS SHALL bundle to a total size less than 500KB gzipped
7. FOR ALL user interactions, the system SHALL provide visual feedback within 100ms

### Requirement 17: Data Persistence and Schema

**User Story:** As a system administrator, I want all data stored in a structured database, so that data persists across sessions and can be queried efficiently.

#### Acceptance Criteria

1. THE KitchenOS SHALL store Orders in a Supabase table with columns: id, table_number, items (JSONB), status, priority_score, created_at, started_at, dispatched_at
2. THE KitchenOS SHALL store Inventory_Items in a Supabase table with columns: id, item_name, stock_level, reorder_point, unit
3. THE KitchenOS SHALL store Staff_Tasks in a Supabase table with columns: id, task_type, description, assigned_to, status, priority, created_at
4. THE KitchenOS SHALL store Pipeline_Logs in a Supabase table with columns: id, timestamp, level, message
5. THE KitchenOS SHALL enable Row Level Security on all tables
6. THE KitchenOS SHALL add all tables to the supabase_realtime publication for real-time subscriptions
7. FOR ALL database operations, the system SHALL handle errors and fall back to mock data when Supabase is unavailable

### Requirement 18: TypeScript Type Safety

**User Story:** As a developer, I want all data structures strongly typed, so that type errors are caught at compile time.

#### Acceptance Criteria

1. THE KitchenOS SHALL define TypeScript interfaces for Order, InventoryItem, StaffTask, and PipelineLog in src/types/index.ts
2. THE KitchenOS SHALL use explicit return types on all functions
3. THE KitchenOS SHALL type all useState hooks with explicit type parameters
4. THE KitchenOS SHALL type all event handlers with React event types
5. THE KitchenOS SHALL NOT use the 'any' type anywhere in the codebase
6. THE KitchenOS SHALL compile without TypeScript errors when running 'npx tsc --noEmit'
7. FOR ALL component props, the system SHALL define a typed Props interface at the top of each component file

### Requirement 19: Build and Deployment

**User Story:** As a developer, I want the application to build and deploy successfully, so that it can be hosted and accessed by users.

#### Acceptance Criteria

1. THE KitchenOS SHALL build successfully using 'npm run build' with zero errors
2. THE KitchenOS SHALL deploy to Vercel free tier
3. THE KitchenOS SHALL load environment variables from Vercel environment settings
4. THE KitchenOS SHALL serve static assets from Vercel CDN
5. THE KitchenOS SHALL use Next js for build tooling and development server
6. THE KitchenOS SHALL generate a production bundle with code splitting and tree shaking
7. FOR ALL production builds, the system SHALL exclude source maps and development-only code

### Requirement 20: Documentation and Handoff

**User Story:** As a developer taking over the project, I want comprehensive documentation, so that I can understand the system architecture and continue development.

#### Acceptance Criteria

1. THE KitchenOS SHALL maintain a structure.md file documenting all source files and their purposes
2. THE KitchenOS SHALL maintain a handoff.md file documenting current state, completed tasks, and next steps
3. THE KitchenOS SHALL maintain a roadmap.md file documenting feature roadmap and technical decisions
4. THE KitchenOS SHALL maintain a task.md file tracking all completed and pending tasks
5. WHEN a new file is created, THE KitchenOS SHALL update structure.md
6. WHEN a feature is completed, THE KitchenOS SHALL update task.md and handoff.md
7. FOR ALL build sessions, the system SHALL update handoff.md with session summary before ending
