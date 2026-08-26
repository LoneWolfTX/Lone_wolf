import React from 'react';
import Link from 'next/link';
import { Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const SecondaryJunkRemoval: React.FC = () => {
  return (
    <section className="secondary-junk-section" aria-labelledby="secondary-junk-heading">
      <div className="container">
        <div className="secondary-junk-card">
          <div className="secondary-junk-info">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Truck size={16} className="text-accent" />
              <span className="badge badge-neutral">Secondary Add-On Service</span>
            </div>
            <h3 id="secondary-junk-heading" className="secondary-junk-title">
              Need More Than a Dumpster?
            </h3>
            <p className="secondary-junk-desc">
              We also offer full-service junk removal for customers who need the heavy loading, carrying, and hauling handled for them. Starting at $150.
            </p>
          </div>

          <div>
            <Button href="/junk-removal" variant="outline" size="sm">
              <span>Learn About Junk Removal</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
