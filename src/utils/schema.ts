/**
 * Structured data utilities for SEO (schema.org JSON-LD)
 * Generic, reusable schema generators for any Astro site.
 */

// ============================================================================
// Shared helpers
// ============================================================================

/** Safely stringify JSON-LD with XSS-safe escaping */
export function toJsonLd(obj: Record<string, unknown>): string {
  return JSON.stringify(obj, null, 2).replace(/</g, '\\u003C').replace(/>/g, '\\u003E').replace(/&/g, '\\u0026');
}

// ============================================================================
// WebSite Schema
// ============================================================================

export interface WebSiteConfig {
  name: string;
  url: string;
  description?: string;
  inLanguage?: string;
  searchUrl?: string;
}

export function generateWebSite(config: WebSiteConfig): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: config.url,
    inLanguage: config.inLanguage || 'en'
  };

  if (config.description) {
    schema.description = config.description.substring(0, 160);
  }

  if (config.searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: config.searchUrl,
      'query-input': 'required name=search_term_string'
    };
  }

  return schema;
}

// ============================================================================
// Organization Schema
// ============================================================================

export interface OrganizationConfig {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  email?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
}

export function generateOrganization(config: OrganizationConfig): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${config.url}#organization`,
    name: config.name,
    url: config.url
  };

  if (config.logo) {
    schema.logo = {
      '@type': 'ImageObject',
      url: config.logo.startsWith('http') ? config.logo : `${config.url}/${config.logo.replace(/^\//, '')}`
    };
  }

  if (config.description) schema.description = config.description;
  if (config.email) schema.email = config.email;

  if (config.address) {
    schema.address = {
      '@type': 'PostalAddress',
      ...config.address
    };
  }

  return schema;
}

// ============================================================================
// BreadcrumbList Schema
// ============================================================================

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export function generateBreadcrumbList(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url })
    }))
  };
}

// ============================================================================
// FAQPage Schema
// ============================================================================

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQPage(faqs: FAQItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// ============================================================================
// Article Schema (for blog posts)
// ============================================================================

export interface ArticleConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  publisher?: { name: string; url: string; logo?: string };
  inLanguage?: string;
}

export function generateArticle(config: ArticleConfig): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.title,
    description: config.description,
    url: config.url,
    inLanguage: config.inLanguage || 'en'
  };

  if (config.image) schema.image = config.image;
  if (config.datePublished) schema.datePublished = config.datePublished;
  if (config.dateModified) schema.dateModified = config.dateModified;
  if (config.author) {
    schema.author = { '@type': 'Person', name: config.author };
  }
  if (config.publisher) {
    schema.publisher = {
      '@type': 'Organization',
      name: config.publisher.name,
      url: config.publisher.url,
      ...(config.publisher.logo && { logo: { '@type': 'ImageObject', url: config.publisher.logo } })
    };
  }

  return schema;
}
