export const locationType = {
  name: 'location',
  title: 'Service Area Locations (Cities)',
  type: 'document',
  fields: [
    {
      name: 'cityName',
      title: 'City Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'cityName',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'county',
      title: 'County',
      type: 'string',
      options: {
        list: [
          { title: 'Tarrant County', value: 'Tarrant County' },
          { title: 'Dallas County', value: 'Dallas County' },
          { title: 'Denton County', value: 'Denton County' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'active',
      title: 'Active Delivery Service',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'zipCodes',
      title: 'Served ZIP Codes',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'localIntro',
      title: 'Custom Local SEO Headline / Intro',
      type: 'text',
    },
    {
      name: 'neighborhoods',
      title: 'Key Neighborhoods / Communities',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
};
