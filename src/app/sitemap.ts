import type { MetadataRoute } from 'next'
import { getMarathons } from '@/service/marathon'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runal.vercel.app'

  const marathons = await getMarathons()

  const marathonPages: MetadataRoute.Sitemap  = marathons.map((marathon) => ({
    url: `${baseUrl}/marathon/${marathon.id}`,
    lastModified: new Date(), // 적절한 날짜 필드 사용
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/marathon`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  return [...staticPages, ...marathonPages]
}
