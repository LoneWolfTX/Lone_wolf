import { getSiteContentFromRedis } from './redis';
import { DEFAULT_SITE_CONTENT, SiteContent } from './contentStore';

/**
 * Server-side helper to fetch canonical site content for SSR, metadata, and JSON-LD schema.
 */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    return await getSiteContentFromRedis();
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}