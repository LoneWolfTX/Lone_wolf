import React from 'react';
import Image from 'next/image';
import { Phone, ShieldCheck, HeartHandshake, UserCheck } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';
import { Button } from '@/components/ui/Button';

export const OwnerStory: React.FC = () => {
  return (
    <section id="about" className="owner-story-section" aria-labelledby="about-heading">
      <div className="container">
        <div className="owner-story-grid">
          {/* Owner Image */}
          <div className="owner-image-wrapper">
            <div className="owner-image-container">
              <Image
                src="/images/lone-wolf/real/about_owner_photo.jpg"
                alt="Owner Wayne with Lone Wolf Dumpsters roll-off fleet in DFW"
                fill
                loading="eager"
                sizes="(min-width: 960px) 440px, 100vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="owner-badge">
                <UserCheck size={16} className="text-accent" />
                <span>Wayne — Owner & Operator</span>
              </div>
            </div>
          </div>

          {/* Owner Content */}
          <div className="owner-content">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-red">Direct Local Service</span>
              <span className="badge badge-neutral">No Middlemen</span>
            </div>

            <h2 id="about-heading" className="owner-title">
              Locally Owned. <span className="text-accent">DFW Operated.</span>
            </h2>

            <blockquote className="owner-quote">
              &ldquo;I&apos;m Wayne, owner of Lone Wolf Dumpsters. We are locally owned and operated right here in DFW. Whether you&apos;re cleaning out a garage, remodeling a home, or running a busy job site, our mission is simple: to make waste removal easy, transparent, and stress-free.&rdquo;
            </blockquote>

            <p className="owner-body-text">
              When you call or text Lone Wolf, you speak directly with the team handling your delivery. We treat your property with respect, protect driveways with wood placement, and deliver dependable equipment with upfront pricing.
            </p>

            <div className="owner-values-grid">
              <div className="owner-val-item">
                <ShieldCheck size={18} className="text-accent" />
                <div>
                  <strong>Driveway Respect</strong>
                  <p>Careful roll-off placement to protect your paved surfaces.</p>
                </div>
              </div>
              <div className="owner-val-item">
                <HeartHandshake size={18} className="text-accent" />
                <div>
                  <strong>Direct Communication</strong>
                  <p>Speak directly with the owner on scheduling and questions.</p>
                </div>
              </div>
            </div>

            <div className="owner-cta-row">
              <Button href={`tel:${siteSettings.contact.phoneRaw}`} variant="secondary" size="md">
                <Phone size={16} className="text-accent" />
                Call / Text ({siteSettings.contact.phone})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
