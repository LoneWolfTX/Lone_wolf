import React from 'react';
import { CalendarCheck, Truck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface Step {
  num: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export const HowItWorksSteps: React.FC = () => {
  const steps: Step[] = [
    {
      num: '1',
      title: 'BOOK ONLINE',
      desc: 'Choose your dumpster size, date and rental period.',
      icon: <CalendarCheck size={24} />,
    },
    {
      num: '2',
      title: 'WE DELIVER',
      desc: "We'll deliver your dumpster right where you need it.",
      icon: <Truck size={24} />,
    },
    {
      num: '3',
      title: 'YOU FILL IT UP',
      desc: 'Take your time to load up your dumpster at your own pace.',
      icon: <Sparkles size={24} />,
    },
    {
      num: '4',
      title: 'WE PICK IT UP',
      desc: "We'll pick it up and haul it away when you're all done.",
      icon: <CheckCircle2 size={24} />,
    },
  ];

  return (
    <section
      className="how-it-works-section"
      style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        padding: '52px 0 44px 0',
        borderBottom: '1px solid #e2e8f0',
      }}
      aria-labelledby="how-it-works-heading"
    >
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
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
            HOW IT WORKS
          </span>
          <h2
            id="how-it-works-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.8vw, 2.7rem)',
              fontWeight: 800,
              color: '#0f172a',
              textTransform: 'uppercase',
              margin: 0,
              letterSpacing: '0.02em',
            }}
          >
            RENTING A DUMPSTER IS EASY
          </h2>
        </div>

        {/* 4 Steps Horizontal Row with Connecting Arrows */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          {steps.map((step, idx) => (
            <div
              key={step.num}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                padding: '0 10px',
              }}
            >
              {/* Step Circle Badge */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-red)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                }}
              >
                {step.icon}
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  letterSpacing: '0.4px',
                }}
              >
                {step.num}. {step.title}
              </div>

              <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.45', margin: 0, maxWidth: '240px' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
