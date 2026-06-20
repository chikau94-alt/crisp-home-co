import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog'
import { NEIGHBORHOOD_SLUGS } from '@/lib/neighborhoods'
import { SERVICE_SLUGS } from '@/lib/services'

const BASE = 'https://crisphomeco.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const static_pages = [
    { url: BASE,         priority: 1.0,  changeFrequency: 'weekly'  as const },
    { url: `${BASE}/book`,  priority: 0.9,  changeFrequency: 'monthly' as const },
    { url: `${BASE}/blog`,  priority: 0.8,  changeFrequency: 'weekly'  as const },
    { url: `${BASE}/refer`, priority: 0.6,  changeFrequency: 'monthly' as const },
  ]

  const blog_pages = BLOG_POSTS.map(post => ({
    url:             `${BASE}/blog/${post.slug}`,
    lastModified:    new Date(post.publishedAt),
    priority:        0.7,
    changeFrequency: 'monthly' as const,
  }))

  const neighborhood_pages = NEIGHBORHOOD_SLUGS.map(slug => ({
    url:             `${BASE}/${slug}`,
    priority:        0.8,
    changeFrequency: 'monthly' as const,
  }))

  const service_pages = SERVICE_SLUGS.map(slug => ({
    url:             `${BASE}/${slug}`,
    priority:        0.9,
    changeFrequency: 'monthly' as const,
  }))

  return [...static_pages, ...service_pages, ...blog_pages, ...neighborhood_pages]
}
