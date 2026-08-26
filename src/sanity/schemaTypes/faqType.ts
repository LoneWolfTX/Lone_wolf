export const faqType = {
  name: 'faq',
  title: 'Frequently Asked Questions (FAQs)',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (Rule: any) => Rule.required() },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Pricing & Weight Limits', value: 'pricing' },
          { title: 'Booking & Sizing', value: 'booking' },
          { title: 'Placement & Driveway Care', value: 'placement' },
          { title: 'Materials & Regulations', value: 'materials' },
        ],
      },
      initialValue: 'pricing',
    },
    { name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 1 },
    { name: 'active', title: 'Active on Website', type: 'boolean', initialValue: true },
  ],
};
