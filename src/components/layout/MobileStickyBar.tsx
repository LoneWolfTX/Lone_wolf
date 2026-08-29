'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Calendar } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';
import { trackPhoneClick, trackBookOnlineClick } from '@/lib/tracking';
import { getQuoteUrl } from '@/lib/ctaHelper';

export const MobileStickyBar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const quoteUrl = getQuoteUrl(pathname);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling beyond the hero (~280px)
      if (window.scrollY > 280) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) return null;
  if (!visible) return null;

  return (
    <nav
      className="mobile-sticky-action-bar"
      aria-label="Mobile Quick Actions"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        backgroundColor: 'rgba(10, 13, 18, 0.96)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderTop: '1px solid #1e293b',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
      }}
    >
      {/* Call Button */}
      <a
        href={`tel:${siteSettings.contact.phoneRaw}`}
        className="sticky-action-btn"
        aria-label={`Call Lone Wolf Dumpsters directly at ${siteSettings.contact.phone}`}
        onClick={() => trackPhoneClick('mobile_sticky_call')}
        style={{
          flex: 1,
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '4px',
          color: '#ffffff',
          fontFamily: 'var(--font-display)',
          fontSize: '0.88rem',
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        <Phone size={15} style={{ color: 'var(--accent-red)' }} />
        <span>CALL</span>
      </a>

      {/* Text Button */}
      <a
        href={`sms:${siteSettings.contact.phoneRaw}?body=Hi%20Lone%20Wolf%20Dumpsters,%20I'd%20like%20a%20dumpster%20quote.`}
        className="sticky-action-btn"
        aria-label={`Text Lone Wolf Dumpsters at ${siteSettings.contact.phone} for quote`}
        onClick={() => trackPhoneClick('mobile_sticky_text')}
        style={{
          flex: 1,
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          backgroundColor: '#0f172a',
          border: '1px solid var(--accent-red)',
          borderRadius: '4px',
          color: '#ffffff',
          fontFamily: 'var(--font-display)',
          fontSize: '0.88rem',
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        <span style={{ fontSize: '1rem' }}>💬</span>
        <span>TEXT</span>
      </a>

      {/* Book Online Button */}
      <Link
        href={quoteUrl}
        className="sticky-action-btn"
        aria-label="Book or request dumpster availability online"
        onClick={() => trackBookOnlineClick('mobile_sticky_bar')}
        style={{
          flex: 1.2,
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          backgroundColor: 'var(--accent-red)',
          borderRadius: '4px',
          color: '#ffffff',
          fontFamily: 'var(--font-display)',
          fontSize: '0.88rem',
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        <Calendar size={15} />
        <span>GET QUOTE</span>
      </Link>
    </nav>
  );
};
