export const guideType = {
  name: 'guide',
  title: 'Customer Guides & Articles',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Guide Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Sizing Guide', value: 'Sizing Guide' },
          { title: 'Pricing Guide', value: 'Pricing Guide' },
          { title: 'Size Comparison', value: 'Size Comparison' },
          { title: 'Roofing & Contractors', value: 'Roofing & Contractors' },
          { title: 'Material Guidelines', value: 'Material Guidelines' },
          { title: 'Contractor Tips', value: 'Contractor Tips' },
        ],
      },
      initialValue: 'Sizing Guide',
    },
    {
      name: 'excerpt',
      title: 'Short Excerpt / Meta Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'readTime',
      title: 'Read Time (e.g. 4 min read)',
      type: 'string',
      initialValue: '4 min read',
    },
    {
      name: 'publishDate',
      title: 'Publish Date',
      type: 'string',
      initialValue: 'Published by Lone Wolf Dumpsters',
    },
    {
      name: 'content',
      title: 'Guide Paragraphs / Content',
      type: 'array',
      of: [{ type: 'text' }],
    },
  ],
};
