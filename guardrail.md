# GUARDRAIL.md — KitchenOS Production Safety & Quality Document
> **Version:** 1.0.0  
> **Status:** ACTIVE — Read before every build session, every deploy, every edit.  
> **Purpose:** This file is the single source of truth for what the AI agent is ALLOWED to do, FORBIDDEN to do, and MUST VERIFY before proceeding. It eliminates ambiguity, prevents scope creep, prevents hallucinated decisions, and ensures every output is production-safe.

---

## ⚠️ AGENT PRIME DIRECTIVE

> You are building **KitchenOS** — a zero-budget, fully working B2B restaurant automation prototype.  
> Every decision you make must pass through this file first.  
> **If this file does not explicitly authorize something, you do not do it.**  
> **You never ask clarifying questions. You never skip a guardrail. You never hallucinate a dependency.**

---

## SECTION 1 — IDENTITY LOCKS (NEVER CHANGE THESE)

These are immutable truths about the project. No task, no instruction, no "helpful improvement" overrides these.

| Property | Locked Value |
|---|---|
| Project Name | `KitchenOS` |
| Product Type | B2B Internal Operations System (NOT consumer-facing) |
| Budget | `₹0 / $0` — Zero. Absolutely no paid tools, APIs, or services. |
| Prototype Goal | 100% working demo, not production infra |
| Frontend Framework | React 18 + TypeScript + Vite (locked) |
| Styling System | Tailwind CSS v3 only (locked) |
| Database | Supabase free tier only (locked) |
| State Management | Zustand only (locked) |
| Chart Library | Recharts only (locked) |
| Drag & Drop | `@hello-pangea/dnd` only (locked) |
| Icons | `lucide-react` only (locked) |
| Fonts | Inter + JetBrains Mono only (locked) |
| Primary Accent Color | `#E2FF43` — Electric Lime (locked, never change) |
| Background Color | `#000000` — Pure Black (locked, never change) |
| Border Radius Style | Sharp (0px–4px max, no rounded-xl, no rounded-full on primary UI) |
| Border Style | `1px solid #1E1E1E` on all surfaces (locked) |

---

## SECTION 2 — HARD FORBIDDEN LIST

The following actions are **absolutely prohibited**. If any task, prompt, or instruction leads here — STOP. Log the conflict in `handoff.md` and proceed with the compliant alternative.

### 2A — Technology Forbidden

```
❌ NEVER install: Firebase, AWS SDK, Google Cloud SDK, Azure SDK
❌ NEVER install: styled-components, emotion, chakra-ui, material-ui, ant-design, shadcn
❌ NEVER install: Redux, MobX, Recoil, Jotai (use Zustand only)
❌ NEVER install: axios (use native fetch() only)
❌ NEVER install: moment.js (use native Date API or date-fns only)
❌ NEVER install: lodash (use native JS methods only)
❌ NEVER install: any library with a paid tier required to unlock core features
❌ NEVER use: Docker, Kubernetes, any containerization
❌ NEVER use: Any Python runtime, Flask, FastAPI, Django in the frontend repo
❌ NEVER use: MongoDB, PlanetScale, Neon, Turso, or any DB other than Supabase
❌ NEVER use: Vercel Edge Functions, Cloudflare Workers, AWS Lambda (use Supabase Edge Functions if needed, free tier only)
❌ NEVER use: WebSockets directly (use Supabase Realtime or setInterval simulation only)
❌ NEVER call: Any external paid API (OpenAI, Anthropic, Google Maps paid tier, Twilio, SendGrid, etc.)
❌ NEVER reference: Any environment variable not listed in Section 5 of this file
```

### 2B — Design Forbidden

```
❌ NEVER use: White or light backgrounds on any page (#000000 is the only valid page background)
❌ NEVER use: Rounded corners > 6px on cards or buttons
❌ NEVER use: Gradients as primary backgrounds (only as accents on specific components)
❌ NEVER use: Any font other than Inter and JetBrains Mono
❌ NEVER use: Font size below 11px for any visible text
❌ NEVER use: Color outside the defined palette (Section C of the main prompt) for new UI elements
❌ NEVER use: Animations with duration > 400ms (performance rule)
❌ NEVER use: Box shadows that are white or bright on dark surfaces
❌ NEVER use: Any image assets or illustrations in the app UI (icons via lucide-react only)
❌ NEVER implement: A light mode or theme toggle (dark mode is permanent)
```

### 2C — Architecture Forbidden

