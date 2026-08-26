export const pricingType = {
  name: 'pricing',
  title: 'Dumpster Pricing & Rates',
  type: 'document',
  fields: [
    {
      name: 'fifteenYardPrice',
      title: '15 Yard Starting Price ($)',
      type: 'number',
      initialValue: 385,
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'twentyYardPrice',
      title: '20 Yard Starting Price ($)',
      type: 'number',
      initialValue: 425,
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'twentyFiveYardPrice',
      title: '25 Yard Starting Price ($)',
      type: 'number',
      initialValue: 475,
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'extraDayPrice',
      title: 'Additional Day Price ($/day)',
      type: 'number',
      initialValue: 20,
    },
    {
      name: 'extraTonnageFee',
      title: 'Extra Tonnage Fee ($/ton)',
      type: 'number',
      initialValue: 80,
    },
    {
      name: 'junkRemovalStartingPrice',
      title: 'Junk Removal Starting Price ($)',
      type: 'number',
      initialValue: 150,
    },
  ],
};
