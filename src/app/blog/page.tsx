import type { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS, getBlogCategories } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Home Cleaning Blog — Salt Lake City | Crisp Home Co.',
  description: 'Tips, guides, and pricing info for Salt Lake City homeowners. Learn how to find a great cleaner, what things cost, and how to keep your home consistently crisp.',
}

export default function BlogIndexPage() {
  const categories = getBlogCategories()

  return (
    <div className="min-h-screen bg-cream font-[family-name:var(--font-body)]">

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a2b4a 0%, #11203b 100%)' }}
           className="px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="font-[family-name:var(--font-display)] text-white text-lg mb-8 block">
            Crisp Home Co.
          </Link>
          <h1 className="font-[family-name:var(--font-display)] text-white text-4xl md:text-5xl leading-tight mb-4">
            Home Cleaning Guides
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Tips, pricing, and guides for Salt Lake City homeowners.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">

        {categories.map(category => {
          const posts = BLOG_POSTS.filter(p => p.category === category)
          return (
            <div key={category} className="mb-12">
              <h2 className="text-xs uppercase tracking-widest text-mist font-medium mb-6 pb-3 border-b border-cream-deep">
                {category}
              </h2>
              <div className="flex flex-col gap-6">
                {posts.map(post => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-1"
                  >
                    <h3 className="font-[family-name:var(--font-display)] text-navy text-xl leading-snug group-hover:text-sage transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-ink-soft text-sm leading-relaxed">{post.description}</p>
                    <p className="text-mist text-xs mt-1">{post.readTime} min read</p>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="border-t border-cream-deep">
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <p className="font-[family-name:var(--font-display)] text-navy text-2xl mb-2">Ready to book?</p>
          <p className="text-ink-soft text-sm mb-6">Flat-rate pricing. Same-week availability. Come home to crisp.</p>
          <Link
            href="/book"
            className="inline-block px-8 py-3 rounded-md bg-sage text-navy font-semibold text-sm hover:bg-sage-soft transition-colors"
          >
            See My Price →
          </Link>
        </div>
      </div>
    </div>
  )
}
