import React from 'react';
import { CalendarCheck, Truck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'BOOK ONLINE',
      desc: 'Select your size, delivery date, and drop-off address.',
      icon: <CalendarCheck size={22} />,
    },
    {
      num: '2',
      title: 'WE DELIVER',
      desc: 'We place the dumpster on protective wood driveway boards.',
      icon: <Truck size={22} />,
    },
    {
      num: '3',
      title: 'YOU LOAD IT',
      desc: 'Easy walk-in rear door for heavy items and remodel debris.',
      icon: <Sparkles size={22} />,
    },
    {
      num: '4',
      title: 'WE HAUL AWAY',
      desc: 'Call or text when ready for prompt pickup and disposal.',
      icon: <CheckCircle2 size={22} />,
    },
  ];

  return (
    <section className="how-it-works-section" style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '36px 0 28px 0', borderBottom: '1px solid #e2e8f0' }} aria-labelledby="how-it-works-heading">
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>
            SIMPLE 4-STEP PROCESS
          </span>
          <h2 id="how-it-works-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.4vw, 2.4rem)', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
            HOW DUMPSTER RENTAL WORKS
          </h2>
        </div>

        {/* 4 Steps Row with Connecting Arrows on Desktop */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            alignItems: 'flex-start',
          }}
        >
          {steps.map((step, idx) => (
            <div
              key={step.num}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px 18px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Step Icon */}
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-red)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px auto',
                  boxShadow: '0 3px 10px rgba(220, 38, 38, 0.25)',
                }}
              >
                {step.icon}
              </div>

              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '4px' }}>
                {step.num}. {step.title}
              </div>

              <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: '1.4', margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
