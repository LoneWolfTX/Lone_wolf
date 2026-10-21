'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ChevronDown, ArrowRight } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';
import { trackPhoneClick, trackBookOnlineClick } from '@/lib/tracking';
import { useSiteContent } from '@/lib/useEditableContent';
import { formatCurrency } from '@/lib/formatters';

export const SiteHeader: React.FC = () => {
  const { content } = useSiteContent();
  const pr = content.pricing;
  const phone = content.business?.phone || content.contact?.phone || '(214) 876-8321';
  const phoneRaw = content.business?.phoneRaw || content.contact?.phoneRaw || '+12148768321';

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
        backgroundColor: 'rgba(7, 9, 13, 0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.7)',
        width: '100%',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '76px',
            gap: '16px',
          }}
        >
          {/* Left: Wolf Ridge Logo + Service Area Tagline */}
          <Link
            href="/"
            onClick={closeMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            {/* Mountain Wolf Icon */}
            <div
              style={{
                position: 'relative',
                width: '64px',
                height: '26px',
                flexShrink: 0,
              }}
            >
              <Image
                src="/images/wolf-ridge/mountain_wolf_icon.png"
                alt="Wolf Ridge Dumpsters Mountain Logo"
                fill
                priority
                sizes="64px"
                style={{ objectFit: 'contain' }}
              />
            </div>

            {/* Brand Text Stack */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.12rem, 1.6vw, 1.35rem)',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                  lineHeight: 1.05,
                  textTransform: 'uppercase',
                }}
              >
                WOLF RIDGE <span style={{ color: '#ED171F' }}>DUMPSTERS</span>
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  fontWeight: 600,
                  marginTop: '2px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                DALLAS • FORT WORTH • SURROUNDING CITIES
              </span>
            </div>
          </Link>

          {/* Center Navigation (Desktop Only) */}
          <nav
            className="nav-desktop-only"
            aria-label="Main Navigation"
            style={{
              alignItems: 'center',
              gap: 'clamp(14px, 1.8vw, 24px)',
            }}
          >
            {/* HOME */}
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: '#ffffff',
                textDecoration: 'none',
                textTransform: 'uppercase',
                padding: '8px 0',
                whiteSpace: 'nowrap',
                borderBottom: isActive('/') ? '2px solid #ED171F' : '2px solid transparent',
                transition: 'border-color 0.15s ease, color 0.15s ease',
              }}
            >
              HOME
            </Link>

            {/* DUMPSTER RENTALS Dropdown */}
            <div
              style={{ position: 'relative', whiteSpace: 'nowrap' }}
              onMouseEnter={() => setDumpsterDropdownOpen(true)}
              onMouseLeave={() => setDumpsterDropdownOpen(false)}
              onFocus={() => setDumpsterDropdownOpen(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDumpsterDropdownOpen(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setDumpsterDropdownOpen(false);
              }}
            >
              <Link
                href="/dumpster-rentals"
                aria-haspopup="true"
                aria-expanded={dumpsterDropdownOpen}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 0',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  borderBottom: isActive('/dumpster-rentals') ? '2px solid #ED171F' : '2px solid transparent',
                  transition: 'border-color 0.15s ease, color 0.15s ease',
                }}
              >
                <span>DUMPSTER RENTALS</span>
                <ChevronDown size={13} className={dumpsterDropdownOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </Link>

              {dumpsterDropdownOpen && (
                <div
                  role="menu"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: '#0a0d14',
                    border: '1px solid #202a3c',
                    borderRadius: '4px',
                    padding: '6px 0',
                    minWidth: '270px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
                    zIndex: 100,
                  }}
                >
                  {dumpsterLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      role="menuitem"
                      onClick={() => setDumpsterDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 18px',
                        color: '#cbd5e1',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#161f30';
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

            {/* AREAS SERVED Dropdown */}
            <div
              style={{ position: 'relative', whiteSpace: 'nowrap' }}
              onMouseEnter={() => setAreasDropdownOpen(true)}
              onMouseLeave={() => setAreasDropdownOpen(false)}
              onFocus={() => setAreasDropdownOpen(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setAreasDropdownOpen(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setAreasDropdownOpen(false);
              }}
            >
              <Link
                href="/service-areas"
                aria-haspopup="true"
                aria-expanded={areasDropdownOpen}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 0',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  borderBottom: isActive('/service-areas') ? '2px solid #ED171F' : '2px solid transparent',
                  transition: 'border-color 0.15s ease, color 0.15s ease',
                }}
              >
                <span>AREAS SERVED</span>
                <ChevronDown size={13} className={areasDropdownOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </Link>

              {areasDropdownOpen && (
                <div
                  role="menu"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: '#0a0d14',
                    border: '1px solid #202a3c',
                    borderRadius: '4px',
                    padding: '6px 0',
                    minWidth: '220px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
                    zIndex: 100,
                  }}
                >
                  {serviceAreaLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      role="menuitem"
                      onClick={() => setAreasDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 18px',
                        color: '#cbd5e1',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#161f30';
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

            {/* ABOUT */}
            <Link
              href="/about"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: '#ffffff',
                textDecoration: 'none',
                textTransform: 'uppercase',
                padding: '8px 0',
                whiteSpace: 'nowrap',
                borderBottom: isActive('/about') ? '2px solid #ED171F' : '2px solid transparent',
                transition: 'border-color 0.15s ease, color 0.15s ease',
              }}
            >
              ABOUT
            </Link>

            {/* RESOURCES (Guides) */}
            <Link
              href="/blog"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: '#ffffff',
                textDecoration: 'none',
                textTransform: 'uppercase',
                padding: '8px 0',
                whiteSpace: 'nowrap',
                borderBottom: isActive('/blog') ? '2px solid #ED171F' : '2px solid transparent',
                transition: 'border-color 0.15s ease, color 0.15s ease',
              }}
            >
              RESOURCES
            </Link>

            {/* CONTACT */}
            <Link
              href="/contact"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: '#ffffff',
                textDecoration: 'none',
                textTransform: 'uppercase',
                padding: '8px 0',
                whiteSpace: 'nowrap',
                borderBottom: isActive('/contact') ? '2px solid #ED171F' : '2px solid transparent',
                transition: 'border-color 0.15s ease, color 0.15s ease',
              }}
            >
              CONTACT
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0,
            }}
          >
            {/* Outlined Phone Pill Button */}
            <a
              href={`tel:${phoneRaw}`}
              onClick={() => trackPhoneClick('header_phone_button')}
              className="header-phone-action"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'rgba(15, 20, 28, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '4px',
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: '0.88rem',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Phone size={14} color="#ED171F" strokeWidth={2.4} />
              <span>{phone}</span>
            </a>

            {/* Vivid Red GET A QUOTE Button */}
            <a
              href="#quote"
              onClick={() => trackBookOnlineClick('header_quote_button')}
              className="header-quote-action"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                backgroundColor: '#ED171F',
                borderRadius: '4px',
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '0.9rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 14px rgba(237, 23, 31, 0.4)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span>GET A QUOTE</span>
              <ArrowRight size={14} strokeWidth={2.4} />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                color: '#ffffff',
                padding: '8px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#161f30',
                border: '1px solid #28374f',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#07090D',
            borderTop: '1px solid #1e293b',
            borderBottom: '2px solid #ED171F',
            padding: '16px 20px 24px',
            maxHeight: 'calc(100vh - 76px)',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Quick Actions in Mobile Drawer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
              <a
                href="#quote"
                onClick={closeMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#ED171F',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                <span>GET A QUOTE</span>
                <ArrowRight size={16} />
              </a>

              <a
                href={`tel:${phoneRaw}`}
                onClick={() => trackPhoneClick('mobile_nav_phone')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#121824',
                  border: '1px solid #243044',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                }}
              >
                <Phone size={16} color="#ED171F" />
                <span>CALL OR TEXT {phone}</span>
              </a>
            </div>

            {/* Links List */}
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
                borderBottom: '1px solid #1a2230',
                textDecoration: 'none',
              }}
            >
              HOME
            </Link>

            {/* Dumpster Rentals Accordion */}
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
                  borderBottom: '1px solid #1a2230',
                  background: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>DUMPSTER RENTALS</span>
                <ChevronDown size={18} className={mobileDumpstersExpanded ? 'rotate-180 transition-transform text-accent' : 'transition-transform'} />
              </button>

              {mobileDumpstersExpanded && (
                <div style={{ paddingLeft: '14px', backgroundColor: '#0d131f', borderRadius: '4px', margin: '6px 0' }}>
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
                        borderBottom: '1px solid #1a2230',
                        textDecoration: 'none',
                      }}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Areas Served Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileAreasExpanded(!mobileAreasExpanded)}
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
                  borderBottom: '1px solid #1a2230',
                  background: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>AREAS SERVED</span>
                <ChevronDown size={18} className={mobileAreasExpanded ? 'rotate-180 transition-transform text-accent' : 'transition-transform'} />
              </button>

              {mobileAreasExpanded && (
                <div style={{ paddingLeft: '14px', backgroundColor: '#0d131f', borderRadius: '4px', margin: '6px 0' }}>
                  {serviceAreaLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={closeMenu}
                      style={{
                        display: 'block',
                        padding: '10px 0',
                        color: '#cbd5e1',
                        fontSize: '0.92rem',
                        borderBottom: '1px solid #1a2230',
                        textDecoration: 'none',
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
              onClick={closeMenu}
              style={{
                padding: '10px 0',
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                borderBottom: '1px solid #1a2230',
                textDecoration: 'none',
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
                borderBottom: '1px solid #1a2230',
                textDecoration: 'none',
              }}
            >
              RESOURCES
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
                borderBottom: '1px solid #1a2230',
                textDecoration: 'none',
              }}
            >
              CONTACT
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
