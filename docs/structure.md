# KitchenOS Project Structure

This document provides a comprehensive overview of all source files in the KitchenOS project and their purposes.

**Last Updated**: 2025-01-24  
**Project Status**: Task 1 Complete (Project Initialization), Task 2 In Progress (Documentation Structure)

---

## Root Configuration Files

### Build & Development Tools
- **`vite.config.ts`** - Vite build configuration with code splitting, optimization settings, and React plugin
- **`vitest.config.ts`** - Vitest test runner configuration for unit and property-based tests
- **`package.json`** - Project dependencies and npm scripts
- **`package-lock.json`** - Locked dependency versions for reproducible builds

### TypeScript Configuration
- **`tsconfig.json`** - Root TypeScript configuration
- **`tsconfig.app.json`** - TypeScript configuration for application code
- **`tsconfig.node.json`** - TypeScript configuration for Node.js tooling (Vite config, etc.)

### Styling & Linting
- **`tailwind.config.ts`** - Tailwind CSS configuration with custom design tokens (cyber-industrial theme)
- **`postcss.config.js`** - PostCSS configuration for Tailwind CSS processing
- **`eslint.config.js`** - ESLint configuration for code quality and React best practices

### Environment & Git
- **`.env.local`** - Local environment variables (Supabase URL and anon key) - **NOT COMMITTED TO GIT**
- **`.gitignore`** - Git ignore rules (excludes node_modules, dist, .env.local)

### HTML Entry Point
- **`index.html`** - HTML entry point for Vite, loads the React application

### Documentation
- **`README.md`** - Project overview and setup instructions
- **`docs/structure.md`** - This file - comprehensive source file documentation
- **`docs/handoff.md`** - Current project state and next steps for developers
- **`docs/roadmap.md`** - Feature roadmap and technical decisions

---

## Source Code (`src/`)

### Application Entry Points
- **`src/main.tsx`** - React application entry point, renders root component
- **`src/App.tsx`** - Root application component (currently Vite default, will be replaced with router)
- **`src/App.css`** - Application-level styles (currently Vite default)
- **`src/index.css`** - Global styles and Tailwind CSS imports

### Test Configuration
- **`src/test/setup.ts`** - Vitest test setup and global test configuration

### Assets (`src/assets/`)
- **`src/assets/react.svg`** - React logo (Vite default)
- **`src/assets/vite.svg`** - Vite logo (Vite default)
- **`src/assets/hero.png`** - Hero image (Vite default)

---

## Public Assets (`public/`)

- **`public/favicon.svg`** - Browser favicon
- **`public/icons.svg`** - SVG sprite sheet for application icons

---

## Future Source Structure

The following directories and files will be created as implementation progresses:

### Type Definitions (`src/types/`)
- `src/types/index.ts` - Core TypeScript interfaces (Order, InventoryItem, StaffTask, PipelineLog, etc.)

### Business Logic (`src/lib/`)
- `src/lib/stateMachine.ts` - Order pipeline state machine and transition validation
- `src/lib/calculations.ts` - Priority score, metrics, and timer calculations
- `src/lib/automation.ts` - Automation engine for side effects (task creation, inventory deduction)
- `src/lib/ingredientMap.ts` - Hardcoded ingredient-to-inventory deduction mapping
- `src/lib/supabase.ts` - Supabase client wrapper with typed query helpers
- `src/lib/mockData.ts` - Mock data for offline mode and testing

### State Management (`src/store/`)
- `src/store/index.ts` - Zustand global store (manual override mode, offline mode, navigation)

### Custom Hooks (`src/hooks/`)
- `src/hooks/useOrders.ts` - Order CRUD operations and state management
- `src/hooks/useInventory.ts` - Inventory management and stock level updates
- `src/hooks/useStaffTasks.ts` - Task management and round-robin assignment
- `src/hooks/usePipelineLogs.ts` - Log creation and retrieval
- `src/hooks/useMetrics.ts` - Derived metrics calculation (revenue, wait time, etc.)
- `src/hooks/useRealtime.ts` - Supabase Realtime subscriptions with polling fallback

