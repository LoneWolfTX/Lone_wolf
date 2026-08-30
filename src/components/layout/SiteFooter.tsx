'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { useSiteContent } from '@/lib/useEditableContent';
import { formatCurrency, formatPhoneNumber } from '@/lib/formatters';

export const SiteFooter: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const { content } = useSiteContent();
  const pr = content.pricing;
  const b = content.business || content.contact;
  const phone = formatPhoneNumber(b.phone);
  const phoneRaw = b.phoneRaw || '+12148760321';
  const email = b.email || 'lonewolfdumpsters@gmail.com';
  const yardAddress = b.yardAddress || 'DFW Metroplex, Texas, Colleyville, TX 76034';
  return (
    <footer style={{ backgroundColor: '#000000', color: '#ffffff', borderTop: '1px solid #1e293b' }}>
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '24px' }}>
        
        {/* Main 5-Column Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '28px',
            marginBottom: '28px',
          }}
        >
          {/* Column 1: Brand & Slogan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                <Image
                  src="/images/lone-wolf/logo.png"
                  alt="Lone Wolf Dumpsters Logo"
                  fill
                  sizes="48px"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
                  LONE WOLF
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-red)', lineHeight: 1 }}>
                  DUMPSTERS
                </span>
              </div>
            </Link>

            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
              Fast, affordable dumpster rentals across DFW. We deliver on time so you can stay on schedule.
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <a
                href="https://www.facebook.com/profile.php?id=61561726053896"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                }}
                aria-label="Lone Wolf Facebook Page"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/lonewolfdumpsters"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                }}
                aria-label="Lone Wolf Instagram Profile"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff', marginBottom: '14px', letterSpacing: '0.5px' }}>
              QUICK LINKS
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <li><Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link></li>
              <li><Link href="/dumpster-rentals" style={{ color: '#94a3b8', textDecoration: 'none' }}>Dumpster Rentals</Link></li>
              <li><Link href="/service-areas" style={{ color: '#94a3b8', textDecoration: 'none' }}>All Service Areas (48 DFW Cities)</Link></li>
              <li><Link href="/dumpster-rentals/contractor" style={{ color: '#94a3b8', textDecoration: 'none' }}>For Contractors</Link></li>
              <li><Link href="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About Us</Link></li>
              <li><Link href="/junk-removal" style={{ color: '#94a3b8', textDecoration: 'none' }}>Junk Removal</Link></li>
            </ul>
          </div>

          {/* Column 3: Dumpster Sizes */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff', marginBottom: '14px', letterSpacing: '0.5px' }}>
              DUMPSTER SIZES
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <li><Link href="/dumpster-rentals/15-yard" style={{ color: '#94a3b8', textDecoration: 'none' }}>15 Yard Dumpster ({formatCurrency(pr.fifteenYard)})</Link></li>
              <li><Link href="/dumpster-rentals/20-yard" style={{ color: '#94a3b8', textDecoration: 'none' }}>20 Yard Dumpster ({formatCurrency(pr.twentyYard)})</Link></li>
              <li><Link href="/dumpster-rentals/25-yard" style={{ color: '#94a3b8', textDecoration: 'none' }}>25 Yard Dumpster ({formatCurrency(pr.twentyFiveYard)})</Link></li>
              <li><Link href="/dumpster-rentals/residential" style={{ color: '#94a3b8', textDecoration: 'none' }}>Residential Rentals</Link></li>
              <li><Link href="/dumpster-rentals/commercial" style={{ color: '#94a3b8', textDecoration: 'none' }}>Commercial Rentals</Link></li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff', marginBottom: '14px', letterSpacing: '0.5px' }}>
              RESOURCES
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <li><Link href="/faq" style={{ color: '#94a3b8', textDecoration: 'none' }}>FAQ &amp; Sizing</Link></li>
              <li><Link href="/terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>Rental Terms &amp; Rules</Link></li>
              <li><Link href="/blog" style={{ color: '#94a3b8', textDecoration: 'none' }}>DFW Resource Guides</Link></li>
              <li><Link href="/contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff', marginBottom: '2px', letterSpacing: '0.5px' }}>
              CONTACT US
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#94a3b8' }}>
              <Phone size={15} className="text-accent" />
              <a href={`tel:${phoneRaw}`} style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}>
                {phone}
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#94a3b8' }}>
              <Mail size={15} className="text-accent" />
              <a href={`mailto:${email}`} style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {email}
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#94a3b8' }}>
              <MapPin size={15} className="text-accent" />
              <span>{yardAddress}</span>
            </div>

            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: 'var(--accent-red)',
                color: '#ffffff',
                borderRadius: '4px',
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                textDecoration: 'none',
                marginTop: '6px',
              }}
            >
              <Calendar size={16} />
              <span>GET A QUOTE</span>
            </Link>
          </div>

        </div>

        {/* Service Areas Invitation Strip */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '20px',
            paddingBottom: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={18} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.88rem', color: '#cbd5e1', fontWeight: 500 }}>
              Serving 48 cities across Dallas, Tarrant, and Denton Counties with direct, on-time roll-off dumpster delivery.
            </span>
          </div>
          <Link
            href="/service-areas"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-red)',
              fontSize: '0.88rem',
              fontWeight: 700,
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'opacity 0.15s ease',
            }}
          >
            <span>View All Service Areas &amp; Locations</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.82rem',
            color: '#94a3b8',
          }}
        >
          <div>
            &copy; 2026 Lone Wolf Dumpsters
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Link href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Privacy
            </Link>
            <span>·</span>
            <Link href="/terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
