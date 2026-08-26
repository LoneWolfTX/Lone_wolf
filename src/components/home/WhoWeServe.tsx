import React from 'react';
import { Home, Building2, Wrench, Building, Landmark } from 'lucide-react';

export const WhoWeServe: React.FC = () => {
  const audiences = [
    {
      icon: <Home size={28} />,
      title: 'RESIDENTIAL',
      desc: 'Homeowners, renters & DIY projects',
    },
    {
      icon: <Building2 size={28} />,
      title: 'BUSINESSES',
      desc: 'Offices, retail stores & commercial properties',
    },
    {
      icon: <Wrench size={28} />,
      title: 'CONTRACTORS',
      desc: 'Construction, roofing, remodeling & more',
    },
    {
      icon: <Building size={28} />,
      title: 'PROPERTY MANAGERS',
      desc: 'Apartment complexes & rental properties',
    },
    {
      icon: <Landmark size={28} />,
      title: 'MUNICIPALITIES',
      desc: 'Parks, schools & public works',
    },
  ];

  return (
    <section style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }} aria-labelledby="who-we-serve-heading">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
            WHO WE SERVE
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '24px',
            textAlign: 'center',
          }}
        >
          {audiences.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                {item.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '4px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
