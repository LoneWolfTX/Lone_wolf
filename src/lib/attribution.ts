export interface AttributionSnapshot {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  landingPage?: string;
  referrer?: string;
  gclid?: string;
  fbclid?: string;
  timestamp?: string;
}

export interface CompleteAttributionPayload {
  firstTouch: AttributionSnapshot;
  lastTouch: AttributionSnapshot;
  normalizedSource: string;
  reportingAttributionSource: string;
  reportingAttributionCampaignId?: string;
  attributedCampaignId?: string;
}

/**
 * Honest classification of normalized traffic source
 */
export function normalizeSource(
  source?: string,
  medium?: string,
  referrer?: string,
  gclid?: string,
  fbclid?: string
): string {
  const src = (source || '').toLowerCase();
  const med = (medium || '').toLowerCase();
  const ref = (referrer || '').toLowerCase();

  if (gclid || (src === 'google' && (med === 'cpc' || med === 'ppc' || med === 'adwords'))) {
    return 'Google Ads';
  }

  if (fbclid || src.includes('facebook') || src.includes('instagram') || src.includes('meta')) {
    if (med === 'cpc' || med === 'paid' || med === 'ads') {
      return 'Facebook / Meta Ads';
    }
    return 'Facebook Organic';
  }

  // HONEST Google Maps / Business Profile check (Directive #3)
  // Only classify as Google Maps when explicit evidence exists (e.g. utm_source=google_maps or utm_medium=gmb or source=gmb)
  if (src === 'google_maps' || med === 'gmb' || src === 'gmb' || ref.includes('maps.google.com')) {
    return 'Google Maps / Business Profile';
  }

  if (src === 'google' || ref.includes('google.com')) {
    return 'Google Organic';
  }

  if (src === 'craigslist') return 'Craigslist';
  if (src === 'facebook_marketplace' || src === 'fb_marketplace') return 'Facebook Marketplace';

  if (ref && !ref.includes(typeof window !== 'undefined' ? window.location.hostname : 'lonewolfdumpsters')) {
    return 'Referral';
  }

  if (!src && !ref && !gclid && !fbclid) {
    return 'Direct';
  }

  return 'Unknown';
}

const FIRST_TOUCH_KEY = 'lonewolf_first_touch';
const LAST_TOUCH_KEY = 'lonewolf_last_touch';

/**
 * Initialize visitor attribution in browser
 */
export function initAttributionTracking() {
  if (typeof window === 'undefined') return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source') || undefined;
    const utm_medium = urlParams.get('utm_medium') || undefined;
    const utm_campaign = urlParams.get('utm_campaign') || undefined;
    const utm_content = urlParams.get('utm_content') || undefined;
    const utm_term = urlParams.get('utm_term') || undefined;
    const gclid = urlParams.get('gclid') || undefined;
    const fbclid = urlParams.get('fbclid') || undefined;
    const referrer = document.referrer || undefined;
    const landingPage = window.location.pathname + window.location.search;

    const currentSnapshot: AttributionSnapshot = {
      source: utm_source,
      medium: utm_medium,
      campaign: utm_campaign,
      content: utm_content,
      term: utm_term,
      landingPage,
      referrer,
      gclid,
      fbclid,
      timestamp: new Date().toISOString(),
    };

    // 1. FIRST TOUCH (Preserve original acquisition source)
    const existingFirst = localStorage.getItem(FIRST_TOUCH_KEY);
    if (!existingFirst) {
      localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(currentSnapshot));
    }

    // 2. LAST TOUCH (Updated on page visits)
    sessionStorage.setItem(LAST_TOUCH_KEY, JSON.stringify(currentSnapshot));
  } catch (err) {
    console.error('Failed to init attribution tracking:', err);
  }
}

/**
 * Get full attribution payload for lead submission
 */
export function getAttributionPayload(): CompleteAttributionPayload {
  if (typeof window === 'undefined') {
    return {
      firstTouch: {},
      lastTouch: {},
      normalizedSource: 'Direct',
      reportingAttributionSource: 'Direct',
    };
  }

  try {
    const firstRaw = localStorage.getItem(FIRST_TOUCH_KEY);
    const lastRaw = sessionStorage.getItem(LAST_TOUCH_KEY);

    const firstTouch: AttributionSnapshot = firstRaw ? JSON.parse(firstRaw) : {};
    const lastTouch: AttributionSnapshot = lastRaw ? JSON.parse(lastRaw) : {};

    const norm = normalizeSource(
      lastTouch.source || firstTouch.source,
      lastTouch.medium || firstTouch.medium,
      lastTouch.referrer || firstTouch.referrer,
      lastTouch.gclid || firstTouch.gclid,
      lastTouch.fbclid || firstTouch.fbclid
    );

    // Reporting Attribution: Last Non-Direct Touch
    let reportingSource = normalizeSource(lastTouch.source, lastTouch.medium, lastTouch.referrer, lastTouch.gclid, lastTouch.fbclid);
    if (reportingSource === 'Direct' && firstTouch.source) {
      reportingSource = normalizeSource(firstTouch.source, firstTouch.medium, firstTouch.referrer, firstTouch.gclid, firstTouch.fbclid);
    }

    return {
      firstTouch,
      lastTouch,
      normalizedSource: norm,
      reportingAttributionSource: reportingSource,
    };
  } catch {
    return {
      firstTouch: {},
      lastTouch: {},
      normalizedSource: 'Direct',
      reportingAttributionSource: 'Direct',
    };
  }
}
