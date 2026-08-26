/**
 * Conversion Tracking Helper for Lone Wolf Dumpsters
 * Integrates Google Tag Manager, Google Analytics (GA4: G-WB2ZEEBZ4Y), and Meta Pixel (fbq: 99020332740911)
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Triggered on successful quote/booking form submission
 */
export function trackLeadSubmitted(data: {
  service: string;
  projectType: string;
  location?: string;
}) {
  if (typeof window === 'undefined') return;

  const leadValue = data.service.includes('15') ? 385 : data.service.includes('20') ? 425 : 475;

  // 1. Google Tag Manager DataLayer Push
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'lead_form_submitted',
      formType: 'dumpster_quote',
      serviceRequested: data.service,
      projectType: data.projectType,
      value: leadValue,
    });
  }

  // 2. Google Analytics / Google Ads gtag Conversion
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'Engagement',
      event_label: data.service,
      value: leadValue,
      currency: 'USD',
    });
  }

  // 3. Meta Pixel (Facebook) Lead Event
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: data.service,
      content_category: data.projectType,
      value: leadValue,
      currency: 'USD',
    });
  }
}

/**
 * Triggered when a visitor clicks a phone call link
 */
export function trackPhoneClick(location: string = 'header') {
  if (typeof window === 'undefined') return;

  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'phone_call_click',
      clickLocation: location,
      targetNumber: '(214) 876-0321',
    });
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'contact_phone_click', {
      event_category: 'Contact',
      event_label: location,
    });
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Contact', {
      content_name: 'phone_call',
      content_category: location,
    });
  }
}

/**
 * Triggered when a visitor clicks a text message / SMS link
 */
export function trackSmsClick(location: string = 'quote_section') {
  if (typeof window === 'undefined') return;

  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'sms_text_click',
      clickLocation: location,
      targetNumber: '(214) 876-0321',
    });
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'contact_sms_click', {
      event_category: 'Contact',
      event_label: location,
    });
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Contact', {
      content_name: 'sms_text',
      content_category: location,
    });
  }
}

/**
 * Triggered when a visitor clicks the primary BOOK ONLINE CTA
 */
export function trackBookOnlineClick(serviceName?: string, location: string = 'card') {
  if (typeof window === 'undefined') return;

  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'book_online_cta_click',
      serviceName: serviceName || 'generic',
      clickLocation: location,
    });
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'book_online_click', {
      event_category: 'CTA',
      event_label: serviceName || location,
    });
  }
}
