/**
 * Shared Data Formatters
 * Formats canonical business values into presentational strings.
 * Database/CMS owns the FACTS; components use these helpers to format the SENTENCES.
 */

export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0';
  return `$${amount}`;
}

export function formatTonnage(tons: number, includeLbs: boolean = true): string {
  if (typeof tons !== 'number' || isNaN(tons)) return '0 Tons';
  const formattedTons = Number.isInteger(tons) ? `${tons}.0` : `${tons}`;
  if (!includeLbs) return `${formattedTons} Tons`;
  const lbs = Math.round(tons * 2000).toLocaleString();
  return `${formattedTons} Tons (${lbs} lbs)`;
}

export function formatRentalPeriod(standardDays: string): string {
  return standardDays || '1 to 7 Days';
}

export function formatPhoneNumber(phone: string): string {
  return phone || '(214) 876-0321';
}

export function formatDumpsterSize(sizeYards: number | string): string {
  return `${sizeYards} Yard Dumpster`;
}

export function formatOverageRate(ratePerTon: number): string {
  return `$${ratePerTon} / ton`;
}

export function formatExtraDayRate(ratePerDay: number): string {
  return `$${ratePerDay} / day`;
}