### UI Primitives (`src/components/ui/`)
- `src/components/ui/Button.tsx` - Reusable button component with variants
- `src/components/ui/Card.tsx` - Card surface component
- `src/components/ui/Badge.tsx` - Badge component with color variants
- `src/components/ui/ProgressBar.tsx` - Progress bar with color coding
- `src/components/ui/SkeletonLoader.tsx` - Loading state skeleton
- `src/components/ui/ErrorBadge.tsx` - Inline error display

### Layout Components (`src/components/layout/`)
- `src/components/layout/Sidebar.tsx` - Navigation sidebar
- `src/components/layout/TopBar.tsx` - System status and user controls
- `src/components/layout/AppShell.tsx` - Main layout wrapper

### Command Center Module (`src/components/command-center/`)
- `src/components/command-center/MetricCard.tsx` - Individual metric display
- `src/components/command-center/MetricsGrid.tsx` - Grid of metric cards
- `src/components/command-center/LogEntry.tsx` - Single log entry display
- `src/components/command-center/PipelineLogFeed.tsx` - Scrollable log feed
- `src/components/command-center/ManualOverrideToggle.tsx` - Manual override control

### Kitchen Display System Module (`src/components/kds/`)
- `src/components/kds/OrderCard.tsx` - Draggable order card
- `src/components/kds/ColumnContainer.tsx` - Kanban column
- `src/components/kds/KanbanBoard.tsx` - Drag-and-drop kanban board

### AI Hub Module (`src/components/ai-hub/`)
- `src/components/ai-hub/InventoryProgressBar.tsx` - Stock level progress bar
- `src/components/ai-hub/InventoryItem.tsx` - Individual inventory item display
- `src/components/ai-hub/InventoryList.tsx` - List of inventory items
- `src/components/ai-hub/StockAlerts.tsx` - At-risk items alert list
- `src/components/ai-hub/DemandChart.tsx` - Demand forecasting chart

### Staff Dispatch Module (`src/components/staff-dispatch/`)
- `src/components/staff-dispatch/TaskStatusBadge.tsx` - Task status indicator
- `src/components/staff-dispatch/TaskCard.tsx` - Individual task card
- `src/components/staff-dispatch/TaskFilters.tsx` - Task filtering controls
- `src/components/staff-dispatch/TaskList.tsx` - List of tasks

### Pages (`src/pages/`)
- `src/pages/CommandCenter.tsx` - Command Center page
- `src/pages/KitchenDisplay.tsx` - Kitchen Display System page
- `src/pages/AIHub.tsx` - AI Hub page
- `src/pages/StaffDispatch.tsx` - Staff Dispatch page

### Tests (`tests/`)
- `tests/properties/` - Property-based tests using fast-check
  - `stateMachine.property.test.ts`
  - `calculations.property.test.ts`
  - `automation.property.test.ts`
  - `sorting.property.test.ts`
  - `formatting.property.test.ts`
- `tests/unit/` - Unit tests for components, hooks, and utilities
- `tests/integration/` - Integration tests for Supabase and end-to-end flows

---

## Build Output (`dist/`)

Generated by `npm run build`, contains production-ready static assets:
- `dist/index.html` - Production HTML entry point
- `dist/assets/` - Bundled and minified JavaScript, CSS, and assets
- `dist/favicon.svg` - Favicon
- `dist/icons.svg` - Icon sprite sheet

---

## Dependencies

### Core Dependencies
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### Backend & State
- **@supabase/supabase-js** - Supabase client for database and auth
- **zustand** - Lightweight state management

### UI Libraries
- **@hello-pangea/dnd** - Accessible drag-and-drop for kanban board
- **recharts** - Charting library for demand forecasting
- **lucide-react** - Icon library
- **date-fns** - Date manipulation utilities

### Testing
- **vitest** - Fast unit test runner
- **@testing-library/react** - React component testing utilities
- **fast-check** - Property-based testing library

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Autoprefixer** - CSS vendor prefix automation

---

## Notes

- All source files follow TypeScript strict mode
- Components use functional components with hooks (no class components)
- Styling uses Tailwind CSS utility classes (no CSS modules or styled-components)
- All async operations include error handling with fallback to mock data
- Real-time updates use Supabase Realtime with polling fallback
