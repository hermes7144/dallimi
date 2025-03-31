/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    domains: ['cdn.sanity.io']
  },
  env: {
    SITE_NAME: "러닝알리미 - 최고의 학습 도우미",
  },
}

module.exports = nextConfig