import { schemaTypes } from './src/sanity/schemaTypes';

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lonewolf-dumpsters',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  title: 'Lone Wolf Dumpsters CMS Studio',
  apiVersion: '2026-08-19',
  basePath: '/studio',
  schema: {
    types: schemaTypes,
  },
};
