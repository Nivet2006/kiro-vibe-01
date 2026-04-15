# Migration from Vite to Next.js

**Date**: January 24, 2025  
**Status**: ✅ Complete  
**New Project Location**: `kitchenos-next/`  
**Old Project Backup**: `kitchenos/` (Vite version)

---

## What Changed

### Technology Stack

| Component | Before (Vite) | After (Next.js) |
|-----------|---------------|-----------------|
| **Framework** | Vite + React 19 | Next.js 16.2.3 (App Router) |
| **Routing** | React Router DOM | Next.js App Router (built-in) |
| **Build Tool** | Vite 8 | Next.js (Turbopack) |
| **Dev Server** | Vite Dev Server | Next.js Dev Server |
| **CSS** | Tailwind CSS v4 | Tailwind CSS v4 (same) |
| **Testing** | Vitest | Vitest (same) |
| **TypeScript** | TypeScript 6 | TypeScript 5 |

### Project Structure

```
kitchenos-next/
├── app/                    # Next.js App Router (NEW)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── lib/                    # Business logic (MIGRATED)
│   ├── stateMachine.ts
│   └── stateMachine.test.ts
├── types/                  # TypeScript types (MIGRATED)
│   ├── index.ts
│   └── index.test.ts
├── docs/                   # Documentation (MIGRATED)
│   ├── structure.md
│   ├── handoff.md
│   └── roadmap.md
├── test/                   # Test setup (NEW)
│   └── setup.ts
├── public/                 # Static assets
├── next.config.ts          # Next.js config (NEW)
├── tailwind.config.ts      # Tailwind config (MIGRATED)
├── vitest.config.ts        # Vitest config (NEW)
└── package.json
```

### Key Differences

#### 1. **No `src/` Directory**
- Next.js uses root-level directories by default
- `src/types` → `types/`
- `src/lib` → `lib/`
- `src/components` → `components/` (to be created)

#### 2. **App Router Instead of React Router**
- Next.js uses file-based routing in `app/` directory
- No need for `react-router-dom` configuration
- Pages are created as `app/[route]/page.tsx`

#### 3. **Server Components by Default**
- Components in `app/` are Server Components by default
- Use `'use client'` directive for client components
- State management (Zustand) requires client components

#### 4. **Build Output**
- Vite: `dist/` directory with static files
- Next.js: `.next/` directory with optimized bundles
- Both can be deployed to Vercel

---

## What Was Preserved

✅ **All Business Logic**
- State machine implementation
- Type definitions
- Test suites (all 24 tests passing)

✅ **All Documentation**
- structure.md, handoff.md, roadmap.md
- All content preserved

✅ **Design System**
- Tailwind CSS v4 configuration
- Cyber-industrial theme (black background, lime accents)
- Custom fonts (Inter, JetBrains Mono)

✅ **Dependencies**
- Supabase client
- Zustand state management
- @hello-pangea/dnd
- Recharts
- Lucide React
- date-fns

✅ **Testing Setup**
- Vitest configuration
- fast-check for property-based testing
- @testing-library/react
- All tests passing

---

## Benefits of Next.js

### 1. **Better Routing**
- File-based routing (no manual route configuration)
- Automatic code splitting per route
- Built-in layouts and nested routing

### 2. **Performance Optimizations**
- Automatic image optimization
- Font optimization
- Automatic static optimization
- Server-side rendering (when needed)

### 3. **Developer Experience**
- Fast Refresh (similar to Vite HMR)
- Built-in TypeScript support
- Better error messages
- Turbopack for faster builds

### 4. **Production Ready**
- Optimized for Vercel deployment
- Built-in API routes (if needed later)
- Middleware support
- Edge runtime support

### 5. **Future Scalability**
- Easy to add SSR/SSG when needed
- Built-in API routes for backend logic
- Incremental Static Regeneration (ISR)
- Server Actions for mutations

---

## Migration Steps Completed

1. ✅ Created new Next.js 16 project with TypeScript and Tailwind
2. ✅ Copied all business logic (`types/`, `lib/`)
3. ✅ Copied all documentation (`docs/`)
4. ✅ Installed all required dependencies
5. ✅ Configured Tailwind CSS with cyber-industrial design system
6. ✅ Set up Vitest for testing
7. ✅ Fixed date generator in property-based tests
8. ✅ Verified build works (`npm run build`)
9. ✅ Verified all tests pass (`npm run test`)
10. ✅ Committed to git

---

## Next Steps

### Immediate (Continue Implementation)

1. **Update Documentation**
   - Update `docs/structure.md` with Next.js structure
   - Update `docs/handoff.md` with Next.js instructions
   - Update `docs/roadmap.md` to reflect Next.js

2. **Continue Task Execution**
   - Resume from Task 4.3 (property test for invalid transitions)
   - Continue with remaining 31 tasks
   - All existing code works in Next.js

3. **Create Next.js Pages**
   - `app/command-center/page.tsx` - Command Center
   - `app/kitchen/page.tsx` - Kitchen Display System
   - `app/ai-hub/page.tsx` - AI Hub
   - `app/staff/page.tsx` - Staff Dispatch

4. **Update Components for Next.js**
   - Add `'use client'` to components using state/hooks
   - Keep Server Components where possible
   - Use Next.js Image component for images

### Future Enhancements

- **API Routes**: Add `app/api/` for backend endpoints (if needed)
- **Middleware**: Add authentication middleware
- **Server Actions**: Use for form submissions and mutations
- **Static Export**: Configure for static deployment (if needed)

---

## Commands

### Development
```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with UI
```

---

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy automatically

### Static Export (Alternative)
1. Add `output: 'export'` to `next.config.ts`
2. Run `npm run build`
3. Deploy `out/` directory to any static host

---

## Troubleshooting

### Issue: "Cannot find module '@vitejs/plugin-react'"
**Solution**: Already installed as dev dependency

### Issue: "Invalid time value" in tests
**Solution**: Already fixed - using `fc.integer().map()` instead of `fc.date()`

### Issue: Tailwind CSS not working
**Solution**: Using Tailwind v4 with `@tailwindcss/postcss`

---

## Rollback Plan

If you need to revert to Vite:
1. The original Vite project is in `kitchenos/` directory
2. All code is preserved and working
3. Simply switch back to that directory

---

**Migration completed successfully! ✅**

All tests passing, build working, ready to continue implementation.
