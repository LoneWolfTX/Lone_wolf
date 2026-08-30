'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openLeftIdx, setOpenLeftIdx] = useState<number | null>(0); // First open by default
  const [openRightIdx, setOpenRightIdx] = useState<number | null>(null);

  const leftFaqs = [
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

  const rightFaqs = [
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

  return (
    <section id="faq" style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '36px 0 28px 0', borderBottom: '1px solid #e2e8f0' }} aria-labelledby="faq-heading">
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 id="faq-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.4vw, 2.4rem)', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
              RENTAL GUIDELINES &amp; POLICIES
            </h2>
          </div>

          <Link
            href="/faq"
            style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            ALL FAQS &amp; SIZING GUIDES &rarr;
          </Link>
        </div>

        {/* 2-Column FAQ Accordion */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {leftFaqs.map((faq, idx) => {
              const isOpen = openLeftIdx === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenLeftIdx(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#0f172a',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} className="text-accent" /> : <ChevronDown size={16} />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 16px 13px 16px', fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {rightFaqs.map((faq, idx) => {
              const isOpen = openRightIdx === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenRightIdx(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#0f172a',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} className="text-accent" /> : <ChevronDown size={16} />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 16px 13px 16px', fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