```
❌ NEVER put business logic inside JSX/TSX render blocks — extract to hooks or lib files
❌ NEVER call Supabase directly from a component — always go through hooks (useOrders, useInventory, etc.)
❌ NEVER use useEffect for data that should live in Zustand store
❌ NEVER create a new file without updating structure.md
❌ NEVER deploy without updating handoff.md
❌ NEVER commit .env.local to git (it is already in .gitignore — verify this on init)
❌ NEVER hardcode Supabase URL or anon key inline — always use import.meta.env.VITE_*
❌ NEVER use `any` TypeScript type — every value must be explicitly typed
❌ NEVER create circular imports between lib/, hooks/, and store/
❌ NEVER put mock data inline in components — always import from src/lib/mockData.ts
```

### 2D — Scope Forbidden

```
❌ NEVER build: A customer-facing menu/ordering page
❌ NEVER build: A payment processing flow
❌ NEVER build: An actual mobile app (this is web-only)
❌ NEVER build: Real IoT sensor integration
❌ NEVER build: A full auth system with roles (basic Supabase email auth only)
❌ NEVER build: A multi-tenant system (single-restaurant prototype only)
❌ NEVER build: An admin panel for managing restaurants (out of scope)
❌ NEVER add: AI features requiring a live ML model call
❌ NEVER add: Features not listed in the 4 core modules (Command Center, KDS, AI Hub, Staff Dispatch)
```

---

## SECTION 3 — MANDATORY RULES (ALWAYS DO THESE)

These are non-negotiable quality standards. Every file created, every component built, every function written must comply.

### 3A — TypeScript Rules

```typescript
// ✅ ALWAYS: Explicit return types on all functions
export function calculatePriorityScore(order: Order): number { ... }

// ✅ ALWAYS: Use interfaces from src/types/index.ts — never redefine inline
import { Order, InventoryItem } from '../types';

// ✅ ALWAYS: Type all useState hooks
const [orders, setOrders] = useState<Order[]>([]);

// ✅ ALWAYS: Type all event handlers
const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => { ... }

// ✅ ALWAYS: Use const assertions on static data
const STATUS_MAP = { pending: 'PENDING', cooking: 'IN PROGRESS' } as const;

// ✅ ALWAYS: Null-check before accessing optional properties
const startTime = order.startedAt ? new Date(order.startedAt) : null;

// ❌ NEVER: Use `any`
// ❌ NEVER: Use type assertions `as X` without a comment explaining why
// ❌ NEVER: Leave implicit `any` from untyped function parameters
```

### 3B — Component Architecture Rules

```
✅ EVERY page component must be in src/pages/
✅ EVERY reusable UI primitive must be in src/components/ui/
✅ EVERY feature-specific component must be in src/components/{feature}/
✅ EVERY component file must export a single default export
✅ EVERY component must have typed Props interface defined at the top of the file
✅ EVERY component over 100 lines must be split into sub-components
✅ EVERY list must use a stable key (never array index as key — use item.id)
```

### 3C — Hook Rules

```
✅ useOrders.ts    → ONLY place to call Supabase orders table
✅ useInventory.ts → ONLY place to call Supabase inventory table
✅ useRealtime.ts  → ONLY place to run setInterval simulation logic
✅ All hooks must clean up subscriptions and intervals in useEffect return function
✅ All async hooks must handle loading, error, and success states
✅ Hooks must NOT return JSX — only data, state, and functions
```

**Standard hook shape (copy this pattern for every hook):**
```typescript
interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'priorityScore'>) => Promise<void>;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ... implementation

  return { orders, loading, error, updateOrderStatus, addOrder };
}
```

### 3D — Pipeline Logic Rules

```
✅ Order status transitions MUST follow this exact sequence only:
   pending → cooking → quality_check → ready → dispatched
   
✅ NO order can skip a status stage (e.g., pending → ready is ILLEGAL)

✅ EVERY status transition MUST:
   1. Update Supabase orders table (or mock store if offline)
   2. Write a pipeline log entry to the logs table
   3. Trigger any downstream automation (inventory deduct, staff task, etc.)

✅ Inventory deduction MUST only happen when status changes to 'dispatched'
   (not 'ready' — confirms food left kitchen)

✅ Staff tasks MUST be auto-created on these exact events:
   - Order status → 'ready'     → create 'delivery' task
   - Order status → 'dispatched' → create 'cleaning' task for that table
   - Inventory item < reorderPoint → create 'restock' task (once per item, not repeatedly)

✅ Priority score recalculation MUST run every 30 seconds on all 'pending' orders
```

### 3E — Supabase Rules

