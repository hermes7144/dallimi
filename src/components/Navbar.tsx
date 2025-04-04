'use client'

import Link from 'next/link';
import HomeIcon from './ui/icons/HomeIcon';
import HomeFillIcon from './ui/icons/HomeFillIcon';
import { usePathname } from 'next/navigation';
import MarathonIcon from './ui/icons/MarathonIcon';
import MarathonFillIcon from './ui/icons/MarathonFillIcon';
import ColorButton from './ui/ColorButton';
import { useSession, signIn, signOut } from 'next-auth/react';
import SearchIcon from './ui/icons/SearchIcon';
import SearchFillIcon from './ui/icons/SearchFillIcon';
import UserMenu from './UserMenu';

const menu = [
  { href: '/', icon: <HomeIcon />, clickedIcon: <HomeFillIcon /> },
  { href: '/marathon', icon: <MarathonIcon />, clickedIcon: <MarathonFillIcon /> },
  { href: '/search', icon: <SearchIcon />, clickedIcon: <SearchFillIcon /> }
]

export default function Navbar() {
  const pathName = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return <div className='flex justify-between items-center px-6'>
    <Link href='/'>
      <h1 className='text-3xl font-bold'>RUNAL</h1>
      {/* <img src="/logo.png" alt="" /> */}
    </Link>
    <nav>
      <ul className='flex gap-4 items-center p-4'>
        {menu.map(item => (
          <li key={item.href}>
          <Link href={item.href}>
            {pathName === item.href ? item.clickedIcon : item.icon}
          </Link>
        </li>))}
        {user && 
          <li>
            <UserMenu />
          </li>
        }
        {!user && <ColorButton text='Sign in' onClick={() => signIn()}/> }
      </ul>
    </nav>
  </div>
}




