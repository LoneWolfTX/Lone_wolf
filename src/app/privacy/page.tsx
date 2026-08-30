import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';

export const metadata: Metadata = {
  title: 'Privacy Policy | American Wolf Rent LLC DBA Lone Wolf Dumpsters',
  description: 'Privacy Policy for American Wolf Rent LLC DBA Lone Wolf Dumpsters. Learn how we collect, use, and protect your information when booking dumpster rentals and requesting quotes.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | American Wolf Rent LLC DBA Lone Wolf Dumpsters',
    description: 'Privacy Policy for American Wolf Rent LLC DBA Lone Wolf Dumpsters. Learn how we collect, use, and protect your information.',
    url: 'https://lonewolfdumpsters.com/privacy',
  },
};

import { PageHero } from '@/components/shared/PageHero';

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Privacy Policy' },
        ]}
        headlineWhite="PRIVACY"
        headlineRed="POLICY"
        description="Learn how American Wolf Rent LLC DBA Lone Wolf Dumpsters collects, protects, and manages customer information across Dallas–Fort Worth."
        imageSrc="/images/lone-wolf/lone_wolf_hero_top.png"
        imageAlt="Lone Wolf Dumpsters roll-off truck with black dumpster serving the Dallas-Fort Worth area"
        imageObjectPosition="center right"
      />

      <section style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '60px 0', minHeight: '50vh' }}>
        <div className="container" style={{ maxWidth: '860px', lineHeight: 1.7, fontSize: '1rem' }}>
          
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
            1. Information We Collect
          </h2>
          <p style={{ marginBottom: '20px', color: '#334155' }}>
            When you request a quote, schedule a dumpster rental, or submit an intake form through American Wolf Rent LLC DBA Lone Wolf Dumpsters (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), we collect the personal details you provide to us directly. This includes your <strong>full name, phone number, email address, delivery site address, project details, preferred delivery date</strong>, and technical data such as your IP address and browser user agent for security and spam prevention.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
            2. How We Use Your Information
          </h2>
          <p style={{ marginBottom: '20px', color: '#334155' }}>
            The information you submit is used exclusively to:
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '24px', marginBottom: '20px', color: '#334155', display: 'grid', gap: '8px' }}>
            <li>Provide accurate dumpster rental quotes and process container reservations.</li>
            <li>Coordinate drop-off, placement, and pickup logistics at your designated Dallas–Fort Worth address.</li>
            <li>Send order confirmations, delivery status updates, and invoice receipts via phone, SMS, or email.</li>
            <li>Prevent fraudulent bookings, spam submissions, and protect our dispatch systems.</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
            3. Information Sharing, Data Processors &amp; Analytics
          </h2>
          <p style={{ marginBottom: '16px', color: '#334155' }}>
            <strong>We do not sell, rent, trade, or share your personal contact information with third-party marketers.</strong>
          </p>
          <p style={{ marginBottom: '16px', color: '#334155' }}>
            To operate our business, we may share information with trusted third-party service providers (such as hosting infrastructure, email and SMS delivery providers, form processing services, security tools, and analytics platforms). These processors act strictly on our behalf under confidentiality obligations to help us manage bookings and operate our website.
          </p>
          <p style={{ marginBottom: '20px', color: '#334155' }}>
            We also use analytics and measurement services (such as Google Analytics 4 and Meta Pixel) to analyze site traffic, optimize performance, and measure marketing conversions. These services may place cookies or access standard technical headers (such as IP address and browser type). You can adjust cookie settings through your web browser at any time.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
            4. SMS &amp; Telephone Communications
          </h2>
          <p style={{ marginBottom: '20px', color: '#334155' }}>
            By submitting your phone number via our quote request form, you consent to receive direct phone calls and text messages (SMS) from Lone Wolf Dumpsters regarding your quote, delivery scheduling, and service updates. Message and data rates may apply. You may opt out of SMS messages at any time by replying STOP.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
            5. Contact Us Regarding Your Privacy
          </h2>
          <p style={{ marginBottom: '20px', color: '#334155' }}>
            If you have questions regarding this Privacy Policy or wish to review, update, or delete your contact information, please contact us directly:
          </p>
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '32px' }}>
            <p style={{ margin: '0 0 6px 0', fontWeight: 700, color: '#0f172a' }}>American Wolf Rent LLC DBA Lone Wolf Dumpsters</p>
            <p style={{ margin: '0 0 6px 0', color: '#475569' }}>Dallas–Fort Worth Metroplex, Texas</p>
            <p style={{ margin: '0 0 6px 0', color: '#475569' }}>Phone: <a href={`tel:${siteSettings.contact.phoneRaw}`} style={{ color: 'var(--accent-red)', fontWeight: 700 }}>{siteSettings.contact.phone}</a></p>
            <p style={{ margin: 0, color: '#475569' }}>Email: <a href={`mailto:${siteSettings.contact.email}`} style={{ color: 'var(--accent-red)' }}>{siteSettings.contact.email}</a></p>
          </div>

        </div>
      </section>
    </>
  );
}
