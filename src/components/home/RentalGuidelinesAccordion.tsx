'use client';

import React, { useState } from 'react';
import { ChevronDown, CheckCircle, XCircle, Scale, Calendar, ShieldCheck } from 'lucide-react';

interface GuidelineItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const RentalGuidelinesAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const guidelines: GuidelineItem[] = [
    {
      id: 'allowed-items',
      title: 'What can I throw away in the dumpster?',
      icon: <CheckCircle size={18} className="text-success" />,
      content: (
        <div>
          <p style={{ marginBottom: '8px' }}>
            Our roll-off containers accept most standard household, remodel, and construction debris:
          </p>
          <ul style={{ paddingLeft: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6px' }}>
            <li>Drywall &amp; Sheetrock</li>
            <li>Wood Framing &amp; Plywood</li>
            <li>Kitchen &amp; Bath Cabinetry</li>
            <li>Flooring (Tile, Carpet, Wood)</li>
            <li>Cardboard &amp; Packaging</li>
            <li>Furniture &amp; Mattresses</li>
            <li>Yard Debris &amp; Brush</li>
            <li>General Household Clutter</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'prohibited-items',
      title: 'What items are NOT allowed?',
      icon: <XCircle size={18} className="text-accent" />,
      content: (
        <div>
          <p style={{ marginBottom: '8px' }}>
            Per Texas landfill and environmental transfer regulations, hazardous materials are strictly prohibited:
          </p>
          <ul style={{ paddingLeft: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6px' }}>
            <li>Wet Paint &amp; Liquid Chemicals</li>
            <li>Automotive Fluids &amp; Oils</li>
            <li>Vehicle Tires</li>
            <li>Lead-Acid Batteries</li>
            <li>Asbestos Containing Materials</li>
            <li>AC Units</li>
            <li>Refrigerators containing Freon – Ask First</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'weight-limits',
      title: 'Weight limits & overage fees',
      icon: <Scale size={18} className="text-accent" />,
      content: (
        <div>
          <p style={{ marginBottom: '6px' }}>
            Every rental comes with generous weight allowances included in your flat rate:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '8px' }}>
            <li><strong>15 Yard:</strong> 2 Tons (4,000 lbs) included</li>
            <li><strong>20 Yard:</strong> 2.5 Tons (5,000 lbs) included</li>
            <li><strong>25 Yard:</strong> 3 Tons (6,000 lbs) included</li>
          </ul>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              If you exceed your tonnage limit, overage is billed at <strong>$80 / ton</strong> based on verified landfill scale weight tickets and rental terms.
          </p>
        </div>
      ),
    },
    {
      id: 'rental-period',
      title: 'Rental duration & keeping the dumpster longer',
      icon: <Calendar size={18} className="text-accent" />,
      content: (
        <div>
          <p style={{ marginBottom: '6px' }}>
            Standard rental includes up to <strong>1 to 7 full days</strong>.
          </p>
          <p style={{ fontSize: '0.88rem' }}>
            Need extra time? No problem! Just call or text us. Additional days are only <strong>$15 / day</strong>.
          </p>
        </div>
      ),
    },
    {
      id: 'driveway-placement',
      title: 'Driveway surface protection & drop-off placement',
      icon: <ShieldCheck size={18} className="text-accent" />,
      content: (
        <div>
          <p style={{ marginBottom: '6px' }}>
            We place heavy protective wood planks under the container rollers to protect your concrete or asphalt driveway from scratches or cracking.
          </p>
          <p style={{ fontSize: '0.88rem' }}>
            Please ensure vehicles are moved and there is at least 50–60 feet of clear straight approach for our delivery truck.
          </p>
        </div>
      ),
    },
  ];

  return (
    <section className="rental-guidelines-section" style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '56px 0', borderBottom: '1px solid #e2e8f0' }} aria-labelledby="guidelines-heading">
      <div className="container" style={{ maxWidth: '880px' }}>
        <div className="section-header" style={{ marginBottom: '28px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
            RENTAL GUIDELINES
          </span>
          <h2 id="guidelines-heading" className="section-title" style={{ color: '#0f172a' }}>
            WHAT YOU CAN &amp; CANNOT <span className="text-accent">THROW AWAY</span>
          </h2>
          <p className="section-subtitle" style={{ color: '#64748b' }}>
            Quick reference on accepted materials, weight limits, and driveway placement.
          </p>
        </div>

        <div className="faq-accordion-container">
          {guidelines.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="faq-question-btn"
                  aria-expanded={isOpen}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.icon}
                    <span className="faq-question-text">{item.title}</span>
                  </span>
                  <ChevronDown size={20} className={`faq-chevron ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="faq-answer-body">
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
