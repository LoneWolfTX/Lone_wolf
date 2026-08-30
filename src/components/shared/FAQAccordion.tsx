'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSiteContent } from '@/lib/useEditableContent';
import { formatCurrency, formatTonnage, formatOverageRate, formatExtraDayRate, formatPhoneNumber } from '@/lib/formatters';

export interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  id?: string;
  tagline?: string;
  titleBlack?: string;
  titleRed?: string;
  subtitle?: string;
  faqs?: FAQItem[];
  leftFaqs?: FAQItem[];
  rightFaqs?: FAQItem[];
  showViewAllLink?: boolean;
  viewAllHref?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  id = 'faq-accordion',
  tagline = 'FREQUENTLY ASKED',
  titleBlack = 'QUESTIONS',
  titleRed,
  subtitle,
  faqs,
  leftFaqs: customLeft,
  rightFaqs: customRight,
  showViewAllLink = true,
  viewAllHref = '/faq',
}) => {
  const { content } = useSiteContent();
  const pr = content.pricing;
  const phone = formatPhoneNumber(content.business?.phone || content.contact?.phone);

  const [openLeftIdx, setOpenLeftIdx] = useState<number | null>(null);
  const [openRightIdx, setOpenRightIdx] = useState<number | null>(null);

  const defaultLeft: FAQItem[] = [
    {
      q: 'How does dumpster rental work with Lone Wolf Dumpsters?',
      a: 'Renting a dumpster with Lone Wolf Dumpsters is simple. Choose the dumpster size that fits your project, select your delivery date, and provide a suitable placement location. We deliver the dumpster to your property, you fill it with approved materials, and we pick it up when you’re finished. Our goal is to make dumpster rental convenient, straightforward, and hassle-free.',
    },
    {
      q: 'How long can I rent a dumpster?',
      a: 'We offer flexible dumpster rental periods. Our standard rental periods are up to 3, 5, or 7 days, and additional days are available for $20 per day. If you finish your project early, simply call or text us to schedule pickup, which will end your rental period.',
    },
    {
      q: 'Do I need to be home for delivery?',
      a: 'It is recommended that someone be present for delivery. If you cannot be there, please designate someone to meet the driver, or send us a photo with clear instructions showing exactly where you want the dumpster placed.',
    },
  ];

  const defaultRight: FAQItem[] = [
    {
      q: 'What if I need more time?',
      a: 'We are flexible and will do our best to accommodate your needs, depending on availability. Additional days are $20 per day and must be confirmed with us in advance by phone or text. Standard rentals can be extended up to 10 days. If you need the dumpster for 2–3 weeks or longer, please contact us to discuss availability and pricing.',
    },
    {
      q: 'What areas does Lone Wolf Dumpsters serve?',
      a: 'Lone Wolf Dumpsters provides dumpster rental services in Dallas, Fort Worth, Arlington, Grand Prairie, Lewisville, Euless, Keller, Irving, Bedford, Hurst, and surrounding areas throughout the DFW Metroplex. Service availability may vary by location, so please check our Service Areas page for the communities we currently serve.',
    },
    {
      q: 'How fast can I get a dumpster delivered?',
      a: 'Same-day and next-day dumpster delivery is available throughout most of Dallas, Tarrant, and Denton Counties, depending on availability. For immediate availability and delivery confirmation, call or text us at 214-876-0321.',
    },
  ];

  const leftList = customLeft || (faqs ? faqs.slice(0, Math.ceil(faqs.length / 2)) : defaultLeft);
  const rightList = customRight || (faqs ? faqs.slice(Math.ceil(faqs.length / 2)) : defaultRight);

  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        padding: '52px 0 44px 0',
        borderBottom: '1px solid #e2e8f0',
      }}
      aria-labelledby={headingId}
    >
      <div className="container">
        
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            {tagline && (
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: 'var(--accent-red)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'block',
                  marginBottom: '2px',
                }}
              >
                {tagline}
              </span>
            )}
            <h2
              id={headingId}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.9rem, 3.6vw, 2.5rem)',
                fontWeight: 800,
                color: '#0f172a',
                textTransform: 'uppercase',
                margin: 0,
                letterSpacing: '0.02em',
              }}
            >
              {titleBlack} {titleRed && <span style={{ color: 'var(--accent-red)' }}>{titleRed}</span>}
            </h2>
            {subtitle && (
              <p style={{ fontSize: '0.92rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                {subtitle}
              </p>
            )}
          </div>

          {showViewAllLink && (
            <Link
              href={viewAllHref}
              style={{
                fontSize: '0.84rem',
                fontWeight: 800,
                color: 'var(--accent-red)',
                textTransform: 'uppercase',
                textDecoration: 'none',
                letterSpacing: '0.5px',
              }}
            >
              VIEW ALL FAQS →
            </Link>
          )}
        </div>

        {/* 2-Column Accordion */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {leftList.map((item, idx) => {
              const isOpen = openLeftIdx === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenLeftIdx(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.94rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      lineHeight: 1.35,
                    }}
                  >
                    <span>{item.q}</span>
                    <span style={{ color: 'var(--accent-red)', marginLeft: '12px', flexShrink: 0 }}>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>

                  <div
                    style={{
                      display: isOpen ? 'block' : 'none',
                      padding: '0 18px 16px 18px',
                      fontSize: '0.88rem',
                      color: '#475569',
                      lineHeight: 1.5,
                      borderTop: '1px solid #e2e8f0',
                      marginTop: '4px',
                      paddingTop: '12px',
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rightList.map((item, idx) => {
              const isOpen = openRightIdx === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenRightIdx(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.94rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      lineHeight: 1.35,
                    }}
                  >
                    <span>{item.q}</span>
                    <span style={{ color: 'var(--accent-red)', marginLeft: '12px', flexShrink: 0 }}>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>

                  <div
                    style={{
                      display: isOpen ? 'block' : 'none',
                      padding: '0 18px 16px 18px',
                      fontSize: '0.88rem',
                      color: '#475569',
                      lineHeight: 1.5,
                      borderTop: '1px solid #e2e8f0',
                      marginTop: '4px',
                      paddingTop: '12px',
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
