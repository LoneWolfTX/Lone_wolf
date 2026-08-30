'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ChevronDown, Calendar, ArrowRight } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';
import { trackPhoneClick, trackBookOnlineClick } from '@/lib/tracking';

import { useSiteContent } from '@/lib/useEditableContent';
import { formatCurrency, formatPhoneNumber } from '@/lib/formatters';

export const SiteHeader: React.FC = () => {
  const { content } = useSiteContent();
  const pr = content.pricing;
  const phone = content.business?.phone || content.contact?.phone || '(214) 876-0321';
  const phoneRaw = content.business?.phoneRaw || content.contact?.phoneRaw || '+12148760321';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dumpsterDropdownOpen, setDumpsterDropdownOpen] = useState(false);
  const [areasDropdownOpen, setAreasDropdownOpen] = useState(false);
  const [mobileDumpstersExpanded, setMobileDumpstersExpanded] = useState(false);
  const [mobileAreasExpanded, setMobileAreasExpanded] = useState(false);

  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const dumpsterLinks = [
    { label: 'Residential Dumpsters', href: '/dumpster-rentals/residential' },
    { label: 'Contractor Dumpsters', href: '/dumpster-rentals/contractor' },
    { label: 'Commercial Dumpsters', href: '/dumpster-rentals/commercial' },
    { label: `15 Yard Dumpster (${formatCurrency(pr.fifteenYard)})`, href: '/dumpster-rentals/15-yard' },
    { label: `20 Yard Dumpster (${formatCurrency(pr.twentyYard)})`, href: '/dumpster-rentals/20-yard' },
    { label: `25 Yard Dumpster (${formatCurrency(pr.twentyFiveYard)})`, href: '/dumpster-rentals/25-yard' },
  ];

  const serviceAreaLinks = [
    { label: 'All DFW Service Areas', href: '/service-areas' },
    { label: 'Dallas, TX', href: '/service-areas/dallas' },
    { label: 'Fort Worth, TX', href: '/service-areas/fort-worth' },
    { label: 'Arlington, TX', href: '/service-areas/arlington' },
    { label: 'Keller, TX', href: '/service-areas/keller' },
    { label: 'Southlake, TX', href: '/service-areas/southlake' },
    { label: 'Grapevine, TX', href: '/service-areas/grapevine' },
  ];

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setDumpsterDropdownOpen(false);
    setAreasDropdownOpen(false);
    setMobileDumpstersExpanded(false);
    setMobileAreasExpanded(false);
  };

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: '#000000',
        borderBottom: '1px solid #1e293b',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
      }}
    >
      <div className="container">
        <div className="site-header-inner">
          {/* Logo on Left - High Visibility Responsive Branding */}
          <Link
            href="/"
            className="header-logo-link"
            onClick={closeMenu}
          >
            <div className="header-logo-icon">
              <Image
                src="/images/lone-wolf/logo.png"
                alt="Lone Wolf Dumpsters Logo"
                fill
                priority
                sizes="(max-width: 768px) 54px, 96px"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div>
              <span className="header-logo-text">
                LONE WOLF <span style={{ color: 'var(--accent-red)' }}>DUMPSTERS</span>
              </span>
              <span className="header-logo-tagline">
                RENT. RELAX. WE HAUL.
              </span>
            </div>
          </Link>

          <nav
            className="nav-desktop-only"
            aria-label="Main Navigation"
          >
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.92rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                color: '#ffffff',
                textDecoration: 'none',
                textTransform: 'uppercase',
                padding: '6px 0',
                whiteSpace: 'nowrap',
                borderBottom: isActive('/') ? '2px solid var(--accent-red)' : '2px solid transparent',
              }}
            >
              HOME
            </Link>

            {/* Dumpster Rentals Dropdown */}
            <div
              style={{ position: 'relative', whiteSpace: 'nowrap' }}
              onMouseEnter={() => setDumpsterDropdownOpen(true)}
              onMouseLeave={() => setDumpsterDropdownOpen(false)}
            >
              <Link
                href="/dumpster-rentals"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 0',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  borderBottom: isActive('/dumpster-rentals') ? '2px solid var(--accent-red)' : '2px solid transparent',
                }}
              >
                <span>DUMPSTER RENTALS</span>
                <ChevronDown size={13} className={dumpsterDropdownOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </Link>

              {dumpsterDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: '#0a0d12',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    padding: '6px 0',
                    minWidth: '270px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                  }}
                >
                  {dumpsterLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setDumpsterDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '9px 16px',
                        color: '#cbd5e1',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1e293b';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#cbd5e1';
                      }}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Service Areas Dropdown */}
            <div
              style={{ position: 'relative', whiteSpace: 'nowrap' }}
              onMouseEnter={() => setAreasDropdownOpen(true)}
              onMouseLeave={() => setAreasDropdownOpen(false)}
            >
              <Link
                href="/service-areas"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 0',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  borderBottom: isActive('/service-areas') ? '2px solid var(--accent-red)' : '2px solid transparent',
                }}
              >
                <span>AREAS SERVED</span>
                <ChevronDown size={13} className={areasDropdownOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </Link>

              {areasDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: '#0a0d12',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    padding: '6px 0',
                    minWidth: '220px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                  }}
                >
                  {serviceAreaLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setAreasDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '9px 16px',
                        color: '#cbd5e1',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1e293b';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#cbd5e1';
                      }}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.92rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                color: '#ffffff',
                textDecoration: 'none',
                textTransform: 'uppercase',
                padding: '6px 0',
                whiteSpace: 'nowrap',
                borderBottom: isActive('/about') ? '2px solid var(--accent-red)' : '2px solid transparent',
              }}
            >
              ABOUT
            </Link>

            <Link
              href="/blog"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.92rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                color: '#ffffff',
                textDecoration: 'none',
                textTransform: 'uppercase',
                padding: '6px 0',
                whiteSpace: 'nowrap',
                borderBottom: isActive('/blog') ? '2px solid var(--accent-red)' : '2px solid transparent',
              }}
            >
              GUIDES
            </Link>

            <Link
              href="/contact"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.92rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                color: '#ffffff',
                textDecoration: 'none',
                textTransform: 'uppercase',
                padding: '6px 0',
                whiteSpace: 'nowrap',
                borderBottom: isActive('/contact') ? '2px solid var(--accent-red)' : '2px solid transparent',
              }}
            >
              CONTACT
            </Link>
          </nav>

          <div className="header-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Phone */}
            <a
              href={`tel:${siteSettings.contact.phoneRaw}`}
              className="nav-desktop-only header-phone-link"
              onClick={() => trackPhoneClick('header_phone')}
              style={{
                alignItems: 'center',
                gap: '6px',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
              }}
            >
              <Phone size={15} color="var(--accent-red)" />
              <span>{siteSettings.contact.phone}</span>
            </a>

            {/* Red Get a Quote Button */}
            <Link
              href="/contact"
              className="header-book-btn"
              onClick={() => trackBookOnlineClick('header_button')}
            >
              <Calendar size={14} />
              <span>GET A QUOTE</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                color: '#ffffff',
                padding: '6px',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#0a0d12',
            borderTop: '1px solid #1e293b',
            borderBottom: '2px solid var(--accent-red)',
            padding: '16px 20px',
            maxHeight: 'calc(100vh - 70px)',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            
            <Link
              href="/"
              onClick={closeMenu}
              style={{
                padding: '10px 0',
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                borderBottom: '1px solid #1e293b',
              }}
            >
              HOME
            </Link>

            {/* Mobile Dumpsters Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileDumpstersExpanded(!mobileDumpstersExpanded)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  color: '#ffffff',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #1e293b',
                }}
              >
                <span>DUMPSTER RENTALS</span>
                <ChevronDown size={18} className={mobileDumpstersExpanded ? 'rotate-180 transition-transform text-accent' : 'transition-transform'} />
              </button>

              {mobileDumpstersExpanded && (
                <div style={{ paddingLeft: '14px', backgroundColor: '#111622', borderRadius: '4px', margin: '6px 0' }}>
                  {dumpsterLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={closeMenu}
                      style={{
                        display: 'block',
                        padding: '10px 0',
                        color: '#cbd5e1',
                        fontSize: '0.92rem',
                        borderBottom: '1px solid #1e293b',
                      }}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/service-areas"
              onClick={closeMenu}
              style={{
                padding: '10px 0',
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                borderBottom: '1px solid #1e293b',
              }}
            >
              AREAS SERVED
            </Link>

            <Link
              href="/about"
              onClick={closeMenu}
              style={{
                padding: '10px 0',
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                borderBottom: '1px solid #1e293b',
              }}
            >
              ABOUT
            </Link>

            <Link
              href="/blog"
              onClick={closeMenu}
              style={{
                padding: '10px 0',
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                borderBottom: '1px solid #1e293b',
              }}
            >
              GUIDES
            </Link>

            <Link
              href="/contact"
              onClick={closeMenu}
              style={{
                padding: '10px 0',
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                borderBottom: '1px solid #1e293b',
              }}
            >
              CONTACT
            </Link>

            {/* Mobile Call Wayne Button */}
            <a
              href={`tel:${siteSettings.contact.phoneRaw}`}
              onClick={() => trackPhoneClick('mobile_nav_phone')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#1e293b',
                color: '#ffffff',
                borderRadius: '4px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Phone size={18} color="var(--accent-red)" />
              <span>CALL {siteSettings.contact.phone}</span>
            </a>

          </div>
        </div>
      )}
    </header>
  );
};
