import type { Metadata } from 'next';
import Script from 'next/script';
import { oswald, inter } from './fonts';
import '@/styles/globals.css';
import 'leaflet/dist/leaflet.css';
import { siteSettings } from '@/data/siteSettings';
import { seoConfig } from '@/data/seoConfig';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MobileStickyBar } from '@/components/layout/MobileStickyBar';

export const metadata: Metadata = {
  title: `${siteSettings.businessName} | Fast & Affordable Dumpster Rentals DFW`,
  description: seoConfig.defaultDescription,
  metadataBase: new URL('https://lonewolfdumpsters.com'),
  openGraph: {
    title: `${siteSettings.businessName} | DFW Dumpster Rental`,
    description: seoConfig.defaultDescription,
    url: 'https://lonewolfdumpsters.com',
    siteName: siteSettings.businessName,
    images: [
      {
        url: seoConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteSettings.businessName} Roll-off dumpsters in Dallas-Fort Worth`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || siteSettings.tracking?.gtmId;
  const gaId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ||
    siteSettings.tracking?.ga4MeasurementId ||
    siteSettings.tracking?.googleAdsId;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || siteSettings.tracking?.metaPixelId;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteSettings.businessName,
    image: 'https://lonewolfdumpsters.com/images/lone-wolf/logo.png',
    telephone: siteSettings.contact.phone,
    email: siteSettings.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteSettings.yard.address,
      addressLocality: siteSettings.yard.city,
      addressRegion: siteSettings.yard.state,
      postalCode: siteSettings.yard.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '32.8854',
      longitude: '-97.1472',
    },
    url: 'https://lonewolfdumpsters.com',
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '06:00',
        closes: '18:00',
      },
    ],
  };

  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Tag Manager Script (if configured) */}
        {gtmId && (
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}

        {/* Google Analytics / Google Ads gtag (if configured) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`,
              }}
            />
          </>
        )}

        {/* Meta Pixel (Facebook) (if configured) */}
        {pixelId && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');`,
            }}
          />
        )}
      </head>
      <body>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <SiteHeader />
        <main className="page-transition-wrapper">{children}</main>
        <SiteFooter />
        <MobileStickyBar />
      </body>
    </html>
  );
}
