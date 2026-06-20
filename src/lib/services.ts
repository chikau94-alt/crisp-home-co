export interface ServicePage {
  slug:          string
  seoTitle:      string
  seoDescription: string
  hero:          { headline: string; subheadline: string }
  promoCode?:    string
  badge?:        string
  features:      { title: string; body: string }[]
  pricing:       { label: string; price: string; note?: string }[]
  faq:           { q: string; a: string }[]
  cta:           { headline: string; sub: string; button: string }
  schema:        'Service' | 'LocalBusiness'
}

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug:           'move-out-cleaning',
    seoTitle:       'Move-Out Cleaning Salt Lake City | Get Your Deposit Back | Crisp Home Co.',
    seoDescription: 'Professional move-out cleaning in Salt Lake City. Flat-rate pricing, vetted cleaners, same-week availability. The best way to get your full security deposit back.',
    hero: {
      headline:    'Move Out Clean. Deposit Back.',
      subheadline: 'Professional move-out cleaning across Salt Lake City. Flat-rate pricing — know your exact cost before you book.',
    },
    badge: 'Most booked before move-out',
    features: [
      { title: 'Inside oven & fridge included', body: 'Most services charge extra. Ours doesn\'t. Both are standard on every move-out clean.' },
      { title: 'Empty-home specialists', body: 'We clean after you\'ve moved out — giving us full access to every corner, baseboard, and surface.' },
      { title: 'Landlord-ready results', body: 'We clean to professional inspection standards. Our clients get their deposits back.' },
      { title: 'Same-week availability', body: 'Moving timelines are tight. We can usually be there within 2 days of your move-out date.' },
    ],
    pricing: [
      { label: 'Under 1,500 sq ft', price: '$220', note: 'Includes oven + fridge' },
      { label: '1,500–2,500 sq ft', price: '$300', note: 'Includes oven + fridge' },
      { label: '2,500–3,500 sq ft', price: '$390', note: 'Includes oven + fridge' },
      { label: '3,500–4,500 sq ft', price: '$480', note: 'Includes oven + fridge' },
    ],
    faq: [
      { q: 'Should I be present during the clean?', a: 'No — most clients leave a key or use a lockbox. We\'ll handle everything and let you know when we\'re done.' },
      { q: 'Do you clean before or after I move out?', a: 'After. An empty home means we can clean every surface without furniture in the way.' },
      { q: 'What if my landlord isn\'t satisfied?', a: 'Contact us within 24 hours and we\'ll return to address any concerns at no charge.' },
      { q: 'Do you serve the whole SLC valley?', a: 'Yes — Salt Lake City, Sugar House, The Avenues, Millcreek, Holladay, Cottonwood Heights, Murray, and more.' },
    ],
    cta: { headline: 'Book your move-out clean today.', sub: 'Same-week availability. Flat-rate pricing. Get your deposit back.', button: 'See My Price →' },
    schema: 'Service',
  },
  {
    slug:           'airbnb-cleaning',
    seoTitle:       'Airbnb Cleaning Service Salt Lake City | Crisp Home Co.',
    seoDescription: 'Reliable Airbnb turnover cleaning in Salt Lake City. Flat-rate pricing between every guest. Keep your 5-star rating without the stress.',
    hero: {
      headline:    'Protect Your 5-Star Rating.',
      subheadline: 'Professional Airbnb turnover cleaning across Salt Lake City. Consistent results, flat-rate pricing, same-week availability.',
    },
    badge: 'Trusted by SLC hosts',
    features: [
      { title: 'Full turnover reset', body: 'Every visit is treated as a fresh start — floors, bathrooms, kitchen, beds, and every surface guests will touch.' },
      { title: 'Flat-rate per turnover', body: 'Know your cleaning cost before every guest checks out. No hourly billing, no surprise fees.' },
      { title: 'Consistent standards', body: 'The same cleaning checklist, every time. Your guests always arrive to the same crisp experience.' },
      { title: 'Flexible scheduling', body: 'Same-week bookings available. We work around your guest calendar.' },
    ],
    pricing: [
      { label: 'Under 1,500 sq ft', price: '$220', note: 'Per turnover' },
      { label: '1,500–2,500 sq ft', price: '$300', note: 'Per turnover' },
      { label: '2,500–3,500 sq ft', price: '$390', note: 'Per turnover' },
      { label: '3,500–4,500 sq ft', price: '$480', note: 'Per turnover' },
    ],
    faq: [
      { q: 'Can you clean between back-to-back guests?', a: 'Yes — we offer same-day turnovers when scheduled in advance. Let us know your check-in/check-out times when booking.' },
      { q: 'Do you restock supplies?', a: 'We can arrange amenity restocking if you pre-stock supplies on site. Let us know in your booking notes.' },
      { q: 'How do I give you access?', a: 'Most hosts use a lockbox or smart lock code. Include access instructions in your booking notes.' },
      { q: 'Can I set up recurring turnovers?', a: 'Yes — we recommend booking each turnover individually so timing matches your guest calendar.' },
    ],
    cta: { headline: 'Keep your listing at 5 stars.', sub: 'Flat-rate Airbnb cleaning across Salt Lake City. Book your first turnover today.', button: 'Book a Turnover Clean →' },
    schema: 'Service',
  },
  {
    slug:           'deep-cleaning',
    seoTitle:       'Deep Cleaning Service Salt Lake City | Crisp Home Co.',
    seoDescription: 'Professional deep cleaning in Salt Lake City. Flat-rate pricing, vetted cleaners, same-week availability. Every first clean is a deep clean.',
    hero: {
      headline:    'A Clean That Actually Goes Deep.',
      subheadline: 'Not a quick wipe-down. A real deep clean — every surface, every corner, every room. Flat-rate pricing across Salt Lake City.',
    },
    badge: 'Every first clean is a deep clean',
    features: [
      { title: 'No surface skipped', body: 'Baseboards, door frames, window sills, ceiling fans, light switches — everything a regular clean misses.' },
      { title: 'Inside appliances', body: 'Inside the oven and fridge are available as add-ons. Most clients add both for their first deep clean.' },
      { title: 'Grout and tile detail', body: 'Bathroom and kitchen grout gets scrubbed, not just wiped. The difference is visible.' },
      { title: 'The right first step', body: 'Every new Crisp client starts with a deep clean. It\'s our baseline before shifting into maintenance mode.' },
    ],
    pricing: [
      { label: 'Under 1,500 sq ft', price: '$220' },
      { label: '1,500–2,500 sq ft', price: '$300' },
      { label: '2,500–3,500 sq ft', price: '$390' },
      { label: '3,500–4,500 sq ft', price: '$480' },
    ],
    faq: [
      { q: 'How is a deep clean different from a regular clean?', a: 'A deep clean covers everything a regular clean does, plus baseboards, inside appliances, grout, cabinet interiors, window sills, and more.' },
      { q: 'How long does a deep clean take?', a: 'Typically 3–6 hours depending on home size and condition. You don\'t need to be home.' },
      { q: 'Do I need a deep clean if my home is already pretty clean?', a: 'If you haven\'t had a professional clean in 3+ months, yes. It gives us a clean slate to maintain going forward.' },
      { q: 'What should I do to prepare?', a: 'Clear surfaces of personal clutter. We\'ll handle everything else.' },
    ],
    cta: { headline: 'Start with a deep clean.', sub: 'Every new Crisp client gets a proper deep clean first. See your price instantly.', button: 'Book My Deep Clean →' },
    schema: 'Service',
  },
  {
    slug:           'maid-service',
    seoTitle:       'Maid Service Salt Lake City | Crisp Home Co.',
    seoDescription: 'Professional maid service in Salt Lake City. Background-checked, insured cleaners. Flat-rate pricing, online booking, same-week availability.',
    hero: {
      headline:    'Maid Service, Reinvented.',
      subheadline: 'No callbacks. No hourly billing. No surprises. Just a consistently clean home in Salt Lake City.',
    },
    features: [
      { title: 'Background-checked cleaners', body: 'Every Crisp cleaner is vetted, background-checked, and insured before entering your home.' },
      { title: 'Flat-rate — never hourly', body: 'You know the exact price before you book. It doesn\'t change based on how long it takes.' },
      { title: 'Book in under 2 minutes', body: 'No in-home estimates, no callbacks. Select your home size, pick a date, and you\'re done.' },
      { title: 'Recurring or one-time', body: 'Weekly, bi-weekly, monthly, or one-time — whatever fits your life.' },
    ],
    pricing: [
      { label: 'Weekly (under 1,500 sq ft)', price: '$145/visit' },
      { label: 'Bi-weekly (under 1,500 sq ft)', price: '$160/visit' },
      { label: 'Monthly (under 1,500 sq ft)', price: '$220/visit' },
      { label: 'One-time (under 1,500 sq ft)', price: '$220' },
    ],
    faq: [
      { q: 'What\'s included in a standard maid service visit?', a: 'Full vacuuming and mopping, bathroom scrubbing, kitchen cleaning, dusting, and trash removal. Add-ons like oven cleaning and laundry are available.' },
      { q: 'Do I need to be home?', a: 'No. Most clients give us a key or lockbox code. We\'ll confirm when we arrive and when we\'re done.' },
      { q: 'What if I need to reschedule?', a: 'Contact us and we\'ll find a new time. We ask for reasonable notice when possible.' },
      { q: 'Are your cleaners employees or contractors?', a: 'Our cleaners are vetted local professionals. All are background-checked and carry liability insurance.' },
    ],
    cta: { headline: 'Come home to a crisp house.', sub: 'Salt Lake City\'s premium maid service. Flat-rate, vetted, and reliable.', button: 'See My Price →' },
    schema: 'LocalBusiness',
  },
  {
    slug:           'apartment-cleaning',
    seoTitle:       'Apartment Cleaning Service Salt Lake City | Crisp Home Co.',
    seoDescription: 'Professional apartment cleaning in Salt Lake City. Flat-rate pricing starting at $220. Vetted cleaners, online booking, same-week availability.',
    hero: {
      headline:    'Your Apartment, Always Crisp.',
      subheadline: 'Professional apartment cleaning across Salt Lake City. Flat-rate pricing from $145/visit — no hourly billing, no surprises.',
    },
    badge: 'Starts at $145/visit',
    features: [
      { title: 'Sized for apartments', body: 'Our pricing starts at homes under 1,500 sq ft — perfect for studios, 1-beds, and 2-beds across SLC.' },
      { title: 'Perfect for move-out', body: 'Moving out of your apartment? We clean to landlord standards. Most clients get their full deposit back.' },
      { title: 'Recurring or one-time', body: 'Keep your apartment consistently clean with a bi-weekly plan, or book a one-time deep clean whenever you need it.' },
      { title: 'Fast in-and-out', body: 'Smaller spaces mean faster cleans. Most apartments are done in 2–3 hours.' },
    ],
    pricing: [
      { label: 'Studio / 1 bed (under 1,500 sq ft) — One-time', price: '$220' },
      { label: 'Studio / 1 bed — Bi-weekly', price: '$160/visit' },
      { label: 'Studio / 1 bed — Weekly', price: '$145/visit' },
      { label: '2 bed (1,500–2,500 sq ft) — Bi-weekly', price: '$200/visit' },
    ],
    faq: [
      { q: 'Do you clean apartments in high-rises?', a: 'Yes — as long as we have building access. Note parking instructions in your booking.' },
      { q: 'Can I book a move-out clean for my apartment?', a: 'Absolutely. Our move-out clean covers everything your landlord will check, including inside the oven and fridge.' },
      { q: 'What if my apartment has a loft or unusual layout?', a: 'Select the square footage that best matches your total space. If you\'re unsure, email us at hello@crisphomeco.com.' },
      { q: 'Do you serve all SLC apartment neighborhoods?', a: 'Yes — downtown, Sugar House, The Avenues, Liberty Wells, Capitol Hill, and across the valley.' },
    ],
    cta: { headline: 'Your apartment deserves crisp.', sub: 'Flat-rate apartment cleaning in Salt Lake City. Book in under 2 minutes.', button: 'Book My Apartment Clean →' },
    schema: 'Service',
  },
  {
    slug:           'recurring-cleaning',
    seoTitle:       'Recurring Home Cleaning Service Salt Lake City | Crisp Home Co.',
    seoDescription: 'Weekly and bi-weekly home cleaning in Salt Lake City. Flat-rate recurring plans starting at $145/visit. Come home to crisp, every time.',
    hero: {
      headline:    'Never Think About Cleaning Again.',
      subheadline: 'Weekly and bi-weekly cleaning plans for Salt Lake City homes. Flat-rate pricing, consistent results, automatic scheduling.',
    },
    badge: 'Most popular plan: bi-weekly',
    features: [
      { title: 'Your home, always ready', body: 'A recurring plan means you never hit the "oh no" moment. Your home stays guest-ready, always.' },
      { title: 'Lower per-visit rate', body: 'Recurring plans are priced below one-time rates — a maintained home cleans faster, and we pass on the savings.' },
      { title: 'Card charged after each visit', body: 'Your card is securely saved after your first booking and charged after each completed visit. No invoices, no hassle.' },
      { title: 'First visit is always a deep clean', body: 'Every new recurring client starts with a thorough deep clean. After that, we maintain the standard.' },
    ],
    pricing: [
      { label: 'Weekly (under 1,500 sq ft)', price: '$145/visit', note: 'Best value' },
      { label: 'Bi-weekly (under 1,500 sq ft)', price: '$160/visit', note: 'Most popular' },
      { label: 'Weekly (1,500–2,500 sq ft)', price: '$180/visit' },
      { label: 'Bi-weekly (1,500–2,500 sq ft)', price: '$200/visit' },
    ],
    faq: [
      { q: 'Can I pause or cancel my recurring plan?', a: 'Yes — contact us anytime. We don\'t lock you into a contract.' },
      { q: 'What if I need to skip a visit?', a: 'Let us know and we\'ll skip that week. We ask for reasonable notice so we can adjust our schedule.' },
      { q: 'Do I get the same cleaner every time?', a: 'We aim for consistency. Your cleaner learns your home and preferences over time.' },
      { q: 'How does billing work?', a: 'Your card is charged after each completed visit at the recurring rate. No prepayment required.' },
    ],
    cta: { headline: 'Start your recurring plan.', sub: 'First visit is a deep clean. Every visit after keeps your home consistently crisp.', button: 'Choose My Plan →' },
    schema: 'Service',
  },
  {
    slug:           'same-day-cleaning',
    seoTitle:       'Same-Day House Cleaning Salt Lake City | Crisp Home Co.',
    seoDescription: 'Need a cleaner today in Salt Lake City? Crisp Home Co. offers same-week availability with flat-rate pricing. Book online in under 2 minutes.',
    hero: {
      headline:    'Need It Clean. Today.',
      subheadline: 'Fast availability across Salt Lake City. Book online now and we\'ll be there as soon as this week.',
    },
    badge: 'Same-week availability',
    features: [
      { title: 'Fast online booking', body: 'No callbacks, no waiting. Book online in under 2 minutes and get a confirmed appointment immediately.' },
      { title: 'Same-week slots available', body: 'We keep slots open for last-minute bookings. Check availability for today or tomorrow when you book.' },
      { title: 'Flat-rate — no rush fees', body: 'Urgent doesn\'t mean expensive. Our prices are the same regardless of how quickly you need us.' },
      { title: 'Vetted, ready cleaners', body: 'Our cleaners are professional, background-checked, and ready to go. You don\'t sacrifice quality for speed.' },
    ],
    pricing: [
      { label: 'Under 1,500 sq ft', price: '$220' },
      { label: '1,500–2,500 sq ft', price: '$300' },
      { label: '2,500–3,500 sq ft', price: '$390' },
      { label: '3,500–4,500 sq ft', price: '$480' },
    ],
    faq: [
      { q: 'Can I really get a cleaner today?', a: 'Same-day is subject to availability. We\'ll show you the earliest available slot when you book — often within 24–48 hours.' },
      { q: 'Is there a rush fee for urgent bookings?', a: 'No. Our flat-rate pricing is the same regardless of when you book.' },
      { q: 'What if I need to cancel last minute?', a: 'Contact us as soon as possible. We understand things come up.' },
      { q: 'What areas do you cover for same-week bookings?', a: 'All of Salt Lake City and the greater SLC valley, including Sugar House, The Avenues, Millcreek, Murray, and more.' },
    ],
    cta: { headline: 'Book now. Be clean today.', sub: 'Check availability and get your home cleaned this week. No callbacks, no waiting.', button: 'Check Availability →' },
    schema: 'Service',
  },
  {
    slug:           'post-construction-cleaning',
    seoTitle:       'Post-Construction Cleaning Salt Lake City | Crisp Home Co.',
    seoDescription: 'Professional post-construction and renovation cleaning in Salt Lake City. We remove dust, debris, and residue so your home is move-in ready.',
    hero: {
      headline:    'Construction Done. Now Make It Crisp.',
      subheadline: 'Post-renovation and construction cleaning across Salt Lake City. We remove the dust, debris, and residue so your space is truly ready.',
    },
    badge: 'Renovation specialists',
    features: [
      { title: 'Construction dust is different', body: 'Fine drywall and concrete dust settles everywhere — vents, surfaces, inside cabinets. Standard cleaning misses it. We don\'t.' },
      { title: 'Debris removal', body: 'We remove construction debris, packaging, and waste left by contractors as part of the clean.' },
      { title: 'Surface protection', body: 'New finishes need the right treatment. We use products safe for fresh paint, new countertops, and recently installed flooring.' },
      { title: 'Move-in ready result', body: 'When we\'re done, your space is genuinely ready to live in — not just swept.' },
    ],
    pricing: [
      { label: 'Under 1,500 sq ft', price: '$300+', note: 'Post-construction premium applies' },
      { label: '1,500–2,500 sq ft', price: '$420+', note: 'Post-construction premium applies' },
      { label: '2,500–3,500 sq ft', price: '$540+', note: 'Post-construction premium applies' },
      { label: 'Custom quote for larger projects', price: 'Contact us' },
    ],
    faq: [
      { q: 'How is post-construction cleaning different from a deep clean?', a: 'Construction sites produce specific types of debris — drywall dust, paint splatter, adhesive residue, and packaging waste — that require specialized techniques and products.' },
      { q: 'Do I need to remove the construction debris first?', a: 'Light debris removal is included. For large amounts of construction waste, we recommend having contractors remove bulk materials first.' },
      { q: 'How long does it take?', a: 'Typically 4–8 hours for a full home depending on the size and scope of the renovation.' },
      { q: 'Can you clean during an active renovation?', a: 'We specialize in post-renovation cleans after contractors are done. For mid-renovation cleaning, contact us to discuss.' },
    ],
    cta: { headline: 'Your renovation is done. Let us finish it.', sub: 'Post-construction cleaning across Salt Lake City. Get your home truly move-in ready.', button: 'Get a Quote →' },
    schema: 'Service',
  },
  {
    slug:           'eco-friendly-cleaning',
    seoTitle:       'Eco-Friendly House Cleaning Salt Lake City | Crisp Home Co.',
    seoDescription: 'Green, non-toxic home cleaning in Salt Lake City. Safe for kids, pets, and the environment. Flat-rate pricing, vetted cleaners, online booking.',
    hero: {
      headline:    'Clean Home. Clean Conscience.',
      subheadline: 'Non-toxic, eco-friendly cleaning across Salt Lake City. Safe for your kids, your pets, and your home.',
    },
    badge: 'Non-toxic & pet-safe',
    features: [
      { title: 'Non-toxic products', body: 'We use plant-based, EPA-certified cleaning products that are safe for children and pets — without sacrificing cleaning power.' },
      { title: 'No harsh chemical fumes', body: 'Especially important in SLC\'s inversions. Our products don\'t contribute to indoor air quality problems.' },
      { title: 'Safe for sensitive households', body: 'Families with allergies, asthma, or chemical sensitivities specifically choose Crisp Home Co. for this reason.' },
      { title: 'Same results, cleaner chemistry', body: 'Eco-friendly doesn\'t mean less clean. Our products are chosen because they work — they just don\'t come with a warning label.' },
    ],
    pricing: [
      { label: 'Under 1,500 sq ft — One-time', price: '$220' },
      { label: 'Under 1,500 sq ft — Bi-weekly', price: '$160/visit' },
      { label: '1,500–2,500 sq ft — One-time', price: '$300' },
      { label: '1,500–2,500 sq ft — Bi-weekly', price: '$200/visit' },
    ],
    faq: [
      { q: 'What products do you use?', a: 'We use plant-based, EPA Safer Choice certified products where possible. If you have specific product requirements or allergies, let us know in your booking notes.' },
      { q: 'Is eco-friendly cleaning as effective as conventional cleaning?', a: 'Yes. Modern plant-based cleaners are highly effective. The trade-off in cleaning power is negligible; the trade-off in safety is significant.' },
      { q: 'Can I request specific products?', a: 'If you\'d like us to use products you provide, let us know. Some clients prefer to supply their own cleaners and we\'re happy to accommodate.' },
      { q: 'Are your products safe for pets?', a: 'Yes. We specifically choose pet-safe formulations. Let us know about your pets when booking.' },
    ],
    cta: { headline: 'Safe clean. Happy home.', sub: 'Non-toxic, eco-friendly cleaning in Salt Lake City. Flat-rate pricing, book online.', button: 'Book an Eco-Friendly Clean →' },
    schema: 'Service',
  },
  {
    slug:           'condo-cleaning',
    seoTitle:       'Condo Cleaning Service Salt Lake City | Crisp Home Co.',
    seoDescription: 'Professional condo cleaning in Salt Lake City. Flat-rate pricing, vetted cleaners, same-week availability. Perfect for downtown SLC and Sugar House condos.',
    hero: {
      headline:    'Your Condo, Consistently Crisp.',
      subheadline: 'Professional condo cleaning across Salt Lake City. Flat-rate pricing, online booking, vetted cleaners.',
    },
    features: [
      { title: 'Right-sized pricing', body: 'Condos are typically under 1,500 sq ft. Our base rate starts at $145/visit for recurring plans.' },
      { title: 'Building access experience', body: 'We\'re experienced with high-rises, gated buildings, and parking-limited properties across SLC.' },
      { title: 'Move-in / move-out specialists', body: 'Buying or selling your condo? We clean to professional standards that satisfy buyers and management companies alike.' },
      { title: 'Downtown SLC and Sugar House', body: 'We serve condo buildings throughout the city — from Liberty Wells to The Avenues to Millcreek.' },
    ],
    pricing: [
      { label: 'Under 1,500 sq ft — One-time', price: '$220' },
      { label: 'Under 1,500 sq ft — Bi-weekly', price: '$160/visit' },
      { label: 'Under 1,500 sq ft — Weekly', price: '$145/visit' },
      { label: '1,500–2,500 sq ft — Bi-weekly', price: '$200/visit' },
    ],
    faq: [
      { q: 'How do you handle parking at condo buildings?', a: 'Include parking instructions in your booking notes. Visitor spots, street instructions, or a temporary pass — just let us know.' },
      { q: 'Can you clean my condo before I sell it?', a: 'Absolutely. A professional clean before listing photographs and open houses makes a real difference in buyer perception.' },
      { q: 'Do you clean balconies?', a: 'Light balcony cleaning is available — sweeping, wiping surfaces. Deep balcony work is an add-on. Note it in your booking.' },
      { q: 'What neighborhoods do you serve?', a: 'All of Salt Lake City — downtown, Sugar House, Capitol Hill, Liberty Wells, The Avenues, East Bench, and more.' },
    ],
    cta: { headline: 'Your condo deserves crisp.', sub: 'Flat-rate condo cleaning in Salt Lake City. Book in under 2 minutes.', button: 'Book My Condo Clean →' },
    schema: 'Service',
  },
  {
    slug:           'move-in-cleaning',
    seoTitle:       'Move-In Cleaning Salt Lake City | Start Fresh | Crisp Home Co.',
    seoDescription: 'Professional move-in cleaning in Salt Lake City. Start fresh in your new home with a thorough deep clean before you unpack. Flat-rate pricing.',
    hero: {
      headline:    'Start Fresh in Your New Home.',
      subheadline: 'A professional move-in clean before you unpack means you know exactly what\'s clean — and what\'s yours.',
    },
    badge: 'Book before move-in day',
    features: [
      { title: 'Clean before you unpack', body: 'It\'s much easier to deep clean an empty home. Book for the day before your furniture arrives.' },
      { title: 'Previous tenant residue gone', body: 'We clean what the last residents left behind — inside cabinets, behind appliances, every corner.' },
      { title: 'Inside every appliance', body: 'Fridge and oven cleaning are available as add-ons — essential when moving into a home you didn\'t move out of.' },
      { title: 'Start with a clean slate', body: 'Your first days in a new home should feel fresh. Not like someone else\'s.' },
    ],
    pricing: [
      { label: 'Under 1,500 sq ft', price: '$220', note: 'Includes inside oven + fridge add-ons recommended' },
      { label: '1,500–2,500 sq ft', price: '$300' },
      { label: '2,500–3,500 sq ft', price: '$390' },
      { label: '3,500–4,500 sq ft', price: '$480' },
    ],
    faq: [
      { q: 'When should I schedule the move-in clean?', a: 'Ideally the day before your furniture arrives. An empty home is much easier to clean thoroughly.' },
      { q: 'Should I add inside oven and fridge?', a: 'Yes — especially when moving into someone else\'s home. Both are available as add-ons at checkout.' },
      { q: 'Do you serve both houses and apartments?', a: 'Yes — any SLC residential property across the valley.' },
      { q: 'What if the previous tenants left a mess?', a: 'The heavy/extra dirty add-on applies a 20% surcharge for homes that need extra attention. Select it at checkout if applicable.' },
    ],
    cta: { headline: 'Start crisp in your new home.', sub: 'Book your move-in clean before you unpack. Salt Lake City and the whole SLC valley.', button: 'Book My Move-In Clean →' },
    schema: 'Service',
  },
  {
    slug:           'house-cleaning-near-me',
    seoTitle:       'House Cleaning Near Me — Salt Lake City | Crisp Home Co.',
    seoDescription: 'Looking for house cleaning near you in Salt Lake City? Crisp Home Co. serves the entire SLC valley with flat-rate pricing and same-week availability.',
    hero: {
      headline:    'Premium Cleaning, Right in Your Neighborhood.',
      subheadline: 'Serving all of Salt Lake City and the greater SLC valley. Flat-rate pricing, vetted cleaners, same-week availability.',
    },
    features: [
      { title: 'We know SLC', body: 'Crisp Home Co. was built for Salt Lake City homeowners — from Sugar House bungalows to Holladay estates.' },
      { title: 'All SLC neighborhoods', body: 'Sugar House, The Avenues, Liberty Wells, Millcreek, East Bench, Capitol Hill, Murray, Holladay, Cottonwood Heights, and more.' },
      { title: 'Flat-rate — no matter where you are', body: 'Our pricing is based on home size, not location. You pay the same in Sugar House as in Draper.' },
      { title: 'Local cleaners who live here', body: 'Our cleaners are SLC locals. They know the valley, the neighborhoods, and the homes.' },
    ],
    pricing: [
      { label: 'Under 1,500 sq ft — One-time', price: '$220' },
      { label: 'Under 1,500 sq ft — Bi-weekly', price: '$160/visit' },
      { label: '1,500–2,500 sq ft — One-time', price: '$300' },
      { label: '1,500–2,500 sq ft — Bi-weekly', price: '$200/visit' },
    ],
    faq: [
      { q: 'What areas do you serve?', a: 'All of Salt Lake City proper, plus Sugar House, The Avenues, Liberty Wells, Millcreek, Holladay, East Bench, Capitol Hill, Cottonwood Heights, Murray, Taylorsville, Draper, and West Jordan.' },
      { q: 'Is there a travel fee for far suburbs?', a: 'No travel fees. Flat-rate pricing based on home size, anywhere in the SLC valley.' },
      { q: 'How do I know if you serve my address?', a: 'Book online and enter your address. If we can\'t serve your location, we\'ll let you know immediately.' },
      { q: 'How quickly can you get to me?', a: 'Same-week availability across the valley. Most bookings are scheduled within 2–3 days.' },
    ],
    cta: { headline: 'Your neighborhood. Our cleaners.', sub: 'Crisp Home Co. serves all of Salt Lake City. See your price and book online.', button: 'See My Price →' },
    schema: 'LocalBusiness',
  },
  {
    slug:           'office-cleaning',
    seoTitle:       'Small Office Cleaning Salt Lake City | Crisp Home Co.',
    seoDescription: 'Professional small office and studio cleaning in Salt Lake City. Flat-rate pricing, flexible scheduling, vetted cleaners. Keep your workspace crisp.',
    hero: {
      headline:    'A Crisp Workspace, Every Week.',
      subheadline: 'Small office and studio cleaning across Salt Lake City. Flat-rate pricing, flexible scheduling, professional results.',
    },
    badge: 'Studios & small offices',
    features: [
      { title: 'Right for small offices', body: 'We specialize in small offices, studios, therapy practices, and creative spaces — typically under 2,500 sq ft.' },
      { title: 'Flexible scheduling', body: 'Early morning, evening, or weekend appointments available so cleaning doesn\'t interrupt your workday.' },
      { title: 'Consistent weekly standard', body: 'A clean office signals professionalism to clients and creates a better environment for your team.' },
      { title: 'Same flat-rate pricing', body: 'Our residential pricing applies to comparable commercial spaces. No hidden commercial markups.' },
    ],
    pricing: [
      { label: 'Under 1,500 sq ft — Weekly', price: '$145/visit' },
      { label: 'Under 1,500 sq ft — Bi-weekly', price: '$160/visit' },
      { label: '1,500–2,500 sq ft — Weekly', price: '$180/visit' },
      { label: '1,500–2,500 sq ft — Bi-weekly', price: '$200/visit' },
    ],
    faq: [
      { q: 'Do you clean commercial offices?', a: 'We specialize in small offices and studios comparable in size and layout to a home. For large commercial spaces, we recommend a commercial cleaning service.' },
      { q: 'Can you clean after hours?', a: 'Yes — let us know your preferred timing in the booking notes and we\'ll do our best to accommodate.' },
      { q: 'What does office cleaning include?', a: 'Vacuuming, mopping, surface disinfecting, bathroom cleaning, kitchen/break room cleaning, and trash removal.' },
      { q: 'Do you bring your own supplies?', a: 'Yes — we bring all cleaning supplies and equipment. Just leave the space accessible.' },
    ],
    cta: { headline: 'Your team deserves a crisp office.', sub: 'Small office and studio cleaning in Salt Lake City. Flat-rate pricing, flexible scheduling.', button: 'Book Office Cleaning →' },
    schema: 'Service',
  },
]

export function getServicePage(slug: string): ServicePage | undefined {
  return SERVICE_PAGES.find(p => p.slug === slug)
}

export const SERVICE_SLUGS = SERVICE_PAGES.map(p => p.slug)
