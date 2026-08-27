'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phone, MapPin, Star, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';
import { trackLeadSubmitted } from '@/lib/tracking';
import { useSiteContent } from '@/lib/useEditableContent';
import { formatCurrency, formatPhoneNumber } from '@/lib/formatters';

interface FreeQuoteFormProps {
  id?: string;
  defaultService?: string;
}

export const FreeQuoteForm: React.FC<FreeQuoteFormProps> = ({
  id = 'quote',
  defaultService = '20-yard-dumpster',
}) => {
  const { content } = useSiteContent();
  const pr = content.pricing;
  const phone = formatPhoneNumber(content.business?.phone || content.contact?.phone);
  const phoneRaw = content.business?.phoneRaw || content.contact?.phoneRaw || '+12148760321';
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [dumpsterSize, setDumpsterSize] = useState(defaultService);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [cleaningType, setCleaningType] = useState('Household Cleanout');
  const [projectDetails, setProjectDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !phoneNumber.trim() || !deliveryAddress.trim()) {
      setErrorMessage('Please enter your Name, Phone Number, and Delivery Address.');
      return;
    }

    setSubmitting(true);

    const payload = {
      name: fullName,
      phone: phoneNumber,
      deliveryAddress,
      service: dumpsterSize,
      projectType: cleaningType,
      preferredDate: deliveryDate || 'As soon as possible',
      notes: projectDetails,
    };

    try {
      // 1. Dual submission: try PHP backend endpoint first
      let success = false;
      try {
        const phpRes = await fetch('/api/quote.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (phpRes.ok) success = true;
      } catch {
        // PHP endpoint not available on static hosts like Netlify
      }

      // 2. FormSubmit.co email delivery to lonewolfdumpsters@gmail.com
      try {
        const formSubmitRes = await fetch('https://formsubmit.co/ajax/lonewolfdumpsters@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            _subject: `🐺 New Quote Request: ${fullName} (${phoneNumber})`,
            Name: fullName,
            Phone: phoneNumber,
            'Delivery Address': deliveryAddress,
            'Dumpster Size': dumpsterSize,
            'Project Type': cleaningType,
            'Preferred Date': deliveryDate || 'As soon as possible',
            Notes: projectDetails || 'None',
          }),
        });
        if (formSubmitRes.ok) success = true;
      } catch {
        // FormSubmit fallback
      }

      // 3. Automatic SMS notification to Wayne via Email-to-SMS gateways
      const smsGateways = [
        '2148760321@vtext.com',
        '2148760321@txt.att.net',
        '2148760321@tmomail.net',
      ];
      smsGateways.forEach((gateway) => {
        fetch(`https://formsubmit.co/ajax/${gateway}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _subject: `New Dumpster Quote`,
            Quote: `${fullName} - ${phoneNumber} - ${dumpsterSize} at ${deliveryAddress}`,
          }),
        }).catch(() => null);
      });

      setFormSubmitted(true);
      trackLeadSubmitted({ service: dumpsterSize, projectType: cleaningType, location: deliveryAddress });
    } catch {
      setErrorMessage('Connection issue. Please call or text our team directly at (214) 876-0321.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id={id}
      style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        padding: '52px 0 44px 0',
        borderBottom: '1px solid #e2e8f0',
      }}
      aria-labelledby="quote-section-heading"
    >
      <div className="container">
        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column: Direct Contact & Trust */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: 'var(--accent-red)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'block',
                  marginBottom: '2px',
                }}
              >
                GET IN TOUCH
              </span>
              <h2
                id="quote-section-heading"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 3.8vw, 2.7rem)',
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  margin: '0 0 8px 0',
                  letterSpacing: '0.02em',
                }}
              >
                Get a Free Quote
              </h2>
              <p style={{ fontSize: '0.94rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                Call, text or fill out the form and we&apos;ll get back to you within minutes during business hours.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Call Card */}
              <a
                href={`tel:${siteSettings.contact.phoneRaw}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#0f172a',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#fee2e2',
                    color: 'var(--accent-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    CALL DIRECTLY
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {siteSettings.contact.phone}
                  </div>
                </div>
              </a>

              {/* Text / SMS Card with Pre-filled Message */}
              <a
                href={siteSettings.contact.smsUri}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#0f172a',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#fff1f2',
                    color: 'var(--accent-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '1.2rem',
                  }}
                >
                  💬
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--accent-red)', fontWeight: 700, textTransform: 'uppercase' }}>
                    TEXT US FOR A FAST QUOTE (1-TAP SMS)
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    Text {siteSettings.contact.phone}
                  </div>
                </div>
              </a>

              {/* Location Card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  color: '#0f172a',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#fee2e2',
                    color: 'var(--accent-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    SERVICE AREA
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    Dallas-Fort Worth Metroplex
                  </div>
                </div>
              </div>

              {/* Google Rating Card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.3rem',
                    color: '#4285F4',
                    flexShrink: 0,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  G
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>5.0</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill="#eab308" color="#eab308" />
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                    <span>5.0 Rated DFW Service</span>
                  </div>
                </div>
              </div>

              {/* Authentic Delivery Photo Showcase Card */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '180px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  backgroundColor: '#0a0d12',
                }}
              >
                <Image
                  src="/images/lone-wolf/real/real_dumpster_6082.jpg"
                  alt="Lone Wolf Roll-Off Dumpster Delivery in DFW"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{ objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                  }}
                >
                  📍 Direct Owner-Operator Dispatch Across 48 DFW Cities
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Form Card */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '28px 28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
          >
            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 12px auto' }} />
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                    color: '#0f172a',
                  }}
                >
                  QUOTE REQUEST SENT!
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.94rem', lineHeight: 1.5, marginBottom: '20px' }}>
                  Your quote request has been received. Our local dispatch team has been notified and will contact you shortly at <strong>{phoneNumber}</strong> to confirm delivery.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    style={{
                      padding: '9px 18px',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {errorMessage && (
                  <div style={{ padding: '9px 12px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '4px', color: '#991b1b', fontSize: '0.84rem' }}>
                    {errorMessage}
                  </div>
                )}

                {/* 2-Column Name & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <div>
                    <label htmlFor="quote-name" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      id="quote-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        color: '#0f172a',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="quote-phone" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Phone Number *
                    </label>
                    <input
                      id="quote-phone"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(214) 876-0321"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        color: '#0f172a',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label htmlFor="quote-address" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Delivery Address *
                  </label>
                  <input
                    id="quote-address"
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="123 Main St, City, State, ZIP"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      color: '#0f172a',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* 2-Column: Size & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <div>
                    <label htmlFor="quote-size" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Dumpster Size / Service Needed *
                    </label>
                    <select
                      id="quote-size"
                      value={dumpsterSize}
                      onChange={(e) => setDumpsterSize(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        color: '#0f172a',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="15-yard-dumpster">15 Yard Dumpster ({formatCurrency(pr.fifteenYard)})</option>
                      <option value="20-yard-dumpster">20 Yard Dumpster ({formatCurrency(pr.twentyYard)})</option>
                      <option value="25-yard-dumpster">25 Yard Dumpster ({formatCurrency(pr.twentyFiveYard)})</option>
                      <option value="junk">Full-Service Junk Removal</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quote-date" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Preferred Delivery Date
                    </label>
                    <input
                      id="quote-date"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        color: '#0f172a',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* What are you cleaning out? */}
                <div>
                  <label htmlFor="quote-type" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    What are you cleaning out?
                  </label>
                  <select
                    id="quote-type"
                    value={cleaningType}
                    onChange={(e) => setCleaningType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      color: '#0f172a',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Household Cleanout">Household Cleanout / Garage / Attic</option>
                    <option value="Roofing / Remodeling">Roofing / Remodeling / Construction</option>
                    <option value="Yard Debris / Landscaping">Yard Debris / Landscaping</option>
                    <option value="Commercial / Demolition">Commercial / Demolition</option>
                    <option value="Construction & Demolition">Construction &amp; Demolition Debris</option>
                    <option value="Other">Other Cleanout Project</option>
                  </select>
                </div>

                {/* Project Details */}
                <div>
                  <label htmlFor="quote-notes" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Project Details
                  </label>
                  <textarea
                    id="quote-notes"
                    rows={2}
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(e.target.value)}
                    placeholder="Tell us about your project or placement instructions..."
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      color: '#0f172a',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Big Red Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '13px 0',
                    backgroundColor: 'var(--accent-red)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '4px',
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <span>GET MY QUOTE →</span>
                  )}
                </button>

                <p style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', marginTop: '10px', lineHeight: 1.35, margin: '10px 0 0 0' }}>
                  By submitting, you consent to receive calls and text messages (SMS) from Lone Wolf Dumpsters regarding your quote and order logistics. Message &amp; data rates may apply. Reply STOP to opt out. View our <a href="/privacy" style={{ color: '#475569', textDecoration: 'underline' }}>Privacy Policy</a>.
                </p>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
