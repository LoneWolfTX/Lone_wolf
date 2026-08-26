export interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  quote: string;
  source: string;
}

export const googleReviews: GoogleReview[] = [
  {
    id: 'rev-1',
    author: 'Rick M.',
    rating: 5,
    quote: 'Incredible services. I highly recommend using Lone Wolf Dumpsters. Very fast, reliable and personable.',
    source: 'Google Review',
  },
  {
    id: 'rev-2',
    author: 'Justin C.',
    rating: 5,
    quote: 'Great experience!! Professional and on time, highly recommend to anyone.',
    source: 'Google Review',
  },
  {
    id: 'rev-3',
    author: 'Jonathan M.',
    rating: 5,
    quote: 'On time drop off and pick up. Excellent service and price. Wayne has got it covered!',
    source: 'Google Review',
  },
  {
    id: 'rev-4',
    author: 'Alfonso G.',
    rating: 5,
    quote: 'Wayne was excellent. Lone Wolf Dumpster service had great pricing and delivery service. If you need dumpster service I would definitely recommend him.',
    source: 'Google Review',
  },
  {
    id: 'rev-5',
    author: 'Rellim Ranch',
    rating: 5,
    quote: 'Great company, easy to work with and very fair prices! 10/10 will use again and very highly recommend! Filled this thing up!!!',
    source: 'Google Review',
  },
  {
    id: 'rev-6',
    author: 'Daniel E.',
    rating: 5,
    quote: 'Great service and affordable! He had no surprise fees which is great! Definitely recommend!',
    source: 'Google Review',
  },
];
