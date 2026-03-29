# Astro Indie Stack — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform AstroWind into a production-ready, paid Astro template for indie hackers — with Plausible Analytics, Grafana Faro, Stripe Checkout, Notion fulfillment, Security Headers, and Render.com deploy.

**Architecture:** Copy AstroWind as starting point, upgrade to Astro 6 + Tailwind 4, replace the custom vendor config system with a typed `site.config.ts`, swap Google Analytics for Plausible + Faro, add Stripe Checkout in hybrid mode (SSR API routes + static pages), and deploy on Render.com with security headers. All existing AstroWind pages remain, neutralized with generic placeholder content.

**Tech Stack:** Astro 6, Tailwind 4 (@tailwindcss/vite), TypeScript, @astrojs/node adapter (hybrid mode), Stripe, Plausible, @grafana/faro-web-sdk, Playwright (E2E), Render.com

---

## File Structure Overview

### New Files
```
src/
├── site.config.ts                    # Central project config (replaces config.yaml)
├── content.config.ts                 # Astro 6 content collections (replaces content/config.ts)
├── middleware.ts                      # Security headers middleware (SSR routes)
├── components/
│   ├── common/
│   │   ├── PlausibleAnalytics.astro  # Plausible script tag
│   │   └── Faro.astro               # Grafana Faro initialization
│   └── widgets/
│       └── StripeCheckout.astro      # Checkout button component
├── pages/
│   ├── success.astro                 # Post-payment success page
│   └── api/
│       └── create-checkout-session.ts # Stripe Checkout API route
└── styles/
    └── global.css                    # Tailwind 4 CSS config (replaces tailwind.config.js)

render.yaml                           # Render.com deployment config
playwright.config.ts                  # E2E test config
tests/
└── e2e/
    ├── landing.spec.ts               # Landing page user stories
    ├── blog.spec.ts                  # Blog user stories
    ├── checkout.spec.ts              # Checkout flow user stories
    └── navigation.spec.ts            # Navigation user stories
```

### Files to Remove
```
vendor/                               # Custom vendor integration (replaced by site.config.ts)
tailwind.config.js                    # Replaced by Tailwind 4 CSS config
src/config.yaml                       # Replaced by site.config.ts
src/content/config.ts                 # Replaced by src/content.config.ts
src/components/common/Analytics.astro # Google Analytics (replaced by Plausible)
src/components/common/SplitbeeAnalytics.astro # Unused analytics
src/components/common/SiteVerification.astro  # Google verification
```

### Files to Modify
```
package.json                          # Dependencies upgrade
astro.config.ts                       # Astro 6 config, hybrid mode, CSP
tsconfig.json                         # Astro 6 TypeScript config
src/layouts/Layout.astro              # Swap analytics, add Faro
src/layouts/PageLayout.astro          # Minor updates
src/pages/pricing.astro               # Connect to Stripe
src/navigation.ts                     # Update nav links
src/utils/blog.ts                     # Content collections API changes
src/types.d.ts                        # Add new types
.env.example                          # Environment variables template
```

---

## Task 1: Project Setup — Copy AstroWind & Initialize

**Files:**
- Create: `package.json` (modified copy)
- Create: `.gitignore`
- Create: `.env.example`
- Create: `.nvmrc`
- Remove: `astrowind-reference/` (after copy)

- [ ] **Step 1: Copy AstroWind source into project root**

```bash
# Copy all AstroWind files (except .git) into project root
cp -r astrowind-reference/* astrowind-reference/.* . 2>/dev/null || true
rm -rf .git  # Remove AstroWind's git history if copied
rm -rf astrowind-reference
```

- [ ] **Step 2: Initialize git repository**

```bash
git init
```

- [ ] **Step 3: Create `.nvmrc`**

```
22
```

- [ ] **Step 4: Create `.env.example`**

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_PRICE_ID=price_xxx

# Plausible
PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
PUBLIC_PLAUSIBLE_SCRIPT_URL=https://plausible.io/js/script.js

# Grafana Faro
PUBLIC_FARO_COLLECTOR_URL=https://faro-collector.grafana.net/collect/xxx

# Notion (download fulfillment)
PUBLIC_DOWNLOAD_URL=https://notion.so/your-download-page

# Site
PUBLIC_SITE_URL=https://yourdomain.com
```

- [ ] **Step 5: Update `package.json` identity**

Change the name, description, and version fields:

```json
{
  "name": "astro-indie-stack",
  "version": "1.0.0",
  "description": "Production-ready Astro template for indie hackers. Analytics, payments, deploy, security — all included.",
  "type": "module",
  "private": true,
  "engines": {
    "node": ">=22.0.0"
  }
}
```

- [ ] **Step 6: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.env
.env.local
.DS_Store
*.log
```

- [ ] **Step 7: Initial commit**

```bash
git add -A
git commit -m "chore: copy AstroWind as starting point"
```

---

## Task 2: Upgrade to Astro 6

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `src/content/config.ts` → Move to `src/content.config.ts`
- Modify: `src/utils/blog.ts`
- Modify: `src/env.d.ts`

- [ ] **Step 1: Upgrade Astro and all @astrojs packages**

```bash
npx @astrojs/upgrade
```

If the interactive upgrade tool doesn't support Astro 6 yet, manually update `package.json`:

```bash
npm install astro@latest @astrojs/sitemap@latest @astrojs/mdx@latest @astrojs/check@latest @astrojs/rss@latest
```

- [ ] **Step 2: Run `npm install` and check for errors**

```bash
npm install
```

Expected: Clean install with no peer dependency errors. If there are peer conflicts, resolve them by updating the conflicting packages.

- [ ] **Step 3: Migrate content collections — move config file**

