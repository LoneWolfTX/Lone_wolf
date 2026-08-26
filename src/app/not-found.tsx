import Link from 'next/link';
import { Phone, ArrowLeft, Home, Calendar } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';

export default function NotFound() {
  return (
    <div style={{ backgroundColor: '#0a0d12', color: '#ffffff', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 16px' }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', backgroundColor: '#111622', border: '1px solid #1e293b', borderRadius: '12px', padding: '48px 24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', fontWeight: 800, color: 'var(--accent-red)', lineHeight: 1, marginBottom: '12px' }}>
          404
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', color: '#ffffff' }}>
          Page Not Found
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px auto' }}>
          The page you are looking for might have been moved or is temporarily unavailable. Let&apos;s get you back on track for your dumpster rental.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'var(--accent-red)',
              color: '#ffffff',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            <Home size={18} />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/dumpster-rentals"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: '#ffffff',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            <Calendar size={18} className="text-accent" />
            <span>View Dumpsters</span>
          </Link>
        </div>

        <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid #1e293b', fontSize: '0.9rem', color: '#64748b' }}>
          Need immediate assistance? Call or text our team at{' '}
          <a href={`tel:${siteSettings.contact.phoneRaw}`} style={{ color: 'var(--accent-red)', fontWeight: 700, textDecoration: 'none' }}>
            {siteSettings.contact.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
