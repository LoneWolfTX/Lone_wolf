'use client';

import React, { useState } from 'react';
import { Phone, MapPin, Clock, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';
import { trackLeadSubmitted } from '@/lib/tracking';
import { useSiteContent } from '@/lib/useEditableContent';
import { formatCurrency, formatPhoneNumber } from '@/lib/formatters';

export const ContactBookingSection: React.FC = () => {
  const { content } = useSiteContent();
  const pr = content.pricing;
  const phone = formatPhoneNumber(content.business?.phone || content.contact?.phone);
  const phoneRaw = content.business?.phoneRaw || content.contact?.phoneRaw || '+12148760321';
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [dumpsterSize, setDumpsterSize] = useState('20-yard-dumpster');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [rentalDuration, setRentalDuration] = useState('7 Days');
  const [cleaningType, setCleaningType] = useState('Household Cleanout');
  const [projectDetails, setProjectDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !phoneNumber.trim() || !deliveryAddress.trim()) {
      setErrorMessage('Please fill in your Name, Phone Number, and Delivery Address.');
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
      rentalDuration,
      notes: projectDetails,
    };

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const apiData = await res.json().catch(() => null);

      if (res.ok && apiData?.success) {
        setFormSubmitted(true);
        trackLeadSubmitted({
          service: dumpsterSize,
          projectType: cleaningType,
          location: deliveryAddress,
        });
      } else {
        setErrorMessage(apiData?.error || 'Server error submitting quote request. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Connection error. Please call or text our team directly at (214) 876-0321.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="quote" style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '40px 0 32px 0', borderBottom: '1px solid #e2e8f0' }} aria-labelledby="quote-heading">
      <div className="container">
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'flex-start' }}>
          
          {/* Left Column: Direct Contact & Hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>
                DIRECT DFW DISPATCH
              </span>
              <h2 id="quote-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.6vw, 2.6rem)', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                RESERVE YOUR DUMPSTER
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                Submit your project details below or call our dispatch desk directly for fast dispatch across Dallas–Fort Worth.
              </p>
            </div>

            {/* Direct Phone Block */}
            <a
              href={`tel:${siteSettings.contact.phoneRaw}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 18px',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#0f172a',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-red)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Phone size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  CALL OR TEXT US DIRECTLY
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                  {siteSettings.contact.phone}
                </div>
              </div>
            </a>

            {/* Hours & Location Strip */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} className="text-accent" style={{ flexShrink: 0 }} />
                <span><strong>Hours:</strong> Mon–Sat: 6:00 AM – 6:00 PM (Sun: Closed)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} className="text-accent" style={{ flexShrink: 0 }} />
                <span><strong>Yard:</strong> 4141 Singleton Blvd, Dallas, TX 75212</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} className="text-accent" style={{ flexShrink: 0 }} />
                <span><strong>Protection:</strong> Wood driveway boards included under rollers</span>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Intake Form */}
          <div
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '24px 26px',
              border: '1px solid #1e293b',
              boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            }}
          >
            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '28px 12px' }}>
                <CheckCircle2 size={48} color="#22c55e" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', color: '#ffffff' }}>
                  QUOTE REQUEST RECEIVED!
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  Our team has received your request and will contact you promptly at <strong>{phoneNumber}</strong> to confirm scheduling.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 2px 0', letterSpacing: '0.5px' }}>
                  ONLINE BOOKING &amp; FREE QUOTE
                </h3>

                {errorMessage && (
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid var(--accent-red)', borderRadius: '4px', color: '#fca5a5', fontSize: '0.82rem' }}>
                    {errorMessage}
                  </div>
                )}

                {/* 2-Column Grid: Name & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                  <div>
                    <label htmlFor="intake-name" style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#cbd5e1' }}>
                      Full Name *
                    </label>
                    <input
                      id="intake-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Smith"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        backgroundColor: '#111622',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="intake-phone" style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#cbd5e1' }}>
                      Phone Number *
                    </label>
                    <input
                      id="intake-phone"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(214) 000-0000"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        backgroundColor: '#111622',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label htmlFor="intake-address" style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#cbd5e1' }}>
                    Delivery Address (Street, City, ZIP) *
                  </label>
                  <input
                    id="intake-address"
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. 1234 Main St, Keller, TX 76248"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      backgroundColor: '#111622',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* 2-Column Grid: Service & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                  <div>
                    <label htmlFor="intake-service" style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#cbd5e1' }}>
                      Dumpster Size
                    </label>
                    <select
                      id="intake-service"
                      value={dumpsterSize}
                      onChange={(e) => setDumpsterSize(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 10px',
                        backgroundColor: '#111622',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="15-yard-dumpster">15 Yard Dumpster</option>
                      <option value="20-yard-dumpster">20 Yard Dumpster (Most Popular)</option>
                      <option value="25-yard-dumpster">25 Yard Dumpster</option>
                      <option value="junk">Full-Service Junk Removal</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="intake-duration" style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#cbd5e1' }}>
                      Rental Duration Needed
                    </label>
                    <select
                      id="intake-duration"
                      value={rentalDuration}
                      onChange={(e) => setRentalDuration(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 10px',
                        backgroundColor: '#111622',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="3 Days">3 Days</option>
                      <option value="5 Days">5 Days</option>
                      <option value="7 Days">7 Days (Standard)</option>
                      <option value="7+ Days / Custom">7+ Days / Custom</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Date */}
                <div>
                  <label htmlFor="intake-date" style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#cbd5e1' }}>
                    Preferred Delivery Date
                  </label>
                  <input
                    id="intake-date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      backgroundColor: '#111622',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Project Notes (Optional) */}
                <div>
                  <label htmlFor="intake-notes" style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#cbd5e1' }}>
                    Project Notes &amp; Placement Instructions (Optional)
                  </label>
                  <textarea
                    id="intake-notes"
                    rows={2}
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(e.target.value)}
                    placeholder="e.g. Left side of driveway, roofing shingles, etc."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#111622',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      color: '#ffffff',
                      fontSize: '0.86rem',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '12px 0',
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
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
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
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <span>CONFIRM AVAILABILITY &amp; GET QUOTE &rarr;</span>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
