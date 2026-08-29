'use client';

import { useState, useEffect } from 'react';
import {
  DEFAULT_SITE_CONTENT,
  SiteContent,
  DumpsterPageContent,
  PageCard,
} from './contentStore';

// In-memory cache for fast hydration across page navigations
let globalSiteContentCache: SiteContent | null = null;
let fetchPromise: Promise<SiteContent> | null = null;

async function fetchCanonicalSiteContent(): Promise<SiteContent> {
  if (globalSiteContentCache) {
    return globalSiteContentCache;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async (): Promise<SiteContent> => {
    try {
      // 1. Try Vercel + Upstash Redis server API route first
      let res = await fetch('/api/admin/content?t=' + Date.now(), {
        cache: 'no-store',
      }).catch(() => null);

      // 2. Fallback to static JSON endpoint or PHP if Redis API is unavailable
      if (!res || !res.ok) {
        res = await fetch('/api/content.php?t=' + Date.now(), {
          cache: 'no-store',
        }).catch(() => null);
      }
      if (!res || !res.ok) {
        res = await fetch('/api/site-content.json?t=' + Date.now(), {
          cache: 'no-store',
        }).catch(() => null);
      }

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && typeof data === 'object' && (data.homepage || data.business)) {
          const mergeCards = (saved: PageCard[] | undefined, defaults: PageCard[]): PageCard[] => {
            if (!Array.isArray(saved)) return defaults;
            return saved.map((card) => {
              const def = defaults.find((d) => d.id === card.id);
              return { ...def, ...card };
            });
          };

          globalSiteContentCache = {
            ...DEFAULT_SITE_CONTENT,
            ...data,
            business: { ...DEFAULT_SITE_CONTENT.business, ...(data.business || {}) },
            contact: { ...DEFAULT_SITE_CONTENT.contact, ...(data.contact || {}) },
            pricing: { ...DEFAULT_SITE_CONTENT.pricing, ...(data.pricing || {}) },
            dimensions: { ...DEFAULT_SITE_CONTENT.dimensions, ...(data.dimensions || {}) },
            rentalPeriods: { ...DEFAULT_SITE_CONTENT.rentalPeriods, ...(data.rentalPeriods || {}) },
            contractorRates: { ...DEFAULT_SITE_CONTENT.contractorRates, ...(data.contractorRates || {}) },
            termsContent: { ...DEFAULT_SITE_CONTENT.termsContent, ...(data.termsContent || {}) },
            materialPolicies: Array.isArray(data.materialPolicies) ? data.materialPolicies : DEFAULT_SITE_CONTENT.materialPolicies,
            prohibitedMaterialsList: Array.isArray(data.prohibitedMaterialsList) ? data.prohibitedMaterialsList : DEFAULT_SITE_CONTENT.prohibitedMaterialsList,
            promotions: Array.isArray(data.promotions) ? data.promotions : DEFAULT_SITE_CONTENT.promotions,
            testimonials: Array.isArray(data.testimonials) ? data.testimonials : DEFAULT_SITE_CONTENT.testimonials,
            serviceAreasList: Array.isArray(data.serviceAreasList) ? data.serviceAreasList : DEFAULT_SITE_CONTENT.serviceAreasList,
            zipCodes: Array.isArray(data.zipCodes) ? data.zipCodes : DEFAULT_SITE_CONTENT.zipCodes,
            dumpsterEntities: Array.isArray(data.dumpsterEntities) ? data.dumpsterEntities : DEFAULT_SITE_CONTENT.dumpsterEntities,
            homepage: { ...DEFAULT_SITE_CONTENT.homepage, ...(data.homepage || {}) },
            about: { ...DEFAULT_SITE_CONTENT.about, ...(data.about || {}) },
            residentialCards: mergeCards(data.residentialCards, DEFAULT_SITE_CONTENT.residentialCards),
            contractorCards: mergeCards(data.contractorCards, DEFAULT_SITE_CONTENT.contractorCards),
            commercialCards: mergeCards(data.commercialCards, DEFAULT_SITE_CONTENT.commercialCards),
          };
          return globalSiteContentCache as SiteContent;
        }
      }
    } catch (err) {
      console.warn('Unable to load canonical content from endpoints, using defaults:', err);
    }
    globalSiteContentCache = DEFAULT_SITE_CONTENT;
    return DEFAULT_SITE_CONTENT;
  })();

  return fetchPromise;
}

/**
 * Main hook that returns the full canonical site content from /api/content.php.
 */
export function useSiteContent(): { content: SiteContent; loading: boolean; refresh: () => void } {
  const [content, setContent] = useState<SiteContent>(globalSiteContentCache || DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState<boolean>(!globalSiteContentCache);

  const loadData = () => {
    fetchCanonicalSiteContent().then((data) => {
      setContent(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const refresh = () => {
    globalSiteContentCache = null;
    fetchPromise = null;
    loadData();
  };

  return { content, loading, refresh };
}

/**
 * Hook for homepage content & images
 */
export function useHomepageContent() {
  const { content } = useSiteContent();
  return content.homepage;
}

/**
 * Hook that returns editable content for a specific dumpster size page.
 */
export function useDumpsterPageContent(id: string): DumpsterPageContent {
  const { content } = useSiteContent();
  const found = content.dumpsterPages.find((p) => p.id === id);
  const defaultPage = DEFAULT_SITE_CONTENT.dumpsterPages.find((p) => p.id === id)!;
  return found ? { ...defaultPage, ...found } : defaultPage;
}

/**
 * Hook that returns editable residential project cards.
 */
export function useResidentialCards(): PageCard[] {
  const { content } = useSiteContent();
  return content.residentialCards || DEFAULT_SITE_CONTENT.residentialCards;
}

/**
 * Hook that returns editable contractor trade cards.
 */
export function useContractorCards(): PageCard[] {
  const { content } = useSiteContent();
  return content.contractorCards || DEFAULT_SITE_CONTENT.contractorCards;
}

/**
 * Hook that returns editable commercial industry cards.
 */
export function useCommercialCards(): PageCard[] {
  const { content } = useSiteContent();
  return content.commercialCards || DEFAULT_SITE_CONTENT.commercialCards;
}

/**
 * Helper to update site content in memory cache
 */
export function setGlobalContentCache(newContent: SiteContent) {
  globalSiteContentCache = newContent;
}
