'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openLeftIdx, setOpenLeftIdx] = useState<number | null>(0); // First open by default
  const [openRightIdx, setOpenRightIdx] = useState<number | null>(null);

  const leftFaqs = [
    {
      q: 'How much does dumpster rental cost in DFW?',
      a: 'Our flat rates are: 15-Yard ($385, 1.5t included), 20-Yard ($425, 2.0t included), and 25-Yard ($475, 2.2t included). Prices include delivery, pickup, driveway wood protection, and 3, 5, or 7 days rental time.',
    },
    {
      q: 'What items are prohibited from dumpsters?',
      a: 'Concrete, dirt, rock, brick, wet paint, stains, solvents, gasoline, oil, flammable liquids, chemicals, hazardous materials, tires, lead-acid batteries, propane tanks, asbestos, and AC units are prohibited. Refrigerators containing Freon require prior approval. Household trash, construction debris, drywall, wood, and furniture are permitted.',
    },
    {
      q: 'What if I need the dumpster longer than planned?',
      a: 'Additional rental days are just $20/day. Simply call or text (214) 876-0321 before your scheduled pickup date to extend.',
    },
  ];

  const rightFaqs = [
    {
      q: 'How are weight overages handled?',
      a: 'Each container includes generous weight allowances (1.5 to 2.2 tons). Disposal weight exceeding your allowance is billed at a transparent $40 per 1,000 lbs ($80/ton) based on verified landfill weight tickets.',
    },
    {
      q: 'Do I need to be home for container delivery?',
      a: 'No. As long as the driveway has at least 10ft width and 14ft overhead clearance free of low branches, our driver will place the container on protective wood boards exactly where designated.',
    },
    {
      q: 'How quickly can you deliver in Dallas–Fort Worth?',
      a: 'Same-day and next-day delivery is available throughout most of DFW. Reserve online or call/text (214) 876-0321 for immediate dispatch confirmation.',
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
