export function getQuoteUrl(pathname?: string): string {
  if (!pathname) return '/contact/#quote';

  const cleanPath = pathname.toLowerCase().trim();

  // Pages that actually render <QuoteForm id="quote" /> or <FreeQuoteForm id="quote" />:
  // - Homepage ("/")
  // - Contact page ("/contact")
  // - Single dumpster pages ("/dumpster-rentals/15-yard", "/dumpster-rentals/20-yard", "/dumpster-rentals/25-yard")
  // - Dynamic City pages ("/service-areas/[city]", e.g. "/service-areas/arlington")
  if (
    cleanPath === '/' ||
    cleanPath === '/contact' ||
    cleanPath === '/dumpster-rentals/15-yard' ||
    cleanPath === '/dumpster-rentals/20-yard' ||
    cleanPath === '/dumpster-rentals/25-yard'
  ) {
    return '#quote';
  }

  if (
    cleanPath.startsWith('/service-areas/') &&
    cleanPath !== '/service-areas/' &&
    cleanPath !== '/service-areas'
  ) {
    return '#quote';
  }

  return '/contact/#quote';
}
