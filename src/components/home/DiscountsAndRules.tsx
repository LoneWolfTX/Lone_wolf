import React from 'react';
import { Tag, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { discounts } from '@/data/discounts';
import { rentalTerms } from '@/data/rentalTerms';

export const DiscountsAndRules: React.FC = () => {
  return (
    <section className="discounts-rules-section" aria-labelledby="discounts-rules-heading">
      <div className="container">
        <div className="discounts-rules-grid">
          {/* Column 1: Special Discounts */}
          <div className="discounts-box">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Tag size={16} className="text-accent" />
              <span className="badge badge-red">Community Rates</span>
            </div>

            <h2 id="discounts-rules-heading" className="discounts-title">
              Special <span className="text-accent">Discounts</span>
            </h2>

            <p className="discounts-desc">
              We proudly offer discounted dumpster rental rates for service members, first responders, and trade partners.
            </p>

            <div className="discounts-list">
              {discounts.map((disc) => (
                <div key={disc.id} className="discount-item-card">
                  <div className="discount-card-header">
                    <h3 className="discount-name">{disc.name}</h3>
                    <span className="badge badge-neutral">{disc.amount}</span>
                  </div>
                  <p className="discount-details">{disc.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Allowed vs Prohibited Materials */}
          <div className="rules-box">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <ShieldAlert size={16} className="text-accent" />
              <span className="badge badge-neutral">Loading Guidelines</span>
            </div>

            <h3 className="rules-title">Material Guidelines</h3>
            <p className="rules-desc">
              To comply with municipal landfill regulations and keep pricing transparent, please observe these guidelines:
            </p>

            <div className="materials-split">
              {/* Allowed Items */}
              <div className="materials-col allowed-col">
                <div className="materials-col-header text-success">
                  <CheckCircle size={16} />
                  <span>Accepted Items</span>
                </div>
                <ul className="materials-list">
                  {rentalTerms.allowedMaterials.map((item, idx) => (
                    <li key={idx} className="material-item">
                      <span className="material-bullet-green">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prohibited Items */}
              <div className="materials-col prohibited-col">
                <div className="materials-col-header text-accent">
                  <AlertTriangle size={16} />
                  <span>Prohibited Items</span>
                </div>
                <ul className="materials-list">
                  {rentalTerms.prohibitedMaterials.map((item, idx) => (
                    <li key={idx} className="material-item">
                      <span className="material-bullet-red">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
