/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://runal.vercel.app/',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 1,
  exclude: [],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [],
      },
    ],
  },
};