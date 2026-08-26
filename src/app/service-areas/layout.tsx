import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Areas | Dumpster Rental Across 48 DFW Cities',
  description: 'Roll-off dumpster rental service area directory across Tarrant, Dallas, and Denton Counties. Delivering 15, 20, and 25-yard driveway-safe containers.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/service-areas',
  },
  openGraph: {
    title: 'Service Areas | Lone Wolf Dumpsters DFW',
    description: 'Roll-off dumpster rental service area directory across 48 DFW Cities in Tarrant, Dallas, and Denton Counties.',
    url: 'https://lonewolfdumpsters.com/service-areas',
    type: 'website',
  },
};

export default function ServiceAreasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
