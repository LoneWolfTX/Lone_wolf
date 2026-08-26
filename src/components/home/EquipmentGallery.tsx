import React from 'react';
import Image from 'next/image';
import { equipmentGallery } from '@/data/gallery';

export const EquipmentGallery: React.FC = () => {
  return (
    <section id="gallery" className="gallery-section" aria-labelledby="gallery-heading">
      <div className="container">
        <div className="section-header">
          <div className="patriotic-divider-mini">
            <span className="mini-line-red" />
            <span className="mini-star">★</span>
            <span className="mini-line-blue" />
          </div>
          <h2 id="gallery-heading" className="section-title">
            Our Equipment in the <span className="text-accent">Real World</span>
          </h2>
          <p className="section-subtitle">
            Authentic Lone Wolf roll-off containers and delivery fleet active across Dallas–Fort Worth driveways, remodels, and job sites.
          </p>
        </div>

        <div className="gallery-grid">
          {equipmentGallery.map((item) => (
            <figure key={item.id} className="gallery-card">
              <div className="gallery-image-wrapper">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1200px) 380px, (min-width: 768px) 45vw, 100vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <figcaption className="gallery-caption">
                <span>{item.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