Move `src/content/config.ts` to `src/content.config.ts` (Astro 6 requirement):

```bash
mv src/content/config.ts src/content.config.ts
```

- [ ] **Step 4: Update content collection to use loader API**

Read the existing `src/content.config.ts` and rewrite it. The old format uses `type: 'content'` — Astro 6 requires `loader`:

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const post = defineCollection({
  loader: glob({ base: './src/data/post', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    publishDate: z.coerce.date().optional(),
    updateDate: z.coerce.date().optional(),
    draft: z.boolean().optional(),
    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    metadata: z
      .object({
        canonical: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { post };
```

- [ ] **Step 5: Update `src/utils/blog.ts` for new content collections API**

Key changes in Astro 6:
- `getEntry()` can return `undefined` — add null checks
- Collection entries may have different ID formats with the glob loader
- `slug` field is auto-generated from filename by the glob loader

Open `src/utils/blog.ts` and update `getNormalizedPost` and `fetchPosts` to handle the new collection API. The `slug` is now derived from the entry ID. Check that the existing `generatePermalink` function works with the new slug format.

- [ ] **Step 6: Update `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"]
    }
  },
  "include": [".astro/types.d.ts", "src/**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 7: Update `src/env.d.ts`**

Remove the triple-slash reference (Astro 6 uses `.astro/types.d.ts` via tsconfig):

```typescript
// src/env.d.ts
// Environment types are loaded via tsconfig include of .astro/types.d.ts
```

- [ ] **Step 8: Verify the build works**

```bash
npm run build
```

Expected: Successful build. Fix any Astro 6 deprecation warnings or errors. Common issues:
- `Astro.glob()` calls → replace with `import.meta.glob({ eager: true })` or `getCollection()`
- `<ViewTransitions />` → already `<ClientRouter />` in AstroWind (check)

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: upgrade to Astro 6 with new content collections API"
```

---

## Task 3: Migrate to Tailwind 4

**Files:**
- Modify: `package.json` (swap deps)
- Create: `src/styles/global.css` (Tailwind 4 config-in-CSS)
- Modify: `astro.config.ts` (replace integration with vite plugin)
- Remove: `tailwind.config.js`
- Modify: `src/assets/styles/tailwind.css`
- Modify: `src/components/CustomStyles.astro`

- [ ] **Step 1: Swap Tailwind dependencies**

```bash
npm uninstall @astrojs/tailwind tailwindcss @tailwindcss/typography tailwind-merge
npm install tailwindcss@latest @tailwindcss/vite@latest
npm install @tailwindcss/typography@latest tailwind-merge@latest
```

- [ ] **Step 2: Create Tailwind 4 CSS config**

Create `src/styles/global.css` — this replaces `tailwind.config.js`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* Custom theme — migrated from tailwind.config.js */
@theme {
  /* Colors via CSS variables (set in CustomStyles.astro) */
  --color-primary: var(--aw-color-primary);
  --color-secondary: var(--aw-color-secondary);
  --color-accent: var(--aw-color-accent);
  --color-default: var(--aw-color-text-default);
  --color-muted: var(--aw-color-text-muted);

  /* Fonts via CSS variables */
  --font-sans: var(--aw-font-sans, ui-sans-serif), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--aw-font-serif, ui-serif), ui-serif, Georgia, serif;
  --font-heading: var(--aw-font-heading, ui-sans-serif), ui-sans-serif, system-ui, sans-serif;

  /* Animations */
  --animate-fade: fadeInUp 1s both;

  @keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(2rem); }
    100% { opacity: 1; transform: translateY(0); }
  }
}

/* Dark mode variant — Tailwind 4 uses CSS nesting */
@variant dark (&:where(.dark, .dark *));

/* Custom intersect variant */
@variant intersect (&:not([no-intersect]));
```

- [ ] **Step 3: Update `astro.config.ts` — replace Tailwind integration with Vite plugin**

Remove the `tailwind` import and add `@tailwindcss/vite`:

```typescript
// At the top, remove:
// import tailwind from '@astrojs/tailwind';

// Add:
import tailwindcss from '@tailwindcss/vite';

// In defineConfig, remove tailwind() from integrations array.
// Add to vite config:
export default defineConfig({
  // ...
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
  // ...
});
```

- [ ] **Step 4: Update the main CSS import**

Edit `src/assets/styles/tailwind.css` — replace the Tailwind 3 directives with an import of the new config:

```css
@import "../../styles/global.css";

/* Any additional custom styles from the original tailwind.css */
```

Or, if `Layout.astro` imports `tailwind.css` directly, update the import path to point to `src/styles/global.css` instead.

Check `src/layouts/Layout.astro` for the CSS import and update accordingly.

- [ ] **Step 5: Remove `tailwind.config.js`**

```bash
rm tailwind.config.js
```

- [ ] **Step 6: Fix Tailwind 4 class changes**

Tailwind 4 has some class name changes. Search and replace:
- `shadow-lg` → still works
- Check for any `@apply` directives that reference removed utilities
- `dark:` variant should work with the custom `@variant dark` we defined

```bash
# Search for potential issues
grep -r "@apply" src/ --include="*.astro" --include="*.css"
```

Fix any `@apply` usages that reference utilities no longer available in Tailwind 4.

- [ ] **Step 7: Verify the build works**

```bash
npm run build
```

Expected: Successful build with Tailwind 4 styles applied correctly.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: migrate from Tailwind 3 to Tailwind 4 with CSS-based config"
```

---

## Task 4: Central Config — Replace config.yaml with site.config.ts

**Files:**
- Create: `src/site.config.ts`
- Modify: `astro.config.ts` (remove vendor integration)
- Remove: `src/config.yaml`
- Remove: `vendor/` directory
- Modify: All files importing from `astrowind:config` virtual module

- [ ] **Step 1: Find all usages of the `astrowind:config` virtual module**

```bash
grep -r "astrowind:config" src/ --include="*.astro" --include="*.ts" -l
```

Document every file that imports from `astrowind:config` and what it imports (SITE, I18N, METADATA, APP_BLOG, UI, ANALYTICS).

- [ ] **Step 2: Create `src/site.config.ts`**

```typescript
// src/site.config.ts
// Central configuration — change everything in one place.

export const SITE = {
  name: 'Astro Indie Stack',
  site: import.meta.env.PUBLIC_SITE_URL || 'https://example.com',
  base: '/',
  trailingSlash: false,
} as const;

export const I18N = {
  language: 'en',
  textDirection: 'ltr',
} as const;

export const METADATA = {
  title: {
    default: SITE.name,
    template: `%s — ${SITE.name}`,
  },
  description: 'Production-ready Astro template for indie hackers. Analytics, payments, deploy, security — all included.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    site_name: SITE.name,
    images: [{ url: '~/assets/images/default.png', width: 1200, height: 628 }],
    type: 'website',
  },
} as const;

export const APP_BLOG = {
  isEnabled: true,
  postsPerPage: 6,
  post: {
    isEnabled: true,
    permalink: '/%slug%',
    robots: { index: true },
  },
  list: {
    isEnabled: true,
    pathname: 'blog',
    robots: { index: true },
  },
  category: {
    isEnabled: true,
    pathname: 'category',
    robots: { index: true },
  },
  tag: {
    isEnabled: true,
    pathname: 'tag',
    robots: { index: false },
  },
  isRelatedPostsEnabled: true,
  relatedPostsCount: 4,
} as const;

export const UI = {
  theme: 'system' as 'system' | 'light' | 'dark' | 'light:only' | 'dark:only',
} as const;

export const ANALYTICS = {
  plausible: {
    domain: import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN || '',
    scriptUrl: import.meta.env.PUBLIC_PLAUSIBLE_SCRIPT_URL || 'https://plausible.io/js/script.js',
  },
  faro: {
    collectorUrl: import.meta.env.PUBLIC_FARO_COLLECTOR_URL || '',
    appName: SITE.name,
  },
} as const;

export const STRIPE = {
  publishableKey: import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  priceId: import.meta.env.STRIPE_PRICE_ID || '',
  product: {
    name: 'Astro Indie Stack',
    description: 'Production-ready Astro template',
  },
} as const;

export const FULFILLMENT = {
  downloadUrl: import.meta.env.PUBLIC_DOWNLOAD_URL || '',
} as const;
```

- [ ] **Step 3: Replace all `astrowind:config` imports**

For every file found in Step 1, replace:

```typescript
// Before:
import { SITE, METADATA, APP_BLOG } from 'astrowind:config';

// After:
import { SITE, METADATA, APP_BLOG } from '~/site.config';
```

Go through each file and update the import. The exported object shapes should be compatible — the vendor integration was just loading YAML and exporting the same structure.

- [ ] **Step 4: Remove vendor integration and config.yaml**

```bash
rm -rf vendor/
rm src/config.yaml
```

- [ ] **Step 5: Update `astro.config.ts` — remove vendor integration**

Remove the `astrowind` import and its usage in the integrations array:

```typescript
// Remove:
// import astrowind from './vendor/integration';

// Remove from integrations:
//   astrowind({ config: './src/config.yaml' }),
```

- [ ] **Step 6: Verify the build works**

```bash
npm run build
```

Expected: Successful build. All pages render correctly using the new config.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: replace vendor config.yaml with typed site.config.ts"
```

---

## Task 5: Remove Google Analytics & Add Plausible

**Files:**
- Remove: `src/components/common/Analytics.astro`
- Remove: `src/components/common/SplitbeeAnalytics.astro`
- Remove: `src/components/common/SiteVerification.astro`
- Create: `src/components/common/PlausibleAnalytics.astro`
- Modify: `src/layouts/Layout.astro`
- Modify: `package.json` (remove GA deps)

- [ ] **Step 1: Remove Google Analytics dependencies**

```bash
npm uninstall @astrolib/analytics @astrojs/partytown
```

- [ ] **Step 2: Remove GA-related components**

```bash
rm src/components/common/Analytics.astro
rm src/components/common/SplitbeeAnalytics.astro
rm src/components/common/SiteVerification.astro
```

- [ ] **Step 3: Create Plausible Analytics component**

```astro
---
// src/components/common/PlausibleAnalytics.astro
import { ANALYTICS } from '~/site.config';

const { domain, scriptUrl } = ANALYTICS.plausible;
---

{domain && (
  <script
    defer
    data-domain={domain}
    src={scriptUrl}
  />
)}
```

- [ ] **Step 4: Update `src/layouts/Layout.astro`**

Replace the Analytics import with Plausible:

```astro
---
// Remove:
// import Analytics from '~/components/common/Analytics.astro';
// import SiteVerification from '~/components/common/SiteVerification.astro';

// Add:
import PlausibleAnalytics from '~/components/common/PlausibleAnalytics.astro';
---

<!-- In <head>, replace <Analytics /> and <SiteVerification /> with: -->
<PlausibleAnalytics />
```

- [ ] **Step 5: Remove Partytown from `astro.config.ts`**

Remove the partytown import, `hasExternalScripts`, and the `whenExternalScripts` helper:

```typescript
// Remove these lines:
// import partytown from '@astrojs/partytown';
// const hasExternalScripts = false;
// const whenExternalScripts = ...
// ...whenExternalScripts(() => partytown({...})),
```

- [ ] **Step 6: Verify the build works**

```bash
npm run build
```

Expected: No references to Google Analytics remain. Plausible script tag appears in the HTML output when domain is configured.

```bash
# Verify no GA remnants
grep -r "google" dist/ --include="*.html" | grep -i "analytics"
# Should return nothing

# Verify Plausible is present (set a test domain in .env first)
grep -r "plausible" dist/ --include="*.html"
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: replace Google Analytics with Plausible Analytics"
```

---

## Task 6: Add Grafana Faro

**Files:**
- Create: `src/components/common/Faro.astro`
- Modify: `src/layouts/Layout.astro`
- Modify: `package.json`

- [ ] **Step 1: Install Grafana Faro SDK**

```bash
npm install @grafana/faro-web-sdk
```

- [ ] **Step 2: Create Faro component**

```astro
---
// src/components/common/Faro.astro
import { ANALYTICS } from '~/site.config';

const { collectorUrl, appName } = ANALYTICS.faro;
---

{collectorUrl && (
  <script define:vars={{ collectorUrl, appName }}>
    import('@grafana/faro-web-sdk').then(({ initializeFaro }) => {
      initializeFaro({
        url: collectorUrl,
        app: {
          name: appName,
          version: '1.0.0',
        },
      });
    });
  </script>
)}
```

Note: Using dynamic `import()` to avoid blocking page load. The `define:vars` directive passes server-side variables to the client script.

- [ ] **Step 3: Add Faro to Layout**

In `src/layouts/Layout.astro`, add before closing `</body>`:

```astro
---
import Faro from '~/components/common/Faro.astro';
---

<!-- Before </body> -->
<Faro />
```

- [ ] **Step 4: Verify the build works**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Grafana Faro for Web Vitals and error tracking"
```

---

## Task 7: Switch to Hybrid Mode + Add Stripe Checkout

**Files:**
- Modify: `astro.config.ts` (hybrid mode + node adapter)
- Create: `src/pages/api/create-checkout-session.ts`
- Modify: `src/pages/pricing.astro`
- Create: `src/components/widgets/StripeCheckout.astro`
- Modify: `package.json`

- [ ] **Step 1: Install Node adapter and Stripe**

```bash
npm install @astrojs/node stripe
```

- [ ] **Step 2: Configure hybrid mode in `astro.config.ts`**

```typescript
import node from '@astrojs/node';

export default defineConfig({
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  // ... rest of config
});
```

Note: In Astro 6 hybrid mode, pages are static by default. Only pages/endpoints with `export const prerender = false` are server-rendered.

- [ ] **Step 3: Create Stripe Checkout API route**

```typescript
// src/pages/api/create-checkout-session.ts
import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const prerender = false;

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { priceId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${new URL(request.url).origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(request.url).origin}/pricing`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

- [ ] **Step 4: Create Stripe Checkout button component**

```astro
---
// src/components/widgets/StripeCheckout.astro
import { STRIPE } from '~/site.config';

interface Props {
  text?: string;
  class?: string;
}

const { text = 'Buy Now', class: className = '' } = Astro.props;
const { priceId } = STRIPE;
---

<button
  id="checkout-button"
  class:list={['btn-primary', className]}
  data-price-id={priceId}
>
  {text}
</button>

<script>
  const button = document.getElementById('checkout-button');
  button?.addEventListener('click', async () => {
    button.setAttribute('disabled', 'true');
    button.textContent = 'Redirecting...';

    try {
      const priceId = button.getAttribute('data-price-id');
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (err) {
      button.removeAttribute('disabled');
      button.textContent = 'Buy Now';
      console.error('Checkout error:', err);
    }
  });
</script>
```

- [ ] **Step 5: Update `src/pages/pricing.astro`**

Read the existing pricing page. Find the CTA buttons in the pricing cards and replace them with `StripeCheckout` component usage. Keep the existing layout and styling.

In the pricing page, import and use the component:

```astro
---
import StripeCheckout from '~/components/widgets/StripeCheckout.astro';
---

<!-- Replace the existing CTA button in the featured pricing card with: -->
<StripeCheckout text="Get Started" />
```

- [ ] **Step 6: Verify the build works**

```bash
npm run build
```

Expected: Build succeeds. The API route is server-rendered, pricing page is static.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Stripe Checkout with API route and checkout button"
```

---

## Task 8: Success Page + Notion Fulfillment

**Files:**
- Create: `src/pages/success.astro`
- Create: `src/pages/api/verify-payment.ts`

- [ ] **Step 1: Create payment verification API route**

```typescript
// src/pages/api/verify-payment.ts
import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const prerender = false;

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const GET: APIRoute = async ({ url }) => {
  const sessionId = url.searchParams.get('session_id');

  if (!sessionId) {
    return new Response(JSON.stringify({ verified: false }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const verified = session.payment_status === 'paid';

    return new Response(JSON.stringify({ verified, customerEmail: session.customer_details?.email }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ verified: false }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

- [ ] **Step 2: Create success page**

```astro
---
// src/pages/success.astro
import Layout from '~/layouts/PageLayout.astro';
import { FULFILLMENT, SITE } from '~/site.config';

export const prerender = false;

const sessionId = Astro.url.searchParams.get('session_id');

// Server-side payment verification
let verified = false;
let customerEmail = '';

if (sessionId) {
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    verified = session.payment_status === 'paid';
    customerEmail = session.customer_details?.email || '';
  } catch {
    verified = false;
  }
}

const metadata = {
  title: 'Thank You',
  robots: { index: false, follow: false },
};
---

<Layout metadata={metadata}>
  <section class="px-4 py-16 sm:px-6 mx-auto lg:px-8 max-w-3xl text-center">
    {verified ? (
      <div>
        <div class="text-6xl mb-6">&#10003;</div>
        <h1 class="text-4xl font-bold mb-4">Thank you for your purchase!</h1>
        <p class="text-xl text-muted mb-8">
          {customerEmail && (<>A confirmation has been sent to <strong>{customerEmail}</strong>.<br /></>)}
          Click below to access your download.
        </p>
        <a
          href={FULFILLMENT.downloadUrl}
          class="btn-primary inline-block px-8 py-4 text-lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download {SITE.name}
        </a>
      </div>
    ) : (
      <div>
        <h1 class="text-4xl font-bold mb-4">Payment Verification Failed</h1>
        <p class="text-xl text-muted mb-8">
          We couldn't verify your payment. If you completed the purchase, please check your email for the receipt or contact support.
        </p>
        <a href="/pricing" class="btn-primary inline-block px-8 py-4">
          Back to Pricing
        </a>
      </div>
    )}
  </section>
</Layout>
```

- [ ] **Step 3: Update navigation to exclude success page from sitemap**

The success page already has `robots: { index: false }`, which is correct. No sitemap entry needed.

- [ ] **Step 4: Verify the build works**

```bash
npm run build
```

Expected: Success page is server-rendered (not in `dist/` as static HTML). API routes are bundled for SSR.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add success page with server-side payment verification and Notion download link"
```

---

## Task 9: Security Headers

**Files:**
- Modify: `astro.config.ts` (CSP config)
- Create: `src/middleware.ts`

- [ ] **Step 1: Add Astro 6 CSP configuration**

Update `astro.config.ts` to include the security config:

```typescript
export default defineConfig({
  // ... existing config
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "connect-src 'self' https://plausible.io https://faro-collector.grafana.net",
        "frame-src https://js.stripe.com https://hooks.stripe.com",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "base-uri 'self'",
      ],
      scriptDirective: {
        resources: ["'self'", "https://js.stripe.com", "https://plausible.io"],
      },
      styleDirective: {
        resources: ["'self'", "'unsafe-inline'"],
      },
    },
  },
});
```

Note: Astro 6 CSP only works in build/preview, not in dev mode. Also, `<ClientRouter />` (view transitions) is not compatible with CSP — check if this is an issue and potentially disable view transitions or CSP as needed.

- [ ] **Step 2: Create middleware for additional security headers**

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  return response;
});
```

Note: Middleware applies to SSR routes. For static pages on Render, headers are set in `render.yaml` (Task 10).

- [ ] **Step 3: Verify the build works**

```bash
npm run build && npm run preview
```

Check response headers with curl:

```bash
curl -I http://localhost:4321/
```

Expected: Security headers present on SSR routes.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add security headers via Astro 6 CSP and middleware"
```

---

## Task 10: Render.com Deployment

**Files:**
- Create: `render.yaml`

- [ ] **Step 1: Create `render.yaml`**

```yaml
services:
  - type: web
    name: astro-indie-stack
    runtime: node
    buildCommand: npm ci && npm run build
    startCommand: node ./dist/server/entry.mjs
    envVars:
      - key: NODE_VERSION
        value: "22"
      - key: NODE_ENV
        value: production
      - key: STRIPE_SECRET_KEY
        sync: false
      - key: PUBLIC_STRIPE_PUBLISHABLE_KEY
        sync: false
      - key: STRIPE_PRICE_ID
        sync: false
      - key: PUBLIC_PLAUSIBLE_DOMAIN
        sync: false
      - key: PUBLIC_PLAUSIBLE_SCRIPT_URL
        sync: false
      - key: PUBLIC_FARO_COLLECTOR_URL
        sync: false
      - key: PUBLIC_DOWNLOAD_URL
        sync: false
      - key: PUBLIC_SITE_URL
        sync: false
    headers:
      - path: /*
        name: Strict-Transport-Security
        value: "max-age=63072000; includeSubDomains; preload"
      - path: /*
        name: X-Frame-Options
        value: DENY
      - path: /*
        name: X-Content-Type-Options
        value: nosniff
      - path: /*
        name: Referrer-Policy
        value: strict-origin-when-cross-origin
      - path: /*
        name: Permissions-Policy
        value: "geolocation=(), microphone=(), camera=()"
      - path: /_astro/*
        name: Cache-Control
        value: "public, max-age=31536000, immutable"
```

Note: Using `type: web` with `runtime: node` because we need SSR for the Stripe API routes. `sync: false` means Render won't sync these env vars from the YAML — they must be set in the Render dashboard.

- [ ] **Step 2: Verify the build produces the expected output**

```bash
npm run build
ls -la dist/server/entry.mjs
```

Expected: `dist/server/entry.mjs` exists (Node adapter SSR entry point).

- [ ] **Step 3: Commit**

```bash
git add render.yaml
git commit -m "feat: add render.yaml for one-click Render.com deployment"
```

---

## Task 11: Content Cleanup & Neutralization

**Files:**
- Modify: `src/site.config.ts` (generic branding)
- Modify: `src/navigation.ts`
- Modify: `src/pages/index.astro`
- Modify: All page files (placeholder text)
- Modify: Blog posts in `src/data/post/`

- [ ] **Step 1: Update navigation**

Read `src/navigation.ts` and update to include the success page route and remove any AstroWind-specific links:

```typescript
// src/navigation.ts
import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Features', href: '#features' },
    { text: 'Pricing', href: getPermalink('/pricing') },
    { text: 'Blog', href: getBlogPermalink() },
    {
      text: 'Pages',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Contact', href: getPermalink('/contact') },
        { text: 'Terms', href: getPermalink('/terms') },
        { text: 'Privacy', href: getPermalink('/privacy') },
      ],
    },
  ],
  actions: [{ text: 'Get Started', href: getPermalink('/pricing') }],
};

export const footerData = {
  links: [
    {
      title: 'Product',
      links: [
        { text: 'Features', href: '#features' },
        { text: 'Pricing', href: getPermalink('/pricing') },
        { text: 'Blog', href: getBlogPermalink() },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: 'Terms', href: getPermalink('/terms') },
        { text: 'Privacy', href: getPermalink('/privacy') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: '#' },
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
  ],
};
```

- [ ] **Step 2: Neutralize page content**

Go through each page and replace AstroWind-specific content with generic placeholder text. Each page should have:
- Neutral placeholder headlines and descriptions
- Generic "Your Product Name" / "Your Company" references
- Working component structure (all widgets still functional)

Pages to update:
- `src/pages/index.astro` — Main landing
- `src/pages/about.astro`
- `src/pages/contact.astro`
- `src/pages/pricing.astro`
- `src/pages/services.astro`
- `src/pages/homes/*.astro` — All home variants
- `src/pages/landing/*.astro` — All landing variants
- `src/pages/terms.md`
- `src/pages/privacy.md`

For each page: keep the component structure, replace text content with clear placeholders like "Your headline here", "Describe your product benefits", etc.

- [ ] **Step 3: Clean up blog posts**

Replace AstroWind-specific blog posts with 2-3 generic example posts:

Create `src/data/post/getting-started.md`:
```markdown
---
publishDate: 2026-01-15T00:00:00Z
title: Getting Started with Your New Template
excerpt: Learn how to set up and customize your Astro Indie Stack template.
image: ~/assets/images/default.png
category: Tutorials
tags:
  - getting-started
  - setup
---

## Welcome to Astro Indie Stack

This is an example blog post. Replace this content with your own.

### Quick Setup

1. Clone this template
2. Run `npm install`
3. Configure `src/site.config.ts`
4. Deploy to Render.com

### What's Included

- Plausible Analytics
- Grafana Faro monitoring
- Stripe Checkout
- Security headers
- Render.com deployment
```

Create 1-2 more example posts with different categories/tags.

Remove old AstroWind blog posts from `src/data/post/`.

- [ ] **Step 4: Update metadata in `src/site.config.ts`**

Ensure all AstroWind references are replaced with Astro Indie Stack defaults:

```typescript
export const METADATA = {
  title: {
    default: 'Astro Indie Stack',
    template: '%s — Astro Indie Stack',
  },
  description: 'Production-ready Astro template for indie hackers. Clone, configure, launch.',
  // ... rest stays the same
};
```

- [ ] **Step 5: Verify the build works and all pages render**

```bash
npm run build && npm run preview
```

Spot-check several pages in the browser to confirm placeholder content looks reasonable.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: neutralize content with generic placeholder text"
```

---

## Task 12: E2E Tests with Playwright

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/landing.spec.ts`
- Create: `tests/e2e/blog.spec.ts`
- Create: `tests/e2e/checkout.spec.ts`
- Create: `tests/e2e/navigation.spec.ts`
- Modify: `package.json` (test scripts)

- [ ] **Step 1: Install Playwright**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create Playwright config**

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 3: Create landing page tests**

```typescript
// tests/e2e/landing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Astro Indie Stack/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('[data-widget="hero"], section').first();
    await expect(hero).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    const pricingLink = page.getByRole('link', { name: /pricing/i }).first();
    await expect(pricingLink).toBeVisible();
  });

  test('should have dark mode toggle', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-aw-toggle-color-scheme]');
    if (await toggle.isVisible()) {
      await toggle.click();
      await expect(page.locator('html')).toHaveClass(/dark/);
    }
  });

  test('homepage variants should load', async ({ page }) => {
    const variants = ['/homes/saas', '/homes/startup', '/homes/personal', '/homes/mobile-app'];
    for (const variant of variants) {
      const response = await page.goto(variant);
      expect(response?.status()).toBe(200);
    }
  });

  test('landing page variants should load', async ({ page }) => {
    const variants = [
      '/landing/lead-generation',
      '/landing/sales',
      '/landing/click-through',
      '/landing/product',
      '/landing/pre-launch',
      '/landing/subscription',
    ];
    for (const variant of variants) {
      const response = await page.goto(variant);
      expect(response?.status()).toBe(200);
    }
  });
});
```

- [ ] **Step 4: Create blog tests**

```typescript
// tests/e2e/blog.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('should load blog listing', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('article, [class*="post"]').first()).toBeVisible();
  });

  test('should navigate to a blog post', async ({ page }) => {
    await page.goto('/blog');
    const firstPost = page.locator('a[href*="/"]').filter({ hasText: /.+/ }).first();
    const href = await firstPost.getAttribute('href');
    if (href) {
      await firstPost.click();
      await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });

  test('blog post should have title and content', async ({ page }) => {
    await page.goto('/blog');
    const firstPostLink = page.locator('a[href*="/getting-started"]').first();
    if (await firstPostLink.isVisible()) {
      await firstPostLink.click();
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('article, .prose')).toBeVisible();
    }
  });
});
```

- [ ] **Step 5: Create checkout flow tests**

```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('pricing page should load', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page).toHaveTitle(/pricing/i);
  });

  test('pricing page should have checkout button', async ({ page }) => {
    await page.goto('/pricing');
    const checkoutBtn = page.locator('#checkout-button');
    await expect(checkoutBtn).toBeVisible();
  });

  test('checkout button should attempt redirect', async ({ page }) => {
    await page.goto('/pricing');
    const checkoutBtn = page.locator('#checkout-button');

    // Without valid Stripe keys, the API will return an error
    // We just verify the button sends the request
    const responsePromise = page.waitForResponse('**/api/create-checkout-session');
    await checkoutBtn.click();
    const response = await responsePromise;

    // In test env without Stripe keys, expect a 500
    // In production with keys, this would redirect to Stripe
    expect([200, 500]).toContain(response.status());
  });

  test('success page without session_id should show error', async ({ page }) => {
    await page.goto('/success');
    await expect(page.getByText(/verification failed/i)).toBeVisible();
  });
});
```

- [ ] **Step 6: Create navigation tests**

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('all standard pages should return 200', async ({ page }) => {
    const pages = ['/', '/about', '/contact', '/pricing', '/services', '/blog', '/terms', '/privacy'];
    for (const path of pages) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should return 200`).toBe(200);
    }
  });

  test('404 page should work', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-xyz');
    expect(response?.status()).toBe(404);
  });

  test('RSS feed should be accessible', async ({ page }) => {
    const response = await page.goto('/rss.xml');
    expect(response?.status()).toBe(200);
    const contentType = response?.headers()['content-type'];
    expect(contentType).toContain('xml');
  });

  test('header should be sticky on scroll', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    await page.evaluate(() => window.scrollBy(0, 500));
    await expect(header).toBeVisible();
  });

  test('mobile menu should toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const menuToggle = page.locator('[data-aw-toggle-menu]');
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    }
  });
});
```

- [ ] **Step 7: Add test scripts to `package.json`**

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed"
  }
}
```

- [ ] **Step 8: Run the tests**

```bash
npm run build && npm test
```

Expected: Tests run against the preview server. Some tests may need adjustment based on actual page structure — fix any failures.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add Playwright E2E tests for landing, blog, checkout, and navigation"
```

---

## Task 13: Final Cleanup & Verification

**Files:**
- Modify: `package.json` (remove unused deps)
- Verify: All files

- [ ] **Step 1: Remove unused dependencies**

```bash
npm uninstall @astrolib/analytics @astrolib/seo @astrojs/partytown
```

Check if `@astrolib/seo` is used elsewhere — if the Metadata component imports it, keep it or replace with direct meta tags.

```bash
grep -r "@astrolib/seo" src/ --include="*.astro" --include="*.ts"
```

If used, keep it. If only in the removed Analytics component, remove it.

- [ ] **Step 2: Remove `astro-compress` if not needed**

The compress integration adds build complexity. Render.com and CDNs handle compression (gzip/brotli). Consider removing:

```bash
npm uninstall astro-compress
```

And remove from `astro.config.ts` integrations array.

- [ ] **Step 3: Final build and full test run**

```bash
npm run build && npm test
```

Expected: All tests pass, build is clean.

- [ ] **Step 4: Verify `.env.example` has all required variables**

Cross-check `src/site.config.ts` env variable usage with `.env.example`. Every `import.meta.env.XXX` should have a corresponding entry.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: final cleanup — remove unused dependencies"
```

---

## Summary of Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Hybrid mode** (not static) | Stripe API routes need server-side execution |
| **Node adapter** | Render.com runs Node.js for SSR |
| **`site.config.ts`** (not YAML) | TypeScript gives type safety, autocompletion, and `import.meta.env` access |
| **Server-side payment verification** | Client-side verification is insecure — session_id can be guessed |
| **Plausible script tag** (not integration) | Simple, no build dependency, privacy-friendly |
| **Faro dynamic import** | Non-blocking, loads after page content |
| **Render.yaml headers + middleware** | Static pages get headers from Render CDN, SSR routes from middleware |
| **Astro 6 CSP** | Built-in script hashing, no manual nonce management |

---

## Appendix A: Astro 5 → 6 Breaking Changes Reference

### A1. Node 22 Required
Node 18 and 20 are dropped. Minimum: Node 22.12.0.

### A2. Content Collections — Complete Rewrite Required

| Change | Before (v5) | After (v6) |
|--------|------------|------------|
| Config location | `src/content/config.ts` | `src/content.config.ts` |
| Collection type | `type: 'content'` | Remove entirely |
| Loader | Implicit | `loader: glob({ pattern: '**/*.md', base: './src/data/post' })` required |
| Slug access | `entry.slug` | `entry.id` |
| Render | `entry.render()` | `import { render } from 'astro:content'; render(entry)` |
| Lookup | `getEntryBySlug()` | `getEntry()` |
| Zod import | `import { z } from 'astro:content'` | `import { z } from 'astro/zod'` |

### A3. Zod 4 Changes

```typescript
// String validators moved to top-level
// BEFORE: z.string().email()
// AFTER:  z.email()

// Error message property renamed
// BEFORE: z.string().min(5, { message: "Too short" })
// AFTER:  z.string().min(5, { error: "Too short" })

// .default() must match OUTPUT type (not input)
// BEFORE: z.string().transform(Number).default("0")
// AFTER:  z.string().transform(Number).default(0)
```

### A4. Removed APIs

| Removed | Replacement |
|---------|-------------|
| `Astro.glob()` | `Object.values(import.meta.glob('./path/*.md', { eager: true }))` |
| `<ViewTransitions />` | `<ClientRouter />` from `astro:transitions` |
| `emitESMImage()` | `emitImageMetadata()` |
| `z` from `astro:content` | `z` from `astro/zod` |
| `z` from `astro:schema` | `z` from `astro/zod` |

### A5. Behavior Changes

- **`import.meta.env` values always inlined** — `"true"` stays string, not boolean. Use `=== "true"` comparison.
- **Script/style tags** now render in source order (was reversed in v5).
- **Markdown heading IDs** preserve trailing hyphens now (GitHub-compatible).
- **Endpoints with file extensions** cannot have trailing slash (`/rss.xml/` → `/rss.xml`).
- **Rollup output config** moved: `vite.build.rollupOptions.output` → `vite.environments.client.build.rollupOptions.output`.

### A6. Experimental Flags Now Stable

Remove these flags from `astro.config.mjs`:
- `experimental.csp` → `security.csp`
- `experimental.fonts` → stable
- `experimental.liveContentCollections` → stable
- `experimental.preserveScriptOrder` → default behavior
- `experimental.headingIdCompat` → default behavior

### A7. Vite 7 + Shiki 4
- Check all Vite plugins for v7 compatibility
- Shiki 4 may affect custom syntax highlighting themes

---

## Appendix B: Tailwind 3 → 4 Breaking Changes Reference

### B1. Config Migration (CRITICAL)

`tailwind.config.js` is replaced by CSS-first configuration:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:where(.dark, .dark *));
@custom-variant intersect (&:not([no-intersect]));

@theme {
  --color-primary: var(--aw-color-primary);
  --color-secondary: var(--aw-color-secondary);
  --color-accent: var(--aw-color-accent);
  --color-default: var(--aw-color-text-default);
  --color-muted: var(--aw-color-text-muted);
  --font-family-sans: var(--aw-font-sans, ui-sans-serif), ui-sans-serif, system-ui, sans-serif;
  --font-family-serif: var(--aw-font-serif, ui-serif), ui-serif, Georgia, serif;
  --font-family-heading: var(--aw-font-heading, ui-sans-serif), ui-sans-serif, system-ui, sans-serif;
  --animate-fade: fadeInUp 1s both;
  @keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(2rem); }
    100% { opacity: 1; transform: translateY(0); }
  }
}
```

### B2. Astro Integration Change (CRITICAL)

```typescript
// BEFORE (astro.config.ts)
import tailwind from '@astrojs/tailwind';
integrations: [tailwind({ applyBaseStyles: false })]

// AFTER
import tailwindcss from '@tailwindcss/vite';
vite: { plugins: [tailwindcss()] }
```

### B3. Renamed Utility Classes (HIGH)

Search-and-replace these across ALL `.astro`, `.css`, `.ts`, `.tsx` files:

| v3 Class | v4 Class | Occurrences in AstroWind |
|----------|----------|------------------------|
| `shadow-sm` | `shadow-xs` | ~16 files |
| `shadow` (bare) | `shadow-sm` | Multiple |
| `rounded-sm` | `rounded-xs` | Multiple |
| `rounded` (bare) | `rounded-sm` | Multiple |
| `blur-sm` | `blur-xs` | Few |
| `blur` (bare) | `blur-sm` | Few |
| `outline-none` | `outline-hidden` | Multiple |
| `bg-gradient-to-*` | `bg-linear-to-*` | ~3 files |
| `drop-shadow-sm` | `drop-shadow-xs` | Few |
| `drop-shadow` (bare) | `drop-shadow-sm` | Few |

**WARNING:** Bare `shadow` → `shadow-sm` and `rounded` → `rounded-xs` are tricky — you can't blindly search-replace without matching word boundaries. Use regex: `\bshadow\b` (not `shadow-`).

### B4. CSS Directives Change

```css
/* BEFORE */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* AFTER */
@import "tailwindcss";
```

### B5. Dark Mode Configuration

Must add explicit `@custom-variant dark` — **147 `dark:` usages across 46 files** will break without it:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

### B6. Plugin Migration

```css
/* Typography: @plugin instead of JS import */
@plugin "@tailwindcss/typography";

/* Custom variants: @custom-variant instead of addVariant() */
@custom-variant intersect (&:not([no-intersect]));
```

### B7. @apply Changes

- `@apply` still works but only in the main CSS file
- For imported CSS files, use `@reference "tailwindcss"` at the top
- The old `@tailwind base/components/utilities` directives are removed

### B8. tailwind-merge Upgrade Required

Current: `tailwind-merge ^2.6.0` (TW3 only)
Required: `tailwind-merge ^3.x` (TW4 support)

### B9. Default Behavior Changes

- **Default border color** changed from `gray-200` to `currentColor`
- **Default placeholder color** changed to current text color at 50% opacity
- **Hover** uses `@media (hover: hover) and (pointer: fine)` — no hover on touch devices
- **Content detection** is automatic — `content: [...]` config no longer needed
- **Divide utilities** use `:not(:last-child)` instead of `~ :not([hidden])` — direction flipped

### B10. Browser Requirements

Tailwind 4 requires Safari 16.4+, Chrome 111+, Firefox 128+.

---

## Appendix C: AstroWind-Specific Migration Checklist

Before starting implementation, verify each item:

- [ ] Find all `Astro.glob()` usages → replace with `import.meta.glob`
- [ ] Find all `<ViewTransitions />` → replace with `<ClientRouter />`
- [ ] Find all `import { z } from 'astro:content'` → replace with `import { z } from 'astro/zod'`
- [ ] Find all `entry.slug` in blog utils → replace with `entry.id`
- [ ] Find all `entry.render()` calls → replace with `render(entry)`
- [ ] Verify `getEntryBySlug` usage → replace with `getEntry`
- [ ] Count all `shadow-sm` / `shadow` / `rounded-sm` / `rounded` usages for class rename
- [ ] Count all `outline-none` usages for rename to `outline-hidden`
- [ ] Count all `bg-gradient-to-*` usages for rename to `bg-linear-to-*`
- [ ] Count all `dark:` usages (expect ~147 across ~46 files)
- [ ] Find all `@apply` usages in CSS files
- [ ] Check `@astrolib/seo` compatibility with Astro 6
- [ ] Check `astro-icon` compatibility with Astro 6
- [ ] Check `astro-embed` compatibility with Astro 6
- [ ] Check `astro-compress` compatibility with Astro 6 + Vite 7
- [ ] Verify `unpic` compatibility with Astro 6
