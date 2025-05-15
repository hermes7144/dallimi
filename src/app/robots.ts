import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runal.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/lib',
    },
    // 사이트맵 위치
    sitemap: `${baseUrl}/sitemap.xml`,
    // 표준 호스트 선언
    host: baseUrl,
  }
}