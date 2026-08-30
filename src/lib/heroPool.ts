/**
 * heroPool.ts
 *
 * Deterministic hero-pool system for the 48 city pages using 8 real Lone Wolf photographs.
 * Uses accurate general alt text ("Lone Wolf Dumpster Delivery in Dallas-Fort Worth").
 */

export const CITY_HERO_POOL = [
  '/images/lone-wolf/lone_wolf_hero_top.png',
  '/images/lone-wolf/lone_wolf_hero_residential.png',
  '/images/lone-wolf/lone_wolf_hero_construction.png',
  '/images/lone-wolf/lone_wolf_hero_debris.png',
];

export function getCityHeroImage(citySlug: string): string {
  let hash = 0;
  for (let i = 0; i < citySlug.length; i++) {
    hash = (hash * 31 + citySlug.charCodeAt(i)) % 2147483647;
  }
  const index = Math.abs(hash) % CITY_HERO_POOL.length;
  return CITY_HERO_POOL[index];
}

export function getCityHeroAlt(cityName: string): string {
  return `Lone Wolf roll-off dumpster service in the Dallas-Fort Worth area`;
}
