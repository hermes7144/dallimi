'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import SearchIcon from './ui/icons/SearchIcon';
import SearchFillIcon from './ui/icons/SearchFillIcon';
import ColorButton from './ui/ColorButton';
import UserMenu from './UserMenu';

export default function Navbar() {
  const pathName = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className='navbar bg-base-100 px-4'>
      <div className='navbar-start'>
        <Link href='/' className='text-2xl font-bold'>
          RUNAL
        </Link>
      </div>
      <div className='navbar-center hidden md:flex'>
        <ul className='menu menu-horizontal px-1'>
          <li className={`${ pathName === '/marathon' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-black'}`}>
            <Link href='/marathon'>마라톤</Link>
          </li>
        </ul>
      </div>
      <div className='navbar-end flex items-center gap-4'>
        <Link href='/search' className='hidden md:flex'>
          {pathName === '/search' ? <SearchFillIcon /> : <SearchIcon />}
        </Link>
        {user ? <UserMenu /> : <ColorButton text='Sign in' onClick={() => signIn()} />}
      </div>
    </div>
  );
}
