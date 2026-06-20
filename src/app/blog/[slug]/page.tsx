import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getBlogPost, BLOG_POSTS } from '@/lib/blog'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return {
    title:       post.seoTitle,
    description: post.description,
    openGraph: {
      title:       post.seoTitle,
      description: post.description,
      type:        'article',
      publishedTime: post.publishedAt,
    },
  }
}

// Render markdown-ish content (headers, tables, lists, links, bold)
function renderContent(content: string): string {
  return content
    .trim()
    // Tables
    .replace(/^\|(.+)\|$/gm, (_, row) => {
      const cells = row.split('|').map((c: string) => c.trim())
      const isHeader = false
      return `<tr>${cells.map((c: string) => `<td class="px-4 py-2 text-sm border border-cream-deep text-ink">${c}</td>`).join('')}</tr>`
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, match => {
      const rows = match.trim().split('\n')
      const header = rows[0]
      const divider = rows[1]
      const body = rows.slice(2)
      if (divider && /^[\|\-\s]+$/.test(divider)) {
        const headerRow = header.replace(/td class="px-4 py-2 text-sm border border-cream-deep text-ink"/g, 'th class="px-4 py-2 text-xs uppercase tracking-wide text-mist font-medium border border-cream-deep bg-cream text-left"')
        return `<div class="overflow-x-auto mb-6"><table class="w-full border-collapse border border-cream-deep rounded-lg overflow-hidden"><thead>${headerRow}</thead><tbody>${body.join('\n')}</tbody></table></div>`
      }
      return `<div class="overflow-x-auto mb-6"><table class="w-full border-collapse border border-cream-deep rounded-lg overflow-hidden"><tbody>${match}</tbody></table></div>`
    })
    // H2
    .replace(/^## (.+)$/gm, '<h2 class="font-[family-name:var(--font-display)] text-navy text-2xl mt-10 mb-4">$1</h2>')
    // H3
    .replace(/^### (.+)$/gm, '<h3 class="font-[family-name:var(--font-display)] text-navy text-lg mt-6 mb-2">$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-ink font-semibold">$1</strong>')
    // Inline links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-sage hover:text-sage-soft underline underline-offset-2 transition-colors">$1</a>')
    // Unordered list items
    .replace(/^- (.+)$/gm, '<li class="text-ink-soft text-sm leading-relaxed">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/gs, match => `<ul class="list-disc list-outside pl-5 mb-4 flex flex-col gap-1">${match}</ul>`)
    // Paragraphs (non-empty lines not already wrapped)
    .replace(/^(?!<|##|###|\s*$)(.+)$/gm, '<p class="text-ink-soft text-base leading-relaxed mb-4">$1</p>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="border-cream-deep my-8">')
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-cream font-[family-name:var(--font-body)]">

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a2b4a 0%, #11203b 100%)' }}
           className="px-6 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="font-[family-name:var(--font-display)] text-white/70 hover:text-white transition-colors text-sm">
              Crisp Home Co.
            </Link>
            <span className="text-white/30">/</span>
            <Link href="/blog" className="text-white/70 hover:text-white transition-colors text-sm">
              Blog
            </Link>
          </div>
          <p className="text-sage text-xs uppercase tracking-widest mb-3">{post.category}</p>
          <h1 className="font-[family-name:var(--font-display)] text-white text-3xl md:text-4xl leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-white/40 text-sm">{post.readTime} min read</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div
          className="prose-crisp"
          dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
        />
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-6 pb-8">
        <div className="bg-navy rounded-xl p-6 md:p-8 text-center">
          <p className="font-[family-name:var(--font-display)] text-white text-2xl mb-2">
            Come home to crisp.
          </p>
          <p className="text-white/50 text-sm mb-6">
            Flat-rate pricing. Vetted local cleaners. Same-week availability.
          </p>
          <Link
            href="/book"
            className="inline-block px-8 py-3 rounded-md bg-sage text-navy font-semibold text-sm hover:bg-sage-soft transition-colors"
          >
            See My Price →
          </Link>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-2xl mx-auto px-6 py-8 border-t border-cream-deep">
          <p className="text-xs uppercase tracking-widest text-mist mb-6">More guides</p>
          <div className="flex flex-col gap-4">
            {relatedPosts.map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col gap-1">
                <p className="font-[family-name:var(--font-display)] text-navy text-base group-hover:text-sage transition-colors">
                  {p.title}
                </p>
                <p className="text-mist text-xs">{p.readTime} min read</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
