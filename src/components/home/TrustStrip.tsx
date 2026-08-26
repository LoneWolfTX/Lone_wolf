import React from 'react';
import { Truck, CircleDollarSign, ShieldCheck, HardHat } from 'lucide-react';

interface TrustItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  isBlue?: boolean;
}

export const TrustStrip: React.FC = () => {
  const trustItems: TrustItem[] = [
    {
      icon: <Truck size={20} />,
      title: 'SAME-DAY DELIVERY',
      description: 'Fast DFW dispatch directly to your job site or home',
    },
    {
      icon: <CircleDollarSign size={20} />,
      title: 'UPFRONT PRICING',
      description: 'Clear flat rates with no hidden fees or fuel surprises',
      isBlue: true,
    },
    {
      icon: <ShieldCheck size={20} />,
      title: 'LOCALLY OWNED',
      description: 'DFW family operated with direct owner accountability',
    },
    {
      icon: <HardHat size={20} />,
      title: 'RESIDENTIAL & CONTRACTOR',
      description: 'Driveway-safe wood placement & heavy construction capacity',
      isBlue: true,
    },
  ];

  return (
    <section className="trust-strip-section" aria-label="Key Contractor & Service Benefits">
      <div className="container">
        <div className="trust-grid">
          {trustItems.map((item) => (
            <div key={item.title} className="trust-card">
              <div className={item.isBlue ? 'trust-icon-box blue-accent' : 'trust-icon-box'}>
                {item.icon}
              </div>
              <div>
                <div className="trust-title">{item.title}</div>
                <div className="trust-desc">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
