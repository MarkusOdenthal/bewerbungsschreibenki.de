# astro-indie-stack — Design Spec

> Created: 2026-03-28
> Status: Draft

---

## 1. Project Scope

**astro-indie-stack** — a paid Astro template for indie hackers that includes everything needed to launch a digital product.

### What it is

- AstroWind cloned → upgraded to Astro 6 + Tailwind 4 → custom integrations added → Google Analytics removed
- Built-in: Plausible Analytics, Grafana Faro, Render.com deploy, Stripe Checkout + download fulfillment (via Notion), Security Headers
- All existing AstroWind pages remain (landing variants, blog, pricing, etc.), cleaned up and neutralized
- English-language (product for English-speaking market)
- Sold as a paid template via Stripe Checkout

### What it is not

- Not a SaaS boilerplate (no auth, no database)
- Not a framework/library — a concrete, clonable template
- Not a fork with upstream tracking — own repo, own direction

### First implementation step

Explore AstroWind, create user stories (with Skill, Agent, Command pattern like bilder-zum-malen), then use those stories as E2E test basis.

---

## 2. Tech Stack & Integrations

### Core

- Astro 6 + Tailwind 4 + TypeScript
- AstroWind component structure (Hero, Features, FAQs, Pricing, CTA, etc.)

### Remove

- Google Analytics — remove completely

### Add

- **Plausible Analytics** — privacy-friendly, script tag + optional self-hosted config
- **Grafana Faro** — Web Vitals + error tracking
- **Render.com** — `render.yaml` for one-click deploy, static site config
- **Stripe** — Checkout Session for digital products, webhook for payment confirmation, Success page with download link
- **Notion as fulfillment** — after payment, a Notion link/page serves as download source (simple, no own server needed)
- **Security Headers** — CSP, HSTS, X-Frame-Options etc. via Render or middleware

### Design

- Clean and neutralize AstroWind design (neutral colors, generic placeholder text)
- Dark mode stays (already built-in)

---

## 3. Page Structure

All existing AstroWind pages remain, cleaned up with placeholder content.

### Landing Pages

- `/` — main landing (SaaS variant as default)
- `/homes/startup/`, `/homes/saas/`, `/homes/mobile-app/`, `/homes/personal/` — variants as reference

### Marketing

- `/landing/product/`, `/landing/sales/`, `/landing/subscription/`, etc. — conversion templates

### Standard

- `/pricing/` — connected to Stripe Checkout
- `/about/`, `/contact/`, `/services/`
- `/blog/` + `[...blog]` — blog with MDX support

### Legal

- `/privacy/`, `/terms/`

### New

- `/success/` — post-payment success page with download link (Notion)
- `/404/` — stays as is

All pages with English placeholder content, so you only need to swap text.

---

## 4. Skill & Workflow

### GitHub Template Repo

- `astro-indie-stack` as public repo on GitHub
- "Use this template" button → new project in seconds

### Per-project configuration

- One central config file (e.g. `site.config.ts`) with: site name, domain, Stripe keys, Plausible domain, Grafana Faro URL, Notion download links
- Change everything in one place, template pulls values from there

### Claude Code Skill

- A skill in the repo that helps with exploring and configuring
- Knows the structure, can assist with content creation
- Similar to bilder-zum-malen: Agent + Command structure

### User Stories as E2E Tests

- First step: explore AstroWind → create user stories
- Stories describe real user paths (visit landing → see pricing → checkout → download)
- These stories serve as basis for E2E tests (Playwright or similar)

---

## 5. Distribution & Positioning

### Product

- Paid template — one-time purchase via Stripe
- Target audience: indie hackers / solopreneurs who want to quickly launch a digital product
- English-language

### Differentiation from other Astro templates

- Not just a design template, but a **production-ready stack** (analytics, payments, deploy, security — all included)
- "Clone, configure, launch" — no hunting for integrations

### Own usage

- bewerbungsschreibenki.de will be the first project built on this template
- Every future project (bilder-zum-malen relaunch, new ideas) can start from it
- Template continuously improved through own usage

### Marketing website

- The template is its own marketing — the sales page for astro-indie-stack runs on astro-indie-stack itself ("dogfooding")
