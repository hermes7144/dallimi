import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import AuthContext from '@/context/AuthContext'
import SWRConfigContext from '@/context/SWRConfigContext'
import ClientInitializer from '@/components/ClientInitializer'
import { useFCM } from '@/hooks/useFCM'

const openSans = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}



export default function RootLayout({ children }: { children: React.ReactNode }) {
  useFCM(); // FCM 메시지 리스너 활성화

  return (
    <html lang="en" className={openSans.className}>
      <body className='w-full max-w-screen-xl overflow-auto mx-auto'>
       <AuthContext>
        <header className='sticky top-0 bg-white z-1p border-b'>
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
