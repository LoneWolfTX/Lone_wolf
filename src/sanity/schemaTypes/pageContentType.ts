export const pageContentType = {
  name: 'pageContent',
  title: 'Page Content & Hero Images',
  type: 'document',
  fields: [
    { name: 'page', title: 'Page Name', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'heroHeadlineWhite', title: 'Hero Headline (White Text)', type: 'string' },
    { name: 'heroHeadlineRed', title: 'Hero Headline (Red Text)', type: 'string' },
    { name: 'heroDescription', title: 'Hero Subtext / Description', type: 'text', rows: 3 },
    { name: 'heroImage', title: 'Hero Showcase Image', type: 'image' },
    { name: 'closingBannerImage', title: 'Closing CTA Banner Image', type: 'image' },
    { name: 'aboutOwnerPhoto', title: 'About Owner Story Photo', type: 'image' },
  ],
};
