import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import AuthContext from '@/context/AuthContext'
import SWRConfigContext from '@/context/SWRConfigContext'
import ClientInitializer from '@/components/ClientInitializer'

const openSans = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "러닝알리미 - 러닝 대회 일정 알림 & 준비 도우미",
  description: "러닝 대회 일정을 놓치지 마세요! 맞춤 알림과 체계적인 준비로 완벽한 레이스를 만들어 보세요.",
  keywords: "러닝, 마라톤, 대회 일정, 실시간 알림, 트레이닝, 기록 관리, 러닝알리미",
  icons: {
    icon: "/favicon.ico"
  },
  openGraph: {
    siteName: "러닝알리미", // 구글 사이트 이름
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" className={openSans.className}>
      <body className='w-full max-w-screen-xl overflow-auto mx-auto'>
        <AuthContext>
          <header className='sticky top-0 bg-white z-10 border-b'>
            <Navbar />
          </header>
          <main>
            <SWRConfigContext>{children}</SWRConfigContext>
          </main>
          <ClientInitializer />
        </AuthContext>
      </body>
    </html>
  )
}