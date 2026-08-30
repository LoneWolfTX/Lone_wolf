'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Search, CheckCircle2, Phone, ArrowRight, Navigation, Loader2, Compass } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';

export interface MapCityLocation {
  slug: string;
  name: string;
  county: 'Tarrant' | 'Dallas' | 'Denton';
  lat: number;
  lng: number;
  zips: string[];
  headline: string;
  deliverySpeed: string;
}

export const all48MapCities: MapCityLocation[] = [
  // TARRANT COUNTY (26)
  { slug: 'fort-worth', name: 'Fort Worth', county: 'Tarrant', lat: 32.7555, lng: -97.3308, zips: ['76102', '76104', '76107', '76116'], headline: 'Same-day & next-day contractor & residential roll-off delivery.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'arlington', name: 'Arlington', county: 'Tarrant', lat: 32.7357, lng: -97.1081, zips: ['76010', '76011', '76017', '76018'], headline: 'Residential cleanouts & commercial roll-off rentals.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'keller', name: 'Keller', county: 'Tarrant', lat: 32.9342, lng: -97.2293, zips: ['76244', '76248'], headline: 'Driveway-safe roll-off dumpster rentals.', deliverySpeed: 'Priority Local Dispatch' },
  { slug: 'southlake', name: 'Southlake', county: 'Tarrant', lat: 32.9412, lng: -97.1342, zips: ['76092'], headline: 'Careful driveway placement for luxury home renovations.', deliverySpeed: 'Priority Local Dispatch' },
  { slug: 'colleyville', name: 'Colleyville', county: 'Tarrant', lat: 32.8854, lng: -97.1467, zips: ['76034'], headline: 'Wood-protected driveway placement for homeowners.', deliverySpeed: 'Priority Local Dispatch' },
  { slug: 'grapevine', name: 'Grapevine', county: 'Tarrant', lat: 32.9343, lng: -97.0781, zips: ['76051'], headline: 'Fast delivery near DFW Airport & Lake Grapevine.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'north-richland-hills', name: 'North Richland Hills', county: 'Tarrant', lat: 32.8343, lng: -97.2289, zips: ['76180', '76182'], headline: 'Reliable 15, 20 & 25-yd roll-offs.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'bedford', name: 'Bedford', county: 'Tarrant', lat: 32.8440, lng: -97.1431, zips: ['76021', '76022'], headline: 'HEB mid-cities prompt delivery.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'euless', name: 'Euless', county: 'Tarrant', lat: 32.8371, lng: -97.0820, zips: ['76039', '76040'], headline: 'Fast mid-cities roll-off dispatch.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'hurst', name: 'Hurst', county: 'Tarrant', lat: 32.8235, lng: -97.1706, zips: ['76053', '76054'], headline: 'Dependable waste disposal for remodels.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'haltom-city', name: 'Haltom City', county: 'Tarrant', lat: 32.7996, lng: -97.2692, zips: ['76117'], headline: 'Fast local drop-offs & swaps.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'mansfield', name: 'Mansfield', county: 'Tarrant', lat: 32.5632, lng: -97.1417, zips: ['76063'], headline: 'South DFW residential & commercial service.', deliverySpeed: 'Next-Day Dispatch' },
  { slug: 'watauga', name: 'Watauga', county: 'Tarrant', lat: 32.8585, lng: -97.2545, zips: ['76148'], headline: 'Neighborhood-friendly roll-off dumpsters.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'saginaw', name: 'Saginaw', county: 'Tarrant', lat: 32.8615, lng: -97.3639, zips: ['76179'], headline: 'Northwest Tarrant County dumpster delivery.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'haslet', name: 'Haslet', county: 'Tarrant', lat: 32.9740, lng: -97.3481, zips: ['76052'], headline: 'Fast dispatch to Haslet & Alliance corridor.', deliverySpeed: 'Priority Local Dispatch' },
  { slug: 'richland-hills', name: 'Richland Hills', county: 'Tarrant', lat: 32.8101, lng: -97.2289, zips: ['76118'], headline: 'Compact driveway placement specialist.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'kennedale', name: 'Kennedale', county: 'Tarrant', lat: 32.6468, lng: -97.1761, zips: ['76060'], headline: 'Southeast Tarrant roll-off service.', deliverySpeed: 'Next-Day Dispatch' },
  { slug: 'lake-worth', name: 'Lake Worth', county: 'Tarrant', lat: 32.8104, lng: -97.4339, zips: ['76135'], headline: 'Direct delivery around Lake Worth & Hwy 199.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'white-settlement', name: 'White Settlement', county: 'Tarrant', lat: 32.7593, lng: -97.4642, zips: ['76108'], headline: 'West Fort Worth roll-off containers.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'river-oaks', name: 'River Oaks', county: 'Tarrant', lat: 32.7762, lng: -97.3995, zips: ['76114'], headline: 'Clean, driveway-safe dumpster rentals.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'forest-hill', name: 'Forest Hill', county: 'Tarrant', lat: 32.6668, lng: -97.2678, zips: ['76140'], headline: 'South Fort Worth waste solutions.', deliverySpeed: 'Next-Day Dispatch' },
  { slug: 'everman', name: 'Everman', county: 'Tarrant', lat: 32.6307, lng: -97.2889, zips: ['76140'], headline: 'Fast delivery for remodels & cleanouts.', deliverySpeed: 'Next-Day Dispatch' },
  { slug: 'edgecliff-village', name: 'Edgecliff Village', county: 'Tarrant', lat: 32.6515, lng: -97.3442, zips: ['76134'], headline: 'Local roll-off dumpster rentals.', deliverySpeed: 'Next-Day Dispatch' },
  { slug: 'blue-mound', name: 'Blue Mound', county: 'Tarrant', lat: 32.8485, lng: -97.3392, zips: ['76131'], headline: 'North Tarrant container rentals.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'sansom-park', name: 'Sansom Park', county: 'Tarrant', lat: 32.8029, lng: -97.4117, zips: ['76164'], headline: 'Fast dumpster drop-offs.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'lakeside', name: 'Lakeside', county: 'Tarrant', lat: 32.8182, lng: -97.4914, zips: ['76135'], headline: 'West Tarrant County roll-off service.', deliverySpeed: 'Next-Day Dispatch' },

  // DALLAS COUNTY (13)
  { slug: 'dallas', name: 'Dallas', county: 'Dallas', lat: 32.7767, lng: -96.7970, zips: ['75201', '75212', '75219', '75208'], headline: 'Direct roll-off dumpster dispatch across all Dallas neighborhoods.', deliverySpeed: 'Same-Day When Available' },
  { slug: 'irving', name: 'Irving', county: 'Dallas', lat: 32.8140, lng: -96.9489, zips: ['75038', '75061', '75062', '75063'], headline: 'Las Colinas & Central Irving dumpster service.', deliverySpeed: 'Same-Day When Available' },
  { slug: 'grand-prairie', name: 'Grand Prairie', county: 'Dallas', lat: 32.7460, lng: -96.9978, zips: ['75050', '75051', '75052'], headline: 'Central DFW roll-off container rentals.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'carrollton', name: 'Carrollton', county: 'Dallas', lat: 32.9746, lng: -96.8899, zips: ['75006', '75007', '75010'], headline: 'North Dallas County cleanouts & roofing.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'coppell', name: 'Coppell', county: 'Dallas', lat: 32.9546, lng: -97.0150, zips: ['75019'], headline: 'Residential & commercial roll-off rentals.', deliverySpeed: 'Priority Local Dispatch' },
  { slug: 'farmers-branch', name: 'Farmers Branch', county: 'Dallas', lat: 32.9265, lng: -96.8961, zips: ['75234', '75244'], headline: 'Fast delivery along I-35E and I-635.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'addison', name: 'Addison', county: 'Dallas', lat: 32.9618, lng: -96.8292, zips: ['75001'], headline: 'North Dallas & Addison commercial & home bins.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'highland-park', name: 'Highland Park', county: 'Dallas', lat: 32.8335, lng: -96.7919, zips: ['75205'], headline: 'High-end residential careful placement.', deliverySpeed: 'Priority Local Dispatch' },
  { slug: 'university-park', name: 'University Park', county: 'Dallas', lat: 32.8496, lng: -96.7975, zips: ['75205', '75225'], headline: 'Park Cities home renovation dumpsters.', deliverySpeed: 'Priority Local Dispatch' },
  { slug: 'duncanville', name: 'Duncanville', county: 'Dallas', lat: 32.6518, lng: -96.9083, zips: ['75116', '75137'], headline: 'South Dallas County roll-off service.', deliverySpeed: 'Next-Day Dispatch' },
  { slug: 'desoto', name: 'DeSoto', county: 'Dallas', lat: 32.5899, lng: -96.8570, zips: ['75115'], headline: 'Fast container drops in DeSoto.', deliverySpeed: 'Next-Day Dispatch' },
  { slug: 'cedar-hill', name: 'Cedar Hill', county: 'Dallas', lat: 32.5885, lng: -96.9561, zips: ['75104'], headline: 'Southwest Dallas County dumpster rentals.', deliverySpeed: 'Next-Day Dispatch' },
  { slug: 'cockrell-hill', name: 'Cockrell Hill', county: 'Dallas', lat: 32.7404, lng: -96.8828, zips: ['75211'], headline: 'Fast dispatch from central Dallas.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },

  // DENTON COUNTY (9)
  { slug: 'lewisville', name: 'Lewisville', county: 'Denton', lat: 33.0462, lng: -96.9942, zips: ['75057', '75067', '75077'], headline: 'I-35E corridor dumpster rental service.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'flower-mound', name: 'Flower Mound', county: 'Denton', lat: 33.0146, lng: -97.0970, zips: ['75022', '75028'], headline: 'Clean, driveway-safe residential containers.', deliverySpeed: 'Priority Local Dispatch' },
  { slug: 'the-colony', name: 'The Colony', county: 'Denton', lat: 33.0890, lng: -96.8867, zips: ['75056'], headline: 'Fast delivery near Hwy 121 and Grandscape.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'highland-village', name: 'Highland Village', county: 'Denton', lat: 33.0879, lng: -97.0539, zips: ['75077'], headline: 'Quiet, careful driveway drop-offs.', deliverySpeed: 'Priority Local Dispatch' },
  { slug: 'roanoke', name: 'Roanoke', county: 'Denton', lat: 33.0037, lng: -97.2272, zips: ['76262'], headline: 'Unique Dining Capital & Hwy 114 dumpster service.', deliverySpeed: 'Priority Local Dispatch' },
  { slug: 'trophy-club', name: 'Trophy Club', county: 'Denton', lat: 33.0007, lng: -97.1856, zips: ['76262'], headline: 'Premier residential roll-off rentals.', deliverySpeed: 'Priority Local Dispatch' },
  { slug: 'westlake', name: 'Westlake', county: 'Denton', lat: 32.9904, lng: -97.1953, zips: ['76262'], headline: 'Custom home building & remodel dumpster service.', deliverySpeed: 'Priority Local Dispatch' },
  { slug: 'northlake', name: 'Northlake', county: 'Denton', lat: 33.0904, lng: -97.2803, zips: ['76226', '76247'], headline: 'Fast dispatch to new construction sites.', deliverySpeed: 'Same-Day / Next-Day Dispatch' },
  { slug: 'double-oak', name: 'Double Oak', county: 'Denton', lat: 33.0573, lng: -97.0931, zips: ['75077'], headline: 'Wood-board driveway protection included.', deliverySpeed: 'Priority Local Dispatch' },
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const InteractiveServiceMap: React.FC = () => {
  const [selectedCounty, setSelectedCounty] = useState<'All' | 'Tarrant' | 'Dallas' | 'Denton'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState<MapCityLocation>(all48MapCities[0]); // Default Fort Worth
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<{ [slug: string]: any }>({});

  const filteredCities = useMemo(() => {
    return all48MapCities.filter((c) => {
      const matchesCounty = selectedCounty === 'All' || c.county === selectedCounty;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.county.toLowerCase().includes(q) ||
        c.zips.some((z) => z.includes(q));
      return matchesCounty && matchesQuery;
    });
  }, [selectedCounty, searchQuery]);

  // Function to select city & pan real map
  const handleSelectCity = (city: MapCityLocation, zoom = 12) => {
    setActiveCity(city);
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([city.lat, city.lng], zoom, {
        animate: true,
        duration: 0.8,
      });

      // Open popup if exists
      const marker = markersRef.current[city.slug];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  // Browser Geolocation "Use My Location"
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Detecting your location in DFW...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;

        // Find nearest city among our 48
        let nearest = all48MapCities[0];
        let minDistance = Infinity;

        all48MapCities.forEach((city) => {
          const dist = calculateDistance(latitude, longitude, city.lat, city.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = city;
          }
        });

        handleSelectCity(nearest, 13);
        setLocationStatus(`📍 Located near ${nearest.name} (~${minDistance.toFixed(1)} miles away)`);
        setTimeout(() => setLocationStatus(null), 5000);
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus('Could not retrieve location. Please search your city or ZIP above.');
        setTimeout(() => setLocationStatus(null), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Initialize Real Leaflet Map
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current || leafletMapRef.current) return;

      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // DFW Center roughly Arlington/Keller/Grand Prairie
      const map = L.map(mapContainerRef.current, {
        center: [32.84, -97.12],
        zoom: 10,
        minZoom: 9,
        maxZoom: 16,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // CartoDB Voyager map tiles (Crisp, fast, modern theme)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      leafletMapRef.current = map;

      // Render pins for all 48 cities
      all48MapCities.forEach((city) => {
        const isCurrent = city.slug === activeCity.slug;

        const customIcon = L.divIcon({
          className: `lw-map-pin ${isCurrent ? 'lw-pin-active' : ''}`,
          html: `<div class="lw-pin-dot"></div><div class="lw-pin-label">${city.name}</div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -14],
        });

        const marker = L.marker([city.lat, city.lng], { icon: customIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px 6px; text-align: center; color: #ffffff;">
            <div style="font-weight: 900; font-size: 1.1rem; color: #ffffff; text-transform: uppercase; margin-bottom: 2px;">${city.name}, TX</div>
            <div style="font-size: 0.76rem; color: #f87171; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">🟢 ${city.deliverySpeed}</div>
            <div style="font-size: 0.8rem; color: #cbd5e1; margin-bottom: 8px;">15yd ($385) • 20yd ($425) • 25yd ($475)</div>
            <a href="/service-areas/${city.slug}" style="display: inline-block; background: #dc2626; color: #ffffff; padding: 6px 12px; border-radius: 4px; font-size: 0.78rem; font-weight: 800; text-decoration: none; text-transform: uppercase;">View ${city.name} Page &rarr;</a>
          </div>
        `);

        marker.on('click', () => {
          handleSelectCity(city);
        });

        markersRef.current[city.slug] = marker;
      });

      // Ensure Leaflet recalculates tile bounds after layout mount
      setTimeout(() => {
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize();
        }
      }, 300);
    };

    initMap();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update active pin visual state on activeCity change
  useEffect(() => {
    if (!leafletMapRef.current) return;
    const L = require('leaflet');

    all48MapCities.forEach((city) => {
      const marker = markersRef.current[city.slug];
      if (marker) {
        const isCurrent = city.slug === activeCity.slug;
        const customIcon = L.divIcon({
          className: `lw-map-pin ${isCurrent ? 'lw-pin-active' : ''}`,
          html: `<div class="lw-pin-dot"></div><div class="lw-pin-label">${city.name}</div>`,
          iconSize: isCurrent ? [24, 24] : [18, 18],
          iconAnchor: isCurrent ? [12, 12] : [9, 9],
          popupAnchor: [0, -14],
        });
        marker.setIcon(customIcon);
        if (isCurrent) {
          marker.setZIndexOffset(1000);
        } else {
          marker.setZIndexOffset(0);
        }
      }
    });
  }, [activeCity]);

  return (
    <section
      style={{
        backgroundColor: '#090d16',
        color: '#ffffff',
        padding: '52px 0 60px 0',
        borderTop: '1px solid #1e293b',
        borderBottom: '1px solid #1e293b',
        position: 'relative',
      }}
      aria-labelledby="service-map-heading"
    >
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 28px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Compass size={18} style={{ color: 'var(--accent-red)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              INTERACTIVE DFW COVERAGE MAP
            </span>
          </div>

          <h2
            id="service-map-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.8vw, 2.9rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              margin: '0 0 12px 0',
              lineHeight: 1.1,
              color: '#ffffff',
            }}
          >
            FIND YOUR <span style={{ color: 'var(--accent-red)' }}>DELIVERY AREA</span>
          </h2>

          <p style={{ fontSize: '0.96rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            Pan, zoom, or search your city/ZIP code below to view interactive delivery coverage, flat rates, and local dispatch windows.
          </p>
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search city or ZIP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search delivery area"
            style={{
              backgroundColor: '#1e293b',
              color: '#ffffff',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '10px 16px',
              fontSize: '0.9rem',
              width: '100%',
              maxWidth: '300px',
            }}
          />

          <button
            onClick={handleUseMyLocation}
            disabled={isLocating}
            style={{
              backgroundColor: '#1e293b',
              color: '#ffffff',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '10px 16px',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
            }}
          >
            {isLocating ? <Loader2 size={16} className="animate-spin" color="var(--accent-red)" /> : <Navigation size={16} color="var(--accent-red)" />}
            <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
          </button>

          {/* County Filter Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(['All', 'Tarrant', 'Dallas', 'Denton'] as const).map((county) => {
              const count = county === 'All' ? 48 : all48MapCities.filter((c) => c.county === county).length;
              const isActive = selectedCounty === county;
              return (
                <button
                  key={county}
                  onClick={() => {
                    setSelectedCounty(county);
                    if (county !== 'All') {
                      const firstInCounty = all48MapCities.find((c) => c.county === county);
                      if (firstInCounty) handleSelectCity(firstInCounty, 11);
                    }
                  }}
                  style={{
                    backgroundColor: isActive ? 'var(--accent-red)' : '#1e293b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  {county} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Status Message Bar */}
        {locationStatus && (
          <div
            style={{
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid var(--accent-red)',
              color: '#fca5a5',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '0.84rem',
              fontWeight: 700,
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            {locationStatus}
          </div>
        )}

        {/* 2-Column: REAL INTERACTIVE MAP | SELECTED AREA DETAILS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: REAL PAN/ZOOM LEAFLET MAP */}
          <div
            className="lw-service-map-wrapper"
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
            }}
          >
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '480px' }} />

            {/* Quick Map Controls Overlay Hint */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                color: '#94a3b8',
                padding: '6px 10px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: '1px solid #334155',
                pointerEvents: 'none',
                zIndex: 500,
                backdropFilter: 'blur(4px)',
              }}
            >
              🗺️ Pan &amp; Zoom Active • Click Any City Pin
            </div>
          </div>

          {/* Right Column: SELECTED AREA DETAILS (KEPT & ENHANCED) */}
          <div
            style={{
              backgroundColor: '#111827',
              border: '2px solid var(--accent-red)',
              borderRadius: '8px',
              padding: '24px 26px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 12px 30px rgba(220,38,38,0.18)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    color: '#f87171',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: '1px solid rgba(220, 38, 38, 0.4)',
                  }}
                >
                  🟢 {activeCity.deliverySpeed.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                  {activeCity.county} County
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.9rem, 3vw, 2.3rem)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  margin: '0 0 8px 0',
                }}
              >
                {activeCity.name}, TX
              </h3>

              <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                {activeCity.headline} Direct owner-operator dispatch with driveway protection wood boards and transparent flat rates.
              </p>

              {/* Local Flat Rates Box */}
              <div style={{ backgroundColor: '#0a0d14', border: '1px solid #1f2937', borderRadius: '6px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  AVAILABLE FLAT-RATE SIZES FOR {activeCity.name.toUpperCase()}:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                  <div style={{ backgroundColor: '#1e293b', padding: '8px 4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>15 Yard</div>
                    <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.05rem' }}>$385</div>
                  </div>
                  <div style={{ backgroundColor: '#1e293b', padding: '8px 4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>20 Yard</div>
                    <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.05rem' }}>$425</div>
                  </div>
                  <div style={{ backgroundColor: '#1e293b', padding: '8px 4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>25 Yard</div>
                    <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.05rem' }}>$475</div>
                  </div>
                </div>
              </div>

              {/* Key Features Bullet List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--accent-red)" />
                  <span>Wood boards placed under rollers to protect driveways</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--accent-red)" />
                  <span>Extra tonnage: $80/ton based on scale weight &amp; rental terms</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--accent-red)" />
                  <span>Primary ZIP Codes: {activeCity.zips.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                href={`/service-areas/${activeCity.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--accent-red)',
                  color: '#ffffff',
                  padding: '12px 18px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                }}
              >
                <span>VIEW {activeCity.name.toUpperCase()} DUMPSTER PAGE</span>
                <ArrowRight size={16} />
              </Link>

              <a
                href={`tel:${siteSettings.contact.phoneRaw}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: '4px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: '1px solid #334155',
                }}
              >
                <Phone size={15} color="var(--accent-red)" />
                <span>Call Wayne Direct: {siteSettings.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 48 DIRECT DELIVERY AREAS ACROSS DFW */}
        <div style={{ marginTop: '40px', borderTop: '1px solid #1e293b', paddingTop: '24px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', marginBottom: '14px' }}>
            48 DIRECT DELIVERY AREAS ACROSS DFW (CLICK TO HIGHLIGHT ON MAP):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {all48MapCities.map((city) => {
              const isSelected = activeCity.slug === city.slug;
              return (
                <button
                  key={city.slug}
                  onClick={() => handleSelectCity(city, 13)}
                  style={{
                    backgroundColor: isSelected ? 'var(--accent-red)' : '#111827',
                    border: isSelected ? '1px solid #ffffff' : '1px solid #1f2937',
                    color: isSelected ? '#ffffff' : '#cbd5e1',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {city.name}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
