import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-cream font-[family-name:var(--font-body)]">
      <Nav />
      <Hero />
      <PromiseStrip />
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
      <Link
        href="#book"
        className="text-sm text-sage-soft hover:text-white transition-colors duration-200"
      >
        Get a quote
      </Link>
    </header>
  );
}

function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-6 py-32 md:py-44 min-h-[90vh] md:min-h-[80vh]"
      style={{
        background: "linear-gradient(160deg, #1a2b4a 0%, #11203b 100%)",
      }}
    >
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
          <Link
            href="#book"
            className="inline-flex items-center justify-center bg-sage text-navy font-semibold text-base px-8 py-4 rounded-md shadow-md hover:bg-sage-soft transition-colors duration-200 min-h-[52px]"
          >
            See instant pricing
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center border border-white/25 text-white/80 hover:text-white hover:border-white/50 text-base px-8 py-4 rounded-md transition-colors duration-200 min-h-[52px]"
          >
            How it works
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

function BookingSection() {
  return (
    <section id="book" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
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

        {/* Placeholder card — booking form goes here */}
        <div className="bg-white rounded-xl border border-cream-deep shadow-sm overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center gap-4 min-h-[280px]">
            <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-sage">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <p className="font-[family-name:var(--font-display)] text-navy text-xl">
              Booking form coming soon
            </p>
            <p className="text-ink-soft text-sm max-w-sm leading-relaxed">
              The 5-step booking flow will live here.
              <br />
              Size → Frequency → Add-ons → Schedule → Details.
            </p>
          </div>
        </div>
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
