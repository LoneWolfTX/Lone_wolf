import React from 'react';
import { ShieldCheck, CircleDollarSign, Truck, Star, HardHat, Award } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: <ShieldCheck size={28} />,
      title: 'LOCAL &\nLOCALLY OWNED',
      desc: "We're a local business that cares about our community.",
    },
    {
      icon: <CircleDollarSign size={28} />,
      title: 'TRANSPARENT\nPRICING',
      desc: 'Transparent pricing with clear weight allowances and straightforward terms.',
    },
    {
      icon: <Truck size={28} />,
      title: 'RELIABLE &\nON TIME',
      desc: 'We strive to provide reliable, on-time delivery and scheduling across DFW.',
    },
    {
      icon: <Star size={28} />,
      title: 'GREAT\nREVIEWS',
      desc: 'Our customers love our service and it shows.',
    },
    {
      icon: <Award size={28} />,
      title: 'SAFETY &\nPROFESSIONALISM',
      desc: 'We treat your property with respect and care.',
    },
  ];

  return (
    <section className="why-choose-section" style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '60px 0 52px 0', borderBottom: '1px solid #e2e8f0' }} aria-labelledby="why-choose-heading">
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
            WHY CHOOSE
          </span>
          <h2 id="why-choose-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.7rem)', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
            <span style={{ color: 'var(--accent-red)' }}>LONE WOLF</span> DUMPSTERS
          </h2>
        </div>

        {/* 5 Icons Row matching reference mockup */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '24px',
            textAlign: 'center',
          }}
        >
          {reasons.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '2px solid #0f172a',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                {item.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', lineHeight: 1.2, whiteSpace: 'pre-line', marginBottom: '6px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: '1.45' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
