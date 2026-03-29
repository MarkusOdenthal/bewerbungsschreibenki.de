---
publishDate: 2026-01-25T00:00:00Z
title: Deploying to Production
excerpt: A step-by-step guide to deploying your Astro Indie Stack site on Render.com.
image: ~/assets/images/default.png
category: Guides
tags:
  - deployment
  - render
  - production
---

## Production Deployment

This guide walks you through deploying your site to Render.com.

### Prerequisites

- A Render.com account
- Your site configured and tested locally

### Steps

1. Push your code to a Git repository
2. Create a new Web Service on Render.com
3. Connect your repository
4. Set environment variables
5. Deploy

### Environment Variables

Make sure to set:

- `PUBLIC_SITE_URL` - Your production URL
- `PUBLIC_PLAUSIBLE_DOMAIN` - Your analytics domain
- `PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe key
- `STRIPE_PRICE_ID` - Your Stripe price ID
