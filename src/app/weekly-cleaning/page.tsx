import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getServicePage } from '@/lib/services'
import ServiceLandingPage from '@/components/ServiceLandingPage'

const PAGE = getServicePage('weekly-cleaning')!

export const metadata: Metadata = {
  title:       PAGE.seoTitle,
  description: PAGE.seoDescription,
  openGraph: {
    title:       PAGE.seoTitle,
    description: PAGE.seoDescription,
    url:         'https://crisphomeco.com/weekly-cleaning',
  },
}

export default function Page() {
  if (!PAGE) notFound()
  return <ServiceLandingPage page={PAGE} />
}
