import Link from "next/link";
import Image from "next/image";
import BookingFlow from "@/app/book/BookingFlow";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-cream font-[family-name:var(--font-body)]">
      <Nav />
      <Hero />
      <PromiseStrip />
      <PhotoGrid />
      <BookingSection />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 px-6 py-5 flex items-center justify-between">
      <span className="font-[family-name:var(--font-display)] text-white text-xl tracking-tight">
        Crisp Home Co.
      </span>
      <a
        href="#book"
        className="text-sm text-sage-soft hover:text-white transition-colors duration-200"
      >
        Get a quote
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-6 py-32 md:py-44 min-h-[90vh] md:min-h-[80vh] overflow-hidden"
    >
      {/* Background photo */}
      <Image
        src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80&auto=format&fit=crop"
        alt="Spotlessly clean modern kitchen"
        fill
        className="object-cover object-center"
        priority
        unoptimized
      />
      {/* Dark navy overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, rgba(26,43,74,0.93) 0%, rgba(17,32,59,0.90) 100%)" }}
        aria-hidden
      />
      {/* Subtle dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #b8c4a8 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
        <p className="text-sage-soft text-sm md:text-base tracking-[0.2em] uppercase font-[family-name:var(--font-body)]">
          Salt Lake City, Utah
        </p>

        <h1 className="font-[family-name:var(--font-display)] text-white text-5xl md:text-7xl leading-[1.08] tracking-tight">
          Your home,{" "}
          <em className="not-italic text-sage-soft">perfectly crisp.</em>
        </h1>

        <p className="text-sage-soft/80 text-lg md:text-xl leading-relaxed max-w-lg">
          Flat-rate residential cleaning with instant transparent pricing. Book
          in under two minutes — no callbacks, no quotes, no surprises.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
          <a
            href="#book"
            className="inline-flex items-center justify-center bg-sage text-navy font-semibold text-base px-8 py-4 rounded-md shadow-md hover:bg-sage-soft transition-colors duration-200 min-h-[52px]"
          >
            See instant pricing
          </a>
          <Link
            href="/quote"
            className="inline-flex items-center justify-center border border-white/25 text-white/80 hover:text-white hover:border-white/50 text-base px-8 py-4 rounded-md transition-colors duration-200 min-h-[52px]"
          >
            Get a free quote
          </Link>
        </div>

        <p className="text-mist text-sm mt-1">
          <em className="font-[family-name:var(--font-display)] italic text-sage-soft/70">
            &ldquo;Come home to crisp.&rdquo;
          </em>
        </p>
      </div>

      {/* Bottom fade into cream */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #f3f5f2)",
        }}
        aria-hidden
      />
    </section>
  );
}

const promises = [
  {
    heading: "On-time, every time",
    body: "We show up in your chosen 2-hour window — or we make it right.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    heading: "Flat-rate pricing",
    body: "Your price is locked the moment you book. No hourly billing, no hidden fees.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    heading: "Re-clean guarantee",
    body: "Not satisfied? We come back within 48 hours and re-clean at no charge.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

function PromiseStrip() {
  return (
    <section className="bg-cream-deep/60 border-y border-cream-deep py-10 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {promises.map((p) => (
          <div
            key={p.heading}
            className="flex flex-col items-center text-center gap-3"
          >
            <div className="text-sage">{p.icon}</div>
            <h3 className="font-[family-name:var(--font-display)] text-navy text-lg font-semibold">
              {p.heading}
            </h3>
            <p className="text-ink-soft text-sm leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const photos = [
  {
    src: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80&auto=format&fit=crop",
    alt: "Bright, spotless living room with white sofa",
    label: "Living areas",
  },
  {
    src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80&auto=format&fit=crop",
    alt: "Gleaming white bathroom with fresh towels",
    label: "Bathrooms",
  },
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop",
    alt: "Clean modern kitchen with polished counters",
    label: "Kitchens",
  },
  {
    src: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80&auto=format&fit=crop",
    alt: "Neatly made bed in a bright, tidy bedroom",
    label: "Bedrooms",
  },
]

function PhotoGrid() {
  return (
    <section className="bg-cream py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sage text-xs uppercase tracking-widest font-semibold mb-3">Results</p>
          <h2 className="font-[family-name:var(--font-display)] text-navy text-3xl md:text-4xl leading-tight">
            What crisp looks like.
          </h2>
          <p className="text-ink-soft mt-3 text-base max-w-md mx-auto">
            Every room. Every surface. Every visit.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {photos.map((p) => (
            <div key={p.label} className="group relative aspect-[3/4] rounded-lg overflow-hidden">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-xs font-medium tracking-wide">
                {p.label}
              </span>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="#book"
            className="inline-flex items-center gap-2 text-sage text-sm font-medium hover:text-sage-soft transition-colors"
          >
            Book your first clean →
          </a>
        </div>
      </div>
    </section>
  )
}

function BookingSection() {
  return (
    <section id="book" className="py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sage text-sm tracking-[0.18em] uppercase font-semibold mb-3">
            Transparent pricing
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-navy text-4xl md:text-5xl leading-tight tracking-tight">
            Instant Pricing
          </h2>
          <p className="text-ink-soft mt-4 text-lg max-w-xl mx-auto leading-relaxed">
            Tell us about your home and get your exact price in seconds — no
            email, no phone call required.
          </p>
        </div>

        <BookingFlow />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="mt-auto px-6 py-12 text-center"
      style={{ background: "#11203b" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-5">
        <span className="font-[family-name:var(--font-display)] text-white text-2xl tracking-tight">
          Crisp Home Co.
        </span>
        <p className="font-[family-name:var(--font-display)] italic text-sage-soft/70 text-sm">
          &ldquo;Come home to crisp.&rdquo;
        </p>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-mist text-sm">
          <span>Salt Lake City, Utah</span>
          <span className="hidden sm:inline text-mist/40">·</span>
          <a
            href="mailto:hello@crisphomeco.com"
            className="hover:text-sage-soft transition-colors duration-200"
          >
            hello@crisphomeco.com
          </a>
        </div>
        <p className="text-mist/40 text-xs mt-2">
          © {new Date().getFullYear()} Crisp Home Co. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