```
✅ ALWAYS initialize Supabase client in src/lib/supabase.ts only (singleton pattern)
✅ ALWAYS use VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from .env.local
✅ ALWAYS enable Row Level Security on every table (SQL provided in main prompt)
✅ ALWAYS handle Supabase errors: const { data, error } = await supabase.from(...) — check error before using data
✅ ALWAYS add all 4 tables to supabase_realtime publication (SQL provided in main prompt)
✅ NEVER use the service_role key in the frontend — anon key only
✅ NEVER store sensitive data in pipeline_logs (no passwords, no personal data)
```

**Supabase client singleton (copy exactly):**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('[KitchenOS] Missing Supabase environment variables. Check .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3F — Error Handling Rules

```
✅ EVERY async function must be wrapped in try/catch
✅ EVERY caught error must write to the pipeline_logs table (level: 'ERROR')
✅ EVERY failed Supabase operation must fall back to mock data silently
✅ EVERY loading state must show a skeleton loader (not a spinner — see component spec below)
✅ EVERY error state must show an inline error badge (not a full-page error)
✅ Console.error() is permitted but must be prefixed: console.error('[KitchenOS][ModuleName]', error)
```

**Standard error boundary pattern for pages:**
```typescript
// Every page component must be wrapped with this in App.tsx
// Use React.Suspense + ErrorBoundary pattern
<ErrorBoundary fallback={<PageErrorFallback />}>
  <Suspense fallback={<PageSkeleton />}>
    <CommandCenter />
  </Suspense>
</ErrorBoundary>
```

### 3G — Performance Rules

```
✅ EVERY list of > 5 items must use React.memo on the item component
✅ EVERY callback passed as prop must be wrapped in useCallback
✅ EVERY expensive computation (priority sorting, demand forecast) must be in useMemo
✅ setInterval in useRealtime must be cleared on component unmount
✅ Supabase Realtime subscriptions must be unsubscribed on component unmount
✅ Images: None allowed in the UI (performance + scope rule)
✅ Bundle size: No library > 100KB gzipped without explicit justification in roadmap.md
```

---

## SECTION 4 — DOCUMENTATION PROTOCOL (ENFORCE AFTER EVERY TASK)

The following 5 files in `docs/` must be kept current. An outdated doc is a failed guardrail.

### Update Triggers:

| Event | Files to Update |
|---|---|
| New file created | `structure.md` |
| Feature completed | `task.md`, `handoff.md` |
| New dependency installed | `roadmap.md`, `handoff.md` |
| Bug fixed | `task.md`, `handoff.md` |
| Build session ends | `handoff.md` (mandatory) |
| Deploy executed | `handoff.md`, `task.md` |
| Schema changed | `roadmap.md`, `handoff.md` |

### `handoff.md` Required Format (every update must include ALL fields):

```markdown
# Handoff — [DATE] [TIME]

## Current State
- Last completed task: [exact task description]
- Working features: [bulleted list]
- Known issues: [bulleted list or "None"]
- Blockers: [bulleted list or "None"]

## What Was Just Done
[2-4 sentence description of exactly what changed]

## What To Do Next (Exact Next Step)
[Single, unambiguous next action for the agent picking this up]

## Environment Status
- Supabase: [Connected / Mock mode]
- Realtime: [Supabase Listeners / setInterval simulation]
- Build: [Passing / Failing — include error if failing]
- Deploy: [Vercel URL or "Not deployed yet"]

## Files Modified This Session
- [list of file paths]
```

---

## SECTION 5 — ENVIRONMENT VARIABLES (COMPLETE LIST — NO OTHERS)

```bash
# .env.local (NEVER commit this file)
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]

# That is ALL. Two variables. Nothing else.
# If a feature requires more env vars, it is OUT OF SCOPE.
```

`.gitignore` must contain these lines (verify on init):
```
.env.local
.env.*.local
node_modules/
dist/
.DS_Store
```

---

## SECTION 6 — PIPELINE STATE MACHINE (AUTHORITATIVE — NEVER DEVIATE)

This is the exact, complete, immutable state machine for the order pipeline. Any code that produces a different state flow is wrong and must be fixed.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORDER PIPELINE STATE MACHINE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [NEW ORDER SUBMITTED]                                           │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────┐    Calculate Priority Score                     │
│  │   PENDING   │ ── (prepTime × 0.6) + (waitTime × 0.4)  ──►   │
│  │  (Column 1) │    Sort KDS Column 1 descending                 │
│  └──────┬──────┘                                                  │
│         │  Kitchen staff clicks "START COOKING"                  │
│         │  → Log: "Order #X cooking started"                     │
│         ▼                                                         │
│  ┌─────────────┐    Countdown timer starts                       │
│  │   COOKING   │    Timer = sum of (item.prepTime × quantity)    │
│  │  (Column 2) │    Warning flash when < 20% time remaining      │
│  └──────┬──────┘                                                  │
│         │  Kitchen staff clicks "→ READY"                        │
│         │  → Auto-create: Staff 'delivery' task                  │
│         │  → Log: "Order #X ready for QC"                        │
│         ▼                                                         │
│  ┌──────────────────┐                                            │
│  │  QUALITY CHECK   │    Visual: green border                    │
│  │    (Column 3)    │    Action: "✓ DISPATCH" button             │
│  └────────┬─────────┘                                            │
│           │  Staff clicks "✓ DISPATCH"                           │
│           │  → Decrement inventory (ingredientDeductionMap)      │
│           │  → Auto-create: Staff 'cleaning' task for table      │
│           │  → Check all inventory < reorderPoint                │
│           │    → If yes: auto-create 'restock' task              │
│           │  → Log: "Order #X dispatched. Inventory updated."    │
│           ▼                                                        │
│  ┌─────────────┐                                                  │
│  │  DISPATCHED │    Order archived. Removed from KDS.            │
│  │   (Done)    │    Counted in Revenue metric.                    │
│  └─────────────┘                                                  │
│                                                                   │
│  MANUAL OVERRIDE MODE (when toggle = ON):                        │
│  ─ AI priority sorting disabled                                   │
│  ─ Drag-and-drop enabled between columns                         │
│  ─ Automated task generation paused                              │
│  ─ All manual moves are logged: "MANUAL: Order #X moved to X"   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## SECTION 7 — COMPONENT CHECKLIST (BEFORE MARKING ANY COMPONENT DONE)

Before marking any component as complete in `task.md`, it must pass ALL of these checks:

```
□ Has a typed Props interface at the top of the file
□ Has a default export
□ Uses only colors from the locked palette (Section C, main prompt)
□ Uses only Inter or JetBrains Mono font families
□ Uses only Tailwind utility classes (no inline style objects except for dynamic values)
□ Has no direct Supabase calls (uses hooks only)
□ Has no hardcoded strings that should be in mockData.ts
□ Has no console.log statements (only console.error with prefix allowed)
□ Has keyboard accessibility (buttons have accessible labels, interactive elements are focusable)
□ Does not break on empty state (shows a placeholder UI when data array is empty)
□ Does not break on loading state (shows skeleton or loading indicator)
□ Does not break on error state (shows inline error badge)
□ Uses React.memo if it renders in a list
□ Has been added to structure.md
□ Has been logged in task.md
```

---

## SECTION 8 — TAILWIND CONFIG (EXACT — COPY THIS)

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base':        '#000000',
        'bg-surface':     '#0A0A0A',
        'bg-elevated':    '#111111',
        'border-subtle':  '#1E1E1E',
        'border-active':  '#333333',
        'accent-lime':    '#E2FF43',
        'accent-white':   '#FFFFFF',
        'status-success': '#00FF41',
        'status-warning': '#FFBF00',
        'status-danger':  '#FF3131',
        'text-primary':   '#FFFFFF',
        'text-secondary': '#888888',
        'text-muted':     '#444444',
        'text-mono':      '#E2FF43',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '900' }],
        'h1':      ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h2':      ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3':      ['18px', { lineHeight: '1.4', letterSpacing: '0em',     fontWeight: '600' }],
        'body':    ['14px', { lineHeight: '1.6', letterSpacing: '0.01em',  fontWeight: '400' }],
        'label':   ['12px', { lineHeight: '1.4', letterSpacing: '0.04em',  fontWeight: '500' }],
        'mono-sm': ['12px', { lineHeight: '1.5', letterSpacing: '0em',     fontWeight: '400' }],
        'mono-md': ['14px', { lineHeight: '1.5', letterSpacing: '0em',     fontWeight: '500' }],
      },
      spacing: {
        '1': '4px',  '2': '8px',  '3': '12px', '4': '16px',
        '6': '24px', '8': '32px', '12': '48px', '16': '64px',
      },
      borderRadius: {
        'none': '0px', 'sm': '2px', 'DEFAULT': '4px', 'md': '6px',
      },
      animation: {
        'pulse-red':  'pulse-red 2s ease-in-out infinite',
        'blink-live': 'blink-live 1.5s ease-in-out infinite',
        'log-entry':  'log-entry 0.2s ease-out forwards',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 49, 49, 0.4)' },
          '50%':      { boxShadow: '0 0 8px 2px rgba(255, 49, 49, 0.15)' },
        },
        'blink-live': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
        'log-entry': {
          'from': { opacity: '0', transform: 'translateY(-8px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## SECTION 9 — ROUTING MAP (AUTHORITATIVE)

```typescript
// App.tsx — exact route structure
// Route: '/'                → redirect to '/command-center'
// Route: '/command-center'  → <CommandCenter />
// Route: '/kitchen'         → <KitchenDisplay />
// Route: '/ai-hub'          → <AIHub />
// Route: '/staff'           → <StaffDispatch />
// Route: '*'                → redirect to '/command-center'

// All routes are wrapped in <AppShell> which renders <Sidebar> + <TopBar> + <Outlet>
// No route requires auth for the prototype (open access for hackathon demo)
```

---

## SECTION 10 — SUPABASE FALLBACK PROTOCOL

When Supabase is unavailable (no internet, free tier down, env vars missing), the app must NOT crash. It must silently fall back to mock data.

```typescript
// Pattern to use in every hook:
async function fetchOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) throw error;
    return data as Order[];
  } catch (err) {
    console.error('[KitchenOS][useOrders] Supabase unavailable. Using mock data.', err);
    return mockOrders; // Always import from mockData.ts
  }
}
```

**Offline Mode Indicator:** When running on mock data, display a `⚡ OFFLINE MODE` badge in amber (`#FFBF00`) in the TopBar next to the system status.

---

## SECTION 11 — DEPLOY CHECKLIST

Run through this checklist in order before every `vercel --prod` deployment:

```
□ All TypeScript errors resolved: run `npx tsc --noEmit`
□ No console.log statements in any file: run `grep -r "console.log" src/`
□ .env.local is NOT in git: run `git status` and verify
□ All 5 docs files updated (planning.md, roadmap.md, structure.md, task.md, handoff.md)
□ All 4 pages render without runtime errors (manual smoke test each page)
□ Pipeline flow works end-to-end: create order → move to cooking → dispatch → inventory decremented
□ Manual Override toggle disables AI sorting + enables drag-and-drop
□ PipelineLog auto-scrolls and shows new entries
□ DemandPulseChart renders with both projected and actual lines
□ Inventory progress bars show correct colors (lime/amber/red based on thresholds)
□ All status badges render correctly
□ App loads in < 3 seconds on a standard connection
□ No broken imports (run `npm run build` — must complete with 0 errors)
□ Vercel environment variables set: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
□ Fallback to mock data works when Supabase env vars are removed (test locally)
```

---

## SECTION 12 — AGENT SELF-CHECK PROTOCOL

Before writing ANY code, the agent must answer these 5 questions internally:

```
1. Is this task listed in planning.md or explicitly authorized by this GUARDRAIL.md?
   → NO: Stop. Log in handoff.md. Do not build.
   → YES: Continue.

2. Does this task require any forbidden technology (Section 2A)?
   → YES: Stop. Find the compliant alternative. Log decision in handoff.md.
   → NO: Continue.

3. Does this component/function already exist in the codebase?
   → YES: Modify the existing one. Do not duplicate.
   → NO: Continue.

4. After completing this task, which doc files need to be updated?
   → Answer this before starting. Update them after completing.

5. Does this change break the pipeline state machine (Section 6)?
   → YES: Redesign the approach.
   → NO: Proceed.
```

---

## SECTION 13 — KNOWN ACCEPTABLE LIMITATIONS (HACKATHON SCOPE)

These are known limitations that are **intentional and accepted**. Do not attempt to fix them — they are out of scope.

```
✅ ACCEPTED: AI demand forecasting uses static JSON, not a live ML model
✅ ACCEPTED: Inventory deduction uses a hardcoded ingredient map, not a recipe DB
✅ ACCEPTED: No real payment processing (revenue metric is simulated)
✅ ACCEPTED: No multi-user role system (all users see all pages)
✅ ACCEPTED: No mobile responsiveness required (desktop-first only)
✅ ACCEPTED: No real IoT/sensor integration
✅ ACCEPTED: Staff assignment is round-robin from a static staff list, not a real scheduling system
✅ ACCEPTED: POS integration is simulated (no real POS API)
✅ ACCEPTED: Single restaurant only (no multi-tenant architecture)
```

**Pitch framing for these limitations:**
> *"KitchenOS is a software-first autonomous pipeline system. Currently runs as a simulation prototype expandable to real hardware, IoT sensors, and ML models in production. The architecture is designed for it — the connectors just need to be plugged in."*

---

## SECTION 14 — VERSION HISTORY

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0.0 | Initial | KitchenOS Agent | Document created. All guardrails defined. |

> **Rule:** Every time this file is referenced during a build session, add a row to this table with the date, which section was consulted, and what decision was made based on it.

---

*End of GUARDRAIL.md — This document governs all decisions in the KitchenOS build. No exceptions.*