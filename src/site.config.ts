// src/site.config.ts
// Central configuration — change everything in one place.

export const SITE = {
  name: 'Astro Indie Stack',
  site: import.meta.env.PUBLIC_SITE_URL || 'https://example.com',
  base: '/',
  trailingSlash: false as boolean
};

export const I18N = {
  language: 'en',
  textDirection: 'ltr' as 'ltr' | 'rtl'
};

export const METADATA = {
  title: {
    default: SITE.name,
    template: `%s — ${SITE.name}`
  },
  description: 'Production-ready Astro template for indie hackers. Clone, configure, launch.',
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    site_name: SITE.name,
    images: [{ url: '~/assets/images/default.png', width: 1200, height: 628 }],
    type: 'website'
  },
  twitter: {
    cardType: 'summary'
  }
};

export const APP_BLOG = {
  isEnabled: true,
  postsPerPage: 6,
  post: {
    isEnabled: true,
    permalink: '/%slug%',
    robots: {
      index: true,
      follow: true
    }
  },
  list: {
    isEnabled: true,
    pathname: 'blog',
    robots: {
      index: true,
      follow: true
    }
  },
  category: {
    isEnabled: true,
    pathname: 'category',
    robots: {
      index: true,
      follow: true
    }
  },
  tag: {
    isEnabled: true,
    pathname: 'tag',
    robots: {
      index: false,
      follow: true
    }
  },
  isRelatedPostsEnabled: true,
  relatedPostsCount: 4
} as const;

export const UI = {
  theme: 'system' as 'system' | 'light' | 'dark' | 'light:only' | 'dark:only'
} as const;

export const ANALYTICS = {
  plausible: {
    domain: import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN || '',
    scriptUrl: import.meta.env.PUBLIC_PLAUSIBLE_SCRIPT_URL || 'https://plausible.io/js/script.js'
  },
  faro: {
    collectorUrl: import.meta.env.PUBLIC_FARO_COLLECTOR_URL || '',
    appName: SITE.name
  }
} as const;

export const STRIPE = {
  paymentLink: import.meta.env.PUBLIC_STRIPE_PAYMENT_LINK || ''
} as const;
