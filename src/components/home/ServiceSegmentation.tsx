import React from 'react';
import { Home, HardHat, Building2, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Segment {
  id: string;
  icon: React.ReactNode;
  title: string;
  badge: string;
  description: string;
  idealFor: string[];
  ctaText: string;
  href: string;
}

export const ServiceSegmentation: React.FC = () => {
  const segments: Segment[] = [
    {
      id: 'residential',
      icon: <Home size={22} />,
      title: 'Residential Homeowners',
      badge: 'Homeowners & DIY',
      description: 'Compact roll-off containers delivered with driveway wood protection for safe property placement.',
      idealFor: ['Garage, attic & estate cleanouts', 'Kitchen & bathroom remodel debris', 'Flooring removal & yard waste cleanup'],
      ctaText: 'BOOK RESIDENTIAL',
      href: '#dumpsters',
    },
    {
      id: 'contractors',
      icon: <HardHat size={22} />,
      title: 'Contractors & Remodelers',
      badge: 'Job Sites & Trades',
      description: 'Dependable container swaps, timely drop-offs, and direct owner coordination for busy remodelers.',
      idealFor: ['Roofing tear-offs & shingle disposal', 'Drywall, framing & tile demolition', 'Multi-room renovation waste handling'],
      ctaText: 'BOOK CONTRACTOR',
      href: '#dumpsters',
    },
    {
      id: 'commercial',
      icon: <Building2 size={22} />,
      title: 'Commercial & Property Managers',
      badge: 'Property & Business',
      description: 'Heavy-capacity waste solutions for landlords, commercial clearouts, and office remodels.',
      idealFor: ['Office, retail & tenant clearouts', 'Property management cleanups', 'High-volume commercial construction debris'],
      ctaText: 'BOOK COMMERCIAL',
      href: '#dumpsters',
    },
  ];

  return (
    <section className="segmentation-section" aria-labelledby="segmentation-heading">
      <div className="container">
        <div className="section-header">
          <div className="patriotic-divider-mini">
            <span className="mini-line-red" />
            <span className="mini-star">★</span>
            <span className="mini-line-blue" />
          </div>
          <h2 id="segmentation-heading" className="section-title">
            Who Rents Our <span className="text-accent">Dumpsters?</span>
          </h2>
          <p className="section-subtitle">
            Tailored roll-off container solutions for homeowners, trade professionals, and commercial property managers across DFW.
          </p>
        </div>

        <div className="segmentation-grid">
          {segments.map((seg) => (
            <div key={seg.id} className="segment-card">
              <div className="segment-card-top">
                <div className="segment-icon-box">{seg.icon}</div>
                <span className="badge badge-neutral">{seg.badge}</span>
              </div>

              <h3 className="segment-title">{seg.title}</h3>
              <p className="segment-desc">{seg.description}</p>

              <div className="segment-divider" />

              <ul className="segment-list">
                {seg.idealFor.map((item, idx) => (
                  <li key={idx} className="segment-list-item">
                    <Check size={16} className="segment-check-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="segment-card-footer">
                <Button href={seg.href} variant="primary" size="md" fullWidth>
                  <span>{seg.ctaText}</span>
                  <ArrowRight size={15} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
