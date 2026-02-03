# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BoxandBuy Storefront - A Next.js 16 headless e-commerce frontend connecting to a PrestaShop backend via XML REST API.

**Status:** Early development - core infrastructure complete, awaiting PrestaShop API credentials.

## Build Commands

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint (note: script is incomplete, may need "npm run lint .")
```

## Tech Stack

- Next.js 16.1.6 with App Router and React Server Components
- React 19.2.3
- TypeScript 5 (strict mode)
- Tailwind CSS 4
- axios for HTTP requests
- xml2js for parsing PrestaShop XML responses

## Architecture

### Data Flow
```
PrestaShop XML API → lib/prestashop.ts → Server Components → Rendered HTML
```

All data fetching happens server-side. No client-side data fetching or React state for product data.

### Key Files

- `lib/prestashop.ts` - API client for PrestaShop integration. Handles XML→JSON conversion.
- `app/page.tsx` - Home page with product grid (async server component)
- `app/products/[id]/page.tsx` - Product detail page with ISR (5-minute revalidation)
- `app/layout.tsx` - Root layout with Geist font
- `app/globals.css` - Tailwind imports and CSS variables (supports dark mode)

### Patterns Used

1. **Server Components** - All pages are async server components
2. **ISR (Incremental Static Regeneration)** - Product pages use `revalidate = 300`
3. **Static Generation** - `generateStaticParams()` pre-builds first 10 product pages
4. **Path Aliases** - `@/*` maps to project root

## Environment Variables

Required in `.env.local`:
```
PRESTASHOP_URL=https://boxandbuy.com
PRESTASHOP_API_KEY=your_api_key_here
```

## Known Issues

1. `getProduct(id)` function is called in product detail page but not implemented in `lib/prestashop.ts`
2. `getCategories()` referenced in documentation but not implemented
3. "View Details" and "Add to Cart" buttons are non-functional placeholders

## Documentation

Extensive documentation available:
- `GETTING_STARTED.md` - Quick 5-minute onboarding
- `SETUP_GUIDE.md` - Detailed setup instructions
- `QUICK_REFERENCE.md` - Developer cheat sheet
- `PROJECT_SUMMARY.md` - Architecture overview
- `CHECKLIST.md` - Task tracking
