export interface NeighborhoodTestimonial {
  name: string
  quote: string
  stars: number
}

export interface Neighborhood {
  slug: string
  name: string
  headline: string
  subheadline: string
  description: string
  seoTitle: string
  seoDescription: string
  testimonials: NeighborhoodTestimonial[]
}

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: 'sugar-house',
    name: 'Sugar House',
    headline: 'Premium cleaning, now in Sugar House.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving Sugar House and surrounding streets.',
    seoTitle: 'Sugar House House Cleaning Service — Crisp Home Co.',
    seoDescription: 'Professional flat-rate home cleaning in Sugar House, Salt Lake City. Instant pricing, no callbacks. Book in under 2 minutes.',
    testimonials: [
      { name: 'Rachel T., Sugar House', quote: 'I booked on a Tuesday and they were here Thursday. The apartment was spotless — better than when I moved in.', stars: 5 },
      { name: 'Marcus D., Sugar House', quote: 'Finally a cleaning company that just tells you the price upfront. No "we need to come assess it first." Just booked it and it was done.', stars: 5 },
    ],
  },
  {
    slug: 'the-avenues',
    name: 'The Avenues',
    headline: 'Premium cleaning, now in The Avenues.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving The Avenues neighborhood and surrounding streets.',
    seoTitle: 'The Avenues House Cleaning Service Salt Lake City — Crisp Home Co.',
    seoDescription: 'Professional flat-rate home cleaning in The Avenues, Salt Lake City. Instant online pricing, vetted cleaners. Book in 2 minutes.',
    testimonials: [
      { name: 'Diane H., The Avenues', quote: 'Our Victorian home has some tricky nooks and they handled every single one. Incredibly thorough.', stars: 5 },
      { name: 'Tom W., The Avenues', quote: 'We\'ve tried three other services. Crisp is the only one that consistently meets our standards.', stars: 5 },
    ],
  },
  {
    slug: 'liberty-wells',
    name: 'Liberty Wells',
    headline: 'Premium cleaning, now in Liberty Wells.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving Liberty Wells and surrounding streets.',
    seoTitle: 'Liberty Wells House Cleaning Salt Lake City — Crisp Home Co.',
    seoDescription: 'Flat-rate home cleaning in Liberty Wells, SLC. See your exact price instantly — no quotes, no callbacks. Book online in minutes.',
    testimonials: [
      { name: 'Priya N., Liberty Wells', quote: 'Best value cleaning service I\'ve found in SLC. Transparent pricing and they show up exactly when they say they will.', stars: 5 },
      { name: 'Jake M., Liberty Wells', quote: 'Used them for a move-out clean. Got my full deposit back. Worth every penny.', stars: 5 },
    ],
  },
  {
    slug: 'east-bench',
    name: 'East Bench',
    headline: 'Premium cleaning, now in East Bench.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving East Bench and the foothills neighborhoods.',
    seoTitle: 'East Bench House Cleaning Salt Lake City — Crisp Home Co.',
    seoDescription: 'Professional home cleaning in East Bench, Salt Lake City. Flat-rate pricing, vetted cleaners, instant online booking.',
    testimonials: [
      { name: 'Sandra K., East Bench', quote: 'I was skeptical about booking cleaning online but the pricing was so clear I just went for it. Zero regrets.', stars: 5 },
      { name: 'Chris L., East Bench', quote: 'Switched from our old service after the first clean. The difference was immediately obvious.', stars: 5 },
    ],
  },
  {
    slug: 'millcreek',
    name: 'Millcreek',
    headline: 'Premium cleaning, now in Millcreek.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving Millcreek and surrounding neighborhoods.',
    seoTitle: 'Millcreek House Cleaning Service Utah — Crisp Home Co.',
    seoDescription: 'Top-rated flat-rate home cleaning in Millcreek, UT. Book online in 2 minutes. No hourly billing, no surprises.',
    testimonials: [
      { name: 'Amy R., Millcreek', quote: 'Hired them for a bi-weekly plan and it\'s been the best recurring purchase I\'ve made all year. House stays consistently clean.', stars: 5 },
      { name: 'David S., Millcreek', quote: 'Professional, on-time, and thorough. The online booking experience alone puts them ahead of anyone else.', stars: 5 },
    ],
  },
  {
    slug: 'holladay',
    name: 'Holladay',
    headline: 'Premium cleaning, now in Holladay.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving Holladay and surrounding neighborhoods.',
    seoTitle: 'Holladay House Cleaning Service Utah — Crisp Home Co.',
    seoDescription: 'Professional home cleaning in Holladay, UT. Flat-rate pricing, instant online booking, vetted cleaners.',
    testimonials: [
      { name: 'Lisa B., Holladay', quote: 'We have a large home and finally found a service that prices fairly without the runaround. Crisp is fantastic.', stars: 5 },
      { name: 'Kevin J., Holladay', quote: 'Their deep clean before our family reunion was impeccable. Already booked them monthly.', stars: 5 },
    ],
  },
  {
    slug: 'foothill',
    name: 'Foothill',
    headline: 'Premium cleaning, now in Foothill.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving the Foothill neighborhood and University area.',
    seoTitle: 'Foothill Salt Lake City House Cleaning — Crisp Home Co.',
    seoDescription: 'Flat-rate home cleaning in Foothill, Salt Lake City. Book instantly online. Reliable, vetted cleaners.',
    testimonials: [
      { name: 'Morgan P., Foothill', quote: 'Quick, professional and the price was exactly what the website said. No surprise fees.', stars: 5 },
      { name: 'Natalie F., Foothill', quote: 'I run a short-term rental and use Crisp between every guest. Turnover cleans are seamless.', stars: 5 },
    ],
  },
  {
    slug: 'federal-heights',
    name: 'Federal Heights',
    headline: 'Premium cleaning, now in Federal Heights.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving Federal Heights and Capitol Hill area.',
    seoTitle: 'Federal Heights House Cleaning Salt Lake City — Crisp Home Co.',
    seoDescription: 'Premium flat-rate home cleaning in Federal Heights, SLC. Instant pricing, trusted cleaners, book online.',
    testimonials: [
      { name: 'Helen C., Federal Heights', quote: 'The attention to detail is exceptional. My home hasn\'t looked this good since we moved in.', stars: 5 },
      { name: 'Robert M., Federal Heights', quote: 'Reliable, respectful, and really good at what they do. Highly recommend.', stars: 5 },
    ],
  },
  {
    slug: 'yalecrest',
    name: 'Yalecrest',
    headline: 'Premium cleaning, now in Yalecrest.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving Yalecrest and Harvard-Yale neighborhood.',
    seoTitle: 'Yalecrest House Cleaning Salt Lake City — Crisp Home Co.',
    seoDescription: 'Professional home cleaning in Yalecrest, Salt Lake City. Transparent flat-rate pricing. Book in under 2 minutes.',
    testimonials: [
      { name: 'Carol A., Yalecrest', quote: 'Finally a cleaning service that treats your home like the investment it is. Exceptional quality.', stars: 5 },
      { name: 'Ben T., Yalecrest', quote: 'Crisp handles our bi-weekly clean and we couldn\'t be happier. Consistent every single time.', stars: 5 },
    ],
  },
  {
    slug: 'capitol-hill',
    name: 'Capitol Hill',
    headline: 'Premium cleaning, now in Capitol Hill.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving Capitol Hill and surrounding neighborhoods.',
    seoTitle: 'Capitol Hill Salt Lake City House Cleaning — Crisp Home Co.',
    seoDescription: 'Flat-rate home cleaning in Capitol Hill, SLC. No hourly rates, no callbacks. See your price instantly and book online.',
    testimonials: [
      { name: 'Patricia V., Capitol Hill', quote: 'Used them for a move-in clean on our new place. Absolutely perfect from top to bottom.', stars: 5 },
      { name: 'Ethan R., Capitol Hill', quote: 'Great communication, great results. The whole process from booking to completion was seamless.', stars: 5 },
    ],
  },
  {
    slug: 'cottonwood-heights',
    name: 'Cottonwood Heights',
    headline: 'Premium cleaning, now in Cottonwood Heights.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving Cottonwood Heights and surrounding neighborhoods.',
    seoTitle: 'Cottonwood Heights House Cleaning Service — Crisp Home Co.',
    seoDescription: 'Professional home cleaning in Cottonwood Heights, UT. Flat-rate pricing, instant booking, trusted cleaners.',
    testimonials: [
      { name: 'Michelle W., Cottonwood Heights', quote: 'Worth every dollar. Our home has never been cleaner and the whole experience was effortless.', stars: 5 },
      { name: 'James H., Cottonwood Heights', quote: 'Switched from another local service and the quality difference is night and day.', stars: 5 },
    ],
  },
  {
    slug: 'murray',
    name: 'Murray',
    headline: 'Premium cleaning, now in Murray.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving Murray and surrounding neighborhoods.',
    seoTitle: 'Murray Utah House Cleaning Service — Crisp Home Co.',
    seoDescription: 'Affordable flat-rate home cleaning in Murray, UT. Know your price before you book. No hourly billing.',
    testimonials: [
      { name: 'Jennifer O., Murray', quote: 'I was amazed at how thorough the first clean was. They got every corner. So glad I found them.', stars: 5 },
      { name: 'Steve G., Murray', quote: 'Great value, great service. The flat-rate model means I always know exactly what I\'m paying.', stars: 5 },
    ],
  },
  {
    slug: 'rose-park',
    name: 'Rose Park',
    headline: 'Premium cleaning, now in Rose Park.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving Rose Park and surrounding neighborhoods.',
    seoTitle: 'Rose Park Salt Lake City House Cleaning — Crisp Home Co.',
    seoDescription: 'Reliable flat-rate home cleaning in Rose Park, SLC. Book online in minutes. No surprise fees.',
    testimonials: [
      { name: 'Angela D., Rose Park', quote: 'Fast booking, fair prices, excellent clean. This is exactly what our neighborhood needed.', stars: 5 },
      { name: 'Luis M., Rose Park', quote: 'Hired them for a one-time deep clean and immediately signed up for monthly service.', stars: 5 },
    ],
  },
  {
    slug: 'taylorsville',
    name: 'Taylorsville',
    headline: 'Premium cleaning, now in Taylorsville.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving Taylorsville and surrounding neighborhoods.',
    seoTitle: 'Taylorsville Utah House Cleaning Service — Crisp Home Co.',
    seoDescription: 'Professional home cleaning in Taylorsville, UT. Flat-rate pricing, instant online booking, vetted cleaners.',
    testimonials: [
      { name: 'Brenda K., Taylorsville', quote: 'Responsive, professional and incredibly thorough. Best cleaning service I\'ve used in years.', stars: 5 },
      { name: 'Carl N., Taylorsville', quote: 'Super easy to book and the cleaner did a fantastic job. Will absolutely use again.', stars: 5 },
    ],
  },
  {
    slug: 'draper',
    name: 'Draper',
    headline: 'Premium cleaning, now in Draper.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving Draper and surrounding neighborhoods.',
    seoTitle: 'Draper Utah House Cleaning Service — Crisp Home Co.',
    seoDescription: 'Premium flat-rate home cleaning in Draper, UT. Instant pricing, no callbacks, book online in 2 minutes.',
    testimonials: [
      { name: 'Tiffany L., Draper', quote: 'Our home is on the larger side and Crisp handled it perfectly. Pricing was fair and transparent.', stars: 5 },
      { name: 'Ryan P., Draper', quote: 'Booked for a recurring bi-weekly and I\'m never going back to my old service. Night and day difference.', stars: 5 },
    ],
  },
  {
    slug: 'west-jordan',
    name: 'West Jordan',
    headline: 'Premium cleaning, now in West Jordan.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving West Jordan and surrounding neighborhoods.',
    seoTitle: 'West Jordan Utah House Cleaning Service — Crisp Home Co.',
    seoDescription: 'Affordable flat-rate home cleaning in West Jordan, UT. Know your exact price before you book. No hourly rates.',
    testimonials: [
      { name: 'Karen S., West Jordan', quote: 'Affordable, reliable, and they do a great job every time. Really glad to have them available here.', stars: 5 },
      { name: 'Tony B., West Jordan', quote: 'The flat-rate pricing is a game changer. I know exactly what I\'m paying every month.', stars: 5 },
    ],
  },
  {
    slug: 'sandy',
    name: 'Sandy',
    headline: 'Premium cleaning, now in Sandy.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving Sandy and surrounding neighborhoods in the south valley.',
    seoTitle: 'Sandy Utah House Cleaning Service — Crisp Home Co.',
    seoDescription: 'Professional flat-rate home cleaning in Sandy, UT. Vetted cleaners, instant pricing, same-week availability. Book in under 2 minutes.',
    testimonials: [
      { name: 'Jennifer M., Sandy', quote: 'Booked online in literally 2 minutes. They showed up on time and left our home spotless. We\'re on a bi-weekly plan now.', stars: 5 },
      { name: 'David R., Sandy', quote: 'Crisp Home Co. is the best cleaning service we\'ve used in Sandy. Consistent, professional, and fairly priced.', stars: 5 },
    ],
  },
  {
    slug: 'south-salt-lake',
    name: 'South Salt Lake',
    headline: 'Premium cleaning, now in South Salt Lake.',
    subheadline: 'Flat-rate pricing. No callbacks. Book in under 2 minutes.',
    description: 'Serving South Salt Lake City and surrounding areas.',
    seoTitle: 'South Salt Lake House Cleaning Service — Crisp Home Co.',
    seoDescription: 'Professional flat-rate home cleaning in South Salt Lake, UT. Instant online pricing, vetted cleaners, same-week availability.',
    testimonials: [
      { name: 'Amanda L., South Salt Lake', quote: 'Finally found a cleaning company that doesn\'t make you wait for a quote. Booked it, they came, done. Perfect.', stars: 5 },
      { name: 'Chris P., South Salt Lake', quote: 'Very professional and thorough. Our place looked better than it ever has. Will definitely be booking again.', stars: 5 },
    ],
  },
]

export const NEIGHBORHOOD_SLUGS = NEIGHBORHOODS.map(n => n.slug)

export function getNeighborhood(slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find(n => n.slug === slug)
}
