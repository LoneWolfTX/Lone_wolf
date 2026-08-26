import React from 'react';

export interface BenefitItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface BenefitIconGridProps {
  tagline?: string;
  titleBlack?: string;
  titleRed?: string;
  subtitle?: string;
  items: BenefitItem[];
  columns?: 4 | 5 | 6;
  iconStyle?: 'circle-red' | 'circle-light' | 'square-light';
  backgroundColor?: string;
}

export const BenefitIconGrid: React.FC<BenefitIconGridProps> = ({
  tagline,
  titleBlack,
  titleRed,
  subtitle,
  items,
  columns = 5,
  iconStyle = 'circle-red',
  backgroundColor = '#ffffff',
}) => {
  return (
    <section
      style={{
        backgroundColor,
        color: '#1e293b',
        padding: '52px 0 44px 0',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div className="container">
        
        {/* Header */}
        {(titleBlack || tagline) && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            {tagline && (
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: 'var(--accent-red)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                {tagline}
              </span>
            )}
            {titleBlack && (
              <h2
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
            )}
            {subtitle && (
              <p style={{ fontSize: '0.92rem', color: '#64748b', margin: '8px auto 0 auto', maxWidth: '640px', lineHeight: 1.45 }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${columns === 6 ? '150px' : columns === 5 ? '190px' : '220px'}, 1fr))`,
            gap: '24px',
            textAlign: 'center',
          }}
        >
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              {/* Icon Container */}
              <div
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: iconStyle === 'square-light' ? '8px' : '50%',
                  backgroundColor:
                    iconStyle === 'circle-red'
                      ? '#ffffff'
                      : iconStyle === 'circle-light'
                      ? '#f8fafc'
                      : '#ffffff',
                  border:
                    iconStyle === 'circle-red'
                      ? '2px solid var(--accent-red)'
                      : '1px solid #e2e8f0',
                  color: iconStyle === 'circle-red' ? 'var(--accent-red)' : '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {item.icon}
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  letterSpacing: '0.4px',
                }}
              >
                {item.title}
              </h3>

              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: '1.4', maxWidth: '220px' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
